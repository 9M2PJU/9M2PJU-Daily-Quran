import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getSurahDetails, getAyahs, getTafsir, type Surah, type Ayah, type Tafsir } from '../services/api';
import { useSettings, TAFSIRS } from '../contexts/SettingsContext';
import { useAudio } from '../contexts/AudioContext';
import { useProgress } from '../contexts/ProgressContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import { motion, AnimatePresence } from 'framer-motion';

const SurahPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { translationId, tafsirId, setTafsirId, showTranslation } = useSettings();
    const { isPlaying, currentSurah, currentVerseIndex, play, toggle, stop, registerSurah } = useAudio();
    const { incrementProgress } = useProgress();

    // Stop audio when leaving the surah page
    useEffect(() => {
        return () => { stop(); };
    }, [stop]);
    const [surah, setSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
    const [loading, setLoading] = useState(true);
    const [tafsirLoading, setTafsirLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'tafsir' | 'notes'>('tafsir');
    const [fontSize, setFontSize] = useState(3); // Scale 1-5, default 3 (maps to text sizes)

    // Default to smaller font on mobile
    useEffect(() => {
        if (window.innerWidth < 768) {
            setFontSize(0);
        }
    }, []);
    const [focusMode, setFocusMode] = useState(false);
    const [focusedVerse, setFocusedVerse] = useState(0); // index into ayahs array
    const [copiedVerse, setCopiedVerse] = useState<string | null>(null);
    const verseRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { isBookmarked, toggleBookmark, getNotesBySurah, saveNote, deleteNote, getNote, isSurahBookmarked, toggleSurahBookmark } = useBookmarks();
    const [noteText, setNoteText] = useState('');
    const [editingNoteVerse, setEditingNoteVerse] = useState<string | null>(null);
    const [isScholarSelectorOpen, setIsScholarSelectorOpen] = useState(false);

    const handleBookmarkSurah = useCallback(() => {
        if (!surah) return;
        toggleSurahBookmark({
            id: surah.id,
            name: surah.name_simple,
            englishName: surah.translated_name.name
        });
    }, [surah, toggleSurahBookmark]);


    const fontSizeClasses = [
        'text-2xl md:text-3xl leading-[1.8]',
        'text-3xl md:text-4xl leading-[2.0]',
        'text-4xl md:text-5xl leading-[2.2]',
        'text-5xl md:text-6xl leading-[2.4]',
        'text-6xl md:text-7xl leading-[2.6]',
    ];

    const translationSizeClasses = [
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl',
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            setTafsirLoading(true);
            try {
                const [surahData, ayahsData, tafsirsData] = await Promise.all([
                    getSurahDetails(Number(id)),
                    getAyahs(Number(id), 1, 604, translationId), // Fetch all verses for the surah
                    getTafsir(Number(id), tafsirId)
                ]);
                setSurah(surahData);
                setAyahs(ayahsData);
                setTafsirs(tafsirsData);
                // Track reading progress (1 page per surah visit)
                incrementProgress({ id: surahData.id, name: surahData.name_simple });
                // Register with audio context
                registerSurah(surahData.id, ayahsData.length, surahData.name_simple);
            } catch (error) {
                console.error('Error fetching surah data:', error);
            } finally {
                setLoading(false);
                setTafsirLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
        setFocusMode(false);
        setFocusedVerse(0);
    }, [id, translationId, incrementProgress, registerSurah]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update tafsir when scholar changes
    useEffect(() => {
        const updateTafsir = async () => {
            if (!id || loading) return;
            setTafsirLoading(true);
            try {
                const tafsirsData = await getTafsir(Number(id), tafsirId);
                setTafsirs(tafsirsData);
            } catch (error) {
                console.error('Error updating tafsir:', error);
            } finally {
                setTafsirLoading(false);
            }
        };
        updateTafsir();
    }, [id, tafsirId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePlaySurah = useCallback(() => {
        if (!id) return;
        const surahId = Number(id);
        toggle(surahId, ayahs.length);
    }, [id, ayahs.length, toggle]);



    const handleCopyVerse = useCallback(async (ayah: Ayah) => {
        const text = `${ayah.text_uthmani}\n\n${ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || ''}\n\n— ${surah?.name_simple} [${ayah.verse_key}]`;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedVerse(ayah.verse_key);
            setTimeout(() => setCopiedVerse(null), 2000);
        } catch {
            console.error('Failed to copy');
        }
    }, [surah]);

    const handleShareVerse = useCallback(async (ayah: Ayah) => {
        const text = `${ayah.text_uthmani}\n\n${ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || ''}\n\n— ${surah?.name_simple} [${ayah.verse_key}]`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `${surah?.name_simple} [${ayah.verse_key}]`, text });
            } catch {
                // User cancelled share
            }
        } else {
            // Fallback to copy
            await handleCopyVerse(ayah);
        }
    }, [surah, handleCopyVerse]);

    const handlePlayVerse = useCallback(async (_ayah: Ayah, index: number) => {
        if (!id) return;
        const surahId = Number(id);
        // Play from this verse onwards
        play(surahId, ayahs.length, index);
    }, [id, ayahs.length, play]);

    const scrollToFocusedVerse = useCallback((index: number) => {
        verseRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const goToNextVerse = useCallback(() => {
        setFocusedVerse(prev => {
            const next = Math.min(prev + 1, ayahs.length - 1);
            setTimeout(() => scrollToFocusedVerse(next), 50);
            return next;
        });
    }, [ayahs.length, scrollToFocusedVerse]);

    const goToPrevVerse = useCallback(() => {
        setFocusedVerse(prev => {
            const next = Math.max(prev - 1, 0);
            setTimeout(() => scrollToFocusedVerse(next), 50);
            return next;
        });
    }, [scrollToFocusedVerse]);

    const enterFocusMode = useCallback(() => {
        setFocusMode(true);
        setFocusedVerse(0);
        setTimeout(() => scrollToFocusedVerse(0), 100);
    }, [scrollToFocusedVerse]);

    // Keyboard navigation in focus mode
    useEffect(() => {
        if (!focusMode) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'j') {
                e.preventDefault();
                goToNextVerse();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'k') {
                e.preventDefault();
                goToPrevVerse();
            } else if (e.key === 'Escape') {
                setFocusMode(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [focusMode, goToNextVerse, goToPrevVerse]);

    // Auto-scroll to the currently playing verse
    useEffect(() => {
        if (!isPlaying || currentSurah !== Number(id)) return;
        verseRefs.current[currentVerseIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [currentVerseIndex, isPlaying, currentSurah, id]);

    // Deep Linking: Scroll to verse from hash on load AND Open Notes
    useEffect(() => {
        if (ayahs.length > 0 && location.hash) {
            const verseKey = location.hash.replace('#verse-', '');
            const index = ayahs.findIndex(a => a.verse_key === verseKey);
            if (index !== -1) {
                // Small delay to ensure refs are populated and layout is settled
                setTimeout(() => {
                    scrollToFocusedVerse(index);
                    setFocusedVerse(index);

                    // Auto-open notes if it's a verse link (likely from Bookmarks/Notes)
                    // We can assume if user deep links to a verse, seeing the note is helpful.
                    // Or strictly only if coming from Notes page? The user request implies "if i open note... it will open note".
                    // Since all our deep links form bookmarks/activity use this hash, let's open it.
                    setActiveTab('notes');
                    setEditingNoteVerse(verseKey);
                    const saved = getNote(verseKey);
                    setNoteText(saved?.text || '');

                }, 500);
            }
        }
    }, [ayahs, location.hash, scrollToFocusedVerse, getNote]);

    // Sidebar Scroll Sync for Notes
    useEffect(() => {
        if (activeTab !== 'notes' || ayahs.length === 0) return;

        const currentAyah = ayahs[focusedVerse];
        if (!currentAyah) return;

        // Check for dirty state (unsaved changes)
        if (editingNoteVerse) {
            const saved = getNote(editingNoteVerse);
            const originalText = saved?.text || '';
            // If text has changed, DO NOT auto-switch
            if (noteText.trim() !== originalText.trim()) {
                return;
            }
        }

        // Sync if we are on a different verse
        if (currentAyah.verse_key !== editingNoteVerse) {
            setEditingNoteVerse(currentAyah.verse_key);
            setNoteText(getNote(currentAyah.verse_key)?.text || '');
        }
    }, [focusedVerse, activeTab, ayahs, editingNoteVerse, noteText, getNote]);

    // Auto-scroll focus mode with audio playback + auto-exit after last verse
    useEffect(() => {
        if (focusMode && isPlaying && currentSurah === Number(id) && currentVerseIndex >= 0) {
            setFocusedVerse(currentVerseIndex);
            scrollToFocusedVerse(currentVerseIndex);
        }
        // Auto-exit focus mode when audio finishes on the last verse
        if (focusMode && !isPlaying && ayahs.length > 0 && focusedVerse === ayahs.length - 1 && currentSurah === Number(id)) {
            const timer = setTimeout(() => setFocusMode(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [focusMode, isPlaying, currentSurah, id, currentVerseIndex, scrollToFocusedVerse, ayahs.length, focusedVerse]);

    // Sidebar Scroll Sync: Update focusedVerse based on scroll position (when not in Focus Mode)
    useEffect(() => {
        if (focusMode || loading || ayahs.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the entry with the highest intersection ratio
                const visibleEntry = entries.reduce((prev, current) => {
                    return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
                });

                if (visibleEntry.isIntersecting && visibleEntry.intersectionRatio > 0.3) {
                    const index = Number(visibleEntry.target.getAttribute('data-index'));
                    if (!isNaN(index)) {
                        setFocusedVerse(index);
                    }
                }
            },
            {
                root: null,
                rootMargin: '-20% 0px -50% 0px', // Trigger when verse is in the top-middle of the screen
                threshold: [0.3, 0.5, 0.7]
            }
        );

        verseRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, [focusMode, loading, ayahs.length]);

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span></div>;
    if (!surah) return <div className="text-center py-20 text-red-500">Failed to load Surah.</div>;

    const isSurahPlaying = isPlaying && currentSurah === Number(id);

    return (
        <div className={`flex flex-col lg:flex-row min-h-screen bg-[#0a1a10]`}>
            {/* Main Content (Verses) */}
            <div className={`flex-1 p-6 lg:p-12 overflow-y-auto ${focusMode ? 'lg:max-w-4xl lg:mx-auto' : ''}`}>

                {/* Header Info */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-center mb-16 space-y-4"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">
                        {surah.revelation_place} Surah
                        <span className="material-symbols-outlined text-sm">verified</span>
                    </span>

                    <h1 className="font-arabic text-6xl text-white mt-4 mb-2">{surah.name_arabic}</h1>
                    <p className="text-xl text-slate-400 font-medium">{surah.name_simple} ({surah.translated_name.name})</p>

                    <div className="flex justify-center items-center gap-8 mt-6 border-y border-white/5 py-4 w-full max-w-2xl mx-auto flex-wrap md:flex-nowrap">
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Verse</span>
                            <span className="block text-xl font-bold text-white">{surah.verses_count}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                        <div className="text-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePlaySurah}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isSurahPlaying ? 'bg-primary text-[#0a1a10]' : 'bg-white/5 text-slate-400 hover:bg-primary/20 hover:text-primary'}`}
                            >
                                <span className="material-symbols-outlined fill-1">{isSurahPlaying ? 'pause' : 'play_arrow'}</span>
                                <span className="text-xs font-bold">{isSurahPlaying ? 'Pause' : 'Play'}</span>
                            </motion.button>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                        <div className="text-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBookmarkSurah}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isSurahBookmarked(Number(id)) ? 'bg-primary text-[#0a1a10]' : 'bg-white/5 text-slate-400 hover:bg-primary/20 hover:text-primary'}`}
                            >
                                <span className={`material-symbols-outlined ${isSurahBookmarked(Number(id)) ? 'fill-1' : ''}`}>bookmark</span>
                                <span className="text-xs font-bold">{isSurahBookmarked(Number(id)) ? 'Bookmarked' : 'Bookmark'}</span>
                            </motion.button>
                        </div>
                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                        <div className="text-center">
                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Font Size</span>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setFontSize(prev => Math.max(0, prev - 1))}
                                    className={`text-sm px-2 py-0.5 rounded transition-colors ${fontSize === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                                    disabled={fontSize === 0}
                                >
                                    A-
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setFontSize(prev => Math.min(4, prev + 1))}
                                    className={`text-sm px-2 py-0.5 rounded font-bold transition-colors ${fontSize === 4 ? 'text-slate-600 cursor-not-allowed' : 'text-primary hover:bg-primary/10'}`}
                                    disabled={fontSize === 4}
                                >
                                    A+
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bismillah */}
                {Number(id) !== 9 && (
                    <div className="text-center mb-20 relative">
                        <p className="font-arabic text-4xl text-emerald-500/80">بسم الله الرحمن الرحيم</p>
                    </div>
                )}

                {/* Verses List */}
                <div className="space-y-16 max-w-3xl mx-auto">
                    {ayahs.map((ayah, index) => {
                        const isFocused = !focusMode || focusedVerse === index;
                        const isDimmed = focusMode && focusedVerse !== index;
                        const isCurrentlyPlaying = isPlaying && currentSurah === Number(id) && currentVerseIndex === index;
                        return (
                            <motion.div
                                key={ayah.verse_key}
                                ref={el => { verseRefs.current[index] = el; }}
                                data-index={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index % 5 * 0.1 }}
                                onClick={() => { if (focusMode) { setFocusedVerse(index); } }}
                                className={`group relative transition-all duration-500 rounded-2xl ${isCurrentlyPlaying
                                    ? 'bg-primary/[0.06] border border-primary/40 p-6 shadow-lg shadow-primary/10'
                                    : focusMode
                                        ? isFocused
                                            ? 'bg-primary/10 border-2 border-primary/50 p-6 shadow-xl shadow-primary/10 scale-100'
                                            : 'opacity-10 scale-95 cursor-pointer hover:opacity-25 p-6'
                                        : ''
                                    }`}
                            >
                                {/* Verse Number Indicator */}
                                <div className={`absolute -left-12 top-2 hidden lg:flex size-8 rounded text-xs font-bold items-center justify-center border transition-colors ${focusMode && isFocused ? 'bg-primary text-[#0a1a10] border-primary' : 'bg-primary/10 text-primary border-primary/20'
                                    }`}>
                                    {ayah.verse_key.split(':')[1]}
                                </div>

                                {/* Focus Mode - Verse Counter */}
                                {focusMode && isFocused && (
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                                            Verse {index + 1} of {ayahs.length}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); goToPrevVerse(); }}
                                                disabled={focusedVerse === 0}
                                                className={`size-7 rounded-full flex items-center justify-center transition-colors ${focusedVerse === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                            >
                                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); goToNextVerse(); }}
                                                disabled={focusedVerse === ayahs.length - 1}
                                                className={`size-7 rounded-full flex items-center justify-center transition-colors ${focusedVerse === ayahs.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                                            >
                                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Arabic Text */}
                                <p className={`text-right font-arabic ${fontSizeClasses[fontSize]} mb-8 transition-colors duration-500`} style={{ fontFamily: 'Amiri, serif', color: isDimmed ? 'rgba(255,255,255,0.15)' : '#ffffff' }}>
                                    {ayah.text_uthmani}
                                </p>

                                {/* Translation */}
                                {showTranslation && ayah.translations && (
                                    <p className={`${translationSizeClasses[fontSize]} font-serif leading-relaxed transition-colors duration-500`} style={{ color: isDimmed ? 'rgba(148,163,184,0.3)' : '#e2e8f0' }}>
                                        {ayah.translations[0].text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '')}
                                    </p>
                                )}

                                <div className={`mt-6 flex items-center gap-3 flex-wrap transition-opacity duration-300 ${focusMode && isFocused ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100'
                                    }`}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePlayVerse(ayah, index); }}
                                        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">play_arrow</span> Play
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCopyVerse(ayah); }}
                                        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">{copiedVerse === ayah.verse_key ? 'check' : 'content_copy'}</span>
                                        {copiedVerse === ayah.verse_key ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleShareVerse(ayah); }}
                                        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">share</span> Share
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const currentlyBookmarked = isBookmarked(ayah.verse_key);
                                            toggleBookmark({
                                                verseKey: ayah.verse_key,
                                                surahId: Number(id),
                                                surahName: surah?.name_simple || '',
                                                arabicText: ayah.text_uthmani,
                                                translationText: ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || '',
                                            });

                                            if (!currentlyBookmarked) {
                                                // If adding bookmark, open inline note editor
                                                setEditingNoteVerse(ayah.verse_key);
                                                const existing = getNote(ayah.verse_key);
                                                setNoteText(existing?.text || '');
                                            } else {
                                                // If removing bookmark, ensure note editor is closed
                                                if (editingNoteVerse === ayah.verse_key) {
                                                    setEditingNoteVerse(null);
                                                    setNoteText('');
                                                }
                                            }
                                        }}
                                        className={`flex items-center gap-2 text-xs font-bold transition-colors ${isBookmarked(ayah.verse_key) ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg fill-1">{isBookmarked(ayah.verse_key) ? 'bookmark' : 'bookmark_border'}</span>
                                        {isBookmarked(ayah.verse_key) ? 'Saved' : 'Bookmark'}
                                    </button>

                                    {/* Edit Note Button (Visible only if bookmarked) */}
                                    {isBookmarked(ayah.verse_key) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (editingNoteVerse === ayah.verse_key) {
                                                    setEditingNoteVerse(null);
                                                } else {
                                                    setEditingNoteVerse(ayah.verse_key);
                                                    const existing = getNote(ayah.verse_key);
                                                    setNoteText(existing?.text || '');
                                                }
                                            }}
                                            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors ml-2"
                                            title="Add/Edit Note"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit_note</span>
                                        </button>
                                    )}
                                </div>

                                {/* Inline Personal Note Editor */}
                                {editingNoteVerse === ayah.verse_key && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="mt-4 bg-[#11241a] border border-white/10 rounded-xl p-4 animate-fadeIn"
                                    >
                                        <p className="text-xs text-primary font-bold mb-2">Personal Note</p>
                                        <textarea
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            placeholder="Write your reflection..."
                                            className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 min-h-[80px] resize-y mb-3"
                                            autoFocus
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => { setEditingNoteVerse(null); setNoteText(''); }}
                                                className="py-1.5 px-3 rounded-lg border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (noteText.trim()) {
                                                        saveNote({
                                                            verseKey: ayah.verse_key,
                                                            surahId: Number(id),
                                                            surahName: surah?.name_simple || '',
                                                            text: noteText.trim(),
                                                        });
                                                        // Ensure bookmark exists (redundant if triggered by bookmark, but safe)
                                                        if (!isBookmarked(ayah.verse_key)) {
                                                            toggleBookmark({
                                                                verseKey: ayah.verse_key,
                                                                surahId: Number(id),
                                                                surahName: surah?.name_simple || '',
                                                                arabicText: ayah.text_uthmani,
                                                                translationText: ayah.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || '',
                                                            });
                                                        }
                                                    }
                                                    setEditingNoteVerse(null);
                                                    setNoteText('');
                                                }}
                                                className="py-1.5 px-4 rounded-lg bg-primary text-[#0a1a10] text-xs font-bold uppercase tracking-wider hover:bg-primary-light transition-colors"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Display Saved Note Inline (Optional but helpful) */}
                                {isBookmarked(ayah.verse_key) && getNote(ayah.verse_key) && editingNoteVerse !== ayah.verse_key && (
                                    <div className="mt-4 pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-yellow-500 text-xs">sticky_note_2</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Note</span>
                                        </div>
                                        <p className="text-sm text-slate-300 italic pl-5 border-l-2 border-white/10">
                                            "{getNote(ayah.verse_key)?.text}"
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Right Sidebar (Tafsir & Notes) - Hidden in Focus Mode */}
            {!focusMode && (
                <aside className="hidden lg:flex w-[400px] border-l border-white/5 bg-[#0a1a10] flex-col h-screen sticky top-0">
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
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-white text-lg">{TAFSIRS.find(s => s.id === tafsirId)?.scholar}</h3>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{TAFSIRS.find(s => s.id === tafsirId)?.name}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsScholarSelectorOpen(true)}
                                        className="text-xs text-primary font-bold px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/5 transition-all"
                                    >
                                        Change Scholar
                                    </button>
                                </div>

                                {tafsirLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                                        <span className="material-symbols-outlined animate-spin text-3xl mb-4 text-primary/40">progress_activity</span>
                                        <p className="text-xs uppercase font-bold tracking-widest">Fetching Exegesis...</p>
                                    </div>
                                ) : tafsirs.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="bg-[#11241a] rounded-xl p-4 border border-white/5">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Verse {ayahs[focusedVerse]?.verse_key}</p>
                                            <div
                                                className="text-slate-300 text-sm leading-relaxed tafsir-content"
                                                dangerouslySetInnerHTML={{ __html: tafsirs.find(t => t.verse_key === ayahs[focusedVerse]?.verse_key)?.text || 'No tafsir available for this verse.' }}
                                            />
                                        </div>

                                        {/* Quick Insight (Dynamic from text if possible, or static tip) */}
                                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="material-symbols-outlined text-primary text-sm fill-1">info</span>
                                                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Note</h4>
                                            </div>
                                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                                Tafsir (exegesis) provides depth and context to the words of Allah. Use "Change Scholar" to compare different analytical perspectives.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-600">
                                        <span className="material-symbols-outlined text-4xl mb-2">auto_stories</span>
                                        <p className="text-sm">No tafsir data found for this surah.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4">
                                {/* Add/Edit Note Form */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                            {editingNoteVerse ? `Note for Verse ${editingNoteVerse}` : 'Personal Notes'}
                                        </label>
                                        {!editingNoteVerse && (
                                            <p className="text-[10px] text-slate-500 italic">Select "Add Note" on a verse to write.</p>
                                        )}
                                    </div>

                                    {editingNoteVerse ? (
                                        <div className="bg-[#11241a] border border-white/10 rounded-xl p-4">
                                            <p className="text-xs text-primary font-bold mb-2">Writing note for {editingNoteVerse}</p>
                                            <textarea
                                                value={noteText}
                                                onChange={(e) => setNoteText(e.target.value)}
                                                placeholder="Write your reflection or note..."
                                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 min-h-[120px] resize-y mb-3"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (noteText.trim() && editingNoteVerse) {
                                                            saveNote({
                                                                verseKey: editingNoteVerse,
                                                                surahId: Number(id),
                                                                surahName: surah?.name_simple || '',
                                                                text: noteText.trim(),
                                                            });

                                                            // Auto-bookmark if not already saved (to capture Arabic/Translation for the merged view)
                                                            if (!isBookmarked(editingNoteVerse)) {
                                                                const verseData = ayahs.find(a => a.verse_key === editingNoteVerse);
                                                                if (verseData) {
                                                                    toggleBookmark({
                                                                        verseKey: editingNoteVerse,
                                                                        surahId: Number(id),
                                                                        surahName: surah?.name_simple || '',
                                                                        arabicText: verseData.text_uthmani,
                                                                        translationText: verseData.translations?.[0]?.text.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]*>/g, '') || '',
                                                                    });
                                                                }
                                                            }

                                                            setNoteText('');
                                                            setEditingNoteVerse(null);
                                                        }
                                                    }}
                                                    disabled={!noteText.trim()}
                                                    className="flex-1 py-2 rounded-lg bg-primary text-[#0a1a10] text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
                                                >
                                                    Save Note
                                                </button>
                                                <button
                                                    onClick={() => { setEditingNoteVerse(null); setNoteText(''); }}
                                                    className="py-2 px-4 rounded-lg border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white/5 rounded-xl p-6 text-center border border-white/5 border-dashed">
                                            <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">edit_note</span>
                                            <p className="text-xs text-slate-500">Tap "Add Note" on any verse to start writing a personal reflection.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Existing Notes for This Surah */}
                                {getNotesBySurah(Number(id)).length > 0 && (
                                    <div className="border-t border-white/5 pt-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Notes</h4>
                                        <div className="space-y-3">
                                            {getNotesBySurah(Number(id)).sort((a, b) => b.timestamp - a.timestamp).map((note) => (
                                                <div key={note.verseKey} className="bg-[#11241a] rounded-xl p-4 border border-white/5 group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Verse {note.verseKey}</span>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingNoteVerse(note.verseKey);
                                                                    setNoteText(note.text);
                                                                    // Scroll to verse
                                                                    const index = ayahs.findIndex(a => a.verse_key === note.verseKey);
                                                                    if (index !== -1) scrollToFocusedVerse(index);
                                                                }}
                                                                className="text-slate-500 hover:text-white transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => deleteNote(note.verseKey)}
                                                                className="text-slate-500 hover:text-red-400 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
                                                    <span className="text-[10px] text-slate-600 mt-2 block">{new Date(note.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {getNotesBySurah(Number(id)).length === 0 && !editingNoteVerse && (
                                    <div className="text-center py-12 text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 block">edit_note</span>
                                        <p className="text-sm">Select a verse above to add your first note.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={enterFocusMode}
                            className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/20 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">fullscreen</span>
                            Enable Focus Mode
                        </button>
                    </div>
                </aside>
            )}


            {/* Focus Mode Controls */}
            {focusMode && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
                    {/* Prev/Next Navigation */}
                    <div className="flex items-center gap-1 bg-[#0f2416] border border-white/10 rounded-full px-2 py-1.5 shadow-xl">
                        <button
                            onClick={goToPrevVerse}
                            disabled={focusedVerse === 0}
                            className={`size-9 rounded-full flex items-center justify-center transition-colors ${focusedVerse === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-lg">keyboard_arrow_up</span>
                        </button>
                        <span className="text-xs font-bold text-slate-400 px-2 min-w-[3rem] text-center">
                            {focusedVerse + 1}/{ayahs.length}
                        </span>
                        <button
                            onClick={goToNextVerse}
                            disabled={focusedVerse === ayahs.length - 1}
                            className={`size-9 rounded-full flex items-center justify-center transition-colors ${focusedVerse === ayahs.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                        </button>
                    </div>

                    {/* Exit Button */}
                    <button
                        onClick={() => setFocusMode(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-[#0a1a10] font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
                    >
                        <span className="material-symbols-outlined text-base">fullscreen_exit</span>
                        Exit
                    </button>
                </div>
            )
            }

            {/* Mobile Audio Player Bar */}
            {isSurahPlaying && (
                <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40 bg-[#0f2416]/95 backdrop-blur-xl rounded-2xl border border-primary/30 p-3 shadow-2xl shadow-primary/20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePlaySurah}
                            className="size-10 bg-primary rounded-full flex items-center justify-center shrink-0"
                        >
                            <span className="material-symbols-outlined text-[#0a1a10] fill-1">{isSurahPlaying ? 'pause' : 'play_arrow'}</span>
                        </button>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{surah.name_simple}</p>
                            <p className="text-[10px] text-slate-400">Verse {currentVerseIndex + 1} of {ayahs.length}</p>
                        </div>
                        <button
                            onClick={stop}
                            className="size-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Scholar Selector Modal */}
            <AnimatePresence>
                {isScholarSelectorOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsScholarSelectorOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md bg-[#0a1a10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Select Scholar</h3>
                                    <p className="text-xs text-slate-500">Pick a source for Tafsir/Interpretation</p>
                                </div>
                                <button
                                    onClick={() => setIsScholarSelectorOpen(false)}
                                    className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-2 overflow-y-auto max-h-[60vh]">
                                {TAFSIRS.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setTafsirId(s.id);
                                            setIsScholarSelectorOpen(false);
                                        }}
                                        className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all ${tafsirId === s.id
                                            ? 'bg-primary/10 border border-primary/20'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${tafsirId === s.id ? 'bg-primary text-[#0a1a10]' : 'bg-white/5 text-slate-500'
                                            }`}>
                                            <span className="material-symbols-outlined">menu_book</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold transition-colors ${tafsirId === s.id ? 'text-primary' : 'text-white'}`}>
                                                {s.scholar}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">{s.name}</p>
                                        </div>
                                        {tafsirId === s.id && (
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 bg-white/5 text-center">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">More scholars coming soon</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default SurahPage;
