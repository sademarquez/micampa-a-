
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Target,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Star,
  Gift,
  Trophy,
  Zap,
  Heart,
  ArrowRight,
  Award,
  Globe
} from "lucide-react";

const DashboardVotante = () => {
  const { user } = useSecureAuth();
  const navigate = useNavigate();
  const [activeGoal, setActiveGoal] = useState(0);

  const voterGoals = [
    { title: "Invitar 5 amigos", progress: 80, reward: "Badge Embajador", icon: Users },
    { title: "Participar en 3 eventos", progress: 60, reward: "Reconocimiento Público", icon: Calendar },
    { title: "Completar perfil 100%", progress: 95, reward: "Acceso VIP", icon: Target },
    { title: "Compartir en redes", progress: 40, reward: "Sticker Exclusivo", icon: MessageSquare }
  ];

  const upcomingEvents = [
    { name: "Reunión Vecinal", date: "2025-06-18", location: "Salón Comunal", participants: 45 },
    { name: "Caminata por el Barrio", date: "2025-06-20", location: "Parque Central", participants: 78 },
    { name: "Charla Propuestas", date: "2025-06-22", location: "Biblioteca", participants: 32 }
  ];

  const achievements = [
    { title: "Primer Voto Digital", date: "Hace 5 días", icon: Trophy },
    { title: "Invitación Exitosa", date: "Hace 3 días", icon: Users },
    { title: "Participación Activa", date: "Ayer", icon: Heart }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header personalizado elegante */}
      <div className="campaign-card p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-modern-lg animate-pulse-glow">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text-primary">
                ¡Bienvenido, {user?.name}! 🌟
              </h1>
              <p className="text-lg text-gray-700 font-medium">
                Tu participación construye el futuro de nuestra comunidad
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800 border-green-300">Votante Activo</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">Nivel: Embajador</Badge>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={() => navigate("/visitor-funnel")}
              className="btn-modern-primary"
            >
              <Globe className="w-4 h-4 mr-2" />
              Explorar Zona
            </Button>
          </div>
        </div>

        {/* Progress general del votante */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Tu Impacto en la Campaña</h3>
            <span className="text-2xl font-bold gradient-text-primary">85%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Amigos Invitados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-gray-600">Eventos Asistidos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-sm text-gray-600">Puntos Obtenidos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Objetivos personales dinámicos */}
        <Card className="campaign-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Mis Objetivos Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {voterGoals.map((goal, index) => {
              const Icon = goal.icon;
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                    activeGoal === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setActiveGoal(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{width: `${goal.progress}%`}}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Recompensa: {goal.reward}</span>
                    <Gift className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Eventos próximos elegantes */}
        <Card className="campaign-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-4 border rounded-xl hover:shadow-md transition-all duration-300 hover:border-green-300">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {event.participants} personas
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="mt-3 w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate("/dashboard?tab=events")}
                >
                  Confirmar Asistencia
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Logros recientes */}
      <Card className="campaign-card animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Logros Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center p-6 border rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.date}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas llamativas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="campaign-card cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-blue-200 hover:border-blue-400"
          onClick={() => navigate("/visitor-funnel")}
        >
          <CardContent className="p-6 text-center">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Explorar Mi Zona</h3>
            <p className="text-gray-600 mb-4">Descubre votantes y oportunidades en tu área</p>
            <Button className="btn-modern-primary w-full">
              Ver Mapa Inteligente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="campaign-card cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-green-200 hover:border-green-400"
          onClick={() => navigate("/mensajes")}
        >
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chat del Equipo</h3>
            <p className="text-gray-600 mb-4">Conéctate con otros votantes y líderes</p>
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
              Abrir Mensajes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardVotante;
