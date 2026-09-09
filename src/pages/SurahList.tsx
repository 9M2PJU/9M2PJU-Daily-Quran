import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSurahs, type Surah } from '../services/api';
import { usePageSEO } from '../hooks/usePageSEO';
import { motion } from 'framer-motion';

type FilterTab = 'surah' | 'juz';
type RevelationFilter = 'all' | 'makkah' | 'madinah';

interface JuzInfo {
    juzNumber: number;
    nameArabic: string;
    startSurahId: number;
    startSurahName: string;
    startVerseKey: string;
    verseRange: string;
}

// 30 Juz Mapping with exact starting Surahs and Verses
const JUZ_DATA: JuzInfo[] = [
    { juzNumber: 1, nameArabic: 'الم', startSurahId: 1, startSurahName: 'Al-Fatihah', startVerseKey: '1:1', verseRange: 'Al-Fatihah 1:1 - Al-Baqarah 2:141' },
    { juzNumber: 2, nameArabic: 'سَيَقُولُ', startSurahId: 2, startSurahName: 'Al-Baqarah', startVerseKey: '2:142', verseRange: 'Al-Baqarah 2:142 - 2:252' },
    { juzNumber: 3, nameArabic: 'تِلْكَ الرُّسُلُ', startSurahId: 2, startSurahName: 'Al-Baqarah', startVerseKey: '2:253', verseRange: 'Al-Baqarah 2:253 - Ali \'Imran 3:92' },
    { juzNumber: 4, nameArabic: 'كُلُّ الطَّعَامِ', startSurahId: 3, startSurahName: 'Ali \'Imran', startVerseKey: '3:93', verseRange: 'Ali \'Imran 3:93 - An-Nisa 4:23' },
    { juzNumber: 5, nameArabic: 'وَالْمُحْصَنَاتُ', startSurahId: 4, startSurahName: 'An-Nisa', startVerseKey: '4:24', verseRange: 'An-Nisa 4:24 - 4:147' },
    { juzNumber: 6, nameArabic: 'لَا يُحِبُّ اللَّهُ', startSurahId: 4, startSurahName: 'An-Nisa', startVerseKey: '4:148', verseRange: 'An-Nisa 4:148 - Al-Ma\'idah 5:81' },
    { juzNumber: 7, nameArabic: 'وَإِذَا سَمِعُوا', startSurahId: 5, startSurahName: 'Al-Ma\'idah', startVerseKey: '5:82', verseRange: 'Al-Ma\'idah 5:82 - Al-An\'am 6:110' },
    { juzNumber: 8, nameArabic: 'وَلَوْ أَنَّنَا', startSurahId: 6, startSurahName: 'Al-An\'am', startVerseKey: '6:111', verseRange: 'Al-An\'am 6:111 - Al-A\'raf 7:87' },
    { juzNumber: 9, nameArabic: 'قَالَ الْمَلَأُ', startSurahId: 7, startSurahName: 'Al-A\'raf', startVerseKey: '7:88', verseRange: 'Al-A\'raf 7:88 - Al-Anfal 8:40' },
    { juzNumber: 10, nameArabic: 'وَاعْلَمُوا', startSurahId: 8, startSurahName: 'Al-Anfal', startVerseKey: '8:41', verseRange: 'Al-Anfal 8:41 - At-Tawbah 9:92' },
    { juzNumber: 11, nameArabic: 'يَعْتَذِرُونَ', startSurahId: 9, startSurahName: 'At-Tawbah', startVerseKey: '9:93', verseRange: 'At-Tawbah 9:93 - Hud 11:5' },
    { juzNumber: 12, nameArabic: 'وَمَا مِنْ دَابَّةٍ', startSurahId: 11, startSurahName: 'Hud', startVerseKey: '11:6', verseRange: 'Hud 11:6 - Yusuf 12:52' },
    { juzNumber: 13, nameArabic: 'وَمَا أُبَرِّئُ', startSurahId: 12, startSurahName: 'Yusuf', startVerseKey: '12:53', verseRange: 'Yusuf 12:53 - Ibrahim 14:52' },
    { juzNumber: 14, nameArabic: 'رُبَمَا', startSurahId: 15, startSurahName: 'Al-Hijr', startVerseKey: '15:1', verseRange: 'Al-Hijr 15:1 - An-Nahl 16:128' },
    { juzNumber: 15, nameArabic: 'سُبْحَانَ الَّذِي', startSurahId: 17, startSurahName: 'Al-Isra', startVerseKey: '17:1', verseRange: 'Al-Isra 17:1 - Al-Kahf 18:74' },
    { juzNumber: 16, nameArabic: 'قَالَ أَلَمْ', startSurahId: 18, startSurahName: 'Al-Kahf', startVerseKey: '18:75', verseRange: 'Al-Kahf 18:75 - Ta-Ha 20:135' },
    { juzNumber: 17, nameArabic: 'اقْتَرَبَ', startSurahId: 21, startSurahName: 'Al-Anbiya', startVerseKey: '21:1', verseRange: 'Al-Anbiya 21:1 - Al-Hajj 22:78' },
    { juzNumber: 18, nameArabic: 'قَدْ أَفْلَحَ', startSurahId: 23, startSurahName: 'Al-Mu\'minun', startVerseKey: '23:1', verseRange: 'Al-Mu\'minun 23:1 - Al-Furqan 25:20' },
    { juzNumber: 19, nameArabic: 'وَقَالَ الَّذِينَ', startSurahId: 25, startSurahName: 'Al-Furqan', startVerseKey: '25:21', verseRange: 'Al-Furqan 25:21 - An-Naml 27:55' },
    { juzNumber: 20, nameArabic: 'أَمَّنْ خَلَقَ', startSurahId: 27, startSurahName: 'An-Naml', startVerseKey: '27:56', verseRange: 'An-Naml 27:56 - Al-\'Ankabut 29:45' },
    { juzNumber: 21, nameArabic: 'اتْلُ مَا أُوحِيَ', startSurahId: 29, startSurahName: 'Al-\'Ankabut', startVerseKey: '29:46', verseRange: 'Al-\'Ankabut 29:46 - Al-Ahzab 33:30' },
    { juzNumber: 22, nameArabic: 'وَمَنْ يَقْنُتْ', startSurahId: 33, startSurahName: 'Al-Ahzab', startVerseKey: '33:31', verseRange: 'Al-Ahzab 33:31 - Ya-Sin 36:27' },
    { juzNumber: 23, nameArabic: 'وَمَا لِيَ', startSurahId: 36, startSurahName: 'Ya-Sin', startVerseKey: '36:28', verseRange: 'Ya-Sin 36:28 - Az-Zumar 39:31' },
    { juzNumber: 24, nameArabic: 'فَمَنْ أَظْلَمُ', startSurahId: 39, startSurahName: 'Az-Zumar', startVerseKey: '39:32', verseRange: 'Az-Zumar 39:32 - Fussilat 41:46' },
    { juzNumber: 25, nameArabic: 'إِلَيْهِ يُرَدُّ', startSurahId: 41, startSurahName: 'Fussilat', startVerseKey: '41:47', verseRange: 'Fussilat 41:47 - Al-Jathiyah 45:37' },
    { juzNumber: 26, nameArabic: 'حم', startSurahId: 46, startSurahName: 'Al-Ahqaf', startVerseKey: '46:1', verseRange: 'Al-Ahqaf 46:1 - Adh-Dhariyat 51:30' },
    { juzNumber: 27, nameArabic: 'قَالَ فَمَا خَطْبُكُمْ', startSurahId: 51, startSurahName: 'Adh-Dhariyat', startVerseKey: '51:31', verseRange: 'Adh-Dhariyat 51:31 - Al-Hadid 57:29' },
    { juzNumber: 28, nameArabic: 'قَدْ سَمِعَ اللَّهُ', startSurahId: 58, startSurahName: 'Al-Mujadila', startVerseKey: '58:1', verseRange: 'Al-Mujadila 58:1 - At-Tahrim 66:12' },
    { juzNumber: 29, nameArabic: 'تَبَارَكَ الَّذِي', startSurahId: 67, startSurahName: 'Al-Mulk', startVerseKey: '67:1', verseRange: 'Al-Mulk 67:1 - Al-Mursalat 77:50' },
    { juzNumber: 30, nameArabic: 'عَمَّ', startSurahId: 78, startSurahName: 'An-Naba', startVerseKey: '78:1', verseRange: 'An-Naba 78:1 - An-Nas 114:6' },
];

const SurahList: React.FC = () => {
    usePageSEO({
        title: 'Surah & Juz Index — 9M2PJU Daily Quran',
        description: 'Browse the complete 114 Surahs and 30 Juz of the Holy Quran. Read Uthmani script with translations and synchronized audio recitations.'
    });

    const navigate = useNavigate();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('surah');
    const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>('all');

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const data = await getSurahs();
                setSurahs(data);
            } catch (error) {
                console.error('Failed to fetch surahs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSurahs();
    }, []);

    const filteredSurahs = useMemo(() => {
        const query = search.toLowerCase().trim();
        return surahs.filter((s) => {
            const matchesSearch = !query ||
                s.name_simple.toLowerCase().includes(query) ||
                s.translated_name.name.toLowerCase().includes(query) ||
                s.name_arabic.includes(query) ||
                String(s.id) === query;

            const matchesPlace = revelationFilter === 'all' || s.revelation_place === revelationFilter;

            return matchesSearch && matchesPlace;
        });
    }, [search, surahs, revelationFilter]);

    const filteredJuz = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return JUZ_DATA;
        return JUZ_DATA.filter((j) =>
            String(j.juzNumber) === query ||
            j.nameArabic.includes(query) ||
            j.startSurahName.toLowerCase().includes(query) ||
            j.verseRange.toLowerCase().includes(query)
        );
    }, [search]);

    return (
        <div className="pb-16 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Quran Index</h1>
                    <p className="text-slate-400 text-sm">Explore all 114 Surahs and 30 Juz with verse-by-verse audio and translation.</p>
                </div>
                <Link to="/activity" className="self-start md:self-auto px-4 py-2 bg-[#0d2017] border border-emerald-500/20 rounded-2xl flex items-center gap-2 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40 transition-all text-xs font-semibold shadow-sm">
                    <span className="material-symbols-outlined text-lg">history</span>
                    Recent History
                </Link>
            </div>

            {/* Search & Tabs Controls */}
            <div className="bg-[#0d2017] rounded-3xl p-4 border border-emerald-500/15 shadow-xl shadow-emerald-950/40 mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 text-xl transition-colors">search</span>
                        <input
                            className="w-full bg-[#07140e] border border-emerald-500/20 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all outline-none placeholder:text-slate-500 text-sm text-white"
                            placeholder={activeTab === 'surah' ? "Search by Surah name, number (e.g. 18 or Al-Kahf)..." : "Search Juz number or starting verse..."}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white size-6 flex items-center justify-center rounded-full bg-white/5"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        )}
                    </div>

                    {/* Mode Tabs (Surah vs Juz) */}
                    <div className="flex bg-[#07140e] p-1.5 rounded-2xl border border-emerald-500/15 shrink-0">
                        {(['surah', 'juz'] as FilterTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === tab
                                    ? 'bg-emerald-500 text-[#07140e] shadow-md shadow-emerald-500/20'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {tab === 'surah' ? '114 Surahs' : '30 Juz'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub-filter for Surah: Makkah / Madinah */}
                {activeTab === 'surah' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/10 flex-wrap text-xs">
                        <span className="text-slate-400 font-medium mr-1">Filter Place:</span>
                        {(['all', 'makkah', 'madinah'] as RevelationFilter[]).map((rf) => (
                            <button
                                key={rf}
                                onClick={() => setRevelationFilter(rf)}
                                className={`px-3 py-1 rounded-full capitalize font-medium transition-all ${revelationFilter === rf
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
                                    }`}
                            >
                                {rf === 'all' ? 'All Places' : rf}
                            </button>
                        ))}
                        <span className="ml-auto text-slate-400 font-mono">
                            {filteredSurahs.length} {filteredSurahs.length === 1 ? 'Surah' : 'Surahs'} found
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            {activeTab === 'surah' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center py-24 opacity-70 flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-4xl animate-spin text-emerald-400">progress_activity</span>
                            <p className="text-slate-300 font-medium">Loading Noble Quran Chapters...</p>
                        </div>
                    ) : filteredSurahs.length > 0 ? (
                        filteredSurahs.map((surah) => (
                            <SurahCardRow key={surah.id} surah={surah} onNavigate={() => navigate(`/surah/${surah.id}`)} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-[#0d2017] rounded-3xl border border-emerald-500/15">
                            <span className="material-symbols-outlined text-5xl text-slate-600 mb-3 block">search_off</span>
                            <h3 className="text-lg font-bold text-white mb-1">No Surahs found</h3>
                            <p className="text-slate-400 text-xs">Try searching by surah number (e.g. 36) or spelling differently.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Juz Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredJuz.map((juz) => (
                        <motion.div
                            key={juz.juzNumber}
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => navigate(`/surah/${juz.startSurahId}#verse-${juz.startVerseKey}`)}
                            className="group bg-[#0d2017] border border-emerald-500/15 hover:border-emerald-500/40 rounded-3xl p-5 cursor-pointer transition-all shadow-lg hover:shadow-emerald-950/50 relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="size-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base group-hover:bg-emerald-500 group-hover:text-[#07140e] transition-colors shadow-sm">
                                    {juz.juzNumber}
                                </div>
                                <span className="font-arabic text-2xl font-bold text-emerald-400 group-hover:text-amber-400 transition-colors">
                                    {juz.nameArabic}
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Juz {juz.juzNumber}</span>
                                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                                    Starts at {juz.startSurahName}
                                </h3>
                                <p className="text-slate-400 text-xs truncate leading-relaxed">
                                    {juz.verseRange}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
                                <span>Read Juz {juz.juzNumber}</span>
                                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SurahCardRow: React.FC<{ surah: Surah; onNavigate: () => void }> = ({ surah, onNavigate }) => (
    <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onClick={onNavigate}
        className="group flex items-center gap-4 p-4 rounded-2xl bg-[#0d2017] border border-emerald-500/15 hover:border-emerald-500/40 hover:bg-[#10281d] cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg"
    >
        <div className="relative flex-shrink-0 size-12 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-base group-hover:bg-emerald-500 group-hover:text-[#07140e] transition-colors shadow-sm">
            {surah.id}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-bold truncate text-white group-hover:text-emerald-300 transition-colors">{surah.name_simple}</h4>
                <span className="font-arabic text-xl font-bold text-emerald-400/90 group-hover:text-amber-400 transition-colors" dir="rtl">{surah.name_arabic}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
                <span className="text-xs truncate">{surah.translated_name.name}</span>
                <span className="size-1 rounded-full bg-emerald-500/40"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                    {surah.verses_count} Verses
                </span>
                <span className="size-1 rounded-full bg-emerald-500/40"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 shrink-0">
                    {surah.revelation_place}
                </span>
            </div>
        </div>
        <span className="material-symbols-outlined text-slate-600 group-hover:text-emerald-400 transition-colors text-lg">
            chevron_right
        </span>
    </motion.div>
);

export default SurahList;

