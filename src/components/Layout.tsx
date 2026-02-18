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
        <div className="min-h-screen flex flex-col transition-colors duration-300">
            <header
                className="sticky top-0 z-50 backdrop-blur-md border-b px-4 py-3 shadow-sm transition-colors duration-300"
                style={{
                    backgroundColor: 'rgba(var(--color-surface), 0.8)',
                    borderColor: 'rgba(0,0,0,0.05)'
                }}
            >
                <div className="container mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/logo.png" alt="9M2PJU Daily Quran Logo" className="w-8 h-8 transition-transform group-hover:scale-105" />
                        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
                            9M2PJU Daily Quran
                        </h1>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title="Change Language"
                            >
                                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            {showLangMenu && (
                                <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 w-56 z-50">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Translation</div>
                                    {TRANSLATIONS.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setTranslationId(t.id);
                                                setShowLangMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-gray-700 ${translationId === t.id ? 'text-emerald-600 font-bold' : 'text-gray-700 dark:text-gray-200'}`}
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto py-6 px-4">
                <Outlet />
            </main>

            <footer className="py-6 text-center text-sm border-t mt-auto" style={{
                borderColor: 'rgba(0,0,0,0.05)',
                color: 'var(--color-text-muted)'
            }}>
                <div className="container mx-auto">
                    <p>© {new Date().getFullYear()} Daily Quran. Built with Love.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
