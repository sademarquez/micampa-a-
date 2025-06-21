
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSecureAuth } from '../contexts/SecureAuthContext';
import OpenStreetMapComponent from './OpenStreetMapComponent';
import GeminiMCPMapController from './GeminiMCPMapController';
import SellerChatIntegration from './SellerChatIntegration';
import { toast } from 'sonner';
import { 
  MapIcon,
  Brain,
  Zap,
  Globe,
  MessageCircle,
  Crown,
  Target,
  TrendingUp,
  Layers,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface SystemStatus {
  gemini: boolean;
  sellerChat: boolean;
  n8n: boolean;
  maps: boolean;
}

interface TerritorialAlert {
  id: string;
  title: string;
  lat: number;
  lng: number;
  priority: 'high' | 'medium' | 'low';
  gemini_insight: string;
  automation_potential: number;
  predicted_votes: number;
  status: 'active' | 'resolved' | 'pending';
}

const EnhancedInteractiveMapFunnel = () => {
  const { user } = useSecureAuth();
  const [activeTab, setActiveTab] = useState<'map' | 'mcp' | 'chat'>('map');
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [currentBounds, setCurrentBounds] = useState<any>(null);
  const [territorialActions, setTerritorialActions] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    gemini: false,
    sellerChat: false,
    n8n: false,
    maps: true
  });
  const [isSystemHealthy, setIsSystemHealthy] = useState(false);

  // Alertas territoriales mejoradas con más datos
  const [enhancedAlerts, setEnhancedAlerts] = useState<TerritorialAlert[]>([
    {
      id: 'mcp-1',
      title: 'Oportunidad Electoral Crítica',
      lat: 4.7500,
      lng: -74.0500,
      priority: 'high',
      gemini_insight: 'IA detecta 89% probabilidad de conversión masiva en zona residencial',
      automation_potential: 95,
      predicted_votes: 1247,
      status: 'active'
    },
    {
      id: 'mcp-2', 
      title: 'Zona de Alto Rendimiento',
      lat: 4.7600,
      lng: -74.0450,
      priority: 'medium',
      gemini_insight: 'Demografía optimizada para propuestas educativas y tecnológicas',
      automation_potential: 78,
      predicted_votes: 892,
      status: 'active'
    },
    {
      id: 'mcp-3',
      title: 'Activación Territorial Requerida',
      lat: 4.7300,
      lng: -74.0600,
      priority: 'high',
      gemini_insight: 'Competencia debilitada, momento estratégico ideal para avanzar',
      automation_potential: 85,
      predicted_votes: 1556,
      status: 'pending'
    }
  ]);

  // Verificar estado del sistema al cargar
  useEffect(() => {
    initializeSystem();
    const healthCheck = setInterval(performHealthCheck, 45000); // Check every 45 seconds
    return () => clearInterval(healthCheck);
  }, []);

  const initializeSystem = async () => {
    console.log('🚀 Inicializando Sistema Completo...');
    
    try {
      // Verificar todos los servicios
      const services = await Promise.allSettled([
        checkGeminiHealth(),
        checkSellerChatHealth(),
        checkN8NHealth(),
        checkMapsHealth()
      ]);

      const newStatus: SystemStatus = {
        gemini: services[0].status === 'fulfilled' && services[0].value,
        sellerChat: services[1].status === 'fulfilled' && services[1].value,
        n8n: services[2].status === 'fulfilled' && services[2].value,
        maps: services[3].status === 'fulfilled' && services[3].value
      };

      setSystemStatus(newStatus);
      
      const healthyServices = Object.values(newStatus).filter(Boolean).length;
      const totalServices = Object.keys(newStatus).length;
      const systemHealth = healthyServices / totalServices >= 0.75; // 75% threshold
      
      setIsSystemHealthy(systemHealth);

      if (systemHealth) {
        toast.success(`✅ Sistema Operativo: ${healthyServices}/${totalServices} servicios activos`);
      } else {
        toast.error(`⚠️ Sistema Degradado: ${healthyServices}/${totalServices} servicios activos`);
      }

    } catch (error) {
      console.error('❌ Error inicializando sistema:', error);
      toast.error('Error crítico en inicialización del sistema');
    }
  };

  const checkGeminiHealth = async (): Promise<boolean> => {
    try {
      // Simular verificación de Gemini
      return new Promise((resolve) => {
        setTimeout(() => resolve(Math.random() > 0.1), 1000);
      });
    } catch (error) {
      return false;
    }
  };

  const checkSellerChatHealth = async (): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => resolve(Math.random() > 0.15), 800);
      });
    } catch (error) {
      return false;
    }
  };

  const checkN8NHealth = async (): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => resolve(Math.random() > 0.2), 600);
      });
    } catch (error) {
      return false;
    }
  };

  const checkMapsHealth = async (): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => resolve(Math.random() > 0.05), 400);
      });
    } catch (error) {
      return false;
    }
  };

  const performHealthCheck = useCallback(async () => {
    const newStatus = { ...systemStatus };
    
    try {
      const [gemini, sellerChat, n8n, maps] = await Promise.all([
        checkGeminiHealth(),
        checkSellerChatHealth(),
        checkN8NHealth(),
        checkMapsHealth()
      ]);

      newStatus.gemini = gemini;
      newStatus.sellerChat = sellerChat;
      newStatus.n8n = n8n;
      newStatus.maps = maps;

      setSystemStatus(newStatus);
      
      const healthyCount = Object.values(newStatus).filter(Boolean).length;
      setIsSystemHealthy(healthyCount >= 3); // At least 3 of 4 services
      
    } catch (error) {
      console.error('Error en health check:', error);
    }
  }, [systemStatus]);

  const handleMapBoundsChange = useCallback((newBounds: any) => {
    setCurrentBounds(newBounds);
    console.log('📍 Límites del mapa actualizados:', newBounds);
  }, []);

  const handleTerritorialAction = useCallback((action: any) => {
    const enhancedAction = {
      ...action,
      id: `action_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.name || 'Sistema',
      automated: action.automated || false
    };

    setTerritorialActions(prev => [...prev, enhancedAction]);
    
    console.log('🎯 Acción Territorial Ejecutada:', enhancedAction);
    
    toast.success(`✅ Acción ejecutada: ${action.type || 'Acción territorial'}`);

    // Simular actualización de alertas
    if (action.type === 'resolve_alert' && action.alertId) {
      setEnhancedAlerts(prev => 
        prev.map(alert => 
          alert.id === action.alertId 
            ? { ...alert, status: 'resolved' }
            : alert
        )
      );
    }
  }, [user]);

  const getTabIcon = (tab: string) => {
    const icons = {
      map: Globe,
      mcp: Brain,
      chat: MessageCircle
    };
    const Icon = icons[tab as keyof typeof icons] || Globe;
    return <Icon className="w-4 h-4" />;
  };

  const getUserLevelBadge = () => {
    switch (user?.role) {
      case 'desarrollador':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Crown className="w-3 h-3 mr-1" />
          DESARROLLADOR MAX
        </Badge>;
      case 'master':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">
          <Target className="w-3 h-3 mr-1" />
          MASTER ESTRATÉGICO
        </Badge>;
      case 'candidato':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          <TrendingUp className="w-3 h-3 mr-1" />
          CANDIDATO EJECUTIVO
        </Badge>;
      case 'lider':
        return <Badge className="bg-green-100 text-green-800 border-green-300">
          <Layers className="w-3 h-3 mr-1" />
          LÍDER TERRITORIAL
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">
          VISITANTE
        </Badge>;
    }
  };

  const getSystemStatusIcon = () => {
    const healthyServices = Object.values(systemStatus).filter(Boolean).length;
    
    if (healthyServices === 4) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (healthyServices >= 3) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <WifiOff className="w-5 h-5 text-red-600" />;
    }
  };

  const forceSystemReconnect = async () => {
    toast.info('🔄 Reconectando todos los servicios...');
    await initializeSystem();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-2 sm:px-4 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Principal con Estado del Sistema */}
        <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold truncate">
                    Gemini MCP Electoral Intelligence
                  </h1>
                  <p className="opacity-90 text-xs sm:text-base truncate">
                    Sistema Completo de Automatización con IA
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-center sm:justify-end">
                {getUserLevelBadge()}
                <Badge className="bg-white/20 text-white text-xs flex items-center gap-1">
                  {getSystemStatusIcon()}
                  Sistema {isSystemHealthy ? 'Operativo' : 'Degradado'}
                </Badge>
                <Button
                  onClick={forceSystemReconnect}
                  size="sm"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reconectar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de Servicios */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Estado de Servicios Integrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className={`p-3 rounded-lg border ${
                systemStatus.gemini ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {systemStatus.gemini ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">Gemini IA</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {systemStatus.gemini ? 'Procesamiento activo' : 'Desconectado'}
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${
                systemStatus.sellerChat ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {systemStatus.sellerChat ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">SellerChat</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {systemStatus.sellerChat ? 'WhatsApp operativo' : 'Sin conexión'}
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${
                systemStatus.n8n ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {systemStatus.n8n ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">N8N Flows</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {systemStatus.n8n ? 'Automatización activa' : 'Workflows pausados'}
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${
                systemStatus.maps ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {systemStatus.maps ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">Mapas</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {systemStatus.maps ? 'Carga completa' : 'Error de carga'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navegación de Pestañas */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border-2 border-purple-200">
            <div className="flex gap-1">
              {[
                { id: 'map', label: 'Mapa Interactivo', desc: 'Vista territorial completa' },
                { id: 'mcp', label: 'Control MCP', desc: 'Automatización IA avanzada' },
                { id: 'chat', label: 'Chat Integrado', desc: 'SellerChat + WhatsApp + Gemini' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-xs sm:text-sm flex flex-col items-center p-3 min-w-[120px] ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-purple-50'
                  }`}
                >
                  {getTabIcon(tab.id)}
                  <span className="mt-1 font-medium">{tab.label}</span>
                  <span className="text-xs opacity-70">{tab.desc}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas Territoriales Mejoradas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {enhancedAlerts.reduce((sum, alert) => sum + alert.predicted_votes, 0).toLocaleString()}
              </div>
              <p className="text-sm text-green-700">Votos Predichos IA</p>
              <p className="text-xs text-green-600 mt-1">
                +{Math.floor(Math.random() * 15) + 5}% vs. mes anterior
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(enhancedAlerts.reduce((sum, alert) => sum + alert.automation_potential, 0) / enhancedAlerts.length)}%
              </div>
              <p className="text-sm text-blue-700">Automatización Promedio</p>
              <p className="text-xs text-blue-600 mt-1">
                {enhancedAlerts.filter(a => a.automation_potential > 80).length} zonas high-auto
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {enhancedAlerts.filter(a => a.status === 'active').length}
              </div>
              <p className="text-sm text-purple-700">Zonas Activas</p>
              <p className="text-xs text-purple-600 mt-1">
                {enhancedAlerts.filter(a => a.priority === 'high').length} críticas
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {territorialActions.length}
              </div>
              <p className="text-sm text-yellow-700">Acciones Ejecutadas</p>
              <p className="text-xs text-yellow-600 mt-1">
                {territorialActions.filter(a => a.automated).length} automatizadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal por Pestaña */}
        <div className="space-y-6">
          {activeTab === 'map' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="xl:col-span-3 order-2 xl:order-1">
                <div className="h-[400px] sm:h-[600px]">
                  <OpenStreetMapComponent 
                    onLocationSelect={(location) => {
                      console.log('📍 Ubicación seleccionada:', location);
                      handleTerritorialAction({
                        type: 'location_selected',
                        location,
                        automated: false
                      });
                    }}
                    alerts={enhancedAlerts.map(alert => ({
                      id: alert.id,
                      title: alert.title,
                      lat: alert.lat,
                      lng: alert.lng,
                      priority: alert.priority
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4 order-1 xl:order-2">
                <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="flex items-center gap-2 text-purple-800 text-sm sm:text-base">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                      Insights Gemini IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
                    {enhancedAlerts.slice(0, 2).map((alert) => (
                      <div key={alert.id} className="bg-white/60 p-2 sm:p-3 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-purple-900">
                            {alert.title}
                          </h4>
                          <Badge className={
                            alert.status === 'active' ? 'bg-green-100 text-green-800' :
                            alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-purple-700 mb-2">
                          {alert.gemini_insight}
                        </p>
                        <div className="flex justify-between text-xs">
                          <span>Votos: {alert.predicted_votes.toLocaleString()}</span>
                          <span>Auto: {alert.automation_potential}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <GeminiMCPMapController
              mapInstance={mapInstance}
              currentBounds={currentBounds}
              onTerritorialAction={handleTerritorialAction}
            />
          )}

          {activeTab === 'chat' && (
            <div className="max-w-6xl mx-auto">
              <SellerChatIntegration />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedInteractiveMapFunnel;
