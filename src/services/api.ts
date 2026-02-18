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
