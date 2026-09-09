import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarkContext';
import { usePageSEO } from '../hooks/usePageSEO';

const BookmarksPage: React.FC = () => {
    usePageSEO({
        title: 'Penanda Buku & Nota Tadabbur | 9M2PJU Daily Quran',
        description: 'Senarai ayat-ayat Al-Quran yang ditandakan dan catatan refleksi peribadi (tadabbur) anda.',
        canonicalUrl: 'https://quran.hamradio.my/#/bookmarks',
    });

    const { bookmarks, removeBookmark, getNote } = useBookmarks();

    const sortedBookmarks = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="pb-16 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                            bookmark
                        </span>
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Penanda Buku & Nota</h1>
                </div>
                <p className="text-slate-400 text-sm">
                    Simpanan ayat-ayat pilihan dan catatan tadabbur peribadi anda untuk rujukan berterusan.
                </p>
            </div>

            {/* Saved Verses & Notes Section */}
            <section className="mb-10">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Ayat Disimpan</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            {bookmarks.length}
                        </span>
                    </div>
                </div>

                {sortedBookmarks.length === 0 ? (
                    <div className="bg-[#0d2017] rounded-3xl border border-white/5 p-12 text-center shadow-xl">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-500">
                            <span className="material-symbols-outlined text-3xl">bookmark_border</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Tiada penanda buku lagi</h3>
                        <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                            Tekan ikon penanda buku atau tambah catatan refleksi pada mana-mana ayat semasa membaca untuk menyimpannya di sini.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedBookmarks.map((bm) => {
                            const note = getNote(bm.verseKey);
                            return (
                                <div
                                    key={bm.verseKey}
                                    className="group bg-gradient-to-b from-[#0d2017] to-[#07140e] rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden shadow-xl p-6"
                                >
                                    {/* Top Meta Bar */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Link
                                                to={`/surah/${bm.surahId}#verse-${bm.verseKey}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                                            >
                                                <span>{bm.surahName}</span>
                                                <span className="font-mono text-[11px]">[{bm.verseKey}]</span>
                                                <span className="material-symbols-outlined text-xs">arrow_outward</span>
                                            </Link>
                                            <span className="text-[11px] text-slate-500">
                                                {new Date(bm.timestamp).toLocaleDateString('ms-MY', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {note && (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2.5 py-0.5 rounded-full">
                                                    <span className="material-symbols-outlined text-xs">edit_note</span>
                                                    Ada Nota
                                                </span>
                                            )}
                                            <button
                                                onClick={() => removeBookmark(bm.verseKey)}
                                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center border border-white/5 hover:border-red-500/30"
                                                title="Padam penanda buku"
                                            >
                                                <span className="material-symbols-outlined text-base">close</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Arabic Verse */}
                                    <p
                                        className="font-arabic text-2xl sm:text-3xl text-slate-100 text-right leading-[2.2] mb-4 selection:bg-gold-500/20"
                                        dir="rtl"
                                    >
                                        {bm.arabicText}
                                    </p>

                                    {/* Translation */}
                                    {bm.translationText && (
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4 font-serif pl-3 border-l-2 border-emerald-500/40">
                                            {bm.translationText}
                                        </p>
                                    )}

                                    {/* Embedded Note */}
                                    {note && (
                                        <div className="mt-4 pt-4 border-t border-white/5 bg-black/20 -mx-6 -mb-6 p-6">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2 text-gold-400">
                                                    <span className="material-symbols-outlined text-base">sticky_note_2</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider">Nota Tadabbur Anda</span>
                                                </div>
                                                <Link
                                                    to={`/surah/${bm.surahId}#verse-${bm.verseKey}`}
                                                    className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                                                >
                                                    Kemaskini Nota <span className="material-symbols-outlined text-[12px]">edit</span>
                                                </Link>
                                            </div>
                                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-[#07140e] p-3.5 rounded-xl border border-white/5">
                                                {note.text}
                                            </p>
                                        </div>
                                    )}
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
