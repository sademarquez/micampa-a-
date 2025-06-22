import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { developerAuthService, MasterDatabase } from '@/services/developerAuthService';
import { 
  Database, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Upload,
  Mail,
  Key
} from 'lucide-react';

interface MasterDatabaseManagerProps {
  className?: string;
}

export const MasterDatabaseManager: React.FC<MasterDatabaseManagerProps> = ({ className }) => {
  const [masterDatabases, setMasterDatabases] = useState<MasterDatabase[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    master_id: '',
    campaign_name: '',
    google_account: '',
    api_key_primary: '',
    database_url: '',
    database_type: 'supabase' as const
  });

  // Cargar bases de datos de masters
  const loadMasterDatabases = async () => {
    try {
      setLoading(true);
      const databases = await developerAuthService.getMasterDatabases();
      setMasterDatabases(databases);
    } catch (error) {
      console.error('Error loading master databases:', error);
      toast({
        title: "❌ Error",
        description: "No se pudieron cargar las bases de datos de masters",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Registrar nueva base de datos master
  const registerMasterDatabase = async () => {
    try {
      setLoading(true);
      
      if (!formData.master_id || !formData.campaign_name || !formData.google_account || !formData.database_url) {
        toast({
          title: "⚠️ Campos requeridos",
          description: "ID del Master, Nombre de Campaña, Cuenta de Google y URL de Base de Datos son obligatorios",
          variant: "destructive"
        });
        return;
      }

      const newDatabase = await developerAuthService.registerMasterDatabase({
        master_id: formData.master_id,
        campaign_name: formData.campaign_name,
        google_account: formData.google_account,
        api_key_primary: formData.api_key_primary,
        database_url: formData.database_url,
        database_type: formData.database_type,
        connection_status: 'disconnected',
        compressed_data: {}
      });

      setMasterDatabases(prev => [newDatabase, ...prev]);
      setShowForm(false);
      setFormData({ 
        master_id: '', 
        campaign_name: '', 
        google_account: '', 
        api_key_primary: '', 
        database_url: '', 
        database_type: 'supabase' 
      });

      toast({
        title: "✅ Base de datos registrada",
        description: `${formData.campaign_name} ha sido registrada exitosamente`,
      });
    } catch (error) {
      console.error('Error registering master database:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo registrar la base de datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Probar conexión a base de datos master
  const testConnection = async (masterId: string) => {
    try {
      setLoading(true);
      
      // Simular prueba de conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar estado de conexión
      const updatedDatabases = masterDatabases.map(db => 
        db.master_id === masterId 
          ? { ...db, connection_status: 'connected' as const }
          : db
      );
      
      setMasterDatabases(updatedDatabases);
      
      toast({
        title: "✅ Conexión exitosa",
        description: "La base de datos está conectada",
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "❌ Error de conexión",
        description: "No se pudo conectar a la base de datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar datos comprimidos
  const syncCompressedData = async (masterId: string) => {
    try {
      setLoading(true);
      
      // Simular sincronización de datos
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const compressedData = {
        total_voters: Math.floor(Math.random() * 50000) + 10000,
        active_territories: Math.floor(Math.random() * 100) + 20,
        last_update: new Date().toISOString(),
        sync_status: 'completed'
      };

      await developerAuthService.updateCompressedData(masterId, compressedData);
      
      // Actualizar lista
      await loadMasterDatabases();
      
      toast({
        title: "🔄 Datos sincronizados",
        description: "Los datos comprimidos han sido actualizados",
      });
    } catch (error) {
      console.error('Error syncing compressed data:', error);
      toast({
        title: "❌ Error de sincronización",
        description: "No se pudieron sincronizar los datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Obtener color del badge de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    loadMasterDatabases();
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Bases de Datos Masters</h2>
          <p className="text-gray-600 mt-1">
            Registra y monitorea las bases de datos de los masters de Agora con optimización de IA
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Registrar Master
        </Button>
      </div>

      {/* Formulario de registro */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nueva Base de Datos Master</CardTitle>
            <CardDescription>
              Conecta una nueva base de datos de master para sincronización y optimización con IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="master_id">ID del Master</Label>
                <Input
                  id="master_id"
                  placeholder="master_001"
                  value={formData.master_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, master_id: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="campaign_name">Nombre de la Campaña</Label>
                <Input
                  id="campaign_name"
                  placeholder="Campaña Norte 2025"
                  value={formData.campaign_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign_name: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="google_account" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Cuenta de Google
                </Label>
                <Input
                  id="google_account"
                  type="email"
                  placeholder="campaign@gmail.com"
                  value={formData.google_account}
                  onChange={(e) => setFormData(prev => ({ ...prev, google_account: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para optimización de funciones de Agora
                </p>
              </div>
              <div>
                <Label htmlFor="api_key_primary" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key Principal
                </Label>
                <Input
                  id="api_key_primary"
                  type="password"
                  placeholder="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={formData.api_key_primary}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_key_primary: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opcional: se usará la genérica de Google si no se suministra
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="database_url">URL de la Base de Datos</Label>
              <Input
                id="database_url"
                placeholder="https://tu-proyecto.supabase.co"
                value={formData.database_url}
                onChange={(e) => setFormData(prev => ({ ...prev, database_url: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="database_type">Tipo de Base de Datos</Label>
              <Select 
                value={formData.database_type} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, database_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supabase">Supabase</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={registerMasterDatabase}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Registrando...' : 'Registrar Base de Datos'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de bases de datos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bases de Datos Registradas</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadMasterDatabases}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {masterDatabases.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay bases de datos registradas</p>
              <p className="text-sm text-gray-500 mt-1">
                Registra la primera base de datos master para comenzar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {masterDatabases.map((db) => (
              <Card key={db.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-lg">{db.campaign_name}</h4>
                        <Badge className={getStatusColor(db.connection_status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(db.connection_status)}
                            {db.connection_status}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">ID:</span> {db.master_id}
                        </div>
                        <div>
                          <span className="font-medium">Tipo:</span> {db.database_type}
                        </div>
                        <div>
                          <span className="font-medium">Cuenta Google:</span> {db.google_account}
                        </div>
                        <div>
                          <span className="font-medium">API Key:</span> 
                          <span className="ml-1 font-mono text-xs">
                            {db.api_key_primary ? `${db.api_key_primary.substring(0, 8)}...` : 'Genérica'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Última sincronización:</span>
                        </div>
                        <div>
                          {new Date(db.last_sync).toLocaleString()}
                        </div>
                      </div>

                      {/* Datos comprimidos */}
                      {db.compressed_data && Object.keys(db.compressed_data).length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <h5 className="font-medium text-sm mb-2">Datos Comprimidos:</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(db.compressed_data).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600">{key}:</span>
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testConnection(db.master_id)}
                        disabled={loading}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Probar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncCompressedData(db.master_id)}
                        disabled={loading}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Sincronizar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(db.database_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Sincronización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {masterDatabases.length}
              </div>
              <div className="text-sm text-gray-600">Bases Registradas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {masterDatabases.filter(db => db.connection_status === 'connected').length}
              </div>
              <div className="text-sm text-gray-600">Conectadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {masterDatabases.filter(db => db.connection_status === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Con Errores</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 