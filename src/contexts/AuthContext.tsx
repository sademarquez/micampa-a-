
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 AuthProvider inicializando...');
    
    let mounted = true;

    const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<void> => {
      try {
        console.log('👤 Cargando perfil para:', supabaseUser.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, name, role')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error('❌ Error consultando perfil:', error);
          const basicUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.email || 'Usuario',
            role: 'visitante',
            email: supabaseUser.email || '',
          };
          setUser(basicUser);
          return;
        }

        if (profile) {
          const userData: User = {
            id: profile.id,
            name: profile.name || supabaseUser.email || 'Usuario',
            role: profile.role || 'visitante',
            email: supabaseUser.email || '',
          };

          console.log('✅ Perfil cargado:', userData.name, userData.role);
          setUser(userData);
        } else {
          console.log('⚠️ Perfil no encontrado, creando perfil de visitante');
          
          // Crear perfil de visitante si no existe
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: supabaseUser.id,
              name: supabaseUser.email || 'Visitante',
              role: 'votante' // Usar 'votante' como rol por defecto en lugar de 'visitante'
            });

          if (insertError) {
            console.error('Error creando perfil:', insertError);
          }

          const basicUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.email || 'Visitante',
            role: 'votante', // Usar 'votante' como rol por defecto
            email: supabaseUser.email || '',
          };
          setUser(basicUser);
        }
      } catch (error) {
        console.error('💥 Error en loadUserProfile:', error);
        if (mounted) {
          const basicUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.email || 'Visitante',
            role: 'votante', // Usar 'votante' como rol por defecto
            email: supabaseUser.email || '',
          };
          setUser(basicUser);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', event, newSession?.user?.email || 'No user');
      
      setSession(newSession);
      
      if (newSession?.user && event !== 'SIGNED_OUT') {
        await loadUserProfile(newSession.user);
      } else {
        console.log('🚪 Usuario desconectado');
        setUser(null);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });

    const initializeAuth = async () => {
      try {
        console.log('🔍 Verificando sesión inicial...');
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ Error obteniendo sesión inicial:', error);
        } else if (initialSession?.user) {
          console.log('✅ Sesión inicial encontrada:', initialSession.user.email);
          setSession(initialSession);
          await loadUserProfile(initialSession.user);
        } else {
          console.log('ℹ️ No hay sesión inicial activa');
        }
      } catch (error) {
        console.error('💥 Error crítico inicializando sesión:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      console.log('🧹 Limpiando AuthProvider');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 Iniciando login para:', email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ Error de login:', error);
        
        let userFriendlyError = '';
        if (error.message.includes('Invalid login credentials')) {
          userFriendlyError = 'Credenciales incorrectas. Verifica email y contraseña.';
        } else if (error.message.includes('Email not confirmed')) {
          userFriendlyError = 'Email no confirmado. Verifica tu correo.';
        } else {
          userFriendlyError = `Error: ${error.message}`;
        }

        setIsLoading(false);
        return { success: false, error: userFriendlyError };
      }

      if (data.user && data.session) {
        console.log('✅ Login exitoso para:', data.user.email);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Login sin datos de usuario' };
    } catch (error) {
      console.error('💥 Error crítico en login:', error);
      setIsLoading(false);
      return { success: false, error: `Error crítico: ${error}` };
    }
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    try {
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error cerrando sesión:', error);
      } else {
        console.log('✅ Sesión cerrada exitosamente');
      }
    } catch (error) {
      console.error('💥 Error crítico cerrando sesión:', error);
    }
  };

  const value = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!user && !!session,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
