import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  MapPin, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  Cpu,
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface AgoraAnalyticsProps {
  className?: string;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeConnections: number;
  apiCalls: number;
  errorRate: number;
  responseTime: number;
  throughput: number;
}

interface CampaignMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalVoters: number;
  totalTerritories: number;
  totalVolunteers: number;
  totalEvents: number;
  averageSupportLevel: number;
  contactRate: number;
  eventAttendance: number;
  volunteerEfficiency: number;
}

interface PredictionData {
  voterTurnout: number;
  supportPrediction: number;
  resourceOptimization: number;
  riskAssessment: number;
  recommendations: string[];
}

export const AgoraAnalytics: React.FC<AgoraAnalyticsProps> = ({ className }) => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 0,
    activeConnections: 0,
    apiCalls: 0,
    errorRate: 0,
    responseTime: 0,
    throughput: 0
  });
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetrics>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalVoters: 0,
    totalTerritories: 0,
    totalVolunteers: 0,
    totalEvents: 0,
    averageSupportLevel: 0,
    contactRate: 0,
    eventAttendance: 0,
    volunteerEfficiency: 0
  });
  const [predictions, setPredictions] = useState<PredictionData>({
    voterTurnout: 0,
    supportPrediction: 0,
    resourceOptimization: 0,
    riskAssessment: 0,
    recommendations: []
  });
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const { toast } = useToast();

  // Simular carga de métricas del sistema
  const loadSystemMetrics = async () => {
    try {
      setLoading(true);
      
      // Simular métricas en tiempo real
      const metrics: SystemMetrics = {
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        networkLatency: Math.floor(Math.random() * 100) + 50,
        activeConnections: Math.floor(Math.random() * 500) + 200,
        apiCalls: Math.floor(Math.random() * 1000) + 500,
        errorRate: Math.random() * 2,
        responseTime: Math.floor(Math.random() * 200) + 100,
        throughput: Math.floor(Math.random() * 200) + 100
      };

      setSystemMetrics(metrics);
    } catch (error) {
      console.error('Error loading system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simular carga de métricas de campañas
  const loadCampaignMetrics = async () => {
    try {
      const metrics: CampaignMetrics = {
        totalCampaigns: 4,
        activeCampaigns: 3,
        totalVoters: 48840,
        totalTerritories: 156,
        totalVolunteers: 1200,
        totalEvents: 45,
        averageSupportLevel: 72.5,
        contactRate: 85.3,
        eventAttendance: 78.2,
        volunteerEfficiency: 91.7
      };

      setCampaignMetrics(metrics);
    } catch (error) {
      console.error('Error loading campaign metrics:', error);
    }
  };

  // Simular análisis predictivo
  const loadPredictions = async () => {
    try {
      const predictionData: PredictionData = {
        voterTurnout: 78.5,
        supportPrediction: 73.2,
        resourceOptimization: 87.4,
        riskAssessment: 12.3,
        recommendations: [
          "Aumentar presencia en territorios con <60% de contacto",
          "Optimizar rutas de voluntarios en zonas de baja eficiencia",
          "Programar eventos adicionales en territorios críticos",
          "Reforzar campaña digital en segmentos jóvenes"
        ]
      };

      setPredictions(predictionData);
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  };

  // Cargar todos los datos
  const loadAllData = async () => {
    await Promise.all([
      loadSystemMetrics(),
      loadCampaignMetrics(),
      loadPredictions()
    ]);
  };

  useEffect(() => {
    loadAllData();
    
    // Actualizar métricas cada 30 segundos
    const interval = setInterval(loadSystemMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Obtener color de estado
  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Obtener icono de tendencia
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análisis Avanzado de Agora</h2>
          <p className="text-gray-600 mt-1">
            Métricas en tiempo real, predicciones y optimizaciones del sistema
          </p>
        </div>
        <Button 
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Métricas del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Rendimiento del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CPU</span>
                <span className={`text-sm font-medium ${getStatusColor(systemMetrics.cpuUsage, { warning: 70, critical: 90 })}`}>
                  {systemMetrics.cpuUsage}%
                </span>
              </div>
              <Progress value={systemMetrics.cpuUsage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memoria</span>
                <span className={`text-sm font-medium ${getStatusColor(systemMetrics.memoryUsage, { warning: 80, critical: 95 })}`}>
                  {systemMetrics.memoryUsage}%
                </span>
              </div>
              <Progress value={systemMetrics.memoryUsage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Latencia</span>
                <span className={`text-sm font-medium ${getStatusColor(systemMetrics.networkLatency, { warning: 200, critical: 500 })}`}>
                  {systemMetrics.networkLatency}ms
                </span>
              </div>
              <Progress value={(systemMetrics.networkLatency / 500) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tasa de Error</span>
                <span className={`text-sm font-medium ${getStatusColor(systemMetrics.errorRate, { warning: 1, critical: 5 })}`}>
                  {systemMetrics.errorRate.toFixed(2)}%
                </span>
              </div>
              <Progress value={(systemMetrics.errorRate / 5) * 100} className="h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemMetrics.activeConnections}</div>
              <div className="text-sm text-gray-600">Conexiones Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemMetrics.apiCalls}/s</div>
              <div className="text-sm text-gray-600">Llamadas API</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemMetrics.responseTime}ms</div>
              <div className="text-sm text-gray-600">Tiempo Respuesta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{systemMetrics.throughput}/s</div>
              <div className="text-sm text-gray-600">Throughput</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Campañas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Métricas de Campañas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{campaignMetrics.totalCampaigns}</div>
                  <div className="text-sm text-gray-600">Total Campañas</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{campaignMetrics.activeCampaigns}</div>
                  <div className="text-sm text-gray-600">Activas</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Votantes</span>
                  <span className="font-medium">{campaignMetrics.totalVoters.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Territorios Activos</span>
                  <span className="font-medium">{campaignMetrics.totalTerritories}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Voluntarios</span>
                  <span className="font-medium">{campaignMetrics.totalVolunteers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Eventos Programados</span>
                  <span className="font-medium">{campaignMetrics.totalEvents}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Eficiencia Operativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nivel de Apoyo Promedio</span>
                  <span className="font-medium">{campaignMetrics.averageSupportLevel}%</span>
                </div>
                <Progress value={campaignMetrics.averageSupportLevel} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasa de Contacto</span>
                  <span className="font-medium">{campaignMetrics.contactRate}%</span>
                </div>
                <Progress value={campaignMetrics.contactRate} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Asistencia a Eventos</span>
                  <span className="font-medium">{campaignMetrics.eventAttendance}%</span>
                </div>
                <Progress value={campaignMetrics.eventAttendance} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Eficiencia de Voluntarios</span>
                  <span className="font-medium">{campaignMetrics.volunteerEfficiency}%</span>
                </div>
                <Progress value={campaignMetrics.volunteerEfficiency} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis Predictivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análisis Predictivo con IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Predicciones de Rendimiento</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Participación Electoral</span>
                  </div>
                  <span className="font-bold text-blue-600">{predictions.voterTurnout}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Predicción de Apoyo</span>
                  </div>
                  <span className="font-bold text-green-600">{predictions.supportPrediction}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Optimización de Recursos</span>
                  </div>
                  <span className="font-bold text-purple-600">{predictions.resourceOptimization}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Evaluación de Riesgo</span>
                  </div>
                  <span className="font-bold text-red-600">{predictions.riskAssessment}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recomendaciones de IA</h4>
              <div className="space-y-3">
                {predictions.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Servicios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Estado de Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">n8n Orquestador</div>
                <div className="text-sm text-gray-600">Operativo</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Redis Cache</div>
                <div className="text-sm text-gray-600">Operativo</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Google Gemini</div>
                <div className="text-sm text-gray-600">Operativo</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Supabase DB</div>
                <div className="text-sm text-gray-600">Operativo</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 