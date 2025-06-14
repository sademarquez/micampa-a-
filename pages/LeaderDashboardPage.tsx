import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Alert, UserRole } from '../types'; // Import UserRole
import { getMyTeam, sendMessageToTeam, getAlertsData } from '../services/campaignService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { UsersIcon, EnvelopeIcon as MailIcon, PresentationChartLineIcon, ArrowLeftIcon, IdentificationIcon, PhoneIcon, MapPinIcon as LocationMarkerIcon, HashtagIcon, StarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const LeaderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [leaderAlerts, setLeaderAlerts] = useState<Alert[]>([]);
  const [message, setMessage] = useState('');
  
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isLeaderRole = user && (
    user.rol === UserRole.ADMINISTRADOR ||
    user.rol === UserRole.LIDER_BARRIO ||
    user.rol === UserRole.LIDER_MUNICIPAL ||
    user.rol === UserRole.LIDER_VEREDA ||
    user.rol === UserRole.LIDER_ZONAL
  );

  useEffect(() => {
    if (user && isLeaderRole) {
      const fetchTeam = async () => {
        setLoadingTeam(true);
        try {
          const team = await getMyTeam(user.userID); // user.userID is now available
          setTeamMembers(team);
        } catch (err) {
          console.error("Error al cargar equipo:", err);
          setError("No se pudo cargar la información del equipo.");
        } finally {
          setLoadingTeam(false);
        }
      };

      const fetchAlerts = async () => {
        setLoadingAlerts(true);
        try {
            const allAlerts = await getAlertsData();
            setLeaderAlerts(allAlerts.filter(alert => alert.reportadoPorUserID === user.userID)); // user.userID
        } catch (err) {
            console.error("Error al cargar alertas del líder:", err);
            // setError("No se pudo cargar las alertas reportadas."); // Avoid overwriting team error
        } finally {
            setLoadingAlerts(false);
        }
      };
      
      fetchTeam();
      fetchAlerts();
    }
  }, [user, isLeaderRole]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !message.trim()) {
      setError("El mensaje no puede estar vacío.");
      return;
    }
    setSendingMessage(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await sendMessageToTeam(user.userID, message); // user.userID
      if (response.success) {
        setSuccess(response.message);
        setMessage('');
      } else {
        setError(response.message || "No se pudo enviar el mensaje.");
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("Ocurrió un error al enviar el mensaje.");
    } finally {
      setSendingMessage(false);
    }
  };
  
  const Card: React.FC<{title: string, value: string | number, icon: React.ReactNode, colorClass: string}> = ({title, value, icon, colorClass}) => (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${colorClass} text-white`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className="text-4xl opacity-80">{icon}</div>
        </div>
    </div>
  );


  if (loadingTeam || loadingAlerts) {
    return <LoadingSpinner message="Cargando panel de líder..." />;
  }

  if (!user || !isLeaderRole) {
    return <p className="text-center text-red-500">Acceso no autorizado.</p>;
  }

  return (
    <div className="space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-0">
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Volver
      </button>
      <h1 className="text-3xl font-bold text-gray-800">Panel de Líder: {user.nombreCompleto}</h1> 
      
      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card title="Miembros del Equipo" value={teamMembers.length} icon={<UsersIcon />} colorClass="bg-gradient-to-r from-blue-500 to-blue-600" />
        <Card title="Alertas Reportadas" value={leaderAlerts.length} icon={<PresentationChartLineIcon />} colorClass="bg-gradient-to-r from-green-500 to-green-600" />
        <Card title="Puntos de Compromiso" value={user.puntosCompromiso} icon={<StarIcon />} colorClass="bg-gradient-to-r from-yellow-500 to-yellow-600" />
      </section>

      {/* Team Members List */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <UsersIcon className="h-7 w-7 mr-3 text-blue-600"/>Mi Equipo ({teamMembers.length})
        </h2>
        {teamMembers.length > 0 ? (
          <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {teamMembers.map((member) => (
              <li key={member.userID} className="py-4 px-2 hover:bg-gray-50 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{member.nombreCompleto}</p>
                    <p className="text-xs text-gray-500 truncate flex items-center"><PhoneIcon className="h-3 w-3 mr-1 text-gray-400"/>{member.telefono}</p>
                    <p className="text-xs text-gray-500 truncate flex items-center"><LocationMarkerIcon className="h-3 w-3 mr-1 text-gray-400"/>{member.municipio} - {member.barrioVereda}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-gray-500 flex items-center justify-end"><StarIcon className="h-3 w-3 mr-1 text-yellow-400"/>{member.puntosCompromiso} pts</p>
                     <p className="text-xs text-gray-500"><HashtagIcon className="h-3 w-3 mr-1 text-gray-400 inline-block"/>{member.rol}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aún no has registrado ningún miembro en tu equipo.</p>
        )}
      </section>

      {/* Send Message to Team */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <MailIcon className="h-7 w-7 mr-3 text-green-600"/>Enviar Mensaje a mi Equipo
        </h2>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje de Difusión (Vía WhatsApp simulado)</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Escribe tu mensaje aquí..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={sendingMessage || teamMembers.length === 0}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {sendingMessage ? <LoadingSpinner size="sm" /> : 'Enviar Mensaje'}
          </button>
          {teamMembers.length === 0 && <p className="text-xs text-red-500 text-center mt-2">No tienes miembros en tu equipo para enviar mensajes.</p>}
        </form>
      </section>
    </div>
  );
};

export default LeaderDashboardPage;