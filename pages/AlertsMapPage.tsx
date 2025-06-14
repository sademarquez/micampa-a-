
import React, { useState, useEffect } from 'react';
import { Alert, AlertType, AlertStatus, PollingPlace } from '../types';
import { getAlertsData } from '../services/campaignService';
import { getPollingPlaces } from '../services/electoralPwaService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, ALERT_TYPE_OPTIONS } from '../constants';
import { MapIcon, MapPinIcon as LocationMarkerIcon, FunnelIcon as FilterIcon, CalendarDaysIcon as CalendarIcon, UserIcon, InformationCircleIcon, PhotoIcon as PhotographIcon, ExclamationTriangleIcon, ShieldCheckIcon, QuestionMarkCircleIcon, ChatBubbleOvalLeftIcon, BuildingLibraryIcon, ClockIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

type MapMode = 'alerts' | 'pollingPlaces';

const getCustomMapIcon = (type: AlertType | 'pollingPlace') => {
  let iconColorClass = 'text-gray-500';

  if (type === 'pollingPlace') {
    iconColorClass = 'text-purple-600'; // Color for polling places
     return L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 ${iconColorClass} drop-shadow-lg"><path fill-rule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0v-1.5h10.5a.75.75 0 000-1.5H6v-1.5h10.5a.75.75 0 000-1.5H6V15h10.5a.75.75 0 000-1.5H6v-1.5h10.5a.75.75 0 000-1.5H6V9h10.5a.75.75 0 000-1.5H6V6h10.5a.75.75 0 000-1.5H6V3a.75.75 0 00-.75-.75H4.5z" clip-rule="evenodd" /></svg>`,
      className: 'bg-transparent border-0',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  } else {
    switch (type) {
      case AlertType.FALLA_SERVICIO: iconColorClass = 'text-blue-500'; break;
      case AlertType.PROBLEMA_SEGURIDAD: iconColorClass = 'text-red-500'; break;
      case AlertType.NECESIDAD_COMUNITARIA: iconColorClass = 'text-yellow-500'; break;
      default: iconColorClass = 'text-gray-600'; break;
    }
    return L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 ${iconColorClass} drop-shadow-lg"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>`,
      className: 'bg-transparent border-0',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }
};

const ChangeView: React.FC<{ center: L.LatLngExpression; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const AlertsMapPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [pollingPlaces, setPollingPlaces] = useState<PollingPlace[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<AlertType | ''>('');
  const [mapMode, setMapMode] = useState<MapMode>('alerts');
  
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>(MAP_DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(MAP_DEFAULT_ZOOM);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (mapMode === 'alerts') {
          const data = await getAlertsData();
          setAlerts(data);
          setFilteredAlerts(data.filter(alert => filterType ? alert.tipoAlerta === filterType : true));
        } else if (mapMode === 'pollingPlaces') {
          const data = await getPollingPlaces();
          setPollingPlaces(data);
        }
      } catch (err) {
        console.error(`Error al cargar datos para modo ${mapMode}:`, err);
        setError(`No se pudieron cargar los datos para ${mapMode === 'alerts' ? 'alertas' : 'puestos de votación'}. Inténtalo de nuevo.`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mapMode, filterType]); // Recargar datos si cambia el modo o el filtro de tipo de alerta

  const getDetailIcon = (type: AlertType | 'pollingPlace') => {
    if (type === 'pollingPlace') return <BuildingLibraryIcon className="h-5 w-5 text-purple-600 mr-2"/>;
    switch(type) {
        case AlertType.FALLA_SERVICIO: return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500 mr-2"/>;
        case AlertType.PROBLEMA_SEGURIDAD: return <ShieldCheckIcon className="h-5 w-5 text-red-500 mr-2"/>;
        case AlertType.NECESIDAD_COMUNITARIA: return <ChatBubbleOvalLeftIcon className="h-5 w-5 text-yellow-500 mr-2"/>;
        default: return <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 mr-2"/>;
    }
  }

  const commonInputClasses = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <MapIcon className="h-8 w-8 mr-3 text-indigo-600" />
          Mapa Interactivo
        </h1>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <label htmlFor="mapMode" className="block text-sm font-medium text-gray-700">Modo del Mapa</label>
          <select
            id="mapMode"
            name="mapMode"
            value={mapMode}
            onChange={(e) => {
              setMapMode(e.target.value as MapMode);
              setFilterType(''); // Reset filter type when mode changes
            }}
            className={commonInputClasses}
          >
            <option value="alerts">Alertas Ciudadanas</option>
            <option value="pollingPlaces">Puestos de Votación</option>
          </select>
        </div>
        {mapMode === 'alerts' && (
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">Filtrar Alertas por Tipo</label>
            <select
              id="filterType"
              name="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as AlertType | '')}
              className={commonInputClasses}
            >
              <option value="">Todos los tipos</option>
              {ALERT_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message={`Cargando ${mapMode === 'alerts' ? 'alertas' : 'puestos de votación'}...`} />
      ) : (
        <div className="h-[500px] w-full bg-gray-200 rounded-lg shadow-md">
          <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapMode === 'alerts' && filteredAlerts.map(alert => (
              <Marker 
                key={alert.alertaID} 
                position={[alert.latitud, alert.longitud]}
                icon={getCustomMapIcon(alert.tipoAlerta)}
              >
                <Popup minWidth={250}>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-indigo-700 flex items-center">
                      {getDetailIcon(alert.tipoAlerta)}
                      {alert.tipoAlerta}
                    </h3>
                    <p className="text-sm text-gray-700"><strong className="font-medium">Desc:</strong> {alert.descripcion}</p>
                    <p className="text-xs text-gray-500 flex items-center"><CalendarIcon className="h-3 w-3 mr-1.5"/> {new Date(alert.fechaReporte).toLocaleString('es-CO')}</p>
                    <p className="text-xs text-gray-500 flex items-center"><UserIcon className="h-3 w-3 mr-1.5"/>Por: {alert.nombreReportador || 'Desconocido'}</p>
                    <p className="text-xs text-gray-500 flex items-center"><InformationCircleIcon className="h-3 w-3 mr-1.5"/>Estado: <span className={`font-semibold px-1.5 py-0.5 rounded-full text-xs ${alert.estado === AlertStatus.ABIERTA ? 'bg-red-100 text-red-700' : alert.estado === AlertStatus.EN_PROCESO ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{alert.estado}</span></p>
                    {alert.urlMedia && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-500 mb-0.5 flex items-center"><PhotographIcon className="h-3 w-3 mr-1.5"/>Evidencia:</p>
                        <a href={alert.urlMedia} target="_blank" rel="noopener noreferrer">
                          <img src={alert.urlMedia} alt="Evidencia de alerta" className="rounded max-w-full h-auto max-h-28 shadow-sm hover:opacity-80"/>
                        </a>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            {mapMode === 'pollingPlaces' && pollingPlaces.map(place => (
              place.latitude && place.longitude && // Ensure place has coordinates
              <Marker 
                key={place.id} 
                position={[place.latitude, place.longitude]}
                icon={getCustomMapIcon('pollingPlace')}
              >
                <Popup minWidth={250}>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                      {getDetailIcon('pollingPlace')}
                      {place.name}
                    </h3>
                    <p className="text-sm text-gray-700"><strong className="font-medium">Dirección:</strong> {place.address}, {place.city}</p>
                    {place.openingHours && <p className="text-xs text-gray-500 flex items-center"><ClockIcon className="h-3 w-3 mr-1.5"/>Horario: {place.openingHours}</p>}
                    {/* Add more details if needed */}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
       <p className="text-xs text-gray-500 mt-4 text-center">Datos de mapa provistos por OpenStreetMap. Interactúa con los marcadores para más detalles.</p>
    </div>
  );
};

export default AlertsMapPage;
