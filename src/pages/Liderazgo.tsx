
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Crown, MapPin, Phone, Star, Award } from "lucide-react";

// Datos de ejemplo para líderes
const lideresEjemplo = [
  {
    id: "LID001",
    nombre: "María González",
    rol: "Líder Municipal",
    municipio: "Buenaventura",
    zona: "Zona Oriental",
    telefono: "+57 300 123 4567",
    miembrosRegistrados: 45,
    alertasReportadas: 12,
    puntosCompromiso: 890,
    nivel: "Oro",
    fechaIngreso: "2023-08-15"
  },
  {
    id: "LID002",
    nombre: "Carlos Ramírez",
    rol: "Líder Zonal",
    municipio: "Tumaco",
    zona: "Centro",
    telefono: "+57 301 234 5678",
    miembrosRegistrados: 32,
    alertasReportadas: 8,
    puntosCompromiso: 650,
    nivel: "Plata",
    fechaIngreso: "2023-09-22"
  },
  {
    id: "LID003",
    nombre: "Ana Mosquera",
    rol: "Líder de Barrio",
    municipio: "Quibdó",
    zona: "Barrio Kennedy",
    telefono: "+57 302 345 6789",
    miembrosRegistrados: 28,
    alertasReportadas: 15,
    puntosCompromiso: 720,
    nivel: "Plata",
    fechaIngreso: "2023-07-10"
  },
  {
    id: "LID004",
    nombre: "Luis Parra",
    rol: "Líder de Vereda",
    municipio: "Guapi",
    zona: "Vereda San José",
    telefono: "+57 303 456 7890",
    miembrosRegistrados: 18,
    alertasReportadas: 5,
    puntosCompromiso: 420,
    nivel: "Bronce",
    fechaIngreso: "2023-10-05"
  }
];

const Liderazgo = () => {
  const [lideres] = useState(lideresEjemplo);
  const [liderSeleccionado, setLiderSeleccionado] = useState<typeof lideresEjemplo[0] | null>(null);

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Oro": return "bg-amber-50 text-amber-800 border-amber-200";
      case "Plata": return "bg-slate-50 text-slate-700 border-slate-200";
      case "Bronce": return "bg-stone-50 text-stone-700 border-stone-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case "Líder Municipal": return <Crown className="w-5 h-5 text-slate-600" />;
      case "Líder Zonal": return <Star className="w-5 h-5 text-slate-600" />;
      case "Líder de Barrio": return <Users className="w-5 h-5 text-slate-600" />;
      case "Líder de Vereda": return <MapPin className="w-5 h-5 text-slate-600" />;
      default: return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const calcularProgresoPorcentaje = (puntos: number) => {
    const maxPuntos = 1000;
    return Math.min((puntos / maxPuntos) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8 pb-20 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center drop-shadow-sm">
            <Crown className="w-8 h-8 mr-3 text-slate-600 drop-shadow-sm" />
            Red de Liderazgo Territorial
          </h1>
          <p className="text-lg text-slate-600 drop-shadow-sm">
            Conoce a los líderes que están transformando sus comunidades
          </p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center border-l-4 border-l-slate-600 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-slate-700 drop-shadow-sm">
                {lideres.length}
              </div>
              <div className="text-sm text-slate-600">Líderes Activos</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-stone-600 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-stone-700 drop-shadow-sm">
                {lideres.reduce((sum, lider) => sum + lider.miembrosRegistrados, 0)}
              </div>
              <div className="text-sm text-slate-600">Miembros Registrados</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-700 drop-shadow-sm">
                {lideres.reduce((sum, lider) => sum + lider.alertasReportadas, 0)}
              </div>
              <div className="text-sm text-slate-600">Alertas Reportadas</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-amber-600 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-700 drop-shadow-sm">
                {lideres.filter(l => l.nivel === "Oro").length}
              </div>
              <div className="text-sm text-slate-600">Líderes Oro</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Líderes */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {lideres.map((lider) => (
            <Card 
              key={lider.id} 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 shadow-md transform hover:-translate-y-2 hover:scale-105"
              onClick={() => setLiderSeleccionado(lider)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg shadow-inner">
                      {getRolIcon(lider.rol)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800 drop-shadow-sm">{lider.nombre}</CardTitle>
                      <CardDescription className="flex items-center">
                        <span className="text-sm font-medium text-slate-600">{lider.id}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getNivelColor(lider.nivel)} border shadow-sm`}>
                    {lider.nivel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {lider.municipio} - {lider.zona}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2" />
                    {lider.rol}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border shadow-inner">
                      <div className="font-semibold text-slate-800">{lider.miembrosRegistrados}</div>
                      <div className="text-slate-600">Miembros</div>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-lg border shadow-inner">
                      <div className="font-semibold text-stone-800">{lider.alertasReportadas}</div>
                      <div className="text-stone-600">Alertas</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Compromiso</span>
                      <span className="font-semibold text-slate-700">{lider.puntosCompromiso} pts</span>
                    </div>
                    <Progress 
                      value={calcularProgresoPorcentaje(lider.puntosCompromiso)} 
                      className="h-3 shadow-inner"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detalles del Líder Seleccionado */}
        {liderSeleccionado && (
          <Card className="bg-gradient-to-r from-slate-50 to-stone-50 border-slate-200 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center text-slate-800 drop-shadow-sm">
                  <div className="p-2 bg-white rounded-lg shadow-md mr-3">
                    {getRolIcon(liderSeleccionado.rol)}
                  </div>
                  <span>{liderSeleccionado.nombre}</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLiderSeleccionado(null)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 shadow-md hover:shadow-lg transition-shadow"
                >
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b border-slate-200 pb-2 text-slate-800 drop-shadow-sm">Información General</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-slate-600">ID de Líder:</span>
                      <span className="font-medium text-slate-800">{liderSeleccionado.id}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-slate-600">Rol:</span>
                      <span className="font-medium text-slate-800">{liderSeleccionado.rol}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-slate-600">Ubicación:</span>
                      <span className="font-medium text-slate-800">{liderSeleccionado.municipio}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-slate-600">Zona:</span>
                      <span className="font-medium text-slate-800">{liderSeleccionado.zona}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                      <span className="text-slate-600">Fecha de Ingreso:</span>
                      <span className="font-medium text-slate-800">
                        {new Date(liderSeleccionado.fechaIngreso).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b border-slate-200 pb-2 text-slate-800 drop-shadow-sm">Métricas de Impacto</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Miembros Registrados</span>
                        <Badge variant="outline" className="border-slate-300 text-slate-700 shadow-sm">{liderSeleccionado.miembrosRegistrados}</Badge>
                      </div>
                      <Progress value={(liderSeleccionado.miembrosRegistrados / 50) * 100} className="h-3 shadow-inner" />
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Alertas Reportadas</span>
                        <Badge variant="outline" className="border-slate-300 text-slate-700 shadow-sm">{liderSeleccionado.alertasReportadas}</Badge>
                      </div>
                      <Progress value={(liderSeleccionado.alertasReportadas / 20) * 100} className="h-3 shadow-inner" />
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Puntos de Compromiso</span>
                        <Badge className={`${getNivelColor(liderSeleccionado.nivel)} shadow-sm`}>
                          {liderSeleccionado.puntosCompromiso} pts
                        </Badge>
                      </div>
                      <Progress value={calcularProgresoPorcentaje(liderSeleccionado.puntosCompromiso)} className="h-3 shadow-inner" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="flex-1 bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-shadow">
                      <Phone className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-shadow">
                      <Award className="w-4 h-4 mr-2" />
                      Ver Equipo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-slate-600 to-stone-600 text-white mt-8 shadow-2xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">
              ¿Quieres Ser Parte del Liderazgo?
            </h2>
            <p className="text-lg mb-6 opacity-90 drop-shadow-md">
              Únete a nuestra red de líderes territoriales y ayuda a transformar tu comunidad
            </p>
            <Button size="lg" className="bg-white text-slate-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-shadow transform hover:scale-105">
              Solicitar Ser Líder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Liderazgo;
