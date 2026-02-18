import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useSettings } from './SettingsContext';

interface AudioContextType {
    isPlaying: boolean;
    currentSurah: number | null;
    currentVerseIndex: number; // Which verse is currently playing (0-based index)
    play: (surahId: number, totalVerses: number, startIndex?: number) => void;
    pause: () => void;
    toggle: (surahId: number, totalVerses: number) => void;
    stop: () => void;
    playNext: () => void;
    playPrevious: () => void;
    registerSurah: (surahId: number, totalVerses: number, name: string) => void;
    activeSurahInfo: { id: number; totalVerses: number; name: string } | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { reciterId } = useSettings();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSurah, setCurrentSurah] = useState<number | null>(null);
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [activeSurahInfo, setActiveSurahInfo] = useState<{ id: number; totalVerses: number; name: string } | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playStateRef = useRef<{ surahId: number; totalVerses: number; verseIndex: number; stopped: boolean } | null>(null);

    const registerSurah = useCallback((id: number, totalVerses: number, name: string) => {
        setActiveSurahInfo(prev => {
            if (prev?.id === id && prev?.totalVerses === totalVerses) return prev;
            return { id, totalVerses, name };
        });
    }, []);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
            audioRef.current = null;
        }
        if (playStateRef.current) {
            playStateRef.current.stopped = true;
        }
        setIsPlaying(false);
    }, []);

    const playVerse = useCallback((surahId: number, verseIndex: number, totalVerses: number) => {
        // If already playing the same verse, do nothing
        if (isPlaying && currentSurah === surahId && currentVerseIndex === verseIndex && audioRef.current && !audioRef.current.paused) {
            return;
        }

        // Stop any current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
        }

        const verseNum = verseIndex + 1;
        const paddedSurah = String(surahId).padStart(3, '0');
        const paddedVerse = String(verseNum).padStart(3, '0');
        const audioUrl = `https://everyayah.com/data/${reciterId}/${paddedSurah}${paddedVerse}.mp3`;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Create state tracker for this play session
        const state = { surahId, totalVerses, verseIndex, stopped: false };
        playStateRef.current = state;

        setCurrentVerseIndex(verseIndex);
        setCurrentSurah(surahId);
        setIsPlaying(true);

        audio.onended = () => {
            if (state.stopped) return;
            const nextIndex = verseIndex + 1;
            if (nextIndex < totalVerses) {
                playVerse(surahId, nextIndex, totalVerses);
            } else {
                setIsPlaying(false);
                setCurrentVerseIndex(0);
            }
        };

        audio.onerror = () => {
            if (state.stopped) return;
            const nextIndex = verseIndex + 1;
            if (nextIndex < totalVerses) {
                playVerse(surahId, nextIndex, totalVerses);
            } else {
                setIsPlaying(false);
            }
        };

        audio.play().catch(err => {
            // Only log if it's not an abort error (which we expect if we change verses rapidly)
            if (err.name !== 'AbortError') {
                console.error('Audio play error:', err);
                setIsPlaying(false);
            }
        });
    }, [reciterId, isPlaying, currentSurah, currentVerseIndex]);

    const play = useCallback((surahId: number, totalVerses: number, startIndex = 0) => {
        stopAudio();
        playVerse(surahId, startIndex, totalVerses);
    }, [stopAudio, playVerse]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
    }, []);

    const toggle = useCallback((surahId: number, totalVerses: number) => {
        const verses = totalVerses > 0 ? totalVerses : (activeSurahInfo?.id === surahId ? activeSurahInfo.totalVerses : 0);

        if (isPlaying && currentSurah === surahId) {
            pause();
        } else {
            play(surahId, verses, currentSurah === surahId ? currentVerseIndex : 0);
        }
    }, [isPlaying, currentSurah, currentVerseIndex, pause, play, activeSurahInfo]);

    const playNext = useCallback(() => {
        const surahId = currentSurah || activeSurahInfo?.id;
        const totalVerses = (currentSurah === activeSurahInfo?.id ? activeSurahInfo?.totalVerses : playStateRef.current?.totalVerses) || activeSurahInfo?.totalVerses || 0;

        if (surahId && totalVerses > 0) {
            const nextIndex = currentVerseIndex + 1;
            if (nextIndex < totalVerses) {
                playVerse(surahId, nextIndex, totalVerses);
            }
        }
    }, [playVerse, activeSurahInfo, currentSurah, currentVerseIndex]);

    const playPrevious = useCallback(() => {
        const surahId = currentSurah || activeSurahInfo?.id;
        const totalVerses = (currentSurah === activeSurahInfo?.id ? activeSurahInfo?.totalVerses : playStateRef.current?.totalVerses) || activeSurahInfo?.totalVerses || 0;

        if (surahId && totalVerses > 0) {
            const prevIndex = Math.max(0, currentVerseIndex - 1);
            playVerse(surahId, prevIndex, totalVerses);
        }
    }, [playVerse, activeSurahInfo, currentSurah, currentVerseIndex]);

    const contextValue = React.useMemo(() => ({
        isPlaying,
        currentSurah,
        currentVerseIndex,
        play,
        pause,
        toggle,
        stop: stopAudio,
        playNext,
        playPrevious,
        registerSurah,
        activeSurahInfo
    }), [isPlaying, currentSurah, currentVerseIndex, play, pause, toggle, stopAudio, playNext, playPrevious, registerSurah, activeSurahInfo]);

    return (
        <AudioContext.Provider value={contextValue}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within an AudioProvider');
    return context;
};
