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
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between border border-transparent hover:border-green-100"
            style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'rgba(4, 120, 87, 0.1)',
            }}
        >
            <div className="flex items-center gap-4">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm"
                    style={{
                        backgroundColor: 'rgba(4, 120, 87, 0.1)',
                        color: 'var(--color-primary)'
                    }}
                >
                    {surah.id}
                </div>
                <div>
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{surah.name_simple}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{surah.translated_name.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-arabic text-xl text-emerald-800" style={{ color: 'var(--color-primary)' }}>{surah.name_arabic}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{surah.verses_count} Verses</p>
            </div>
        </div>
    );
};

export default SurahCard;
