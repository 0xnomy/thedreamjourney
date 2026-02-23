import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generateCuratorNote } from '../lib/groq';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ override: false });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_OAUTH_ACCESS_TOKEN = process.env.YOUTUBE_OAUTH_ACCESS_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EXTRA_PLAYLIST_IDS = (process.env.EXTRA_PLAYLIST_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
const START_FROM_INDEX = Number(process.env.START_FROM_INDEX || '0');
const GROQ_NOTE_DELAY_MS = Number(process.env.GROQ_NOTE_DELAY_MS || '2500');
const GROQ_NOTES_ENABLED = Boolean(process.env.GROQ_API_KEY);

if ((!YOUTUBE_API_KEY && !YOUTUBE_OAUTH_ACCESS_TOKEN) || !CHANNEL_ID || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables');
    process.exit(1);
}

// Initialize clients
const youtube = google.youtube({
    version: 'v3',
    auth: YOUTUBE_OAUTH_ACCESS_TOKEN || YOUTUBE_API_KEY,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface Playlist {
    youtube_playlist_id: string;
    title: string;
    description: string;
}

interface Video {
    youtube_video_id: string;
    playlist_id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    published_at: string;
}

async function fetchAllPlaylists(channelId: string): Promise<Playlist[]> {
    const playlists: Playlist[] = [];
    let nextPageToken: string | undefined;

    do {
        try {
            const response = await youtube.playlists.list({
                part: ['snippet'],
                ...(YOUTUBE_OAUTH_ACCESS_TOKEN ? { mine: true } : { channelId }),
                maxResults: 50,
                pageToken: nextPageToken,
            });

            if (response.data.items) {
                for (const item of response.data.items) {
                    if (!item.id) continue;
                    playlists.push({
                        youtube_playlist_id: item.id,
                        title: item.snippet?.title || '',
                        description: item.snippet?.description || '',
                    });
                }
            }

            nextPageToken = response.data.nextPageToken || undefined;
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    } while (nextPageToken);

    return playlists;
}

async function fetchPlaylistsByIds(playlistIds: string[]): Promise<Playlist[]> {
    if (playlistIds.length === 0) return [];

    const playlists: Playlist[] = [];

    for (let i = 0; i < playlistIds.length; i += 50) {
        const chunk = playlistIds.slice(i, i + 50);

        try {
            const response = await youtube.playlists.list({
                part: ['snippet'],
                id: chunk,
                maxResults: 50,
            });

            if (response.data.items) {
                for (const item of response.data.items) {
                    if (!item.id) continue;
                    playlists.push({
                        youtube_playlist_id: item.id,
                        title: item.snippet?.title || '',
                        description: item.snippet?.description || '',
                    });
                }
            }
        } catch (error) {
            console.error(`Error fetching explicit playlist IDs [${chunk.join(', ')}]:`, error);
            throw error;
        }
    }

    return playlists;
}

async function fetchPlaylistVideos(playlistId: string): Promise<Omit<Video, 'playlist_id'>[]> {
    const videos: Omit<Video, 'playlist_id'>[] = [];
    let nextPageToken: string | undefined;

    do {
        try {
            const response = await youtube.playlistItems.list({
                part: ['snippet'],
                playlistId,
                maxResults: 50,
                pageToken: nextPageToken,
            });

            if (response.data.items) {
                for (const item of response.data.items) {
                    const snippet = item.snippet;
                    const videoId = snippet?.resourceId?.videoId;

                    // Skip unavailable/deleted/private items that do not expose a valid video ID.
                    if (!videoId) {
                        continue;
                    }

                    videos.push({
                        youtube_video_id: videoId,
                        title: snippet?.title || '',
                        description: snippet?.description || '',
                        thumbnail: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url || null,
                        published_at: snippet?.publishedAt || new Date().toISOString(),
                    });
                }
            }

            nextPageToken = response.data.nextPageToken || undefined;
        } catch (error) {
            console.error(`Error fetching videos for playlist ${playlistId}:`, error);
            throw error;
        }
    } while (nextPageToken);

    return videos;
}

async function upsertPlaylist(playlist: Playlist): Promise<string> {
    try {
        const { data, error } = await supabase
            .from('playlists')
            .upsert(
                {
                    youtube_playlist_id: playlist.youtube_playlist_id,
                    title: playlist.title,
                    description: playlist.description,
                },
                {
                    onConflict: 'youtube_playlist_id',
                }
            )
            .select('id')
            .single();

        if (error) throw error;
        return String(data.id);
    } catch (error) {
        console.error(`Error upserting playlist ${playlist.title}:`, error);
        throw error;
    }
}

async function upsertVideos(videos: Video[]): Promise<number> {
    if (videos.length === 0) return 0;

    try {
        const { error } = await supabase
            .from('videos')
            .upsert(
                videos.map(video => ({
                    youtube_video_id: video.youtube_video_id,
                    playlist_id: video.playlist_id,
                    title: video.title,
                    description: video.description,
                    thumbnail: video.thumbnail,
                    published_at: video.published_at,
                })),
                {
                    onConflict: 'youtube_video_id,playlist_id',
                }
            );

        if (error) throw error;
        return videos.length;
    } catch (error) {
        console.error('Error upserting videos:', error);
        throw error;
    }
}

async function updateCuratorNoteForPlaylist(
    playlistId: string,
    playlist: Playlist,
    videoData: Omit<Video, 'playlist_id'>[],
): Promise<void> {
    if (!GROQ_NOTES_ENABLED) {
        return;
    }

    if (videoData.length === 0) {
        return;
    }

    try {
        const note = await generateCuratorNote(
            playlistId,
            playlist.title,
            playlist.description,
            videoData.map((video) => ({
                title: video.title,
                description: video.description,
            })),
        );

        if (!note) {
            console.warn('  Curator note skipped: empty response from Groq');
            return;
        }

        const { error } = await supabase
            .from('playlists')
            .update({ curator_note: note })
            .eq('id', playlistId);

        if (error) {
            throw error;
        }

        console.log('  Curator note updated');
        if (GROQ_NOTE_DELAY_MS > 0) {
            await sleep(GROQ_NOTE_DELAY_MS);
        }
    } catch (error) {
        console.error('  Failed to update curator note:', error);
    }
}

async function syncYouTubeData() {
    console.log('Starting YouTube sync...');
    console.log(`Channel ID: ${CHANNEL_ID}`);

    try {
        // Fetch all playlists
        console.log('\nFetching playlists...');
        const channelPlaylists = await fetchAllPlaylists(CHANNEL_ID!);
        const explicitPlaylists = await fetchPlaylistsByIds(EXTRA_PLAYLIST_IDS);

        const playlistMap = new Map<string, Playlist>();
        for (const playlist of channelPlaylists) {
            playlistMap.set(playlist.youtube_playlist_id, playlist);
        }

        for (const playlist of explicitPlaylists) {
            playlistMap.set(playlist.youtube_playlist_id, playlist);
        }

        const playlists = Array.from(playlistMap.values());

        console.log(`Fetched ${channelPlaylists.length} channel playlists`);
        if (EXTRA_PLAYLIST_IDS.length > 0) {
            console.log(`Added ${explicitPlaylists.length} playlists from EXTRA_PLAYLIST_IDS`);
        }
        console.log(`Total unique playlists to sync: ${playlists.length}`);

        let totalVideos = 0;
        let successCount = 0;
        const failedPlaylists: Array<{ index: number; title: string; id: string; reason: string }> = [];

        // Process each playlist
        for (let i = 0; i < playlists.length; i++) {
            if (i < START_FROM_INDEX) {
                continue;
            }

            const playlist = playlists[i];
            console.log(`\n[${i + 1}/${playlists.length}] Syncing playlist: ${playlist.title}`);

            try {
                // Upsert playlist
                const playlistId = await upsertPlaylist(playlist);
                console.log(`  Playlist upserted (DB ID: ${playlistId})`);

                // Fetch videos for this playlist
                console.log('  Fetching videos...');
                const videoData = await fetchPlaylistVideos(playlist.youtube_playlist_id);
                console.log(`  Fetched ${videoData.length} videos`);

                // Add playlist_id to videos
                const videos: Video[] = videoData.map(video => ({
                    ...video,
                    playlist_id: playlistId,
                }));

                // Upsert videos
                if (videos.length > 0) {
                    const upsertedCount = await upsertVideos(videos);
                    console.log(`  Inserted/Updated ${upsertedCount} videos`);
                    totalVideos += upsertedCount;
                }

                await updateCuratorNoteForPlaylist(playlistId, playlist, videoData);

                successCount += 1;
            } catch (error) {
                const reason = error instanceof Error ? error.message : JSON.stringify(error);
                failedPlaylists.push({
                    index: i + 1,
                    title: playlist.title,
                    id: playlist.youtube_playlist_id,
                    reason,
                });
                console.error(`  Skipped due to error: ${reason}`);
            }
        }

        console.log('\n=================================');
        console.log('Sync completed successfully!');
        console.log(`Playlists attempted: ${Math.max(playlists.length - START_FROM_INDEX, 0)}`);
        console.log(`Playlists synced successfully: ${successCount}`);
        console.log(`Total videos synced: ${totalVideos}`);
        if (failedPlaylists.length > 0) {
            console.log(`Failed playlists: ${failedPlaylists.length}`);
            for (const failed of failedPlaylists) {
                console.log(
                    `  [${failed.index}] ${failed.title} (${failed.id}) => ${failed.reason}`
                );
            }
        }
        console.log('=================================');
    } catch (error) {
        console.error('\nSync failed:', error);
        process.exit(1);
    }
}

// Run the sync
syncYouTubeData();
