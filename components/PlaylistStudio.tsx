'use client';

import { useEffect, useMemo, useState } from 'react';
import { isValidYouTubeVideoId } from '@/lib/youtube';

interface VideoItem {
    id: string;
    youtube_video_id: string;
    title: string;
    description: string | null;
    published_at: string;
    thumbnail: string | null;
}

interface PlaylistStudioProps {
    playlistTitle: string;
    playlistDescription?: string;
    videos: VideoItem[];
}

type TimelineMode = 'newest' | 'oldest';

const glossary = [
    { term: 'Qawwali', definition: 'A devotional performance tradition with ensemble vocals and rhythmic build.' },
    { term: 'Raga', definition: 'A melodic framework that shapes improvisation, mood, and progression.' },
    { term: 'Ustad-Shagird', definition: 'Master-disciple lineage that transmits repertoire through direct teaching.' },
];

export default function PlaylistStudio({
    playlistTitle,
    playlistDescription,
    videos,
}: PlaylistStudioProps) {
    const [timelineMode, setTimelineMode] = useState<TimelineMode>('newest');
    const [activeIndex, setActiveIndex] = useState(0);

    const orderedVideos = useMemo(() => {
        const sorted = [...videos].sort((a, b) => {
            const aTime = new Date(a.published_at).getTime();
            const bTime = new Date(b.published_at).getTime();
            return timelineMode === 'newest' ? bTime - aTime : aTime - bTime;
        });
        return sorted.filter((video) => isValidYouTubeVideoId(video.youtube_video_id));
    }, [timelineMode, videos]);

    useEffect(() => {
        setActiveIndex(0);
    }, [timelineMode]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                setActiveIndex((prev) => Math.min(prev + 1, orderedVideos.length - 1));
            }

            if (event.key === 'ArrowLeft') {
                setActiveIndex((prev) => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [orderedVideos.length]);

    if (orderedVideos.length === 0) {
        return (
            <section className="container-main py-16 md:py-20 text-center">
                <p className="text-slate-600 text-lg">No videos in this collection.</p>
            </section>
        );
    }

    const activeVideo = orderedVideos[activeIndex];
    const activeDate = new Date(activeVideo.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <section className="container-main pb-12 md:pb-16">
            <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div>
                    <p className="section-kicker mb-3">Listen Mode</p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">
                        Curated Playback
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">Use left/right arrows to move through performances.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setTimelineMode('newest')}
                        className={`px-4 py-2 rounded border text-sm ${timelineMode === 'newest'
                            ? 'border-amber-900 bg-amber-900 text-cream'
                            : 'border-border-light bg-white text-slate-700'
                            }`}
                    >
                        Newest First
                    </button>
                    <button
                        type="button"
                        onClick={() => setTimelineMode('oldest')}
                        className={`px-4 py-2 rounded border text-sm ${timelineMode === 'oldest'
                            ? 'border-amber-900 bg-amber-900 text-cream'
                            : 'border-border-light bg-white text-slate-700'
                            }`}
                    >
                        Earliest First
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-7">
                    <div className="rounded-lg overflow-hidden border border-border-light bg-slate-900">
                        <iframe
                            className="w-full aspect-video"
                            src={`https://www.youtube.com/embed/${activeVideo.youtube_video_id}`}
                            title={activeVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="mt-5">
                        <div className="flex flex-col gap-3 mb-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">Published {activeDate}</p>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                                    className="px-3 py-2 rounded border border-border-light text-sm bg-white disabled:opacity-50"
                                    disabled={activeIndex === 0}
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex((prev) => Math.min(prev + 1, orderedVideos.length - 1))}
                                    className="px-3 py-2 rounded border border-border-light text-sm bg-white disabled:opacity-50"
                                    disabled={activeIndex === orderedVideos.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-slate-900 mb-3 break-words">
                            {activeVideo.title}
                        </h3>
                        {activeVideo.description && (
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                {activeVideo.description}
                            </p>
                        )}
                    </div>
                </div>

                <aside className="xl:col-span-5">
                    <div className="rounded-lg border border-border-light bg-white p-5 md:p-6 mb-6">
                        <p className="section-kicker mb-3">Curator Note</p>
                        <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                            {playlistDescription
                                ? playlistDescription
                                : `${playlistTitle} presents a focused route into repertoire, form, and performance practice.`}
                        </p>
                    </div>

                    <div className="rounded-lg border border-border-light bg-white p-5 md:p-6 mb-6">
                        <p className="section-kicker mb-3">Glossary</p>
                        <ul className="space-y-3">
                            {glossary.map((item) => (
                                <li key={item.term}>
                                    <p className="text-sm font-semibold text-slate-900">{item.term}</p>
                                    <p className="text-xs md:text-sm text-slate-600">{item.definition}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-lg border border-border-light bg-white p-2">
                        <ol className="max-h-[420px] md:max-h-[500px] overflow-y-auto divide-y divide-border-light">
                            {orderedVideos.map((video, index) => {
                                const published = new Date(video.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                });

                                const isActive = index === activeIndex;
                                return (
                                    <li key={video.id}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            className={`w-full text-left px-3 py-3 rounded-md ${isActive ? 'bg-amber-900/10' : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <p
                                                className={`text-sm font-semibold break-words ${isActive ? 'text-amber-900' : 'text-slate-900'}`}
                                            >
                                                {video.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{published}</p>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </aside>
            </div>
        </section>
    );
}
