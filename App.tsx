
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // Using "Mi Campaña" AuthContext
import MainLayout from './components/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Pages for "Mi Campaña"
import AuthPage from './pages/AuthPage'; // Now for "Mi Campaña" user login/registration
import HomePage from './pages/HomePage'; // Was DashboardPage, now main landing for "Mi Campaña"
import AlertsMapPage from './pages/AlertsMapPage';
import ReportAlertPage from './pages/ReportAlertPage';
import UserProfilePage from './pages/UserProfilePage'; // Was CandidateProfilePage
import LeaderDashboardPage from './pages/LeaderDashboardPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';


const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <LoadingSpinner message="Verificando autenticación..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <LoadingSpinner message="Cargando Mi Campaña IA..." />
      </div>
    );
  }

  return (
    <HashRouter>
      <MainLayout> {/* MainLayout now handles the overall structure including header and bottom bar */}
        <Routes>
          <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/mapa-alertas" element={<ProtectedRoute><AlertsMapPage /></ProtectedRoute>} />
          <Route path="/reportar-alerta" element={<ProtectedRoute><ReportAlertPage /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/panel-lider" element={<ProtectedRoute><LeaderDashboardPage /></ProtectedRoute>} />
          <Route path="/ayuda" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
          
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;