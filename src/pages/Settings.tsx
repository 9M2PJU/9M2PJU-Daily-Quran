import React, { useEffect, useState } from 'react';
import { useSettings, TRANSLATIONS, RECITERS } from '../contexts/SettingsContext';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Settings: React.FC = () => {
    const {
        translationId,
        setTranslationId,
        reciterId,
        setReciterId,
        showTranslation,
        setShowTranslation
    } = useSettings();

    // PWA Install prompt
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setInstallPrompt(null);
        });

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setInstallPrompt(null);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
            {/* Header */}
            <div className="mb-8 px-4 lg:px-0">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Customize your reading experience.</p>
            </div>

            {/* Install App */}
            <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-6 border border-primary/20 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary fill-1">install_mobile</span>
                    <h2 className="text-xl font-bold text-white">Install App</h2>
                </div>

                {isInstalled ? (
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary fill-1">check_circle</span>
                        <p className="text-slate-300 text-sm">App is installed! You can open it from your home screen.</p>
                    </div>
                ) : installPrompt ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <p className="text-slate-300 text-sm flex-1">Install 9M2PJU Daily Quran on your device for offline access and a native app experience.</p>
                        <button
                            onClick={handleInstall}
                            className="px-6 py-2.5 bg-primary text-[#0a1a10] font-bold rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 shrink-0"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            Install Now
                        </button>
                    </div>
                ) : (
                    <p className="text-slate-400 text-sm">
                        To install, open this app in <strong className="text-white">Chrome</strong> or <strong className="text-white">Edge</strong> on your device and look for the install option in the browser menu, or use the address bar install icon.
                    </p>
                )}
            </section>

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
