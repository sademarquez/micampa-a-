
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const SystemDiagnostics = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Conexión básica
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const duration = Date.now() - start;
      
      if (error) {
        diagnostics.push({
          test: 'Conexión Base de Datos',
          status: 'error',
          message: `Error: ${error.message}`,
          details: { error, duration }
        });
      } else {
        diagnostics.push({
          test: 'Conexión Base de Datos',
          status: 'success',
          message: `Conectado (${duration}ms)`,
          details: { duration }
        });
      }
    } catch (error) {
      diagnostics.push({
        test: 'Conexión Base de Datos',
        status: 'error',
        message: `Error crítico: ${error}`,
        details: { error }
      });
    }

    // Test 2: Verificar tabla profiles
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .limit(1);
      
      if (error) {
        diagnostics.push({
          test: 'Tabla Profiles',
          status: 'error',
          message: `Error accediendo profiles: ${error.message}`,
          details: { error }
        });
      } else {
        diagnostics.push({
          test: 'Tabla Profiles',
          status: 'success',
          message: 'Tabla profiles accesible',
          details: { sampleData: data }
        });
      }
    } catch (error) {
      diagnostics.push({
        test: 'Tabla Profiles',
        status: 'error',
        message: `Error crítico en profiles: ${error}`,
        details: { error }
      });
    }

    // Test 3: Verificar usuarios de prueba
    const testUsers = [
      'lider@micampana.com',
      'candidato@micampana.com',
      'master@micampana.com'
    ];

    for (const testEmail of testUsers) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testEmail.includes('lider') ? 'LiderSecure2025!' : 
                    testEmail.includes('candidato') ? 'CandidatoSecure2025!' :
                    'MasterSecure2025!'
        });

        if (error) {
          diagnostics.push({
            test: `Usuario Test: ${testEmail}`,
            status: 'error',
            message: `Login falló: ${error.message}`,
            details: { error, email: testEmail }
          });
        } else {
          diagnostics.push({
            test: `Usuario Test: ${testEmail}`,
            status: 'success',
            message: 'Login exitoso',
            details: { userId: data.user?.id }
          });
          
          // Cerrar sesión inmediatamente
          await supabase.auth.signOut();
        }
      } catch (error) {
        diagnostics.push({
          test: `Usuario Test: ${testEmail}`,
          status: 'error',
          message: `Error crítico: ${error}`,
          details: { error, email: testEmail }
        });
      }
    }

    // Test 4: Verificar RLS y permisos
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      if (currentUser.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.user.id);
        
        if (error) {
          diagnostics.push({
            test: 'RLS y Permisos',
            status: 'warning',
            message: `Posible problema RLS: ${error.message}`,
            details: { error }
          });
        } else {
          diagnostics.push({
            test: 'RLS y Permisos',
            status: 'success',
            message: 'RLS funcionando correctamente',
            details: { profileData: data }
          });
        }
      } else {
        diagnostics.push({
          test: 'RLS y Permisos',
          status: 'warning',
          message: 'No hay usuario autenticado para probar RLS',
          details: {}
        });
      }
    } catch (error) {
      diagnostics.push({
        test: 'RLS y Permisos',
        status: 'error',
        message: `Error verificando RLS: ${error}`,
        details: { error }
      });
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Diagnóstico del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Ejecutando Diagnósticos...' : 'Ejecutar Diagnósticos'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium">{result.test}</p>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
            <p className="font-medium mb-2">Resumen:</p>
            <p>✅ Exitosos: {results.filter(r => r.status === 'success').length}</p>
            <p>⚠️ Advertencias: {results.filter(r => r.status === 'warning').length}</p>
            <p>❌ Errores: {results.filter(r => r.status === 'error').length}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
