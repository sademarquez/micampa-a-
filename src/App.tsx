
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MapaAlertas from "./pages/MapaAlertas";
import Registro from "./pages/Registro";
import Configuracion from "./pages/Configuracion";
import Informes from "./pages/Informes";
import Liderazgo from "./pages/Liderazgo";
import RedAyudantes from "./pages/RedAyudantes";
import TasksPage from "./pages/TasksPage";
import EventsPage from "./pages/EventsPage";
import QuickActionsPage from "./pages/QuickActionsPage";
import VisitorFunnelPage from "./pages/VisitorFunnelPage";
import MobileAuditPage from "./pages/MobileAuditPage";
import { SecureAuthProvider } from "./contexts/SecureAuthContext";
import ModernMobileNavigation from './components/ModernMobileNavigation';
import ProtectedRoute from './components/ProtectedRoute';
import N8NComponentsManager from './components/N8NComponentsManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SecureAuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-negro-50 to-verde-sistema-50">
            <ModernMobileNavigation />
            
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Páginas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/index" element={<Index />} />
              <Route path="/visitor-funnel" element={<VisitorFunnelPage />} />
              <Route path="/mobile-audit" element={<MobileAuditPage />} />
              
              {/* Páginas protegidas */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/n8n-manager" element={
                <ProtectedRoute>
                  <N8NComponentsManager />
                </ProtectedRoute>
              } />
              <Route path="/mapa-alertas" element={
                <ProtectedRoute>
                  <MapaAlertas />
                </ProtectedRoute>
              } />
              <Route path="/registro" element={
                <ProtectedRoute>
                  <Registro />
                </ProtectedRoute>
              } />
              <Route path="/configuracion" element={
                <ProtectedRoute>
                  <Configuracion />
                </ProtectedRoute>
              } />
              <Route path="/informes" element={
                <ProtectedRoute>
                  <Informes />
                </ProtectedRoute>
              } />
              <Route path="/liderazgo" element={
                <ProtectedRoute>
                  <Liderazgo />
                </ProtectedRoute>
              } />
              <Route path="/red-ayudantes" element={
                <ProtectedRoute>
                  <RedAyudantes />
                </ProtectedRoute>
              } />
              <Route path="/tareas" element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              } />
              <Route path="/eventos" element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } />
              <Route path="/acciones-rapidas" element={
                <ProtectedRoute>
                  <QuickActionsPage />
                </ProtectedRoute>
              } />
            </Routes>
            
            <div className="fixed bottom-0 left-0 right-0 bg-negro-900/90 backdrop-blur-sm border-t border-verde-sistema-200 py-2 px-4 text-center text-xs text-verde-sistema-400 z-10">
              © 2025 Sistema Electoral - MI CAMPAÑA. Todos los derechos reservados.
            </div>
          </div>
        </BrowserRouter>
      </SecureAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
