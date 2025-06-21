
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";
import { geminiService } from "@/services/geminiService";
import { 
  Zap, 
  Bot, 
  Target, 
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Globe,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  Award,
  Rocket
} from "lucide-react";
import { toast } from "sonner";

const ElectoralDashboard = () => {
  const { user } = useSecureAuth();
  const navigate = useNavigate();
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testGeminiConnection = async () => {
    setIsTestingGemini(true);
    setGeminiStatus('testing');

    try {
      const testPrompt = "Responde brevemente: ¿Está funcionando la conexión con Gemini AI para MI CAMPAÑA 2025?";
      const response = await geminiService.makeRequest(testPrompt);
      
      if (response && response.length > 0) {
        setGeminiStatus('success');
        toast.success("🚀 Conexión Gemini AI establecida correctamente");
        console.log("✅ Gemini Response:", response);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      setGeminiStatus('error');
      toast.error("❌ Error conectando con Gemini AI");
      console.error("💥 Gemini Error:", error);
    } finally {
      setIsTestingGemini(false);
    }
  };

  const aiFeatures = [
    {
      icon: Bot,
      title: "Asistente IA Conversacional",
      description: "Chat inteligente con Gemini para estrategias electorales",
      status: "active",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Análisis Predictivo",
      description: "Predicción de comportamiento electoral con IA",
      status: "active",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Mensajes Personalizados",
      description: "Generación automática de contenido persuasivo",
      status: "active",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Optimización Automática",
      description: "Mejora continua de campañas con machine learning",
      status: "coming-soon",
      color: "from-orange-500 to-red-500"
    }
  ];

  const campaignMetrics = [
    { label: "Votos Potenciales", value: "15,420", change: "+12%", icon: Users, color: "text-green-600" },
    { label: "Engagement Rate", value: "89.5%", change: "+8%", icon: TrendingUp, color: "text-blue-600" },
    { label: "Mensajes IA", value: "2,847", change: "+23%", icon: MessageSquare, color: "text-purple-600" },
    { label: "Conversiones", value: "1,156", change: "+15%", icon: Target, color: "text-orange-600" }
  ];

  const getStatusIcon = () => {
    switch (geminiStatus) {
      case 'testing': return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header IA Electoral */}
      <div className="campaign-card p-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 border-2 border-purple-200 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-modern-lg animate-pulse-glow">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text-primary">
                IA Electoral Avanzada 🤖
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                Automatización completa con Gemini AI para campañas ganadoras
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini Powered
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  Rol: {user?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            onClick={testGeminiConnection}
            disabled={isTestingGemini}
            className="btn-modern-primary flex items-center gap-2"
          >
            {getStatusIcon()}
            {isTestingGemini ? 'Probando...' : 'Test Conexión'}
          </Button>
        </div>

        {/* Status de conexión */}
        <div className={`p-4 rounded-xl border-2 ${
          geminiStatus === 'success' ? 'border-green-200 bg-green-50' :
          geminiStatus === 'error' ? 'border-red-200 bg-red-50' :
          'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className="font-medium">
              Estado Gemini AI: {
                geminiStatus === 'success' ? '✅ Conectado y Operativo' :
                geminiStatus === 'error' ? '❌ Error de Conexión' :
                geminiStatus === 'testing' ? '🔄 Probando Conexión...' :
                '⚪ No Probado'
              }
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {geminiStatus === 'success' && "La IA está lista para optimizar tu campaña electoral"}
            {geminiStatus === 'error' && "Revisa la configuración del API key en las variables de entorno"}
            {geminiStatus === 'testing' && "Verificando comunicación con los servicios de Google..."}
            {geminiStatus === 'idle' && "Haz clic en 'Test Conexión' para verificar el estado"}
          </p>
        </div>
      </div>

      {/* Métricas de campaña en tiempo real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {campaignMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="stats-card-modern hover:shadow-modern-lg transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Funciones IA disponibles */}
      <div className="grid md:grid-cols-2 gap-6">
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="campaign-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 150}ms`}}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <Badge 
                        variant={feature.status === 'active' ? 'default' : 'outline'}
                        className={feature.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {feature.status === 'active' ? 'Activo' : 'Próximamente'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    
                    {feature.status === 'active' && (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          if (feature.title.includes('Asistente')) {
                            // El asistente ya está disponible en la esquina
                            toast.success("💬 Asistente IA disponible en la esquina inferior derecha");
                          } else if (feature.title.includes('Mensajes')) {
                            navigate("/mensajes");
                          } else {
                            toast.info("🚧 Funcionalidad en desarrollo avanzado");
                          }
                        }}
                      >
                        {feature.title.includes('Asistente') ? 'Ya Disponible' : 'Usar Ahora'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Panel de control rápido */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card 
          className="campaign-card cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400"
          onClick={() => navigate("/visitor-funnel")}
        >
          <CardContent className="p-6 text-center">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mapa IA Interactivo</h3>
            <p className="text-gray-600 mb-4">Visualización geográfica con análisis predictivo</p>
            <Button className="w-full btn-modern-primary">
              Abrir Mapa
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="campaign-card cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-green-200 hover:border-green-400"
          onClick={() => navigate("/dashboard?tab=territories")}
        >
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestión Territorial</h3>
            <p className="text-gray-600 mb-4">Administra zonas con automatización IA</p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Ver Territorios
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="campaign-card cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
          onClick={() => navigate("/dashboard?tab=events")}
        >
          <CardContent className="p-6 text-center">
            <Rocket className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Campañas Automatizadas</h3>
            <p className="text-gray-600 mb-4">Eventos y estrategias con IA generativa</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Crear Campaña
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer motivacional */}
      <Card className="campaign-card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-8 text-center">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🎯 El Futuro Electoral es Hoy
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Con Gemini AI y automatización N8N, tu campaña opera al 120% de eficiencia. 
            Cada decisión está respaldada por inteligencia artificial avanzada.
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">ROI +280%</Badge>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">Engagement +340%</Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">Automatización Total</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectoralDashboard;
