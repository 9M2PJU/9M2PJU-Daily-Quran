import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import { usePageSEO } from '../hooks/usePageSEO';

const ActivityPage: React.FC = () => {
    usePageSEO({
        title: 'Aktiviti Bacaan & Rekod Istiqamah | 9M2PJU Daily Quran',
        description: 'Pantau kemajuan bacaan harian, streak istiqamah mingguan, sasaran ayat, dan sejarah tilawah Al-Quran anda.',
        canonicalUrl: 'https://quran.hamradio.my/#/activity',
    });

    const { dailyProgress, dailyGoal, streak, readHistory, dailyHistory } = useProgress();
    const { bookmarks, notes } = useBookmarks();

    const recentBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
    const recentNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    const progressPercent = dailyGoal > 0 ? Math.min(100, Math.round((dailyProgress / dailyGoal) * 100)) : 0;

    return (
        <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-lg">insights</span>
                    </span>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Aktiviti & Kemajuan</h1>
                </div>
                <p className="text-slate-400 text-sm">
                    Rekod istiqamah bacaan, sasaran harian, dan arkib tilawah Al-Quran anda.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-5 border border-white/5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-3">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            local_fire_department
                        </span>
                    </div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">{streak}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Hari Berturut-turut</p>
                </div>

                <div className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-5 border border-white/5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                        <span className="material-symbols-outlined text-xl">auto_stories</span>
                    </div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">{dailyProgress}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Ayat Hari Ini</p>
                </div>

                <div className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-5 border border-white/5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            bookmark
                        </span>
                    </div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">{bookmarks.length}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Penanda Buku</p>
                </div>

                <div className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-5 border border-white/5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                    </div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">{notes.length}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Nota Tadabbur</p>
                </div>
            </div>

            {/* 7-Day Consistency Chart */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 size-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                workspace_premium
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Prestasi Istiqamah Mingguan</h2>
                            <p className="text-xs text-slate-400">Pencapaian 7 hari terkini</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-extrabold text-gold-400">{streak} Hari</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak Semasa</span>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3 relative z-10">
                    {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (6 - i));
                        const dateStr = date.toDateString();
                        const dayName = date.toLocaleDateString('ms-MY', { weekday: 'short' });

                        const historyEntry = dailyHistory.find(h => h.date === dateStr);
                        const isToday = i === 6;
                        const isCompleted = historyEntry ? historyEntry.goalMet : false;
                        const progress = historyEntry ? historyEntry.progress : 0;

                        return (
                            <div key={i} className="flex flex-col items-center gap-2 group relative">
                                <div className="absolute -top-9 bg-black/90 text-white text-[10px] px-2.5 py-1 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                                    {progress} ayat
                                </div>

                                <div
                                    className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                            : isToday
                                                ? 'bg-white/5 border border-gold-500/30 text-gold-400'
                                                : 'bg-white/[0.03] border border-white/5 text-slate-700'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <span className="material-symbols-outlined text-xl sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            check_circle
                                        </span>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg sm:text-xl">
                                            {isToday ? 'pending' : 'remove'}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${isToday ? 'text-gold-400' : 'text-slate-400'}`}>
                                    {isToday ? 'Hari Ini' : dayName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Daily Goal Progress */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <span className="material-symbols-outlined text-xl">track_changes</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Sasaran Harian</h2>
                            <p className="text-xs text-slate-400">Kemajuan bacaan berbanding sasaran harian</p>
                        </div>
                    </div>
                    <span className="text-base font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        {progressPercent}%
                    </span>
                </div>
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-gold-400 rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                    <span>
                        <strong className="text-white">{dailyProgress}</strong> daripada <strong className="text-white">{dailyGoal}</strong> ayat dibaca hari ini
                    </span>
                    {progressPercent >= 100 && (
                        <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check</span> Sasaran Tercapai!
                        </span>
                    )}
                </div>
            </section>

            {/* Recently Read */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-xl">history</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Surah Terkini Dibaca</h2>
                        <p className="text-xs text-slate-400">Sejarah bacaan surah terkini anda</p>
                    </div>
                </div>

                {readHistory.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                        {readHistory.map((h) => (
                            <Link
                                key={h.timestamp}
                                to={`/surah/${h.id}`}
                                className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 hover:text-white hover:border-emerald-500/30 transition-all flex items-center gap-2 group"
                            >
                                <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center text-[11px] group-hover:bg-emerald-500/20">
                                    {h.id}
                                </span>
                                <span>{h.name}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5">
                        <p className="text-slate-400 text-xs">Belum ada rekod bacaan. Mulakan tilawah hari ini!</p>
                    </div>
                )}
            </section>

            {/* Recent Bookmarks */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 shadow-xl">
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                bookmark
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Penanda Buku Terkini</h2>
                            <p className="text-xs text-slate-400">Ayat-ayat yang baru anda tandakan</p>
                        </div>
                    </div>
                    {recentBookmarks.length > 0 && (
                        <Link to="/bookmarks" className="text-xs font-bold text-emerald-400 hover:underline">
                            Lihat Semua
                        </Link>
                    )}
                </div>

                {recentBookmarks.length > 0 ? (
                    <div className="space-y-3">
                        {recentBookmarks.map((bm) => (
                            <Link
                                key={bm.verseKey}
                                to={`/surah/${bm.surahId}#verse-${bm.verseKey}`}
                                className="flex items-start gap-4 p-4 bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 rounded-2xl transition-all group"
                            >
                                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-[11px] font-mono font-bold text-emerald-400">{bm.verseKey}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{bm.surahName}</p>
                                    <p className="text-xs text-slate-400 truncate mt-1">{bm.translationText}</p>
                                    <p className="text-[10px] text-slate-500 mt-1.5">
                                        {new Date(bm.timestamp).toLocaleDateString('ms-MY', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-emerald-400 transition-colors text-base self-center">
                                    chevron_right
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5">
                        <span className="material-symbols-outlined text-3xl text-slate-600 mb-1 block">bookmark_border</span>
                        <p className="text-slate-400 text-xs">Tiada penanda buku lagi.</p>
                    </div>
                )}
            </section>

            {/* Recent Notes */}
            <section className="bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl p-6 sm:p-7 border border-white/5 mb-6 shadow-xl">
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <span className="material-symbols-outlined text-xl">edit_note</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Catatan Tadabbur Terkini</h2>
                            <p className="text-xs text-slate-400">Refleksi peribadi pada ayat Al-Quran</p>
                        </div>
                    </div>
                    {recentNotes.length > 0 && (
                        <Link to="/bookmarks" className="text-xs font-bold text-emerald-400 hover:underline">
                            Lihat Semua
                        </Link>
                    )}
                </div>

                {recentNotes.length > 0 ? (
                    <div className="space-y-3">
                        {recentNotes.map((note) => (
                            <Link
                                key={note.verseKey}
                                to={`/surah/${note.surahId}#verse-${note.verseKey}`}
                                className="block p-4 bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-mono font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-md border border-gold-500/20">
                                        {note.verseKey}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">{note.surahName}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-2">{note.text}</p>
                                <p className="text-[10px] text-slate-500 mt-2">
                                    {new Date(note.timestamp).toLocaleDateString('ms-MY', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5">
                        <span className="material-symbols-outlined text-3xl text-slate-600 mb-1 block">edit_note</span>
                        <p className="text-slate-400 text-xs">Tiada nota tadabbur lagi.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ActivityPage;
