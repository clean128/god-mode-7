import { Person } from '../../types';

interface GameAvatarProps {
  person: Person;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Generate a consistent color based on person ID
const getAvatarColor = (id: string) => {
  const colors = [
    { bg: '#3b82f6', border: '#60a5fa' }, // Blue
    { bg: '#8b5cf6', border: '#a78bfa' }, // Purple
    { bg: '#ec4899', border: '#f472b6' }, // Pink
    { bg: '#f59e0b', border: '#fbbf24' }, // Amber
    { bg: '#10b981', border: '#34d399' }, // Emerald
    { bg: '#06b6d4', border: '#22d3ee' }, // Cyan
    { bg: '#f97316', border: '#fb923c' }, // Orange
    { bg: '#6366f1', border: '#818cf8' }, // Indigo
  ];
  
  // Use person ID to consistently pick a color
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Get avatar icon based on person attributes
const getAvatarIcon = (person: Person): string => {
  if (person.businessOwner) return '💼';
  if (person.homeowner) return '🏠';
  if (person.gender === 'F') return '👩';
  if (person.gender === 'M') return '👨';
  return '👤';
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

export default function GameAvatar({ person, size = 'md', className = '' }: GameAvatarProps) {
  const color = getAvatarColor(person.id);
  const icon = getAvatarIcon(person);
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`
        relative ${sizeClass} rounded-full
        flex items-center justify-center
        border-4 border-white/30
        shadow-lg shadow-black/50
        font-game-heading font-bold
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, ${color.bg} 0%, ${color.border} 100%)`,
        boxShadow: `0 0 20px ${color.bg}40, inset 0 0 20px rgba(255, 255, 255, 0.1)`,
      }}
    >
      {/* Pixel art style grid overlay for game feel */}
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '8px 8px',
        }}
      />
      
      {/* Icon or Initials */}
      <div className="relative z-10 flex items-center justify-center">
        {size === 'sm' ? (
          <span className="text-xs">{icon}</span>
        ) : (
          <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{icon}</span>
        )}
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-slow opacity-50"
        style={{
          background: `radial-gradient(circle, ${color.bg}80 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

