import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    type: 'tip' | 'system' | 'update';
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAllAsRead: () => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Daily Tip',
        message: "Don't forget to read Surah Al-Mulk before sleep.",
        time: '2 HOURS AGO',
        isRead: false,
        type: 'tip'
    },
    {
        id: '2',
        title: 'System Update',
        message: 'Version 1.3.0 is now live with new features!',
        time: '1 DAY AGO',
        isRead: true,
        type: 'system'
    }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        try {
            const saved = localStorage.getItem('quran-notifications');
            return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
        } catch {
            return INITIAL_NOTIFICATIONS;
        }
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => {
            const updated = prev.map(n => ({ ...n, isRead: true }));
            localStorage.setItem('quran-notifications', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => {
            const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
            localStorage.setItem('quran-notifications', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        localStorage.setItem('quran-notifications', JSON.stringify([]));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};
