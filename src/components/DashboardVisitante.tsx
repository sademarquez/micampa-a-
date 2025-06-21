
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  MapPin, 
  Users, 
  Sparkles,
  ArrowRight,
  Target,
  TrendingUp,
  Zap,
  Crown,
  Star,
  Heart,
  Award,
  Gift,
  Rocket
} from "lucide-react";

const DashboardVisitante = () => {
  const navigate = useNavigate();
  const [currentBenefit, setCurrentBenefit] = useState(0);

  const benefits = [
    {
      icon: Globe,
      title: "Mapa Inteligente",
      description: "Descubre tu zona electoral con IA avanzada",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Comunidad Activa",
      description: "Conecta con +100K votantes reales",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "IA Personalizada",
      description: "Recomendaciones adaptadas a ti",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Crown,
      title: "Acceso VIP",
      description: "Funciones exclusivas y privilegios",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const quickStats = [
    { label: "Zonas Disponibles", value: "2,840", icon: MapPin, color: "text-blue-600" },
    { label: "Usuarios Activos", value: "100K+", icon: Users, color: "text-green-600" },
    { label: "Eventos Semanales", value: "156", icon: Target, color: "text-purple-600" },
    { label: "Éxito Rate", value: "94%", icon: TrendingUp, color: "text-orange-600" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section Visitante */}
      <div className="relative overflow-hidden campaign-card p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200 animate-scale-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-modern-xl animate-pulse-glow">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black gradient-text-primary mb-4">
              ¡Bienvenido Visitante! 🚀
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              Descubre el poder de la <strong>automatización electoral con IA</strong>. 
              Explora territorios, conecta con tu comunidad y participa activamente.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                IA Gemini Avanzada
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-2" />
                100K+ Usuarios
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-300 px-4 py-2 text-sm">
                <Crown className="w-4 h-4 mr-2" />
                Acceso Gratuito
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/visitor-funnel")}
                size="lg"
                className="btn-modern-primary text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
              >
                <Globe className="w-6 h-6 mr-3" />
                Descubrir Mi Zona
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300"
              >
                <Heart className="w-6 h-6 mr-2" />
                Unirse Oficial
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas elegantes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="stats-card-modern hover:shadow-modern-lg transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  stat.color.includes('blue') ? 'bg-blue-100' :
                  stat.color.includes('green') ? 'bg-green-100' :
                  stat.color.includes('purple') ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Beneficios dinámicos */}
      <Card className="campaign-card animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-center">
            <Zap className="w-6 h-6 text-yellow-500 inline mr-2" />
            ¿Por qué MI CAMPAÑA 2025?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`transition-all duration-500 ${
                  currentBenefit === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
                }`}
              >
                {currentBenefit === index && (
                  <div className="p-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-modern-lg`}>
                      <benefit.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-lg text-gray-700 max-w-md mx-auto">{benefit.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mb-8">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBenefit(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentBenefit === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Final potente */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="campaign-card cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 group"
          onClick={() => navigate("/visitor-funnel")}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Explorar Ahora</h3>
            <p className="text-gray-700 mb-6">
              Acceso inmediato al mapa inteligente y funciones básicas
            </p>
            <Badge className="bg-green-100 text-green-800 border-green-300 mb-4">
              <Gift className="w-4 h-4 mr-2" />
              100% Gratuito
            </Badge>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Comenzar Exploración
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="campaign-card cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 group"
          onClick={() => navigate("/login")}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Acceso Completo</h3>
            <p className="text-gray-700 mb-6">
              Únete oficialmente y desbloquea todas las funciones avanzadas
            </p>
            <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-4">
              <Star className="w-4 h-4 mr-2" />
              Funciones Premium
            </Badge>
            <Button className="w-full btn-modern-primary">
              Registro Oficial
              <Heart className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardVisitante;
