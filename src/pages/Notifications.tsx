import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { usePageSEO } from '../hooks/usePageSEO';

const Notifications: React.FC = () => {
    usePageSEO({
        title: 'Pemberitahuan & Peringatan Harian | 9M2PJU Daily Quran',
        description: 'Peringatan bacaan harian, tips tadabbur Al-Quran, dan status pencapaian istiqamah anda.',
        canonicalUrl: 'https://quran.hamradio.my/#/notifications',
    });

    const { notifications, markAllAsRead, clearAll } = useNotifications();

    return (
        <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                                notifications
                            </span>
                        </span>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Notifikasi & Peringatan</h1>
                    </div>
                    <p className="text-slate-400 text-sm">Peringatan amalan, tips harian, dan ringkasan kemajuan tilawah anda.</p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-sm">done_all</span>
                        Tanda Semua Dibaca
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-4 py-2 bg-white/5 text-slate-400 text-xs font-medium rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all border border-transparent flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-sm">delete_sweep</span>
                        Kosongkan
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3.5">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
                                !n.isRead
                                    ? 'bg-gradient-to-r from-emerald-500/15 via-[#0d2017] to-[#07140e] border-emerald-500/30 shadow-lg shadow-emerald-500/5 relative'
                                    : 'bg-[#0d2017]/60 hover:bg-[#0d2017] border-white/5 opacity-85'
                            }`}
                        >
                            {!n.isRead && (
                                <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                            )}
                            <div className="flex gap-4 items-start">
                                <div
                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                                        n.type === 'tip'
                                            ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {n.type === 'tip' ? 'lightbulb' : 'notifications'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                                        <h3 className="font-bold text-white text-sm sm:text-base">{n.title}</h3>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
                                            {n.time}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{n.message}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-[#0d2017] rounded-3xl border border-white/5 shadow-xl">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-slate-600">
                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Tiada Notifikasi</h3>
                        <p className="text-slate-400 text-xs">Semua peringatan dan aktiviti anda telah dikemaskini!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
