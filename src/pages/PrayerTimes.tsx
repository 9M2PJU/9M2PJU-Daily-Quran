import React from 'react';

const PrayerTimes: React.FC = () => {
    return (
        <div className="h-full flex flex-col lg:flex-row lg:items-start lg:gap-12 lg:p-8">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 islamic-pattern pointer-events-none -z-10 opacity-50"></div>

            {/* Left Column: Header & Qibla */}
            <div className="flex flex-col items-center mb-6 lg:mb-0 lg:w-1/3 lg:sticky lg:top-24">
                <div className="flex items-center justify-between w-full mb-6 lg:hidden">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        <div>
                            <h2 className="text-sm font-bold leading-tight">London, UK</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">14 Ramadan 1445 AH</p>
                        </div>
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:flex flex-col items-center text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-1">London, United Kingdom</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">14 Ramadan 1445 AH</p>
                </div>

                {/* Qibla Compass */}
                <div className="relative w-56 h-56 lg:w-72 lg:h-72 flex items-center justify-center mb-6 lg:mb-10 transition-all duration-500">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-white/5 opacity-50"></div>
                    <div className="absolute inset-4 rounded-full border border-slate-100 dark:border-white/5"></div>
                    <div className="absolute inset-0 rounded-full compass-dial animate-spin-slow opacity-20"></div>

                    <div className="relative z-20 flex flex-col items-center">
                        <span className="material-symbols-outlined text-primary text-5xl lg:text-7xl mb-1 lg:mb-2 transition-all duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>navigation</span>
                        <span className="text-xs lg:text-sm font-bold tracking-tighter uppercase text-slate-500">Kiblat</span>
                        <span className="text-2xl lg:text-4xl font-bold mt-1 text-white">124°</span>
                    </div>

                    <span className="absolute top-4 text-xs font-bold text-slate-500">N</span>
                    <span className="absolute right-4 text-xs font-bold text-slate-500">E</span>
                    <span className="absolute bottom-4 text-xs font-bold text-slate-500">S</span>
                    <span className="absolute left-4 text-xs font-bold text-slate-500">W</span>
                </div>

                <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/5 w-full">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Next Prayer</p>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-1">Asr</h1>
                    <p className="text-primary font-bold">in 45 mins</p>
                </div>
            </div>

            {/* Right Column: Prayer Times List */}
            <div className="flex-1 w-full space-y-3 lg:space-y-4">
                <h3 className="hidden lg:block text-xl font-bold text-white mb-6">Prayer Schedule</h3>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">wb_twilight</span>
                        <div>
                            <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Fajr</p>
                            <p className="text-lg font-bold">05:12 AM</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">wb_sunny</span>
                        <div>
                            <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Dhuhr</p>
                            <p className="text-lg font-bold">12:45 PM</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 dark:bg-primary/20 border-2 border-primary/50 dark:border-primary shadow-lg shadow-primary/10">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
                        <div>
                            <p className="text-sm font-semibold text-primary">Asr</p>
                            <p className="text-lg font-bold dark:text-white">04:10 PM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary text-[10px] font-bold text-white dark:text-background-dark uppercase">Next</span>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">wb_shade</span>
                        <div>
                            <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Maghrib</p>
                            <p className="text-lg font-bold">06:32 PM</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/20 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">bedtime</span>
                        <div>
                            <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Isha</p>
                            <p className="text-lg font-bold">07:55 PM</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                    <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 font-bold text-sm hover:text-primary hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                        <span className="material-symbols-outlined text-primary">schedule</span> Settings
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 font-bold text-sm hover:text-primary hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                        <span className="material-symbols-outlined text-primary">my_location</span> Recalibrate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
