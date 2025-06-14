import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types'; // Import UserRole from types.ts
import { HomeIcon, MapIcon, ChatBubbleLeftEllipsisIcon, DocumentTextIcon, Squares2X2Icon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, UserPlusIcon as UserAddIcon, Bars3Icon as MenuIcon, XMarkIcon as XIcon, UserCircleIcon } from '@heroicons/react/24/outline';


const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const commonLinks = [
    { to: '/', text: 'Inicio', icon: <HomeIcon className="h-5 w-5 mr-2" /> },
    { to: '/mapa-alertas', text: 'Mapa de Alertas', icon: <MapIcon className="h-5 w-5 mr-2" /> },
    { to: '/ayuda', text: 'Ayuda', icon: <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2" /> },
  ];

  const guestLinks = [
    { to: '/login', text: 'Iniciar Sesión', icon: <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> },
    { to: '/registro', text: 'Registrarse', icon: <UserAddIcon className="h-5 w-5 mr-2" /> },
  ];

  const userLinks = [
    { to: '/perfil', text: 'Mi Perfil', icon: <UserCircleIcon className="h-5 w-5 mr-2" /> },
  ];

  const leaderLinks = [
    { to: '/reportar-alerta', text: 'Reportar Alerta', icon: <DocumentTextIcon className="h-5 w-5 mr-2" /> },
    { to: '/panel-lider', text: 'Panel de Líder', icon: <Squares2X2Icon className="h-5 w-5 mr-2" /> },
  ];
  
  const renderLinks = (links: { to: string; text: string; icon: React.ReactNode }[]) => links.map(link => (
    <Link
      key={link.to}
      to={link.to}
      onClick={() => setIsOpen(false)}
      className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      {link.icon}{link.text}
    </Link>
  ));

  const isLeaderOrAdmin = user && (user.rol === UserRole.ADMINISTRADOR ||
    user.rol === UserRole.LIDER_BARRIO ||
    user.rol === UserRole.LIDER_MUNICIPAL ||
    user.rol === UserRole.LIDER_VEREDA ||
    user.rol === UserRole.LIDER_ZONAL);


  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white font-bold text-xl">
              Mi Campaña
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {renderLinks(commonLinks)}
              {user && renderLinks(userLinks)}
              {isLeaderOrAdmin && renderLinks(leaderLinks)}
              {!user ? renderLinks(guestLinks) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                 <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" /> Salir
                </button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {!isOpen ? (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderLinks(commonLinks)}
            {user && renderLinks(userLinks)}
            {isLeaderOrAdmin && renderLinks(leaderLinks)}
            {!user ? renderLinks(guestLinks) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                 <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" /> Salir
                </button>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;