import { useAppStore } from '../../stores/appStore';

export default function SelectionSummary() {
  const selectedPeople = useAppStore((state) => state.selectedPeople);
  const clearSelection = useAppStore((state) => state.clearSelection);
  const openGiftSelection = useAppStore((state) => state.openGiftSelection);

  const selectedCount = Object.keys(selectedPeople).length;

  if (selectedCount === 0) {
    return null;
  }

  const handleContinue = () => {
    // Open gift selection modal (Milestone 3)
    openGiftSelection();
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-slide-in-bottom">
      <div className="glass-panel p-6 flex items-center gap-6 min-w-[400px]">
        {/* Selection count */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">{selectedCount}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {selectedCount === 1 ? '1 Person Selected' : `${selectedCount} People Selected`}
            </p>
            <p className="text-xs text-gray-400">Ready to send gifts</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-game-bg border border-game-border rounded-lg text-white hover:bg-game-bg/70 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleContinue}
            className="btn-primary"
          >
            Send Gifts to {selectedCount} {selectedCount === 1 ? 'Person' : 'People'}
          </button>
        </div>
      </div>
    </div>
  );
}
