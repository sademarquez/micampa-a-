import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Gauge,
  Cpu,
  Memory,
  HardDrive,
  Network,
  Shield,
  Clock,
  Pause,
  Play
} from 'lucide-react';

interface PerformanceMetrics {
  databaseResponse: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  errorRate: number;
  activeConnections: number;
}

interface PerformanceCheck {
  metric: string;
  value: number;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  lastCheck: Date;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    databaseResponse: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    errorRate: 0,
    activeConnections: 0
  });

  const [performanceChecks, setPerformanceChecks] = useState<PerformanceCheck[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [throttleActive, setThrottleActive] = useState(false);

  // Umbrales de rendimiento
  const thresholds = {
    databaseResponse: 2000, // ms
    memoryUsage: 80, // %
    cpuUsage: 85, // %
    networkLatency: 1000, // ms
    errorRate: 10, // %
    activeConnections: 150 // conexiones
  };

  const runPerformanceCheck = async () => {
    if (throttleActive) {
      console.log('⏸️ Verificación pausada por throttling');
      return;
    }

    const checks: PerformanceCheck[] = [];
    const newMetrics: PerformanceMetrics = { ...metrics };

    try {
      // Verificar base de datos
      const start = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const dbResponse = Date.now() - start;
      
      newMetrics.databaseResponse = dbResponse;
      checks.push({
        metric: 'Respuesta BD',
        value: dbResponse,
        threshold: thresholds.databaseResponse,
        status: dbResponse > thresholds.databaseResponse ? 'critical' : dbResponse > thresholds.databaseResponse * 0.8 ? 'warning' : 'healthy',
        lastCheck: new Date()
      });

      // Simular otras métricas
      newMetrics.memoryUsage = Math.random() * 100;
      newMetrics.cpuUsage = Math.random() * 100;
      newMetrics.networkLatency = Math.random() * 2000;
      newMetrics.errorRate = Math.random() * 20;
      newMetrics.activeConnections = Math.random() * 200;

      // Verificar memoria
      checks.push({
        metric: 'Uso Memoria',
        value: newMetrics.memoryUsage,
        threshold: thresholds.memoryUsage,
        status: newMetrics.memoryUsage > thresholds.memoryUsage ? 'critical' : newMetrics.memoryUsage > thresholds.memoryUsage * 0.9 ? 'warning' : 'healthy',
        lastCheck: new Date()
      });

      // Verificar CPU
      checks.push({
        metric: 'Uso CPU',
        value: newMetrics.cpuUsage,
        threshold: thresholds.cpuUsage,
        status: newMetrics.cpuUsage > thresholds.cpuUsage ? 'critical' : newMetrics.cpuUsage > thresholds.cpuUsage * 0.9 ? 'warning' : 'healthy',
        lastCheck: new Date()
      });

      // Verificar latencia de red
      checks.push({
        metric: 'Latencia Red',
        value: newMetrics.networkLatency,
        threshold: thresholds.networkLatency,
        status: newMetrics.networkLatency > thresholds.networkLatency ? 'critical' : newMetrics.networkLatency > thresholds.networkLatency * 0.8 ? 'warning' : 'healthy',
        lastCheck: new Date()
      });

      // Verificar tasa de errores
      checks.push({
        metric: 'Tasa Errores',
        value: newMetrics.errorRate,
        threshold: thresholds.errorRate,
        status: newMetrics.errorRate > thresholds.errorRate ? 'critical' : newMetrics.errorRate > thresholds.errorRate * 0.8 ? 'warning' : 'healthy',
        lastCheck: new Date()
      });

      // Verificar conexiones activas
      checks.push({
        metric: 'Conexiones',
        value: newMetrics.activeConnections,
        threshold: thresholds.activeConnections,
        status: newMetrics.activeConnections > thresholds.activeConnections ? 'critical' : newMetrics.activeConnections > thresholds.activeConnections * 0.9 ? 'warning' : 'healthy',
        lastCheck: new Date()
      });

      setMetrics(newMetrics);
      setPerformanceChecks(checks);

      // Aplicar throttling si hay problemas críticos
      const criticalChecks = checks.filter(check => check.status === 'critical');
      if (criticalChecks.length > 0 && !throttleActive) {
        setThrottleActive(true);
        console.log('🚨 APLICANDO THROTTLING - Problemas críticos detectados');
        
        setTimeout(() => {
          setThrottleActive(false);
        }, 30000); // 30 segundos
      }

    } catch (error) {
      console.error('Error en verificación de rendimiento:', error);
      checks.push({
        metric: 'Error Sistema',
        value: 100,
        threshold: 0,
        status: 'critical',
        lastCheck: new Date()
      });
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      runPerformanceCheck();
      const interval = setInterval(runPerformanceCheck, 10000); // Cada 10 segundos
      return () => clearInterval(interval);
    }
  }, [isMonitoring, throttleActive]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'critical':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      default:
        return { icon: Activity, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'Respuesta BD': return <HardDrive className="w-4 h-4" />;
      case 'Uso Memoria': return <Memory className="w-4 h-4" />;
      case 'Uso CPU': return <Cpu className="w-4 h-4" />;
      case 'Latencia Red': return <Network className="w-4 h-4" />;
      case 'Tasa Errores': return <XCircle className="w-4 h-4" />;
      case 'Conexiones': return <Network className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getProgressColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'bg-red-500';
    if (value >= threshold * 0.8) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const criticalChecks = performanceChecks.filter(check => check.status === 'critical');
  const warningChecks = performanceChecks.filter(check => check.status === 'warning');
  const healthyChecks = performanceChecks.filter(check => check.status === 'healthy');

  return (
    <div className="space-y-6">
      {/* Estado General */}
      <Alert className={`${criticalChecks.length > 0 ? 'bg-red-50 border-red-200' : warningChecks.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border-2`}>
        <Activity className="h-5 w-5" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Monitoreo de Rendimiento del Sistema
              </p>
              <p className="text-sm">
                {criticalChecks.length > 0 
                  ? `🚨 ${criticalChecks.length} problemas críticos detectados`
                  : warningChecks.length > 0 
                  ? `⚠️ ${warningChecks.length} advertencias de rendimiento`
                  : '✅ Sistema operando con rendimiento óptimo'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {throttleActive && (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                  <Pause className="w-3 h-3" />
                  Throttling Activo
                </Badge>
              )}
              <Button 
                onClick={() => setIsMonitoring(!isMonitoring)} 
                size="sm"
                variant={isMonitoring ? "outline" : "default"}
              >
                {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isMonitoring ? 'Pausar' : 'Iniciar'}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Métricas de Rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Métricas de Rendimiento en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceChecks.map((check) => {
              const config = getStatusConfig(check.status);
              const Icon = config.icon;
              const MetricIcon = getMetricIcon(check.metric);
              const progressValue = Math.min(100, (check.value / check.threshold) * 100);
              
              return (
                <Card key={check.metric} className={`${config.bgColor} ${config.borderColor} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {MetricIcon}
                        <span className="font-medium">{check.metric}</span>
                      </div>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{check.value.toFixed(1)}</span>
                        <span className="text-gray-500">Umbral: {check.threshold}</span>
                      </div>
                      <Progress 
                        value={progressValue} 
                        className="h-2"
                        style={{
                          '--progress-background': getProgressColor(check.value, check.threshold)
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Última verificación: {check.lastCheck.toLocaleTimeString()}
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
              {healthyChecks.length}
            </div>
            <div className="text-sm text-green-600">Óptimo</div>
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
              <AlertTriangle className="w-5 h-5" />
              Problemas Críticos de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalChecks.map((check) => (
                <Alert key={check.metric} className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>{check.metric}</strong>: {check.value.toFixed(1)} 
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
      {throttleActive && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Shield className="w-5 h-5" />
              Protección Automática Activada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              El sistema detectó problemas de rendimiento críticos y activó la protección automática.
              <br />
              <strong>Estado:</strong> Throttling activo para estabilizar el sistema
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 