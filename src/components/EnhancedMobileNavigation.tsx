
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BarChart3, 
  MapPin, 
  Users, 
  MessageSquare,
  Bell,
  Settings,
  Calendar,
  ClipboardList,
  Zap,
  Eye,
  Target,
  TrendingUp,
  Smartphone,
  Menu,
  X,
  ChevronRight,
  Shield,
  Database,
  Wifi,
  Battery
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: any;
  roles: string[];
  badge?: number;
  category: 'main' | 'tools' | 'reports' | 'admin';
}

const EnhancedMobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('main');
  const [notifications, setNotifications] = useState(12);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, systemHealth } = useSecureAuth();

  const navItems: NavItem[] = [
    // Navegación Principal
    { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['all'], category: 'main' },
    { path: '/mapa-alertas', label: 'Mapa Electoral', icon: MapPin, roles: ['all'], category: 'main' },
    { path: '/registro', label: 'Registro Votantes', icon: Users, roles: ['all'], category: 'main' },
    { path: '/liderazgo', label: 'Liderazgo', icon: Target, roles: ['desarrollador', 'master', 'candidato'], category: 'main' },
    
    // Herramientas Operativas
    { path: '/tareas', label: 'Tareas', icon: ClipboardList, roles: ['all'], badge: 5, category: 'tools' },
    { path: '/eventos', label: 'Eventos', icon: Calendar, roles: ['all'], badge: 3, category: 'tools' },
    { path: '/acciones-rapidas', label: 'Acciones Rápidas', icon: Zap, roles: ['all'], category: 'tools' },
    { path: '/red-ayudantes', label: 'Red Ayudantes', icon: MessageSquare, roles: ['desarrollador', 'master'], category: 'tools' },
    
    // Informes y Analytics
    { path: '/informes', label: 'Informes', icon: BarChart3, roles: ['all'], category: 'reports' },
    { path: '/visitor-funnel', label: 'Análisis Visitantes', icon: TrendingUp, roles: ['all'], category: 'reports' },
    { path: '/mobile-audit', label: 'Auditoría Móvil', icon: Smartphone, roles: ['desarrollador', 'master'], category: 'reports' },
    
    // Administración
    { path: '/configuracion', label: 'Configuración', icon: Settings, roles: ['desarrollador', 'master'], category: 'admin' }
  ];

  const categories = [
    { id: 'main', label: 'Principal', icon: Home },
    { id: 'tools', label: 'Herramientas', icon: Zap },
    { id: 'reports', label: 'Informes', icon: BarChart3 },
    { id: 'admin', label: 'Admin', icon: Settings }
  ];

  const filteredItems = navItems.filter(item => {
    if (!isAuthenticated && !['/', '/login', '/visitor-funnel', '/mobile-audit'].includes(item.path)) {
      return false;
    }
    
    if (item.category !== activeCategory) return false;
    
    if (item.roles.includes('all')) return true;
    
    return user?.role && item.roles.includes(user.role);
  });

  // Monitoreo de conectividad y batería
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // API de batería (si está disponible)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cierre automático al navegar
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const getHealthColor = () => {
    switch (systemHealth) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Solo mostrar en móvil y tablets
  if (typeof window !== 'undefined' && window.innerWidth > 1024) {
    return null;
  }

  return (
    <>
      {/* Barra Superior Fija */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 border-b border-white/20 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo y Estado */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="text-white hover:bg-white/20 p-2"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">MI CAMPAÑA</span>
            </div>
          </div>

          {/* Indicadores de Estado */}
          <div className="flex items-center gap-2">
            {/* Estado de Conectividad */}
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}
                 title={isOnline ? 'En línea' : 'Sin conexión'} />
            
            {/* Estado del Sistema */}
            <div className={`w-2 h-2 rounded-full ${getHealthColor()}`}
                 title={`Sistema: ${systemHealth}`} />
            
            {/* Batería */}
            {batteryLevel !== null && (
              <div className="flex items-center gap-1 text-white text-xs">
                <Battery className="w-3 h-3" />
                <span>{batteryLevel}%</span>
              </div>
            )}
            
            {/* Notificaciones */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative p-2"
              aria-label={`${notifications} notificaciones`}
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.2rem] h-5 flex items-center justify-center p-0">
                  {notifications > 99 ? '99+' : notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel de Navegación Deslizante */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header del Panel */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h2 className="font-bold text-lg">MI CAMPAÑA 2025</h2>
                <p className="text-blue-200 text-sm">Sistema Electoral</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Información del Usuario */}
          {isAuthenticated && user && (
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white truncate">{user.name}</p>
                  <p className="text-blue-200 text-xs capitalize">{user.role}</p>
                  {user.territory && (
                    <p className="text-blue-300 text-xs">{user.territory}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categorías de Navegación */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${isActive 
                      ? 'text-blue-600 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
                    }
                  `}
                  aria-pressed={isActive}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Navegación */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2" role="navigation" aria-label="Navegación principal">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.badge && item.badge > 0 && (
                      <Badge className={`text-xs ${isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer del Panel */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3" />
              <span>BD: {isOnline ? 'Conectada' : 'Offline'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3" />
              <span>{isOnline ? 'En línea' : 'Sin conexión'}</span>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">© 2025 sademarquezDLL</p>
          </div>
        </div>
      </div>

      {/* Espaciador para el contenido */}
      <div className="h-16" />
    </>
  );
};

export default EnhancedMobileNavigation;
