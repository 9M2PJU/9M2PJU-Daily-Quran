import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}

const GEO_LAT_KEY = 'lastKnownLat';
const GEO_LNG_KEY = 'lastKnownLng';

const getCachedLocation = (): { lat: number | null; lng: number | null } => {
    try {
        const lat = localStorage.getItem(GEO_LAT_KEY);
        const lng = localStorage.getItem(GEO_LNG_KEY);
        if (lat && lng) {
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
        }
    } catch { /* ignore */ }
    return { lat: null, lng: null };
};

const saveCachedLocation = (lat: number, lng: number) => {
    try {
        localStorage.setItem(GEO_LAT_KEY, lat.toString());
        localStorage.setItem(GEO_LNG_KEY, lng.toString());
    } catch { /* ignore */ }
};

export const useGeolocation = () => {
    // Initialize with cached location if available (allows instant data fetching)
    const cached = getCachedLocation();

    const [state, setState] = useState<GeolocationState>({
        latitude: cached.lat,
        longitude: cached.lng,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser', loading: false }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                saveCachedLocation(latitude, longitude);
                setState({
                    latitude,
                    longitude,
                    error: null,
                    loading: false,
                });
            },
            (error) => {
                // If we have cached coords, don't set error — use them as fallback
                setState(prev => ({
                    ...prev,
                    error: prev.latitude ? null : error.message,
                    loading: false,
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // Cache location for 5 minutes
            }
        );
    }, []);

    return state;
};
