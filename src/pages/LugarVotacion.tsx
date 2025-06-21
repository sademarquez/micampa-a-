
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Clock, Users } from "lucide-react";

const LugarVotacion = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center">
            <MapPin className="w-8 h-8 mr-3 text-slate-600" />
            Lugares de Votación
          </h1>
          <p className="text-lg text-slate-600">
            Encuentra tu lugar de votación y toda la información necesaria
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Buscar por Dirección</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Encuentra tu lugar de votación ingresando tu dirección
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Horarios</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Consulta los horarios de apertura y cierre de las mesas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-stone-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Información General</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Documentos necesarios y procedimientos de votación
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LugarVotacion;
