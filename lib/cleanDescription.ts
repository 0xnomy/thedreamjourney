/**
 * Cleans YouTube video descriptions by removing promotional content,
 * URLs, hashtags, and normalizing whitespace.
 *
 * Server-side only.
 */

const URL_REGEX = /https?:\/\/\S+/gi;
const HASHTAG_REGEX = /#[^\s#]+/g;

const PROMO_PATTERNS = [
    /subscribe/gi,
    /follow\s+(us|me|our)/gi,
    /like\s+and\s+share/gi,
    /donate/gi,
    /merch/gi,
    /available\s+on/gi,
    /pre[-\s]?order/gi,
    /buy\s+now/gi,
    /click\s+the\s+link/gi,
    /official\s+channel/gi,
    /check\s+out/gi,
    /visit\s+our/gi,
];

export function cleanYouTubeDescription(raw: string): string {
    if (!raw) {
        return '';
    }

    let cleaned = raw;

    // Remove URLs
    cleaned = cleaned.replace(URL_REGEX, ' ');

    // Remove hashtags
    cleaned = cleaned.replace(HASHTAG_REGEX, ' ');

    // Remove promotional phrases
    PROMO_PATTERNS.forEach((pattern) => {
        cleaned = cleaned.replace(pattern, ' ');
    });

    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');

    // Convert multiple line breaks into proper paragraph spacing
    cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');

    // Trim
    cleaned = cleaned.trim();

    return cleaned;
}
