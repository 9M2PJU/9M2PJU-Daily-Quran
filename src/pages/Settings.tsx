import React from 'react';
import { useSettings, TRANSLATIONS } from '../contexts/SettingsContext';

const Settings: React.FC = () => {
    const { translationId, setTranslationId } = useSettings();

    return (
        <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Customize your reading experience.</p>
            </div>

            {/* Language Settings */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">translate</span>
                    <h2 className="text-xl font-bold text-white">Translation Language</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TRANSLATIONS.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => setTranslationId(lang.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${translationId === lang.id
                                ? 'bg-primary/10 border-primary text-white'
                                : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span className="font-medium">{lang.name}</span>
                            {translationId === lang.id && (
                                <span className="material-symbols-outlined text-primary fill-1">check_circle</span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <h2 className="text-xl font-bold text-white">About</h2>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    9M2PJU Daily Quran helps you build a consistent habit of reading the Quran.
                    Built with love for the Ummah.
                </p>

                <div className="text-xs text-slate-500 font-mono">
                    Version 1.2.0 • Data provided by Quran.com API
                </div>
            </section>
        </div>
    );
};

export default Settings;
