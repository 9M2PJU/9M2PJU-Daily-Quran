import React, { useMemo } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { usePrayerTimesCache, type PrayerDay } from '../hooks/usePrayerTimesCache';

const HIJRI_MONTHS = [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah',
];

// Skeleton placeholder row
const SkeletonRow = () => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded bg-white/10"></div>
            <div>
                <div className="h-3 w-16 bg-white/10 rounded mb-2"></div>
                <div className="h-5 w-24 bg-white/10 rounded"></div>
            </div>
        </div>
    </div>
);

const SkeletonQibla = () => (
    <div className="w-full max-w-xs">
        <div className="bg-gradient-to-b from-[#11241a] to-[#0d1f15] border border-white/10 rounded-3xl p-6 text-center animate-pulse">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl mb-4"></div>
            <div className="h-14 w-24 bg-white/10 rounded mx-auto mb-4"></div>
            <div className="bg-black/30 rounded-2xl p-4 space-y-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-3 bg-white/10 rounded"></div>
                ))}
            </div>
        </div>
    </div>
);

const PrayerTimes: React.FC = () => {
    const { latitude, longitude, error, loading: geoLoading } = useGeolocation();
    const { data: apiData, loading } = usePrayerTimesCache(latitude, longitude);

    // Format Unix timestamp to HH:mm
    const formatTime = (ts: number) => {
        const d = new Date(ts * 1000);
        return d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Parse hijri date string "YYYY-MM-DD" to readable format
    const formatHijri = (hijriStr: string) => {
        const [year, month, day] = hijriStr.split('-').map(Number);
        const monthName = HIJRI_MONTHS[month - 1] || `Month ${month}`;
        return { day, monthName, year };
    };

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

    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    // Calculate Qibla direction locally
    const qiblaDirection = useMemo(() => {
        if (!latitude || !longitude) return 0;
        const toRad = (n: number) => (n * Math.PI) / 180;
        const toDeg = (n: number) => (n * 180) / Math.PI;
        const phiK = toRad(kaabaLat);
        const lambdaK = toRad(kaabaLng);
        const phi = toRad(latitude);
        const lambda = toRad(longitude);
        const bearing = toDeg(
            Math.atan2(
                Math.sin(lambdaK - lambda),
                Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
            )
        );
        return (bearing + 360) % 360;
    }, [latitude, longitude]);

    // Calculate distance to Kaaba (Haversine formula)
    const distanceKm = useMemo(() => {
        if (!latitude || !longitude) return 0;
        const toRad = (n: number) => (n * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(kaabaLat - latitude);
        const dLon = toRad(kaabaLng - longitude);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(latitude)) * Math.cos(toRad(kaabaLat)) * Math.sin(dLon / 2) ** 2;
        return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }, [latitude, longitude]);

    // Show skeleton while loading (either geo or prayer data)
    if ((geoLoading && !latitude) || loading) {
        return (
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 lg:p-8 pb-20 lg:pb-0">
                <div className="absolute inset-0 islamic-pattern pointer-events-none -z-10 opacity-50"></div>
                <div className="flex flex-col items-center mb-8 lg:mb-0 lg:w-1/3 lg:sticky lg:top-24">
                    <SkeletonQibla />
                </div>
                <div className="flex-1 w-full space-y-3 lg:space-y-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonRow key={i} />)}
                </div>
            </div>
        );
    }

    if (error || !apiData) {
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

    // Find today's prayer entry
    const today = new Date().getDate();
    const todayPrayer = apiData.prayers.find(p => p.day === today) || apiData.prayers[0];
    const hijri = formatHijri(todayPrayer.hijri);

    const prayerList: { name: string; key: keyof PrayerDay; icon: string }[] = [
        { name: 'Fajr', key: 'fajr', icon: 'wb_twilight' },
        { name: 'Syuruk', key: 'syuruk', icon: 'wb_sunny' },
        { name: 'Dhuhr', key: 'dhuhr', icon: 'wb_sunny' },
        { name: 'Asr', key: 'asr', icon: 'wb_sunny' },
        { name: 'Maghrib', key: 'maghrib', icon: 'wb_twilight' },
        { name: 'Isha', key: 'isha', icon: 'bedtime' },
    ];

    return (
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 lg:p-8 pb-20 lg:pb-0">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 islamic-pattern pointer-events-none -z-10 opacity-50"></div>

            {/* Left Column: Qibla Bearing */}
            <div className="flex flex-col items-center mb-8 lg:mb-0 lg:w-1/3 lg:sticky lg:top-24">
                <div className="hidden lg:flex flex-col items-center text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-1">Zone {apiData.zone}</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">{hijri.day} {hijri.monthName} {hijri.year} AH</p>
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

                {prayerList.map(({ name, key, icon }) => (
                    <div key={name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors group">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                                {icon}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{name}</p>
                                <p className="text-lg font-bold text-white">{formatTime(todayPrayer[key] as number)}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="text-center pt-4 space-y-1">
                    <p className="text-xs text-slate-500">Zone: {apiData.zone} · JAKIM</p>
                    <p className="text-xs text-slate-500">{hijri.day} {hijri.monthName} {hijri.year} AH</p>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
