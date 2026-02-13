import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from 'next/link';
import NavLinks from '@/components/NavLinks';
import { absoluteUrl, getBaseUrl, SITE_NAME } from '@/lib/site';
import './globals.css';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    weight: ['400', '500', '600', '700'],
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
    title: `${SITE_NAME} | Classical Music Collection`,
    description:
        'Discover and explore a curated collection of classical Pakistani music, qawwali, and Sufi vocal traditions. Featuring legendary performances and artists preserved for music lovers worldwide.',
    keywords: ['qawwali', 'classical music', 'Pakistani music', 'Sufi music', 'vocal traditions'],
    authors: [{ name: '0xnomy' }],
    creator: '0xnomy',
    metadataBase: new URL(baseUrl),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: absoluteUrl('/'),
        siteName: SITE_NAME,
        title: `${SITE_NAME} | Classical Music Collection`,
        description: 'Discover and explore a curated collection of classical Pakistani music, qawwali, and Sufi vocal traditions.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} | Classical Music Collection`,
        description: 'Discover and explore a curated collection of classical Pakistani music, qawwali, and Sufi vocal traditions.',
        images: ['/og-image.png'],
        creator: '@0xnomy',
    },
    icons: {
        icon: [
            {
                url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%238b5e3c'/%3E%3Ctext x='32' y='41' text-anchor='middle' font-size='24' fill='%23faf8f3' font-family='serif'%3EDJ%3C/text%3E%3C/svg%3E",
                type: 'image/svg+xml',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
            <body className="bg-cream text-slate-900 font-sans flex flex-col min-h-screen">
                <nav className="sticky top-0 z-50 bg-cream border-b border-border-light backdrop-blur-sm bg-opacity-95">
                    <div className="container-main py-4 md:py-6 flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="text-2xl md:text-3xl font-serif font-bold text-amber-900 hover:text-amber-700 transition-colors duration-200"
                        >
                            {SITE_NAME}
                        </Link>

                        <NavLinks />
                    </div>
                </nav>

                <main className="flex-1 w-full">{children}</main>

                <footer className="bg-white border-t border-border-light mt-16 md:mt-20">
                    <div className="container-main py-12 md:py-16 text-center">
                        <p className="text-slate-600 text-sm md:text-base">
                            Made by{' '}
                            <a
                                href="https://github.com/0xnomy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-900 font-semibold hover:text-amber-700"
                            >
                                0xnomy
                            </a>{' '}
                            for the love of classic music.
                        </p>
                        <p className="text-xs md:text-sm text-slate-500 mt-4">
                            &copy; 2026 {SITE_NAME}. All rights reserved.
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
