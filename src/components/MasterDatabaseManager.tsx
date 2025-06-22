import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { developerAuthService } from '@/services/developerAuthService';
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
  Key,
  UserPlus,
  Loader2,
  Save,
  Globe,
  Shield
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

interface MasterDatabaseManagerProps {
  className?: string;
}

const masterDbSchema = z.object({
  campaign_name: z.string().min(3, "El nombre de la campaña es requerido"),
  database_url: z.string().url("Debe ser una URL válida de Supabase"),
  google_account: z.string().email("Debe ser un email válido de Google"),
  api_key_primary: z.string().optional(),
  master_user_email: z.string().email("El email para el usuario Master es requerido"),
  master_user_password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type MasterDbFormValues = z.infer<typeof masterDbSchema>;

export const MasterDatabaseManager: React.FC<MasterDatabaseManagerProps> = ({ className }) => {
  const [masterDatabases, setMasterDatabases] = useState<MasterDatabase[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const developerTheme = roleThemes['desarrollador'];

  const form = useForm<MasterDbFormValues>({
    resolver: zodResolver(masterDbSchema),
    defaultValues: {
      campaign_name: "",
      database_url: "",
      google_account: "",
      api_key_primary: "",
      master_user_email: "",
      master_user_password: "",
    },
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

  const onSubmit = async (values: MasterDbFormValues) => {
    setLoading(true);
    try {
      const masterUser = await developerAuthService.createMasterUser(values.master_user_email, values.master_user_password);
      
      await developerAuthService.registerMasterDatabase({
        master_id: masterUser.id,
        campaign_name: values.campaign_name,
        database_url: values.database_url,
        google_account: values.google_account,
        api_key_primary: values.api_key_primary,
        compressed_data: {},
      });

      toast({
        title: "✅ Master Creado y Registrado",
        description: `El usuario ${values.master_user_email} ha sido creado y su base de datos registrada.`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo completar la operación.",
        variant: "destructive",
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
          <UserPlus className="h-4 w-4" />
          Crear Nuevo Master
        </Button>
      </div>

      {/* Formulario de registro */}
      {showForm && (
        <Card className={cn("border-2", developerTheme.borderColor, `bg-gradient-to-br from-gray-900 to-gray-800`)}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-900/50">
                <UserPlus className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Crear Nuevo Master</CardTitle>
                <CardDescription className="text-indigo-200">
                  Registra un nuevo usuario Master y su base de datos de campaña asociada.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="master_user_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-200 flex items-center gap-2"><Mail className="w-4 h-4" /> Email del Usuario Master</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="master@ejemplo.com" {...field} className="bg-gray-800 border-indigo-700 text-white placeholder:text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="master_user_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-200 flex items-center gap-2"><Key className="w-4 h-4" /> Contraseña del Usuario Master</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} className="bg-gray-800 border-indigo-700 text-white placeholder:text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="bg-indigo-800" />
                
                <h3 className="text-lg font-semibold text-indigo-200 flex items-center gap-3"><Database className="w-5 h-5"/> Datos de la Campaña</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="campaign_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-200">Nombre de la Campaña</FormLabel>
                        <FormControl>
                          <Input placeholder="Campaña Presidencial 2026" {...field} className="bg-gray-800 border-indigo-700 text-white placeholder:text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="database_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-200 flex items-center gap-2"><Globe className="w-4 h-4" /> URL de Supabase</FormLabel>
                        <FormControl>
                          <Input placeholder="https://<id>.supabase.co" {...field} className="bg-gray-800 border-indigo-700 text-white placeholder:text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="google_account"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-200">Cuenta de Google Asociada</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="campaña@gmail.com" {...field} className="bg-gray-800 border-indigo-700 text-white placeholder:text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="api_key_primary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-indigo-200 flex items-center gap-2"><Shield className="w-4 h-4" /> API Key de Google (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="AIzaSy..." {...field} className="bg-gray-800 border-indigo-700 text-white placeholder:text-gray-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className={cn("w-full text-lg py-6", developerTheme.buttonClass, "hover:shadow-indigo-500/40 shadow-lg")} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creando y Registrando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Crear Master y Guardar Configuración
                    </>
                  )}
                </Button>
              </form>
            </Form>
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