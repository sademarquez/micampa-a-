
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { 
  Users, 
  MapPin, 
  Target, 
  TrendingUp, 
  Zap, 
  Shield, 
  Bot,
  Sparkles,
  LogOut,
  ChevronRight,
  Globe,
  BarChart3,
  MessageSquare,
  Rocket,
  Crown,
  Star
} from "lucide-react";
import GeminiAssistant from "../components/GeminiAssistant";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useSecureAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "María González",
      role: "Candidata a Alcalde - Bogotá",
      quote: "Con MI CAMPAÑA 2025 aumentamos el engagement en un 340% y optimizamos recursos al máximo",
      votes: "15,420 votos captados",
      image: "🏛️"
    },
    {
      name: "Carlos Master",
      role: "Director de Campaña",
      quote: "La automatización con IA nos permitió gestionar 100K+ votantes de manera personalizada",
      votes: "ROI +280%",
      image: "👑"
    },
    {
      name: "Ana Rodríguez",
      role: "Concejal - Suba",
      quote: "El análisis predictivo de Gemini identificó exactamente dónde enfocar nuestros esfuerzos",
      votes: "12,156 votos",
      image: "⭐"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Texturas y efectos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.05)_120deg,transparent_240deg)]"></div>
      
      {/* Header con logout para escritorio */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MI CAMPAÑA 2025</h1>
                <p className="text-blue-200 text-sm">Automatización Electoral con IA</p>
              </div>
            </div>

            {/* Botón logout solo en pantallas grandes */}
            {user && (
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-blue-200 text-sm capitalize">({user.role})</p>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* Hero Section con efectos de cristal */}
        <section className="pt-20 pb-12 px-4">
          <div className="container mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 text-lg font-semibold shadow-2xl mb-6">
                <Sparkles className="w-5 h-5 mr-2" />
                IA Generativa + Automatización N8N
              </Badge>
              
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                DOMINA LAS
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent block">
                  ELECCIONES
                </span>
                CON IA
              </h2>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Plataforma electoral definitiva con <strong>Gemini AI</strong>, automatización total 
                y análisis predictivo para garantizar tu victoria
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge className="bg-green-500/20 border-green-400 text-green-300 px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  +340% Engagement
                </Badge>
                <Badge className="bg-blue-500/20 border-blue-400 text-blue-300 px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  ROI +280%
                </Badge>
                <Badge className="bg-purple-500/20 border-purple-400 text-purple-300 px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  100K+ Votantes
                </Badge>
              </div>
            </div>

            {/* Botones de acción principales */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                onClick={() => navigate("/visitor-funnel")}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                DESCUBRE TU ZONA
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>

              {user ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <BarChart3 className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  IR AL DASHBOARD
                  <Sparkles className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white text-xl px-12 py-6 rounded-2xl hover:bg-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Shield className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  ACCESO SEGURO
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Testimonios dinámicos */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-white mb-4">Resultados Reales</h3>
              <p className="text-blue-200 text-xl">Líderes políticos que ya dominan con nuestra IA</p>
            </div>

            <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center animate-fade-in">
                  <div className="text-6xl mb-4">{testimonials[currentTestimonial].image}</div>
                  <blockquote className="text-2xl text-white font-medium mb-6 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="mb-4">
                    <p className="text-xl font-bold text-white">{testimonials[currentTestimonial].name}</p>
                    <p className="text-blue-200">{testimonials[currentTestimonial].role}</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    {testimonials[currentTestimonial].votes}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features con cristal morfismo */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-white mb-4">Poder Electoral Total</h3>
              <p className="text-blue-200 text-xl">Tecnología que garantiza victorias</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white text-center">IA Gemini Avanzada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 text-center leading-relaxed">
                    Análisis predictivo, mensajes personalizados y automatización 
                    que convierte visitantes en votos seguros
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white text-center">Automatización N8N</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 text-center leading-relaxed">
                    Workflows inteligentes que gestionan campañas 24/7 
                    con respuestas humanas y seguimiento automático
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white text-center">Targeting Preciso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 text-center leading-relaxed">
                    Geolocalización inteligente y mapas interactivos 
                    para identificar y capturar cada voto potencial
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-md border-orange-400/30 shadow-2xl">
              <CardContent className="p-12">
                <Rocket className="w-20 h-20 text-orange-400 mx-auto mb-6" />
                <h3 className="text-4xl font-bold text-white mb-6">
                  ¿Listo para Dominar las Elecciones?
                </h3>
                <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                  Únete a los líderes que ya utilizan la IA más avanzada 
                  para garantizar victorias electorales contundentes
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    onClick={() => navigate("/visitor-funnel")}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                    COMENZAR AHORA
                  </Button>

                  {!user && (
                    <Button
                      onClick={() => navigate("/login")}
                      className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white text-xl px-12 py-6 rounded-2xl hover:bg-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Shield className="w-6 h-6 mr-2" />
                      ACCESO VIP
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Gemini Assistant optimizado */}
      <GeminiAssistant />
    </div>
  );
};

export default Index;
