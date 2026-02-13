import { Metadata } from 'next';
import { absoluteUrl, getBaseUrl, SITE_NAME } from '@/lib/site';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
    title: `About | ${SITE_NAME}`,
    description: 'About The Dream Journey and its work preserving Pakistani classical and Sufi music traditions.',
    metadataBase: new URL(baseUrl),
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: absoluteUrl('/about'),
        siteName: SITE_NAME,
        title: `About | ${SITE_NAME}`,
        description: 'About The Dream Journey and its work preserving Pakistani classical and Sufi music traditions.',
    },
    twitter: {
        card: 'summary',
        title: `About | ${SITE_NAME}`,
        description: 'About The Dream Journey and its work preserving Pakistani classical and Sufi music traditions.',
        creator: '@0xnomy',
    },
};

export default function About() {
    return (
        <div className="w-full heritage-surface heritage-paper">
            <section className="container-main py-16 md:py-24">
                <header className="max-w-3xl mb-10 md:mb-12">
                    <p className="text-xs tracking-[0.2em] uppercase text-amber-900/80 mb-5">About</p>
                    <h1 className="text-4xl md:text-5xl text-slate-900 heading-gold-accent">
                        The Dream Journey
                    </h1>
                </header>

                <div className="ornamental-divider mb-10 md:mb-12" aria-hidden="true" />

                <div className="museum-copy space-y-7">
                    <p>
                        The Dream Journey stands as a careful and deeply considered cultural project. Its work reflects
                        disciplined documentation, clear artistic respect, and a sustained commitment to public memory.
                    </p>

                    <p>
                        By supporting visibility for performers and preserving context around their work, the project
                        has helped empower artists whose contributions often circulate through oral and performance-led
                        traditions rather than formal archives.
                    </p>

                    <p>
                        Its focus on Pakistani classical and Sufi music traditions gives lasting form to repertoires
                        that might otherwise remain scattered across generations. In this way, The Dream Journey offers
                        a structured record of qawwals, instrumentalists, and regional musical heritage.
                    </p>

                    <p>
                        The cultural impact is significant: listeners, students, and researchers gain a dependable
                        point of reference, while younger audiences encounter these traditions as living practice rather
                        than distant history.
                    </p>

                    <div className="pt-8 border-t border-amber-900/20">
                        <h2 className="text-2xl md:text-3xl text-slate-900 heading-gold-accent mb-5">
                            With Gratitude
                        </h2>
                        <p className="text-slate-700">
                            This archive is offered with appreciation for The Dream Journey&apos;s dedication, patience,
                            and long-term stewardship of a shared musical inheritance.
                        </p>
                    </div>
                </div>
            </section>

            <div className="h-16 md:h-20" />
        </div>
    );
}
