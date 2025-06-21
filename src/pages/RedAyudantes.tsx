
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search,
  Building2,
  Crown,
  Star,
  Navigation,
  Network,
  TreePine,
  TrendingUp,
  Zap,
  BarChart3
} from "lucide-react";
import EstructuraTerritorial from "@/components/EstructuraTerritorial";
import SistemaMensajeria from "@/components/SistemaMensajeria";
import MapaEstructura from "@/components/MapaEstructura";
import MassMessagingSystem from "@/components/MassMessagingSystem";
import SellerChatReport from "@/components/SellerChatReport";

interface RealTimeStats {
  totalAyudantes: number;
  municipios: number;
  veredas: number;
  barrios: number;
  lideresActivos: number;
  mensajesHoy: number;
}

const RedAyudantes = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  // Query para estadísticas en tiempo real
  const { data: realTimeStats, isLoading: statsLoading } = useQuery({
    queryKey: ['red-ayudantes-stats'],
    queryFn: async (): Promise<RealTimeStats> => {
      console.log('🔍 Obteniendo estadísticas en tiempo real de Red de Ayudantes...');

      // Obtener conteos reales de la base de datos
      const [
        { count: totalProfiles },
        { count: territoriosBarrios },
        { count: territoriosVeredas },
        { count: territoriosMunicipios },
        { count: lideres },
        { count: mensajesHoy }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('territories').select('*', { count: 'exact', head: true }).eq('type', 'barrio'),
        supabase.from('territories').select('*', { count: 'exact', head: true }).eq('type', 'vereda'),
        supabase.from('territories').select('*', { count: 'exact', head: true }).eq('type', 'municipio'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'lider'),
        supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0])
      ]);

      return {
        totalAyudantes: totalProfiles || 0,
        municipios: territoriosMunicipios || 0,
        veredas: territoriosVeredas || 0,
        barrios: territoriosBarrios || 0,
        lideresActivos: lideres || 0,
        mensajesHoy: mensajesHoy || 0
      };
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
    refetchOnWindowFocus: true,
  });

  const stats = realTimeStats || {
    totalAyudantes: 0,
    municipios: 0,
    veredas: 0,
    barrios: 0,
    lideresActivos: 0,
    mensajesHoy: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Network className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Red de Ayudantes
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Sistema integral de comunicación y organización territorial para la campaña
          </p>
          {!statsLoading && (
            <Badge variant="outline" className="mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              Datos en tiempo real
            </Badge>
          )}
        </div>

        {/* Estadísticas Reales en Tiempo Real */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="text-center border-l-4 border-l-slate-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-slate-700 flex items-center justify-center gap-1">
                {statsLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                ) : (
                  <><TrendingUp className="w-5 h-5" />{stats.totalAyudantes}</>
                )}
              </div>
              <div className="text-xs text-slate-600">Ayudantes</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-blue-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-blue-700">{stats.municipios}</div>
              <div className="text-xs text-blue-600">Municipios</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-green-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-700">{stats.veredas}</div>
              <div className="text-xs text-green-600">Veredas</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-orange-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-orange-700">{stats.barrios}</div>
              <div className="text-xs text-orange-600">Barrios</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-purple-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-purple-700">{stats.lideresActivos}</div>
              <div className="text-xs text-purple-600">Líderes</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-red-600">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-red-700">{stats.mensajesHoy}</div>
              <div className="text-xs text-red-600">Mensajes Hoy</div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar ayudante, líder o ubicación..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filtroTipo === "todos" ? "default" : "outline"}
                  onClick={() => setFiltroTipo("todos")}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Todos
                </Button>
                <Button
                  variant={filtroTipo === "lideres" ? "default" : "outline"}
                  onClick={() => setFiltroTipo("lideres")}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Líderes
                </Button>
                <Button
                  variant={filtroTipo === "ayudantes" ? "default" : "outline"}
                  onClick={() => setFiltroTipo("ayudantes")}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Ayudantes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Principal */}
        <Tabs defaultValue="estructura" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="estructura" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden md:inline">Estructura</span>
            </TabsTrigger>
            <TabsTrigger value="mensajeria" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="masiva" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden md:inline">Masiva</span>
            </TabsTrigger>
            <TabsTrigger value="mapa" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="sellerchat" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">SellerChat</span>
            </TabsTrigger>
            <TabsTrigger value="herramientas" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="hidden md:inline">Tools</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estructura" className="space-y-6">
            <EstructuraTerritorial busqueda={busqueda} filtro={filtroTipo} />
          </TabsContent>

          <TabsContent value="mensajeria" className="space-y-6">
            <SistemaMensajeria />
          </TabsContent>

          <TabsContent value="masiva" className="space-y-6">
            <MassMessagingSystem />
          </TabsContent>

          <TabsContent value="mapa" className="space-y-6">
            <MapaEstructura />
          </TabsContent>

          <TabsContent value="sellerchat" className="space-y-6">
            <SellerChatReport />
          </TabsContent>

          <TabsContent value="herramientas" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-5 h-5" />
                    Comunicación Directa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Herramientas para comunicación instantánea con líderes y ayudantes
                  </p>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700">
                    Iniciar Llamada Grupal
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-5 h-5" />
                    Boletines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Envía actualizaciones masivas por territorio
                  </p>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700">
                    Crear Boletín
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Navigation className="w-5 h-5" />
                    Coordinación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Coordina actividades y eventos por zona
                  </p>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700">
                    Programar Evento
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Zap className="w-5 h-5" />
                    Automatización N8N
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Activa workflows automatizados para el ecosistema
                  </p>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Gestionar Workflows
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <BarChart3 className="w-5 h-5" />
                    Analytics Avanzado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Métricas en tiempo real y análisis predictivo
                  </p>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Ver Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Network className="w-5 h-5" />
                    Integración SellerChat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Chatbots inteligentes con IA para engagement masivo
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Configurar Bot
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RedAyudantes;
