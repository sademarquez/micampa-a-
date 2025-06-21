
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Clock,
  Target,
  Zap,
  Globe,
  Eye
} from 'lucide-react';

interface VisitorMetrics {
  totalVisitors: number;
  activeVisitors: number;
  leadsGenerated: number;
  conversionRate: number;
  topRegions: string[];
  averageEngagement: number;
}

const VisitorSession = () => {
  const [metrics, setMetrics] = useState<VisitorMetrics>({
    totalVisitors: 0,
    activeVisitors: 0,
    leadsGenerated: 0,
    conversionRate: 0,
    topRegions: [],
    averageEngagement: 0
  });

  const [realtimeData, setRealtimeData] = useState({
    currentVisitors: 0,
    newLeads: 0,
    hotRegions: [] as string[]
  });

  // Simulación de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 5),
        activeVisitors: Math.floor(Math.random() * 150) + 50,
        leadsGenerated: prev.leadsGenerated + Math.floor(Math.random() * 3),
        conversionRate: Math.random() * 15 + 10,
        topRegions: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
        averageEngagement: Math.random() * 30 + 60
      }));

      setRealtimeData({
        currentVisitors: Math.floor(Math.random() * 25) + 15,
        newLeads: Math.floor(Math.random() * 8),
        hotRegions: ['Bogotá Norte', 'Medellín Centro', 'Cali Sur']
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header de Métricas */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Globe className="w-8 h-8" />
            Sistema de Captura de Leads en Tiempo Real
            <Badge className="bg-white/20 text-white ml-auto">
              <Zap className="w-4 h-4 mr-1" />
              Colombia Electoral
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{metrics.totalVisitors.toLocaleString()}</div>
              <div className="text-sm opacity-80">Visitantes Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">{realtimeData.currentVisitors}</div>
              <div className="text-sm opacity-80">Activos Ahora</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">{metrics.leadsGenerated}</div>
              <div className="text-sm opacity-80">Leads Generados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-300">{metrics.conversionRate.toFixed(1)}%</div>
              <div className="text-sm opacity-80">Conversión</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard de Actividad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Visitantes en Tiempo Real */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Eye className="w-5 h-5" />
              Actividad en Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Visitantes activos:</span>
                <Badge className="bg-green-600 text-white animate-pulse">
                  {realtimeData.currentVisitors}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Nuevos leads (última hora):</span>
                <Badge className="bg-yellow-600 text-white">
                  +{realtimeData.newLeads}
                </Badge>
              </div>
              <div className="text-xs text-green-600">
                🔥 Regiones más activas:
                {realtimeData.hotRegions.map((region, index) => (
                  <Badge key={index} variant="outline" className="ml-1 text-xs">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Score */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <TrendingUp className="w-5 h-5" />
              Engagement Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-900 mb-2">
                {metrics.averageEngagement.toFixed(0)}%
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.averageEngagement}%` }}
                ></div>
              </div>
              <div className="text-sm text-purple-700">
                Nivel de interacción ciudadana
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Regiones */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MapPin className="w-5 h-5" />
              Regiones Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.topRegions.slice(0, 5).map((region, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm font-medium text-blue-900">
                    {index + 1}. {region}
                  </span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {Math.floor(Math.random() * 500) + 100} visits
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de Control de Leads */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Target className="w-6 h-6" />
            Control de Leads Electorales
            <Badge className="bg-orange-100 text-orange-800 ml-auto">
              🤖 IA Activa
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-orange-900 mb-3">📊 Métricas de Captura</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-700">Leads Calificados:</span>
                  <span className="font-bold text-orange-900">{Math.floor(metrics.leadsGenerated * 0.7)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Intención de Voto:</span>
                  <span className="font-bold text-orange-900">{Math.floor(metrics.leadsGenerated * 0.4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Solicitudes de Contacto:</span>
                  <span className="font-bold text-orange-900">{Math.floor(metrics.leadsGenerated * 0.3)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-900 mb-3">⚡ Acciones Automáticas</h4>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Activar Seguimiento WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Segmentar por Región
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Programar Contactos
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/60 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-700">
              <strong>🎯 Sistema Electoral Colombia:</strong> Captura automática de leads, 
              análisis de intención de voto, y seguimiento personalizado por región. 
              Todos los datos cumplen con la normativa electoral colombiana.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorSession;
