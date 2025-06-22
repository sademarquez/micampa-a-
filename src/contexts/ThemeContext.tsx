import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getTheme, RoleTheme } from '@/config/roleThemes';

interface ThemeContextType {
  theme: RoleTheme;
  themeName: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const themeName = user?.role || 'visitante';
  const theme = useMemo(() => getTheme(themeName), [themeName]);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    
    // Aplicar clases de fondo y texto al body
    document.body.className = `${theme.backgroundColor} ${theme.textColor} transition-colors duration-500`;

  }, [theme]);

  const value = {
    theme,
    themeName
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
