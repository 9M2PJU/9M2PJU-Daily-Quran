import React, { useMemo } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { usePrayerTimesCache, type PrayerDay } from '../hooks/usePrayerTimesCache';
import { usePageSEO } from '../hooks/usePageSEO';

const HIJRI_MONTHS = [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah',
];

const SkeletonRow = () => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10"></div>
            <div>
                <div className="h-3 w-16 bg-white/10 rounded mb-2"></div>
                <div className="h-5 w-24 bg-white/10 rounded"></div>
            </div>
        </div>
        <div className="h-6 w-16 bg-white/10 rounded-full"></div>
    </div>
);

const SkeletonQibla = () => (
    <div className="w-full max-w-sm">
        <div className="bg-gradient-to-b from-[#0d2017] to-[#07140e] border border-emerald-500/20 rounded-3xl p-6 text-center animate-pulse shadow-2xl">
            <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-2xl mb-4"></div>
            <div className="h-12 w-28 bg-white/10 rounded mx-auto mb-4"></div>
            <div className="bg-black/30 rounded-2xl p-4 space-y-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-3 bg-white/10 rounded"></div>
                ))}
            </div>
        </div>
    </div>
);

const PrayerTimes: React.FC = () => {
    usePageSEO({
        title: 'Waktu Solat & Arah Kiblat Malaysia (JAKIM) | 9M2PJU Daily Quran',
        description: 'Jadual waktu solat tepat JAKIM mengikut zon seluruh Malaysia serta kompas arah kiblat dan bearing Kaabah interaktif.',
        canonicalUrl: 'https://quran.hamradio.my/#/prayer-times',
    });

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
        if (deg >= 337.5 || deg < 22.5) return 'Utara (North)';
        if (deg >= 22.5 && deg < 67.5) return 'Timur Laut (Northeast)';
        if (deg >= 67.5 && deg < 112.5) return 'Timur (East)';
        if (deg >= 112.5 && deg < 157.5) return 'Tenggara (Southeast)';
        if (deg >= 157.5 && deg < 202.5) return 'Selatan (South)';
        if (deg >= 202.5 && deg < 247.5) return 'Barat Daya (Southwest)';
        if (deg >= 247.5 && deg < 292.5) return 'Barat Laut (Northwest)';
        return 'Barat (West)';
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
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 pb-20 lg:pb-0">
                <div className="flex flex-col items-center mb-8 lg:mb-0 lg:w-5/12 lg:sticky lg:top-24">
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
            <div className="min-h-[50vh] flex items-center justify-center text-white px-4">
                <div className="text-center max-w-md p-8 bg-[#0d2017] rounded-3xl border border-white/10 shadow-2xl">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-amber-400">location_off</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white">Akses Lokasi Diperlukan</h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        Sila benarkan akses lokasi pelayar web anda untuk mendapatkan jadual waktu solat zon JAKIM dan arah kiblat yang tepat.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-emerald-500 text-[#07140e] font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Cuba Semula
                    </button>
                </div>
            </div>
        );
    }

    // Find today's prayer entry
    const today = new Date().getDate();
    const todayPrayer = apiData.prayers.find(p => p.day === today) || apiData.prayers[0];
    const hijri = formatHijri(todayPrayer.hijri);

    const prayerList: { name: string; key: keyof PrayerDay; icon: string; malayName: string }[] = [
        { name: 'Fajr', malayName: 'Subuh', key: 'fajr', icon: 'wb_twilight' },
        { name: 'Syuruk', malayName: 'Syuruk', key: 'syuruk', icon: 'wb_sunny' },
        { name: 'Dhuhr', malayName: 'Zohor', key: 'dhuhr', icon: 'wb_sunny' },
        { name: 'Asr', malayName: 'Asar', key: 'asr', icon: 'wb_sunny' },
        { name: 'Maghrib', malayName: 'Maghrib', key: 'maghrib', icon: 'wb_twilight' },
        { name: 'Isha', malayName: 'Isyak', key: 'isha', icon: 'bedtime' },
    ];

    const currentTimestamp = Math.floor(Date.now() / 1000);
    // Find the next upcoming prayer
    const nextPrayer = prayerList.find(p => (todayPrayer[p.key] as number) > currentTimestamp) || prayerList[0];

    return (
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 pb-20 lg:pb-0">
            {/* Left Column: Qibla Bearing & Location */}
            <div className="flex flex-col items-center mb-8 lg:mb-0 lg:w-5/12 lg:sticky lg:top-24">
                <div className="w-full max-w-sm">
                    <div className="bg-gradient-to-b from-[#0d2017] via-[#0b1b13] to-[#07140e] border border-emerald-500/20 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Top Badge */}
                        <div className="flex items-center justify-between gap-2 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Zon {apiData.zone}
                            </span>
                            <span className="text-[11px] font-semibold text-gold-400/90 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                                {hijri.day} {hijri.monthName} {hijri.year} AH
                            </span>
                        </div>

                        {/* Compass Visualization */}
                        <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                            {/* Outer Dial */}
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-[spin_60s_linear_infinite]"></div>
                            <div className="absolute inset-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm"></div>

                            {/* Cardinal Markers */}
                            <span className="absolute top-3 text-[10px] font-bold text-slate-400">N</span>
                            <span className="absolute bottom-3 text-[10px] font-bold text-slate-600">S</span>
                            <span className="absolute right-3 text-[10px] font-bold text-slate-600">E</span>
                            <span className="absolute left-3 text-[10px] font-bold text-slate-600">W</span>

                            {/* Rotating Pointer */}
                            <div
                                className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
                                style={{ transform: `rotate(${qiblaDirection}deg)` }}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-gold-400 text-3xl drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        navigation
                                    </span>
                                    <div className="w-0.5 h-10 bg-gradient-to-t from-transparent via-gold-400 to-transparent"></div>
                                </div>
                            </div>

                            {/* Center Kaaba Icon */}
                            <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-[#132b20] to-[#07140e] border border-gold-500/40 flex items-center justify-center shadow-lg">
                                <span className="text-xl">🕋</span>
                            </div>
                        </div>

                        {/* Main Bearing Display */}
                        <div className="mb-5">
                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-1">Arah Kiblat (Qibla Bearing)</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-extrabold text-white tracking-tight">{Math.round(qiblaDirection)}</span>
                                <span className="text-2xl text-gold-400 font-bold">°</span>
                            </div>
                            <p className="text-xs font-semibold text-emerald-400 mt-1">
                                {getCardinalFull(qiblaDirection)} ({toDMS(qiblaDirection)} {getCardinal(qiblaDirection)})
                            </p>
                        </div>

                        {/* Details Table */}
                        <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-2.5 text-left text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-emerald-400">social_distance</span>
                                    Jarak ke Kaabah
                                </span>
                                <span className="text-white font-mono font-bold">{distanceKm.toLocaleString()} km</span>
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-emerald-400">my_location</span>
                                    Koordinat Anda
                                </span>
                                <span className="text-slate-200 font-mono font-medium text-[11px]">
                                    {latitude?.toFixed(4)}°, {longitude?.toFixed(4)}°
                                </span>
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-emerald-400">mosque</span>
                                    Sumber Waktu
                                </span>
                                <span className="text-emerald-300 font-medium">JAKIM / E-Solat</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                            Halakan peranti anda ke sudut <strong className="text-gold-400 font-bold">{Math.round(qiblaDirection)}°</strong> dari Utara (North).
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Prayer Times List */}
            <div className="flex-1 w-full space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Jadual Waktu Solat</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Waktu rasmi solat berpandukan Jabatan Kemajuan Islam Malaysia (JAKIM)</p>
                    </div>
                </div>

                {prayerList.map(({ name, malayName, key, icon }) => {
                    const timeStr = formatTime(todayPrayer[key] as number);
                    const isNext = nextPrayer.key === key;

                    return (
                        <div
                            key={name}
                            className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                                isNext
                                    ? 'bg-gradient-to-r from-emerald-500/15 via-[#0d2017] to-[#07140e] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                                    : 'bg-[#0d2017]/70 hover:bg-[#0d2017] border-white/5 hover:border-emerald-500/20'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                                        isNext
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-white/5 text-slate-400'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">{icon}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-bold text-white">{malayName}</p>
                                        <span className="text-xs text-slate-400 font-medium">({name})</span>
                                        {isNext && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                Seterusnya
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">Hari ini</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`text-xl sm:text-2xl font-bold tracking-tight font-mono ${isNext ? 'text-emerald-400' : 'text-slate-100'}`}>
                                    {timeStr}
                                </p>
                            </div>
                        </div>
                    );
                })}

                <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-white/5 text-center text-xs text-slate-500 space-y-1">
                    <p>Zon Lokasi: <strong className="text-slate-300">{apiData.zone}</strong> · Kemaskini automatik berasaskan GPS</p>
                    <p>{hijri.day} {hijri.monthName} {hijri.year} AH · {new Date().toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
