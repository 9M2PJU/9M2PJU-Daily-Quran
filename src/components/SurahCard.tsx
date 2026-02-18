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
            className="group relative overflow-hidden rounded-2xl glass p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold cursor-pointer border border-transparent hover:border-yellow-500/30"
        >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-yellow-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">{surah.id}</span>
                        <div className="absolute inset-0 border-2 border-emerald-100 dark:border-emerald-800 rounded-full scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{surah.name_simple}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{surah.translated_name.name}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="font-arabic text-2xl text-emerald-800 dark:text-emerald-300 mb-1">{surah.name_arabic}</p>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">
                        {surah.verses_count} Verses
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SurahCard;
