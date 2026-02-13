import { createClient } from '@supabase/supabase-js';
import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site';

export const revalidate = 3600;

async function getPlaylistEntries(baseUrl: string): Promise<MetadataRoute.Sitemap> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Sitemap: missing Supabase env vars, skipping playlist URLs.');
        return [];
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
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
