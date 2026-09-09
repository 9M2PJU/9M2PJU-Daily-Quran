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
            return;
        }

        // Match surah name
        const found = surahs.find(s =>
            s.name_simple.toLowerCase().includes(query.toLowerCase()) ||
            s.translated_name.name.toLowerCase().includes(query.toLowerCase())
        );
        if (found) {
            navigate(`/surah/${found.id}`);
            setSearchQuery('');
        }
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

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const SidebarItem = ({ to, icon, label, collapsed = false }: { to: string, icon: string, label: string, collapsed?: boolean }) => {
        const active = isActive(to);
        return (
            <Link
                to={to}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group ${active
                    ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 shadow-lg shadow-emerald-950/40'
                    : 'text-slate-400 hover:bg-emerald-500/5 hover:text-slate-200 border border-transparent'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? label : ''}
            >
                <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${active ? 'text-emerald-400 fill-1' : 'text-slate-400'}`}>{icon}</span>
                {!collapsed && <span className="text-sm tracking-wide">{label}</span>}
                {!collapsed && active && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex bg-[#07140e] text-slate-100 font-sans selection:bg-emerald-500/30">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex fixed top-0 left-0 bottom-0 flex-col border-r border-emerald-500/10 bg-[#091710] z-50 transition-all duration-300 ${isReadingMode ? 'w-20 p-4' : 'w-72 p-6'
                    }`}
            >
                {/* Logo & Brand Header */}
                <Link to="/" className={`flex items-center gap-3.5 mb-8 group ${isReadingMode ? 'justify-center' : 'px-2'}`}>
                    <div className="relative shrink-0">
                        <img src="/logo.png" alt="9M2PJU Daily Quran" className="size-11 rounded-2xl shadow-xl shadow-emerald-950/60 object-cover border border-emerald-500/30 group-hover:border-emerald-400 transition-all" />
                        <div className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 rounded-full border-2 border-[#091710]"></div>
                    </div>
                    {!isReadingMode && (
                        <div className="overflow-hidden">
                            <h1 className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors leading-tight">9M2PJU Daily Quran</h1>
                            <p className="text-[11px] text-emerald-400/80 font-medium tracking-wide mt-0.5 truncate">"Guide us to the straight path."</p>
                        </div>
                    )}
                </Link>

                {/* Main Nav */}
                <nav className="flex-1 space-y-2">
                    <SidebarItem to="/" icon="dashboard" label="Dashboard" collapsed={isReadingMode} />
                    <SidebarItem to="/library" icon="auto_stories" label="Library" collapsed={isReadingMode} />
                    <SidebarItem to="/quran" icon="format_list_bulleted" label="Surah Index" collapsed={isReadingMode} />
                    <SidebarItem to="/bookmarks" icon="bookmark" label="Bookmarks" collapsed={isReadingMode} />
                    <SidebarItem to="/prayer-times" icon="explore" label="Prayer & Qibla" collapsed={isReadingMode} />
                    <SidebarItem to="/activity" icon="history" label="Recent Activity" collapsed={isReadingMode} />
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto space-y-4 pt-4 border-t border-emerald-500/10">
                    {!isReadingMode && (
                        <div className="bg-[#0d2017] rounded-2xl p-4 border border-emerald-500/15 relative overflow-hidden group shadow-lg">
                            <div className="flex justify-between items-end mb-2.5 relative z-10">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-amber-400 text-sm fill-1">local_fire_department</span>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Streak</span>
                                </div>
                                <span className="text-base font-bold text-emerald-400">{streak} Days</span>
                            </div>
                            <div className="flex gap-1.5 h-1.5 relative z-10">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className={`flex-1 rounded-full ${i < streak % 7 || (streak > 0 && streak % 7 === 0) ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm' : 'bg-white/10'}`}></div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link to="/settings" className={`flex items-center gap-3.5 px-4 py-3 text-slate-400 hover:text-emerald-300 transition-colors rounded-2xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 ${isReadingMode ? 'justify-center' : ''}`}>
                        <span className="material-symbols-outlined text-xl">settings</span>
                        {!isReadingMode && <span className="text-sm font-medium">Settings</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 min-h-screen flex flex-col relative transition-all duration-300 ${isReadingMode ? 'lg:ml-20' : 'lg:ml-72'}`}>
                {/* Top Header (Desktop) */}
                <header className="sticky top-0 z-30 px-8 py-4 hidden lg:flex items-center justify-between bg-[#07140e]/90 backdrop-blur-xl border-b border-emerald-500/10 shadow-sm">

                    {isReadingMode ? (
                        // Reading Mode Header: Audio Player & Quick Switcher
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-4 bg-[#0d2017] px-5 py-2.5 rounded-full border border-emerald-500/20 shadow-lg">
                                <button
                                    onClick={playPrevious}
                                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                                    title="Previous Verse"
                                >
                                    <span className="material-symbols-outlined">skip_previous</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const targetId = currentSurah || activeSurahInfo?.id;
                                        if (targetId) toggle(targetId, 0);
                                    }}
                                    className="size-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#07140e] flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
                                    title={isPlaying ? 'Pause' : 'Play'}
                                >
                                    <span className="material-symbols-outlined fill-1 text-xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                                </button>
                                <button
                                    onClick={playNext}
                                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                                    title="Next Verse"
                                >
                                    <span className="material-symbols-outlined">skip_next</span>
                                </button>
                                <div className="w-px h-6 bg-emerald-500/20 mx-1"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider leading-none mb-1">
                                        {isPlaying ? `Playing Verse ${currentVerseIndex + 1}` : surahName}
                                    </span>
                                    <Link to="/settings" className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-colors">
                                        <div className="size-5 rounded-full bg-emerald-950 border border-emerald-500/30 overflow-hidden shrink-0 flex items-center justify-center">
                                            <span className="text-[9px] font-bold text-emerald-400">🎙️</span>
                                        </div>
                                        <span className="truncate max-w-[140px]">{currentReciter.name}</span>
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Search & Actions */}
                            <div className="flex items-center gap-4">
                                <div className="w-64 relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">search</span>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                navigate(`/surah/${e.target.value}`);
                                            }
                                        }}
                                        value={currentSurah || ''}
                                        className="w-full bg-[#0d2017] border border-emerald-500/20 rounded-full py-2.5 pl-10 pr-8 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 appearance-none cursor-pointer hover:border-emerald-500/40 transition-colors"
                                    >
                                        <option value="" disabled>Jump to Surah...</option>
                                        {surahs.map(surah => (
                                            <option key={surah.id} value={surah.id} className="bg-[#091710] text-white">
                                                {surah.id}. {surah.name_simple} ({surah.translated_name.name})
                                            </option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
                                </div>
                                <Link to="/bookmarks" className="size-10 rounded-full bg-[#0d2017] border border-emerald-500/15 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                                    <span className="material-symbols-outlined text-lg fill-1">bookmark</span>
                                </Link>
                                <Link to="/settings" className="size-10 rounded-full bg-[#0d2017] border border-emerald-500/15 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                                    <span className="material-symbols-outlined text-lg">settings</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        // Standard Dashboard Header
                        <>
                            <form onSubmit={handleSearch} className="w-96 relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">search</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search Surah by name or number (e.g. 18 or Kahf)..."
                                    className="w-full bg-[#0d2017] border border-emerald-500/20 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                                />
                            </form>

                            <div className="flex items-center gap-4">
                                <Link to="/notifications" className="size-10 rounded-full bg-[#0d2017] border border-emerald-500/15 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all relative">
                                    <span className="material-symbols-outlined text-xl fill-1">notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-400 ring-2 ring-[#07140e] animate-pulse"></span>
                                    )}
                                </Link>
                                <Link to="/settings" className="size-10 rounded-full bg-[#0d2017] border border-emerald-500/15 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                                    <span className="material-symbols-outlined text-xl">settings</span>
                                </Link>
                            </div>
                        </>
                    )}
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-20 px-4 pt-4 pb-3.5 flex items-center justify-between bg-[#091710]/95 backdrop-blur-md border-b border-emerald-500/10">
                    {isReadingMode ? (
                        <div className="flex items-center gap-3 w-full">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">search</span>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            navigate(`/surah/${e.target.value}`);
                                        }
                                    }}
                                    value={currentSurah || ''}
                                    className="w-full bg-[#0d2017] border border-emerald-500/20 rounded-full py-2 pl-9 pr-7 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Jump to Surah...</option>
                                    {surahs.map(surah => (
                                        <option key={surah.id} value={surah.id} className="bg-[#091710] text-white">
                                            {surah.id}. {surah.name_simple} ({surah.translated_name.name})
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">expand_more</span>
                            </div>
                            <Link to="/notifications" className="size-9 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 relative shrink-0">
                                <span className="material-symbols-outlined text-lg">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-400 ring-1 ring-[#091710]"></span>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img src="/logo.png" alt="9M2PJU Daily Quran" className="size-9 rounded-xl object-cover border border-emerald-500/30 shrink-0" />
                                <div className="min-w-0">
                                    <h1 className="text-sm font-bold leading-none text-white truncate">9M2PJU Daily Quran</h1>
                                    <p className="text-[11px] text-emerald-400 font-medium mt-1 truncate">Guide us to the straight path.</p>
                                </div>
                            </div>
                            <Link to="/notifications" className="size-9 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 relative shrink-0 ml-3">
                                <span className="material-symbols-outlined text-lg">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-400 ring-1 ring-[#091710]"></span>
                                )}
                            </Link>
                        </>
                    )}
                </header>

                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`flex-1 overflow-y-auto ${isReadingMode ? 'p-0' : 'p-4 pb-24 lg:p-8 lg:pb-8'}`}
                >
                    <Outlet />

                    {/* Footer */}
                    {!isReadingMode && (
                        <footer className="text-center py-8 mt-12 border-t border-emerald-500/10">
                            <p className="text-xs text-slate-400">
                                Made with <span className="text-rose-400">❤️</span> for the Ummah by{' '}
                                <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                                    9M2PJU
                                </a>
                                {' '}• Open Source & Ad-Free
                            </p>
                        </footer>
                    )}
                </motion.div>
            </main>

            {/* Mobile Bottom Navigation Bar */}
            {!isReadingMode && (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#091710]/95 backdrop-blur-xl border-t border-emerald-500/15 px-6 pb-6 pt-3">
                    <div className="flex justify-between items-center">
                        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-300'} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive('/') ? 'fill-1' : ''}`}>home</span>
                            <span className="text-[10px] font-semibold tracking-tight">Home</span>
                        </Link>

                        <Link to="/quran" className={`flex flex-col items-center gap-1 ${isActive('/quran') ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-300'} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive('/quran') ? 'fill-1' : ''}`}>menu_book</span>
                            <span className="text-[10px] font-semibold tracking-tight">Quran</span>
                        </Link>

                        <Link to="/bookmarks" className={`flex flex-col items-center gap-1 ${isActive('/bookmarks') ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-300'} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive('/bookmarks') ? 'fill-1' : ''}`}>bookmark</span>
                            <span className="text-[10px] font-semibold tracking-tight">Saved</span>
                        </Link>

                        <Link to="/prayer-times" className={`flex flex-col items-center gap-1 ${isActive('/prayer-times') ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-300'} transition-colors`}>
                            <div className={`${isActive('/prayer-times') ? 'bg-emerald-500/20' : ''} p-0.5 rounded-full`}>
                                <span className={`material-symbols-outlined text-2xl block ${isActive('/prayer-times') ? 'fill-1' : ''}`}>explore</span>
                            </div>
                            <span className="text-[10px] font-semibold tracking-tight">Prayer</span>
                        </Link>

                        <Link to="/settings" className={`flex flex-col items-center gap-1 ${isActive('/settings') ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-300'} transition-colors`}>
                            <span className={`material-symbols-outlined text-2xl ${isActive('/settings') ? 'fill-1' : ''}`}>settings</span>
                            <span className="text-[10px] font-semibold tracking-tight">Settings</span>
                        </Link>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Layout;

