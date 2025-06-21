
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Phone,
  MessageCircle,
  Navigation,
  Home,
  Building2
} from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  type: string;
  alerts: number;
  population: number;
  events: number;
}

const MapaVisitante = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  
  const locations: LocationData[] = [
    { id: "bogota-centro", name: "Bogotá Centro", type: "zona", alerts: 3, population: 45000, events: 2 },
    { id: "chapinero", name: "Chapinero", type: "barrio", alerts: 1, population: 32000, events: 4 },
    { id: "suba", name: "Suba", type: "barrio", alerts: 2, population: 67000, events: 1 },
    { id: "usaquen", name: "Usaquén", type: "barrio", alerts: 0, population: 28000, events: 3 },
    { id: "kennedy", name: "Kennedy", type: "barrio", alerts: 4, population: 89000, events: 2 },
    { id: "engativa", name: "Engativá", type: "barrio", alerts: 1, population: 52000, events: 5 }
  ];

  const handleLocationSelect = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    setSelectedLocation(location || null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Mapa Interactivo de tu Zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Selector de Ubicación */}
            <div className="space-y-4">
              <div>
                <Select onValueChange={handleLocationSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu barrio..." />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          {location.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedLocation && (
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">{selectedLocation.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Población:</span>
                        <Badge variant="outline">{selectedLocation.population.toLocaleString()}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alertas activas:</span>
                        <Badge className={selectedLocation.alerts > 2 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                          {selectedLocation.alerts}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Eventos este mes:</span>
                        <Badge className="bg-purple-100 text-purple-800">{selectedLocation.events}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Mapa Visual */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 min-h-[400px] border-2 border-dashed border-blue-200">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {locations.map((location, index) => (
                    <div
                      key={location.id}
                      className={`rounded-lg p-4 cursor-pointer transition-all hover:scale-105 border-2 ${
                        selectedLocation?.id === location.id 
                          ? 'border-blue-500 bg-blue-100 shadow-lg' 
                          : 'border-gray-300 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-medium text-sm">{location.name}</h4>
                        <div className="flex justify-center gap-1 mt-2">
                          {location.alerts > 0 && (
                            <Badge className="bg-red-100 text-red-800 text-xs">{location.alerts}</Badge>
                          )}
                          <Badge className="bg-blue-100 text-blue-800 text-xs">{location.events}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedLocation && (
                  <div className="mt-4 bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      📍 {selectedLocation.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{selectedLocation.population.toLocaleString()} habitantes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span>{selectedLocation.alerts} alertas activas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>{selectedLocation.events} eventos próximos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>Zona {selectedLocation.type}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Phone className="w-4 h-4 mr-1" />
                        Contactar
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Mensaje
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaVisitante;
