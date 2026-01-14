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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-slide-in-bottom">
      <div className="glass-panel p-8 rounded-3xl border-4 border-primary-500/80 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-8">
          {/* Selection count - Bigger and more game-like */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/20">
              <span className="text-3xl font-bold text-white">{selectedCount}</span>
            </div>
            <div>
              <p className="text-xl font-game-heading text-white">
                {selectedCount === 1 ? '1 Person Selected' : `${selectedCount} People Selected`}
              </p>
              <p className="text-sm text-primary-300 font-game-heading">Ready to send gifts! 🎁</p>
            </div>
          </div>

          {/* Action Buttons - Bigger and simpler */}
          <div className="flex gap-4">
            <button
              onClick={clearSelection}
              className="px-6 py-4 bg-game-bg border-2 border-game-border rounded-xl text-white font-semibold hover:bg-game-bg/70 transition-all text-lg"
            >
              Clear
            </button>
            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-bold text-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg border-2 border-white/20"
            >
              🎁 Send Gifts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
