import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Users, 
  Target, 
  TrendingUp, 
  Brain, 
  Zap, 
  Shield, 
  Globe,
  BarChart3,
  PieChart,
  MapPin,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  Play,
  Pause,
  Stop
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Custom Hook para métricas de IA
const useAIMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeAgents: 0,
    totalInteractions: 0,
    successRate: 0,
    responseTime: 0,
    aiConfidence: 0
  });

  useEffect(() => {
    // Simular datos de IA en tiempo real
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeAgents: Math.floor(Math.random() * 50) + 10,
        totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 100),
        successRate: Math.random() * 20 + 80,
        responseTime: Math.random() * 500 + 200,
        aiConfidence: Math.random() * 30 + 70
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

// Custom Hook para estado del sistema
const useSystemStatus = () => {
  const [status, setStatus] = useState({
    n8n: 'online',
    redis: 'online',
    gemini: 'online',
    database: 'online'
  });

  useEffect(() => {
    const checkStatus = () => {
      setStatus(prev => ({
        ...prev,
        n8n: Math.random() > 0.1 ? 'online' : 'warning',
        redis: Math.random() > 0.05 ? 'online' : 'error'
      }));
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return status;
};

// Componente de Métrica con Animación
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "blue",
  subtitle 
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  subtitle?: string;
}) => (
  <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-100 rounded-full -translate-y-16 translate-x-16 opacity-20`} />
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <Badge 
            variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} 
            {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : '0%'}
          </Badge>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </CardContent>
  </Card>
);

// Componente de Estado del Sistema
const SystemStatusCard = ({ status }: { status: Record<string, string> }) => (
  <Card className="border-0 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-600" />
        Estado del Sistema
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {Object.entries(status).map(([service, state]) => (
          <div key={service} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                state === 'online' ? 'bg-green-500' : 
                state === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium capitalize">{service}</span>
            </div>
            <Badge 
              variant={state === 'online' ? 'default' : state === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {state}
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Componente de Actividad de IA
const AIActivityCard = ({ metrics }: { metrics: any }) => (
  <Card className="border-0 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-600" />
        Actividad de IA
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Agentes Activos</span>
            <span className="font-medium">{metrics.activeAgents}</span>
          </div>
          <Progress value={metrics.activeAgents / 60 * 100} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Tasa de Éxito</span>
            <span className="font-medium">{metrics.successRate.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.successRate} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Confianza IA</span>
            <span className="font-medium">{metrics.aiConfidence.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.aiConfidence} className="h-2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Componente de Acciones Rápidas
const QuickActionsCard = () => {
  const { toast } = useToast();
  
  const actions = [
    { icon: Play, label: 'Iniciar IA', action: () => toast({ title: "🚀 IA iniciada", description: "Sistema de inteligencia artificial activado" }) },
    { icon: Pause, label: 'Pausar', action: () => toast({ title: "⏸️ Sistema pausado", description: "Operaciones temporariamente detenidas" }) },
    { icon: RefreshCw, label: 'Sincronizar', action: () => toast({ title: "🔄 Sincronizando", description: "Actualizando datos del sistema" }) },
    { icon: Download, label: 'Exportar', action: () => toast({ title: "📊 Exportando", description: "Generando reporte de datos" }) }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(({ icon: Icon, label, action }) => (
            <Button
              key={label}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2"
              onClick={action}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Dashboard Principal
export const ModernDashboard = () => {
  const aiMetrics = useAIMetrics();
  const systemStatus = useSystemStatus();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Agora
            </h1>
            <p className="text-gray-600">
              Sistema de Inteligencia Electoral Avanzado
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Interacciones Totales"
          value={aiMetrics.totalInteractions.toLocaleString()}
          icon={MessageSquare}
          trend="up"
          color="blue"
          subtitle="Últimas 24 horas"
        />
        <MetricCard
          title="Agentes Activos"
          value={aiMetrics.activeAgents}
          icon={Users}
          trend="stable"
          color="green"
          subtitle="IA operativa"
        />
        <MetricCard
          title="Tasa de Éxito"
          value={`${aiMetrics.successRate.toFixed(1)}%`}
          icon={Target}
          trend="up"
          color="purple"
          subtitle="Precisión IA"
        />
        <MetricCard
          title="Tiempo Respuesta"
          value={`${aiMetrics.responseTime.toFixed(0)}ms`}
          icon={Activity}
          trend="down"
          color="orange"
          subtitle="Promedio"
        />
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          <SystemStatusCard status={systemStatus} />
          <AIActivityCard metrics={aiMetrics} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActionsCard />
          
          {/* Widget de Tendencias */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Tendencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Participación</span>
                  <Badge variant="default" className="text-xs">+15%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engagement</span>
                  <Badge variant="default" className="text-xs">+8%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversiones</span>
                  <Badge variant="secondary" className="text-xs">+3%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 