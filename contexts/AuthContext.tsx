import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthenticatedUser, User } from '../types'; // Updated import

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (userData: AuthenticatedUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updatedData: Partial<User>) => Promise<void>; // Use User for partial updates
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular la comprobación de una sesión existente
    const storedUser = localStorage.getItem('pwaElectoralUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
        // Basic validation of parsed user structure might be good here
        if (parsedUser && parsedUser.userID && parsedUser.email) {
            setUser(parsedUser);
        } else {
            console.error("Stored user data is invalid.");
            localStorage.removeItem('pwaElectoralUser');
        }
      } catch (e) {
        console.error("Error al parsear usuario almacenado", e);
        localStorage.removeItem('pwaElectoralUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData: AuthenticatedUser) => {
    // En una app real, aquí se llamaría a Firebase Auth o al backend
    localStorage.setItem('pwaElectoralUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    // En una app real, aquí se llamaría a Firebase Auth o al backend
    localStorage.removeItem('pwaElectoralUser');
    setUser(null);
  };

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (user) {
      // Ensure AuthenticatedUser structure is maintained correctly
      const newUser: AuthenticatedUser = { ...user, ...updatedData } as AuthenticatedUser;
      localStorage.setItem('pwaElectoralUser', JSON.stringify(newUser));
      setUser(newUser);
      // Simular llamada a API para actualizar perfil
      console.log("Perfil de usuario actualizado (simulado):", newUser);
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