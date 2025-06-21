import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, TrendingUp, Download, Database, Activity, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import { SystemHealthMonitor } from "@/components/SystemHealthMonitor";
import { SystemVerification } from "@/components/SystemVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Informes = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-ecosystem-primary mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 mr-3 text-blue-ecosystem-primary" />
            Informes y Reportes del Sistema
          </h1>
          <p className="text-lg text-gray-ecosystem-text">
            Análisis detallados, reportes de campaña y monitoreo del sistema
          </p>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-ecosystem-card shadow-ecosystem-soft">
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-ecosystem-primary data-[state=active]:text-white">
              Reportes
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-ecosystem-primary data-[state=active]:text-white">
              Salud del Sistema
            </TabsTrigger>
            <TabsTrigger value="verification" className="data-[state=active]:bg-blue-ecosystem-primary data-[state=active]:text-white">
              Verificación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-primary flex items-center justify-center shadow-ecosystem-soft">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-blue-ecosystem-primary">Análisis Estadístico</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-ecosystem-text">
                    Métricas y estadísticas detalladas de la campaña electoral
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-secondary flex items-center justify-center shadow-ecosystem-soft">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-blue-ecosystem-primary">Tendencias</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-ecosystem-text">
                    Análisis de tendencias y evolución temporal de la campaña
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-dark flex items-center justify-center shadow-ecosystem-soft">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-blue-ecosystem-primary">Exportar Datos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-ecosystem-text">
                    Descarga reportes en diferentes formatos (PDF, Excel, CSV)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-primary flex items-center justify-center shadow-ecosystem-soft">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-blue-ecosystem-primary">Base de Datos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-ecosystem-text">
                    Estado y salud de la base de datos del sistema
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-ecosystem-secondary flex items-center justify-center shadow-ecosystem-soft">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-blue-ecosystem-primary">Monitoreo N8N</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-ecosystem-text">
                    Estado de automatizaciones y flujos de trabajo
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft hover:shadow-ecosystem-medium transition-all duration-300 border-gray-ecosystem-border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center shadow-ecosystem-soft">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-blue-ecosystem-primary">Verificación Sistema</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-ecosystem-text">
                    Verificación completa y control de saturación del sistema
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemHealthMonitor />
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <SystemVerification />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Informes;
