
import React, { useEffect, useState } from 'react';
import { getPollingPlaces } from '../services/electoralPwaService';
import { PollingPlace } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

// Mock Leaflet.js para UI
const MockMapDisplay: React.FC<{ places: PollingPlace[] }> = ({ places }) => (
  <div className="w-full h-96 bg-gray-300 rounded-lg shadow-md relative overflow-hidden">
    <p className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded text-xs text-gray-700">Mapa simulado (Leaflet.js)</p>
    {places.slice(0, 5).map((place, index) => ( // Mostrar solo algunos para no saturar
      <div
        key={place.id}
        className="absolute p-1 bg-red-500 rounded-full shadow-lg"
        style={{
          left: `${10 + index * 18 + Math.random()*5}%`,
          top: `${20 + (index % 2) * 30 + Math.random()*10}%`,
        }}
        title={place.name}
      >
        <MapPinIcon className="h-5 w-5 text-white" />
      </div>
    ))}
  </div>
);


const PollingPlacePage: React.FC = () => {
  const [places, setPlaces] = useState<PollingPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const data = await getPollingPlaces();
        setPlaces(data);
      } catch (err) {
        setError("Error al cargar los lugares de votación.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Cargando lugares de votación..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <MapPinIcon className="h-8 w-8 mr-3 text-red-600" />
        Lugares de Votación
      </h1>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="mb-6">
          <input 
            type="text"
            placeholder="Buscar por nombre, dirección o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <MockMapDisplay places={filteredPlaces} />
        </div>
        <div className="lg:col-span-1 max-h-[450px] overflow-y-auto pr-2 space-y-4">
            {filteredPlaces.length > 0 ? (
                filteredPlaces.map(place => (
                    <div key={place.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-800">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.address}, {place.city}</p>
                        {place.openingHours && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1 text-gray-400"/> Horario: {place.openingHours}
                            </p>
                        )}
                        {/* Aquí podrían ir más detalles o un botón para ver en mapa */}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-8">No se encontraron lugares de votación con ese criterio.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default PollingPlacePage;
