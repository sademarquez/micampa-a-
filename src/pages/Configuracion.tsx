
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Bell, Shield, Database, Activity } from "lucide-react";
import Navigation from "@/components/Navigation";

const Configuracion = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center">
            <Settings className="w-8 h-8 mr-3 text-slate-700" />
            Configuración del Sistema
          </h1>
          <p className="text-lg text-slate-600">
            Personaliza tu experiencia y ajustes de la aplicación
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Perfil de Usuario</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Gestiona tu información personal y preferencias de cuenta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center shadow-md">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Notificaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Configura alertas, notificaciones y comunicaciones
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Seguridad</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Ajustes de privacidad, seguridad y autenticación
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center shadow-md">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Base de Datos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Configuración y mantenimiento de datos del sistema
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center shadow-md">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Integración N8N</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Automatizaciones y flujos de trabajo del sistema
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
