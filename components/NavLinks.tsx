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
        <div className="flex gap-6 md:gap-10">
            {links.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`nav-link text-sm md:text-base ${isActive ? 'active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}
