import { cleanYouTubeDescription } from './cleanDescription';

/**
 * Prepares video data for Groq API by cleaning descriptions,
 * truncating content, and optionally sampling videos if count exceeds limit.
 *
 * Server-side only.
 */

const MAX_VIDEOS = 10;
const MAX_DESCRIPTION_LENGTH = 400;

export interface VideoInput {
    title: string;
    description: string;
}

export interface PreparedInput {
    titles: string[];
    descriptions: string[];
}

function sampleVideos(videos: VideoInput[]): VideoInput[] {
    if (videos.length <= MAX_VIDEOS) {
        return videos;
    }

    // Sample: first 3, middle 4, last 3
    const first3 = videos.slice(0, 3);
    const last3 = videos.slice(-3);

    const middleStart = Math.floor((videos.length - 4) / 2);
    const middle4 = videos.slice(middleStart, middleStart + 4);

    return [...first3, ...middle4, ...last3];
}

export function prepareGroqInput(videos: VideoInput[]): PreparedInput {
    if (!videos || videos.length === 0) {
        return { titles: [], descriptions: [] };
    }

    const sampled = sampleVideos(videos);

    const titles = sampled.map((video) => video.title || 'Untitled');

    const descriptions = sampled.map((video) => {
        const cleaned = cleanYouTubeDescription(video.description || '');
        return cleaned.length > MAX_DESCRIPTION_LENGTH
            ? cleaned.slice(0, MAX_DESCRIPTION_LENGTH).trim()
            : cleaned;
    });

    return { titles, descriptions };
}
