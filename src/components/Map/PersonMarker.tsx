import { Person } from '../../types';
import { User, Briefcase, Home } from 'lucide-react';

interface PersonMarkerProps {
  person: Person;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function PersonMarker({ person, onClick, isSelected }: PersonMarkerProps) {
  // Determine marker color based on person attributes
  const getMarkerColor = () => {
    if (person.businessOwner) return 'from-purple-500 to-purple-600';
    if (person.homeowner) return 'from-blue-500 to-blue-600';
    return 'from-green-500 to-green-600';
  };

  const getIcon = () => {
    if (person.businessOwner) return Briefcase;
    if (person.homeowner) return Home;
    return User;
  };

  const Icon = getIcon();

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
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${getMarkerColor()} opacity-30`} />
        </div>
      )}

      {/* Main marker */}
      <div
        className={`
          relative w-10 h-10 rounded-full
          bg-gradient-to-br ${getMarkerColor()}
          border-2 border-white shadow-neon
          flex items-center justify-center
          transform transition-all duration-300
          ${isSelected ? 'scale-125' : 'scale-100'}
          hover:scale-110 hover:shadow-neon
          group-hover:animate-pulse-slow
        `}
      >
        <Icon className="w-5 h-5 text-white" />
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
