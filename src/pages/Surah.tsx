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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8 pb-32"
        >
            {/* Header Info */}
            <div className="text-center space-y-2 border-b pb-6 dark:border-gray-700">
                <Link to="/" className="inline-flex items-center text-sm mb-4 hover:underline text-emerald-600">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Index
                </Link>
                <h1 className="text-4xl font-bold font-serif" style={{ color: 'var(--color-primary)' }}>{surah.name_simple}</h1>
                <p className="text-xl font-arabic mt-2" style={{ color: 'var(--color-gold-dark)' }}>{surah.name_arabic}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                    <span>{surah.revelation_place.toUpperCase()}</span>
                    <span>•</span>
                    <span>{surah.verses_count} Verses</span>
                </div>
            </div>

            {/* Bismillah */}
            <div className="text-center py-6">
                <p className="font-arabic text-3xl" style={{ color: 'var(--color-text)' }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
            </div>

            {/* Ayahs */}
            <div className="space-y-6">
                {ayahs.map((ayah, index) => (
                    <motion.div
                        key={ayah.verse_key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:border dark:border-gray-700"
                    >
                        <div className="flex justify-between items-start mb-4 border-b border-dashed pb-4 dark:border-gray-700">
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 text-xs px-2 py-1 rounded-full font-mono">
                                {ayah.verse_key}
                            </span>
                        </div>

                        <p className="font-arabic text-3xl text-right leading-[2.5] mb-6" style={{ color: 'var(--color-text)' }}>
                            {ayah.text_uthmani}
                        </p>

                        {ayah.translations && (
                            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-serif">
                                {ayah.translations[0].text.replace(/<[^>]*>/g, '')}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Sticky Audio Player */}
            {audioUrl && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t dark:border-gray-700 p-4 shadow-lg z-50">
                    <div className="max-w-4xl mx-auto flex items-center justify-between transition-all duration-300">
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Now Reciting</p>
                            <p className="text-xs text-gray-500">Mishary Rashid Alafasy</p>
                        </div>

                        <div className="flex items-center gap-4 flex-1 md:flex-none justify-center">
                            <button
                                onClick={togglePlay}
                                disabled={isLoadingAudio}
                                className="w-14 h-14 flex items-center justify-center rounded-full text-white shadow-lg transform active:scale-95 transition-all hover:scale-105"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                {isLoadingAudio ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-6 h-6 fill-current" />
                                ) : (
                                    <Play className="w-6 h-6 fill-current ml-1" />
                                )}
                            </button>
                            <audio
                                ref={audioRef}
                                src={audioUrl}
                                onEnded={handleAudioEnded}
                                onError={(e) => console.error("Audio error", e)}
                            />
                        </div>

                        <div className="hidden md:block w-32"></div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SurahPage;
