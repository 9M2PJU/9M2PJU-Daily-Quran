import React from 'react';
import { useSettings, TRANSLATIONS, RECITERS } from '../contexts/SettingsContext';

const Settings: React.FC = () => {
    const {
        translationId,
        setTranslationId,
        reciterId,
        setReciterId,
        showTranslation,
        setShowTranslation
    } = useSettings();

    return (
        <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
            {/* Header */}
            <div className="mb-8 px-4 lg:px-0">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Customize your reading experience.</p>
            </div>

            {/* Reciter Settings */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">record_voice_over</span>
                    <h2 className="text-xl font-bold text-white">Reciter</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {RECITERS.map((reciter) => (
                        <button
                            key={reciter.id}
                            onClick={() => setReciterId(reciter.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${reciterId === reciter.id
                                ? 'bg-primary/10 border-primary text-white'
                                : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span className="font-medium text-sm">{reciter.name}</span>
                            {reciterId === reciter.id && (
                                <span className="material-symbols-outlined text-primary fill-1">check_circle</span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Language Settings */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">translate</span>
                    <h2 className="text-xl font-bold text-white">Translation Language</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TRANSLATIONS.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => setTranslationId(lang.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${translationId === lang.id
                                ? 'bg-primary/10 border-primary text-white'
                                : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <span className="font-medium text-sm">{lang.name}</span>
                            {translationId === lang.id && (
                                <span className="material-symbols-outlined text-primary fill-1">check_circle</span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Display Settings */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">visibility</span>
                    <h2 className="text-xl font-bold text-white">Display</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent">
                        <div>
                            <span className="font-medium text-white block">Show Verse Translation</span>
                            <span className="text-xs text-slate-400">Display the translation for every verse in reading mode.</span>
                        </div>
                        <button
                            onClick={() => setShowTranslation(!showTranslation)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showTranslation ? 'bg-primary' : 'bg-slate-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showTranslation ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
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
                    Version 2.1.0 • Quran data by Quran.com API • Audio by everyayah.com • Prayer times by waktusolat.app (JAKIM)
                </div>
            </section>
        </div>
    );
};

export default Settings;
