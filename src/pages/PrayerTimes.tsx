import React, { useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

const PrayerTimes: React.FC = () => {
    const { latitude, longitude, error, loading: geoLoading } = useGeolocation();
    const [prayerTimes, setPrayerTimes] = React.useState<any>(null);
    const [qiblaDirection, setQiblaDirection] = React.useState<number>(0);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (latitude && longitude) {
            const fetchData = async () => {
                try {
                    // Fetch Prayer Times
                    const date = new Date();
                    const timesRes = await fetch(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2`); // Method 2: ISNA
                    const timesData = await timesRes.json();
                    setPrayerTimes(timesData.data);

                    // Fetch Qibla Direction
                    const qiblaRes = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
                    const qiblaData = await qiblaRes.json();
                    setQiblaDirection(qiblaData.data.direction);
                } catch (err) {
                    console.error("Failed to fetch API data", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else if (!geoLoading && !latitude) {
            setLoading(false); // Location access denied or Error
        }
    }, [latitude, longitude, geoLoading]);

    if (geoLoading || loading) {
        return (
            <div className="h-full flex items-center justify-center text-white">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl animate-spin mb-4 text-primary">progress_activity</span>
                    <p>Locating & Fetching Times...</p>
                </div>
            </div>
        );
    }

    if (error || !prayerTimes) {
        return (
            <div className="h-full flex items-center justify-center text-white">
                <div className="text-center max-w-md p-6 bg-white/5 rounded-3xl border border-white/5">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">location_off</span>
                    <h2 className="text-xl font-bold mb-2">Location Required</h2>
                    <p className="text-slate-400 mb-6">Please enable location access to calculate accurate prayer times and Qibla direction for your area.</p>
                </div>
            </div>
        );
    }

    const { timings, date, meta } = prayerTimes;
    const hijri = date.hijri;

    return (
        <div className="h-full flex flex-col lg:flex-row lg:items-start lg:gap-12 lg:p-8 pb-20 lg:pb-0">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 islamic-pattern pointer-events-none -z-10 opacity-50"></div>

            {/* Left Column: Header & Qibla */}
            <div className="flex flex-col items-center mb-6 lg:mb-0 lg:w-1/3 lg:sticky lg:top-24">
                <div className="hidden lg:flex flex-col items-center text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-1">{meta.timezone}</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">{hijri.day} {hijri.month.en} {hijri.year} AH</p>
                </div>

                {/* Qibla Compass */}
                <div className="relative w-56 h-56 lg:w-72 lg:h-72 flex items-center justify-center mb-6 lg:mb-10 transition-all duration-500">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-white/5 opacity-50"></div>
                    <div className="absolute inset-4 rounded-full border border-slate-100 dark:border-white/5"></div>
                    {/* Compass Dial - Rotated based on Qibla */}
                    <div className="absolute inset-0 rounded-full compass-dial opacity-20 transition-transform duration-1000" style={{ transform: `rotate(${qiblaDirection}deg)` }}></div>

                    <div className="relative z-20 flex flex-col items-center text-center">
                        <div style={{ transform: `rotate(${qiblaDirection}deg)` }} className="transition-transform duration-1000 mb-2">
                            <span className="material-symbols-outlined text-primary text-5xl lg:text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>navigation</span>
                        </div>
                        <span className="text-xs lg:text-sm font-bold tracking-tighter uppercase text-slate-500">Qibla</span>
                        <span className="text-2xl lg:text-4xl font-bold mt-1 text-white">{Math.round(qiblaDirection)}°</span>
                    </div>

                    <span className="absolute top-4 text-xs font-bold text-slate-500">N</span>
                    <span className="absolute right-4 text-xs font-bold text-slate-500">E</span>
                    <span className="absolute bottom-4 text-xs font-bold text-slate-500">S</span>
                    <span className="absolute left-4 text-xs font-bold text-slate-500">W</span>
                </div>
            </div>

            {/* Right Column: Prayer Times List */}
            <div className="flex-1 w-full space-y-3 lg:space-y-4">
                <h3 className="hidden lg:block text-xl font-bold text-white mb-6">Prayer Schedule</h3>

                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                    <div key={prayer} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors group">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                                {prayer === 'Fajr' ? 'wb_twilight' : prayer === 'Maghrib' ? 'wb_twilight' : prayer === 'Isha' ? 'bedtime' : 'wb_sunny'}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{prayer}</p>
                                <p className="text-lg font-bold text-white">{timings[prayer]}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="text-center pt-4">
                    <p className="text-xs text-slate-500">Calculation Method: {meta.method.name}</p>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
