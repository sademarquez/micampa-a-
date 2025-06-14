
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './components/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import AdvertisingReportPage from './pages/AdvertisingReportPage';
import RegisterVoterPage from './pages/RegisterVoterPage';
import CampaignStructurePage from './pages/CampaignStructurePage';
import ReportsPage from './pages/ReportsPage';
import PollingPlacePage from './pages/PollingPlacePage';
import VoterLocationPage from './pages/VoterLocationPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';


const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." className="min-h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading && !user) { // Muestra el spinner global solo al cargar inicialmente y si no hay usuario aún
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner message="Cargando PWA Electoral Pro..." />
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/perfil-candidato" element={<CandidateProfilePage />} />
                <Route path="/reporte-publicidad" element={<AdvertisingReportPage />} />
                <Route path="/registrar-votante" element={<RegisterVoterPage />} />
                <Route path="/estructura-campana" element={<CampaignStructurePage />} />
                <Route path="/informes" element={<ReportsPage />} />
                <Route path="/lugar-votacion" element={<PollingPlacePage />} />
                <Route path="/ubicacion-votantes" element={<VoterLocationPage />} />
                <Route path="/mensajes" element={<MessagesPage />} />
                <Route path="/configuracion" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirige raíz a dashboard si está logueado */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }/>
      </Routes>
    </HashRouter>
  );
};

export default App;
