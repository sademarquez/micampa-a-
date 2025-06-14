import React, { useState, useEffect } from 'react';
import { Alert, AlertType, AlertStatus } from '../types';
import { getAlertsData } from '../services/campaignService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, ALERT_TYPE_OPTIONS } from '../constants';
import { MapIcon, MapPinIcon as LocationMarkerIcon, FunnelIcon as FilterIcon, CalendarDaysIcon as CalendarIcon, UserIcon, InformationCircleIcon, PhotoIcon as PhotographIcon, ExclamationTriangleIcon, ShieldCheckIcon, QuestionMarkCircleIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

// Mock Leaflet.js behavior for UI demonstration purposes
const MockMap: React.FC<{ alerts: Alert[]; selectedAlert: Alert | null; onMarkerClick: (alert: Alert) => void; center: [number, number]; zoom: number }> = ({ alerts, selectedAlert, onMarkerClick, center, zoom }) => {
  const getPinColor = (type: AlertType) => {
    switch (type) {
      case AlertType.FALLA_SERVICIO: return 'bg-blue-500';
      case AlertType.PROBLEMA_SEGURIDAD: return 'bg-red-500';
      case AlertType.NECESIDAD_COMUNITARIA: return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-[500px] bg-gray-300 rounded-lg shadow-md relative overflow-hidden" title={`Mapa centrado en ${center} con zoom ${zoom}`}>
      <p className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded text-xs text-gray-700">Mapa simulado (Leaflet.js iría aquí)</p>
      {alerts.map((alert, index) => (
        // Simple positioning simulation. Real map would use lat/lng.
        <button
          key={alert.alertaID}
          onClick={() => onMarkerClick(alert)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg hover:scale-110 transition-transform ${getPinColor(alert.tipoAlerta)} ${selectedAlert?.alertaID === alert.alertaID ? 'ring-4 ring-indigo-300' : ''}`}
          style={{ 
            left: `${20 + (index % 5) * 15 + Math.random()*5}%`, // Randomize a bit for visual spread
            top: `${20 + Math.floor(index / 5) * 15 + Math.random()*5}%`,
            zIndex: selectedAlert?.alertaID === alert.alertaID ? 10 : 1
           }}
          title={alert.descripcion}
        >
          <LocationMarkerIcon className="h-5 w-5 text-white" />
        </button>
      ))}
    </div>
  );
};


const AlertsMapPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<AlertType | ''>('');
  const [filterMunicipio, setFilterMunicipio] = useState<string>(''); // Placeholder, needs user data or predefined list

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAlertsData();
        setAlerts(data);
        setFilteredAlerts(data); // Initially show all
      } catch (err) {
        console.error("Error al cargar alertas:", err);
        setError("No se pudieron cargar las alertas. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, []);

  useEffect(() => {
    let currentAlerts = [...alerts];
    if (filterType) {
      currentAlerts = currentAlerts.filter(alert => alert.tipoAlerta === filterType);
    }
    // if (filterMunicipio) { // Add municipio to Alert type if needed for filtering
    //   currentAlerts = currentAlerts.filter(alert => alert.municipio === filterMunicipio);
    // }
    setFilteredAlerts(currentAlerts);
    setSelectedAlert(null); // Deselect alert when filters change
  }, [filterType, filterMunicipio, alerts]);
  
  const getAlertIcon = (type: AlertType) => {
    switch(type) {
        case AlertType.FALLA_SERVICIO: return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500 mr-2"/>;
        case AlertType.PROBLEMA_SEGURIDAD: return <ShieldCheckIcon className="h-5 w-5 text-red-500 mr-2"/>;
        case AlertType.NECESIDAD_COMUNITARIA: return <ChatBubbleOvalLeftIcon className="h-5 w-5 text-yellow-500 mr-2"/>;
        default: return <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 mr-2"/>;
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <MapIcon className="h-8 w-8 mr-3 text-indigo-600" />
          Mapa de Alertas en Tiempo Real
        </h1>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <FilterIcon className="h-6 w-6 text-gray-500 hidden sm:block" />
        <div className="w-full sm:w-auto">
          <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">Tipo de Alerta</label>
          <select
            id="filterType"
            name="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AlertType | '')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todos los tipos</option>
            {ALERT_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {/* Placeholder for Municipio Filter - would require User data or predefined list */}
        {/* <div className="w-full sm:w-auto">
          <label htmlFor="filterMunicipio" className="block text-sm font-medium text-gray-700">Municipio</label>
          <input type="text" id="filterMunicipio" name="filterMunicipio" value={filterMunicipio} onChange={(e) => setFilterMunicipio(e.target.value)} placeholder="Ej: Cali" className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md" />
        </div> */}
      </div>

      {loading ? (
        <LoadingSpinner message="Cargando mapa y alertas..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
             <MockMap alerts={filteredAlerts} selectedAlert={selectedAlert} onMarkerClick={setSelectedAlert} center={MAP_DEFAULT_CENTER} zoom={MAP_DEFAULT_ZOOM} />
          </div>
          <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
            {selectedAlert ? (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                  {getAlertIcon(selectedAlert.tipoAlerta)}
                  {selectedAlert.tipoAlerta}
                </h3>
                <p className="text-gray-700"><strong className="font-medium text-gray-600">Descripción:</strong> {selectedAlert.descripcion}</p>
                <p className="text-sm text-gray-500 flex items-center"><CalendarIcon className="h-4 w-4 mr-2"/> {new Date(selectedAlert.fechaReporte).toLocaleString('es-CO')}</p>
                <p className="text-sm text-gray-500 flex items-center"><UserIcon className="h-4 w-4 mr-2"/>Reportado por: {selectedAlert.nombreReportador || 'Desconocido'}</p>
                <p className="text-sm text-gray-500 flex items-center"><InformationCircleIcon className="h-4 w-4 mr-2"/>Estado: <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${selectedAlert.estado === AlertStatus.ABIERTA ? 'bg-red-100 text-red-700' : selectedAlert.estado === AlertStatus.EN_PROCESO ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{selectedAlert.estado}</span></p>
                {selectedAlert.urlMedia && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1 flex items-center"><PhotographIcon className="h-4 w-4 mr-2"/>Evidencia:</p>
                    <img src={selectedAlert.urlMedia} alt="Evidencia de alerta" className="rounded-md max-w-full h-auto shadow"/>
                  </div>
                )}
                 <button 
                    onClick={() => setSelectedAlert(null)} 
                    className="mt-4 w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-md transition duration-150"
                  >
                    Cerrar Detalles
                  </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">Selecciona un pin en el mapa para ver los detalles de la alerta, o usa los filtros para refinar tu búsqueda.</p>
            )}
          </div>
        </div>
      )}
       <p className="text-xs text-gray-500 mt-4 text-center">Datos de mapa y ubicación son simulados. En una aplicación real, se usaría Leaflet.js con OpenStreetMap o similar.</p>
    </div>
  );
};

export default AlertsMapPage;