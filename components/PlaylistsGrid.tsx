'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { ArchivePlaylistCard } from '@/lib/archive-data';

type SortType = 'recent' | 'a-z' | 'performances';

const traditionFilters = ['All', 'Qawwali', 'Classical', 'Sufi', 'Instrumental', 'Regional'];
const eraFilters = ['All', 'Historical', 'Modern'];

export default function PlaylistsGrid({ playlists }: { playlists: ArchivePlaylistCard[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState<SortType>('recent');
    const [traditionFilter, setTraditionFilter] = useState('All');
    const [eraFilter, setEraFilter] = useState('All');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.toLowerCase().trim());
        }, 250);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredPlaylists = useMemo(() => {
        let result = playlists;

        if (debouncedSearch) {
            result = result.filter((playlist) => {
                const searchable = [
                    playlist.title,
                    playlist.description,
                    playlist.tradition,
                    playlist.era,
                    playlist.region,
                    playlist.curatorNote,
                ]
                    .join(' ')
                    .toLowerCase();

                return searchable.includes(debouncedSearch);
            });
        }

        if (traditionFilter !== 'All') {
            result = result.filter((playlist) => playlist.tradition === traditionFilter);
        }

        if (eraFilter !== 'All') {
            result = result.filter((playlist) => playlist.era === eraFilter);
        }

        if (sortType === 'a-z') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'performances') {
            result = [...result].sort((a, b) => b.videoCount - a.videoCount);
        } else {
            result = [...result].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        }

        return result;
    }, [debouncedSearch, traditionFilter, eraFilter, playlists, sortType]);

    return (
        <>
            <div className="container-main mb-12 md:mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                    <div className="lg:col-span-5">
                        <label htmlFor="playlist-search" className="sr-only">
                            Search collections
                        </label>
                        <input
                            id="playlist-search"
                            type="text"
                            placeholder="Search collections, traditions, or regions"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 md:px-6 py-3 md:py-4 border border-border-light rounded-lg bg-white text-slate-900 placeholder-slate-500"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <label htmlFor="tradition-filter" className="sr-only">
                            Filter by tradition
                        </label>
                        <div className="relative">
                            <select
                                id="tradition-filter"
                                value={traditionFilter}
                                onChange={(e) => setTraditionFilter(e.target.value)}
                                className="w-full appearance-none px-4 md:px-6 pr-10 py-3 md:py-4 border border-border-light rounded-lg bg-white text-slate-900 cursor-pointer"
                            >
                                {traditionFilters.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                            >
                                <path d="M5.5 7.5L10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <label htmlFor="era-filter" className="sr-only">
                            Filter by era
                        </label>
                        <div className="relative">
                            <select
                                id="era-filter"
                                value={eraFilter}
                                onChange={(e) => setEraFilter(e.target.value)}
                                className="w-full appearance-none px-4 md:px-6 pr-10 py-3 md:py-4 border border-border-light rounded-lg bg-white text-slate-900 cursor-pointer"
                            >
                                {eraFilters.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                            >
                                <path d="M5.5 7.5L10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <label htmlFor="sort-type" className="sr-only">
                            Sort collections
                        </label>
                        <div className="relative">
                            <select
                                id="sort-type"
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value as SortType)}
                                className="w-full appearance-none px-4 md:px-6 pr-10 py-3 md:py-4 border border-border-light rounded-lg bg-white text-slate-900 cursor-pointer"
                            >
                                <option value="recent">Recently Added</option>
                                <option value="performances">Most Performances</option>
                                <option value="a-z">A to Z</option>
                            </select>
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                            >
                                <path d="M5.5 7.5L10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-slate-500 mt-4">
                    {filteredPlaylists.length} collection{filteredPlaylists.length === 1 ? '' : 's'} available
                </p>
            </div>

            {filteredPlaylists.length === 0 ? (
                <div className="container-main text-center py-16">
                    <p className="text-slate-600 text-lg">No collections match your current filters.</p>
                </div>
            ) : (
                <div className="container-main">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredPlaylists.map((playlist) => (
                            <Link
                                key={playlist.id}
                                href={`/playlist/${playlist.id}`}
                                className="group relative overflow-hidden bg-white border border-border-light rounded-lg transition-all duration-200 hover:shadow-lg hover:border-amber-900"
                            >
                                {playlist.coverImage ? (
                                    <img
                                        src={playlist.coverImage}
                                        alt={playlist.title}
                                        className="w-full h-44 object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-44 bg-gradient-to-br from-amber-900/15 via-amber-700/10 to-slate-200/35" />
                                )}

                                <div className="p-6 md:p-7">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="chip">{playlist.tradition}</span>
                                        <span className="chip">{playlist.era}</span>
                                        <span className="chip">{playlist.region}</span>
                                    </div>

                                    <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-amber-900 transition-colors duration-200 line-clamp-2">
                                        {playlist.title}
                                    </h2>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {playlist.curatorNote}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <span>{playlist.videoCount} performances</span>
                                        <span className="text-amber-900 font-semibold">Explore -&gt;</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
