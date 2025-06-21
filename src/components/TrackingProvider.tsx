import { useEffect } from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';

declare global {
  interface Window {
    fbq: any;
    gtag: any;
    dataLayer: any[];
  }
}

const TrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSecureAuth();

  useEffect(() => {
    // Inicializar Facebook Pixel
    const initFacebookPixel = () => {
      if (typeof window !== 'undefined' && !window.fbq) {
        window.fbq = function() {
          window.fbq.callMethod ? 
          window.fbq.callMethod.apply(window.fbq, arguments) : 
          window.fbq.queue.push(arguments);
        };
        window.fbq.push = window.fbq;
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = [];
        
        // Cargar script de Facebook Pixel
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);
        
        // Inicializar con ID de pixel (debe configurarse según el candidato)
        window.fbq('init', 'FACEBOOK_PIXEL_ID');
        window.fbq('track', 'PageView');
      }
    };

    // Inicializar Google Analytics
    const initGoogleAnalytics = () => {
      if (typeof window !== 'undefined' && !window.gtag) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        
        // Cargar script de Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);
        
        // Configurar tracking (debe configurarse según el candidato)
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: 'Mi Campaña - Plataforma Electoral',
          custom_map: {
            dimension1: 'user_role',
            dimension2: 'territory_id'
          }
        });
      }
    };

    // Inicializar tracking solo en producción
    if (process.env.NODE_ENV === 'production') {
      initFacebookPixel();
      initGoogleAnalytics();
    }

    // Track user login events
    if (user) {
      // Facebook Pixel - Login Event
      if (window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'User Login',
          content_category: user.role,
          value: 1.00,
          currency: 'USD'
        });
      }

      // Google Analytics - Login Event
      if (window.gtag) {
        window.gtag('event', 'login', {
          method: 'email',
          user_role: user.role,
          user_id: user.id
        });
      }
    }
  }, [user]);

  // Track page views
  useEffect(() => {
    const trackPageView = () => {
      const currentPage = window.location.pathname;
      
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'PageView', {
          content_name: currentPage,
          user_role: user?.role || 'anonymous'
        });
      }

      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_location: window.location.href,
          page_path: currentPage,
          page_title: document.title,
          user_role: user?.role || 'anonymous'
        });
      }
    };

    // Track initial page view
    trackPageView();

    // Track navigation changes
    const handlePopState = () => trackPageView();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  return <>{children}</>;
};

export default TrackingProvider;
