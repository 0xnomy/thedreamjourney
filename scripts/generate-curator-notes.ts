import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generateCuratorNote } from '../lib/groq';

dotenv.config({ path: '.env.local' });
dotenv.config({ override: false });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const NOTE_DELAY_MS = Number(process.env.GROQ_NOTE_DELAY_MS || '2500');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase service credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface PlaylistRow {
    id: string;
    title: string;
    description: string | null;
    youtube_playlist_id: string;
}

interface VideoRow {
    playlist_id: string | number;
    title: string;
    description: string | null;
}

async function fetchPlaylists(): Promise<PlaylistRow[]> {
    const { data, error } = await supabase
        .from('playlists')
        .select('id, title, description, youtube_playlist_id')
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return (data || []) as PlaylistRow[];
}

async function fetchVideosMap(playlistIds: string[]): Promise<Map<string, VideoRow[]>> {
    if (playlistIds.length === 0) {
        return new Map();
    }

    const { data, error } = await supabase
        .from('videos')
        .select('playlist_id, title, description')
        .in('playlist_id', playlistIds);

    if (error) {
        throw error;
    }

    const videoMap = new Map<string, VideoRow[]>();
    (data || []).forEach((video) => {
        const key = String(video.playlist_id);
        const existing = videoMap.get(key);
        if (!existing) {
            videoMap.set(key, [video]);
        } else {
            existing.push(video);
        }
    });

    return videoMap;
}

async function updateCuratorNote(playlist: PlaylistRow, videos: VideoRow[]): Promise<boolean> {
    if (videos.length === 0) {
        console.warn(`  Skipping ${playlist.title} — no videos available`);
        return false;
    }

    const note = await generateCuratorNote(
        playlist.id,
        playlist.title,
        playlist.description || '',
        videos.map((video) => ({
            title: video.title,
            description: video.description || '',
        })),
    );

    if (!note) {
        console.warn(`  Groq returned an empty note for ${playlist.title}`);
        return false;
    }

    const { error } = await supabase
        .from('playlists')
        .update({ curator_note: note })
        .eq('id', playlist.id);

    if (error) {
        throw error;
    }

    console.log('  Curator note stored');
    if (NOTE_DELAY_MS > 0) {
        await sleep(NOTE_DELAY_MS);
    }
    return true;
}

async function main() {
    console.log('Starting curator note generation...');
    const playlists = await fetchPlaylists();
    const videoMap = await fetchVideosMap(playlists.map((playlist) => playlist.id));

    console.log(`Found ${playlists.length} playlists to process.`);
    let updatedCount = 0;

    for (let i = 0; i < playlists.length; i += 1) {
        const playlist = playlists[i];
        console.log(`\n[${i + 1}/${playlists.length}] ${playlist.title}`);
        const videos = videoMap.get(playlist.id) || [];

        try {
            const updated = await updateCuratorNote(playlist, videos);
            if (updated) {
                updatedCount += 1;
            }
        } catch (error) {
            console.error(`  Failed to generate note for ${playlist.title}`, error);
        }
    }

    console.log('\n=================================');
    console.log('Curator note generation complete');
    console.log(`Playlists processed: ${playlists.length}`);
    console.log(`Notes updated: ${updatedCount}`);
    console.log('=================================');
}

main().catch((error) => {
    console.error('Curator note generation failed:', error);
    process.exit(1);
});
