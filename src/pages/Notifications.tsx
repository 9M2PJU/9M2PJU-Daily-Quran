import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const Notifications: React.FC = () => {
    const { notifications, markAllAsRead, clearAll } = useNotifications();

    return (
        <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                    <p className="text-slate-400">Stay updated with your progress and tips.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-[#0a1a10] transition-all"
                    >
                        Mark all as read
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-4 py-2 bg-white/5 text-slate-400 text-sm font-medium rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`p-6 rounded-3xl border transition-all ${!n.isRead
                                ? 'bg-primary/5 border-primary/20 relative'
                                : 'bg-[#0f2416] border-white/5 opacity-80'
                                }`}
                        >
                            {!n.isRead && (
                                <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(17,212,66,0.6)] animate-pulse"></div>
                            )}
                            <div className="flex gap-4">
                                <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'tip' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-primary/10 text-primary'}`}>
                                    <span className="material-symbols-outlined fill-1">
                                        {n.type === 'tip' ? 'lightbulb' : 'notifications'}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-white">{n.title}</h3>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{n.time}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">{n.message}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-[#0f2416] rounded-3xl border border-white/5">
                        <span className="material-symbols-outlined text-6xl text-slate-700 mb-4 block">notifications_off</span>
                        <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
                        <p className="text-slate-500">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
