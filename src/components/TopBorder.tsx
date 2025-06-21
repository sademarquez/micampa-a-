
import { useEffect, useState } from 'react';

interface TopBorderProps {
  variant?: 'default' | 'gradient' | 'animated';
  height?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'green' | 'orange';
}

const TopBorder = ({ 
  variant = 'gradient', 
  height = 'md',
  color = 'blue' 
}: TopBorderProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'from-blue-500 via-blue-600 to-blue-700',
    purple: 'from-purple-500 via-purple-600 to-purple-700',
    green: 'from-green-500 via-green-600 to-green-700',
    orange: 'from-orange-500 via-orange-600 to-orange-700'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'animated':
        return `bg-gradient-to-r ${colorClasses[color]} animate-pulse`;
      case 'gradient':
        return `bg-gradient-to-r ${colorClasses[color]}`;
      default:
        return `bg-${color}-600`;
    }
  };

  return (
    <div 
      className={`
        fixed top-0 left-0 right-0 z-50 
        ${heightClasses[height]}
        ${getVariantClasses()}
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
        shadow-lg
      `}
      style={{
        background: variant === 'animated' 
          ? `linear-gradient(90deg, 
              rgba(59,130,246,0.8) 0%, 
              rgba(147,51,234,0.8) 50%, 
              rgba(59,130,246,0.8) 100%)`
          : undefined,
        backgroundSize: variant === 'animated' ? '200% 100%' : undefined,
        animation: variant === 'animated' 
          ? 'gradient-wave 3s ease-in-out infinite' 
          : undefined
      }}
    >
      {variant === 'animated' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      )}
    </div>
  );
};

export default TopBorder;
