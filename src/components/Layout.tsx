import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun, Globe } from 'lucide-react';
import { useSettings, TRANSLATIONS } from '../contexts/SettingsContext';

const Layout: React.FC = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const { translationId, setTranslationId } = useSettings();
    const [showLangMenu, setShowLangMenu] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[size:200%_200%] animate-gradient">
            <header className="sticky top-0 z-50 glass border-b transition-colors duration-300 shadow-sm" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                <div className="container mx-auto flex items-center justify-between py-3 px-4">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <img src="/logo.png" alt="9M2PJU Daily Quran Logo" className="h-12 w-auto relative z-10 transition-transform group-hover:scale-110 drop-shadow-md object-contain" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gradient">
                            9M2PJU Daily Quran
                        </h1>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                title="Change Language"
                            >
                                <Globe className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                            </button>

                            {showLangMenu && (
                                <div className="absolute right-0 top-12 glass rounded-xl shadow-lg py-2 w-56 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Select Translation</div>
                                    {TRANSLATIONS.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setTranslationId(t.id);
                                                setShowLangMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors ${translationId === t.id ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-gray-200'}`}
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto py-8 px-4">
                <Outlet />
            </main>

            <footer className="py-8 text-center text-sm mt-auto glass border-t" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}>
                <div className="container mx-auto">
                    <p className="text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} <span className="font-semibold text-emerald-600 dark:text-emerald-400">9M2PJU Daily Quran</span>. Refined for the Soul.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
