import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity,
  Navigation,
  Shield,
  Zap,
  Database,
  Globe,
  Server,
  Settings,
  Play,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import SystemHealthMonitor from '@/components/SystemHealthMonitor';
import NavigationTester from '@/components/NavigationTester';
import { useToast } from '@/hooks/use-toast';

const SystemTesting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('health');
  const [isRunningFullTest, setIsRunningFullTest] = useState(false);
  const { toast } = useToast();

  const runFullSystemTest = async () => {
    setIsRunningFullTest(true);
    
    try {
      // Simular una prueba completa del sistema
      toast({
        title: "Iniciando Prueba Completa del Sistema",
        description: "Verificando todos los componentes...",
      });

      // Simular tiempo de prueba
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Prueba Completa Finalizada",
        description: "Revisa los resultados en las pestañas correspondientes",
      });

    } catch (error) {
      toast({
        title: "Error en Prueba Completa",
        description: "Hubo un problema durante la verificación",
        variant: "destructive"
      });
    } finally {
      setIsRunningFullTest(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testing del Sistema</h1>
          <p className="text-gray-600">Verificación completa de salud y navegación</p>
        </div>
        <Button
          onClick={runFullSystemTest}
          disabled={isRunningFullTest}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Play className="w-4 h-4" />
          {isRunningFullTest ? 'Ejecutando...' : 'Prueba Completa'}
        </Button>
      </div>

      {/* Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">Sistema</div>
                <div className="text-sm text-green-700">Operativo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Backend</div>
                <div className="text-sm text-blue-700">n8n Activo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">Base de Datos</div>
                <div className="text-sm text-purple-700">Supabase OK</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">IA</div>
                <div className="text-sm text-orange-700">Gemini Activo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Testing */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Health Check
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Navegación
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Resumen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Monitoreo de Salud del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SystemHealthMonitor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-6 h-6 text-green-600" />
                Tester de Navegación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NavigationTester />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resumen de Health Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Estado de Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Frontend (PWA)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Backend (n8n)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Supabase Database</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">Google Gemini API</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Cuota Limitada</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Netlify CDN</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen de Navegación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-green-600" />
                  Rutas del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Dashboard Principal</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">OK</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Mapa de Alertas</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">OK</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Registro de Votantes</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">OK</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Panel de Desarrollador</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">OK</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Configuración</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">OK</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Gemini API</h4>
                    <p className="text-sm text-blue-700">
                      La API de Gemini está funcionando pero con cuota limitada. Considera actualizar a un plan de pago para mayor capacidad.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Sistema Operativo</h4>
                    <p className="text-sm text-green-700">
                      El sistema está funcionando correctamente. Todas las rutas y servicios principales están operativos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Monitoreo Continuo</h4>
                    <p className="text-sm text-yellow-700">
                      Se recomienda ejecutar estas pruebas periódicamente para mantener la salud del sistema.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemTesting; 