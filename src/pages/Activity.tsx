import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { useBookmarks } from '../contexts/BookmarkContext';

const ActivityPage: React.FC = () => {
    const { dailyProgress, dailyGoal, streak } = useProgress();
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
