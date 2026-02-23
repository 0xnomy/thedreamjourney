import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

async function getPlaylistEntries(baseUrl: string): Promise<MetadataRoute.Sitemap> {
    try {
        const { data, error } = await supabase
            .from('playlists')
            .select('id, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Sitemap: failed to fetch playlists.', error);
            return [];
        }

        return (data || []).map((playlist) => ({
            url: `${baseUrl}/playlist/${playlist.id}`,
            lastModified: new Date(playlist.created_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));
    } catch (error) {
        console.warn('Sitemap: Supabase connection error, skipping playlist URLs.', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl();
    const now = new Date();

    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/tribute`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/qawwali`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/lyrics`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    const playlistEntries = await getPlaylistEntries(baseUrl);
    return [...staticEntries, ...playlistEntries];
}
