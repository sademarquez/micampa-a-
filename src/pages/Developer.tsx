import React from 'react';
import { ModernPageLayout, ModernSection, ModernStat, SystemStatusIndicator } from '@/components/ModernPageLayout';
import { DeveloperPanel } from '@/components/DeveloperPanel';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  Brain, 
  Database, 
  Zap, 
  Settings, 
  Terminal,
  Cpu,
  Network,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Custom Hook para métricas del sistema
const useSystemMetrics = () => {
  const [metrics, setMetrics] = React.useState({
    cpuUsage: 45,
    memoryUsage: 62,
    networkLatency: 120,
    activeConnections: 156,
    apiCalls: 2340,
    errorRate: 0.8
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(50, Math.min(300, prev.networkLatency + (Math.random() - 0.5) * 50)),
        activeConnections: Math.max(100, Math.min(300, prev.activeConnections + Math.floor((Math.random() - 0.5) * 20))),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 100),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

// Componente de métrica del sistema
const SystemMetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  progress, 
  status = 'normal',
  trend 
}: {
  title: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
  progress?: number;
  status?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gray-100">
            <Icon className={`w-6 h-6 ${getStatusColor()}`} />
          </div>
          {trend && (
            <Badge 
              variant={trend === 'up' ? 'default' : trend === 'down' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </Badge>
          )}
        </div>
        
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {value.toFixed(1)}{unit}
          </h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>

        {progress !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Uso actual</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente de logs del sistema
const SystemLogs = () => {
  const [logs] = React.useState([
    { id: 1, level: 'info', message: 'IA Agent iniciado correctamente', time: '2:45 PM', icon: CheckCircle },
    { id: 2, level: 'warning', message: 'Alto uso de memoria detectado', time: '2:43 PM', icon: AlertTriangle },
    { id: 3, level: 'info', message: 'Sincronización con Gemini completada', time: '2:40 PM', icon: CheckCircle },
    { id: 4, level: 'error', message: 'Error en conexión Redis', time: '2:38 PM', icon: AlertTriangle },
    { id: 5, level: 'info', message: 'Nuevo flujo n8n desplegado', time: '2:35 PM', icon: CheckCircle }
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <ModernSection title="Logs del Sistema" icon={Terminal}>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {logs.map((log) => {
          const LogIcon = log.icon;
          return (
            <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-1 rounded ${getLevelColor(log.level)}`}>
                <LogIcon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{log.message}</p>
                <p className="text-xs text-gray-500">{log.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ModernSection>
  );
};

// Componente de estado de servicios
const ServicesStatus = () => {
  const services = [
    { name: 'n8n', status: 'online' as const, uptime: '15d 8h 32m' },
    { name: 'redis', status: 'online' as const, uptime: '15d 8h 32m' },
    { name: 'gemini api', status: 'online' as const, uptime: '15d 8h 32m' },
    { name: 'postgresql', status: 'warning' as const, uptime: '2h 15m' },
    { name: 'websocket', status: 'online' as const, uptime: '15d 8h 32m' }
  ];

  return (
    <ModernSection title="Estado de Servicios" icon={Shield}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <SystemStatusIndicator status={service.status} service={service.name} />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-sm font-medium text-gray-900">{service.uptime}</p>
            </div>
          </div>
        ))}
      </div>
    </ModernSection>
  );
};

const DeveloperPage = () => {
  const metrics = useSystemMetrics();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "⚡ Acción ejecutada",
      description: `${action} completado exitosamente`,
    });
  };

  const actions = [
    {
      label: "Reiniciar IA",
      icon: Brain,
      onClick: () => handleAction("Reinicio de IA"),
      variant: 'outline' as const
    },
    {
      label: "Optimizar",
      icon: Zap,
      onClick: () => handleAction("Optimización del sistema"),
      variant: 'default' as const
    },
    {
      label: "Backup",
      icon: Database,
      onClick: () => handleAction("Backup del sistema"),
      variant: 'outline' as const
    }
  ];

  return (
    <ModernPageLayout
      title="Panel de Desarrollador"
      subtitle="Gestión avanzada del sistema Agora"
      icon={Code}
      actions={actions}
    >
      {/* Métricas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SystemMetricCard
          title="Uso de CPU"
          value={metrics.cpuUsage}
          unit="%"
          icon={Cpu}
          progress={metrics.cpuUsage}
          status={metrics.cpuUsage > 70 ? 'warning' : 'normal'}
          trend="up"
        />
        <SystemMetricCard
          title="Uso de Memoria"
          value={metrics.memoryUsage}
          unit="%"
          icon={Activity}
          progress={metrics.memoryUsage}
          status={metrics.memoryUsage > 80 ? 'critical' : metrics.memoryUsage > 60 ? 'warning' : 'normal'}
          trend="stable"
        />
        <SystemMetricCard
          title="Latencia de Red"
          value={metrics.networkLatency}
          unit="ms"
          icon={Network}
          status={metrics.networkLatency > 200 ? 'warning' : 'normal'}
          trend="down"
        />
        <SystemMetricCard
          title="Conexiones Activas"
          value={metrics.activeConnections}
          unit=""
          icon={Network}
          status="normal"
          trend="up"
        />
        <SystemMetricCard
          title="Llamadas API"
          value={metrics.apiCalls}
          unit=""
          icon={TrendingUp}
          status="normal"
          trend="up"
        />
        <SystemMetricCard
          title="Tasa de Error"
          value={metrics.errorRate}
          unit="%"
          icon={AlertTriangle}
          status={metrics.errorRate > 2 ? 'critical' : metrics.errorRate > 1 ? 'warning' : 'normal'}
          trend="down"
        />
      </div>

      {/* Panel de Desarrollador */}
      <ModernSection title="Configuración de IA" icon={Brain}>
        <DeveloperPanel />
      </ModernSection>

      {/* Estado de Servicios y Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServicesStatus />
        <SystemLogs />
      </div>
    </ModernPageLayout>
  );
};

export default DeveloperPage; 