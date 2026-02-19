import React, { useEffect, useState, useCallback } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

const PrayerTimes: React.FC = () => {
    const { latitude, longitude, error, loading: geoLoading } = useGeolocation();
    const [prayerTimes, setPrayerTimes] = useState<any>(null);
    const [qiblaDirection, setQiblaDirection] = useState<number>(0);
    const [heading, setHeading] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
    const [showPermissionBtn, setShowPermissionBtn] = useState<boolean>(false);

    useEffect(() => {
        // Check if iOS 13+ permission is needed
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setShowPermissionBtn(true);
        } else {
            setPermissionGranted(true);
        }
    }, []);

    useEffect(() => {
        if (!permissionGranted) return;

        const handleOrientation = (e: any) => {
            let compass = 0;
            if (e.webkitCompassHeading) {
                // iOS
                compass = e.webkitCompassHeading;
            } else if (e.alpha) {
                // Android / Standard (alpha is 0 at North, usually)
                // However, alpha is often relative. deviceorientationabsolute is better but less supported.
                // Assuming standard alpha: 360 - alpha might be needed if rotation is counter-clockwise?
                // Standard: alpha = degrees around Z axis. 0 = North? 
                // Actually, alpha 0 = North for deviceorientationabsolute.
                compass = 360 - e.alpha;
            }
            setHeading(compass);
        };

        if ('ondeviceorientationabsolute' in window) {
            (window as any).addEventListener('deviceorientationabsolute', handleOrientation);
        } else {
            (window as any).addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            if ('ondeviceorientationabsolute' in window) {
                (window as any).removeEventListener('deviceorientationabsolute', handleOrientation);
            } else {
                (window as any).removeEventListener('deviceorientation', handleOrientation);
            }
        };
    }, [permissionGranted]);

    const requestCompassPermission = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    setShowPermissionBtn(false);
                } else {
                    alert('Permission denied. Compass will not work.');
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    useEffect(() => {
        if (latitude && longitude) {
            const fetchData = async () => {
                try {
                    // Fetch Prayer Times
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

    // Compass Rotation Logic
    // Dial rotates to match real North (so 'N' on dial points North). Rotation = -heading
    // Qibla needle stays fixed on the dial at the Qibla Angle. 
    // Wait, physically the dial on the screen rotates.
    // If heading is 0 (North), visual dial rotation -0. N is up.
    // If heading is 90 (East), visual dial rotation -90. N is left. Correct.
    const dialRotation = heading !== null ? -heading : 0;
    const qiblaNeedleRotation = qiblaDirection; // Relative to the dial's N

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

                    {/* Compass Container - Rotates with device heading */}
                    <div
                        className="absolute inset-0 transition-transform duration-300 ease-out"
                        style={{ transform: `rotate(${dialRotation}deg)` }}
                    >
                        {/* Dial Markings */}
                        <div className="absolute inset-0 rounded-full compass-dial opacity-20"></div>
                        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">N</span>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">E</span>
                        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">S</span>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">W</span>

                        {/* Qibla Needle/Icon - Fixed specific angle on the dial */}
                        <div
                            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                            style={{ transform: `rotate(${qiblaNeedleRotation}deg)` }}
                        >
                            {/* Direction Arrow */}
                            <div className="absolute top-6 flex flex-col items-center">
                                <div className="w-4 h-16 bg-gradient-to-t from-primary/20 to-primary rounded-full blur-[1px] absolute -top-2"></div>
                                <span className="material-symbols-outlined text-primary text-4xl drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    navigation
                                </span>
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1 drop-shadow-md">Qibla</span>
                            </div>
                        </div>
                    </div>

                    {/* Center Info (Static relative to screen) */}
                    <div className="relative z-20 flex flex-col items-center text-center bg-[#0a1a10]/80 backdrop-blur-sm p-4 rounded-full w-24 h-24 flex items-center justify-center border border-white/10 shadow-xl">
                        <span className="text-[10px] font-bold tracking-tighter uppercase text-slate-500">Qibla</span>
                        <span className="text-xl font-bold mt-0 text-white">{Math.round(qiblaDirection)}°</span>
                    </div>
                </div>

                {showPermissionBtn && !permissionGranted && (
                    <button
                        onClick={requestCompassPermission}
                        className="mb-6 px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 hover:bg-primary/30 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">explore</span>
                        Enable Compass
                    </button>
                )}
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
                    {heading !== null && <p className="text-[10px] text-slate-600 mt-1">Compass Accuracy: ±5°</p>}
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
