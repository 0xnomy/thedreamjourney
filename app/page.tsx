import Link from 'next/link';
import { getArchiveCards } from '@/lib/archive-data';
import PlaylistsGrid from '@/components/PlaylistsGrid';

export default async function Home() {
    let playlistCards = [];
    let error: string | null = null;

    try {
        playlistCards = await getArchiveCards();
    } catch (err) {
        console.error('Unexpected error fetching homepage data:', err);
        error = 'Failed to load archive collections.';
    }

    const featured = playlistCards[0];

    return (
        <div className="w-full heritage-surface heritage-paper">
            <section className="container-main py-16 md:py-24 text-center">
                <p className="section-kicker mb-5">Digital Heritage Archive</p>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6">
                    Beyond a Channel. Built as Cultural Memory.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                    The platform is shaped for deep listening, cultural research, and long-term preservation of
                    Pakistani classical and Sufi traditions.
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    <Link href="/qawwali" className="btn btn-primary text-sm md:text-base">
                        Explore Qawwali Index
                    </Link>
                    <Link href="/lyrics" className="btn btn-secondary text-sm md:text-base">
                        Visit Lyrics Archive
                    </Link>
                </div>
            </section>

            <section className="container-main pb-10 md:pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    <article className="bg-white border border-border-light rounded-lg p-6">
                        <p className="section-kicker mb-3">Core Use Case</p>
                        <h2 className="text-2xl text-slate-900 mb-3">Research + Guided Listening</h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            Collections are organized as study-ready records with context, chronology, and repeatable navigation.
                        </p>
                    </article>
                    <article className="bg-white border border-border-light rounded-lg p-6">
                        <p className="section-kicker mb-3">Distinctive Value</p>
                        <h2 className="text-2xl text-slate-900 mb-3">Contextual Archive Layer</h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            Each collection combines metadata, curation, and structured discovery rather than plain playlist mirroring.
                        </p>
                    </article>
                    <article className="bg-white border border-border-light rounded-lg p-6">
                        <p className="section-kicker mb-3">Future-Ready</p>
                        <h2 className="text-2xl text-slate-900 mb-3">Lyrics + Poetry Expansion</h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            The archive now includes a dedicated lyrics route for qawwali poetry, translations, and annotations.
                        </p>
                    </article>
                </div>
            </section>

            {featured && (
                <section className="container-main pb-12 md:pb-14">
                    <div className="rounded-lg overflow-hidden border border-border-light bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-5">
                            <div className="lg:col-span-2">
                                {featured.coverImage ? (
                                    <img
                                        src={featured.coverImage}
                                        alt={featured.title}
                                        className="w-full h-full min-h-[260px] object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full min-h-[260px] bg-gradient-to-br from-amber-900/15 via-amber-700/10 to-slate-200/35" />
                                )}
                            </div>
                            <div className="lg:col-span-3 p-7 md:p-10">
                                <p className="section-kicker mb-4">Featured Collection</p>
                                <h2 className="text-3xl md:text-4xl text-slate-900 mb-4">{featured.title}</h2>
                                <p className="text-slate-600 leading-relaxed mb-5">{featured.curatorNote}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="chip">{featured.tradition}</span>
                                    <span className="chip">{featured.era}</span>
                                    <span className="chip">{featured.region}</span>
                                </div>
                                <Link
                                    href={`/playlist/${featured.id}`}
                                    className="inline-flex items-center gap-2 text-amber-900 font-semibold hover:text-amber-700"
                                >
                                    Enter this collection -&gt;
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="container-main pb-8 md:pb-10">
                <div className="muted-divider" />
            </section>

            <section className="py-2 md:py-4">
                {error && (
                    <div className="container-main">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-12 max-w-2xl mx-auto">
                            <p className="text-red-800 text-sm md:text-base">
                                <span className="font-semibold">Error:</span> {error}
                            </p>
                        </div>
                    </div>
                )}

                {playlistCards.length > 0 ? (
                    <PlaylistsGrid playlists={playlistCards} />
                ) : (
                    <div className="container-main text-center py-16">
                        <p className="text-slate-600 text-lg">No collections found.</p>
                    </div>
                )}
            </section>

            <div className="h-16 md:h-20" />
        </div>
    );
}
