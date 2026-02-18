import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarkContext';

const BookmarksPage: React.FC = () => {
    const { bookmarks, notes, removeBookmark, deleteNote } = useBookmarks();

    const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
    const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="pb-12 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Bookmarks & Notes</h1>
                <p className="text-slate-400 text-sm">Your saved verses and personal reflections.</p>
            </div>

            {/* Bookmarked Verses */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary fill-1">bookmark</span>
                    <h2 className="text-lg font-bold text-white">Bookmarked Verses</h2>
                    <span className="ml-auto text-xs font-bold text-slate-500">{bookmarks.length} saved</span>
                </div>

                {sortedBookmarks.length === 0 ? (
                    <div className="bg-[#0f2416] rounded-2xl border border-white/5 p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">bookmark_border</span>
                        <p className="text-slate-500 text-sm mb-1">No bookmarks yet</p>
                        <p className="text-slate-600 text-xs">Tap the bookmark icon on any verse to save it here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedBookmarks.map((bm) => (
                            <div key={bm.verseKey} className="group bg-[#0f2416] rounded-2xl border border-white/5 hover:border-primary/20 transition-all overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/surah/${bm.surahId}`}
                                                className="text-xs font-bold text-primary hover:text-primary-light transition-colors"
                                            >
                                                {bm.surahName} [{bm.verseKey}]
                                            </Link>
                                            <span className="text-[10px] text-slate-600">
                                                {new Date(bm.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeBookmark(bm.verseKey)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                                            title="Remove bookmark"
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                    <p className="font-arabic text-xl text-[#e2e8f0] text-right leading-[2] mb-3" dir="rtl">
                                        {bm.arabicText}
                                    </p>
                                    {bm.translationText && (
                                        <p className="text-slate-400 text-sm font-serif leading-relaxed">
                                            {bm.translationText}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Personal Notes */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-yellow-500 fill-1">edit_note</span>
                    <h2 className="text-lg font-bold text-white">Personal Notes</h2>
                    <span className="ml-auto text-xs font-bold text-slate-500">{notes.length} notes</span>
                </div>

                {sortedNotes.length === 0 ? (
                    <div className="bg-[#0f2416] rounded-2xl border border-white/5 p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">note_add</span>
                        <p className="text-slate-500 text-sm mb-1">No notes yet</p>
                        <p className="text-slate-600 text-xs">Add personal notes while reading any surah from the Notes tab.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedNotes.map((note) => (
                            <div key={note.verseKey} className="group bg-[#0f2416] rounded-2xl border border-white/5 hover:border-yellow-500/20 transition-all overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/surah/${note.surahId}`}
                                                className="text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
                                            >
                                                {note.surahName} [{note.verseKey}]
                                            </Link>
                                            <span className="text-[10px] text-slate-600">
                                                {new Date(note.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteNote(note.verseKey)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                                            title="Delete note"
                                        >
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {note.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default BookmarksPage;
