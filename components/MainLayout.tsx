
import React, { useState, ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SocialMediaLinks from './SocialMediaLinks';
import {
  HomeIcon, ChartBarIcon, UserPlusIcon, UsersIcon, DocumentChartBarIcon, MapPinIcon, GlobeAltIcon, ChatBubbleLeftRightIcon, CogIcon, ArrowLeftOnRectangleIcon, UserCircleIcon, Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  to: string;
  text: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { to: '/dashboard', text: 'Dashboard', icon: HomeIcon },
  { to: '/perfil-candidato', text: 'Perfil Candidato', icon: UserCircleIcon },
  { to: '/reporte-publicidad', text: 'Reporte Publicidad', icon: ChartBarIcon },
  { to: '/registrar-votante', text: 'Registrar Votante', icon: UserPlusIcon },
  { to: '/estructura-campana', text: 'Estructura Campaña', icon: UsersIcon },
  { to: '/informes', text: 'Informes', icon: DocumentChartBarIcon },
  { to: '/lugar-votacion', text: 'Lugar de Votación', icon: MapPinIcon },
  { to: '/ubicacion-votantes', text: 'Ubicación Votantes', icon: GlobeAltIcon },
  { to: '/mensajes', text: 'Mensajes', icon: ChatBubbleLeftRightIcon },
  { to: '/configuracion', text: 'Configuración', icon: CogIcon },
];

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      <div className="px-4 py-6">
        <Link to="/dashboard" className="text-white text-2xl font-semibold">
          PWA Electoral
        </Link>
      </div>
      <nav className="mt-4 flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.text}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                isActive ? 'bg-gray-700 text-white' : ''
              }`
            }
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.text}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </>
  );


  if (!user) {
    // Si no hay usuario, el AuthPage se encargará de esto o se redirigirá.
    // Este layout es para cuando el usuario está autenticado.
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800 text-white">
          <SidebarContent/>
        </div>
      </aside>

      {/* Sidebar para móvil (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 text-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Cerrar sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent/>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar para móvil con botón de menú */}
        <header className="md:hidden bg-gray-800 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Abrir sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
               <Link to="/dashboard" className="text-white text-xl font-semibold">
                PWA Electoral
              </Link>
              <div className="flex items-center">
                 {/* Espacio para ícono de perfil o notificaciones si se desea */}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8 main-content">
          {children}
        </main>

        <footer className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} PWA Electoral Pro. Todos los derechos reservados.</p>
            <SocialMediaLinks />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
