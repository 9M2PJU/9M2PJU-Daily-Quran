import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
    translationId: number;
    setTranslationId: (id: number) => void;
    langName: string;
    reciterId: string;
    setReciterId: (id: string) => void;
    reciterName: string;
    tafsirId: number;
    setTafsirId: (id: number) => void;
    showTranslation: boolean;
    setShowTranslation: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const TRANSLATIONS = [
    { id: 20, name: 'English (Sahih International)' },
    { id: 95, name: 'English (Hilali & Khan)' },
    { id: 85, name: 'English (Yusuf Ali)' },
    { id: 84, name: 'English (Maududi)' },
    { id: 22, name: 'English (Pickthall)' },
    { id: 39, name: 'Malay (Abdul Hameed)' },
    { id: 33, name: 'Indonesian (Kemenag)' },
    { id: 77, name: 'Turkish (Diyanet)' },
    { id: 31, name: 'Urdu (Ahmed Ali)' },
    { id: 79, name: 'Urdu (Jalandhry)' },
    { id: 136, name: 'French (Montada Islamic Foundation)' },
    { id: 83, name: 'Spanish (Isa Garcia)' },
    { id: 27, name: 'German (Bubenheim & Elyas)' },
    { id: 45, name: 'Russian (Kuliev)' },
    { id: 56, name: 'Chinese (Ma Jian)' },
    { id: 97, name: 'Bengali (Muhiuddin Khan)' },
    { id: 122, name: 'Hindi (Suhel Farooq Khan)' },
    { id: 133, name: 'Tamil (Jan Turst Foundation)' },
    { id: 161, name: 'Thai (King Fahad Complex)' },
    { id: 106, name: 'Somali (Abduh)' },
    { id: 101, name: 'Japanese (Saeed Sato)' },
    { id: 86, name: 'Bosnian (Mlivo)' },
    { id: 75, name: 'Persian (Ansarian)' },
    { id: 40, name: 'Swahili (Al-Barwani)' },
    { id: 78, name: 'Dutch (Sofian Siregar)' },
    { id: 103, name: 'Korean (Hamid Choi)' },
];

export const RECITERS = [
    { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
    { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)' },
    { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahman As-Sudais' },
    { id: 'Saad_Al_Ghamdi_128kbps', name: 'Saad Al-Ghamdi' },
    { id: 'Abu_Bakr_Ash-Shaatree_128kbps', name: 'Abu Bakr Ash-Shatri' },
    { id: 'Hani_Rifai_192kbps', name: 'Hani Ar-Rifai' },
    { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary' },
    { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq El-Minshawi' },
    { id: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net', name: 'Ahmed Al-Ajamy' },
    { id: 'Maher_AlMuaiqly_128kbps', name: 'Maher Al-Muaiqly' },
];

export const TAFSIRS = [
    { id: 169, name: 'Ibn Kathir (English)', scholar: 'Hafiz Ibn Kathir' },
    { id: 168, name: 'Ma\'arif al-Qur\'an (English)', scholar: 'Mufti Muhammad Shafi' },
    { id: 817, name: 'Tazkirul Quran (English)', scholar: 'Maulana Wahiduddin Khan' },
    { id: 158, name: 'Tafsir Al-Jalalayn (Indonesian)', scholar: 'Jalaluddin al-Mahalli & Jalaluddin as-Suyuti' },
];

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [translationId, setTranslationId] = useState(() => {
        const saved = localStorage.getItem('daily-quran-translation');
        return saved ? parseInt(saved) : 20;
    });

    const [reciterId, setReciterId] = useState(() => {
        try {
            return localStorage.getItem('daily-quran-reciter') || 'Alafasy_128kbps';
        } catch {
            return 'Alafasy_128kbps';
        }
    });

    const [tafsirId, setTafsirId] = useState(() => {
        const saved = localStorage.getItem('daily-quran-tafsir');
        return saved ? parseInt(saved) : 169;
    });

    const [showTranslation, setShowTranslation] = useState(() => {
        const saved = localStorage.getItem('daily-quran-show-translation');
        return saved !== null ? saved === 'true' : true;
    });

    useEffect(() => {
        localStorage.setItem('daily-quran-translation', translationId.toString());
    }, [translationId]);

    useEffect(() => {
        localStorage.setItem('daily-quran-reciter', reciterId);
    }, [reciterId]);

    useEffect(() => {
        localStorage.setItem('daily-quran-tafsir', tafsirId.toString());
    }, [tafsirId]);

    useEffect(() => {
        localStorage.setItem('daily-quran-show-translation', showTranslation.toString());
    }, [showTranslation]);

    const langName = TRANSLATIONS.find(t => t.id === translationId)?.name || 'English';
    const reciterName = RECITERS.find(r => r.id === reciterId)?.name || 'Mishary Rashid Alafasy';

    return (
        <SettingsContext.Provider value={{
            translationId,
            setTranslationId,
            langName,
            reciterId,
            setReciterId,
            reciterName,
            tafsirId,
            setTafsirId,
            showTranslation,
            setShowTranslation
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within a SettingsProvider');
    return context;
};
