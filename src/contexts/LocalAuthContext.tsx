
/*
 * Copyright © 2025 Daniel Lopez - Sademarquez. Todos los derechos reservados.
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocalCredentials, type LocalCredential } from '@/hooks/useLocalCredentials';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';
  isDemoUser?: boolean;
  territory?: string;
  permissions?: string[];
}

interface LocalAuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  hasPermission: (permission: string) => boolean;
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

export const LocalAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const { validateCredential, hasPermission: checkPermission } = useLocalCredentials();

  const clearAuthError = () => {
    setAuthError(null);
  };

  // Cargar sesión desde localStorage al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('electoral_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Sesión local restaurada:', userData.name);
      } catch (error) {
        console.error('❌ Error cargando sesión local:', error);
        localStorage.removeItem('electoral_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('🔐 INICIANDO LOGIN LOCAL:', { username });
    setAuthError(null);
    setIsLoading(true);

    try {
      const credential = validateCredential(username.trim(), password.trim());
      
      if (credential) {
        const userData: User = {
          id: credential.id,
          name: credential.name,
          email: credential.email,
          role: credential.role,
          isDemoUser: credential.isDemoUser,
          territory: credential.territory,
          permissions: credential.permissions
        };

        setUser(userData);
        localStorage.setItem('electoral_user', JSON.stringify(userData));
        
        console.log('✅ LOGIN LOCAL EXITOSO:', {
          name: userData.name,
          role: userData.role,
          territory: userData.territory
        });
        
        setIsLoading(false);
        return true;
      } else {
        setAuthError('❌ Credenciales incorrectas. Verifica usuario y contraseña.');
        console.log('❌ LOGIN LOCAL FALLÓ: Credenciales inválidas');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      const errorMsg = 'Error inesperado durante el login local';
      setAuthError(errorMsg);
      console.error('💥 ERROR LOGIN LOCAL:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión local...');
    setUser(null);
    setAuthError(null);
    localStorage.removeItem('electoral_user');
    console.log('✅ Sesión local cerrada exitosamente');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return checkPermission({ permissions: user.permissions } as LocalCredential, permission);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    authError,
    clearAuthError,
    hasPermission,
  };

  return (
    <LocalAuthContext.Provider value={value}>
      {children}
    </LocalAuthContext.Provider>
  );
};

export const useLocalAuth = () => {
  const context = useContext(LocalAuthContext);
  if (context === undefined) {
    throw new Error('useLocalAuth debe ser usado dentro de un LocalAuthProvider');
  }
  return context;
};
