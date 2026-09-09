import React, { useEffect, useState } from 'react';
import { useSettings, TRANSLATIONS, RECITERS } from '../contexts/SettingsContext';
import { usePageSEO } from '../hooks/usePageSEO';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Settings: React.FC = () => {
    usePageSEO({
        title: 'Tetapan & Personalisasi Tilawah | 9M2PJU Daily Quran',
        description: 'Sesuaikan pilihan qari bacaan Al-Quran, bahasa terjemahan (Bahasa Melayu & Inggeris), saiz teks, dan mod paparan.',
        canonicalUrl: 'https://quran.hamradio.my/#/settings',
    });

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
            <div className="mb-8 px-2 lg:px-0">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-lg">tune</span>
                    </span>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Tetapan Aplikasi</h1>
                </div>
                <p className="text-slate-400 text-sm">
                    Sesuaikan pengalaman pembacaan, pilihan qari, dan terjemahan mengikut keselesaan anda.
                </p>
            </div>

            {/* Install App Card */}
            <section className="bg-gradient-to-r from-emerald-500/15 via-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-emerald-500/30 mb-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            install_mobile
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Pasang Aplikasi (PWA)</h2>
                        <p className="text-xs text-slate-400">Akses pantas dan luar talian terus dari skrin utama telefon atau komputer anda</p>
                    </div>
                </div>

                {isInstalled ? (
                    <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl relative z-10">
                        <span className="material-symbols-outlined text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                        </span>
                        <p className="text-emerald-200 text-xs sm:text-sm font-medium">
                            Aplikasi telah dipasang! Anda boleh membukanya secara terus dari skrin utama peranti.
                        </p>
                    </div>
                ) : installPrompt ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed flex-1">
                            Pasang 9M2PJU Daily Quran untuk pengalaman aplikasi pantas dengan ikon berdedikasi dan paparan skrin penuh.
                        </p>
                        <button
                            onClick={handleInstall}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#07140e] font-bold text-sm rounded-xl hover:from-emerald-400 hover:to-gold-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
                        >
                            <span className="material-symbols-outlined text-base">download</span>
                            Pasang Sekarang
                        </button>
                    </div>
                ) : (
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed relative z-10">
                        Untuk memasang, buka laman ini melalui pelayar <strong className="text-slate-200">Chrome</strong>, <strong className="text-slate-200">Safari</strong>, atau <strong className="text-slate-200">Edge</strong>, kemudian pilih <em className="text-emerald-400 not-italic">"Add to Home Screen"</em> atau ikon pasang di bar carian.
                    </p>
                )}
            </section>

            {/* Reciter Settings */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <span className="material-symbols-outlined text-xl">record_voice_over</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Pilihan Qari Audio</h2>
                        <p className="text-xs text-slate-400">Pilih suara qari untuk bacaan audio surah dan ayat</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {RECITERS.map((reciter) => {
                        const isSelected = reciterId === reciter.id;
                        return (
                            <button
                                key={reciter.id}
                                onClick={() => setReciterId(reciter.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                    isSelected
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-md shadow-emerald-500/5'
                                        : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06] hover:text-white'
                                }`}
                            >
                                <div>
                                    <span className="font-bold text-sm block text-white">{reciter.name}</span>
                                    <span className="text-[11px] text-slate-400">Audio Murottal Berkualiti Tinggi</span>
                                </div>
                                {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            check
                                        </span>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border border-white/10"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Language Settings */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-xl">translate</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Bahasa Terjemahan</h2>
                        <p className="text-xs text-slate-400">Pilih sumber dan bahasa terjemahan makna ayat</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TRANSLATIONS.map((lang) => {
                        const isSelected = translationId === lang.id;
                        return (
                            <button
                                key={lang.id}
                                onClick={() => setTranslationId(lang.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                    isSelected
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-md shadow-emerald-500/5'
                                        : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06] hover:text-white'
                                }`}
                            >
                                <span className="font-medium text-sm text-slate-200">{lang.name}</span>
                                {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            check
                                        </span>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border border-white/10"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Display Settings */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Paparan Bacaan</h2>
                        <p className="text-xs text-slate-400">Kawalan penampilan teks ayat semasa membaca</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div>
                            <span className="font-bold text-sm text-white block">Paparkan Terjemahan Ayat</span>
                            <span className="text-xs text-slate-400">Tunjukkan baris terjemahan bahasa di bawah setiap ayat Arab.</span>
                        </div>
                        <button
                            onClick={() => setShowTranslation(!showTranslation)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                                showTranslation ? 'bg-emerald-500' : 'bg-slate-700'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    showTranslation ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <span className="material-symbols-outlined text-xl">info</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Tentang 9M2PJU Daily Quran</h2>
                        <p className="text-xs text-slate-400">Aplikasi Tilawah Al-Quran & Jadual Waktu Solat Malaysia</p>
                    </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    9M2PJU Daily Quran dibangunkan untuk membantu umat Islam memupuk amalan membaca Al-Quran secara istiqamah setiap hari, lengkap dengan tafsir, audio murottal, arah kiblat, dan waktu solat tepat JAKIM.
                </p>

                <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-[11px] text-slate-400 space-y-1 font-mono">
                    <p>Versi: <strong className="text-emerald-400">v2.1.0</strong> · Dibangunkan oleh <strong className="text-gold-400">9M2PJU</strong></p>
                    <p>Data Al-Quran: Quran.com API · Audio: EveryAyah · Waktu Solat: JAKIM / WaktuSolat.app</p>
                </div>
            </section>
        </div>
    );
};

export default Settings;
