import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom';
import {
    useSettings,
    RECITERS
} from '../contexts/SettingsContext';
import { getSurahs, type Surah } from '../services/api';
import { useAudio } from '../contexts/AudioContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNotifications } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isReadingMode = location.pathname.startsWith('/surah/');
    const { isPlaying, toggle, playNext, playPrevious, currentSurah, currentVerseIndex, activeSurahInfo } = useAudio();
    const { reciterId } = useSettings();
    const { lastReadSurah, streak } = useProgress();
    const { unreadCount } = useNotifications();

    const [searchQuery, setSearchQuery] = useState('');
    const [surahs, setSurahs] = useState<Surah[]>([]);

    useEffect(() => {
        getSurahs().then(setSurahs).catch(console.error);
    }, []);

    const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
        if ('key' in e && e.key !== 'Enter') return;
        e.preventDefault();

        const query = searchQuery.trim();
        if (!query) return;

        // If numeric, go to surah ID
        const id = parseInt(query, 10);
        if (!isNaN(id) && id >= 1 && id <= 114) {
            navigate(`/surah/${id}`);
            setSearchQuery('');
        }
        // Basic name matching could be added here if we had surah names list
    };

    const currentReciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
    const surahName = isPlaying ? (activeSurahInfo?.name || lastReadSurah?.name || 'Quran') : (activeSurahInfo?.name || lastReadSurah?.name || 'Quran');

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const SidebarItem = ({ to, icon, label, collapsed = false }: { to: string, icon: string, label: string, collapsed?: boolean }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(to)
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
            title={collapsed ? label : ''}
        >
            <span className={`material-symbols-outlined text-2xl ${isActive(to) ? 'fill-1' : ''}`}>{icon}</span>
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
            {!collapsed && isActive(to) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(17,212,66,0.5)]"></div>}
        </Link>
    );

    return (
        <div className="min-h-screen flex bg-[#0a1a10] text-white font-sans selection:bg-primary/30">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex fixed top-0 left-0 bottom-0 flex-col border-r border-white/5 bg-[#0a1a10] z-50 transition-all duration-300 ${isReadingMode ? 'w-20 p-4' : 'w-72 p-6'
                    }`}
            >
                {/* Logo */}
                <div className={`flex items-center gap-3 mb-10 ${isReadingMode ? 'justify-center' : 'px-2'}`}>
                    <img src="/logo.png" alt="9M2PJU Daily Quran" className="size-10 rounded-xl shadow-lg shadow-primary/20 shrink-0 object-cover" />
                    {!isReadingMode && (
                        <div className="overflow-hidden">
                            <h1 className="text-base font-bold leading-tight whitespace-nowrap">9M2PJU Daily Quran</h1>
                            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase leading-snug">"Guide us to the straight path." — Surah Al-Fatihah 1:6</p>
                        </div>
                    )}
                </div>

                {/* Main Nav */}
                <nav className="flex-1 space-y-2">
                    <SidebarItem to="/" icon="dashboard" label="Dashboard" collapsed={isReadingMode} />
                    <SidebarItem to="/library" icon="auto_stories" label="Library" collapsed={isReadingMode} />
                    <SidebarItem to="/quran" icon="format_list_bulleted" label="Surah Index" collapsed={isReadingMode} />
                    <SidebarItem to="/bookmarks" icon="bookmark" label="Bookmarks" collapsed={isReadingMode} />
                    <SidebarItem to="/activity" icon="history" label="Recent Activity" collapsed={isReadingMode} />
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto space-y-6">
                    {!isReadingMode && (
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                            {/* Streak Card Content (Hidden in collapsed mode) */}
                            <div className="flex justify-between items-end mb-2 relative z-10">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Streak</span>
                                <span className="text-lg font-bold text-primary">{streak} Days</span>
                            </div>
                            <div className="flex gap-1 h-1.5 relative z-10">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className={`flex-1 rounded-full ${i < streak % 7 || (streak > 0 && streak % 7 === 0) ? 'bg-primary' : 'bg-white/10'}`}></div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link to="/settings" className={`flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 ${isReadingMode ? 'justify-center' : ''}`}>
                        <span className="material-symbols-outlined">settings</span>
                        {!isReadingMode && <span className="text-sm font-medium">Settings</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 min-h-screen flex flex-col relative transition-all duration-300 ${isReadingMode ? 'lg:ml-20' : 'lg:ml-72'}`}>
                {/* Top Header (Desktop) */}
                <header className="sticky top-0 z-30 px-6 py-4 hidden lg:flex items-center justify-between bg-[#0a1a10]/80 backdrop-blur-xl border-b border-white/5">

                    {isReadingMode ? (
                        // Reading Mode Header: Audio Player
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-4 bg-[#11241a] px-4 py-2 rounded-full border border-white/5">
                                <button
                                    onClick={playPrevious}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">skip_previous</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const targetId = currentSurah || activeSurahInfo?.id;
                                        if (targetId) toggle(targetId, 0);
                                    }}
                                    className="size-10 rounded-full bg-primary text-[#0a1a10] flex items-center justify-center hover:bg-primary-light transition-colors shadow-lg shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined fill-1">{isPlaying ? 'pause' : 'play_arrow'}</span>
                                </button>
                                <button
                                    onClick={playNext}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">skip_next</span>
                                </button>
                                <div className="w-px h-6 bg-white/10 mx-2"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter leading-none mb-1">
                                        {isPlaying ? `Playing Verse ${currentVerseIndex + 1}` : surahName}
                                    </span>
                                    <Link to="/settings" className="flex items-center gap-2 text-xs font-bold text-white hover:text-primary transition-colors">
                                        <div className="size-5 rounded-full bg-slate-700 overflow-hidden shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${currentReciter.name.replace(' ', '+')}&background=random`} alt="Reciter" />
                                        </div>
                                        <span className="truncate max-w-[120px]">{currentReciter.name}</span>
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Search & Actions */}
                            <div className="flex items-center gap-4">
                                <div className="w-64 relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">search</span>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                navigate(`/surah/${e.target.value}`);
                                            }
                                        }}
                                        value={currentSurah || ''}
                                        className="w-full bg-[#11241a] border border-white/5 rounded-full py-2 pl-10 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Jump to Surah...</option>
                                        {surahs.map(surah => (
                                            <option key={surah.id} value={surah.id} className="bg-[#0a1a10] text-white">
                                                {surah.id}. {surah.name_simple} ({surah.translated_name.name})
                                            </option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">expand_more</span>
                                </div>
                                <button className="text-slate-400 hover:text-white"><span className="material-symbols-outlined fill-1">bookmark</span></button>
                                <Link to="/settings" className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">settings</span></Link>
                            </div>
                        </div>
                    ) : (
                        // Standard Dashboard Header
                        <>
                            <form onSubmit={handleSearch} className="w-96 relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for Surah (eg. 18)..."
                                    className="w-full bg-white/5 border border-white/5 rounded-full py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all"
                                />
                            </form>

                            <div className="flex items-center gap-6">
                                <Link to="/notifications" className="relative text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined fill-1">notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0a1a10]"></span>
                                    )}
                                </Link>
                                <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">settings</span>
                                </Link>
                            </div>
                        </>
                    )}
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-20 px-4 pt-6 pb-4 flex items-center justify-between bg-[#193320]/90 backdrop-blur-md border-b border-white/5">
                    {isReadingMode ? (
                        <div className="flex items-center gap-3 w-full">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">search</span>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            navigate(`/surah/${e.target.value}`);
                                        }
                                    }}
                                    value={currentSurah || ''}
                                    className="w-full bg-[#11241a] border border-white/5 rounded-full py-2.5 pl-10 pr-8 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Jump to Surah...</option>
                                    {surahs.map(surah => (
                                        <option key={surah.id} value={surah.id} className="bg-[#0a1a10] text-white">
                                            {surah.id}. {surah.name_simple} ({surah.translated_name.name})
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">expand_more</span>
                            </div>
                            <Link to="/notifications" className="size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary relative shrink-0">
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[#193320]"></span>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img src="/logo.png" alt="9M2PJU Daily Quran" className="size-10 rounded-full object-cover shadow-md shrink-0" />
                                <div className="min-w-0">
                                    <h1 className="text-sm font-bold leading-none text-white truncate">9M2PJU Daily Quran</h1>
                                    <p className="text-xs text-primary font-medium mt-1 truncate">"Guide us to the straight path."</p>
                                </div>
                            </div>
                            <Link to="/notifications" className="size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary relative shrink-0 ml-3">
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[#193320]"></span>
                                )}
                            </Link>
                        </>
                    )}
                </header>

                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex-1 overflow-y-auto ${isReadingMode ? 'p-0' : 'p-4 lg:p-8'}`}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Mobile Bottom Navigation Bar (Hide on Reading Mode logic could be added, but keeping for now) */}
            {!isReadingMode && (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#193320]/95 backdrop-blur-xl border-t border-white/5 px-6 pb-8 pt-3">
                    <div className="flex justify-between items-center">
                        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-white/40 hover:text-primary'} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive('/') ? 'fill-1' : ''}`}>home</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                        </Link>

                        <Link to="/quran" className={`flex flex-col items-center gap-1 ${isActive('/quran') ? 'text-primary' : 'text-white/40 hover:text-primary'} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive('/quran') ? 'fill-1' : ''}`}>menu_book</span>
                            <span className="text-[10px] font-medium uppercase tracking-tighter">Quran</span>
                        </Link>

                        <Link to="/prayer-times" className={`flex flex-col items-center gap-1 ${isActive('/prayer-times') ? 'text-white' : 'text-white/40 hover:text-primary'} transition-colors`}>
                            <div className={`${isActive('/prayer-times') ? 'bg-primary/20' : ''} p-1 rounded-full mb-0.5`}>
                                <span className={`material-symbols-outlined text-2xl block ${isActive('/prayer-times') ? 'fill-1' : ''}`}>explore</span>
                            </div>
                            <span className="text-[10px] font-medium uppercase tracking-tighter">Prayer</span>
                        </Link>

                        <Link to="/settings" className={`flex flex-col items-center gap-1 ${isActive('/settings') ? 'text-white' : 'text-white/40 hover:text-primary'} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive('/settings') ? 'fill-1' : ''}`}>settings</span>
                            <span className="text-[10px] font-medium uppercase tracking-tighter">Settings</span>
                        </Link>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Layout;
