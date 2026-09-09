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
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0d2017] to-[#07140e] p-5 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer border border-white/5 hover:border-emerald-500/30 h-full flex flex-col justify-between"
        >
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-gold-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="relative flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                        <span className="font-bold text-emerald-400 text-sm font-mono">{surah.id}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors truncate">
                            {surah.name_simple}
                        </h3>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                            {surah.translated_name.name}
                        </p>
                    </div>
                </div>

                <div className="text-right flex-shrink-0 flex flex-col items-end">
                    <p className="font-arabic text-2xl text-gold-400 leading-none mb-2">
                        {surah.name_arabic}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/30 border border-white/5 text-slate-400 group-hover:border-gold-500/30 group-hover:text-gold-400 transition-colors">
                        {surah.verses_count} Ayat
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SurahCard;
