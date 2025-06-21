import { useState, useEffect, useCallback } from 'react';
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
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Pause,
  Play
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  database: number;
  network: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  queueSize: number;
}

interface SaturationThresholds {
  warning: number;
  critical: number;
  max: number;
}

interface SaturationCheck {
  metric: string;
  current: number;
  threshold: SaturationThresholds;
  status: 'healthy' | 'warning' | 'critical' | 'saturated';
  trend: 'stable' | 'increasing' | 'decreasing';
  lastUpdate: Date;
}

export const SystemSaturationMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    database: 0,
    network: 0,
    responseTime: 0,
    errorRate: 0,
    activeConnections: 0,
    queueSize: 0
  });

  const [saturationChecks, setSaturationChecks] = useState<SaturationCheck[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoThrottle, setAutoThrottle] = useState(false);
  const [lastThrottle, setLastThrottle] = useState<Date | null>(null);

  // Umbrales de saturación configurables
  const thresholds: Record<string, SaturationThresholds> = {
    cpu: { warning: 70, critical: 85, max: 95 },
    memory: { warning: 75, critical: 90, max: 98 },
    database: { warning: 80, critical: 90, max: 95 },
    network: { warning: 75, critical: 85, max: 90 },
    responseTime: { warning: 1000, critical: 2000, max: 5000 },
    errorRate: { warning: 5, critical: 10, max: 20 },
    activeConnections: { warning: 100, critical: 150, max: 200 },
    queueSize: { warning: 50, critical: 100, max: 200 }
  };

  // Simular métricas del sistema
  const simulateSystemMetrics = useCallback(async (): Promise<SystemMetrics> => {
    const baseMetrics = {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      database: Math.random() * 100,
      network: Math.random() * 100,
      responseTime: Math.random() * 3000,
      errorRate: Math.random() * 15,
      activeConnections: Math.random() * 250,
      queueSize: Math.random() * 150
    };

    // Simular picos de carga ocasionales
    if (Math.random() < 0.1) {
      baseMetrics.cpu *= 1.5;
      baseMetrics.memory *= 1.3;
      baseMetrics.responseTime *= 2;
    }

    return baseMetrics;
  }, []);

  // Verificar saturación del sistema
  const checkSaturation = useCallback((metrics: SystemMetrics): SaturationCheck[] => {
    const checks: SaturationCheck[] = [];

    Object.entries(metrics).forEach(([metric, value]) => {
      const threshold = thresholds[metric];
      if (!threshold) return;

      let status: 'healthy' | 'warning' | 'critical' | 'saturated' = 'healthy';
      let trend: 'stable' | 'increasing' | 'decreasing' = 'stable';

      if (value >= threshold.max) {
        status = 'saturated';
      } else if (value >= threshold.critical) {
        status = 'critical';
      } else if (value >= threshold.warning) {
        status = 'warning';
      }

      checks.push({
        metric,
        current: value,
        threshold,
        status,
        trend,
        lastUpdate: new Date()
      });
    });

    return checks;
  }, [thresholds]);

  // Aplicar throttling automático
  const applyAutoThrottle = useCallback((checks: SaturationCheck[]) => {
    const criticalChecks = checks.filter(check => check.status === 'critical' || check.status === 'saturated');
    
    if (criticalChecks.length > 0 && !autoThrottle) {
      setAutoThrottle(true);
      setLastThrottle(new Date());
      
      // Simular acciones de throttling
      console.log('🚨 APLICANDO THROTTLING AUTOMÁTICO');
      console.log('Métricas críticas:', criticalChecks.map(c => `${c.metric}: ${c.current}%`));
      
      // Reducir frecuencia de actualizaciones
      setTimeout(() => {
        setAutoThrottle(false);
        setLastThrottle(null);
      }, 30000); // 30 segundos de throttling
    }
  }, [autoThrottle]);

  // Monitoreo continuo
  const startMonitoring = useCallback(async () => {
    setIsMonitoring(true);
    
    const monitorInterval = setInterval(async () => {
      if (autoThrottle) {
        console.log('⏸️ Monitoreo pausado por throttling automático');
        return;
      }

      try {
        const newMetrics = await simulateSystemMetrics();
        setMetrics(newMetrics);

        const checks = checkSaturation(newMetrics);
        setSaturationChecks(checks);

        applyAutoThrottle(checks);

        // Verificar base de datos real
        const start = Date.now();
        await supabase.from('profiles').select('count').limit(1);
        const dbResponseTime = Date.now() - start;

        setMetrics(prev => ({
          ...prev,
          database: Math.min(100, (dbResponseTime / 1000) * 100),
          responseTime: dbResponseTime
        }));

      } catch (error) {
        console.error('Error en monitoreo:', error);
        setMetrics(prev => ({
          ...prev,
          errorRate: Math.min(100, prev.errorRate + 5)
        }));
      }
    }, 5000); // Cada 5 segundos

    return () => clearInterval(monitorInterval);
  }, [simulateSystemMetrics, checkSaturation, applyAutoThrottle, autoThrottle]);

  useEffect(() => {
    const cleanup = startMonitoring();
    return () => {
      cleanup.then(clearInterval => clearInterval && clearInterval());
    };
  }, [startMonitoring]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'critical':
        return { icon: XCircle, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
      case 'saturated':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      default:
        return { icon: Activity, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'cpu': return <Cpu className="w-4 h-4" />;
      case 'memory': return <Memory className="w-4 h-4" />;
      case 'database': return <HardDrive className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'responseTime': return <Clock className="w-4 h-4" />;
      case 'errorRate': return <XCircle className="w-4 h-4" />;
      case 'activeConnections': return <Network className="w-4 h-4" />;
      case 'queueSize': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getProgressColor = (value: number, threshold: SaturationThresholds) => {
    if (value >= threshold.max) return 'bg-red-500';
    if (value >= threshold.critical) return 'bg-orange-500';
    if (value >= threshold.warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const criticalChecks = saturationChecks.filter(check => check.status === 'critical' || check.status === 'saturated');
  const warningChecks = saturationChecks.filter(check => check.status === 'warning');
  const healthyChecks = saturationChecks.filter(check => check.status === 'healthy');

  return (
    <div className="space-y-6">
      {/* Estado General */}
      <Alert className={`${criticalChecks.length > 0 ? 'bg-red-50 border-red-200' : warningChecks.length > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border-2`}>
        <Activity className="h-5 w-5" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Estado de Saturación del Sistema
              </p>
              <p className="text-sm">
                {criticalChecks.length > 0 
                  ? `🚨 ${criticalChecks.length} métricas críticas detectadas`
                  : warningChecks.length > 0 
                  ? `⚠️ ${warningChecks.length} advertencias activas`
                  : '✅ Sistema operando dentro de parámetros normales'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {autoThrottle && (
                <Badge variant="destructive" className="flex items-center gap-1">
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
                {isMonitoring ? 'Pausar' : 'Reanudar'}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Métricas en Tiempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Métricas del Sistema en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {saturationChecks.map((check) => {
              const config = getStatusConfig(check.status);
              const Icon = config.icon;
              const MetricIcon = getMetricIcon(check.metric);
              
              return (
                <Card key={check.metric} className={`${config.bgColor} ${config.borderColor} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {MetricIcon}
                        <span className="font-medium capitalize">{check.metric}</span>
                      </div>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{check.current.toFixed(1)}%</span>
                        <span className="text-gray-500">Max: {check.threshold.max}%</span>
                      </div>
                      <Progress 
                        value={check.current} 
                        className="h-2"
                        style={{
                          '--progress-background': getProgressColor(check.current, check.threshold)
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Warning: {check.threshold.warning}%</span>
                      <span>Critical: {check.threshold.critical}%</span>
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
            <div className="text-sm text-green-600">Métricas Saludables</div>
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
            <div className="text-sm text-red-600">Críticas</div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticas */}
      {criticalChecks.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Alertas Críticas de Saturación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalChecks.map((check) => (
                <Alert key={check.metric} variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{check.metric.toUpperCase()}</strong>: {check.current.toFixed(1)}% 
                    (Umbral crítico: {check.threshold.critical}%)
                    <br />
                    <span className="text-xs">
                      Última actualización: {check.lastUpdate.toLocaleTimeString()}
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de Throttling */}
      {lastThrottle && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Shield className="w-5 h-5" />
              Protección Automática Activa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              El sistema detectó saturación y aplicó throttling automático para proteger la estabilidad.
              <br />
              <strong>Iniciado:</strong> {lastThrottle.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 