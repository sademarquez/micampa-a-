
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Users, Crown, Shield, Navigation } from "lucide-react";

interface MemberData {
  id: string;
  name: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  territory: string;
  coordinates: { lat: number; lng: number };
  phone?: string;
  email?: string;
  subordinates?: number;
}

const MapaEstructura = () => {
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [mapCenter] = useState({ lat: 4.60971, lng: -74.08175 }); // Colombia center
  const [zoomLevel] = useState(6);

  // Datos de ejemplo de la estructura organizacional
  const teamMembers: MemberData[] = [
    {
      id: '1',
      name: 'Master Campaign',
      role: 'master',
      territory: 'Nacional',
      coordinates: { lat: 4.60971, lng: -74.08175 },
      phone: '+57 300 123 4567',
      email: 'master@micampana.com',
      subordinates: 15
    },
    {
      id: '2',
      name: 'Candidato Principal',
      role: 'candidato',
      territory: 'Bogotá D.C.',
      coordinates: { lat: 4.710989, lng: -74.072092 },
      phone: '+57 301 234 5678',
      email: 'candidato@micampana.com',
      subordinates: 8
    },
    {
      id: '3',
      name: 'Líder Chapinero',
      role: 'lider',
      territory: 'Chapinero',
      coordinates: { lat: 4.665, lng: -74.063 },
      phone: '+57 302 345 6789',
      email: 'lider@micampana.com',
      subordinates: 25
    },
    {
      id: '4',
      name: 'Líder Zona Rosa',
      role: 'lider',
      territory: 'Zona Rosa',
      coordinates: { lat: 4.668, lng: -74.058 },
      phone: '+57 303 456 7890',
      subordinates: 12
    },
    {
      id: '5',
      name: 'Líder Medellín',
      role: 'lider',
      territory: 'Medellín',
      coordinates: { lat: 6.244203, lng: -75.581212 },
      phone: '+57 304 567 8901',
      subordinates: 18
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'master': return 'bg-purple-600';
      case 'candidato': return 'bg-blue-600';
      case 'lider': return 'bg-green-600';
      case 'votante': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'master': return Shield;
      case 'candidato': return Crown;
      case 'lider': return Users;
      case 'votante': return Navigation;
      default: return MapPin;
    }
  };

  const mapStyles = {
    height: '500px',
    width: '100%'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Mapa de la Estructura Organizacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={mapStyles}
              center={mapCenter}
              zoom={zoomLevel}
            >
              {teamMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                return (
                  <Marker
                    key={member.id}
                    position={member.coordinates}
                    title={`${member.name} - ${member.territory}`}
                    onClick={() => setSelectedMember(member)}
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="14" fill="${getRoleColor(member.role).replace('bg-', '#')}" stroke="white" stroke-width="2"/>
                          <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${member.role[0].toUpperCase()}</text>
                        </svg>
                      `)}`,
                      scaledSize: new google.maps.Size(32, 32)
                    }}
                  />
                );
              })}

              {selectedMember && (
                <InfoWindow
                  position={selectedMember.coordinates}
                  onCloseClick={() => setSelectedMember(null)}
                >
                  <div className="p-3 max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getRoleColor(selectedMember.role)} text-white`}>
                        {selectedMember.role.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{selectedMember.territory}</p>
                    {selectedMember.phone && (
                      <p className="text-sm">📞 {selectedMember.phone}</p>
                    )}
                    {selectedMember.email && (
                      <p className="text-sm">✉️ {selectedMember.email}</p>
                    )}
                    {selectedMember.subordinates && (
                      <p className="text-sm font-medium text-blue-600">
                        👥 {selectedMember.subordinates} personas a cargo
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </CardContent>
      </Card>

      {/* Lista de miembros del equipo */}
      <Card>
        <CardHeader>
          <CardTitle>Estructura del Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full ${getRoleColor(member.role)} flex items-center justify-center`}>
                        <RoleIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">📍 {member.territory}</p>
                    {member.subordinates && (
                      <p className="text-sm text-blue-600">
                        👥 {member.subordinates} personas
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => setSelectedMember(member)}
                    >
                      Ver en Mapa
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaEstructura;
