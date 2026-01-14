import { Gift } from '../../types';
import { Gift as GiftIcon } from 'lucide-react';

interface GiftCatalogProps {
  gifts: Gift[];
  selectedGift: Gift | null;
  onSelectGift: (gift: Gift) => void;
  isLoading?: boolean;
}

export default function GiftCatalog({ 
  gifts, 
  selectedGift, 
  onSelectGift,
  isLoading = false 
}: GiftCatalogProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span className="ml-3 text-gray-400">Loading gifts...</span>
      </div>
    );
  }

  if (gifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <GiftIcon className="w-12 h-12 mb-4 opacity-50" />
        <p>No gifts available at this time</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
      {gifts.map((gift) => {
        const isSelected = selectedGift?.id === gift.id;
        
        return (
          <button
            key={gift.id}
            onClick={() => onSelectGift(gift)}
            className={`
              relative p-4 rounded-lg border-2 transition-all text-left
              ${isSelected 
                ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20' 
                : 'border-game-border bg-game-bg/50 hover:border-primary-400 hover:bg-game-bg/70'
              }
            `}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Gift Image */}
            <div className="w-full h-32 bg-gray-700 rounded-md mb-3 overflow-hidden flex items-center justify-center">
              {gift.imageUrl ? (
                <img 
                  src={gift.imageUrl} 
                  alt={gift.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <GiftIcon className="w-12 h-12 text-gray-500" />
              )}
            </div>

            {/* Gift Info */}
            <div>
              <h3 className="font-game-heading text-white mb-1">{gift.name}</h3>
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">{gift.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary-400 font-bold text-lg">${gift.price.toFixed(2)}</span>
                {gift.category && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    {gift.category}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

