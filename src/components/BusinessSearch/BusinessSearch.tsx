import { useRef, useEffect } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MapPin } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { Business } from '../../types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function BusinessSearch() {
  const geocoderContainer = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const currentBusiness = useAppStore((state) => state.currentBusiness);
  const setCurrentBusiness = useAppStore((state) => state.setCurrentBusiness);
  const addNotification = useAppStore((state) => state.addNotification);

  useEffect(() => {
    if (!geocoderContainer.current || !MAPBOX_TOKEN) return;

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      types: 'poi,address',
      placeholder: '🔍 Type your business name or address...',
      marker: false,
      flyTo: false,
      countries: 'us',
      proximity: { longitude: -98.5795, latitude: 39.8283 },
    });

    geocoder.addTo(geocoderContainer.current);
    geocoderRef.current = geocoder;

    geocoder.on('result', (e) => {
      const result = e.result;
      const business: Business = {
        id: result.id,
        name: result.text || result.place_name,
        address: result.place_name,
        longitude: result.center?.[0] || 0,
        latitude: result.center?.[1] || 0,
        placeType: result.place_type?.[0],
      };
      setCurrentBusiness(business);
      addNotification({
        type: 'success',
        message: `Found: ${business.name}`,
        duration: 3000,
      });
    });

    geocoder.on('error', () => {
      addNotification({
        type: 'error',
        message: 'Failed to search location',
        duration: 3000,
      });
    });

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove();
      }
    };
  }, [setCurrentBusiness, addNotification]);

  return (
    <div className="glass-panel p-8 rounded-3xl border-4 border-primary-500/80 shadow-2xl max-w-3xl mx-auto backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-game-title text-white mb-2 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          🎮 GodMode7
        </h1>
        <p className="text-lg text-primary-300 font-game-heading">Find & Gift Your Customers</p>
      </div>
      <div className="relative">
        <div ref={geocoderContainer} className="mapbox-geocoder-container" />
      </div>
      {currentBusiness && (
        <div className="mt-4 p-4 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl border-2 border-primary-500/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-white truncate">{currentBusiness.name}</p>
              <p className="text-sm text-primary-200 truncate">{currentBusiness.address}</p>
            </div>
            <div className="px-4 py-2 bg-primary-500 rounded-lg text-white font-semibold">
              ✓ Found
            </div>
          </div>
        </div>
      )}
      <style>{`
        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder {
          width: 100%;
          max-width: none;
          box-shadow: none;
          background-color: rgba(15, 20, 25, 0.7);
          border: 3px solid #3b82f6;
          border-radius: 1rem;
        }
        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder input {
          color: #ffffff;
          font-size: 1.125rem;
          padding: 1.25rem 3rem;
          font-weight: 500;
        }
        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder input::placeholder {
          color: #9ca3af;
        }
        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder--icon-search {
          fill: #60a5fa;
        }
        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder--icon-loading {
          border-color: #3b82f6;
          border-right-color: transparent;
        }
        .mapbox-geocoder-container .suggestions {
          background-color: rgba(37, 43, 61, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid #3b82f6;
          border-radius: 1rem;
          margin-top: 0.5rem;
        }
        .mapbox-geocoder-container .suggestions li {
          color: #ffffff;
          border-bottom: 1px solid #3d4558;
          padding: 1rem;
          font-size: 1rem;
        }
        .mapbox-geocoder-container .suggestions li:hover,
        .mapbox-geocoder-container .suggestions li.active {
          background-color: rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}

