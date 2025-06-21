
import { useSecureAuth } from "../contexts/SecureAuthContext";
import Navigation from "../components/Navigation";
import EventsManager from "../components/dashboard/EventsManager";

const EventsPage = () => {
  const { user } = useSecureAuth();

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Eventos de Campaña
          </h1>
          <p className="text-gray-600">
            Participa en nuestros eventos comunitarios y fortalece nuestra unión
          </p>
        </div>
        <EventsManager />
      </div>
    </div>
  );
};

export default EventsPage;
