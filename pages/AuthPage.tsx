
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginMiCampanaUser, registerAndLoginDemoUser } from '../services/campaignService'; 
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { AuthenticatedUser } from '../types'; 

// Simple Logo Component
const LogoMiCampanaIA: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center justify-center font-bold ${className}`}>
    <span className="text-4xl md:text-5xl bg-white text-sky-500 px-3 py-1 rounded-l-lg shadow">MI</span>
    <span className="text-2xl md:text-3xl bg-sky-600 text-white px-3 py-2 rounded-r-lg italic shadow-sm">CAMPAÑA IA</span>
  </div>
);

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [isLogin, setIsLogin] = useState(true);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('lider.ana@campana.com'); 
  const [loginPassword, setLoginPassword] = useState('password123'); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const authenticatedUser = await loginMiCampanaUser(loginEmail, loginPassword); 
      await login(authenticatedUser); 
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación desconocido.');
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUserLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const demoUser = await registerAndLoginDemoUser();
      await login(demoUser);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar como usuario demo.');
      console.error("Error en login demo:", err);
    } finally {
      setLoading(false);
    }
  };


  const inputBaseClass = "w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm text-gray-700 placeholder-gray-400";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-8">
          <LogoMiCampanaIA className="inline-block" />
          <p className="mt-3 text-sm text-sky-700">Tu campaña en tiempo real</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            {isLogin ? 'Ingresa tus datos' : 'Acceso Rápido'}
          </h2>

          {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
          {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="login-email" className="sr-only">Usuario (Email)</label>
                <input id="login-email" name="email" type="email" autoComplete="email" required placeholder="Correo Electrónico" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={inputBaseClass} />
              </div>
              <div>
                <label htmlFor="login-password" className="sr-only">Contraseña</label>
                <input id="login-password" name="password" type="password" autoComplete="current-password" required placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={inputBaseClass} />
              </div>
              <div className="text-right">
                <button type="button" className="text-xs text-sky-600 hover:underline">¿Olvidé la contraseña?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 disabled:bg-sky-300 transition-colors">
                {loading ? <LoadingSpinner size="sm" /> : 'Continuar'}
              </button>
            </form>
          ) : (
            // Simplified Registration Section
            <div className="space-y-4 text-center">
                <p className="text-gray-600">
                    Para demostración y pruebas, puedes ingresar directamente con un perfil preconfigurado.
                </p>
              <button 
                type="button" 
                onClick={handleDemoUserLogin} 
                disabled={loading} 
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 disabled:bg-teal-300 transition-colors"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Entrar como Usuario Demo'}
              </button>
               <p className="text-xs text-gray-500 mt-2">
                Esto te dará acceso para explorar las funcionalidades de la aplicación.
              </p>
            </div>
          )}

          <p className="text-center text-xs text-gray-500">
            {isLogin ? '¿Aún no tienes una cuenta?' : '¿Prefieres usar credenciales específicas?'}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }} className="font-medium text-sky-600 hover:underline ml-1">
              {isLogin ? 'Acceso Demo Rápido' : 'Iniciar Sesión'}
            </button>
          </p>
        </div>
        
        {isLogin && (
          <p className="mt-4 text-center text-xs text-gray-500">
              Para probar roles: <code className="bg-gray-200 px-1 rounded">lider.ana@campana.com</code> o <code className="bg-gray-200 px-1 rounded">admin@campana.com</code> con contraseña <code className="bg-gray-200 px-1 rounded">password123</code>.
          </p>
        )}
         { !isLogin && (
             <p className="mt-4 text-center text-xs text-gray-500">
                La implementación completa de registro y seguridad se realizará en fases posteriores del proyecto.
             </p>
         )}

        <p className="text-center text-xs text-gray-400 mt-8">
          *Al ingresar aceptas los TÉRMINOS Y CONDICIONES de este aplicativo (versión demo)*
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
