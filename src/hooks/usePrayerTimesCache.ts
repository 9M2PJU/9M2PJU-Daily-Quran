import { useState, useEffect } from 'react';

export interface PrayerDay {
    day: number;
    hijri: string;
    fajr: number;
    syuruk: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
}

export interface WaktuSolatResponse {
    zone: string;
    year: number;
    month: string;
    month_number: number;
    last_updated: string | null;
    prayers: PrayerDay[];
}

interface CacheEntry {
    zone: string;
    month_number: number;
    year: number;
    data: WaktuSolatResponse;
}

const CACHE_KEY = 'prayerTimesCache';

const readCache = (): WaktuSolatResponse | null => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const entry: CacheEntry = JSON.parse(raw);
        const now = new Date();
        // Valid if same month & year
        if (entry.month_number === now.getMonth() + 1 && entry.year === now.getFullYear()) {
            return entry.data;
        }
    } catch { /* ignore corrupt cache */ }
    return null;
};

const writeCache = (data: WaktuSolatResponse) => {
    try {
        const entry: CacheEntry = {
            zone: data.zone,
            month_number: data.month_number,
            year: data.year,
            data,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch { /* ignore */ }
};

export const usePrayerTimesCache = (latitude: number | null, longitude: number | null) => {
    const [data, setData] = useState<WaktuSolatResponse | null>(() => readCache());
    const [loading, setLoading] = useState(!readCache());

    useEffect(() => {
        if (!latitude || !longitude) return;

        // If we already have valid cached data, skip fetch
        const cached = readCache();
        if (cached) {
            setData(cached);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        fetch(`https://api.waktusolat.app/v2/solat/gps/${latitude}/${longitude}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch prayer times');
                return res.json();
            })
            .then((result: WaktuSolatResponse) => {
                if (!cancelled) {
                    writeCache(result);
                    setData(result);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error('Failed to fetch prayer times', err);
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [latitude, longitude]);

    return { data, loading };
};
