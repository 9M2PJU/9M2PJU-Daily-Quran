import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Bookmark {
    verseKey: string;     // e.g. "2:255"
    surahId: number;
    surahName: string;
    arabicText: string;
    translationText: string;
    timestamp: number;
}

export interface Note {
    verseKey: string;     // e.g. "2:255"
    surahId: number;
    surahName: string;
    text: string;
    timestamp: number;
}

export interface SurahBookmark {
    id: number;
    name: string;
    englishName: string;
    timestamp: number;
}

interface BookmarkContextType {
    bookmarks: Bookmark[];
    surahBookmarks: SurahBookmark[];
    notes: Note[];
    isBookmarked: (verseKey: string) => boolean;
    toggleBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
    removeBookmark: (verseKey: string) => void;
    isSurahBookmarked: (surahId: number) => boolean;
    toggleSurahBookmark: (surah: Omit<SurahBookmark, 'timestamp'>) => void;
    getNote: (verseKey: string) => Note | undefined;
    saveNote: (note: Omit<Note, 'timestamp'>) => void;
    deleteNote: (verseKey: string) => void;
    getNotesBySurah: (surahId: number) => Note[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => loadFromStorage('quran-bookmarks', []));
    const [surahBookmarks, setSurahBookmarks] = useState<SurahBookmark[]>(() => loadFromStorage('quran-surah-bookmarks', []));
    const [notes, setNotes] = useState<Note[]>(() => loadFromStorage('quran-notes', []));

    const isBookmarked = useCallback((verseKey: string) => {
        return bookmarks.some(b => b.verseKey === verseKey);
    }, [bookmarks]);

    const toggleBookmark = useCallback((bm: Omit<Bookmark, 'timestamp'>) => {
        setBookmarks(prev => {
            const exists = prev.some(b => b.verseKey === bm.verseKey);
            const updated = exists
                ? prev.filter(b => b.verseKey !== bm.verseKey)
                : [...prev, { ...bm, timestamp: Date.now() }];
            localStorage.setItem('quran-bookmarks', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removeBookmark = useCallback((verseKey: string) => {
        setBookmarks(prev => {
            const updated = prev.filter(b => b.verseKey !== verseKey);
            localStorage.setItem('quran-bookmarks', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const isSurahBookmarked = useCallback((surahId: number) => {
        return surahBookmarks.some(s => s.id === surahId);
    }, [surahBookmarks]);

    const toggleSurahBookmark = useCallback((surah: Omit<SurahBookmark, 'timestamp'>) => {
        setSurahBookmarks(prev => {
            const exists = prev.some(s => s.id === surah.id);
            const updated = exists
                ? prev.filter(s => s.id !== surah.id)
                : [...prev, { ...surah, timestamp: Date.now() }];
            localStorage.setItem('quran-surah-bookmarks', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const getNote = useCallback((verseKey: string) => {
        return notes.find(n => n.verseKey === verseKey);
    }, [notes]);

    const saveNote = useCallback((note: Omit<Note, 'timestamp'>) => {
        setNotes(prev => {
            const filtered = prev.filter(n => n.verseKey !== note.verseKey);
            const updated = [...filtered, { ...note, timestamp: Date.now() }];
            localStorage.setItem('quran-notes', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const deleteNote = useCallback((verseKey: string) => {
        setNotes(prev => {
            const updated = prev.filter(n => n.verseKey !== verseKey);
            localStorage.setItem('quran-notes', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const getNotesBySurah = useCallback((surahId: number) => {
        return notes.filter(n => n.surahId === surahId);
    }, [notes]);

    return (
        <BookmarkContext.Provider value={{
            bookmarks,
            surahBookmarks,
            notes,
            isBookmarked,
            toggleBookmark,
            removeBookmark,
            isSurahBookmarked,
            toggleSurahBookmark,
            getNote,
            saveNote,
            deleteNote,
            getNotesBySurah
        }}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (!context) throw new Error('useBookmarks must be used within a BookmarkProvider');
    return context;
};
