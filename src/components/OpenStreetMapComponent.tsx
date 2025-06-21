
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ZoomIn, ZoomOut, Navigation, Users, AlertTriangle } from 'lucide-react';

interface MapProps {
  onLocationSelect?: (location: any) => void;
  alerts?: Array<{
    id: string;
    title: string;
    lat: number;
    lng: number;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const OpenStreetMapComponent = ({ onLocationSelect, alerts = [] }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState({ lat: 4.7110, lng: -74.0721 }); // Bogotá

  useEffect(() => {
    // Cargar Leaflet dinámicamente
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Cargar CSS de Leaflet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Cargar JS de Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || map) return;

      const leafletMap = window.L.map(mapRef.current, {
        zoomControl: false,
        maxZoom: 19, // Zoom máximo para ver edificios individuales
        minZoom: 3
      }).setView([center.lat, center.lng], zoom);

      // Usar OpenStreetMap gratuito
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(leafletMap);

      // Agregar alertas como marcadores
      alerts.forEach(alert => {
        const markerColor = alert.priority === 'high' ? 'red' : 
                           alert.priority === 'medium' ? 'orange' : 'green';
        
        const marker = window.L.circleMarker([alert.lat, alert.lng], {
          radius: 8,
          fillColor: markerColor,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(leafletMap);

        marker.bindPopup(`
          <div class="p-2">
            <h4 class="font-bold text-sm">${alert.title}</h4>
            <p class="text-xs text-gray-600">Prioridad: ${alert.priority}</p>
          </div>
        `);

        marker.on('click', () => {
          if (onLocationSelect) {
            onLocationSelect({
              lat: alert.lat,
              lng: alert.lng,
              title: alert.title,
              priority: alert.priority
            });
          }
        });
      });

      // Eventos del mapa
      leafletMap.on('zoomend', () => {
        setZoom(leafletMap.getZoom());
      });

      leafletMap.on('moveend', () => {
        const newCenter = leafletMap.getCenter();
        setCenter({ lat: newCenter.lat, lng: newCenter.lng });
      });

      setMap(leafletMap);
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  const handleCenterToBogota = () => {
    if (map) {
      map.setView([4.7110, -74.0721], 13);
    }
  };

  return (
    <Card className="w-full h-full shadow-lg">
      <CardContent className="p-0 relative h-full">
        {/* Mapa */}
        <div 
          ref={mapRef} 
          className="w-full h-full min-h-[400px] rounded-lg"
          style={{ zIndex: 1 }}
        />
        
        {/* Controles de Zoom */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white shadow-md"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white shadow-md"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white shadow-md"
            onClick={handleCenterToBogota}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Información del Zoom */}
        <div className="absolute top-4 left-4 z-[1000]">
          <Badge className="bg-blue-600 text-white">
            Zoom: {zoom}/19
          </Badge>
        </div>

        {/* Contador de Alertas */}
        {alerts.length > 0 && (
          <div className="absolute bottom-4 left-4 z-[1000]">
            <Badge className="bg-orange-500 text-white flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {alerts.length} alertas
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Declarar el tipo para window.L
declare global {
  interface Window {
    L: any;
  }
}

export default OpenStreetMapComponent;
