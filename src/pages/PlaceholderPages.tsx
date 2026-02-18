import React from 'react';
import { Link } from 'react-router-dom';

const PlaceholderPage: React.FC<{ title: string; icon: string; description: string }> = ({ title, icon, description }) => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 animate-fade-in">
        <div className="relative group mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
            <div className="relative size-24 bg-[#11241a] border border-white/5 rounded-full flex items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-5xl text-primary/80 group-hover:text-primary transition-colors duration-300">{icon}</span>
            </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-slate-400 max-w-md text-base leading-relaxed mb-8">
            {description}
            <br />
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-2 block">Coming Soon</span>
        </p>

        <Link to="/" className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all border border-white/5 hover:border-white/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Dashboard
        </Link>
    </div>
);

export const Library = () => <PlaceholderPage
    title="Library"
    icon="auto_stories"
    description="Browse the complete Quran with multiple translations, tafsir, and advanced search capabilities."
/>;

export const Bookmarks = () => <PlaceholderPage
    title="Bookmarks"
    icon="bookmark"
    description="Save your favorite verses and tracking your reading progress across different Surahs."
/>;

export const Activity = () => <PlaceholderPage
    title="Recent Activity"
    icon="history"
    description="View your reading history, daily streaks, and detailed insights about your journey."
/>;
