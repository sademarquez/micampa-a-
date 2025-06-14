
import React, { useEffect, useState } from 'react';
import { getVoterLocationData } from '../services/electoralPwaService'; // Asume que existe un servicio
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

// Mock de un mapa de calor o visualización GeoJSON
const MockHeatMap: React.FC<{ data: any }> = ({ data }) => {
  if (!data || !data.features || data.features.length === 0) {
    return <p className="text-gray-500 text-center">No hay datos de ubicación para mostrar.</p>;
  }
  // Simulación muy básica de visualización de datos
  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg shadow-md relative p-4 overflow-auto">
        <p className="absolute top-2 left-2 bg-white bg-opacity-75 p-1 rounded text-xs text-gray-700">Visualización de Mapa (Simulado)</p>
        <h4 className="text-sm font-semibold mb-2">Concentración de Votantes (Simulado):</h4>
        <ul className="list-disc list-inside">
        {data.features.map((feature: any, index: number) => (
            <li key={index} className="text-xs">
            {feature.properties.city}: {feature.properties.count} votantes
            </li>
        ))}
        </ul>
        <p className="mt-4 text-xs text-gray-500">Esto es una representación simulada. En una app real, se usaría una librería de mapas (Leaflet, Mapbox GL JS, Google Maps API) para mostrar un mapa de calor o marcadores GeoJSON.</p>
    </div>
  );
};


const VoterLocationPage: React.FC = () => {
  const [locationData, setLocationData] = useState<any>(null); // Debería ser un tipo GeoJSON o similar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getVoterLocationData(); // Llama al servicio
        setLocationData(data);
      } catch (err) {
        setError("Error al cargar los datos de ubicación de votantes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando datos de ubicación de votantes..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <GlobeAltIcon className="h-8 w-8 mr-3 text-cyan-600" />
        Ubicación de Votantes
      </h1>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
        <p className="text-gray-600 mb-4">
          Visualización de la distribución geográfica de los votantes registrados. Esto puede ayudar a identificar áreas clave y optimizar esfuerzos de campaña.
        </p>
        <MockHeatMap data={locationData} />
      </div>
    </div>
  );
};

export default VoterLocationPage;
