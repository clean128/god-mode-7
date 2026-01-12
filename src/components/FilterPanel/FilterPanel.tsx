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
} from 'lucide-react';

export default function FilterPanel() {
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const setShowFilters = useAppStore((state) => state.setShowFilters);
  const addNotification = useAppStore((state) => state.addNotification);

  const handleGenderChange = (gender: 'M' | 'F' | 'U') => {
    const currentGenders = filters.gender || [];
    const newGenders = currentGenders.includes(gender)
      ? currentGenders.filter((g) => g !== gender)
      : [...currentGenders, gender];
    setFilters({ gender: newGenders.length > 0 ? newGenders : undefined });
  };

  const handleIncomeChange = (income: string) => {
    const currentIncomes = filters.incomeRange || [];
    const newIncomes = currentIncomes.includes(income)
      ? currentIncomes.filter((i) => i !== income)
      : [...currentIncomes, income];
    setFilters({ incomeRange: newIncomes.length > 0 ? newIncomes : undefined });
  };

  const handleApplyFilters = () => {
    // Count active filters
    const activeFilterCount = Object.keys(filters).filter(
      (key) => filters[key as keyof typeof filters] !== undefined
    ).length;

    addNotification({
      type: 'info',
      message: `Applying ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''}...`,
      duration: 2000,
    });

    // In a real app, this would trigger a new L2 API search
    // For now, we'll just update the filters in the store
  };

  const handleReset = () => {
    resetFilters();
    addNotification({
      type: 'info',
      message: 'Filters reset',
      duration: 2000,
    });
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-game-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-white">Filters</h2>
        </div>
        <button
          onClick={() => setShowFilters(false)}
          className="p-2 hover:bg-game-bg rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Gender */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
            <Users className="w-4 h-4 inline-block mr-2" />
            Gender
          </label>
          <div className="flex gap-2">
            {(['M', 'F', 'U'] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => handleGenderChange(gender)}
                className={`
                  flex-1 px-3 py-2 rounded-lg border transition-all
                  ${
                    filters.gender?.includes(gender)
                      ? 'bg-primary-600 border-primary-500 text-white'
                      : 'bg-game-bg border-game-border text-gray-400 hover:border-primary-500'
                  }
                `}
              >
                {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Unknown'}
              </button>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
            Age Range
          </label>
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
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{filters.ageRange?.[0] || 18} years</span>
              <span>{filters.ageRange?.[1] || 100} years</span>
            </div>
          </div>
        </div>

        {/* Income Range */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
            <DollarSign className="w-4 h-4 inline-block mr-2" />
            Estimated Income
          </label>
          <div className="space-y-2">
            {['Under $25K', '$25K-$50K', '$50K-$75K', '$75K-$100K', '$100K-$150K', '$150K+'].map(
              (income) => (
                <label
                  key={income}
                  className="flex items-center gap-3 p-3 bg-game-bg/50 rounded-lg cursor-pointer hover:bg-game-bg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.incomeRange?.includes(income) || false}
                    onChange={() => handleIncomeChange(income)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-white">{income}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Homeowner */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
            <Home className="w-4 h-4 inline-block mr-2" />
            Property
          </label>
          <label className="flex items-center gap-3 p-3 bg-game-bg/50 rounded-lg cursor-pointer hover:bg-game-bg transition-colors">
            <input
              type="checkbox"
              checked={filters.homeowner || false}
              onChange={(e) => setFilters({ homeowner: e.target.checked ? true : undefined })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-white">Homeowners Only</span>
          </label>
        </div>

        {/* Business Owner */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
            <Briefcase className="w-4 h-4 inline-block mr-2" />
            Professional
          </label>
          <label className="flex items-center gap-3 p-3 bg-game-bg/50 rounded-lg cursor-pointer hover:bg-game-bg transition-colors">
            <input
              type="checkbox"
              checked={filters.businessOwner || false}
              onChange={(e) => setFilters({ businessOwner: e.target.checked ? true : undefined })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-white">Business Owners Only</span>
          </label>
        </div>

        {/* Children */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
            <Users className="w-4 h-4 inline-block mr-2" />
            Household
          </label>
          <label className="flex items-center gap-3 p-3 bg-game-bg/50 rounded-lg cursor-pointer hover:bg-game-bg transition-colors">
            <input
              type="checkbox"
              checked={filters.childrenPresent || false}
              onChange={(e) => setFilters({ childrenPresent: e.target.checked ? true : undefined })}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-white">Has Children</span>
          </label>
        </div>

        {/* Search Radius */}
        <div>
          <label className="text-sm font-semibold text-white mb-3 block">
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
            <div className="text-sm text-center text-gray-400">
              {((filters.radius || 5000) / 1000).toFixed(1)} km
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-game-border space-y-2">
        <button onClick={handleApplyFilters} className="btn-primary w-full">
          <Search className="w-4 h-4 inline-block mr-2" />
          Apply Filters
        </button>
        <button onClick={handleReset} className="btn-secondary w-full">
          <RefreshCw className="w-4 h-4 inline-block mr-2" />
          Reset All
        </button>
      </div>
    </div>
  );
}
