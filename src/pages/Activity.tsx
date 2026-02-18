import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useBookmarks } from '../contexts/BookmarkContext';

const ActivityPage: React.FC = () => {
    const { dailyProgress, dailyGoal, streak, readHistory } = useProgress();
    const { bookmarks, notes } = useBookmarks();

    const recentBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
    const recentNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    const progressPercent = dailyGoal > 0 ? Math.min(100, Math.round((dailyProgress / dailyGoal) * 100)) : 0;

    return (
        <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Recent Activity</h1>
                <p className="text-slate-400">Your reading history and progress.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5">
                    <span className="material-symbols-outlined text-primary text-2xl mb-2 block">local_fire_department</span>
                    <p className="text-3xl font-bold text-white">{streak}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Day Streak</p>
                </div>
                <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5">
                    <span className="material-symbols-outlined text-primary text-2xl mb-2 block">auto_stories</span>
                    <p className="text-3xl font-bold text-white">{dailyProgress}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Verses Today</p>
                </div>
                <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5">
                    <span className="material-symbols-outlined text-primary text-2xl mb-2 block">bookmark</span>
                    <p className="text-3xl font-bold text-white">{bookmarks.length}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Bookmarks</p>
                </div>
                <div className="bg-[#0f2416] rounded-2xl p-5 border border-white/5">
                    <span className="material-symbols-outlined text-primary text-2xl mb-2 block">edit_note</span>
                    <p className="text-3xl font-bold text-white">{notes.length}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Notes</p>
                </div>
            </div>

            {/* 7-Day Streak Chart */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-yellow-500 fill-1">local_fire_department</span>
                        <h2 className="text-lg font-bold text-white">Weekly Consistency</h2>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-white">{streak}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Day Streak</span>
                    </div>
                </div>

                <div className="flex justify-between items-end gap-2 relative z-10">
                    {Array.from({ length: 7 }).map((_, i) => {
                        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                        const today = new Date().getDay(); // 0 is Sun, 1 is Mon
                        const index = (today - (6 - i) + 7) % 7;
                        const label = dayNames[index];
                        const isToday = i === 6;
                        const isCompleted = isToday ? dailyProgress >= dailyGoal : (i < 6 && i > 2); // Mocked history for demo

                        return (
                            <div key={i} className="flex flex-col items-center gap-3 flex-1">
                                <div
                                    className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-500 ${isCompleted
                                        ? 'bg-primary/20 border border-primary/30 text-primary shadow-lg shadow-primary/10'
                                        : isToday
                                            ? 'bg-white/5 border border-white/10 text-slate-600'
                                            : 'bg-white/5 border border-transparent text-slate-800'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-xl">{isToday ? 'pending' : 'close'}</span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-slate-500'}`}>
                                    {isToday ? 'Today' : label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Daily Goal Progress */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">target</span>
                        <h2 className="text-lg font-bold text-white">Daily Goal</h2>
                    </div>
                    <span className="text-sm text-primary font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-3">
                    {dailyProgress} of {dailyGoal} verses read today
                    {progressPercent >= 100 && <span className="text-primary font-bold ml-2">✓ Goal Met!</span>}
                </p>
            </section>

            {/* Recently Read */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-3 mb-5">
                    <span className="material-symbols-outlined text-primary">history</span>
                    <h2 className="text-lg font-bold text-white">Recently Read</h2>
                </div>

                {readHistory.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {readHistory.map((h) => (
                            <Link
                                key={h.timestamp}
                                to={`/surah/${h.id}`}
                                className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all flex items-center gap-2"
                            >
                                <span className="text-primary font-bold">{h.id}</span>
                                {h.name}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-slate-500 text-sm">No recent history. Start reading to see your progress!</p>
                    </div>
                )}
            </section>

            {/* Recent Bookmarks */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-3 mb-5">
                    <span className="material-symbols-outlined text-primary">bookmark</span>
                    <h2 className="text-lg font-bold text-white">Recent Bookmarks</h2>
                </div>

                {recentBookmarks.length > 0 ? (
                    <div className="space-y-3">
                        {recentBookmarks.map((bm) => (
                            <Link
                                key={bm.verseKey}
                                to={`/surah/${bm.surahId}`}
                                className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                            >
                                <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-primary">{bm.verseKey}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white">{bm.surahName}</p>
                                    <p className="text-xs text-slate-400 truncate mt-1">{bm.translationText}</p>
                                    <p className="text-[10px] text-slate-600 mt-2">
                                        {new Date(bm.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-white transition-colors">chevron_right</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-2 block">bookmark_border</span>
                        <p className="text-slate-500 text-sm">No bookmarks yet. Bookmark verses while reading!</p>
                    </div>
                )}
            </section>

            {/* Recent Notes */}
            <section className="bg-[#0f2416] rounded-3xl p-6 border border-white/5 mb-6">
                <div className="flex items-center gap-3 mb-5">
                    <span className="material-symbols-outlined text-primary">edit_note</span>
                    <h2 className="text-lg font-bold text-white">Recent Notes</h2>
                </div>

                {recentNotes.length > 0 ? (
                    <div className="space-y-3">
                        {recentNotes.map((note) => (
                            <Link
                                key={note.verseKey}
                                to={`/surah/${note.surahId}`}
                                className="block p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-primary">{note.verseKey}</span>
                                    <span className="text-xs text-slate-600">•</span>
                                    <span className="text-xs text-slate-500">{note.surahName}</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{note.text}</p>
                                <p className="text-[10px] text-slate-600 mt-2">
                                    {new Date(note.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-2 block">edit_note</span>
                        <p className="text-slate-500 text-sm">No notes yet. Add reflections while reading!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ActivityPage;
