import { create } from 'zustand';
import { 
  Business, 
  Person, 
  SearchFilters, 
  SelectedPeople, 
  AppNotification,
  MapState,
  GiftOrder
} from '../types';
import { FilterPreset } from '../types/filterPreset';

interface AppState {
  // Business state
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business | null) => void;
  
  // People data
  people: Person[];
  setPeople: (people: Person[]) => void;
  addPeople: (people: Person[]) => void;
  
  // Selected people for gift sending
  selectedPeople: SelectedPeople;
  togglePersonSelection: (person: Person) => void;
  clearSelection: () => void;
  
  // Search filters
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  
  // Filter presets
  filterPresets: FilterPreset[];
  saveFilterPreset: (name: string, description?: string) => void;
  loadFilterPreset: (presetId: string) => void;
  deleteFilterPreset: (presetId: string) => void;
  
  // Filter results
  filterResultCount: number | null;
  setFilterResultCount: (count: number | null) => void;
  
  // Map state
  mapState: MapState;
  setMapState: (state: Partial<MapState>) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  
  selectedPerson: Person | null;
  setSelectedPerson: (person: Person | null) => void;
  
  // Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  
  // Gift selection & orders
  showGiftSelection: boolean;
  setShowGiftSelection: (show: boolean) => void;
  openGiftSelection: () => void;
  closeGiftSelection: () => void;
  
  currentOrder: GiftOrder | null;
  createOrder: (order: GiftOrder) => void;
  showOrderConfirmation: boolean;
  setShowOrderConfirmation: (show: boolean) => void;
  openOrderConfirmation: () => void;
  closeOrderConfirmation: () => void;
  
  // Walkthrough
  showWalkthrough: boolean;
  setShowWalkthrough: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Business
  currentBusiness: null,
  setCurrentBusiness: (business) => set({ currentBusiness: business }),
  
  // People
  people: [],
  setPeople: (people) => set({ people }),
  addPeople: (newPeople) => set((state) => ({ 
    people: [...state.people, ...newPeople] 
  })),
  
  // Selection
  selectedPeople: {},
  togglePersonSelection: (person) => set((state) => {
    const newSelected = { ...state.selectedPeople };
    if (newSelected[person.id]) {
      delete newSelected[person.id];
    } else {
      newSelected[person.id] = person;
    }
    return { selectedPeople: newSelected };
  }),
  clearSelection: () => set({ selectedPeople: {} }),
  
  // Filters
  filters: {},
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  resetFilters: () => set({ filters: {} }),
  
  // Filter presets
  filterPresets: [],
  saveFilterPreset: (name, description) => set((state) => {
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      description,
      filters: state.filters,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return { filterPresets: [...state.filterPresets, newPreset] };
  }),
  loadFilterPreset: (presetId) => set((state) => {
    const preset = state.filterPresets.find((p) => p.id === presetId);
    if (preset) {
      return { filters: preset.filters };
    }
    return state;
  }),
  deleteFilterPreset: (presetId) => set((state) => ({
    filterPresets: state.filterPresets.filter((p) => p.id !== presetId)
  })),
  
  // Filter results
  filterResultCount: null,
  setFilterResultCount: (count) => set({ filterResultCount: count }),
  
  // Map
  mapState: {
    center: [-74.006, 40.7128], // Default NYC
    zoom: 15,
    pitch: 60,
    bearing: 0,
  },
  setMapState: (newState) => set((state) => ({
    mapState: { ...state.mapState, ...newState }
  })),
  
  // UI
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  showFilters: false,
  setShowFilters: (show) => set({ showFilters: show }),
  
  selectedPerson: null,
  setSelectedPerson: (person) => set({ selectedPerson: person }),
  
  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        ...notification,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      }
    ]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  
  // Gift selection
  showGiftSelection: false,
  setShowGiftSelection: (show) => set({ showGiftSelection: show }),
  openGiftSelection: () => set({ showGiftSelection: true }),
  closeGiftSelection: () => set({ showGiftSelection: false }),
  
  // Orders
  currentOrder: null,
  createOrder: (order) => set({ 
    currentOrder: order,
    showOrderConfirmation: true,
    showGiftSelection: false 
  }),
  showOrderConfirmation: false,
  setShowOrderConfirmation: (show) => set({ showOrderConfirmation: show }),
  openOrderConfirmation: () => set({ showOrderConfirmation: true }),
  closeOrderConfirmation: () => set({ showOrderConfirmation: false }),
  
  // Walkthrough
  showWalkthrough: true,
  setShowWalkthrough: (show) => set({ showWalkthrough: show }),
}));

