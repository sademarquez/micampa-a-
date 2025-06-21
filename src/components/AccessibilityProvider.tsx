
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  colorTheme: 'default' | 'dark' | 'high-contrast' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  announceToScreenReader: (message: string) => void;
  isKeyboardUser: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    voiceControl: false,
    fontSize: 'medium',
    colorTheme: 'default'
  });

  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    // Cargar configuraciones guardadas
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Detectar preferencias del sistema
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const prefersLargeText = window.matchMedia('(prefers-reduced-data: reduce)').matches;

    if (prefersReducedMotion || prefersHighContrast || prefersLargeText) {
      setSettings(prev => ({
        ...prev,
        reduceMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        largeText: prefersLargeText
      }));
    }

    // Detectar uso de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        setSettings(prev => ({ ...prev, keyboardNavigation: true }));
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    // Aplicar configuraciones al DOM
    const root = document.documentElement;
    
    // Clase base para accesibilidad
    root.classList.toggle('accessibility-enabled', 
      Object.values(settings).some(setting => setting === true)
    );
    
    // Alto contraste
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Texto grande
    root.classList.toggle('large-text', settings.largeText);
    
    // Reducir movimiento
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    
    // Navegación por teclado
    root.classList.toggle('keyboard-navigation', settings.keyboardNavigation);
    
    // Tamaño de fuente
    root.setAttribute('data-font-size', settings.fontSize);
    
    // Tema de color
    root.setAttribute('data-color-theme', settings.colorTheme);

    // Guardar configuraciones
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Anunciar cambios importantes
    announceToScreenReader(`Configuración de accesibilidad actualizada: ${key}`);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      announceToScreenReader,
      isKeyboardUser
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe ser usado dentro de AccessibilityProvider');
  }
  return context;
};
