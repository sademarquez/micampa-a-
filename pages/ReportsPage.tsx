
import React, { useEffect, useState } from 'react';
import { getGeneralReports } from '../services/electoralPwaService';
import { GeneralReport } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { DocumentChartBarIcon, CalendarDaysIcon, LinkIcon } from '@heroicons/react/24/outline';

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<GeneralReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getGeneralReports();
        setReports(data);
      } catch (err) {
        setError("Error al cargar los informes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return <LoadingSpinner message="Cargando informes..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <DocumentChartBarIcon className="h-8 w-8 mr-3 text-purple-600" />
        Informes Generales
      </h1>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{report.title}</h2>
              <p className="text-sm text-gray-500 mb-3 flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1.5 text-gray-400"/>
                Generado: {formatDate(report.generatedDate)}
              </p>
              <p className="text-gray-700 flex-grow mb-4">{report.summary}</p>
              {report.dataUrl && (
                <a
                  href={report.dataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  <LinkIcon className="h-4 w-4 mr-1.5"/>
                  Ver Detalles / Datos
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
         !error && <p className="text-center text-gray-500 py-8">No hay informes disponibles.</p>
      )}
    </div>
  );
};

export default ReportsPage;
