
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthenticatedUser, User } from '../types'; // Using types from "Mi Campaña"

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (userData: AuthenticatedUser) => Promise<void>; // Expects AuthenticatedUser for Mi Campaña
  logout: () => Promise<void>;
  updateUserProfile: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular la comprobación de una sesión existente for "Mi Campaña"
    const storedUser = localStorage.getItem('miCampanaUser'); // Changed key
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
        // Basic validation of parsed user structure
        if (parsedUser && parsedUser.userID && parsedUser.email && parsedUser.rol) { // Check for rol for Mi Campaña user
            setUser(parsedUser);
        } else {
            console.error("Stored Mi Campaña user data is invalid.");
            localStorage.removeItem('miCampanaUser');
        }
      } catch (e) {
        console.error("Error al parsear usuario almacenado de Mi Campaña", e);
        localStorage.removeItem('miCampanaUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData: AuthenticatedUser) => {
    localStorage.setItem('miCampanaUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    localStorage.removeItem('miCampanaUser');
    setUser(null);
  };

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (user) {
      const newUser: AuthenticatedUser = { ...user, ...updatedData } as AuthenticatedUser; // Ensure AuthenticatedUser
      localStorage.setItem('miCampanaUser', JSON.stringify(newUser));
      setUser(newUser);
      console.log("Perfil de usuario (Mi Campaña) actualizado (simulado):", newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};