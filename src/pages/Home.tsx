import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 lg:pb-0">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-8 space-y-6">

                {/* Verse of the Day Card */}
                <section className="relative overflow-hidden rounded-3xl bg-[#0f2416] p-8 border border-primary/20 shadow-2xl group">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">Verse of the Day</span>
                        <div className="flex gap-2">
                            <button className="size-10 rounded-full bg-white/5 hover:bg-primary hover:text-white text-slate-400 flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined text-xl fill-1">play_arrow</span>
                            </button>
                            <button className="size-10 rounded-full bg-white/5 hover:bg-primary hover:text-white text-slate-400 flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined text-xl">share</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center space-y-8 relative z-10">
                        <div className="space-y-1">
                            <p className="text-slate-400 text-sm font-medium">Surah Al-Baqarah [2:255]</p>
                        </div>

                        {/* Arabic Text */}
                        <p className="font-arabic text-3xl md:text-5xl leading-[1.6] md:leading-[2.2] text-[#e2e8f0] drop-shadow-lg">
                            ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ
                        </p>

                        <p className="text-slate-300 font-light italic text-lg max-w-2xl mx-auto leading-relaxed">
                            "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth..."
                        </p>
                    </div>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="size-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <span className="material-symbols-outlined fill-1">menu_book</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">+2 this week</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">12</h3>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Surahs Completed</p>
                        </div>
                    </div>

                    <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined">bar_chart</span>
                            </div>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+15% vs last mo</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">4,250</h3>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Verses Read</p>
                        </div>
                    </div>

                    <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="size-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-all">
                                <span className="material-symbols-outlined fill-1">timer</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">Avg 24m/day</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-1">18h 45m</h3>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Total Reading Time</p>
                        </div>
                    </div>
                </div>

                {/* Continue Reading Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary fill-1">bookmark</span>
                            <h2 className="text-lg font-bold text-white">Continue Reading</h2>
                        </div>
                        <Link to="/quran" className="text-xs font-bold text-primary hover:text-white transition-colors">View Library</Link>
                    </div>

                    <div className="space-y-3">
                        <Link to="/surah/18" className="group bg-[#0f2416] rounded-2xl p-4 border border-white/5 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                    18
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">Surah Al-Kahf</h3>
                                    <p className="text-slate-500 text-xs">Verse 45 of 110 • 41% completed</p>
                                </div>
                            </div>
                            <button className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </Link>

                        <Link to="/surah/67" className="group bg-[#0f2416] rounded-2xl p-4 border border-white/5 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                    67
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors">Surah Al-Mulk</h3>
                                    <p className="text-slate-500 text-xs">Verse 12 of 30 • 40% completed</p>
                                </div>
                            </div>
                            <button className="size-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </Link>
                    </div>
                </section>
            </div>

            {/* Right Column (Sidebar Extras) */}
            <div className="lg:col-span-4 space-y-6">

                {/* Daily Goal Card */}
                <div className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 text-center">
                    <div className="flex items-center gap-2 mb-6 text-white">
                        <span className="material-symbols-outlined text-primary fill-1">target</span>
                        <h3 className="font-bold">Daily Goal</h3>
                    </div>

                    <div className="relative size-48 mx-auto mb-6">
                        {/* Ring */}
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                            <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                            <circle className="text-primary" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502" strokeDashoffset="200" strokeWidth="12" strokeLinecap="round"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">3/5</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pages Read</span>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-6 px-4">Keep it up! You're only 2 pages away from your daily goal.</p>

                    <Link to="/surah/1" className="block w-full py-3.5 bg-primary hover:bg-primary-light text-[#0a1a10] font-bold rounded-xl transition-colors shadow-lg shadow-primary/20">
                        Start Reading Now
                    </Link>
                </div>

                {/* Quick Access List */}
                <div className="bg-[#0f2416] rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 mb-6 text-white max-w-full overflow-hidden">
                        <span className="material-symbols-outlined text-yellow-500 fill-1">star</span>
                        <h3 className="font-bold">Quick Access</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: 36, name: 'Surah Yaseen', desc: 'Heart of Quran' },
                            { id: 55, name: 'Surah Ar-Rahman', desc: 'The Beneficent' },
                            { id: 56, name: "Surah Al-Waqi'ah", desc: 'The Inevitable' }
                        ].map((s) => (
                            <Link key={s.id} to={`/surah/${s.id}`} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="size-8 rounded bg-white/5 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {s.id}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-bold text-white truncate">{s.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.desc}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 text-lg group-hover:text-white transition-colors">chevron_right</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Daily Tip */}
                <div className="bg-[#132f1e] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 -mb-6 -mr-6 text-[#1a3d28]">
                        <span className="material-symbols-outlined text-[140px] opacity-50 fill-1">lightbulb</span>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Daily Tip</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-1">
                            "Reciting Surah Al-Mulk before sleeping is a sunnah that provides protection in the grave. Try setting a reminder for 9:00 PM."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
