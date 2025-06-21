import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import GeminiMapTester from "./GeminiMapTester";
import { 
  Map as MapIcon,
  Satellite,
  Users,
  Target,
  Navigation,
  Globe,
  ArrowRight,
  Zap,
  Crown
} from "lucide-react";

const ModernInteractiveMap = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'satellite' | 'demographic'>('overview');

  const mapFeatures = [
    {
      id: 'overview',
      name: 'Vista General',
      description: 'Mapa interactivo con datos electorales',
      icon: MapIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'satellite',
      name: 'Vista Satelital',
      description: 'Imágenes de alta resolución con IA',
      icon: Satellite,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'demographic',
      name: 'Análisis Demográfico',
      description: 'Distribución de votantes por zona',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const quickActions = [
    {
      title: 'Explorar Zona Completa',
      description: 'Acceso al mapa interactivo principal',
      icon: Globe,
      action: () => navigate('/visitor-funnel'),
      color: 'bg-blue-600'
    },
    {
      title: 'Gestionar Territorios',
      description: 'Administrar zonas asignadas',
      icon: Target,
      action: () => navigate('/dashboard?tab=territories'),
      color: 'bg-green-600'
    },
    {
      title: 'Análisis Predictivo',
      description: 'IA para predicción electoral',
      icon: Zap,
      action: () => navigate('/dashboard?tab=electoral'),
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Selector de vista del mapa */}
      <div className="flex flex-wrap gap-3">
        {mapFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Button
              key={feature.id}
              onClick={() => setActiveView(feature.id as any)}
              variant={activeView === feature.id ? "default" : "outline"}
              className={`flex items-center gap-2 transition-all duration-300 ${
                activeView === feature.id 
                  ? 'bg-gradient-to-r ' + feature.color + ' text-white shadow-lg' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {feature.name}
            </Button>
          );
        })}
      </div>

      {/* Área principal del mapa */}
      <Card className="campaign-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <CardTitle>
                Mapa Interactivo con IA - {mapFeatures.find(f => f.id === activeView)?.name}
              </CardTitle>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Satellite className="w-3 h-3 mr-1" />
              Powered by Gemini
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Vista del mapa simulada - aquí iría la integración real */}
          <div className="relative h-96 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-xl border-2 border-blue-200 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.2),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,197,94,0.2),transparent_50%)]"></div>
            
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  {activeView === 'overview' && <MapIcon className="w-10 h-10 text-white" />}
                  {activeView === 'satellite' && <Satellite className="w-10 h-10 text-white" />}
                  {activeView === 'demographic' && <Users className="w-10 h-10 text-white" />}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {mapFeatures.find(f => f.id === activeView)?.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {mapFeatures.find(f => f.id === activeView)?.description}
                  </p>
                  
                  <Button
                    onClick={() => navigate('/visitor-funnel')}
                    className="btn-modern-primary"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Acceder al Mapa Completo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Puntos de datos simulados */}
            <div className="absolute top-20 left-16 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute top-32 right-24 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-24 left-32 w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 right-20 w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg" style={{animationDelay: '1.5s'}}></div>
          </div>

          {/* Info adicional */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Funcionalidades Avanzadas</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <span>Análisis Predictivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Demografía en Tiempo Real</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span>Automatización IA</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test de conectividad con Gemini */}
      <GeminiMapTester />

      {/* Acciones rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className="campaign-card cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <Button size="sm" className="w-full">
                  Acceder
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ModernInteractiveMap;
