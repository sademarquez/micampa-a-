
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageAnimation = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageTransition, setPageTransition] = useState('fade-in');
  const location = useLocation();

  useEffect(() => {
    setIsPageLoading(true);
    setPageTransition('fade-out');
    
    const timer = setTimeout(() => {
      setPageTransition('fade-in');
      setIsPageLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const getBorderVariant = (pathname: string) => {
    switch (pathname) {
      case '/':
      case '/login':
        return { variant: 'gradient' as const, color: 'blue' as const };
      case '/visitor-funnel':
        return { variant: 'animated' as const, color: 'purple' as const };
      case '/dashboard':
        return { variant: 'gradient' as const, color: 'green' as const };
      default:
        return { variant: 'default' as const, color: 'blue' as const };
    }
  };

  return {
    isPageLoading,
    pageTransition,
    borderConfig: getBorderVariant(location.pathname)
  };
};
