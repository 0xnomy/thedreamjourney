import { supabase } from '@/lib/supabase';

export type Tradition = 'Qawwali' | 'Sufi' | 'Instrumental' | 'Classical' | 'Regional';

export interface ArchivePlaylistCard {
    id: string;
    youtube_playlist_id: string;
    title: string;
    description: string;
    created_at: string;
    videoCount: number;
    coverImage: string | null;
    tradition: Tradition;
    era: string;
    region: string;
    curatorNote: string;
}

interface PlaylistRow {
    id: string;
    youtube_playlist_id: string;
    title: string;
    description: string;
    created_at: string;
    curator_note?: string | null;
}

interface VideoRow {
    playlist_id: string | number;
    title: string;
    description: string;
    thumbnail: string | null;
    published_at: string;
}

type TraditionScoreMap = Record<Tradition, number>;

const traditionKeywords: Record<Tradition, Array<{ term: string; weight: number }>> = {
    Qawwali: [
        { term: 'qawwali', weight: 8 },
        { term: 'qawwal', weight: 7 },
        { term: 'sabri', weight: 5 },
        { term: 'nusrat', weight: 5 },
        { term: 'aziz mian', weight: 5 },
        { term: 'amjad sabri', weight: 5 },
        { term: 'manqabat', weight: 4 },
        { term: 'hamd', weight: 3 },
        { term: 'naat', weight: 3 },
        { term: 'sama', weight: 3 },
        { term: 'qoul', weight: 3 },
        { term: 'kafi', weight: 2 },
        { term: 'dhamal', weight: 2 },
    ],
    Sufi: [
        { term: 'sufi', weight: 6 },
        { term: 'kalam', weight: 3 },
        { term: 'dargah', weight: 3 },
        { term: 'manqabat', weight: 3 },
        { term: 'hamd', weight: 2 },
        { term: 'naat', weight: 2 },
        { term: 'urs', weight: 2 },
        { term: 'spiritual', weight: 2 },
    ],
    Instrumental: [
        { term: 'instrumental', weight: 6 },
        { term: 'tabla', weight: 5 },
        { term: 'sitar', weight: 5 },
        { term: 'sarangi', weight: 5 },
        { term: 'rubab', weight: 4 },
        { term: 'bansuri', weight: 4 },
        { term: 'flute', weight: 4 },
        { term: 'violin', weight: 3 },
        { term: 'santoor', weight: 4 },
        { term: 'dhol', weight: 2 },
    ],
    Classical: [
        { term: 'classical', weight: 7 },
        { term: 'raag', weight: 6 },
        { term: 'raga', weight: 6 },
        { term: 'khayal', weight: 5 },
        { term: 'thumri', weight: 5 },
        { term: 'dadra', weight: 4 },
        { term: 'ghazal', weight: 3 },
        { term: 'bandish', weight: 4 },
        { term: 'ustad', weight: 2 },
    ],
    Regional: [
        { term: 'folk', weight: 3 },
        { term: 'regional', weight: 3 },
        { term: 'lok', weight: 3 },
        { term: 'traditional', weight: 2 },
        { term: 'heritage', weight: 2 },
    ],
};

const regionKeywords: Array<{ label: string; terms: string[] }> = [
    { label: 'Punjab', terms: ['punjab', 'lahore', 'punjabi', 'multan', 'faisalabad'] },
    { label: 'Sindh', terms: ['sindh', 'karachi', 'sindhi', 'hyderabad'] },
    { label: 'Khyber', terms: ['khyber', 'peshawar', 'pashto', 'pakhtun', 'swat'] },
    { label: 'Balochistan', terms: ['baloch', 'quetta', 'balochi', 'makran'] },
    { label: 'Kashmir', terms: ['kashmir', 'kashmiri'] },
];

const noteTemplates: Record<Tradition, string[]> = {
    Qawwali: [
        'A {era} qawwali selection centered on ensemble progression, poetic refrain, and devotional intensity from {region}.',
        'This qawwali collection traces lineages of sama and performance practice, with {videoCount} documented renditions.',
        'Curated for listeners of qawwali structure and text delivery, this set highlights repertoire preserved through oral tradition in {region}.',
        'A focused qawwali archive balancing canonical kalam with stage interpretations, presented with a {era.toLowerCase} lens.',
        'Designed for deep listening, this qawwali index captures collective vocals, rhythmic ascent, and devotional expression across eras.',
    ],
    Sufi: [
        'A {era} Sufi collection documenting kalam traditions, spiritual verse, and performance contexts linked to {region}.',
        'This Sufi set prioritizes devotional continuity, with selections suited for reflective listening and textual study.',
        'Curated around Sufi expression and poetic transmission, the archive maps voice, meaning, and lineage over time.',
        'An editorially arranged Sufi collection that foregrounds lyrical depth, melodic gravity, and cultural memory.',
        'A preservation-focused Sufi sequence with {videoCount} recordings across recital and devotional settings.',
    ],
    Instrumental: [
        'An instrumental collection emphasizing technique, tonal architecture, and ensemble dialogue in a {era.toLowerCase} frame.',
        'This set documents instrumental craftsmanship from {region}, including repertoire shaped by gharana and stage practice.',
        'A study-friendly instrumental archive with {videoCount} performances highlighting phrasing, improvisation, and accompaniment.',
        'Curated for attentive listening, this instrumental sequence centers on timbre, structure, and rhythmic articulation.',
        'A focused instrumental catalogue designed to surface masters, accompanists, and evolving performance aesthetics.',
    ],
    Classical: [
        'A {era} classical selection with attention to raag grammar, bandish interpretation, and evolving vocal form.',
        'This classical collection maps repertoire and pedagogy across lineages, offering {videoCount} reference performances.',
        'Curated for serious listeners, the set highlights classical architecture, improvisational method, and recital balance.',
        'A classical archive from {region} that connects canonical form with contemporary presentation and access.',
        'Structured as a listening syllabus, this classical sequence supports study of raag development and stylistic contrast.',
    ],
    Regional: [
        'A regional heritage collection preserving local repertoire, performance accents, and community memory from {region}.',
        'This set captures under-documented regional practice, extending access to forms that rarely enter mainstream catalogs.',
        'A regional archive built for discovery, with {videoCount} performances spanning folk-classical intersections.',
        'Curated to represent vernacular expression and localized style, this sequence emphasizes continuity across generations.',
        'A preservation-led regional collection that keeps place-based musical identities visible and searchable.',
    ],
};

function countOccurrences(text: string, term: string): number {
    if (!term) return 0;
    let count = 0;
    let start = 0;
    while (true) {
        const index = text.indexOf(term, start);
        if (index === -1) break;
        count += 1;
        start = index + term.length;
    }
    return count;
}

function scoreTraditions(text: string): TraditionScoreMap {
    const scores: TraditionScoreMap = {
        Qawwali: 0,
        Sufi: 0,
        Instrumental: 0,
        Classical: 0,
        Regional: 0,
    };

    (Object.keys(traditionKeywords) as Tradition[]).forEach((tradition) => {
        for (const keyword of traditionKeywords[tradition]) {
            const occurrences = countOccurrences(text, keyword.term);
            if (occurrences > 0) {
                scores[tradition] += occurrences * keyword.weight;
            }
        }
    });

    // Qawwali should win if strong qawwali-specific signals are present.
    if (scores.Qawwali >= 8) {
        scores.Qawwali += 4;
    }

    return scores;
}

function inferTradition(text: string): Tradition {
    const scores = scoreTraditions(text);
    let best: Tradition = 'Regional';
    let maxScore = -1;

    (Object.keys(scores) as Tradition[]).forEach((tradition) => {
        const score = scores[tradition];
        if (score > maxScore) {
            maxScore = score;
            best = tradition;
        }
    });

    return maxScore > 0 ? best : 'Regional';
}

function inferRegion(text: string): string {
    let bestLabel = 'South Asia';
    let bestScore = 0;

    for (const region of regionKeywords) {
        let score = 0;
        for (const term of region.terms) {
            score += countOccurrences(text, term);
        }

        if (score > bestScore) {
            bestScore = score;
            bestLabel = region.label;
        }
    }

    return bestLabel;
}

function inferEra(createdAt: string, text: string): string {
    if (
        ['archive', 'legacy', 'vintage', 'rare', 'historic', 'old recording', 'restored'].some((term) =>
            text.includes(term)
        )
    ) {
        return 'Historical';
    }

    const year = new Date(createdAt).getFullYear();
    return year < 2020 ? 'Historical' : 'Modern';
}

function stableHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
    }
    return hash;
}

function renderTemplate(template: string, values: Record<string, string>): string {
    return template
        .replaceAll('{era}', values.era)
        .replaceAll('{era.toLowerCase}', values.era.toLowerCase())
        .replaceAll('{region}', values.region)
        .replaceAll('{videoCount}', values.videoCount);
}

function makeCuratorNote(card: ArchivePlaylistCard): string {
    const templates = noteTemplates[card.tradition];
    const index = stableHash(`${card.id}-${card.tradition}`) % templates.length;
    return renderTemplate(templates[index], {
        era: card.era,
        region: card.region,
        videoCount: String(card.videoCount),
    });
}

export async function getArchiveCards(): Promise<ArchivePlaylistCard[]> {
    const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select('id, youtube_playlist_id, title, description, created_at, curator_note')
        .order('created_at', { ascending: false });

    if (playlistError) {
        throw playlistError;
    }

    const playlists = (playlistData || []) as PlaylistRow[];
    const playlistIds = playlists.map((playlist) => playlist.id);

    let videos: VideoRow[] = [];
    if (playlistIds.length > 0) {
        const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .select('playlist_id, title, description, thumbnail, published_at')
            .in('playlist_id', playlistIds)
            .order('published_at', { ascending: false });

        if (videoError) {
            throw videoError;
        }

        videos = (videoData || []) as VideoRow[];
    }

    const videoMap = new Map<string, { count: number; coverImage: string | null; corpus: string[] }>();
    for (const video of videos) {
        const playlistId = String(video.playlist_id);
        const existing = videoMap.get(playlistId);
        const snippet = `${video.title || ''} ${video.description || ''}`.toLowerCase();

        if (!existing) {
            videoMap.set(playlistId, {
                count: 1,
                coverImage: video.thumbnail,
                corpus: snippet ? [snippet] : [],
            });
        } else {
            existing.count += 1;
            existing.coverImage = existing.coverImage || video.thumbnail;
            if (snippet) {
                existing.corpus.push(snippet);
            }
            videoMap.set(playlistId, existing);
        }
    }

    return playlists.map((playlist) => {
        const metrics = videoMap.get(String(playlist.id));
        const textCorpus = [
            playlist.title,
            playlist.description || '',
            ...(metrics?.corpus || []),
        ]
            .join(' ')
            .toLowerCase();

        const card: ArchivePlaylistCard = {
            id: playlist.id,
            youtube_playlist_id: playlist.youtube_playlist_id,
            title: playlist.title,
            description: playlist.description || '',
            created_at: playlist.created_at,
            videoCount: metrics?.count || 0,
            coverImage: metrics?.coverImage || null,
            tradition: inferTradition(textCorpus),
            era: inferEra(playlist.created_at, textCorpus),
            region: inferRegion(textCorpus),
            curatorNote: '',
        };

        return {
            ...card,
            curatorNote: playlist.curator_note || makeCuratorNote(card),
        };
    });
}
