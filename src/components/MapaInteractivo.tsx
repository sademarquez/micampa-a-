
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertTriangle, Users, Calendar, RefreshCw, Vote, Crosshair, ZoomIn, ZoomOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";

interface MapaAlert {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  territory_id: string;
  territories?: {
    name: string;
    type: string;
  };
  created_at: string;
}

interface Territory {
  id: string;
  name: string;
  type: string;
  population_estimate: number;
  voter_estimate: number;
  coordinates?: any;
}

interface VotingTable {
  id: string;
  table_number: string;
  voting_place: string;
  address: string;
  territories?: {
    name: string;
  };
}

const MapaInteractivo = () => {
  const { user } = useAuth();
  const { getTerritoryFilter, getAlertFilter, canViewVotingTables } = useDataSegregation();
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [mapView, setMapView] = useState<'territories' | 'alerts' | 'voting'>('territories');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });

  // Query para territorios
  const { data: territories = [], isLoading: loadingTerritories, refetch: refetchTerritories } = useQuery({
    queryKey: ['map-territories', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      console.log('🗺️ Obteniendo territorios para mapa:', user.role);
      
      try {
        let query = supabase
          .from('territories')
          .select('*')
          .order('name');

        const { data, error } = await query;
        if (error) {
          console.error('❌ Error obteniendo territorios:', error);
          return [];
        }
        
        console.log('✅ Territorios cargados:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('❌ Error en query territorios:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user
  });

  // Query para alertas
  const { data: alerts = [], isLoading: loadingAlerts, refetch: refetchAlerts } = useQuery({
    queryKey: ['map-alerts', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      console.log('🚨 Obteniendo alertas para mapa:', user.role);
      
      try {
        let query = supabase
          .from('alerts')
          .select(`
            *,
            territories(name, type)
          `)
          .order('priority', { ascending: false });

        const { data, error } = await query;
        if (error) {
          console.error('❌ Error obteniendo alertas:', error);
          return [];
        }
        
        console.log('✅ Alertas cargadas:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('❌ Error en query alertas:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user
  });

  // Query para mesas de votación
  const { data: votingTables = [], isLoading: loadingVoting, refetch: refetchVoting } = useQuery({
    queryKey: ['map-voting-tables', user?.id],
    queryFn: async () => {
      if (!supabase || !user || !canViewVotingTables) return [];
      
      console.log('🗳️ Obteniendo mesas de votación para mapa:', user.role);
      
      try {
        const { data, error } = await supabase
          .from('voting_tables')
          .select(`
            *,
            territories(name)
          `)
          .eq('active', true)
          .order('voting_place');

        if (error) {
          console.error('❌ Error obteniendo mesas:', error);
          return [];
        }
        
        console.log('✅ Mesas cargadas:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('❌ Error en query mesas:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user && canViewVotingTables
  });

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTerritoryColor = (type: string) => {
    switch (type) {
      case 'departamento': return 'bg-blue-600';
      case 'municipio': return 'bg-green-600';
      case 'corregimiento': return 'bg-purple-600';
      case 'vereda': return 'bg-yellow-600';
      case 'barrio': return 'bg-red-600';
      case 'sector': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const handleRefresh = () => {
    refetchTerritories();
    refetchAlerts();
    refetchVoting();
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetMapPosition = () => {
    setMapCenter({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  return (
    <div className="space-y-6">
      {/* Controls mejorados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa Interactivo de Campaña
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={mapView === 'territories' ? 'default' : 'outline'}
                onClick={() => setMapView('territories')}
                size="sm"
                className="text-xs"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Territorios
              </Button>
              <Button
                variant={mapView === 'alerts' ? 'default' : 'outline'}
                onClick={() => setMapView('alerts')}
                size="sm"
                className="text-xs"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Alertas
              </Button>
              {canViewVotingTables && (
                <Button
                  variant={mapView === 'voting' ? 'default' : 'outline'}
                  onClick={() => setMapView('voting')}
                  size="sm"
                  className="text-xs"
                >
                  <Vote className="w-4 h-4 mr-1" />
                  Mesas
                </Button>
              )}
              <Button variant="outline" onClick={handleRefresh} size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel de información mejorado */}
        <div className="space-y-4">
          {/* Estadísticas rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Mapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Territorios:</span>
                <Badge variant="outline">{territories.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Alertas:</span>
                <Badge variant="destructive">{alerts.length}</Badge>
              </div>
              {canViewVotingTables && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mesas:</span>
                  <Badge variant="secondary">{votingTables.length}</Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Población:</span>
                <Badge variant="outline">
                  {territories.reduce((sum, t) => sum + (t.population_estimate || 0), 0).toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Controles de zoom */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Controles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={resetMapPosition}>
                  <Crosshair className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                Zoom: {Math.round(zoomLevel * 100)}%
              </div>
            </CardContent>
          </Card>

          {/* Lista contextual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {mapView === 'territories' ? 'Territorios' : 
                 mapView === 'alerts' ? 'Alertas Activas' : 'Mesas de Votación'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {mapView === 'territories' ? (
                  loadingTerritories ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Cargando territorios...
                    </div>
                  ) : territories.length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No hay territorios disponibles
                    </div>
                  ) : (
                    territories.map((territory) => (
                      <div
                        key={territory.id}
                        className={`p-2 border rounded cursor-pointer transition-colors hover:bg-gray-50 text-xs ${
                          selectedTerritory?.id === territory.id ? 'bg-blue-50 border-blue-300' : ''
                        }`}
                        onClick={() => setSelectedTerritory(territory)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{territory.name}</h4>
                            <p className="text-gray-500 capitalize">{territory.type}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getTerritoryColor(territory.type)}`} />
                        </div>
                        {territory.population_estimate && (
                          <div className="mt-1 text-gray-500">
                            👥 {territory.population_estimate.toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))
                  )
                ) : mapView === 'alerts' ? (
                  loadingAlerts ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Cargando alertas...
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No hay alertas activas
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className="p-2 border rounded text-xs">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getAlertColor(alert.priority)}`} />
                        </div>
                        <p className="text-gray-600 mb-1">{alert.description}</p>
                        <div className="flex items-center justify-between text-gray-500">
                          <span className="capitalize">{alert.type}</span>
                          {alert.territories && (
                            <span>{alert.territories.name}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  // Mesas de votación
                  loadingVoting ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Cargando mesas...
                    </div>
                  ) : votingTables.length === 0 ? (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No hay mesas registradas
                    </div>
                  ) : (
                    votingTables.map((table) => (
                      <div key={table.id} className="p-2 border rounded text-xs">
                        <h4 className="font-medium">{table.table_number}</h4>
                        <p className="text-gray-600">{table.voting_place}</p>
                        {table.territories && (
                          <p className="text-gray-500">{table.territories.name}</p>
                        )}
                      </div>
                    ))
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área del mapa mejorada */}
        <div className="lg:col-span-3">
          <Card className="h-[700px]">
            <CardContent className="p-0 h-full relative">
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{
                  transform: `scale(${zoomLevel}) translate(${mapCenter.x}px, ${mapCenter.y}px)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Simulación de mapa con elementos interactivos mejorados */}
                <div className="absolute inset-0 p-6">
                  {mapView === 'territories' ? (
                    <div className="grid grid-cols-4 gap-3 h-full">
                      {territories.slice(0, 16).map((territory, index) => (
                        <div
                          key={territory.id}
                          className={`rounded-lg border-2 p-3 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                            selectedTerritory?.id === territory.id 
                              ? 'border-blue-500 bg-blue-100 shadow-lg' 
                              : 'border-gray-300 bg-white'
                          }`}
                          style={{
                            backgroundColor: selectedTerritory?.id === territory.id 
                              ? undefined 
                              : `${getTerritoryColor(territory.type)}15`
                          }}
                          onClick={() => setSelectedTerritory(territory)}
                        >
                          <div className="text-center">
                            <div className={`w-4 h-4 mx-auto mb-1 rounded-full ${getTerritoryColor(territory.type)}`} />
                            <h3 className="font-medium text-xs">{territory.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{territory.type}</p>
                            {territory.population_estimate && (
                              <p className="text-xs mt-1">
                                {territory.population_estimate.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : mapView === 'alerts' ? (
                    <div className="grid grid-cols-3 gap-3 h-full">
                      {alerts.slice(0, 12).map((alert, index) => (
                        <div
                          key={alert.id}
                          className="rounded-lg border-2 border-gray-300 bg-white p-3 hover:shadow-lg transition-shadow"
                        >
                          <div className="text-center">
                            <div className={`w-4 h-4 mx-auto mb-1 rounded-full ${getAlertColor(alert.priority)} animate-pulse`} />
                            <h3 className="font-medium text-xs">{alert.title}</h3>
                            <p className="text-xs text-gray-500 capitalize">{alert.type}</p>
                            {alert.territories && (
                              <p className="text-xs mt-1">{alert.territories.name}</p>
                            )}
                            <Badge className="mt-1 text-xs scale-75" variant="outline">
                              {alert.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Mesas de votación
                    <div className="grid grid-cols-3 gap-3 h-full">
                      {votingTables.slice(0, 12).map((table, index) => (
                        <div
                          key={table.id}
                          className="rounded-lg border-2 border-gray-300 bg-white p-3 hover:shadow-lg transition-shadow"
                        >
                          <div className="text-center">
                            <div className="w-4 h-4 mx-auto mb-1 rounded-full bg-purple-600" />
                            <h3 className="font-medium text-xs">{table.table_number}</h3>
                            <p className="text-xs text-gray-500">{table.voting_place}</p>
                            {table.territories && (
                              <p className="text-xs mt-1">{table.territories.name}</p>
                            )}
                            <Badge className="mt-1 text-xs scale-75" variant="secondary">
                              Activa
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información flotante del elemento seleccionado */}
                {selectedTerritory && mapView === 'territories' && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-xl border">
                    <h3 className="font-semibold text-lg">{selectedTerritory.name}</h3>
                    <p className="text-sm text-gray-600 capitalize mb-2">{selectedTerritory.type}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedTerritory.population_estimate && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>{selectedTerritory.population_estimate.toLocaleString()} habitantes</span>
                        </div>
                      )}
                      {selectedTerritory.voter_estimate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>{selectedTerritory.voter_estimate.toLocaleString()} votantes</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Overlay de carga */}
                {(loadingTerritories || loadingAlerts || loadingVoting) && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-600">Cargando datos del mapa...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapaInteractivo;
