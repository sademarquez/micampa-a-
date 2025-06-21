import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  Navigation,
  Zap,
  Globe,
  Sparkles,
  TrendingUp,
  MapIcon,
  Target,
  Trophy,
  MessageCircle
} from 'lucide-react';
import { geminiService } from '@/services/geminiService';
import OpenStreetMapComponent from './OpenStreetMapComponent';
import SellerChatIntegration from './SellerChatIntegration';

interface MapLevel {
  id: string;
  name: string;
  type: 'ciudad' | 'localidad' | 'barrio';
  coordinates: { lat: number; lng: number };
  population: number;
  alerts: Alert[];
  children?: MapLevel[];
  parent?: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'campaign' | 'issue' | 'event';
  priority: 'low' | 'medium' | 'high';
  coordinates: { lat: number; lng: number };
  visible_to: string[];
  created_at: string;
  gemini_insight?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface VoterProfile {
  nombre?: string;
  age_range?: string;
  political_interest?: string;
  engagement_level?: string;
  location?: string;
  contact_readiness?: string;
}

const InteractiveMapFunnel = () => {
  const [currentLevel, setCurrentLevel] = useState<MapLevel | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [leadData, setLeadData] = useState({
    sessionId: `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    engagementScore: 0,
    interactions: [] as string[]
  });
  const [geminiInsights, setGeminiInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'chat'>('map');

  const mapHierarchy: MapLevel[] = [
    {
      id: 'bogota',
      name: 'Bogotá D.C.',
      type: 'ciudad',
      coordinates: { lat: 4.7110, lng: -74.0721 },
      population: 7412566,
      alerts: [
        {
          id: 'bg-1',
          title: 'Oportunidad Electoral Masiva',
          description: 'Gran concentración de votantes indecisos en zona norte',
          type: 'opportunity',
          priority: 'high',
          coordinates: { lat: 4.7500, lng: -74.0500 },
          visible_to: ['público', 'visitante'],
          created_at: new Date().toISOString(),
          gemini_insight: 'IA detecta 73% probabilidad de conversión en esta zona'
        }
      ],
      children: [
        {
          id: 'suba',
          name: 'Suba',
          type: 'localidad',
          coordinates: { lat: 4.7500, lng: -74.0500 },
          population: 1311102,
          alerts: [
            {
              id: 'sb-1',
              title: 'Evento Comunitario Activo',
              description: 'Reunión vecinal en curso - momento ideal para contacto',
              type: 'event',
              priority: 'medium',
              coordinates: { lat: 4.7500, lng: -74.0500 },
              visible_to: ['público'],
              created_at: new Date().toISOString()
            }
          ],
          parent: 'bogota',
          children: [
            {
              id: 'niza',
              name: 'La Niza',
              type: 'barrio',
              coordinates: { lat: 4.7600, lng: -74.0450 },
              population: 45000,
              alerts: [
                {
                  id: 'nz-1',
                  title: 'Alta Concentración Demográfica',
                  description: 'Perfil socioeconómico ideal para propuestas educativas',
                  type: 'opportunity',
                  priority: 'high',
                  coordinates: { lat: 4.7600, lng: -74.0450 },
                  visible_to: ['público'],
                  created_at: new Date().toISOString(),
                  gemini_insight: 'Zona de profesionales jóvenes, alta receptividad a innovación'
                }
              ],
              parent: 'suba'
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          captureInteraction('location_granted');
        },
        (error) => {
          console.log('Geolocation error:', error);
          setCurrentLevel(mapHierarchy[0]);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && !currentLevel) {
      const bogota = mapHierarchy[0];
      setCurrentLevel(bogota);
      captureInteraction('auto_location_detected');
    }
  }, [userLocation, currentLevel]);

  const captureInteraction = async (type: string, data: any = {}) => {
    const voterProfile: VoterProfile = {
      nombre: 'Visitante',
      age_range: '25-54',
      political_interest: 'high',
      engagement_level: leadData.engagementScore > 50 ? 'high' : 'medium',
      location: currentLevel?.name,
      contact_readiness: leadData.engagementScore > 70 ? 'high' : 'medium'
    };

    const newInteraction = {
      type,
      timestamp: new Date().toISOString(),
      data: {
        currentLevel: currentLevel?.name,
        userLocation: userLocation ? 'granted' : 'denied',
        voterProfile,
        ...data
      }
    };

    setLeadData(prev => ({
      ...prev,
      engagementScore: Math.min(prev.engagementScore + 5, 100),
      interactions: [...prev.interactions, type]
    }));

    console.log('🎯 Map Interaction:', newInteraction);

    if (['location_select', 'alert_click', 'chat_open'].includes(type)) {
      await analyzeWithGemini(type, newInteraction);
    }
  };

  const analyzeWithGemini = async (interactionType: string, interactionData: any) => {
    setIsAnalyzing(true);
    try {
      const voterProfile: VoterProfile = {
        nombre: 'Visitante',
        location: currentLevel?.name || 'No definida'
      };

      const insight = await geminiService.generateWelcomeMessage(voterProfile);
      setGeminiInsights(insight);
      
      console.log('🤖 Gemini Analysis:', insight);
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLocationSelect = (location: any) => {
    if (location.lat && location.lng) {
      setCurrentLevel({
        id: `loc_${Date.now()}`,
        name: location.title || 'Ubicación Seleccionada',
        type: 'barrio',
        coordinates: { lat: location.lat, lng: location.lng },
        population: 0,
        alerts: []
      });
      captureInteraction('location_select', location);
    }
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    captureInteraction('alert_click', { 
      alert_id: alert.id, 
      alert_type: alert.type, 
      priority: alert.priority 
    });
  };

  const getAlertsForMap = () => {
    return mapHierarchy.reduce((alerts: any[], level) => {
      const levelAlerts = level.alerts.map(alert => ({
        id: alert.id,
        title: alert.title,
        lat: alert.coordinates.lat,
        lng: alert.coordinates.lng,
        priority: alert.priority
      }));
      
      if (level.children) {
        level.children.forEach(child => {
          const childAlerts = child.alerts.map(alert => ({
            id: alert.id,
            title: alert.title,
            lat: alert.coordinates.lat,
            lng: alert.coordinates.lng,
            priority: alert.priority
          }));
          levelAlerts.push(...childAlerts);
        });
      }
      
      return [...alerts, ...levelAlerts];
    }, []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-2 sm:px-4 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header optimizado */}
        <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold truncate">Mapa Electoral Inteligente</h1>
                  <p className="opacity-90 text-xs sm:text-base truncate">
                    {currentLevel ? `${currentLevel.name}` : 'Detectando ubicación...'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-center sm:justify-end">
                <Badge className="bg-white/20 text-white text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {leadData.engagementScore}%
                </Badge>
                <Badge className="bg-white/20 text-white text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini IA
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Navegación */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <div className="flex gap-1">
              <Button
                variant={activeTab === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('map')}
                className="text-xs sm:text-sm"
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Mapa Interactivo
              </Button>
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setActiveTab('chat');
                  captureInteraction('chat_open');
                }}
                className="text-xs sm:text-sm"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Chat IA
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        {activeTab === 'map' ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* Mapa Principal */}
            <div className="xl:col-span-3 order-2 xl:order-1">
              <div className="h-[400px] sm:h-[600px]">
                <OpenStreetMapComponent 
                  onLocationSelect={handleLocationSelect}
                  alerts={getAlertsForMap()}
                />
              </div>
              
              {/* Información de Ubicación Actual */}
              {currentLevel && (
                <Card className="mt-4">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-lg text-blue-900 truncate">{currentLevel.name}</h3>
                        <p className="text-blue-700 capitalize text-xs sm:text-sm">
                          {currentLevel.type} • {currentLevel.population.toLocaleString()} habitantes
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {currentLevel.alerts?.length || 0} alertas
                        </Badge>
                        {currentLevel.children && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {currentLevel.children.length} sub-zonas
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 order-1 xl:order-2 xl:sticky xl:top-6 xl:h-fit">
              {/* Gemini AI Insights */}
              <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-purple-800 text-sm sm:text-base">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    Análisis IA
                    {isAnalyzing && (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  {geminiInsights ? (
                    <div className="bg-white/60 p-2 sm:p-3 rounded-lg border border-purple-200">
                      <p className="text-xs sm:text-sm text-purple-900">{geminiInsights}</p>
                    </div>
                  ) : (
                    <div className="text-center py-3 sm:py-4">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-purple-600">
                        Interactúa con el mapa para obtener insights
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Acciones Rápidas */}
              <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-green-800 text-sm sm:text-base">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                    Acciones Inteligentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8 sm:h-10"
                    onClick={() => {
                      setActiveTab('chat');
                      captureInteraction('contact_request', { method: 'chat' });
                    }}
                  >
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Abrir Chat IA
                  </Button>
                  
                  <div className="text-center text-xs text-green-600 mt-2 sm:mt-3">
                    💡 Potenciado por Gemini + SellerChat
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Panel de Chat IA */
          <div className="max-w-6xl mx-auto">
            <SellerChatIntegration />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMapFunnel;
