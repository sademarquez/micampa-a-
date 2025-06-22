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
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PageLayout from './components/PageLayout';
import SecureLogin from './pages/SecureLogin';
import RegistroPersonalizado from './pages/RegistroPersonalizado';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/secure-login" element={<SecureLogin />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registro-personalizado" element={<RegistroPersonalizado />} />
            
            {/* Rutas Protegidas */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/liderazgo" element={
                        <div className="flex h-screen">
                          <ModernNavigation />
                          <main className="flex-1 overflow-auto">
                            <Liderazgo />
                          </main>
                        </div>
                      } />
                      <Route path="/estructura" element={
                        <div className="flex h-screen">
                          <ModernNavigation />
                          <main className="flex-1 overflow-auto">
                            <Estructura />
                          </main>
                        </div>
                      } />
                      <Route path="/developer" element={
                        <div className="flex h-screen">
                          <ModernNavigation />
                          <main className="flex-1 overflow-auto">
                            <DeveloperPage />
                          </main>
                        </div>
                      } />
                      <Route path="/system-testing" element={
                        <div className="flex h-screen">
                          <ModernNavigation />
                          <main className="flex-1 overflow-auto">
                            <SystemTesting />
                          </main>
                        </div>
                      } />
                    </Routes>
                  </PageLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
