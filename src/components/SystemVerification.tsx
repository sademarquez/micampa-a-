import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  database: boolean;
  auth: boolean;
  tables: boolean;
  performance: boolean;
  lastCheck: Date;
}

interface VerificationResult {
  component: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export const SystemVerification = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: false,
    auth: false,
    tables: false,
    performance: false,
    lastCheck: new Date()
  });

  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [throttleActive, setThrottleActive] = useState(false);

  const runSystemVerification = async () => {
    if (throttleActive) {
      console.log('⏸️ Verificación pausada por throttling');
      return;
    }

    setIsVerifying(true);
    const results: VerificationResult[] = [];

    try {
      // Verificar conexión a base de datos
      const start = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - start;

      if (error) {
        results.push({
          component: 'Base de Datos',
          status: 'error',
          message: `Error de conexión: ${error.message}`,
          details: { error }
        });
      } else {
        results.push({
          component: 'Base de Datos',
          status: responseTime > 2000 ? 'warning' : 'success',
          message: `Conectado (${responseTime}ms)`,
          details: { responseTime }
        });
      }

      // Verificar autenticación
      try {
        const { data: { user } } = await supabase.auth.getUser();
        results.push({
          component: 'Autenticación',
          status: 'success',
          message: user ? 'Usuario autenticado' : 'Sin autenticación',
          details: { authenticated: !!user }
        });
      } catch (error) {
        results.push({
          component: 'Autenticación',
          status: 'error',
          message: `Error en autenticación: ${error}`,
          details: { error }
        });
      }

      // Verificar tablas principales
      const tables = ['profiles', 'territories', 'voters', 'alerts', 'messages'];
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table as any).select('*').limit(1);
          results.push({
            component: `Tabla ${table}`,
            status: error ? 'error' : 'success',
            message: error ? `Error: ${error.message}` : 'Accesible',
            details: { error }
          });
        } catch (error) {
          results.push({
            component: `Tabla ${table}`,
            status: 'error',
            message: `Error crítico: ${error}`,
            details: { error }
          });
        }
      }

      // Verificar rendimiento
      const performanceChecks = await Promise.allSettled([
        supabase.from('profiles').select('count').limit(1),
        supabase.from('territories').select('count').limit(1),
        supabase.from('voters').select('count').limit(1)
      ]);

      const successfulChecks = performanceChecks.filter(check => check.status === 'fulfilled').length;
      const performanceScore = (successfulChecks / performanceChecks.length) * 100;

      results.push({
        component: 'Rendimiento',
        status: performanceScore >= 80 ? 'success' : performanceScore >= 60 ? 'warning' : 'error',
        message: `Rendimiento: ${performanceScore.toFixed(1)}%`,
        details: { score: performanceScore, checks: performanceChecks.length }
      });

      setVerificationResults(results);

      // Actualizar estado del sistema
      const newStatus: SystemStatus = {
        database: results.some(r => r.component === 'Base de Datos' && r.status === 'success'),
        auth: results.some(r => r.component === 'Autenticación' && r.status === 'success'),
        tables: results.filter(r => r.component.startsWith('Tabla') && r.status === 'success').length >= 3,
        performance: performanceScore >= 70,
        lastCheck: new Date()
      };

      setSystemStatus(newStatus);

      // Activar throttling si hay muchos errores
      const errorCount = results.filter(r => r.status === 'error').length;
      if (errorCount > 2 && !throttleActive) {
        setThrottleActive(true);
        console.log('🚨 ACTIVANDO THROTTLING - Muchos errores detectados');
        
        setTimeout(() => {
          setThrottleActive(false);
        }, 30000);
      }

    } catch (error) {
      console.error('Error en verificación del sistema:', error);
      results.push({
        component: 'Sistema',
        status: 'error',
        message: `Error crítico del sistema: ${error}`,
        details: { error }
      });
    }

    setIsVerifying(false);
  };

  useEffect(() => {
    runSystemVerification();
    const interval = setInterval(runSystemVerification, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [throttleActive]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      case 'warning':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'error':
        return { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
  };

  const successCount = verificationResults.filter(r => r.status === 'success').length;
  const warningCount = verificationResults.filter(r => r.status === 'warning').length;
  const errorCount = verificationResults.filter(r => r.status === 'error').length;
  const totalChecks = verificationResults.length;

  const overallStatus = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success';

  return (
    <div className="space-y-6">
      {/* Estado General */}
      <Alert className={`${overallStatus === 'error' ? 'bg-red-50 border-red-200' : overallStatus === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border-2`}>
        <div className="h-5 w-5" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Verificación del Sistema
              </p>
              <p className="text-sm">
                {errorCount > 0 
                  ? `🚨 ${errorCount} errores detectados`
                  : warningCount > 0 
                  ? `⚠️ ${warningCount} advertencias`
                  : '✅ Sistema operando correctamente'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {throttleActive && (
                <Badge className="bg-red-100 text-red-800">
                  Throttling Activo
                </Badge>
              )}
              <Button 
                onClick={runSystemVerification} 
                disabled={isVerifying}
                size="sm"
                variant="outline"
              >
                {isVerifying ? 'Verificando...' : 'Verificar Ahora'}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Resultados de Verificación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5" />
            Resultados de Verificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verificationResults.map((result, index) => {
              const config = getStatusConfig(result.status);
              
              return (
                <div key={index} className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${result.status === 'success' ? 'bg-green-500' : result.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{result.component}</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </div>
                    <Badge className={config.color.replace('text-', 'bg-').replace('-600', '-100') + ' ' + config.color}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {successCount}
            </div>
            <div className="text-sm text-green-600">Exitosos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {warningCount}
            </div>
            <div className="text-sm text-yellow-600">Advertencias</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {errorCount}
            </div>
            <div className="text-sm text-red-600">Errores</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalChecks}
            </div>
            <div className="text-sm text-blue-600">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Componentes */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Componentes del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${systemStatus.database ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-sm font-medium">Base de Datos</p>
              <p className="text-xs text-gray-500">{systemStatus.database ? 'Operativo' : 'Error'}</p>
            </div>
            
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${systemStatus.auth ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-sm font-medium">Autenticación</p>
              <p className="text-xs text-gray-500">{systemStatus.auth ? 'Operativo' : 'Error'}</p>
            </div>
            
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${systemStatus.tables ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-sm font-medium">Tablas</p>
              <p className="text-xs text-gray-500">{systemStatus.tables ? 'Accesibles' : 'Error'}</p>
            </div>
            
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${systemStatus.performance ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-sm font-medium">Rendimiento</p>
              <p className="text-xs text-gray-500">{systemStatus.performance ? 'Óptimo' : 'Degradado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Throttling */}
      {throttleActive && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-600">
              Protección Automática Activada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              El sistema detectó múltiples errores y activó la protección automática.
              <br />
              <strong>Estado:</strong> Throttling activo para estabilizar el sistema
            </p>
          </CardContent>
        </Card>
      )}

      {/* Última Verificación */}
      <div className="text-center text-sm text-gray-500">
        Última verificación: {systemStatus.lastCheck.toLocaleString()}
      </div>
    </div>
  );
}; 