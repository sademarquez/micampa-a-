import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SecureAuthProvider } from "./contexts/SecureAuthContext";
import { ModernErrorBoundary } from "./components/ModernErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Liderazgo from "./pages/Liderazgo";
import Estructura from "./pages/Estructura";
import DeveloperPage from "./pages/Developer";
import SystemTesting from "./pages/SystemTesting";
import { ModernNavigation } from "./components/ModernNavigation";

function App() {
  return (
    <ModernErrorBoundary>
      <SecureAuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* Rutas protegidas con navegación moderna */}
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <ModernNavigation />
                    <main className="flex-1 overflow-auto">
                  <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/liderazgo" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <ModernNavigation />
                    <main className="flex-1 overflow-auto">
                  <Liderazgo />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/estructura" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <ModernNavigation />
                    <main className="flex-1 overflow-auto">
                      <Estructura />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/developer" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <ModernNavigation />
                    <main className="flex-1 overflow-auto">
                      <DeveloperPage />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/system-testing" element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <ModernNavigation />
                    <main className="flex-1 overflow-auto">
                      <SystemTesting />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </SecureAuthProvider>
    </ModernErrorBoundary>
  );
}

export default App;
