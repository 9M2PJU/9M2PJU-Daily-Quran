import React, { useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

const PrayerTimes: React.FC = () => {
    const { latitude, longitude, error, loading: geoLoading } = useGeolocation();
    const [prayerTimes, setPrayerTimes] = useState<any>(null);
    const [qiblaDirection, setQiblaDirection] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (latitude && longitude) {
            const fetchData = async () => {
                try {
                    const date = new Date();
                    // Method 17: JAKIM (Malaysia)
                    const timesRes = await fetch(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=17`);
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
            setLoading(false);
        }
    }, [latitude, longitude, geoLoading]);

    // Convert decimal degrees to DMS string
    const toDMS = (deg: number) => {
        const d = Math.floor(Math.abs(deg));
        const m = Math.floor((Math.abs(deg) - d) * 60);
        const s = Math.round(((Math.abs(deg) - d) * 60 - m) * 60);
        return `${d}° ${m}' ${s}"`;
    };

    // Get cardinal direction from degrees
    const getCardinal = (deg: number) => {
        const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return dirs[Math.round(deg / 22.5) % 16];
    };

    const getCardinalFull = (deg: number) => {
        if (deg >= 337.5 || deg < 22.5) return 'North';
        if (deg >= 22.5 && deg < 67.5) return 'Northeast';
        if (deg >= 67.5 && deg < 112.5) return 'East';
        if (deg >= 112.5 && deg < 157.5) return 'Southeast';
        if (deg >= 157.5 && deg < 202.5) return 'South';
        if (deg >= 202.5 && deg < 247.5) return 'Southwest';
        if (deg >= 247.5 && deg < 292.5) return 'West';
        return 'Northwest';
    };

    if (geoLoading || loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl animate-spin mb-4 text-primary block">progress_activity</span>
                    <p>Locating & Fetching Times...</p>
                </div>
            </div>
        );
    }

    if (error || !prayerTimes) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-white">
                <div className="text-center max-w-md p-6 bg-white/5 rounded-3xl border border-white/5">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-4 block">location_off</span>
                    <h2 className="text-xl font-bold mb-2">Location Required</h2>
                    <p className="text-slate-400 mb-4">Please enable location access to calculate accurate prayer times and Qibla direction for your area.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary/20 text-primary rounded-full text-sm font-bold border border-primary/30 hover:bg-primary/30 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { timings, date, meta } = prayerTimes;
    const hijri = date.hijri;

    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    // Calculate distance to Kaaba (Haversine formula)
    const toRad = (n: number) => (n * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(kaabaLat - (latitude || 0));
    const dLon = toRad(kaabaLng - (longitude || 0));
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(latitude || 0)) * Math.cos(toRad(kaabaLat)) * Math.sin(dLon / 2) ** 2;
    const distanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

    return (
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 lg:p-8 pb-20 lg:pb-0">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 islamic-pattern pointer-events-none -z-10 opacity-50"></div>

            {/* Left Column: Qibla Bearing */}
            <div className="flex flex-col items-center mb-8 lg:mb-0 lg:w-1/3 lg:sticky lg:top-24">
                <div className="hidden lg:flex flex-col items-center text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-1">{meta.timezone}</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">{hijri.day} {hijri.month.en} {hijri.year} AH</p>
                </div>

                {/* Qibla Bearing Card */}
                <div className="w-full max-w-xs">
                    <div className="bg-gradient-to-b from-[#11241a] to-[#0d1f15] border border-white/10 rounded-3xl p-6 text-center shadow-2xl shadow-primary/5">
                        {/* Kaaba Icon */}
                        <div className="mb-4">
                            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-3">
                                <span className="text-3xl">🕋</span>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Qibla Direction</p>
                        </div>

                        {/* Main Bearing */}
                        <div className="mb-5">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-6xl font-bold text-white tracking-tight">{Math.round(qiblaDirection)}</span>
                                <span className="text-2xl text-primary font-bold">°</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1", transform: `rotate(${qiblaDirection}deg)` }}>
                                    navigation
                                </span>
                                <span className="text-sm text-primary font-bold uppercase tracking-wider">
                                    {getCardinalFull(qiblaDirection)}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-3 text-left">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs">straighten</span>
                                    Bearing
                                </span>
                                <span className="text-white font-mono font-bold">{toDMS(qiblaDirection)} {getCardinal(qiblaDirection)}</span>
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs">social_distance</span>
                                    Distance
                                </span>
                                <span className="text-white font-mono font-bold">{distanceKm.toLocaleString()} km</span>
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs">my_location</span>
                                    Your Loc
                                </span>
                                <span className="text-white font-mono font-bold text-[11px]">{latitude?.toFixed(4)}°, {longitude?.toFixed(4)}°</span>
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                    Kaaba
                                </span>
                                <span className="text-white font-mono font-bold text-[11px]">{kaabaLat}°, {kaabaLng}°</span>
                            </div>
                        </div>

                        {/* Instruction */}
                        <p className="text-[10px] text-slate-500 mt-4 leading-relaxed px-2">
                            Face <strong className="text-primary">{Math.round(qiblaDirection)}° {getCardinalFull(qiblaDirection)}</strong> from North using any compass app on your phone.
                        </p>
                    </div>
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
