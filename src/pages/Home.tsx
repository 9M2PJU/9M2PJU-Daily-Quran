import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRandomTip } from '../data/tips';
import { getRandomAyah, type Ayah } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../contexts/ProgressContext';

const Home: React.FC = () => {
    const [tipText] = useState(() => getRandomTip());
    const { translationId } = useSettings();
    const { dailyGoal, dailyProgress, streak } = useProgress();

    // --- Verse of the Day (random on every reload) ---
    const [votd, setVotd] = useState<{ ayah: Ayah; surahName: string } | null>(null);
    const [votdLoading, setVotdLoading] = useState(true);
    const [isPlayingVOTD, setIsPlayingVOTD] = useState(false);
    const [votdAudio, setVotdAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        let cancelled = false;
        setVotdLoading(true);
        getRandomAyah(translationId).then(result => {
            if (!cancelled) {
                setVotd(result);
                setVotdLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, [translationId]);

    const handlePlayVOTD = useCallback(() => {
        if (!votd) return;
        if (isPlayingVOTD && votdAudio) {
            votdAudio.pause();
            setIsPlayingVOTD(false);
            return;
        }
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${votd.ayah.id}.mp3`;
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlayingVOTD(false);
        audio.play().then(() => {
            setIsPlayingVOTD(true);
            setVotdAudio(audio);
        }).catch(err => console.error('Audio play failed:', err));
    }, [isPlayingVOTD, votdAudio, votd]);

    const handleShareVOTD = useCallback(async () => {
        if (!votd) return;
        const shareText = `${votd.ayah.text_uthmani}\n\n${votd.ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || ''}\n\n— Surah ${votd.surahName} [${votd.ayah.verse_key}]`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `Verse of the Day - ${votd.ayah.verse_key}`, text: shareText });
            } catch {
                // User cancelled
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
            } catch {
                console.error('Failed to copy');
            }
        }
    }, [votd]);

    // Daily goal ring calculations
    const progressPercent = dailyGoal > 0 ? Math.min(dailyProgress / dailyGoal, 1) : 0;
    const circumference = 2 * Math.PI * 80; // radius = 80
    const dashOffset = circumference - (progressPercent * circumference);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 lg:pb-0">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-8 space-y-6">

                {/* Verse of the Day Card */}
                <section className="relative overflow-hidden rounded-3xl bg-[#0f2416] p-8 border border-primary/20 shadow-2xl group">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">Verse of the Day</span>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePlayVOTD}
                                disabled={!votd}
                                className={`size-10 rounded-full flex items-center justify-center transition-all ${isPlayingVOTD ? 'bg-primary text-[#0a1a10]' : 'bg-white/5 hover:bg-primary hover:text-white text-slate-400'}`}
                            >
                                <span className="material-symbols-outlined text-xl fill-1">{isPlayingVOTD ? 'pause' : 'play_arrow'}</span>
                            </button>
                            <button
                                onClick={handleShareVOTD}
                                disabled={!votd}
                                className="size-10 rounded-full bg-white/5 hover:bg-primary hover:text-white text-slate-400 flex items-center justify-center transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">share</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center space-y-8 relative z-10">
                        {votdLoading ? (
                            <div className="py-12">
                                <span className="material-symbols-outlined text-3xl animate-spin text-primary">progress_activity</span>
                            </div>
                        ) : votd ? (
                            <>
                                <div className="space-y-1">
                                    <p className="text-slate-400 text-sm font-medium">Surah {votd.surahName} [{votd.ayah.verse_key}]</p>
                                </div>
                                <p className="font-arabic text-3xl md:text-5xl leading-[1.6] md:leading-[2.2] text-[#e2e8f0] drop-shadow-lg">
                                    {votd.ayah.text_uthmani}
                                </p>
                                <p className="text-slate-300 font-light italic text-lg max-w-2xl mx-auto leading-relaxed">
                                    "{votd.ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || ''}"
                                </p>
                            </>
                        ) : (
                            <p className="text-slate-500 py-8">Could not load verse. Please try again.</p>
                        )}
                    </div>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="size-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <span className="material-symbols-outlined fill-1">menu_book</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">{dailyProgress}</h3>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Pages Read Today</p>
                        </div>
                    </div>

                    <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined">target</span>
                            </div>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {dailyProgress >= dailyGoal ? '✓ Done!' : `${dailyGoal - dailyProgress} left`}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">{dailyProgress}/{dailyGoal}</h3>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Daily Goal</p>
                        </div>
                    </div>

                    <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="size-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-all">
                                <span className="material-symbols-outlined fill-1">local_fire_department</span>
                            </div>
                            <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : 'Start today!'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">{streak} 🔥</h3>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Current Streak</p>
                        </div>
                    </div>
                </div>

                {/* Continue Reading Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary fill-1">bookmark</span>
                            <h2 className="text-lg font-bold text-white">Continue Reading</h2>
                        </div>
                        <Link to="/quran" className="text-xs font-bold text-primary hover:text-white transition-colors">View All</Link>
                    </div>

                    <div className="space-y-3">
                        <Link to="/surah/36" className="group bg-[#0f2416] rounded-2xl p-4 border border-white/5 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">36</div>
                                <div>
                                    <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">Surah Yaseen</h3>
                                    <p className="text-slate-500 text-xs">Heart of the Quran</p>
                                </div>
                            </div>
                            <span className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </span>
                        </Link>

                        <Link to="/surah/67" className="group bg-[#0f2416] rounded-2xl p-4 border border-white/5 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">67</div>
                                <div>
                                    <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">Surah Al-Mulk</h3>
                                    <p className="text-slate-500 text-xs">Protection from the grave</p>
                                </div>
                            </div>
                            <span className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </span>
                        </Link>
                    </div>
                </section>
            </div>

            {/* Right Column (Sidebar Extras) */}
            <div className="lg:col-span-4 space-y-6">

                {/* Daily Goal Card with Real Data */}
                <div className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 text-center">
                    <div className="flex items-center gap-2 mb-6 text-white">
                        <span className="material-symbols-outlined text-primary fill-1">target</span>
                        <h3 className="font-bold">Daily Goal</h3>
                    </div>

                    <div className="relative size-48 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                            <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                            <circle className="text-primary transition-all duration-700" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeWidth="12" strokeLinecap="round"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">{dailyProgress}/{dailyGoal}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pages Read</span>
                        </div>
                    </div>

                    {dailyProgress >= dailyGoal ? (
                        <p className="text-primary text-sm mb-6 px-4 font-bold">🎉 Goal achieved! MashaAllah!</p>
                    ) : (
                        <p className="text-slate-400 text-sm mb-6 px-4">
                            {dailyGoal - dailyProgress} more page{dailyGoal - dailyProgress > 1 ? 's' : ''} to reach your daily goal.
                        </p>
                    )}

                    <Link to="/surah/1" className="block w-full py-3.5 bg-primary hover:bg-primary-light text-[#0a1a10] font-bold rounded-xl transition-colors shadow-lg shadow-primary/20">
                        Start Reading Now
                    </Link>

                    {/* Streak */}
                    {streak > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                            <span className="text-yellow-500">🔥</span>
                            <span className="text-slate-400">{streak} day streak!</span>
                        </div>
                    )}
                </div>

                {/* Quick Access List */}
                <div className="bg-[#0f2416] rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 mb-6 text-white max-w-full overflow-hidden">
                        <span className="material-symbols-outlined text-yellow-500 fill-1">star</span>
                        <h3 className="font-bold">Quick Access</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 36, name: 'Surah Yaseen', desc: 'Heart of Quran' },
                            { id: 55, name: 'Surah Ar-Rahman', desc: 'The Beneficent' },
                            { id: 56, name: "Surah Al-Waqi'ah", desc: 'The Inevitable' }
                        ].map((s) => (
                            <Link key={s.id} to={`/surah/${s.id}`} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="size-8 rounded bg-white/5 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">{s.id}</div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-bold text-white truncate">{s.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.desc}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 text-lg group-hover:text-white transition-colors">chevron_right</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Daily Tip */}
                <div className="bg-[#132f1e] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 -mb-6 -mr-6 text-[#1a3d28]">
                        <span className="material-symbols-outlined text-[140px] opacity-50 fill-1">lightbulb</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Daily Tip</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-1">"{tipText}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
