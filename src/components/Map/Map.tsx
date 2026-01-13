import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppStore } from '../../stores/appStore';
import { Person } from '../../types';
import { l2Api } from '../../services/l2Api';
import PersonMarker from './PersonMarker';

// Set Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const currentBusiness = useAppStore((state) => state.currentBusiness);
  const people = useAppStore((state) => state.people);
  const setPeople = useAppStore((state) => state.setPeople);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const addNotification = useAppStore((state) => state.addNotification);
  const filters = useAppStore((state) => state.filters);
  const mapState = useAppStore((state) => state.mapState);
  const setMapState = useAppStore((state) => state.setMapState);
  const setSelectedPerson = useAppStore((state) => state.setSelectedPerson);
  const selectedPeople = useAppStore((state) => state.selectedPeople);
  const setShowFilters = useAppStore((state) => state.setShowFilters);
  const showFilters = useAppStore((state) => state.showFilters);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) {
      console.warn('Map container or Mapbox token not available');
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: mapState.center,
      zoom: mapState.zoom,
      pitch: mapState.pitch,
      bearing: mapState.bearing,
      antialias: true,
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add 3D buildings
    map.on('load', () => {
      // Add terrain
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });

      // Enhanced terrain with more exaggeration for game-like feel
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 });

      // Add game-style sky with vibrant colors
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0], // Sun position for dramatic lighting
          'sky-atmosphere-sun-intensity': 20, // Increased intensity for game-like glow
          'sky-atmosphere-color': '#3b82f6', // Blue tint for game atmosphere
          'sky-atmosphere-halo-color': '#8b5cf6', // Purple halo for neon effect
        },
      });

      // Add 3D buildings with game-style colors
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      // Game-style building colors - vibrant neon palette
      const gameColors = [
        '#3b82f6', // Blue
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#06b6d4', // Cyan
        '#f97316', // Orange
        '#6366f1', // Indigo
      ];

      // Add base building layer with varied colors
      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            // Use height-based color variation for game-like appearance
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              0,
              gameColors[0],
              50,
              gameColors[1],
              100,
              gameColors[2],
              150,
              gameColors[3],
              200,
              gameColors[4],
              250,
              gameColors[5],
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['coalesce', ['get', 'min_height'], 0],
            ],
            'fill-extrusion-opacity': 0.85,
          },
        },
        labelLayerId
      );

      // Add building outlines for game-like edge definition
      map.addLayer(
        {
          id: '3d-buildings-outline',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'line',
          minzoom: 14,
          paint: {
            'line-color': '#ffffff',
            'line-width': 1.5,
            'line-opacity': 0.4,
          },
        },
        '3d-buildings'
      );

      // Add glow effect layer for taller buildings
      map.addLayer(
        {
          id: '3d-buildings-glow',
          source: 'composite',
          'source-layer': 'building',
          filter: ['all', ['==', 'extrude', 'true'], ['>', ['get', 'height'], 50]],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              50,
              '#60a5fa',
              100,
              '#a78bfa',
              150,
              '#f472b6',
              200,
              '#fbbf24',
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['+', ['get', 'height'], 5],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['coalesce', ['get', 'min_height'], 0],
            ],
            'fill-extrusion-opacity': 0.3,
          },
        },
        '3d-buildings'
      );
    });

    // Update store when map moves
    map.on('moveend', () => {
      const center = map.getCenter();
      setMapState({
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map when business changes
  useEffect(() => {
    if (!mapRef.current || !currentBusiness) return;

    const map = mapRef.current;

    // Fly to business location
    map.flyTo({
      center: [currentBusiness.longitude, currentBusiness.latitude],
      zoom: 16,
      pitch: 60,
      bearing: -17.6,
      duration: 2000,
      essential: true,
    });

    // Add business marker
    const businessMarker = new mapboxgl.Marker({
      color: '#3b82f6',
      scale: 1.2,
    })
      .setLngLat([currentBusiness.longitude, currentBusiness.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-4">
            <h3 class="text-lg font-bold text-white mb-2">${currentBusiness.name}</h3>
            <p class="text-sm text-gray-300">${currentBusiness.address}</p>
          </div>
        `)
      )
      .addTo(map);

    // Load people data around business
    loadPeopleAroundBusiness();

    return () => {
      businessMarker.remove();
    };
  }, [currentBusiness]);

  // Load people data from L2 API
  const loadPeopleAroundBusiness = async () => {
    if (!currentBusiness || !l2Api.isConfigured()) {
      addNotification({
        type: 'warning',
        message: 'L2 API credentials not configured. Using mock data.',
        duration: 5000,
      });
      // Generate mock data for demo
      loadMockPeople();
      return;
    }

    try {
      setIsLoading(true);

      // First, estimate the results
      const radius = filters.radius || 5000; // 5km default
      const estimate = await l2Api.estimateSearch(
        [currentBusiness.longitude, currentBusiness.latitude],
        radius,
        filters
      );

      addNotification({
        type: 'info',
        message: `Found approximately ${estimate} people in this area`,
        duration: 3000,
      });

      // If estimate is reasonable, fetch the data
      if (estimate > 0 && estimate < 1000) {
        const peopleData = await l2Api.searchPeople(
          [currentBusiness.longitude, currentBusiness.latitude],
          radius,
          filters,
          Math.min(estimate, 500)
        );

        setPeople(peopleData);
        addNotification({
          type: 'success',
          message: `Loaded ${peopleData.length} people`,
          duration: 3000,
        });
      } else if (estimate >= 1000) {
        addNotification({
          type: 'warning',
          message: 'Too many results. Please apply more filters.',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Error loading people:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Failed to load people data',
        duration: 5000,
      });
      // Fallback to mock data
      loadMockPeople();
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock people data for demo purposes
  const loadMockPeople = () => {
    if (!currentBusiness) return;

    const mockPeople: Person[] = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.01;
      const offsetLng = (Math.random() - 0.5) * 0.01;

      mockPeople.push({
        id: `mock-${i}`,
        latitude: currentBusiness.latitude + offsetLat,
        longitude: currentBusiness.longitude + offsetLng,
        firstName: `Person`,
        lastName: `${i + 1}`,
        fullName: `Person ${i + 1}`,
        age: 25 + Math.floor(Math.random() * 50),
        gender: Math.random() > 0.5 ? 'M' : 'F',
        address: `${100 + i} Demo Street`,
        zipCode: '10001',
        estimatedIncome: '$50K-$75K',
        homeowner: Math.random() > 0.5,
        businessOwner: Math.random() > 0.7,
        interests: ['Technology', 'Travel', 'Food'],
      });
    }

    setPeople(mockPeople);
  };

  // Render person markers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers with React component
    people.forEach((person) => {
      const el = document.createElement('div');
      el.className = 'person-marker-container';
      
      // Create marker with custom icon
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([person.longitude, person.latitude])
        .addTo(map);

      // Add click handler
      el.addEventListener('click', () => {
        setSelectedPerson(person);
      });

      // Store marker reference
      markersRef.current[person.id] = marker;

      // Render PersonMarker component into the element
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(el);
        root.render(
          <PersonMarker
            person={person}
            isSelected={selectedPeople[person.id] !== undefined}
          />
        );
      });
    });

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};
    };
  }, [people, selectedPeople]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Mapbox Token Required</h2>
          <p className="text-gray-400">Please set VITE_MAPBOX_TOKEN in your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Filter Toggle Button */}
      {currentBusiness && (
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            absolute top-4 right-4 z-10
            px-4 py-3 rounded-lg font-semibold
            transition-all duration-200 shadow-lg
            flex items-center gap-2
            ${
              showFilters
                ? 'bg-primary-600 text-white'
                : 'glass-panel text-white hover:bg-game-panel/70'
            }
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </button>
      )}
    </div>
  );
}

