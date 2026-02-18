import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSurahDetails, getAyahs, getSurahAudio, type Surah, type Ayah } from '../services/api';
import { ArrowLeft, Play, Pause, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

const SurahPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { translationId } = useSettings();
    const [surah, setSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [loading, setLoading] = useState(true);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (surah && ayahs.length > 0) {
            localStorage.setItem('daily-quran-last-read', JSON.stringify({
                surahId: surah.id,
                surahName: surah.name_simple,
                timestamp: Date.now()
            }));
        }
    }, [surah, ayahs]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [surahData, ayahsData, audio] = await Promise.all([
                    getSurahDetails(Number(id)),
                    getAyahs(Number(id), 1, 286, translationId),
                    getSurahAudio(Number(id))
                ]);
                setSurah(surahData);
                setAyahs(ayahsData);
                setAudioUrl(audio);
            } catch (error) {
                console.error('Error fetching surah data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
        setIsPlaying(false);
    }, [id, translationId]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                setIsLoadingAudio(true);
                playPromise
                    .then(() => setIsLoadingAudio(false))
                    .catch(error => {
                        console.error("Audio playback error:", error);
                        setIsLoadingAudio(false);
                    });
            }
        }
        setIsPlaying(!isPlaying);
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading noble verses...</div>;
    if (!surah) return <div className="text-center py-20 text-red-500">Failed to load Surah.</div>;

    return (
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8 pb-32"
        >
            {/* Header Info */}
            <div className="text-center space-y-4 py-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -z-10"></div>
                <Link to="/" className="inline-flex items-center text-sm mb-4 px-4 py-2 rounded-full glass hover:bg-white/50 transition-colors text-emerald-700 dark:text-emerald-400">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Index
                </Link>
                <h1 className="text-5xl font-bold font-serif text-slate-800 dark:text-slate-100">{surah.name_simple}</h1>
                <p className="text-2xl font-arabic mt-2 text-emerald-600 dark:text-emerald-400">{surah.name_arabic}</p>
                <div className="flex justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span className="uppercase tracking-widest">{surah.revelation_place}</span>
                    <span className="text-emerald-300">•</span>
                    <span>{surah.verses_count} Verses</span>
                </div>
            </div>

            {/* Bismillah */}
            <div className="text-center py-8 glass rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <p className="font-arabic text-4xl leading-loose text-slate-800 dark:text-slate-200 relative z-10">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
            </div>

            {/* Ayahs */}
            <div className="space-y-6">
                {ayahs.map((ayah, index) => (
                    <motion.div
                        key={ayah.verse_key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass p-8 rounded-3xl hover:shadow-gold transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-dashed border-emerald-500/20 pb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono border border-emerald-100 dark:border-emerald-800/50">
                                {ayah.verse_key.split(':')[1]}
                            </div>
                            <div className="text-xs text-slate-400">Verse {ayah.verse_key}</div>
                        </div>

                        <p className="font-arabic text-4xl text-right leading-[2.5] mb-8 text-slate-800 dark:text-slate-100 px-2" style={{ fontFamily: 'Amiri, serif' }}>
                            {ayah.text_uthmani}
                        </p>

                        {ayah.translations && (
                            <div className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-serif border-l-4 border-emerald-500/30 pl-6 py-2">
                                {ayah.translations[0].text.replace(/<[^>]*>/g, '')}
                            </div>
                        )}

                        <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Future: Actions like share/copy could go here */}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Sticky Audio Player */}
            {audioUrl && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg glass rounded-2xl shadow-2xl border-t border-white/20 p-4 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Now Playing</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{surah.name_simple} - Mishary Alafasy</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                disabled={isLoadingAudio}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all"
                            >
                                {isLoadingAudio ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-5 h-5 fill-current" />
                                ) : (
                                    <Play className="w-5 h-5 fill-current ml-1" />
                                )}
                            </button>
                        </div>
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onEnded={handleAudioEnded}
                            onError={(e) => console.error("Audio error", e)}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SurahPage;
