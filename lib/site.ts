const LOCALHOST_URL = 'http://localhost:3000';

export function getBaseUrl(): string {
    const raw =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : LOCALHOST_URL);

    return raw.replace(/\/+$/, '');
}

export function absoluteUrl(path: string = '/'): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getBaseUrl()}${normalizedPath}`;
}

export const SITE_NAME = 'The Dream Journey Archive';
