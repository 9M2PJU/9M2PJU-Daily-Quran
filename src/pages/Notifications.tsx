import React from 'react';

const Notifications: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <button className="text-sm text-primary hover:underline">Mark all as read</button>
            </div>

            <div className="space-y-4">
                <div className="bg-[#0f2416] border border-white/5 rounded-2xl p-4 flex gap-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Daily Tip</h3>
                        <p className="text-slate-400 text-xs mt-1">Don't forget to read Surah Al-Mulk before sleep.</p>
                        <span className="text-[10px] text-slate-500 font-bold mt-2 block">2 HOURS AGO</span>
                    </div>
                </div>

                <div className="bg-[#0f2416] border border-white/5 rounded-2xl p-4 flex gap-4 opacity-60">
                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                        <span className="material-symbols-outlined">update</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">System Update</h3>
                        <p className="text-slate-400 text-xs mt-1">Version 1.2.0 is now live with new features!</p>
                        <span className="text-[10px] text-slate-500 font-bold mt-2 block">1 DAY AGO</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
