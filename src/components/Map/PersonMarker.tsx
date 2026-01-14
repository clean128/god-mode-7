import { Person } from '../../types';
import GameAvatar from '../Avatar/GameAvatar';

interface PersonMarkerProps {
  person: Person;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function PersonMarker({ person, onClick, isSelected }: PersonMarkerProps) {
  return (
    <div
      className="relative cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${person.fullName || 'person'}`}
    >
      {/* Outer pulse ring */}
      {isSelected && (
        <div className="absolute inset-0 animate-ping">
          <div className="w-full h-full rounded-full bg-primary-500 opacity-30" />
        </div>
      )}

      {/* Main marker with game avatar */}
      <div
        className={`
          relative transform transition-all duration-300
          ${isSelected ? 'scale-125' : 'scale-100'}
          hover:scale-110
          group-hover:animate-pulse-slow
        `}
      >
        <GameAvatar person={person} size="md" />
      </div>

      {/* Hover tooltip */}
      <div
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          opacity-0 group-hover:opacity-100
          pointer-events-none transition-opacity duration-200
        "
      >
        <div className="glass-panel px-3 py-2 whitespace-nowrap text-xs">
          <p className="font-semibold text-white">
            {person.fullName || `${person.firstName} ${person.lastName}`}
          </p>
          {person.age && <p className="text-gray-400">Age: {person.age}</p>}
          {person.estimatedIncome && (
            <p className="text-gray-400">Income: {person.estimatedIncome}</p>
          )}
        </div>
      </div>
    </div>
  );
}
