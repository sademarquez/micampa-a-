import React, { useEffect, useState } from 'react';
import { getAdReports, createAdReport } from '../services/electoralPwaService';
import { AdCampaignReport } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { ChartBarIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const AdvertisingReportPage: React.FC = () => {
  const [reports, setReports] = useState<AdCampaignReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newReportData, setNewReportData] = useState<Omit<AdCampaignReport, 'id'>>({
    campaignName: '', platform: 'Facebook', startDate: '', endDate: '', budget: 0, reach: 0, engagement: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAdReports();
      setReports(data);
    } catch (err) {
      setError("Error al cargar los reportes de publicidad.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewReportData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmitNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await createAdReport(newReportData);
        setShowForm(false);
        setNewReportData({ campaignName: '', platform: 'Facebook', startDate: '', endDate: '', budget: 0, reach: 0, engagement: 0 }); // Reset form
        fetchReports(); // Refresh list
         setError(null); // Clear previous errors
    } catch (err) {
        setError("Error al crear el reporte.");
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  if (loading && reports.length === 0) {
    return <LoadingSpinner message="Cargando reportes de publicidad..." />;
  }
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES');
  const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits:0 }).format(value);


  // Tailwind classes for inputs, matching commonInputClasses used elsewhere
  const tailwindInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ChartBarIcon className="h-8 w-8 mr-3 text-blue-600" />
          Reportes de Publicidad
        </h1>
        <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
        >
            <PlusCircleIcon className="h-5 w-5 mr-2"/>
            {showForm ? 'Cancelar' : 'Nuevo Reporte'}
        </button>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      
      {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
              <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Reporte de Publicidad</h2>
              <form onSubmit={handleSubmitNewReport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">Nombre Campaña</label>
                      <input type="text" name="campaignName" id="campaignName" value={newReportData.campaignName} onChange={handleInputChange} className={tailwindInputClass} required/>
                  </div>
                  <div>
                      <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Plataforma</label>
                      <select name="platform" id="platform" value={newReportData.platform} onChange={handleInputChange} className={tailwindInputClass}>
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Google Ads">Google Ads</option>
                          <option value="Other">Otra</option>
                      </select>
                  </div>
                  <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                      <input type="date" name="startDate" id="startDate" value={newReportData.startDate} onChange={handleInputChange} className={tailwindInputClass} required/>
                  </div>
                  <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                      <input type="date" name="endDate" id="endDate" value={newReportData.endDate} onChange={handleInputChange} className={tailwindInputClass} required/>
                  </div>
                  <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Presupuesto</label>
                      <input type="number" name="budget" id="budget" value={newReportData.budget} onChange={handleInputChange} className={tailwindInputClass} required/>
                  </div>
                   <div>
                      <label htmlFor="reach" className="block text-sm font-medium text-gray-700">Alcance (Opcional)</label>
                      <input type="number" name="reach" id="reach" value={newReportData.reach || ''} onChange={handleInputChange} className={tailwindInputClass}/>
                  </div>
                  <div>
                      <label htmlFor="engagement" className="block text-sm font-medium text-gray-700">Interacción (Opcional)</label>
                      <input type="number" name="engagement" id="engagement" value={newReportData.engagement || ''} onChange={handleInputChange} className={tailwindInputClass}/>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                      <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
                          {loading ? <LoadingSpinner size="sm"/> : 'Guardar Reporte'}
                      </button>
                  </div>
              </form>
          </div>
      )}


      {loading && reports.length > 0 && <LoadingSpinner message="Actualizando..."/>}

      {reports.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaña</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plataforma</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alcance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interacción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.campaignName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.platform}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(report.startDate)} - {formatDate(report.endDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(report.budget)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reach?.toLocaleString('es-ES') || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.engagement?.toLocaleString('es-ES') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500 py-8">No hay reportes de publicidad disponibles.</p>
      )}
    </div>
  );
};

export default AdvertisingReportPage;