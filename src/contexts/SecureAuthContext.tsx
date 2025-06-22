/*
 * Copyright © 2025 Daniel Lopez - Sademarquez. Todos los derechos reservados.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { developerAuthService, DeveloperUser } from '@/services/developerAuthService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: DeveloperUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeDeveloper: () => Promise<void>;
  isDeveloper: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useSecureAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
};

interface SecureAuthProviderProps {
  children: React.ReactNode;
}

export const SecureAuthProvider: React.FC<SecureAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<DeveloperUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Inicializar usuario desarrollador automáticamente
  const initializeDeveloper = async () => {
    try {
      setLoading(true);
      const developerUser = await developerAuthService.initializeDeveloperUser();
      setUser(developerUser);
      
      toast({
        title: "🚀 Desarrollador inicializado",
        description: `Bienvenido, ${developerUser.name}!`,
      });
      
      console.log('✅ Usuario desarrollador inicializado:', developerUser);
      } catch (error) {
      console.error('❌ Error inicializando desarrollador:', error);
      toast({
        title: "⚠️ Error de inicialización",
        description: "No se pudo inicializar el usuario desarrollador",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Login manual
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await developerAuthService.loginDeveloper(email, password);
      setUser(user);
      
      toast({
        title: "✅ Login exitoso",
        description: `Bienvenido, ${user.name}!`,
      });
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "❌ Error de login",
        description: "Credenciales incorrectas o error de conexión",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await developerAuthService.logout();
    setUser(null);
      
      toast({
        title: "👋 Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Verificar sesión actual
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verificar si es el usuario desarrollador
          const currentUser = developerAuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Si hay sesión pero no es el desarrollador, hacer logout
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = developerAuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Inicializar automáticamente si no hay usuario
  useEffect(() => {
    if (!loading && !user) {
      // Solo inicializar automáticamente en la ruta del desarrollador
      if (window.location.pathname === '/developer') {
        initializeDeveloper();
      }
    }
  }, [loading, user]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    initializeDeveloper,
    isDeveloper: user?.role === 'developer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
