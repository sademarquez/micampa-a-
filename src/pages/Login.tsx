/*
 * Copyright © 2025 Daniel Lopez - Sademarquez. Todos los derechos reservados.
 */

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, User, Lock, Users, Database } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useLocalCredentials } from "@/hooks/useLocalCredentials";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppConfig } from "@/config/appConfig";
import { AuthContext } from '@/contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const { login, authError, clearAuthError, isAuthenticated, isLoading } = useSecureAuth();
  const { getAllActiveCredentials, systemInfo } = useLocalCredentials();
  const { app } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loginWithGoogle, isLoading: googleLoading } = useContext(AuthContext);

  const activeCredentials = getAllActiveCredentials();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ USUARIO AUTENTICADO - REDIRIGIENDO A DASHBOARD');
      
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('🎯 REDIRIGIENDO A:', from);
      
      navigate(from, { replace: true });
      
      toast({
        title: "¡Bienvenido al sistema!",
        description: "Autenticación exitosa - Accediendo al dashboard",
      });
    }
  }, [isAuthenticated, navigate, location.state, toast]);

  useEffect(() => {
    if (authError && (username || password)) {
      clearAuthError();
    }
  }, [username, password, authError, clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 INTENTO DE LOGIN LOCAL:', { username, hasPassword: !!password });
    
    if (!username.trim()) {
      toast({
        title: "Campo requerido",
        description: "Ingresa tu nombre de usuario o email",
        variant: "destructive"
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Campo requerido", 
        description: "Ingresa tu contraseña",
        variant: "destructive"
      });
      return;
    }

    clearAuthError();

    try {
      console.log(`🔐 EJECUTANDO LOGIN LOCAL:`, { 
        username: username.trim(),
        password: password ? '[PRESENTE]' : '[VACÍO]'
      });

      const success = await login(username.trim(), password.trim());
      
      if (success) {
        console.log('🎉 LOGIN LOCAL EXITOSO - ESPERANDO REDIRECCIÓN');
        toast({
          title: "¡Login exitoso!",
          description: `Bienvenido ${username} - Cargando dashboard...`,
        });
      } else {
        console.log('❌ LOGIN LOCAL FALLÓ');
      }
    } catch (error) {
      console.error('💥 ERROR DURANTE EL LOGIN LOCAL:', error);
      toast({
        title: "Error de sistema",
        description: "Error inesperado. Revisa las credenciales.",
        variant: "destructive"
      });
    }
  };

  const useCredential = (credential: any) => {
    console.log('🎯 USANDO CREDENCIAL LOCAL:', credential.name);
    setUsername(credential.username);
    setPassword(credential.password);
    clearAuthError();
    toast({
      title: "Credenciales cargadas",
      description: `Listo para login como ${credential.name}`,
    });
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">¡Autenticado!</h2>
          <p className="text-gray-300">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full items-center">
          
          {/* Panel de Login */}
          <Card className="w-full border-gray-700/50 shadow-2xl bg-gray-900/60 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                {systemInfo.name}
              </CardTitle>
              <p className="text-gray-300">{systemInfo.description}</p>
              <p className="text-xs text-blue-400 font-medium">{systemInfo.version}</p>
            </CardHeader>
            
            <CardContent>
              {authError && (
                <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-700 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-400 font-medium">
                    Usuario o Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="samantha.smith@example.com"
                      className="pl-10 bg-gray-800 border-2 border-gray-700 focus:border-blue-500 text-white"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-400 font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña segura"
                      className="pl-10 pr-10 bg-gray-800 border-2 border-gray-700 focus:border-blue-500 text-white"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition-colors" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Autenticando..." : "Iniciar Sesión"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    disabled={isLoading}
                  >
                    {showCredentials ? "Ocultar" : "Ver"} Credenciales Disponibles
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <strong className="text-gray-200">✅ Sistema Local Sin BD</strong>
                </div>
                <p>• ✅ Credenciales JSON locales</p>
                <p>• ✅ Sin dependencia de Supabase</p>
                <p>• ✅ Sistema de permisos implementado</p>
                <p>• ✅ Configuración local activa</p>
                <p>• ✅ Base de datos configurable desde panel</p>
              </div>
            </CardContent>
          </Card>

          {/* Panel de Credenciales */}
          {showCredentials && (
            <Card className="w-full border-gray-700/50 shadow-2xl bg-gray-900/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                  🔑 Credenciales Locales
                </CardTitle>
                <p className="text-gray-400">Sistema sin base de datos</p>
              </CardHeader>
              <CardContent>
                {activeCredentials.map((cred) => (
                  <div key={cred.id} className="mb-3 p-3 rounded-lg bg-gray-800/70">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{cred.name}</p>
                        <p className="text-sm text-gray-300">{cred.username}</p>
                        <p className="text-xs text-blue-400 capitalize">{cred.role}</p>
                      </div>
                      <Button onClick={() => useCredential(cred)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Usar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
