import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Surah } from '../services/api';

interface SurahCardProps {
    surah: Surah;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/surah/${surah.id}`)}
            className="group relative overflow-hidden rounded-2xl glass p-5 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-gold cursor-pointer border border-transparent hover:border-yellow-500/30 h-full"
        >
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-yellow-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>

            <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm font-mono">{surah.id}</span>
                        <div className="absolute inset-0 border-2 border-emerald-100 dark:border-emerald-800 rounded-full scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">{surah.name_simple}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{surah.translated_name.name}</p>
                    </div>
                </div>

                <div className="text-right flex-shrink-0 flex flex-col items-end">
                    <p className="font-arabic text-2xl text-emerald-800 dark:text-emerald-300 leading-none mb-2">{surah.name_arabic}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">
                        {surah.verses_count} Verses
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SurahCard;
