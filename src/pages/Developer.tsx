import React, { useState, useEffect } from 'react';
import { ModernPageLayout, ModernSection, ModernStat, SystemStatusIndicator } from '@/components/ModernPageLayout';
import { DeveloperPanel } from '@/components/DeveloperPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Clock,
  MapPin,
  BarChart3,
  Users
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { MasterDatabaseManager } from '@/components/MasterDatabaseManager';
import { MasterCampaignMap } from '@/components/MasterCampaignMap';
import { AgoraAnalytics } from '@/components/AgoraAnalytics';
import { N8NWorkflowManager } from '@/components/N8NWorkflowManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const Developer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gemini');
  const [systemStatus, setSystemStatus] = useState({
    n8n: 'online',
    redis: 'online',
    postgresql: 'online',
    gemini: 'online'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simular verificación de estado del sistema
    const checkSystemStatus = () => {
      setSystemStatus({
        n8n: Math.random() > 0.1 ? 'online' : 'offline',
        redis: Math.random() > 0.05 ? 'online' : 'offline',
        postgresql: Math.random() > 0.05 ? 'online' : 'offline',
        gemini: Math.random() > 0.1 ? 'online' : 'offline'
      });
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    return status === 'online' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Desarrollador Agora</h1>
            <p className="text-gray-600 mt-2">
              Gestión avanzada de servicios, IA, métricas y configuración del sistema
            </p>
          </div>
          
          {/* Estado del Sistema */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className={`h-4 w-4 ${getStatusColor(systemStatus.n8n)}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus.n8n)}`}>
                n8n
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className={`h-4 w-4 ${getStatusColor(systemStatus.redis)}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus.redis)}`}>
                Redis
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Database className={`h-4 w-4 ${getStatusColor(systemStatus.postgresql)}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus.postgresql)}`}>
                PostgreSQL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className={`h-4 w-4 ${getStatusColor(systemStatus.gemini)}`} />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus.gemini)}`}>
                Gemini
              </span>
            </div>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="gemini" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Google Gemini
            </TabsTrigger>
            <TabsTrigger value="masters" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Masters DB
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mapa Maestro
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Análisis
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              n8n Workflows
            </TabsTrigger>
          </TabsList>

          {/* Contenido de Google Gemini */}
          <TabsContent value="gemini" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Configuración de Google Gemini API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeveloperPanel />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenido de Masters Database */}
          <TabsContent value="masters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gestión de Bases de Datos Master
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MasterDatabaseManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenido del Mapa Maestro */}
          <TabsContent value="map" className="space-y-6">
            <MasterCampaignMap />
          </TabsContent>

          {/* Contenido de Análisis */}
          <TabsContent value="analytics" className="space-y-6">
            <AgoraAnalytics />
          </TabsContent>

          {/* Contenido de Workflows n8n */}
          <TabsContent value="workflows" className="space-y-6">
            <N8NWorkflowManager />
          </TabsContent>
        </Tabs>

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Servicios del Sistema</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">n8n Orquestador</span>
                    <Badge className={systemStatus.n8n === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {systemStatus.n8n}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Redis Cache</span>
                    <Badge className={systemStatus.redis === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {systemStatus.redis}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">PostgreSQL</span>
                    <Badge className={systemStatus.postgresql === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {systemStatus.postgresql}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Google Gemini</span>
                    <Badge className={systemStatus.gemini === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {systemStatus.gemini}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Métricas Rápidas</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CPU</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Memoria</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Latencia</span>
                    <span className="text-sm font-medium">89ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conexiones</span>
                    <span className="text-sm font-medium">234</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Últimas Actividades</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Workflow ejecutado: Análisis Geoespacial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Nuevo master registrado: Campaña Norte</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">IA optimizada: Predicciones actualizadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Sincronización completada: 1,247 registros</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Developer; 