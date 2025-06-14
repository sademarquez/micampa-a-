import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon as UserProfileIcon, MapIcon, DocumentTextIcon, CogIcon as SettingsIcon, QuestionMarkCircleIcon, PresentationChartLineIcon, ArrowLeftOnRectangleIcon as LogoutIcon, CameraIcon, ShareIcon, Squares2X2Icon as DashboardIcon, InformationCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Logo Component (Simplified)
const LogoMiCampanaIA: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center justify-center font-bold text-white ${className}`}>
    <span className="text-3xl bg-white text-sky-500 px-2 rounded-l-md">MI</span>
    <span className="text-xl bg-sky-600 text-white px-2 py-1 rounded-r-md italic shadow-sm">CAMPAÑA IA</span>
  </div>
);

// Curved Header Component
const CurvedHeader: React.FC = () => {
  const { user } = useAuth();
  const candidateName = user?.nombreCompleto || "Candidato"; // Default or from context
  const candidateAffiliation = user?.municipio ? `${user.rol} - ${user.municipio}` : (user?.rol || "Afiliación Política");
  const profileImageUrl = user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=0D8ABC&color=fff&size=128`;

  // Quick action buttons for the header based on the first image
  const quickActions = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/dashboard' }, // Assuming HomePage is dashboard
    { name: 'Alertas', icon: MapIcon, path: '/mapa-alertas' },
    { name: 'Opciones', icon: SettingsIcon, path: '/perfil' }, // Perfil como Opciones
    // Logout is handled separately or in a different menu in the images
  ];

  return (
    <header className="bg-sky-500 text-white relative overflow-hidden pb-16 md:pb-20 print:hidden"> {/* Increased padding-bottom for content below curve */}
      {/* Curved shape */}
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-sky-50" style={{ borderTopLeftRadius: '100% 50%', borderTopRightRadius: '100% 50%' }}></div>
      
      <div className="relative z-10 pt-6 pb-4 px-4 md:px-8 text-center">
        <img
          src={profileImageUrl}
          alt="Foto del Candidato"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
        />
        <h1 className="text-2xl md:text-3xl font-bold">{candidateName}</h1>
        <p className="text-sm md:text-base opacity-90">{candidateAffiliation}</p>

        {/* Quick Action Icons/Cards */}
        <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4 max-w-md mx-auto">
          {quickActions.map((action) => (
            <NavLink
              key={action.name}
              to={action.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center bg-white/90 hover:bg-white text-sky-700 p-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 ${
                  isActive ? 'ring-2 ring-sky-300 bg-white' : ''
                }`
              }
            >
              <action.icon className="h-6 w-6 md:h-7 md:h-7 mb-1" />
              <span className="text-xs md:text-sm font-medium">{action.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

// Bottom Tab Bar Component
interface BottomTabBarItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const BottomTabBar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const commonNavItems: BottomTabBarItem[] = [
    { path: '/dashboard', icon: DashboardIcon, label: 'Inicio' }, // HomePage as Dashboard
    { path: '/mapa-alertas', icon: MapIcon, label: 'Alertas' },
    { path: '/ayuda', icon: QuestionMarkCircleIcon, label: 'Ayuda' },
    { path: '/perfil', icon: UserProfileIcon, label: 'Perfil' },
  ];
  
  const leaderNavItems: BottomTabBarItem[] = [
    { path: '/reportar-alerta', icon: DocumentTextIcon, label: 'Reportar'},
    { path: '/panel-lider', icon: UserGroupIcon, label: 'Mi Equipo'},
  ];

  let navItems = commonNavItems;
  if (user && (user.rol?.startsWith('LIDER') || user.rol === 'ADMINISTRADOR')) {
    // Insert leader items, ensuring we don't exceed 5 items for typical bottom bars
    // For this example, let's keep it simple and show common ones + leader specific
    // A more complex logic might replace/prioritize items
    navItems = [
        { path: '/dashboard', icon: DashboardIcon, label: 'Inicio' },
        { path: '/mapa-alertas', icon: MapIcon, label: 'Alertas' },
        { path: '/reportar-alerta', icon: DocumentTextIcon, label: 'Reportar'},
        { path: '/panel-lider', icon: UserGroupIcon, label: 'Equipo'},
        { path: '/perfil', icon: UserProfileIcon, label: 'Perfil' },
    ].slice(0,5); // Max 5 items
  }


  // Hide on login page
  if (location.pathname === '/login') {
    return null;
  }


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top-md z-20 pb-safe print:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center pt-2 pb-1 text-xs font-medium transition-colors ${
                isActive ? 'text-sky-500' : 'text-gray-500 hover:text-sky-400'
              }`
            }
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span className="truncate w-full text-center">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .shadow-top-md { box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05), 0 -2px 4px -1px rgba(0, 0, 0, 0.03); }
      `}</style>
    </nav>
  );
};


// Main Layout Component
const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading && !user && location.pathname !== '/login') {
    // Show a global loader if not on login and still loading user
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        {/* Placeholder for a global loading spinner if needed */}
      </div>
    );
  }

  // Determine if header should be shown (e.g., not on login page)
  const showHeader = user && location.pathname !== '/login';

  return (
    <div className="flex flex-col min-h-screen bg-sky-50">
      {showHeader && <CurvedHeader />}
      
      {/* Main content area */}
      {/* Added negative margin to pull content slightly "into" the curve of the header */}
      {/* Padding ensures content doesn't actually go under header */}
      <main className={`flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${showHeader ? 'relative z-0 -mt-12 md:-mt-16' : ''} mb-16`}> {/* mb-16 for bottom tab bar */}
        {children}
      </main>
      
      {user && <BottomTabBar />} {/* Show bottom tab bar only if user is logged in */}
    </div>
  );
};

export default MainLayout;