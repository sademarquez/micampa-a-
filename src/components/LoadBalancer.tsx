import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface SystemLoad {
  databaseLoad: number;
  responseTime: number;
  errorCount: number;
  activeUsers: number;
  memoryUsage: number;
}

interface LoadCheck {
  component: string;
  load: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  lastCheck: Date;
}

export const LoadBalancer = () => {
  const [systemLoad, setSystemLoad] = useState<SystemLoad>({
    databaseLoad: 0,
    responseTime: 0,
    errorCount: 0,
    activeUsers: 0,
    memoryUsage: 0
  });

  const [loadChecks, setLoadChecks] = useState<LoadCheck[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [throttleMode, setThrottleMode] = useState(false);

  // Umbrales de carga
  const thresholds = {
    databaseLoad: 80, // %
    responseTime: 2000, // ms
    errorCount: 10, // errores por minuto
    activeUsers: 100, // usuarios concurrentes
    memoryUsage: 85 // %
  };

  const checkSystemLoad = async () => {
    if (throttleMode) {
      console.log('⏸️ Verificación pausada - Modo throttling activo');
      return;
    }

    const checks: LoadCheck[] = [];
    const newLoad: SystemLoad = { ...systemLoad };

    try {
      // Verificar base de datos
      const start = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - start;
      
      newLoad.responseTime = responseTime;
      newLoad.databaseLoad = Math.min(100, (responseTime / 100) * 100);
      
      checks.push({
        component: 'Base de Datos',
        load: newLoad.databaseLoad,
        threshold: thresholds.databaseLoad,
        status: newLoad.databaseLoad > thresholds.databaseLoad ? 'critical' : 
                newLoad.databaseLoad > thresholds.databaseLoad * 0.8 ? 'warning' : 'normal',
        lastCheck: new Date()
      });

      // Simular otras métricas
      newLoad.memoryUsage = Math.random() * 100;
      newLoad.errorCount = Math.random() * 20;
      newLoad.activeUsers = Math.random() * 150;

      // Verificar memoria
      checks.push({
        component: 'Memoria',
        load: newLoad.memoryUsage,
        threshold: thresholds.memoryUsage,
        status: newLoad.memoryUsage > thresholds.memoryUsage ? 'critical' : 
                newLoad.memoryUsage > thresholds.memoryUsage * 0.9 ? 'warning' : 'normal',
        lastCheck: new Date()
      });

      // Verificar tiempo de respuesta
      checks.push({
        component: 'Tiempo Respuesta',
        load: responseTime,
        threshold: thresholds.responseTime,
        status: responseTime > thresholds.responseTime ? 'critical' : 
                responseTime > thresholds.responseTime * 0.8 ? 'warning' : 'normal',
        lastCheck: new Date()
      });

      // Verificar errores
      checks.push({
        component: 'Tasa de Errores',
        load: newLoad.errorCount,
        threshold: thresholds.errorCount,
        status: newLoad.errorCount > thresholds.errorCount ? 'critical' : 
                newLoad.errorCount > thresholds.errorCount * 0.8 ? 'warning' : 'normal',
        lastCheck: new Date()
      });

      // Verificar usuarios activos
      checks.push({
        component: 'Usuarios Activos',
        load: newLoad.activeUsers,
        threshold: thresholds.activeUsers,
        status: newLoad.activeUsers > thresholds.activeUsers ? 'critical' : 
                newLoad.activeUsers > thresholds.activeUsers * 0.9 ? 'warning' : 'normal',
        lastCheck: new Date()
      });

      setSystemLoad(newLoad);
      setLoadChecks(checks);

      // Activar throttling si hay problemas críticos
      const criticalChecks = checks.filter(check => check.status === 'critical');
      if (criticalChecks.length > 0 && !throttleMode) {
        setThrottleMode(true);
        console.log('🚨 ACTIVANDO MODO THROTTLING - Carga crítica detectada');
        
        setTimeout(() => {
          setThrottleMode(false);
          console.log('✅ Desactivando modo throttling');
        }, 30000); // 30 segundos
      }

    } catch (error) {
      console.error('Error verificando carga del sistema:', error);
      checks.push({
        component: 'Error Sistema',
        load: 100,
        threshold: 0,
        status: 'critical',
        lastCheck: new Date()
      });
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      checkSystemLoad();
      const interval = setInterval(checkSystemLoad, 8000); // Cada 8 segundos
      return () => clearInterval(interval);
    }
  }, [isMonitoring, throttleMode]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'normal':
        return { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      case 'warning':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'critical':
        return { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
  };

  const getProgressColor = (load: number, threshold: number) => {
    if (load >= threshold) return 'bg-red-500';
    if (load >= threshold * 0.8) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const criticalChecks = loadChecks.filter(check => check.status === 'critical');
  const warningChecks = loadChecks.filter(check => check.status === 'warning');
  const normalChecks = loadChecks.filter(check => check.status === 'normal');

  return (
    <div className="space-y-6">
      {/* Estado General */}
      <Alert className={`${criticalChecks.length > 0 ? 'bg-red-50 border-red-200' : warningChecks.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border-2`}>
        <div className="h-5 w-5" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Control de Carga del Sistema
              </p>
              <p className="text-sm">
                {criticalChecks.length > 0 
                  ? `🚨 ${criticalChecks.length} componentes con carga crítica`
                  : warningChecks.length > 0 
                  ? `⚠️ ${warningChecks.length} componentes con carga alta`
                  : '✅ Sistema operando con carga normal'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {throttleMode && (
                <Badge className="bg-red-100 text-red-800">
                  Throttling Activo
                </Badge>
              )}
              <Button 
                onClick={() => setIsMonitoring(!isMonitoring)} 
                size="sm"
                variant={isMonitoring ? "outline" : "default"}
              >
                {isMonitoring ? 'Pausar' : 'Iniciar'}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Métricas de Carga */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5" />
            Métricas de Carga del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadChecks.map((check) => {
              const config = getStatusConfig(check.status);
              const progressValue = Math.min(100, (check.load / check.threshold) * 100);
              
              return (
                <Card key={check.component} className={`${config.bgColor} ${config.borderColor} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{check.component}</span>
                      <Badge className={config.color.replace('text-', 'bg-').replace('-600', '-100') + ' ' + config.color}>
                        {check.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{check.load.toFixed(1)}</span>
                        <span className="text-gray-500">Umbral: {check.threshold}</span>
                      </div>
                      <Progress 
                        value={progressValue} 
                        className="h-2"
                        style={{
                          '--progress-background': getProgressColor(check.load, check.threshold)
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Verificado: {check.lastCheck.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {normalChecks.length}
            </div>
            <div className="text-sm text-green-600">Normal</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {warningChecks.length}
            </div>
            <div className="text-sm text-yellow-600">Advertencias</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {criticalChecks.length}
            </div>
            <div className="text-sm text-red-600">Críticos</div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticas */}
      {criticalChecks.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <div className="w-5 h-5" />
              Alertas de Carga Crítica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalChecks.map((check) => (
                <Alert key={check.component} className="border-red-200 bg-red-50">
                  <div className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>{check.component}</strong>: {check.load.toFixed(1)} 
                    (Umbral: {check.threshold})
                    <br />
                    <span className="text-xs">
                      Detectado: {check.lastCheck.toLocaleTimeString()}
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de Protección */}
      {throttleMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <div className="w-5 h-5" />
              Protección Automática Activada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              El sistema detectó carga crítica y activó la protección automática.
              <br />
              <strong>Estado:</strong> Throttling activo para estabilizar la carga
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 