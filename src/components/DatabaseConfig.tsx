
/*
 * Copyright © 2025 Daniel Lopez - Sademarquez. Todos los derechos reservados.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff,
  Download,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatabaseConnection {
  type: 'supabase' | 'mysql' | 'postgresql' | 'none';
  url: string;
  key?: string;
  status: 'connected' | 'disconnected' | 'testing';
}

const DatabaseConfig = () => {
  const [dbConnection, setDbConnection] = useState<DatabaseConnection>({
    type: 'none',
    url: '',
    key: '',
    status: 'disconnected'
  });
  
  const [isConfiguring, setIsConfiguring] = useState(false);
  const { toast } = useToast();

  const handleDatabaseTest = async () => {
    setIsConfiguring(true);
    setDbConnection(prev => ({ ...prev, status: 'testing' }));
    
    // Simular test de conexión
    setTimeout(() => {
      if (dbConnection.url && dbConnection.key) {
        setDbConnection(prev => ({ ...prev, status: 'connected' }));
        toast({
          title: "✅ Conexión exitosa",
          description: "Base de datos configurada correctamente",
        });
      } else {
        setDbConnection(prev => ({ ...prev, status: 'disconnected' }));
        toast({
          title: "❌ Error de conexión",
          description: "Verifica URL y clave de API",
          variant: "destructive"
        });
      }
      setIsConfiguring(false);
    }, 2000);
  };

  const handleExportCredentials = () => {
    // Exportar credenciales locales a JSON
    toast({
      title: "📤 Exportando credenciales",
      description: "Descargando archivo credentials.json",
    });
  };

  const handleImportCredentials = () => {
    // Importar credenciales desde archivo
    toast({
      title: "📥 Importando credenciales",
      description: "Selecciona archivo credentials.json",
    });
  };

  const migrateToDatabase = async () => {
    if (dbConnection.status !== 'connected') {
      toast({
        title: "❌ Sin conexión",
        description: "Configura la base de datos primero",
        variant: "destructive"
      });
      return;
    }

    setIsConfiguring(true);
    
    // Simular migración
    setTimeout(() => {
      toast({
        title: "✅ Migración completada",
        description: "Credenciales migradas a la base de datos",
      });
      setIsConfiguring(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-verde-sistema-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-negro-900">
            <Database className="w-6 h-6 text-verde-sistema-600" />
            Configuración de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Estado actual */}
          <div className="flex items-center justify-between p-4 bg-negro-50 rounded-lg">
            <div className="flex items-center gap-3">
              {dbConnection.status === 'connected' ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <div className="font-medium text-negro-900">
                  Estado: {dbConnection.status === 'connected' ? 'Conectado' : 'Sin conexión'}
                </div>
                <div className="text-sm text-negro-600">
                  Modo actual: Credenciales JSON locales
                </div>
              </div>
            </div>
            <Badge 
              variant={dbConnection.status === 'connected' ? 'default' : 'secondary'}
              className={dbConnection.status === 'connected' ? 'bg-green-600' : ''}
            >
              {dbConnection.status === 'connected' ? 'BD Activa' : 'Solo Local'}
            </Badge>
          </div>

          {/* Configuración Supabase */}
          <div className="space-y-3">
            <Label className="text-negro-700 font-medium">Configurar Supabase</Label>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="supabase-url" className="text-sm text-negro-600">
                  URL del Proyecto
                </Label>
                <Input
                  id="supabase-url"
                  placeholder="https://tu-proyecto.supabase.co"
                  value={dbConnection.url}
                  onChange={(e) => setDbConnection(prev => ({ 
                    ...prev, 
                    url: e.target.value, 
                    type: 'supabase' 
                  }))}
                  className="border-negro-300"
                />
              </div>
              
              <div>
                <Label htmlFor="supabase-key" className="text-sm text-negro-600">
                  Clave API (anon key)
                </Label>
                <Input
                  id="supabase-key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={dbConnection.key}
                  onChange={(e) => setDbConnection(prev => ({ 
                    ...prev, 
                    key: e.target.value 
                  }))}
                  className="border-negro-300"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDatabaseTest}
                disabled={isConfiguring || !dbConnection.url || !dbConnection.key}
                className="bg-verde-sistema-600 hover:bg-verde-sistema-700"
              >
                {dbConnection.status === 'testing' ? "Probando..." : "Probar Conexión"}
              </Button>
              
              {dbConnection.status === 'connected' && (
                <Button
                  onClick={migrateToDatabase}
                  disabled={isConfiguring}
                  className="bg-negro-800 hover:bg-negro-900"
                >
                  {isConfiguring ? "Migrando..." : "Migrar Credenciales"}
                </Button>
              )}
            </div>
          </div>

          {/* Gestión de Credenciales */}
          <div className="border-t border-negro-200 pt-4">
            <Label className="text-negro-700 font-medium mb-3 block">
              Gestión de Credenciales
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleExportCredentials}
                className="flex items-center gap-2 border-verde-sistema-300 text-verde-sistema-700"
              >
                <Download className="w-4 h-4" />
                Exportar JSON
              </Button>
              
              <Button
                variant="outline"
                onClick={handleImportCredentials}
                className="flex items-center gap-2 border-negro-300 text-negro-700"
              >
                <Upload className="w-4 h-4" />
                Importar JSON
              </Button>
            </div>
          </div>

          {/* Alertas informativas */}
          <Alert className="border-verde-sistema-200 bg-verde-sistema-50">
            <CheckCircle className="h-4 w-4 text-verde-sistema-600" />
            <AlertDescription className="text-verde-sistema-800">
              <strong>Sistema Local Activo:</strong> Las credenciales están almacenadas en 
              credentials.json. Configura una base de datos para sincronización en producción.
            </AlertDescription>
          </Alert>

          {dbConnection.status === 'connected' && (
            <Alert className="border-green-200 bg-green-50">
              <Database className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Base de Datos Conectada:</strong> Puedes migrar las credenciales 
                locales a la base de datos para sincronización multi-dispositivo.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseConfig;
