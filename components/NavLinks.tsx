'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/', label: 'Home' },
    { href: '/qawwali', label: 'Qawwali' },
    { href: '/lyrics', label: 'Lyrics' },
    { href: '/about', label: 'About' },
    { href: '/tribute', label: 'Tribute' },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 sm:w-auto sm:gap-x-6 md:gap-x-10">
            {links.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`nav-link whitespace-nowrap text-sm md:text-base ${isActive ? 'active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}
