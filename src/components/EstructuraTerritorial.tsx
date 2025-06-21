
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Search,
  Building2,
  Crown,
  Star,
  Navigation,
  UserCheck,
  MessageSquare,
  Zap,
  TrendingUp
} from "lucide-react";

interface EstructuraTerritorialProps {
  busqueda: string;
  filtro: string;
}

interface Profile {
  id: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';
  created_at: string;
}

interface RealTimeStats {
  totalProfiles: number;
  candidatos: number;
  lideres: number;
  votantes: number;
  territorios: number;
  mensajesHoy: number;
  alertasActivas: number;
  eventosProximos: number;
}

const EstructuraTerritorial: React.FC<EstructuraTerritorialProps> = ({ busqueda, filtro }) => {
  const { user } = useAuth();
  const { getPermissions } = useDataSegregation();
  const { toast } = useToast();
  const permissions = getPermissions();

  // Query para estadísticas en tiempo real
  const { data: realTimeStats, isLoading: statsLoading } = useQuery({
    queryKey: ['real-time-stats', user?.id],
    queryFn: async (): Promise<RealTimeStats> => {
      if (!user) return {
        totalProfiles: 0, candidatos: 0, lideres: 0, votantes: 0,
        territorios: 0, mensajesHoy: 0, alertasActivas: 0, eventosProximos: 0
      };

      console.log('🔍 Obteniendo estadísticas en tiempo real...');

      // Obtener conteos reales de la base de datos
      const [
        { count: totalProfiles },
        { count: candidatos },
        { count: lideres },
        { count: votantes },
        { count: territorios },
        { count: mensajesHoy },
        { count: alertasActivas },
        { count: eventosProximos }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'candidato'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'lider'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'votante'),
        supabase.from('territories').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('events').select('*', { count: 'exact', head: true }).gte('start_date', new Date().toISOString())
      ]);

      return {
        totalProfiles: totalProfiles || 0,
        candidatos: candidatos || 0,
        lideres: lideres || 0,
        votantes: votantes || 0,
        territorios: territorios || 0,
        mensajesHoy: mensajesHoy || 0,
        alertasActivas: alertasActivas || 0,
        eventosProximos: eventosProximos || 0
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Actualizar cada 30 segundos
    refetchOnWindowFocus: true,
  });

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['team-structure', user?.id],
    queryFn: async (): Promise<Profile[]> => {
      if (!user) return [];

      console.log('🔍 Consultando estructura del equipo...');
      
      let query = supabase
        .from('profiles')
        .select('id, name, role, created_at');

      // Aplicar filtros según el rol del usuario
      if (user.role === 'lider') {
        query = query.eq('role', 'votante');
      } else if (user.role === 'candidato') {
        query = query.in('role', ['lider', 'votante']);
      } else if (user.role === 'master') {
        query = query.in('role', ['candidato', 'lider', 'votante']);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error consultando perfiles:', error);
        throw error;
      }

      console.log('✅ Perfiles obtenidos:', data?.length || 0);
      return data || [];
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  // Función para activar N8N workflows
  const triggerN8NWorkflow = async (workflowType: string) => {
    try {
      const { data: workflows } = await supabase
        .from('n8n_workflows')
        .select('*')
        .contains('trigger_role', [user?.role])
        .eq('active', true);

      for (const workflow of workflows || []) {
        if (workflow.webhook_url) {
          await fetch(workflow.webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trigger_type: workflowType,
              user_id: user?.id,
              user_role: user?.role,
              user_name: user?.name,
              timestamp: new Date().toISOString(),
              stats: realTimeStats
            })
          });
        }
      }

      toast({
        title: "Workflow N8N Activado",
        description: `Se han sincronizado los datos con el ecosistema N8N`,
      });
    } catch (error) {
      console.error('Error activando N8N:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'desarrollador': return Star;
      case 'master': return Crown;
      case 'candidato': return Building2;
      case 'lider': return Users;
      case 'votante': return UserCheck;
      default: return Navigation;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'master': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'candidato': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'lider': return 'bg-green-100 text-green-800 border-green-300';
      case 'votante': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Filtrar perfiles según búsqueda y filtro
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !busqueda || 
      profile.name?.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchesFilter = filtro === 'todos' || 
      (filtro === 'lideres' && profile.role === 'lider') ||
      (filtro === 'ayudantes' && profile.role === 'votante');
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading || statsLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando datos en tiempo real...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <Building2 className="w-12 h-12 mx-auto mb-2" />
            <p>Error cargando la estructura</p>
            <p className="text-sm text-gray-500 mt-2">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = realTimeStats || {
    totalProfiles: 0, candidatos: 0, lideres: 0, votantes: 0,
    territorios: 0, mensajesHoy: 0, alertasActivas: 0, eventosProximos: 0
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas en Tiempo Real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-l-4 border-l-slate-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-700 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {stats.totalProfiles}
            </div>
            <div className="text-sm text-slate-600">Total Equipo</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-green-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-700">
              {stats.lideres}
            </div>
            <div className="text-sm text-green-600">Líderes Activos</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-blue-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-700">
              {stats.candidatos}
            </div>
            <div className="text-sm text-blue-600">Candidatos</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-gray-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-700">
              {stats.votantes}
            </div>
            <div className="text-sm text-gray-600">Votantes</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Operacionales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-l-4 border-l-orange-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-700">
              {stats.territorios}
            </div>
            <div className="text-sm text-orange-600">Territorios</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-purple-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-700">
              {stats.mensajesHoy}
            </div>
            <div className="text-sm text-purple-600">Mensajes Hoy</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-red-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-700">
              {stats.alertasActivas}
            </div>
            <div className="text-sm text-red-600">Alertas Activas</div>
          </CardContent>
        </Card>
        <Card className="text-center border-l-4 border-l-indigo-600">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-700">
              {stats.eventosProximos}
            </div>
            <div className="text-sm text-indigo-600">Eventos Próximos</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles N8N del Ecosistema */}
      {(user?.role === 'master' || user?.role === 'desarrollador') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Control del Ecosistema N8N
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => triggerN8NWorkflow('sync_stats')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Sincronizar Stats
              </Button>
              <Button 
                onClick={() => triggerN8NWorkflow('mass_messaging')}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Mensajería Masiva
              </Button>
              <Button 
                onClick={() => triggerN8NWorkflow('voter_engagement')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Engagement Votantes
              </Button>
              <Button 
                onClick={() => triggerN8NWorkflow('campaign_analytics')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Analytics Campaña
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de miembros con datos reales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Miembros del Equipo ({filteredProfiles.length})
            <Badge variant="outline" className="ml-2">
              Tiempo Real
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron miembros</p>
              {busqueda && (
                <p className="text-sm mt-2">
                  Intenta con una búsqueda diferente
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map((profile) => {
                const RoleIcon = getRoleIcon(profile.role);
                return (
                  <Card key={profile.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <RoleIcon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">
                            {profile.name || 'Sin nombre'}
                          </h3>
                          <Badge className={getRoleColor(profile.role)}>
                            {profile.role}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Activo desde {new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => triggerN8NWorkflow(`contact_${profile.role}`)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Contactar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => triggerN8NWorkflow(`message_${profile.role}`)}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Mensaje
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EstructuraTerritorial;
