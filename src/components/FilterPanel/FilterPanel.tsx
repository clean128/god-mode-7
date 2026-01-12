import { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import {
  X,
  Filter,
  DollarSign,
  Users,
  Home,
  Briefcase,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Heart,
  Save,
  FolderOpen,
  Trash2,
  TrendingUp,
  Car,
  Book,
  ShoppingCart,
} from 'lucide-react';
import { DEFAULT_FILTER_SUGGESTIONS, FilterSuggestion } from '../../types/filterPreset';
import { l2Api } from '../../services/l2Api';

interface FilterSection {
  id: string;
  label: string;
  icon: any;
  isOpen: boolean;
}

export default function FilterPanel() {
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const setShowFilters = useAppStore((state) => state.setShowFilters);
  const addNotification = useAppStore((state) => state.addNotification);
  const currentBusiness = useAppStore((state) => state.currentBusiness);
  
  // Filter presets
  const filterPresets = useAppStore((state) => state.filterPresets);
  const saveFilterPreset = useAppStore((state) => state.saveFilterPreset);
  const loadFilterPreset = useAppStore((state) => state.loadFilterPreset);
  const deleteFilterPreset = useAppStore((state) => state.deleteFilterPreset);
  
  // Result count
  const filterResultCount = useAppStore((state) => state.filterResultCount);
  const setFilterResultCount = useAppStore((state) => state.setFilterResultCount);
  const setPeople = useAppStore((state) => state.setPeople);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'suggestions', label: 'Quick Filters', icon: TrendingUp, isOpen: true },
    { id: 'presets', label: 'Saved Presets', icon: FolderOpen, isOpen: false },
    { id: 'demographics', label: 'Demographics', icon: Users, isOpen: true },
    { id: 'financial', label: 'Financial', icon: DollarSign, isOpen: false },
    { id: 'household', label: 'Household', icon: Home, isOpen: false },
    { id: 'professional', label: 'Professional', icon: Briefcase, isOpen: false },
    { id: 'lifestyle', label: 'Lifestyle & Interests', icon: Heart, isOpen: false },
    { id: 'behavioral', label: 'Behavioral', icon: ShoppingCart, isOpen: false },
    { id: 'vehicles', label: 'Vehicles', icon: Car, isOpen: false },
    { id: 'education', label: 'Education', icon: Book, isOpen: false },
  ]);

  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isOpen: !s.isOpen } : s))
    );
  };

  // Real-time result count estimation
  useEffect(() => {
    const estimateResults = async () => {
      if (!currentBusiness || Object.keys(filters).length === 0) {
        setFilterResultCount(null);
        return;
      }

      setIsEstimating(true);
      try {
        const estimate = await l2Api.estimateSearch(
          [currentBusiness.longitude, currentBusiness.latitude],
          filters.radius || 5000,
          filters
        );
        setFilterResultCount(estimate);
      } catch (error) {
        console.error('Error estimating results:', error);
      } finally {
        setIsEstimating(false);
      }
    };

    const debounceTimer = setTimeout(estimateResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [filters, currentBusiness, setFilterResultCount]);

  const handleGenderChange = (gender: 'M' | 'F' | 'U') => {
    const currentGenders = filters.gender || [];
    const newGenders = currentGenders.includes(gender)
      ? currentGenders.filter((g) => g !== gender)
      : [...currentGenders, gender];
    setFilters({ gender: newGenders.length > 0 ? newGenders : undefined });
  };

  const handleArrayFilterToggle = (
    filterKey: keyof typeof filters,
    value: string
  ) => {
    const currentValues = (filters[filterKey] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFilters({ [filterKey]: newValues.length > 0 ? newValues : undefined } as any);
  };

  const handleApplyFilters = async () => {
    if (!currentBusiness) {
      addNotification({
        type: 'warning',
        message: 'Please search for a business first',
        duration: 3000,
      });
      return;
    }

    const activeFilterCount = Object.keys(filters).filter(
      (key) => filters[key as keyof typeof filters] !== undefined
    ).length;

    setIsLoading(true);
    try {
      const people = await l2Api.searchPeople(
        [currentBusiness.longitude, currentBusiness.latitude],
        filters.radius || 5000,
        filters
      );
      
      setPeople(people);
      addNotification({
        type: 'success',
        message: `Found ${people.length} people matching ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''}`,
        duration: 3000,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to apply filters',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetFilters();
    setFilterResultCount(null);
    addNotification({
      type: 'info',
      message: 'Filters reset',
      duration: 2000,
    });
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      addNotification({
        type: 'warning',
        message: 'Please enter a preset name',
        duration: 2000,
      });
      return;
    }

    saveFilterPreset(presetName.trim());
    setPresetName('');
    setShowSavePreset(false);
    addNotification({
      type: 'success',
      message: 'Filter preset saved!',
      duration: 2000,
    });
  };

  const handleLoadPreset = (presetId: string) => {
    loadFilterPreset(presetId);
    addNotification({
      type: 'success',
      message: 'Preset loaded',
      duration: 2000,
    });
  };

  const handleDeletePreset = (presetId: string) => {
    deleteFilterPreset(presetId);
    addNotification({
      type: 'info',
      message: 'Preset deleted',
      duration: 2000,
    });
  };

  const applySuggestion = (suggestion: FilterSuggestion) => {
    setFilters(suggestion.filters);
    addNotification({
      type: 'success',
      message: `Applied: ${suggestion.label}`,
      duration: 2000,
    });
  };

  const getSectionComponent = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || !section.isOpen) return null;

    switch (sectionId) {
      case 'suggestions':
        return (
          <div className="space-y-2">
            {DEFAULT_FILTER_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => applySuggestion(suggestion)}
                className="w-full p-3 bg-primary-600/10 border border-primary-600/30 rounded-lg text-left hover:bg-primary-600/20 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-primary-400">
                      {suggestion.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{suggestion.description}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 rotate-[-90deg]" />
                </div>
              </button>
            ))}
          </div>
        );

      case 'presets':
        return (
          <div className="space-y-2">
            {showSavePreset && (
              <div className="p-3 bg-game-bg/50 rounded-lg space-y-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePreset}
                    className="flex-1 px-3 py-1.5 bg-primary-600 rounded text-white text-sm hover:bg-primary-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowSavePreset(false);
                      setPresetName('');
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-700 rounded text-white text-sm hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {!showSavePreset && Object.keys(filters).length > 0 && (
              <button
                onClick={() => setShowSavePreset(true)}
                className="w-full p-3 bg-green-600/20 border border-green-600/30 rounded-lg text-left hover:bg-green-600/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-green-400">
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-semibold">Save Current Filters</span>
                </div>
              </button>
            )}

            {filterPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-3 bg-game-bg/50 rounded-lg flex items-center justify-between group"
              >
                <button
                  onClick={() => handleLoadPreset(preset.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-semibold text-white group-hover:text-primary-400">
                    {preset.name}
                  </p>
                  {preset.description && (
                    <p className="text-xs text-gray-400 mt-1">{preset.description}</p>
                  )}
                </button>
                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}

            {filterPresets.length === 0 && !showSavePreset && (
              <p className="text-sm text-gray-500 text-center py-4">No saved presets yet</p>
            )}
          </div>
        );

      case 'demographics':
        return (
          <div className="space-y-4">
            {/* Gender */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Gender</label>
              <div className="flex gap-2">
                {(['M', 'F', 'U'] as const).map((gender) => (
                  <button
                    key={gender}
                    onClick={() => handleGenderChange(gender)}
                    className={`
                      flex-1 px-3 py-2 rounded-lg border transition-all text-sm
                      ${
                        filters.gender?.includes(gender)
                          ? 'bg-primary-600 border-primary-500 text-white'
                          : 'bg-game-bg border-game-border text-gray-400 hover:border-primary-500'
                      }
                    `}
                  >
                    {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Age Range</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={filters.ageRange?.[0] || 18}
                  onChange={(e) =>
                    setFilters({ ageRange: [parseInt(e.target.value), filters.ageRange?.[1] || 100] })
                  }
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{filters.ageRange?.[0] || 18} yrs</span>
                  <span>{filters.ageRange?.[1] || 100} yrs</span>
                </div>
              </div>
            </div>

            {/* Search Radius */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">
                Search Radius
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={filters.radius || 5000}
                  onChange={(e) => setFilters({ radius: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-center text-gray-400">
                  {((filters.radius || 5000) / 1000).toFixed(1)} km
                </div>
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-4">
            {/* Income Range */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">
                Estimated Income
              </label>
              <div className="space-y-1">
                {['Under $25K', '$25K-$50K', '$50K-$75K', '$75K-$100K', '$100K-$150K', '$150K+'].map(
                  (income) => (
                    <label
                      key={income}
                      className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.incomeRange?.includes(income) || false}
                        onChange={() => handleArrayFilterToggle('incomeRange', income)}
                        className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-xs text-white">{income}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Net Worth */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Net Worth</label>
              <div className="space-y-1">
                {['Under $50K', '$50K-$250K', '$250K-$500K', '$500K-$1M', '$1M+'].map((worth) => (
                  <label
                    key={worth}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.netWorthRange?.includes(worth) || false}
                      onChange={() => handleArrayFilterToggle('netWorthRange', worth)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{worth}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Credit Rating */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">
                Credit Rating
              </label>
              <div className="space-y-1">
                {['Excellent', 'Good', 'Fair', 'Poor'].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.creditRating?.includes(rating) || false}
                      onChange={() => handleArrayFilterToggle('creditRating', rating)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{rating}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'household':
        return (
          <div className="space-y-4">
            {/* Homeowner */}
            <label className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors">
              <input
                type="checkbox"
                checked={filters.homeowner || false}
                onChange={(e) => setFilters({ homeowner: e.target.checked ? true : undefined })}
                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-xs text-white">Homeowners Only</span>
            </label>

            {/* Children Present */}
            <label className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors">
              <input
                type="checkbox"
                checked={filters.childrenPresent || false}
                onChange={(e) => setFilters({ childrenPresent: e.target.checked ? true : undefined })}
                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-xs text-white">Has Children</span>
            </label>

            {/* Marital Status */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">
                Marital Status
              </label>
              <div className="space-y-1">
                {['Married', 'Single', 'Divorced', 'Widowed'].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.maritalStatus?.includes(status) || false}
                      onChange={() => handleArrayFilterToggle('maritalStatus', status)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Home Value */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Home Value</label>
              <div className="space-y-1">
                {['Under $200K', '$200K-$400K', '$400K-$600K', '$600K-$1M', '$1M+'].map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.homeValueRange?.includes(value) || false}
                      onChange={() => handleArrayFilterToggle('homeValueRange', value)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-4">
            {/* Business Owner */}
            <label className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors">
              <input
                type="checkbox"
                checked={filters.businessOwner || false}
                onChange={(e) => setFilters({ businessOwner: e.target.checked ? true : undefined })}
                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-xs text-white">Business Owners Only</span>
            </label>

            {/* Occupation */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Occupation</label>
              <div className="space-y-1">
                {['Professional', 'Management', 'Sales', 'Technical', 'Service', 'Retired'].map(
                  (occ) => (
                    <label
                      key={occ}
                      className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.occupation?.includes(occ) || false}
                        onChange={() => handleArrayFilterToggle('occupation', occ)}
                        className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-xs text-white">{occ}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-4">
            {/* Pet Owner */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Pet Owner</label>
              <div className="space-y-1">
                {['Dogs', 'Cats', 'Birds', 'Fish', 'Other'].map((pet) => (
                  <label
                    key={pet}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.petOwner?.includes(pet) || false}
                      onChange={() => handleArrayFilterToggle('petOwner', pet)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{pet}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Interests</label>
              <div className="space-y-1">
                {[
                  'Sports',
                  'Travel',
                  'Health & Fitness',
                  'Technology',
                  'Arts & Crafts',
                  'Cooking',
                  'Reading',
                  'Music',
                ].map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.interests?.includes(interest) || false}
                      onChange={() => handleArrayFilterToggle('interests', interest)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'behavioral':
        return (
          <div className="space-y-4">
            <label className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors">
              <input
                type="checkbox"
                checked={filters.onlineBuyer || false}
                onChange={(e) => setFilters({ onlineBuyer: e.target.checked ? true : undefined })}
                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-xs text-white">Online Buyer</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors">
              <input
                type="checkbox"
                checked={filters.mailResponder || false}
                onChange={(e) => setFilters({ mailResponder: e.target.checked ? true : undefined })}
                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-xs text-white">Mail Responder</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors">
              <input
                type="checkbox"
                checked={filters.charitableDonor || false}
                onChange={(e) => setFilters({ charitableDonor: e.target.checked ? true : undefined })}
                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-xs text-white">Charitable Donor</span>
            </label>

            {/* Political Affiliation */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">
                Political Affiliation
              </label>
              <div className="space-y-1">
                {['Democrat', 'Republican', 'Independent', 'Other'].map((affiliation) => (
                  <label
                    key={affiliation}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.politicalAffiliation?.includes(affiliation) || false}
                      onChange={() => handleArrayFilterToggle('politicalAffiliation', affiliation)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{affiliation}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'vehicles':
        return (
          <div className="space-y-4">
            <label className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors">
              <input
                type="checkbox"
                checked={filters.vehicleOwner || false}
                onChange={(e) => setFilters({ vehicleOwner: e.target.checked ? true : undefined })}
                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-xs text-white">Vehicle Owner</span>
            </label>

            {/* Vehicle Type */}
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">Vehicle Type</label>
              <div className="space-y-1">
                {['Sedan', 'SUV', 'Truck', 'Luxury', 'Electric', 'Hybrid'].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.vehicleType?.includes(type) || false}
                      onChange={() => handleArrayFilterToggle('vehicleType', type)}
                      className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-xs text-white">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-2 block">
                Education Level
              </label>
              <div className="space-y-1">
                {['High School', 'Some College', 'Associate', 'Bachelor', 'Master', 'Doctorate'].map(
                  (edu) => (
                    <label
                      key={edu}
                      className="flex items-center gap-2 p-2 bg-game-bg/50 rounded cursor-pointer hover:bg-game-bg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.education?.includes(edu) || false}
                        onChange={() => handleArrayFilterToggle('education', edu)}
                        className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-xs text-white">{edu}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters] !== undefined
  ).length;

  return (
    <div className="glass-panel h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-game-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-white">Advanced Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-600 rounded-full text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowFilters(false)}
          className="p-2 hover:bg-game-bg rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Result Count Preview */}
      {filterResultCount !== null && (
        <div className="px-4 py-3 bg-primary-600/10 border-b border-primary-600/20">
          <p className="text-sm text-center">
            <span className="text-primary-400 font-bold">{filterResultCount}</span>
            <span className="text-gray-400"> {isEstimating ? 'estimating...' : 'matches'}</span>
          </p>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="border border-game-border rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-3 bg-game-bg/50 hover:bg-game-bg transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-semibold text-white">{section.label}</span>
              </div>
              {section.isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Section Content */}
            {section.isOpen && (
              <div className="p-3 bg-game-bg/20">{getSectionComponent(section.id)}</div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-game-border space-y-2">
        <button onClick={handleApplyFilters} className="btn-primary w-full">
          <Search className="w-4 h-4 inline-block mr-2" />
          Apply Filters {filterResultCount && `(${filterResultCount})`}
        </button>
        <button onClick={handleReset} className="btn-secondary w-full">
          <RefreshCw className="w-4 h-4 inline-block mr-2" />
          Reset All
        </button>
      </div>
    </div>
  );
}
