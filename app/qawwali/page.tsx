import type { Metadata } from 'next';
import PlaylistsGrid from '@/components/PlaylistsGrid';
import { getArchiveCards } from '@/lib/archive-data';
import { absoluteUrl, getBaseUrl, SITE_NAME } from '@/lib/site';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
    title: `Qawwali Index | ${SITE_NAME}`,
    description: 'Browse all indexed qawwali collections in The Dream Journey Archive.',
    metadataBase: new URL(baseUrl),
    alternates: {
        canonical: '/qawwali',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: absoluteUrl('/qawwali'),
        siteName: SITE_NAME,
        title: `Qawwali Index | ${SITE_NAME}`,
        description: 'Browse all indexed qawwali collections in The Dream Journey Archive.',
    },
};

export default async function QawwaliPage() {
    let qawwaliCards = [];
    let error: string | null = null;

    try {
        const allCards = await getArchiveCards();
        qawwaliCards = allCards.filter((card) => card.tradition === 'Qawwali');
    } catch (err) {
        console.error('Failed to load qawwali index:', err);
        error = 'Failed to load qawwali collections.';
    }

    return (
        <div className="w-full heritage-surface heritage-paper">
            <section className="container-main py-16 md:py-24">
                <p className="section-kicker mb-4">Specialized Index</p>
                <h1 className="text-4xl md:text-5xl heading-gold-accent text-slate-900">
                    Qawwali Collection Index
                </h1>
                <p className="mt-6 max-w-3xl text-slate-600 text-base md:text-lg leading-relaxed">
                    A dedicated index of qawwali collections, curated for direct access to devotional repertoire,
                    ensemble traditions, and historically significant performances.
                </p>
            </section>

            {error && (
                <section className="container-main pb-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
                        <p className="text-red-800 text-sm md:text-base">
                            <span className="font-semibold">Error:</span> {error}
                        </p>
                    </div>
                </section>
            )}

            <section className="py-2 md:py-4">
                {qawwaliCards.length > 0 ? (
                    <PlaylistsGrid playlists={qawwaliCards} />
                ) : (
                    <div className="container-main text-center py-16">
                        <p className="text-slate-600 text-lg">No qawwali collections indexed yet.</p>
                    </div>
                )}
            </section>

            <div className="h-16 md:h-20" />
        </div>
    );
}
