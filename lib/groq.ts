'use server';

import Groq from 'groq-sdk';
import { cleanYouTubeDescription } from './cleanDescription';
import { prepareGroqInput, VideoInput } from './prepareGroqInput';

/**
 * Server-side AI utilities for generating curator notes and glossaries.
 * Includes in-memory caching to reduce API calls.
 */

// In-memory caches
const curatorCache = new Map<string, string>();
const glossaryCache = new Map<string, Array<{ term: string; definition: string }>>();

const groqApiKey = process.env.GROQ_API_KEY;
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqClient) {
        if (!groqApiKey) {
            throw new Error('GROQ_API_KEY is not configured');
        }
        groqClient = new Groq({ apiKey: groqApiKey });
    }
    return groqClient;
}

function ensureServerContext() {
    if (typeof window !== 'undefined') {
        throw new Error('AI functions must be invoked on the server');
    }
}

const CURATOR_SYSTEM_PROMPT = `You are a cultural archivist specializing in South Asian classical and devotional music.
Write curator notes in a refined museum-archive tone.
Avoid generic praise and avoid vague language.
Ground the writing in observable musical elements such as performance structure, vocal style, instrumentation, poetic tradition, devotional context, improvisation patterns, raga development, rhythmic cycles (taal), and ensemble dynamics where applicable.
Do not fabricate facts that are not supported by the provided material.
Do not repeat the playlist title mechanically.
Avoid marketing tone.
Write 120–180 words.
Maintain an editorial, restrained voice.`;

const GLOSSARY_SYSTEM_PROMPT = `You are a music terminology expert specializing in South Asian classical and devotional music.
Extract up to 6 meaningful musical terms from the provided material.
Focus on: raga names, taal cycles, musical forms (qawwali, khayal, thumri, etc.), instruments, poets, and performance traditions.
Return ONLY valid JSON in this exact format:
[
  { "term": "term name", "definition": "brief definition" }
]
Keep definitions concise (15-30 words).
If no meaningful terms are found, return an empty array: []`;

function buildCuratorUserMessage(
    playlistTitle: string,
    playlistDescription: string,
    titles: string[],
    descriptions: string[],
): string {
    const cleanedPlaylistDescription = cleanYouTubeDescription(playlistDescription);

    return [
        'Playlist Title:',
        playlistTitle || 'Untitled Playlist',
        '',
        'Playlist Description:',
        cleanedPlaylistDescription || 'No description provided.',
        '',
        'Video Titles:',
        titles.join('\n'),
        '',
        'Video Description Excerpts:',
        descriptions.join('\n\n'),
        '',
        'Write a curator note based strictly on the above material.',
    ].join('\n');
}

function buildGlossaryUserMessage(titles: string[], descriptions: string[]): string {
    return [
        'Video Titles:',
        titles.join('\n'),
        '',
        'Video Description Excerpts:',
        descriptions.join('\n\n'),
        '',
        'Extract meaningful musical terms and provide brief definitions.',
    ].join('\n');
}

export async function generateCuratorNote(
    playlistId: string,
    playlistTitle: string,
    playlistDescription: string,
    videos: VideoInput[],
): Promise<string | null> {
    ensureServerContext();

    // Check cache
    if (curatorCache.has(playlistId)) {
        return curatorCache.get(playlistId) || null;
    }

    if (!videos?.length) {
        return null;
    }

    const { titles, descriptions } = prepareGroqInput(videos);

    if (titles.length === 0) {
        return null;
    }

    try {
        const groq = getGroqClient();
        const userMessage = buildCuratorUserMessage(
            playlistTitle,
            playlistDescription,
            titles,
            descriptions,
        );

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: CURATOR_SYSTEM_PROMPT },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.4,
            max_tokens: 600,
        });

        const note = completion.choices?.[0]?.message?.content?.trim();

        if (note) {
            curatorCache.set(playlistId, note);
            return note;
        }

        return null;
    } catch (error) {
        console.error('Failed to generate curator note', error);
        return null;
    }
}

export async function generateGlossary(
    playlistId: string,
    videos: VideoInput[],
): Promise<Array<{ term: string; definition: string }>> {
    ensureServerContext();

    // Check cache
    if (glossaryCache.has(playlistId)) {
        return glossaryCache.get(playlistId) || [];
    }

    if (!videos?.length) {
        return [];
    }

    const { titles, descriptions } = prepareGroqInput(videos);

    if (titles.length === 0) {
        return [];
    }

    try {
        const groq = getGroqClient();
        const userMessage = buildGlossaryUserMessage(titles, descriptions);

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: GLOSSARY_SYSTEM_PROMPT },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 800,
        });

        const content = completion.choices?.[0]?.message?.content?.trim();

        if (!content) {
            return [];
        }

        // Safe JSON parsing
        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
                const validated = parsed
                    .filter((item) => item?.term && item?.definition)
                    .slice(0, 6);
                glossaryCache.set(playlistId, validated);
                return validated;
            }
        } catch (parseError) {
            console.error('Failed to parse glossary JSON', parseError);
        }

        return [];
    } catch (error) {
        console.error('Failed to generate glossary', error);
        return [];
    }
}
