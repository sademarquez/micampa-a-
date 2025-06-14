import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CampaignStats } from '../types';
import { getCampaignStats } from '../services/campaignService';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  UserPlusIcon, 
  DocumentChartBarIcon, 
  WrenchScrewdriverIcon as StructureIcon, // Using WrenchScrewdriver for "Estructura" as more generic
  InformationCircleIcon as ReportsIcon, // Using Info for generic "Informes"
  MapPinIcon as PollingPlaceIcon,
  GlobeEuropeAfricaIcon as VoterLocationIcon, // Using Globe for "Ubicación Votantes"
  MegaphoneIcon // For "Reporte de Publicidad", using Megaphone
} from '@heroicons/react/24/outline';

interface ModuleLink {
  to: string;
  text: string;
  icon: React.ElementType;
  description: string;
}

const moduleLinks: ModuleLink[] = [
  // These are based on the first image's list of modules under the curved header
  // Assuming the user is a leader/admin to see all these
  { to: '/#', text: 'Reporte de publicidad', icon: MegaphoneIcon, description: 'Gestiona y analiza tus campañas.' }, // Placeholder link
  { to: '/#', text: 'Registrar votante', icon: UserPlusIcon, description: 'Añade nuevos simpatizantes.' }, // Placeholder link
  { to: '/panel-lider', text: 'Estructura', icon: StructureIcon, description: 'Organiza tu equipo de campaña.' }, // Panel de Lider for structure
  { to: '/#', text: 'Informes', icon: ReportsIcon, description: 'Visualiza datos y progreso.' }, // Placeholder link
  { to: '/#', text: 'Lugar de Votación', icon: PollingPlaceIcon, description: 'Consulta puestos de votación.' }, // Placeholder link
  { to: '/mapa-alertas', text: 'Ubicación Votantes', icon: VoterLocationIcon, description: 'Visualiza alertas en el mapa.' }, // MapAlerts for Voter Location concept
];


const HomePage: React.FC = () => {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const campaignStats = await getCampaignStats();
        setStats(campaignStats);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner message="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section - adapting the style from previous version */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <UsersIcon className="h-10 w-10 text-sky-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-700">{stats.numeroMiembros.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Miembros</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <ShieldCheckIcon className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-700">{stats.numeroAlertasAtendidas.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Alertas Atendidas</p>
          </div>
        </div>
      )}

      {/* Module Links Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 px-1">Acciones Rápidas</h2>
        {moduleLinks.map((link) => (
          <Link
            key={link.text}
            to={link.to}
            className="flex items-center bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.02]"
          >
            <link.icon className="h-8 w-8 text-sky-500 mr-4 flex-shrink-0" />
            <div className="flex-grow">
              <h3 className="text-base font-semibold text-gray-800">{link.text}</h3>
              <p className="text-xs text-gray-500">{link.description}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
