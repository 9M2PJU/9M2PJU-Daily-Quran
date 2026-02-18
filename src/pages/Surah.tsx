import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getSurahDetails, getAyahs, getSurahAudio, type Surah, type Ayah } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';

const SurahPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { translationId } = useSettings();
    const [surah, setSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tafsir' | 'notes'>('tafsir');

    // Mock Data for Sidebar functionality validation
    const mockTafsir = {
        scholar: "Ibn Kathir",
        text: "Regarding the statement of Allah, \"And they followed what the devils had recited...\", Ibn Jarir said that this means the devils used to write magic and talismans and bury them under the throne of Solomon.",
        insight: "Allah clarifies that magic is a trial and disbelief. Those who seek it trade their share in the Hereafter for a miserable gain."
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [surahData, ayahsData] = await Promise.all([
                    getSurahDetails(Number(id)),
                    getAyahs(Number(id), 1, 286, translationId), // Default limit for demo
                ]);
                setSurah(surahData);
                setAyahs(ayahsData);
            } catch (error) {
                console.error('Error fetching surah data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id, translationId]);

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><span className="loading loading-spinner text-primary"></span></div>;
    if (!surah) return <div className="text-center py-20 text-red-500">Failed to load Surah.</div>;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a1a10]">
            {/* Main Content (Verses) */}
            <div className="flex-1 p-6 lg:p-12 overflow-y-auto">

                {/* Header Info */}
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">
                        {surah.revelation_place} Surah
                        <span className="material-symbols-outlined text-sm">verified</span>
                    </span>

                    <h1 className="font-arabic text-6xl text-white mt-4 mb-2">{surah.name_arabic}</h1>
                    <p className="text-xl text-slate-400 font-medium">{surah.name_simple} (The Cow)</p>

                    <div className="flex justify-center items-center gap-8 mt-6 border-y border-white/5 py-4 w-full max-w-md mx-auto">
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Verse</span>
                            <span className="block text-xl font-bold text-white">102 <span className="text-slate-600 text-sm">/ {surah.verses_count}</span></span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Juz</span>
                            <span className="block text-xl font-bold text-white">1</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Font Size</span>
                            <div className="flex gap-2">
                                <span className="text-slate-500 hover:text-white cursor-pointer transition-colors text-sm">A-</span>
                                <span className="text-primary cursor-pointer font-bold">A+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bismillah */}
                <div className="text-center mb-20 relative">
                    <p className="font-arabic text-4xl text-emerald-500/80">بسم الله الرحمن الرحيم</p>
                </div>

                {/* Verses List */}
                <div className="space-y-16 max-w-3xl mx-auto">
                    {ayahs.map((ayah, index) => (
                        <div key={ayah.verse_key} className="group relative">
                            {/* Verse Number Indicator */}
                            <div className="absolute -left-12 top-2 hidden lg:flex size-8 bg-primary/10 rounded text-primary text-xs font-bold items-center justify-center border border-primary/20">
                                {ayah.verse_key.split(':')[1]}
                            </div>

                            {/* Arabic Text */}
                            <p className="text-right font-arabic text-4xl md:text-5xl leading-[2.2] text-[#e2e8f0] mb-8" style={{ fontFamily: 'Amiri, serif' }}>
                                {ayah.text_uthmani}
                            </p>

                            {/* Translation */}
                            {ayah.translations && (
                                <p className="text-lg text-slate-400 font-serif leading-relaxed">
                                    {ayah.translations[0].text.replace(/<[^>]*>/g, '')}
                                </p>
                            )}

                            {/* Action Bar (Hidden by default, shown on hover) */}
                            <div className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">play_arrow</span> Play
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">content_copy</span> Copy
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">share</span> Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar (Tafsir & Notes) */}
            <aside className="w-full lg:w-[400px] border-l border-white/5 bg-[#0a1a10] flex flex-col h-screen sticky top-0">
                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('tafsir')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors ${activeTab === 'tafsir' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}
                    >
                        Tafsir
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors ${activeTab === 'notes' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}
                    >
                        Personal Notes
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTab === 'tafsir' ? (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-white">Ibn Kathir</h3>
                                <button className="text-xs text-primary font-bold hover:underline">Change Scholar</button>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed">
                                {mockTafsir.text}
                            </p>

                            <p className="text-slate-400 text-sm leading-relaxed mt-4">
                                After Solomon's death, they brought them out and told people: "This is the source of Solomon's kingdom and power." Some people believed them and began practicing it.
                            </p>

                            {/* Key Insight Box */}
                            <div className="bg-[#11241a] rounded-xl p-4 border border-white/5 mt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm fill-1">lightbulb</span>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Key Insight</h4>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {mockTafsir.insight}
                                </p>
                            </div>

                            {/* Word Analysis */}
                            <div className="mt-8">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Word Analysis</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                        <p className="font-arabic text-xl text-primary mb-1">سِحْر</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Magic / Sihr</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                        <p className="font-arabic text-xl text-primary mb-1">ٱلشَّيَـٰطِين</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">The Devils</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            <span className="material-symbols-outlined text-4xl mb-2">edit_note</span>
                            <p className="text-sm">You haven't added any notes for this verse yet.</p>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-white/5">
                    <button className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/20 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">fullscreen</span>
                        Enable Focus Mode
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default SurahPage;
