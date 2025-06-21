
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useSecureAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('🛡️ PROTECTED ROUTE CHECK:', {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      userRole: user?.role
    });

    if (!isLoading && !isAuthenticated) {
      console.log('🔒 Usuario no autenticado, redirigiendo a login...');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, user]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
          <p className="text-xs text-gray-500 mt-2">Cargando perfil demo...</p>
        </div>
      </div>
    );
  }

  // Solo renderizar si está autenticado
  if (isAuthenticated && user) {
    console.log('✅ ACCESO CONCEDIDO:', {
      path: location.pathname,
      user: user.name,
      role: user.role
    });
    return <>{children}</>;
  }

  // Si no está cargando y no está autenticado, no renderizar nada
  // (la redirección ya se hizo en el useEffect)
  return null;
};

export default ProtectedRoute;
