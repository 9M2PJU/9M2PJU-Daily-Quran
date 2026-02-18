const BASE_URL = 'https://api.quran.com/api/v4';

export interface Surah {
    id: number;
    name_simple: string;
    name_arabic: string;
    verses_count: number;
    revelation_place: string;
    translated_name: {
        name: string;
    };
}

export interface Ayah {
    id: number;
    verse_key: string;
    text_uthmani: string;
    translations?: Array<{
        text: string;
    }>;
}

export interface Tafsir {
    resource_id: number;
    text: string;
    resource_name: string;
    verse_key: string;
}

export const getSurahs = async (): Promise<Surah[]> => {
    try {
        const response = await fetch(`${BASE_URL}/chapters?language=en`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.chapters || [];
    } catch (error) {
        console.error("getSurahs error:", error);
        return [];
    }
};

export const getSurahDetails = async (id: number): Promise<Surah> => {
    const response = await fetch(`${BASE_URL}/chapters/${id}?language=en`);
    const data = await response.json();
    return data.chapter;
};

export const getAyahs = async (surahId: number, page: number = 1, limit: number = 20, translationId: number = 131): Promise<Ayah[]> => {
    const response = await fetch(
        `${BASE_URL}/verses/by_chapter/${surahId}?language=en&words=false&translations=${translationId}&page=${page}&per_page=${limit}&fields=text_uthmani`
    );
    const data = await response.json();
    return data.verses;
};

// Famous verses pool for VOTD (surah:verse format)
const VOTD_POOL = [
    '2:255', '2:286', '3:26', '3:139', '13:28', '14:7', '16:97', '24:35',
    '33:56', '36:58', '39:53', '40:60', '55:13', '57:4', '59:22', '67:1',
    '94:5', '94:6', '112:1', '112:2', '112:3', '112:4', '1:1', '1:2',
    '2:152', '2:186', '3:173', '9:51', '10:62', '21:87', '23:116',
    '40:44', '48:29', '65:3', '73:8', '93:5', '2:185', '17:82',
];

export const getRandomAyah = async (translationId: number = 131): Promise<{ ayah: Ayah; surahName: string } | null> => {
    try {
        const randomKey = VOTD_POOL[Math.floor(Math.random() * VOTD_POOL.length)];
        const [surahId, verseNum] = randomKey.split(':').map(Number);

        const [verseRes, surahRes] = await Promise.all([
            fetch(`${BASE_URL}/verses/by_key/${surahId}:${verseNum}?language=en&words=false&translations=${translationId}&fields=text_uthmani`),
            fetch(`${BASE_URL}/chapters/${surahId}?language=en`),
        ]);

        const verseData = await verseRes.json();
        const surahData = await surahRes.json();

        return {
            ayah: verseData.verse,
            surahName: surahData.chapter.name_simple,
        };
    } catch (error) {
        console.error('getRandomAyah error:', error);
        return null;
    }
};

export const getSurahAudio = async (surahId: number): Promise<string | null> => {
    try {
        // Reciter 7 is Mishary Rashid Alafasy
        const response = await fetch(`${BASE_URL}/chapter_recitations/7/${surahId}`);
        const data = await response.json();
        return data.audio_file.audio_url;
    } catch (error) {
        console.error('Failed to fetch audio', error);
        return null;
    }
};

export const getTafsir = async (surahId: number, tafsirId: number): Promise<Tafsir[]> => {
    try {
        const response = await fetch(`${BASE_URL}/tafsirs/${tafsirId}/by_chapter/${surahId}?language=en`);
        if (!response.ok) throw new Error('Failed to fetch tafsir');
        const data = await response.json();
        return data.tafsirs || [];
    } catch (error) {
        console.error('getTafsir error:', error);
        return [];
    }
};
