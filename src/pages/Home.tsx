import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRandomTip } from '../data/tips';
import { getRandomAyah, type Ayah } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../contexts/ProgressContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { usePrayerTimesCache } from '../hooks/usePrayerTimesCache';
import { usePageSEO } from '../hooks/usePageSEO';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    usePageSEO({
        title: '9M2PJU Daily Quran — Read, Listen & Study the Holy Quran',
        description: 'Read and listen to the Holy Quran daily with Uthmani Arabic script, English and Malay translations, high quality audio recitations, JAKIM prayer times, and Qibla compass.'
    });

    const [tipText] = useState(() => getRandomTip());
    const { translationId } = useSettings();
    const { dailyGoal, dailyProgress, streak, readHistory } = useProgress();

    // Prefetch prayer times in background so Prayer Times page loads instantly
    const { latitude, longitude } = useGeolocation();
    usePrayerTimesCache(latitude, longitude);

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
        const shareText = `${votd.ayah.text_uthmani}\n\n${votd.ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || ''}\n\n— Surah ${votd.surahName} [${votd.ayah.verse_key}]\nVia https://quran.hamradio.my/`;
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
                <motion.section
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d2017] via-[#0f281d] to-[#0a1c13] p-8 border border-emerald-500/25 shadow-2xl shadow-emerald-950/60 group"
                >
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold tracking-widest uppercase border border-emerald-500/30 shadow-sm">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Verse of the Day
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePlayVOTD}
                                disabled={!votd}
                                className={`size-10 rounded-full flex items-center justify-center transition-all ${isPlayingVOTD ? 'bg-emerald-500 text-[#07140e] shadow-lg shadow-emerald-500/30' : 'bg-white/5 hover:bg-emerald-500 hover:text-[#07140e] text-slate-300 border border-emerald-500/15'}`}
                                title={isPlayingVOTD ? 'Pause Audio' : 'Listen to Recitation'}
                            >
                                <span className="material-symbols-outlined text-xl fill-1">{isPlayingVOTD ? 'pause' : 'play_arrow'}</span>
                            </button>
                            <button
                                onClick={handleShareVOTD}
                                disabled={!votd}
                                className="size-10 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-[#07140e] text-slate-300 border border-emerald-500/15 flex items-center justify-center transition-all"
                                title="Share Verse"
                            >
                                <span className="material-symbols-outlined text-xl">share</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center space-y-6 relative z-10">
                        {votdLoading ? (
                            <div className="py-16">
                                <span className="material-symbols-outlined text-3xl animate-spin text-emerald-400">progress_activity</span>
                            </div>
                        ) : votd ? (
                            <>
                                <div className="space-y-1">
                                    <p className="text-amber-400/90 text-sm font-semibold tracking-wide">Surah {votd.surahName} • [{votd.ayah.verse_key}]</p>
                                </div>
                                <p className="font-arabic text-3xl md:text-5xl leading-[1.8] md:leading-[2.4] text-white drop-shadow-md px-2" dir="rtl">
                                    {votd.ayah.text_uthmani}
                                </p>
                                <p className="text-slate-300 font-serif italic text-base md:text-lg max-w-2xl mx-auto leading-relaxed border-t border-emerald-500/10 pt-4">
                                    "{votd.ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || ''}"
                                </p>
                            </>
                        ) : (
                            <p className="text-slate-400 py-8">Could not load verse. Please check your connection.</p>
                        )}
                    </div>
                </motion.section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0d2017] rounded-2xl p-5 border border-emerald-500/15 hover:border-emerald-500/35 transition-all group shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <span className="material-symbols-outlined fill-1">menu_book</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-0.5">{dailyProgress}</h3>
                            <p className="text-xs text-slate-400 font-medium">Pages Read Today</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#0d2017] rounded-2xl p-5 border border-emerald-500/15 hover:border-emerald-500/35 transition-all group shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-[#07140e] transition-all">
                                <span className="material-symbols-outlined">target</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                {dailyProgress >= dailyGoal ? '✓ Goal Met' : `${dailyGoal - dailyProgress} left`}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-0.5">{dailyProgress}/{dailyGoal}</h3>
                            <p className="text-xs text-slate-400 font-medium">Daily Target</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#0d2017] rounded-2xl p-5 border border-emerald-500/15 hover:border-emerald-500/35 transition-all group shadow-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-[#07140e] transition-all">
                                <span className="material-symbols-outlined fill-1">local_fire_department</span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                                {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : 'Start today'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-0.5">{streak} Days</h3>
                            <p className="text-xs text-slate-400 font-medium">Reading Streak</p>
                        </div>
                    </motion.div>
                </div>

                {/* Continue Reading / Suggested Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-400 fill-1">
                                {readHistory.length > 0 ? 'history' : 'lightbulb'}
                            </span>
                            <h2 className="text-lg font-bold text-white">
                                {readHistory.length > 0 ? 'Continue Reading' : 'Suggested Surahs'}
                            </h2>
                        </div>
                        <Link to="/quran" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">View All Surahs →</Link>
                    </div>

                    <div className="space-y-3">
                        {readHistory.length > 0 ? (
                            readHistory.slice(0, 3).map((historyItem) => (
                                <Link key={historyItem.timestamp} to={`/surah/${historyItem.id}`} className="group bg-[#0d2017] rounded-2xl p-4 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:bg-emerald-500 group-hover:text-[#07140e] transition-colors">
                                            {historyItem.id}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Surah {historyItem.name}</h3>
                                            <p className="text-slate-400 text-xs">
                                                Last read: {new Date(historyItem.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="size-10 rounded-full border border-emerald-500/20 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-[#07140e] transition-all">
                                        <span className="material-symbols-outlined">play_arrow</span>
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <>
                                <Link to="/surah/36" className="group bg-[#0d2017] rounded-2xl p-4 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:bg-emerald-500 group-hover:text-[#07140e] transition-colors">36</div>
                                        <div>
                                            <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Surah Yaseen</h3>
                                            <p className="text-slate-400 text-xs">Heart of the Quran</p>
                                        </div>
                                    </div>
                                    <span className="size-10 rounded-full border border-emerald-500/20 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-[#07140e] transition-all">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </span>
                                </Link>

                                <Link to="/surah/67" className="group bg-[#0d2017] rounded-2xl p-4 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:bg-emerald-500 group-hover:text-[#07140e] transition-colors">67</div>
                                        <div>
                                            <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Surah Al-Mulk</h3>
                                            <p className="text-slate-400 text-xs">Protection in the grave</p>
                                        </div>
                                    </div>
                                    <span className="size-10 rounded-full border border-emerald-500/20 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-[#07140e] transition-all">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </span>
                                </Link>
                            </>
                        )}
                    </div>
                </section>
            </div>

            {/* Right Column (Sidebar Extras) */}
            <div className="lg:col-span-4 space-y-6">

                {/* Daily Goal Card with Real Data */}
                <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#0d2017] rounded-3xl p-6 border border-emerald-500/15 text-center shadow-lg"
                >
                    <div className="flex items-center justify-center gap-2 mb-6 text-white">
                        <span className="material-symbols-outlined text-emerald-400 fill-1">target</span>
                        <h3 className="font-bold">Daily Reading Goal</h3>
                    </div>

                    <div className="relative size-48 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                            <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                            <motion.circle
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: dashOffset }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="text-emerald-400"
                                cx="96"
                                cy="96"
                                fill="transparent"
                                r="80"
                                stroke="currentColor"
                                strokeDasharray={circumference}
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">{dailyProgress}/{dailyGoal}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pages Read</span>
                        </div>
                    </div>

                    {dailyProgress >= dailyGoal ? (
                        <p className="text-emerald-400 text-sm mb-6 px-4 font-bold">🎉 Goal achieved today! MashaAllah!</p>
                    ) : (
                        <p className="text-slate-300 text-sm mb-6 px-4">
                            {dailyGoal - dailyProgress} more page{dailyGoal - dailyProgress > 1 ? 's' : ''} to reach your daily goal.
                        </p>
                    )}

                    <Link to="/surah/1" className="block w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#07140e] font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]">
                        Start Reading Now
                    </Link>

                    {/* Streak */}
                    {streak > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                            <span className="text-amber-400 font-bold">🔥 {streak} Day Streak</span>
                        </div>
                    )}
                </motion.div>

                {/* Quick Access List */}
                <div className="bg-[#0d2017] rounded-3xl p-6 border border-emerald-500/15 shadow-lg">
                    <div className="flex items-center gap-2 mb-6 text-white max-w-full overflow-hidden">
                        <span className="material-symbols-outlined text-amber-400 fill-1">star</span>
                        <h3 className="font-bold">Quick Access</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: 36, name: 'Surah Yaseen', desc: 'Heart of the Quran' },
                            { id: 67, name: 'Surah Al-Mulk', desc: 'Protection from the grave' },
                            { id: 18, name: 'Surah Al-Kahf', desc: 'Read every Friday' },
                            { id: 55, name: 'Surah Ar-Rahman', desc: 'The Beneficent' },
                            { id: 56, name: "Surah Al-Waqi'ah", desc: 'Protection from poverty' },
                            { id: 2, name: 'Ayatul Kursi', desc: 'Greatest verse (2:255)', path: '/surah/2#verse-2:255' }
                        ].map((s) => (
                            <Link key={s.name} to={s.path || `/surah/${s.id}`} className="flex items-center justify-between group cursor-pointer p-2.5 rounded-xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center gap-3.5">
                                    <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400 group-hover:bg-emerald-500 group-hover:text-[#07140e] transition-colors">{s.id}</div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{s.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.desc}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 text-lg group-hover:text-emerald-400 transition-colors">chevron_right</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Daily Tip */}
                <div className="bg-gradient-to-br from-[#0e271a] to-[#0a1f14] rounded-3xl p-6 border border-emerald-500/20 relative overflow-hidden shadow-lg">
                    <div className="absolute bottom-0 right-0 -mb-6 -mr-6 text-emerald-500/10">
                        <span className="material-symbols-outlined text-[140px] fill-1">lightbulb</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">lightbulb</span>
                            Daily Reflection
                        </h3>
                        <p className="text-slate-200 text-sm leading-relaxed italic">"{tipText}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

