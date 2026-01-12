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

    // Initialize Mapbox Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      types: 'poi,address',
      placeholder: 'Search for your business...',
      marker: false,
      flyTo: false,
    });

    geocoder.addTo(geocoderContainer.current);
    geocoderRef.current = geocoder;

    // Handle result selection
    geocoder.on('result', (e) => {
      const result = e.result;
      
      const business: Business = {
        id: result.id,
        name: result.text || result.place_name,
        address: result.place_name,
        longitude: result.center[0],
        latitude: result.center[1],
        placeType: result.place_type?.[0],
      };

      setCurrentBusiness(business);

      addNotification({
        type: 'success',
        message: `Found: ${business.name}`,
        duration: 3000,
      });
    });

    // Handle errors
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
  }, []);

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">GodMode7</h1>
          <p className="text-xs text-gray-400">Find Your Customers</p>
        </div>
      </div>

      <div ref={geocoderContainer} className="mapbox-geocoder-container" />

      {currentBusiness && (
        <div className="mt-3 p-3 bg-game-bg/50 rounded-lg border border-game-border">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentBusiness.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentBusiness.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder {
          width: 100%;
          max-width: none;
          box-shadow: none;
          background-color: rgba(15, 20, 25, 0.5);
          border: 1px solid #3d4558;
          border-radius: 0.5rem;
        }

        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder input {
          color: #ffffff;
          font-size: 0.875rem;
          padding: 0.75rem 2.5rem;
        }

        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder input::placeholder {
          color: #9ca3af;
        }

        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder--icon-search {
          fill: #6b7280;
        }

        .mapbox-geocoder-container .mapboxgl-ctrl-geocoder--icon-loading {
          border-color: #3b82f6;
          border-right-color: transparent;
        }

        .mapbox-geocoder-container .suggestions {
          background-color: rgba(37, 43, 61, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid #3d4558;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
        }

        .mapbox-geocoder-container .suggestions li {
          color: #ffffff;
          border-bottom: 1px solid #3d4558;
        }

        .mapbox-geocoder-container .suggestions li:hover,
        .mapbox-geocoder-container .suggestions li.active {
          background-color: rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}

