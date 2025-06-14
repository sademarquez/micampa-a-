import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardStats } from '../services/electoralPwaService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { UsersIcon, BriefcaseIcon, UserGroupIcon, CalendarDaysIcon, ChartPieIcon } from '@heroicons/react/24/outline';

interface DashboardStats {
  totalVoters: number;
  adCampaignsActive: number;
  teamMembers: number;
  upcomingEvents: number;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
         <Icon className={`h-8 w-8 ${color.replace('border-', 'text-')}`} />
      </div>
    </div>
  </div>
);


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Error al cargar las estadísticas del dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando Dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {user?.nombreCompleto || 'Candidato'}!</h1>
        <p className="text-gray-600 mt-1">Aquí tienes un resumen del estado de tu campaña.</p>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Votantes Registrados" value={stats.totalVoters} icon={UsersIcon} color="border-blue-500" />
          <StatCard title="Campañas Activas" value={stats.adCampaignsActive} icon={BriefcaseIcon} color="border-green-500" />
          <StatCard title="Miembros de Equipo" value={stats.teamMembers} icon={UserGroupIcon} color="border-purple-500" />
          <StatCard title="Eventos Próximos" value={stats.upcomingEvents} icon={CalendarDaysIcon} color="border-yellow-500" />
        </div>
      ) : (
        !error && <p className="text-gray-500">No se pudieron cargar las estadísticas.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <ChartPieIcon className="h-6 w-6 mr-2 text-indigo-500"/>
            Actividad Reciente (Placeholder)
          </h2>
          <p className="text-gray-600">Aquí se mostraría un gráfico o lista de actividad reciente, como nuevos registros, interacciones, etc.</p>
          <div className="mt-4 h-64 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-gray-400">Gráfico de Actividad</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <CalendarDaysIcon className="h-6 w-6 mr-2 text-red-500"/>
            Próximos Eventos (Placeholder)
          </h2>
          <ul className="space-y-3">
            <li className="text-gray-600">Reunión con líderes barriales - Mañana 10:00 AM</li>
            <li className="text-gray-600">Entrevista en Radio Local - 3 Días</li>
            <li className="text-gray-600">Cierre de campaña Zona Sur - 1 Semana</li>
          </ul>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardPage;