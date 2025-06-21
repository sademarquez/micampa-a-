import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataSegregation } from "@/hooks/useDataSegregation";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  MessageSquare,
  Target,
  TrendingUp,
  Activity
} from "lucide-react";

const MasterDashboard = () => {
  const { user } = useSecureAuth();
  const { canViewAllData } = useDataSegregation();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Query para estadísticas generales
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', selectedPeriod],
    queryFn: async () => {
      if (!supabase) return null;

      const [
        territoriesResult,
        votersResult,
        alertsResult,
        eventsResult,
        messagesResult,
        profilesResult
      ] = await Promise.all([
        supabase.from('territories').select('*'),
        supabase.from('voters').select('*'),
        supabase.from('alerts').select('*').eq('status', 'active'),
        supabase.from('events').select('*').gte('start_date', new Date().toISOString()),
        supabase.from('messages').select('*').eq('status', 'sent'),
        supabase.from('profiles').select('*')
      ]);

      return {
        territories: territoriesResult.data?.length || 0,
        voters: votersResult.data?.length || 0,
        activeAlerts: alertsResult.data?.length || 0,
        upcomingEvents: eventsResult.data?.length || 0,
        messagesSent: messagesResult.data?.length || 0,
        totalUsers: profilesResult.data?.length || 0,
        candidatos: profilesResult.data?.filter(p => p.role === 'candidato').length || 0,
        votantes: profilesResult.data?.filter(p => p.role === 'votante').length || 0
      };
    },
    enabled: !!supabase && !!user
  });

  // Query para alertas recientes
  const { data: recentAlerts } = useQuery({
    queryKey: ['recent-alerts'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data } = await supabase
        .from('alerts')
        .select('*, territories(name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!supabase
  });

  // Query para eventos próximos
  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data } = await supabase
        .from('events')
        .select('*, territories(name)')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);
      return data || [];
    },
    enabled: !!supabase
  });

  if (!canViewAllData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-600">Acceso Restringido</h2>
        <p className="text-gray-500">Solo usuarios Master pueden acceder al dashboard completo.</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Master</h1>
          <p className="text-gray-600">Control total de la campaña</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === '24h' ? 'default' : 'outline'} 
            onClick={() => setSelectedPeriod('24h')}
            size="sm"
          >
            24h
          </Button>
          <Button 
            variant={selectedPeriod === '7d' ? 'default' : 'outline'} 
            onClick={() => setSelectedPeriod('7d')}
            size="sm"
          >
            7d
          </Button>
          <Button 
            variant={selectedPeriod === '30d' ? 'default' : 'outline'} 
            onClick={() => setSelectedPeriod('30d')}
            size="sm"
          >
            30d
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Votantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.voters || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeAlerts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Territorios</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.territories || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de usuarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Distribución de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Masters</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Candidatos</span>
                <Badge variant="outline">{stats?.candidatos || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Votantes</span>
                <Badge variant="outline">{stats?.votantes || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts?.map((alert: any) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs text-gray-500">{alert.territories?.name || 'Sin territorio'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {alert.type}
                    </Badge>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500 text-center py-4">No hay alertas activas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eventos próximos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Eventos Próximos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents?.map((event: any) => (
              <div key={event.id} className="border rounded-lg p-4">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{event.territories?.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(event.start_date).toLocaleDateString()}
                  </span>
                  <Badge variant="outline">{event.status}</Badge>
                </div>
              </div>
            )) || (
              <p className="text-sm text-gray-500 col-span-full text-center py-4">
                No hay eventos programados
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Actividad de Mensajería
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats?.messagesSent || 0}</p>
              <p className="text-sm text-gray-600">Mensajes enviados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Eventos Programados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats?.upcomingEvents || 0}</p>
              <p className="text-sm text-gray-600">Eventos próximos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MasterDashboard;
