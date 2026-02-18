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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { reciterId } = useSettings();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSurah, setCurrentSurah] = useState<number | null>(null);
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playStateRef = useRef<{ surahId: number; totalVerses: number; verseIndex: number; stopped: boolean } | null>(null);

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
        setCurrentVerseIndex(0);
    }, []);

    const playVerse = useCallback((surahId: number, verseIndex: number, totalVerses: number) => {
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
                // Play next verse
                playVerse(surahId, nextIndex, totalVerses);
            } else {
                // Finished all verses
                setIsPlaying(false);
                setCurrentVerseIndex(0);
            }
        };

        audio.onerror = () => {
            console.error(`Failed to load audio for ${paddedSurah}${paddedVerse}`);
            if (state.stopped) return;
            // Try to skip to next verse
            const nextIndex = verseIndex + 1;
            if (nextIndex < totalVerses) {
                playVerse(surahId, nextIndex, totalVerses);
            } else {
                setIsPlaying(false);
            }
        };

        audio.play().catch(err => {
            console.error('Audio play error:', err);
            setIsPlaying(false);
        });
    }, [reciterId]);

    const play = useCallback((surahId: number, totalVerses: number, startIndex = 0) => {
        stopAudio();
        playVerse(surahId, startIndex, totalVerses);
    }, [stopAudio, playVerse]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggle = useCallback((surahId: number, totalVerses: number) => {
        if (isPlaying && currentSurah === surahId) {
            pause();
        } else {
            play(surahId, totalVerses);
        }
    }, [isPlaying, currentSurah, pause, play]);

    const playNext = useCallback(() => {
        if (!playStateRef.current || playStateRef.current.stopped) return;
        const { surahId, verseIndex, totalVerses } = playStateRef.current;
        const nextIndex = verseIndex + 1;
        if (nextIndex < totalVerses) {
            playVerse(surahId, nextIndex, totalVerses);
        }
    }, [playVerse]);

    const playPrevious = useCallback(() => {
        if (!playStateRef.current || playStateRef.current.stopped) return;
        const { surahId, verseIndex, totalVerses } = playStateRef.current;
        const prevIndex = Math.max(0, verseIndex - 1);
        playVerse(surahId, prevIndex, totalVerses);
    }, [playVerse]);

    return (
        <AudioContext.Provider value={{ isPlaying, currentSurah, currentVerseIndex, play, pause, toggle, stop: stopAudio, playNext, playPrevious }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within an AudioProvider');
    return context;
};
