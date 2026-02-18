import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface ProgressContextType {
    dailyGoal: number; // Pages per day
    dailyProgress: number; // Pages read today
    streak: number;
    lastReadSurah: { id: number; name: string } | null;
    readHistory: { id: number; name: string; timestamp: number }[];
    incrementProgress: (surah?: { id: number; name: string }) => void;
    setDailyGoal: (goal: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function readInt(key: string, fallback: number): number {
    try {
        const v = localStorage.getItem(key);
        return v ? parseInt(v, 10) : fallback;
    } catch {
        return fallback;
    }
}

function getTodayStr(): string {
    return new Date().toDateString();
}

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dailyGoal, setDailyGoalState] = useState(() => readInt('dailyGoal', 5));
    const [dailyProgress, setDailyProgress] = useState(() => {
        const savedDate = localStorage.getItem('lastReadDate');
        if (savedDate !== getTodayStr()) return 0;
        return readInt('dailyProgress', 0);
    });
    const [streak, setStreak] = useState(() => readInt('streak', 0));
    const [lastReadSurah, setLastReadSurah] = useState<{ id: number; name: string } | null>(() => {
        try {
            const saved = localStorage.getItem('lastReadSurah');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });
    const [readHistory, setReadHistory] = useState<{ id: number; name: string; timestamp: number }[]>(() => {
        try {
            const saved = localStorage.getItem('readHistory');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // Track whether today's goal has already been counted for streak
    const [goalMetToday, setGoalMetToday] = useState(() => {
        try {
            return localStorage.getItem('goalMetToday') === getTodayStr();
        } catch {
            return false;
        }
    });

    // Use ref to prevent double-counting from React StrictMode
    const lastIncrementTime = useRef(0);

    // Persist goal
    const setDailyGoal = useCallback((goal: number) => {
        setDailyGoalState(goal);
        localStorage.setItem('dailyGoal', goal.toString());
    }, []);

    // Check for new day & streak logic on mount
    useEffect(() => {
        try {
            const lastDate = localStorage.getItem('lastReadDate');
            const today = getTodayStr();

            if (lastDate && lastDate !== today) {
                // New day — reset progress
                setDailyProgress(0);
                localStorage.setItem('dailyProgress', '0');
                setGoalMetToday(false);
                localStorage.removeItem('goalMetToday');

                // Check if streak was broken (missed a day)
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastDate !== yesterday.toDateString()) {
                    setStreak(0);
                    localStorage.setItem('streak', '0');
                }
            }
        } catch (e) {
            console.error("ProgressContext checkDate error:", e);
        }
    }, []);

    const incrementProgress = useCallback((surah?: { id: number; name: string }) => {
        // Debounce: ignore calls within 200ms (prevents StrictMode double-fire)
        const now = Date.now();
        if (now - lastIncrementTime.current < 200) return;
        lastIncrementTime.current = now;

        setDailyProgress(prev => {
            const newProgress = prev + 1;
            localStorage.setItem('dailyProgress', newProgress.toString());
            localStorage.setItem('lastReadDate', getTodayStr());
            return newProgress;
        });

        if (surah) {
            setLastReadSurah(surah);
            localStorage.setItem('lastReadSurah', JSON.stringify(surah));

            setReadHistory(prev => {
                // Add to history if not the same as the last entry in the last 1 hour
                const lastEntry = prev[0];
                const shouldAdd = !lastEntry || lastEntry.id !== surah.id || (Date.now() - lastEntry.timestamp > 3600000);

                let updated = prev;
                if (shouldAdd) {
                    updated = [{ ...surah, timestamp: Date.now() }, ...prev].slice(0, 20);
                } else if (lastEntry && lastEntry.id === surah.id) {
                    // Just update timestamp
                    updated = [{ ...surah, timestamp: Date.now() }, ...prev.slice(1)];
                }

                localStorage.setItem('readHistory', JSON.stringify(updated));
                return updated;
            });
        }
    }, []);

    // Handle streak update when goal is met (separate from increment to avoid closure issues)
    useEffect(() => {
        if (dailyProgress >= dailyGoal && !goalMetToday && dailyGoal > 0) {
            setGoalMetToday(true);
            localStorage.setItem('goalMetToday', getTodayStr());
            setStreak(prev => {
                const newStreak = prev + 1;
                localStorage.setItem('streak', newStreak.toString());
                return newStreak;
            });
        }
    }, [dailyProgress, dailyGoal, goalMetToday]);

    return (
        <ProgressContext.Provider value={{ dailyGoal, dailyProgress, streak, lastReadSurah, readHistory, incrementProgress, setDailyGoal }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) throw new Error('useProgress must be used within a ProgressProvider');
    return context;
};
