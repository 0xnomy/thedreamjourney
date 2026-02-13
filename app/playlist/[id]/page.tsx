import { Metadata } from 'next';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import PlaylistStudio from '@/components/PlaylistStudio';
import { supabase } from '@/lib/supabase';
import { absoluteUrl, getBaseUrl, SITE_NAME } from '@/lib/site';
import { isValidYouTubeVideoId } from '@/lib/youtube';

interface Playlist {
    id: string;
    title: string;
    description: string | null;
}

interface Video {
    id: string;
    youtube_video_id: string;
    title: string;
    description: string | null;
    published_at: string;
    thumbnail: string | null;
}

interface ThumbnailOnly {
    thumbnail: string | null;
}

const baseUrl = getBaseUrl();

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;

    let playlist: Playlist | null = null;
    let ogImage = '/og-image.png';

    try {
        const { data } = await supabase
            .from('playlists')
            .select('id, title, description')
            .eq('id', id)
            .single();

        playlist = data;
    } catch (err) {
        console.error('Error fetching playlist metadata:', err);
    }

    if (playlist) {
        try {
            const { data } = await supabase
                .from('videos')
                .select('thumbnail')
                .eq('playlist_id', id)
                .order('published_at', { ascending: false })
                .limit(1)
                .single();

            const firstVideo = data as ThumbnailOnly | null;
            if (firstVideo?.thumbnail) {
                ogImage = firstVideo.thumbnail;
            }
        } catch (err) {
            console.error('Error fetching video thumbnail:', err);
        }
    }

    const title = playlist ? `${playlist.title} | ${SITE_NAME}` : SITE_NAME;
    const playlistDescription = playlist?.description || '';
    const description = playlist
        ? playlistDescription.substring(0, 150) + (playlistDescription.length > 150 ? '...' : '')
        : 'Explore classical music collections.';

    return {
        title,
        description,
        keywords: ['qawwali', 'classical music', playlist?.title || 'music'].filter(Boolean),
        authors: [{ name: '0xnomy' }],
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `/playlist/${id}`,
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: absoluteUrl(`/playlist/${id}`),
            siteName: SITE_NAME,
            title,
            description,
            images: [
                {
                    url: ogImage,
                    width: 1280,
                    height: 720,
                    alt: playlist?.title || SITE_NAME,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
            creator: '@0xnomy',
        },
    };
}

export default async function PlaylistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let playlist: Playlist | null = null;
    let videos: Video[] = [];
    let error: string | null = null;

    try {
        const { data, error: playlistError } = await supabase
            .from('playlists')
            .select('id, title, description')
            .eq('id', id)
            .single();

        if (playlistError) {
            error = playlistError.message;
        } else {
            playlist = data;
        }
    } catch (err) {
        console.error('Unexpected error fetching playlist:', err);
        error = 'Failed to fetch playlist.';
    }

    if (playlist) {
        try {
            const { data, error: videoError } = await supabase
                .from('videos')
                .select('id, youtube_video_id, title, description, published_at, thumbnail')
                .eq('playlist_id', id)
                .order('published_at', { ascending: false });

            if (videoError) {
                error = videoError.message;
            } else {
                videos = (data || []).filter((video) => isValidYouTubeVideoId(video.youtube_video_id));
            }
        } catch (err) {
            console.error('Unexpected error fetching videos:', err);
            error = 'Failed to fetch videos.';
        }
    }

    if (!playlist && !error) {
        return (
            <div className="w-full heritage-surface heritage-paper">
                <div className="container-main py-16 md:py-24">
                    <Link
                        href="/"
                        className="text-amber-900 hover:text-amber-700 transition-colors duration-200 inline-flex items-center mb-8"
                    >
                        Back to collections
                    </Link>
                    <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">Collection Not Found</h1>
                    <p className="text-slate-600 text-lg">The collection you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full heritage-surface heritage-paper">
            <div className="container-main py-8 md:py-12">
                <Link
                    href="/"
                    className="text-amber-900 hover:text-amber-700 transition-colors duration-200 inline-flex items-center mb-8"
                >
                    Back to collections
                </Link>
            </div>

            {error && (
                <div className="container-main mb-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
                        <p className="text-red-800 text-sm md:text-base">
                            <span className="font-semibold">Error:</span> {error}
                        </p>
                    </div>
                </div>
            )}

            {playlist && (
                <>
                    <section className="container-main pb-10 md:pb-12">
                        <p className="section-kicker mb-4">Collection</p>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-5 heading-gold-accent">
                            {playlist.title}
                        </h1>
                        {playlist.description && (
                            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mt-6">
                                {playlist.description}
                            </p>
                        )}
                    </section>

                    <section className="container-main pb-10 md:pb-12">
                        <div className="muted-divider" />
                    </section>

                    <section className="container-main pb-4">
                        <ShareButtons
                            title={`${playlist.title} - ${SITE_NAME}`}
                            url={absoluteUrl(`/playlist/${id}`)}
                        />
                    </section>

                    <PlaylistStudio
                        playlistTitle={playlist.title}
                        playlistDescription={playlist.description}
                        videos={videos}
                    />
                </>
            )}

            <div className="h-16 md:h-20" />
        </div>
    );
}
