
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  borderVariant?: 'solid' | 'gradient' | 'animated' | 'glow';
  borderColor?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'cyan';
  className?: string;
}

const PageLayout = ({ 
  children, 
  borderVariant = 'animated', 
  borderColor = 'blue',
  className = '' 
}: PageLayoutProps) => {
  const getBorderClasses = () => {
    const colorMap = {
      blue: 'from-blue-500 via-cyan-500 to-blue-600',
      green: 'from-green-500 via-emerald-500 to-green-600',
      purple: 'from-purple-500 via-pink-500 to-purple-600',
      red: 'from-red-500 via-orange-500 to-red-600',
      yellow: 'from-yellow-500 via-amber-500 to-yellow-600',
      cyan: 'from-cyan-500 via-teal-500 to-cyan-600'
    };

    const gradient = colorMap[borderColor] || colorMap.blue;

    switch (borderVariant) {
      case 'solid':
        return `border-t-4 border-${borderColor}-500`;
      
      case 'gradient':
        return `border-t-4 border-transparent bg-gradient-to-r ${gradient} bg-clip-border`;
      
      case 'animated':
        return `
          relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 
          before:bg-gradient-to-r before:${gradient} before:animate-pulse
          before:shadow-lg before:shadow-${borderColor}-500/30
        `;
      
      case 'glow':
        return `
          relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 
          before:bg-gradient-to-r before:${gradient} 
          before:shadow-2xl before:shadow-${borderColor}-500/50 before:animate-pulse
          before:blur-sm after:absolute after:top-0 after:left-0 after:right-0 after:h-1 
          after:bg-gradient-to-r after:${gradient}
        `;
      
      default:
        return '';
    }
  };

  return (
    <div className={`${getBorderClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;
