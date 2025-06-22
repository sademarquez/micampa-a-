import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { developerAuthService, MasterDatabase } from '@/services/developerAuthService';
import { 
  MapPin, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw
} from 'lucide-react';

interface MasterCampaignMapProps {
  className?: string;
}

interface CampaignLocation {
  id: string;
  campaign_name: string;
  master_id: string;
  google_account: string;
  coordinates: [number, number]; // [longitude, latitude]
  status: 'active' | 'inactive' | 'error';
  metrics: {
    total_voters: number;
    active_territories: number;
    volunteers: number;
    events_scheduled: number;
    support_level: number;
  };
  last_update: string;
}

export const MasterCampaignMap: React.FC<MasterCampaignMapProps> = ({ className }) => {
  const [masterDatabases, setMasterDatabases] = useState<MasterDatabase[]>([]);
  const [campaignLocations, setCampaignLocations] = useState<CampaignLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapView, setMapView] = useState<'territories' | 'campaigns' | 'metrics'>('campaigns');
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Cargar datos de masters y generar ubicaciones de campañas
  const loadMasterData = async () => {
    try {
      setLoading(true);
      const databases = await developerAuthService.getMasterDatabases();
      setMasterDatabases(databases);

      // Generar ubicaciones simuladas para las campañas
      const locations: CampaignLocation[] = databases.map((db, index) => ({
        id: db.id,
        campaign_name: db.campaign_name,
        master_id: db.master_id,
        google_account: db.google_account,
        coordinates: [
          -74.0721 + (index * 0.01), // Longitud (Bogotá + offset)
          4.7110 + (index * 0.005)   // Latitud (Bogotá + offset)
        ],
        status: db.connection_status === 'connected' ? 'active' : 
                db.connection_status === 'error' ? 'error' : 'inactive',
        metrics: {
          total_voters: Math.floor(Math.random() * 50000) + 10000,
          active_territories: Math.floor(Math.random() * 100) + 20,
          volunteers: Math.floor(Math.random() * 500) + 50,
          events_scheduled: Math.floor(Math.random() * 20) + 5,
          support_level: Math.floor(Math.random() * 40) + 60
        },
        last_update: db.last_sync
      }));

      setCampaignLocations(locations);
    } catch (error) {
      console.error('Error loading master data:', error);
      toast({
        title: "❌ Error",
        description: "No se pudieron cargar los datos de las campañas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar campañas
  const filteredCampaigns = campaignLocations.filter(campaign => {
    const matchesFilter = selectedFilter === 'all' || campaign.status === selectedFilter;
    const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.master_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Obtener estadísticas
  const getStats = () => {
    const total = campaignLocations.length;
    const active = campaignLocations.filter(c => c.status === 'active').length;
    const inactive = campaignLocations.filter(c => c.status === 'inactive').length;
    const error = campaignLocations.filter(c => c.status === 'error').length;
    const totalVoters = campaignLocations.reduce((sum, c) => sum + c.metrics.total_voters, 0);
    const totalTerritories = campaignLocations.reduce((sum, c) => sum + c.metrics.active_territories, 0);

    return { total, active, inactive, error, totalVoters, totalTerritories };
  };

  // Renderizar marcadores del mapa
  const renderMapMarkers = () => {
    return filteredCampaigns.map((campaign) => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'active': return 'bg-green-500';
          case 'inactive': return 'bg-gray-500';
          case 'error': return 'bg-red-500';
          default: return 'bg-gray-500';
        }
      };

      const getStatusIcon = (status: string) => {
        switch (status) {
          case 'active': return <CheckCircle className="h-3 w-3" />;
          case 'inactive': return <XCircle className="h-3 w-3" />;
          case 'error': return <AlertTriangle className="h-3 w-3" />;
          default: return <XCircle className="h-3 w-3" />;
        }
      };

      return (
        <div
          key={campaign.id}
          className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group`}
          style={{
            left: `${((campaign.coordinates[0] + 74.1) * 1000)}%`,
            top: `${((campaign.coordinates[1] - 4.7) * 1000)}%`
          }}
        >
          {/* Marcador del mapa */}
          <div className={`w-4 h-4 rounded-full ${getStatusColor(campaign.status)} border-2 border-white shadow-lg flex items-center justify-center text-white`}>
            {getStatusIcon(campaign.status)}
          </div>
          
          {/* Tooltip con información */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-sm">{campaign.campaign_name}</h4>
                <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </Badge>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div><span className="font-medium">Master ID:</span> {campaign.master_id}</div>
                <div><span className="font-medium">Cuenta:</span> {campaign.google_account}</div>
                <div><span className="font-medium">Votantes:</span> {campaign.metrics.total_voters.toLocaleString()}</div>
                <div><span className="font-medium">Territorios:</span> {campaign.metrics.active_territories}</div>
                <div><span className="font-medium">Voluntarios:</span> {campaign.metrics.volunteers}</div>
                <div><span className="font-medium">Apoyo:</span> {campaign.metrics.support_level}%</div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  const stats = getStats();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Campañas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Inactivas</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Con Errores</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Votantes</p>
                <p className="text-2xl font-bold text-purple-600">{(stats.totalVoters / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Territorios</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalTerritories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles del mapa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa Maestro de Campañas Agora
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMasterData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Campañas</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre de campaña o ID de master..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="filter">Filtrar por Estado</Label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Campañas</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                  <SelectItem value="error">Con Errores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="view">Vista del Mapa</Label>
              <Select value={mapView} onValueChange={(value: any) => setMapView(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campaigns">Campañas</SelectItem>
                  <SelectItem value="territories">Territorios</SelectItem>
                  <SelectItem value="metrics">Métricas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mapa */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            {/* Controles de zoom */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Leyenda */}
            <div className="absolute bottom-4 left-4 z-10 bg-white border border-gray-200 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">Leyenda</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Activa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Inactiva</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Error</span>
                </div>
              </div>
            </div>

            {/* Mapa base (simulado) */}
            <div 
              ref={mapRef}
              className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                  linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%)
                `
              }}
            >
              {/* Líneas de coordenadas simuladas */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-gray-300"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-gray-300"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
              </div>

              {/* Marcadores de campañas */}
              {renderMapMarkers()}
            </div>
          </div>

          {/* Lista de campañas */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Campañas Registradas ({filteredCampaigns.length})</h3>
            <div className="grid gap-4">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          campaign.status === 'active' ? 'bg-green-500' :
                          campaign.status === 'inactive' ? 'bg-gray-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{campaign.campaign_name}</h4>
                          <p className="text-sm text-gray-600">ID: {campaign.master_id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{campaign.metrics.total_voters.toLocaleString()}</p>
                          <p className="text-gray-600">Votantes</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{campaign.metrics.active_territories}</p>
                          <p className="text-gray-600">Territorios</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{campaign.metrics.support_level}%</p>
                          <p className="text-gray-600">Apoyo</p>
                        </div>
                        <Badge className={
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 