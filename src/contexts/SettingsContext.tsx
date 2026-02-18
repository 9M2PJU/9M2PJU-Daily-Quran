import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
    translationId: number;
    setTranslationId: (id: number) => void;
    langName: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const TRANSLATIONS = [
    { id: 131, name: 'English (Saheeh International)' },
    { id: 39, name: 'Malay (Abdul Hameed)' },
    { id: 33, name: 'Indonesian (Kemenag)' },
    // Add more as needed
];

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [translationId, setTranslationId] = useState(() => {
        const saved = localStorage.getItem('daily-quran-translation');
        return saved ? parseInt(saved) : 131;
    });

    useEffect(() => {
        localStorage.setItem('daily-quran-translation', translationId.toString());
    }, [translationId]);

    const langName = TRANSLATIONS.find(t => t.id === translationId)?.name || 'English';

    return (
        <SettingsContext.Provider value={{ translationId, setTranslationId, langName }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within a SettingsProvider');
    return context;
};
