
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Zap,
  MessageSquare,
  Bell,
  Star,
  Trophy,
  Heart,
  Share2,
  Eye,
  ChevronRight,
  Sparkles,
  Activity
} from 'lucide-react';

interface UserMetrics {
  engagement: number;
  connections: number;
  influence: number;
  activity: number;
}

const ModernUserInterface = () => {
  const { user } = useSecureAuth();
  const [metrics, setMetrics] = useState<UserMetrics>({
    engagement: 85,
    connections: 247,
    influence: 92,
    activity: 78
  });

  const [activeConnections, setActiveConnections] = useState([
    { id: '1', name: 'Ana García', role: 'Líder Comunitario', status: 'online', influence: 94 },
    { id: '2', name: 'Carlos Mendez', role: 'Coordinador', status: 'active', influence: 87 },
    { id: '3', name: 'María López', role: 'Voluntaria', status: 'online', influence: 76 },
    { id: '4', name: 'José Ramírez', role: 'Votante', status: 'offline', influence: 68 }
  ]);

  const connectionTypes = {
    'P2P': { label: 'Persona a Persona', color: 'bg-blue-500', count: 145 },
    'B2P': { label: 'Negocio a Persona', color: 'bg-emerald-500', count: 67 },
    'B2B': { label: 'Negocio a Negocio', color: 'bg-purple-500', count: 23 },
    'P2B': { label: 'Persona a Negocio', color: 'bg-amber-500', count: 12 }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getUserInterfaceLevel = () => {
    if (user?.role === 'votante') return 'participativa';
    if (user?.role === 'lider') return 'práctica';
    return 'avanzada';
  };

  const interfaceLevel = getUserInterfaceLevel();

  return (
    <div className="space-y-6">
      {/* Header personalizado según rol */}
      <Card className="modern-glass-card animate-slide-elegant">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{metrics.connections}</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient-primary">
                  Red de Conexiones {user?.role === 'votante' ? 'Participativa' : 'Estratégica'}
                </h2>
                <p className="text-gray-600">
                  Interfaz {interfaceLevel} • {Object.values(connectionTypes).reduce((sum, type) => sum + type.count, 0)} conexiones activas
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gradient-primary text-white">
                    <Activity className="w-3 h-3 mr-1" />
                    {metrics.activity}% actividad
                  </Badge>
                  <Badge className="bg-gradient-accent text-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metrics.influence}% influencia
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-gradient-primary mb-1">
                {metrics.engagement}%
              </div>
              <div className="text-sm text-gray-500">Engagement Total</div>
              <Progress value={metrics.engagement} className="w-24 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de conexión modernos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(connectionTypes).map(([key, type]) => (
          <Card key={key} className="modern-glass-card group hover:scale-105 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <span className="text-white font-bold">{key}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{type.count}</div>
              <div className="text-xs text-gray-600 leading-tight">{type.label}</div>
              <Button size="sm" className="w-full mt-2 modern-interactive-button text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Ver
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Panel de conexiones activas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="modern-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Conexiones Activas
              <Badge className="bg-green-100 text-green-800 ml-auto">
                {activeConnections.filter(c => c.status === 'online').length} en línea
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeConnections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-3 bg-gradient-surface rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(connection.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {connection.name}
                    </div>
                    <div className="text-sm text-gray-500">{connection.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-600">
                      {connection.influence}%
                    </div>
                    <div className="text-xs text-gray-500">influencia</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
            <Button className="w-full modern-interactive-button">
              <Users className="w-4 h-4 mr-2" />
              Ver Todas las Conexiones
            </Button>
          </CardContent>
        </Card>

        {/* Métricas de interacción */}
        <Card className="modern-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Métricas de Interacción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-surface rounded-lg">
                <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,247</div>
                <div className="text-xs text-gray-600">Mensajes Enviados</div>
              </div>
              <div className="text-center p-4 bg-gradient-surface rounded-lg">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">856</div>
                <div className="text-xs text-gray-600">Interacciones</div>
              </div>
              <div className="text-center p-4 bg-gradient-surface rounded-lg">
                <Share2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">342</div>
                <div className="text-xs text-gray-600">Compartidos</div>
              </div>
              <div className="text-center p-4 bg-gradient-surface rounded-lg">
                <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-xs text-gray-600">Rating Promedio</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasa de Respuesta</span>
                  <span className="font-semibold">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement Rate</span>
                  <span className="font-semibold">{metrics.engagement}%</span>
                </div>
                <Progress value={metrics.engagement} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Alcance de Red</span>
                  <span className="font-semibold">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </div>

            <Button className="w-full modern-interactive-button">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Análisis Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas personalizadas */}
      <Card className="modern-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Acciones Rápidas {user?.role === 'votante' ? 'Participativas' : 'Estratégicas'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {user?.role === 'votante' ? (
              <>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Participar</span>
                </Button>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <Share2 className="w-5 h-5" />
                  <span className="text-xs">Compartir</span>
                </Button>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs">Apoyar</span>
                </Button>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <Bell className="w-5 h-5" />
                  <span className="text-xs">Notificar</span>
                </Button>
              </>
            ) : (
              <>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Gestionar</span>
                </Button>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <Target className="w-5 h-5" />
                  <span className="text-xs">Estrategia</span>
                </Button>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-xs">Analizar</span>
                </Button>
                <Button className="modern-interactive-button flex-col h-20 gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs">Optimizar</span>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernUserInterface;
