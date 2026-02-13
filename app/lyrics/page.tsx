import type { Metadata } from 'next';
import { absoluteUrl, getBaseUrl, SITE_NAME } from '@/lib/site';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
    title: `Lyrics & Poetry | ${SITE_NAME}`,
    description: 'Upcoming lyrics and poetry archive for qawwali kalam, transliteration, and contextual notes.',
    metadataBase: new URL(baseUrl),
    alternates: {
        canonical: '/lyrics',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: absoluteUrl('/lyrics'),
        siteName: SITE_NAME,
        title: `Lyrics & Poetry | ${SITE_NAME}`,
        description: 'Upcoming lyrics and poetry archive for qawwali kalam, transliteration, and contextual notes.',
    },
};

export default function LyricsPage() {
    return (
        <div className="w-full heritage-surface heritage-paper">
            <section className="container-main py-16 md:py-24">
                <p className="section-kicker mb-4">In Development</p>
                <h1 className="text-4xl md:text-5xl heading-gold-accent text-slate-900">
                    Lyrics & Poetry Archive
                </h1>
                <p className="mt-6 max-w-3xl text-slate-600 text-base md:text-lg leading-relaxed">
                    This space is reserved for qawwali lyrics, poetic text, transliteration, and future annotations.
                    It is structured as a long-term editorial archive so each kalam can be studied alongside context.
                </p>
            </section>

            <section className="container-main pb-16 md:pb-20">
                <div className="rounded-lg border border-border-light bg-white p-7 md:p-9">
                    <p className="section-kicker mb-4">Planned Modules</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <article className="border border-border-light rounded-md p-5">
                            <h2 className="text-xl text-slate-900 mb-2">Kalam Text</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Original Urdu and Punjabi text with clean verse formatting.
                            </p>
                        </article>
                        <article className="border border-border-light rounded-md p-5">
                            <h2 className="text-xl text-slate-900 mb-2">Transliteration</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Roman transliteration for accessibility and international readers.
                            </p>
                        </article>
                        <article className="border border-border-light rounded-md p-5">
                            <h2 className="text-xl text-slate-900 mb-2">Context Notes</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Author, tradition, and thematic commentary for archival clarity.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    );
}
