import { Metadata } from 'next';
import { absoluteUrl, getBaseUrl, SITE_NAME } from '@/lib/site';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
    title: `Tribute | ${SITE_NAME}`,
    description: 'A tribute to The Dream Journey and its contribution to preserving musical heritage.',
    metadataBase: new URL(baseUrl),
    alternates: {
        canonical: '/tribute',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: absoluteUrl('/tribute'),
        siteName: SITE_NAME,
        title: `Tribute | ${SITE_NAME}`,
        description: 'A tribute to The Dream Journey and its contribution to preserving musical heritage.',
    },
    twitter: {
        card: 'summary',
        title: `Tribute | ${SITE_NAME}`,
        description: 'A tribute to The Dream Journey and its contribution to preserving musical heritage.',
        creator: '@0xnomy',
    },
};

export default function Tribute() {
    return (
        <div className="w-full heritage-surface heritage-paper">
            <section className="container-main py-16 md:py-24">
                <header className="max-w-3xl mb-10 md:mb-12">
                    <p className="text-xs tracking-[0.2em] uppercase text-amber-900/80 mb-5">Tribute</p>
                    <h1 className="text-4xl md:text-5xl text-slate-900 heading-gold-accent">
                        A Tribute to The Dream Journey
                    </h1>
                </header>

                <div className="ornamental-divider mb-10 md:mb-12" aria-hidden="true" />

                <div className="museum-copy space-y-7">
                    <p>
                        This page is my personal tribute to The Dream Journey. I built this archive as a gesture of
                        gratitude and respect for their extraordinary cultural work.
                    </p>

                    <p>
                        I want to thank Arif Ali Khan for starting The Dream Journey. Listening to the incredible
                        music that he and his team have curated has helped me through so much.
                    </p>

                    <p>
                        This archive is offered for the world to see their work, and to reflect my own love for what
                        they have preserved in qawwali, classical forms, and regional heritage.
                    </p>

                    <p>
                        I hope this platform helps more listeners discover the depth of their impact and keeps this
                        musical memory accessible for future generations.
                    </p>

                    <p className="text-slate-700">
                        The Dream Journey - Discovering musicians across Pakistan (A Non Profit Project)
                    </p>

                    <p className="text-sm text-slate-500">
                        Built by{' '}
                        <a
                            href="https://github.com/0xnomy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-900 hover:text-amber-700"
                        >
                            github.com/0xnomy
                        </a>
                        .
                    </p>
                </div>

                <div className="mt-12 md:mt-14">
                    <div className="h-px bg-amber-900/25" aria-hidden="true" />
                    <div className="ornamental-divider" aria-hidden="true" />
                    <div className="h-px bg-amber-900/25" aria-hidden="true" />
                </div>
            </section>

            <div className="h-16 md:h-20" />
        </div>
    );
}
