import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSurahs, type Surah } from '../services/api';

type FilterTab = 'surah' | 'juz';

const SurahList: React.FC = () => {
    const navigate = useNavigate();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('surah');

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const data = await getSurahs();
                setSurahs(data);
                setFilteredSurahs(data);
            } catch (error) {
                console.error('Failed to fetch surahs', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSurahs();
    }, []);

    useEffect(() => {
        const query = search.toLowerCase();
        const filtered = surahs.filter(
            (s) =>
                s.name_simple.toLowerCase().includes(query) ||
                s.translated_name.name.toLowerCase().includes(query) ||
                String(s.id).includes(query)
        );
        setFilteredSurahs(filtered);
    }, [search, surahs]);

    // Grouping for Juz tab
    const juzGroups = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => i + 1);
    }, []);

    return (
        <div className="pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Surah Index</h1>
                <Link to="/activity" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined">history</span>
                </Link>
            </div>

            {/* Search */}
            <div className="relative group mb-4">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 text-xl">search</span>
                <input
                    className="w-full bg-primary/5 border border-primary/20 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm"
                    placeholder="Search Surah or Juz..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-primary/10 mb-4">
                {['surah', 'juz'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as FilterTab)}
                        className={`pb-2 border-b-2 font-semibold text-sm transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary/70'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'surah' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="col-span-full text-center py-20 opacity-50 flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
                            <p>Loading the Noble Quran index...</p>
                        </div>
                    ) : filteredSurahs.map((surah) => (
                        <SurahRow key={surah.id} surah={surah} onNavigate={() => navigate(`/surah/${surah.id}`)} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {juzGroups.map((j) => (
                        <div
                            key={j}
                            className="bg-[#0f2416] border border-white/5 rounded-2xl p-6 text-center hover:border-primary/50 transition-all cursor-not-allowed group"
                        >
                            <span className="block text-3xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{j}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Juz</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SurahRow: React.FC<{ surah: Surah; onNavigate: () => void }> = ({ surah, onNavigate }) => (
    <div
        onClick={onNavigate}
        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 cursor-pointer transition-all duration-300 relative overflow-hidden bg-white/5 lg:bg-transparent lg:hover:shadow-lg lg:hover:shadow-primary/5"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 group-hover:text-primary/40 transition-colors">hexagon</span>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{surah.id}</span>
        </div>
        <div className="flex-1 min-w-0 relative">
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-bold truncate text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{surah.name_simple}</h4>
                <span className="font-arabic text-xl font-bold text-slate-400 group-hover:text-primary/80 transition-colors">{surah.name_arabic}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="material-symbols-outlined text-[14px] text-slate-500">
                        {surah.revelation_place === 'makkah' ? 'location_on' : 'apartment'}
                    </span>
                    {surah.revelation_place}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{surah.verses_count} Verses</span>
            </div>
        </div>
        <span className="material-symbols-outlined text-slate-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            arrow_forward_ios
        </span>
    </div>
);

export default SurahList;
