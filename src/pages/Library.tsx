import React from 'react';
import { Link } from 'react-router-dom';

interface Collection {
    title: string;
    description: string;
    icon: string;
    surahs: { id: number; name: string }[];
    color: string;
}

const COLLECTIONS: Collection[] = [
    {
        title: 'Morning & Evening',
        description: 'Surahs recommended for daily recitation',
        icon: 'wb_twilight',
        color: 'text-amber-500 bg-amber-500/10',
        surahs: [
            { id: 36, name: 'Yaseen' },
            { id: 67, name: 'Al-Mulk' },
            { id: 56, name: "Al-Waqi'ah" },
            { id: 18, name: 'Al-Kahf' },
        ],
    },
    {
        title: 'Short Surahs',
        description: 'Easy to memorize surahs for beginners',
        icon: 'school',
        color: 'text-blue-400 bg-blue-400/10',
        surahs: [
            { id: 112, name: 'Al-Ikhlas' },
            { id: 113, name: 'Al-Falaq' },
            { id: 114, name: 'An-Nas' },
            { id: 1, name: 'Al-Fatihah' },
            { id: 108, name: 'Al-Kawthar' },
            { id: 110, name: 'An-Nasr' },
        ],
    },
    {
        title: 'Friday Surahs',
        description: 'Recommended to read on Fridays',
        icon: 'mosque',
        color: 'text-emerald-400 bg-emerald-400/10',
        surahs: [
            { id: 18, name: 'Al-Kahf' },
            { id: 32, name: 'As-Sajdah' },
            { id: 62, name: "Al-Jumu'ah" },
        ],
    },
    {
        title: 'Protection & Healing',
        description: 'Verses and surahs for protection and ruqyah',
        icon: 'shield',
        color: 'text-purple-400 bg-purple-400/10',
        surahs: [
            { id: 2, name: 'Al-Baqarah' },
            { id: 113, name: 'Al-Falaq' },
            { id: 114, name: 'An-Nas' },
            { id: 112, name: 'Al-Ikhlas' },
        ],
    },
    {
        title: 'Stories of the Prophets',
        description: 'Surahs containing stories of the Prophets',
        icon: 'history_edu',
        color: 'text-cyan-400 bg-cyan-400/10',
        surahs: [
            { id: 12, name: 'Yusuf' },
            { id: 19, name: 'Maryam' },
            { id: 20, name: 'Ta-Ha' },
            { id: 21, name: "Al-Anbiya'" },
            { id: 28, name: 'Al-Qasas' },
        ],
    },
    {
        title: 'The Last 10 Surahs',
        description: 'The final surahs of the Quran',
        icon: 'bookmark_star',
        color: 'text-rose-400 bg-rose-400/10',
        surahs: [
            { id: 105, name: 'Al-Fil' },
            { id: 106, name: 'Quraysh' },
            { id: 107, name: "Al-Ma'un" },
            { id: 108, name: 'Al-Kawthar' },
            { id: 109, name: 'Al-Kafirun' },
            { id: 110, name: 'An-Nasr' },
            { id: 111, name: 'Al-Masad' },
            { id: 112, name: 'Al-Ikhlas' },
            { id: 113, name: 'Al-Falaq' },
            { id: 114, name: 'An-Nas' },
        ],
    },
];

const Library: React.FC = () => {
    return (
        <div className="pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Library</h1>
                <p className="text-slate-400 text-sm">Curated collections of surahs for different occasions and purposes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {COLLECTIONS.map((collection) => (
                    <div key={collection.title} className="bg-[#0f2416] rounded-2xl border border-white/5 hover:border-primary/20 transition-all overflow-hidden group">
                        {/* Header */}
                        <div className="p-5 pb-4">
                            <div className="flex items-start gap-3 mb-3">
                                <div className={`size-10 rounded-lg ${collection.color} flex items-center justify-center flex-shrink-0`}>
                                    <span className="material-symbols-outlined fill-1">{collection.icon}</span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">{collection.title}</h3>
                                    <p className="text-slate-500 text-xs mt-0.5">{collection.description}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{collection.surahs.length} Surahs</span>
                        </div>

                        {/* Surahs List */}
                        <div className="border-t border-white/5">
                            {collection.surahs.map((s, i) => (
                                <Link
                                    key={s.id}
                                    to={`/surah/${s.id}`}
                                    className={`flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors ${i < collection.surahs.length - 1 ? 'border-b border-white/[0.03]' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-600 w-6 text-center">{s.id}</span>
                                        <span className="text-sm text-slate-300 font-medium">{s.name}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-700 text-base group-hover:text-slate-500 transition-colors">chevron_right</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
