
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Users, Clock, TrendingUp } from "lucide-react";
import NavigationHelper from "../components/NavigationHelper";

const MapaAlertas = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  const alerts = [
    {
      id: 1,
      title: "Alta concentración de votantes en Zona Norte",
      type: "info",
      location: "Suba - Zona Norte",
      time: "Hace 15 min",
      priority: "Alta",
      description: "Se detectó un incremento del 40% en el interés electoral en esta zona"
    },
    {
      id: 2,
      title: "Oportunidad de contacto en Centro",
      type: "success",
      location: "La Candelaria",
      time: "Hace 32 min",
      priority: "Media",
      description: "Momento óptimo para realizar actividades de campaña"
    },
    {
      id: 3,
      title: "Competencia activa detectada",
      type: "warning",
      location: "Chapinero",
      time: "Hace 1 hora",
      priority: "Alta",
      description: "Actividad electoral de la competencia en aumento"
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto space-y-6">
        <NavigationHelper customTitle="Mapa de Alertas Electorales" />
        
        {/* Header */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Sistema de Alertas Geográficas</CardTitle>
                <p className="text-gray-600">Monitoreo en tiempo real de oportunidades electorales</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 shadow-lg">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">12</div>
              <div className="text-sm text-blue-700">Alertas Activas</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 shadow-lg">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">+340%</div>
              <div className="text-sm text-green-700">Engagement</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 shadow-lg">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">2,847</div>
              <div className="text-sm text-purple-700">Contactos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50 shadow-lg">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900">24/7</div>
              <div className="text-sm text-yellow-700">Monitoreo</div>
            </CardContent>
          </Card>
        </div>

        {/* Mapa simplificado */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Vista Geográfica Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-blue-600 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Mapa Interactivo</h3>
                  <p className="text-gray-600">Visualización de alertas y oportunidades territoriales</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Sistema Activo</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de alertas */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${getAlertColor(alert.type)}`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{alert.title}</h4>
                      <p className="text-sm opacity-80 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                    <Badge className={`${
                      alert.priority === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapaAlertas;
