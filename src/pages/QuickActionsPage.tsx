
import { useSecureAuth } from "../contexts/SecureAuthContext";
import Navigation from "../components/Navigation";
import QuickActions from "../components/dashboard/QuickActions";

const QuickActionsPage = () => {
  const { user } = useSecureAuth();

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <QuickActions />
      </div>
    </div>
  );
};

export default QuickActionsPage;
