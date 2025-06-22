import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, MapPin, User, BarChart3, Network, LogOut, FileText, Shield, Zap, Code, Beaker } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import ModernMobileNavigation from "./ModernMobileNavigation";

interface NavigationProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks: NavLink[] = [
    {
      path: '/dashboard',
      icon: <BarChart3 size={20} />,
      label: 'Dashboard',
    },
    {
      path: '/dashboard?tab=electoral',
      icon: <Zap size={20} />,
      label: 'IA Electoral',
    },
    {
      path: '/dashboard?tab=visitor',
      icon: <Users size={20} />,
      label: 'Visitantes',
    },
    {
      path: '/registro',
      icon: <User size={20} />,
      label: 'Registro',
    },
    {
      path: '/mapa-alertas',
      icon: <MapPin size={20} />,
      label: 'Mapa',
    },
    {
      path: '/informes',
      icon: <FileText size={20} />,
      label: 'Informes',
    },
    {
      path: '/liderazgo',
      icon: <Users size={20} />,
      label: 'Liderazgo',
    },
    {
      path: '/red-ayudantes',
      icon: <Network size={20} />,
      label: 'Red Ayudantes',
    },
    {
      path: '/configuracion',
      icon: <Shield size={20} />,
      label: 'Configuración',
    },
    {
      path: '/developer',
      icon: <Code size={20} />,
      label: 'Developer',
      roles: ['desarrollador'],
    },
    {
      path: '/system-testing',
      icon: <Beaker size={20} />,
      label: 'System Testing',
      roles: ['desarrollador'],
    },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !link.roles || (user && user.role && link.roles.includes(user.role))
  );

  const sidebarClasses = cn(
    'fixed inset-y-0 left-0 z-30 w-64 px-4 py-8 transform transition-transform duration-300 ease-in-out',
    theme.backgroundColor, // Usa el color de fondo del tema
    'border-r',
    theme.borderColor, // Usa el color de borde del tema
    {
      'translate-x-0': isSidebarOpen,
      '-translate-x-full': !isSidebarOpen,
    },
    'lg:relative lg:translate-x-0' // Siempre visible en pantallas grandes
  );

  const isActiveRoute = (href: string) => {
    if (href.includes('?tab=')) {
      const [path, query] = href.split('?');
      const params = new URLSearchParams(query);
      const tab = params.get('tab');
      return location.pathname === path && new URLSearchParams(location.search).get('tab') === tab;
    }
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Si no hay usuario autenticado, no mostrar la navegación
  if (!user) {
    return null;
  }

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <aside className={sidebarClasses}>
        <a href="#" className="flex items-center px-4">
          <svg
            className="w-8 h-8 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <span className={`text-2xl font-bold ${theme.textColor}`}>Agora</span>
        </a>

        <nav className="mt-8">
          {filteredLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className={cn(
                'flex items-center mt-4 py-2 px-6 rounded-md transition-colors duration-200',
                isActiveRoute(link.path)
                  ? `${theme.buttonClass} shadow-lg` // Estilo activo del tema
                  : `${theme.textColor} hover:bg-gray-200/50 dark:hover:bg-gray-700/50`
              )}
            >
              {link.icon}
              <span className="mx-3">{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navigation;
