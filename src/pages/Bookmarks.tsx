import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarkContext';

const BookmarksPage: React.FC = () => {
    const { bookmarks, removeBookmark, getNote } = useBookmarks();

    const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="pb-12 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Bookmarks & Notes</h1>
                <p className="text-slate-400 text-sm">Your saved verses and personal reflections.</p>
            </div>

            {/* Saved Verses & Notes */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary fill-1">bookmark</span>
                    <h2 className="text-lg font-bold text-white">Saved Verses</h2>
                    <span className="ml-auto text-xs font-bold text-slate-500">{bookmarks.length} saved</span>
                </div>

                {sortedBookmarks.length === 0 ? (
                    <div className="bg-[#0f2416] rounded-2xl border border-white/5 p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">bookmark_border</span>
                        <p className="text-slate-500 text-sm mb-1">No saved verses yet</p>
                        <p className="text-slate-600 text-xs">Tap the bookmark icon or add a note to a verse to save it here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedBookmarks.map((bm) => {
                            const note = getNote(bm.verseKey);
                            return (
                                <div key={bm.verseKey} className="group bg-[#0f2416] rounded-2xl border border-white/5 hover:border-primary/20 transition-all overflow-hidden">
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    to={`/surah/${bm.surahId}#verse-${bm.verseKey}`}
                                                    className="text-xs font-bold text-primary hover:text-primary-light transition-colors"
                                                >
                                                    {bm.surahName} [{bm.verseKey}]
                                                </Link>
                                                <span className="text-[10px] text-slate-600">
                                                    {new Date(bm.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {note && (
                                                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                                        Has Note
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => removeBookmark(bm.verseKey)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                                                    title="Remove bookmark"
                                                >
                                                    <span className="material-symbols-outlined text-lg">close</span>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-arabic text-xl text-[#e2e8f0] text-right leading-[2] mb-3" dir="rtl">
                                            {bm.arabicText}
                                        </p>
                                        {bm.translationText && (
                                            <p className="text-slate-400 text-sm font-serif leading-relaxed mb-4">
                                                {bm.translationText}
                                            </p>
                                        )}

                                        {/* Embedded Note */}
                                        {note && (
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-symbols-outlined text-yellow-500 text-sm">edit_note</span>
                                                    <span className="text-xs font-bold text-slate-300">Personal Note</span>
                                                    <Link
                                                        to={`/surah/${bm.surahId}#verse-${bm.verseKey}`}
                                                        className="ml-auto text-[10px] text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        Edit <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                                    </Link>
                                                </div>
                                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-black/20 p-3 rounded-lg border border-white/5">
                                                    {note.text}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default BookmarksPage;
