
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

interface SecureAuthContextType {
  user: User | null;
  session: any | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  systemHealth: 'healthy' | 'warning' | 'error';
  databaseMode: 'production' | 'development';
  hasPermission: (permission: string) => boolean;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const SecureAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [systemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [databaseMode] = useState<'production' | 'development'>('development');

  const { validateCredential, hasPermission: checkPermission } = useLocalCredentials();

  const clearAuthError = () => {
    setAuthError(null);
  };

  // Cargar sesión desde localStorage al inicializar
  useEffect(() => {
    console.log('🚀 INICIALIZANDO SECURE AUTH PROVIDER v8.0 - SIN BD');
    
    const savedUser = localStorage.getItem('electoral_user_secure');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setSession({ user: userData });
        console.log('✅ Sesión segura local restaurada:', userData.name);
      } catch (error) {
        console.error('❌ Error cargando sesión segura:', error);
        localStorage.removeItem('electoral_user_secure');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('🔐 INICIANDO LOGIN SEGURO LOCAL:', { username });
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
        setSession({ user: userData, accessToken: 'local_session_token' });
        localStorage.setItem('electoral_user_secure', JSON.stringify(userData));
        
        console.log('✅ LOGIN SEGURO LOCAL EXITOSO:', {
          name: userData.name,
          role: userData.role,
          territory: userData.territory
        });
        
        setIsLoading(false);
        return true;
      } else {
        setAuthError('❌ Credenciales incorrectas. Verifica usuario y contraseña.');
        console.log('❌ LOGIN SEGURO LOCAL FALLÓ: Credenciales inválidas');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      const errorMsg = 'Error inesperado durante el login seguro local';
      setAuthError(errorMsg);
      console.error('💥 ERROR LOGIN SEGURO LOCAL:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión segura local...');
    setUser(null);
    setSession(null);
    setAuthError(null);
    localStorage.removeItem('electoral_user_secure');
    console.log('✅ Sesión segura local cerrada exitosamente');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return checkPermission({ permissions: user.permissions } as LocalCredential, permission);
  };

  const value = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!user && !!session,
    isLoading,
    authError,
    clearAuthError,
    systemHealth,
    databaseMode,
    hasPermission,
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
};

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth debe ser usado dentro de un SecureAuthProvider');
  }
  return context;
};
