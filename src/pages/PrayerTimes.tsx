import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

const PrayerTimes: React.FC = () => {
    const { latitude, longitude, error, loading: geoLoading } = useGeolocation();
    const [prayerTimes, setPrayerTimes] = useState<any>(null);
    const [qiblaDirection, setQiblaDirection] = useState<number>(0);
    const [heading, setHeading] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
    const [showPermissionBtn, setShowPermissionBtn] = useState<boolean>(false);
    const [sensorStatus, setSensorStatus] = useState<'waiting' | 'active' | 'unavailable'>('waiting');
    const [qiblaView, setQiblaView] = useState<'compass' | 'bearing'>('compass');
    const sensorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headingReceivedRef = useRef(false);

    useEffect(() => {
        // Check if iOS 13+ permission is needed
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setShowPermissionBtn(true);
        } else {
            setPermissionGranted(true);
        }
    }, []);

    // Compass sensor logic with robust fallback
    useEffect(() => {
        if (!permissionGranted) return;

        headingReceivedRef.current = false;
        setSensorStatus('waiting');

        const updateHeading = (compassHeading: number) => {
            if (!headingReceivedRef.current) {
                headingReceivedRef.current = true;
                setSensorStatus('active');
                if (sensorTimeoutRef.current) {
                    clearTimeout(sensorTimeoutRef.current);
                    sensorTimeoutRef.current = null;
                }
            }
            setHeading(compassHeading);
        };

        // Handler for standard deviceorientation (works on iOS + most Android)
        const handleOrientation = (e: any) => {
            // iOS provides webkitCompassHeading (compass heading in degrees from North)
            if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
                updateHeading(e.webkitCompassHeading);
                return;
            }
            // Android: alpha is available
            if (e.alpha !== null && e.alpha !== undefined) {
                // On Android Chrome, deviceorientation provides alpha relative to arbitrary direction
                // unless `absolute` is true. We handle it as best we can.
                // `absolute` means alpha is relative to North
                if (e.absolute || !('ondeviceorientationabsolute' in window)) {
                    // If absolute flag is set, or if absolute event doesn't exist (so this is our best bet)
                    updateHeading((360 - e.alpha) % 360);
                }
                // If not absolute and deviceorientationabsolute exists, skip this
                // (let the absolute handler provide accurate data)
            }
        };

        // Handler for deviceorientationabsolute (Android Chrome preferred)
        const handleAbsoluteOrientation = (e: any) => {
            if (e.alpha !== null && e.alpha !== undefined) {
                updateHeading((360 - e.alpha) % 360);
            }
        };

        // Register listeners
        // Always try absolute first (more accurate on Android)
        const hasAbsolute = 'ondeviceorientationabsolute' in window;
        if (hasAbsolute) {
            (window as any).addEventListener('deviceorientationabsolute', handleAbsoluteOrientation, true);
        }
        // Always also register standard orientation (covers iOS + Android fallback)
        (window as any).addEventListener('deviceorientation', handleOrientation, true);

        // Set a timeout: if no heading data after 5 seconds, mark sensor as unavailable
        sensorTimeoutRef.current = setTimeout(() => {
            if (!headingReceivedRef.current) {
                setSensorStatus('unavailable');
                // Switch to bearing view automatically
                setQiblaView('bearing');
            }
        }, 5000);

        return () => {
            if (hasAbsolute) {
                (window as any).removeEventListener('deviceorientationabsolute', handleAbsoluteOrientation, true);
            }
            (window as any).removeEventListener('deviceorientation', handleOrientation, true);
            if (sensorTimeoutRef.current) {
                clearTimeout(sensorTimeoutRef.current);
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
                    setSensorStatus('unavailable');
                    setQiblaView('bearing');
                }
            } catch (e) {
                console.error(e);
                setPermissionGranted(true);
            }
        } else {
            setPermissionGranted(true);
            setShowPermissionBtn(false);
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
    const dialRotation = heading !== null ? -heading : 0;
    const qiblaNeedleRotation = qiblaDirection; // Relative to the dial's N

    // Check alignment (within ±5 degrees) - accounting for wrap-around
    const isAligned = heading !== null && Math.abs((heading - qiblaDirection + 540) % 360 - 180) < 5;

    // Haptic feedback on alignment
    React.useEffect(() => {
        if (isAligned && navigator.vibrate) {
            navigator.vibrate(50);
        }
    }, [isAligned]);

    // Convert decimal degrees to DMS string
    const toDMS = (deg: number) => {
        const d = Math.floor(deg);
        const m = Math.floor((deg - d) * 60);
        const s = Math.round(((deg - d) * 60 - m) * 60);
        return `${d}° ${m}' ${s}"`;
    };

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

                {/* View Toggle */}
                <div className="flex gap-1 bg-white/5 rounded-full p-1 mb-4">
                    <button
                        onClick={() => setQiblaView('compass')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${qiblaView === 'compass' ? 'bg-primary text-[#0a1a10]' : 'text-slate-400 hover:text-white'}`}
                    >
                        Compass
                    </button>
                    <button
                        onClick={() => setQiblaView('bearing')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${qiblaView === 'bearing' ? 'bg-primary text-[#0a1a10]' : 'text-slate-400 hover:text-white'}`}
                    >
                        Bearing
                    </button>
                </div>

                {qiblaView === 'compass' ? (
                    <>
                        {/* Qibla Compass */}
                        <div className="relative w-56 h-56 lg:w-72 lg:h-72 flex items-center justify-center mb-6 lg:mb-10 transition-all duration-500">
                            <div className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${isAligned ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-slate-200 dark:border-white/5 opacity-50'}`}></div>
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
                                        <div className={`w-4 h-16 bg-gradient-to-t rounded-full blur-[1px] absolute -top-2 transition-colors duration-500 ${isAligned ? 'from-emerald-500/20 to-emerald-500' : 'from-primary/20 to-primary'}`}></div>
                                        <span
                                            className={`material-symbols-outlined text-4xl transition-all duration-500 ${isAligned ? 'text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] scale-110' : 'text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]'}`}
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            navigation
                                        </span>
                                        <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 drop-shadow-md transition-colors duration-500 ${isAligned ? 'text-emerald-500' : 'text-primary'}`}>
                                            {isAligned ? 'FACING QIBLA' : 'QIBLA'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Center Info (Static relative to screen) */}
                            <div className={`relative z-20 flex flex-col items-center text-center backdrop-blur-sm p-4 rounded-full w-24 h-24 flex items-center justify-center border shadow-xl transition-all duration-500 ${isAligned ? 'bg-emerald-900/80 border-emerald-500/50' : 'bg-[#0a1a10]/80 border-white/10'}`}>
                                <span className={`text-[10px] font-bold tracking-tighter uppercase transition-colors duration-500 ${isAligned ? 'text-emerald-400' : 'text-slate-500'}`}>Qibla</span>
                                <span className="text-xl font-bold mt-0 text-white">{Math.round(qiblaDirection)}°</span>
                            </div>
                        </div>

                        {/* Sensor Status */}
                        {sensorStatus === 'waiting' && (
                            <p className="text-xs text-yellow-500 animate-pulse mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                Waiting for compass sensor...
                            </p>
                        )}
                        {sensorStatus === 'unavailable' && (
                            <div className="text-center mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 max-w-xs">
                                <p className="text-xs text-yellow-500 font-bold mb-1">
                                    <span className="material-symbols-outlined text-sm align-text-bottom mr-1">warning</span>
                                    Compass sensor not available
                                </p>
                                <p className="text-[10px] text-slate-400">Your device may not support compass in the browser. Use "Bearing" view for manual compass direction.</p>
                            </div>
                        )}
                        {sensorStatus === 'active' && heading !== null && (
                            <p className="text-xs text-slate-500 mb-4">
                                Device heading: {Math.round(heading)}°
                            </p>
                        )}
                    </>
                ) : (
                    /* Bearing View: Simple numeric compass bearing (no sensor needed) */
                    <div className="flex flex-col items-center mb-6 lg:mb-10">
                        <div className="bg-[#11241a] border border-white/10 rounded-2xl p-8 text-center max-w-xs w-full">
                            <div className="mb-6">
                                <span className="material-symbols-outlined text-5xl text-primary mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>🕋</span>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Direction to Mecca</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-5xl font-bold text-white">{Math.round(qiblaDirection)}°</span>
                                <p className="text-sm text-primary font-bold mt-1">
                                    {qiblaDirection >= 337.5 || qiblaDirection < 22.5 ? 'North' :
                                        qiblaDirection >= 22.5 && qiblaDirection < 67.5 ? 'Northeast' :
                                            qiblaDirection >= 67.5 && qiblaDirection < 112.5 ? 'East' :
                                                qiblaDirection >= 112.5 && qiblaDirection < 157.5 ? 'Southeast' :
                                                    qiblaDirection >= 157.5 && qiblaDirection < 202.5 ? 'South' :
                                                        qiblaDirection >= 202.5 && qiblaDirection < 247.5 ? 'Southwest' :
                                                            qiblaDirection >= 247.5 && qiblaDirection < 292.5 ? 'West' :
                                                                'Northwest'}
                                </p>
                            </div>

                            <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-2 text-left">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Bearing</span>
                                    <span className="text-white font-mono font-bold">{toDMS(qiblaDirection)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Your Location</span>
                                    <span className="text-white font-mono font-bold">{latitude?.toFixed(4)}°, {longitude?.toFixed(4)}°</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Kaaba</span>
                                    <span className="text-white font-mono font-bold">21.4225°, 39.8262°</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                                Use a physical compass or compass app and face <strong className="text-white">{Math.round(qiblaDirection)}°</strong> from North.
                            </p>
                        </div>
                    </div>
                )}

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
                    {sensorStatus === 'active' && heading !== null && <p className="text-[10px] text-slate-600 mt-1">Compass Accuracy: ±5°</p>}
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
