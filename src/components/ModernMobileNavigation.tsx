
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { 
  Home, 
  Users, 
  MapPin, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Target,
  MessageSquare,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ModernMobileNavigation = () => {
  const { user, logout } = useSecureAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getNavigationItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Inicio", icon: Home, priority: 1 },
    ];

    if (user?.role === 'master' || user?.role === 'desarrollador') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1 },
        { href: "/dashboard?tab=visitor", label: "Visitantes", icon: Users, priority: 1 },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 2 },
        { href: "/informes", label: "Informes", icon: BarChart3, priority: 3 }
      ];
    }

    if (user?.role === 'candidato') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1 },
        { href: "/dashboard?tab=visitor", label: "Visitantes", icon: Users, priority: 1 },
        { href: "/liderazgo", label: "Liderazgo", icon: Target, priority: 2 },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 3 }
      ];
    }

    if (user?.role === 'lider') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=electoral", label: "IA", icon: Zap, priority: 1 },
        { href: "/mapa-alertas", label: "Territorio", icon: MapPin, priority: 1 },
        { href: "/registro", label: "Registro", icon: Users, priority: 2 },
        { href: "/informes", label: "Informes", icon: BarChart3, priority: 3 }
      ];
    }

    if (user?.role === 'votante') {
      return [
        ...baseItems,
        { href: "/dashboard?tab=visitor", label: "Participar", icon: Users, priority: 1 },
        { href: "/mapa-alertas", label: "Mapa", icon: MapPin, priority: 2 },
        { href: "/informes", label: "Progreso", icon: BarChart3, priority: 3 }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();
  const primaryItems = navigationItems.filter(item => item.priority === 1).slice(0, 4);

  const isActiveRoute = (href: string) => {
    if (href.includes('?tab=')) {
      const [path, query] = href.split('?');
      const params = new URLSearchParams(query);
      const tab = params.get('tab');
      return location.pathname === path && new URLSearchParams(location.search).get('tab') === tab;
    }
    return location.pathname === href;
  };

  if (!user) return null;

  return (
    <>
      {/* Header móvil */}
      <div className="sticky top-0 z-40 bg-negro-950 text-white px-4 py-3 md:hidden shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-verde-sistema-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MI CAMPAÑA</h1>
              <p className="text-xs text-verde-sistema-400">Sistema Electoral</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-verde-sistema-600 text-white text-xs px-2 py-1">
              {user.role.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="relative p-2 text-white hover:bg-negro-800"
            >
              {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay del menú */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setShowMenu(false)}
        >
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-negro-900">Menú Principal</h2>
                  <p className="text-sm text-negro-600">{user.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                        active
                          ? 'bg-verde-sistema-600 text-white'
                          : 'hover:bg-verde-sistema-50 text-negro-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-negro-200 mt-6 pt-6">
                <Link
                  to="/configuracion"
                  className="flex items-center space-x-3 p-3 rounded-xl text-negro-700 hover:bg-negro-50 transition-all duration-300"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Configuración</span>
                </Link>
                
                <Button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center space-x-3 p-3 rounded-xl bg-rojo-acento-50 text-rojo-acento-600 hover:bg-rojo-acento-100 transition-all duration-300"
                  variant="ghost"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-negro-950 text-white z-40 md:hidden">
        <div className="grid grid-cols-4 gap-1 h-16">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                  active 
                    ? 'text-verde-sistema-400 bg-negro-900' 
                    : 'text-negro-400 hover:text-verde-sistema-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Espaciado para navegación inferior */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default ModernMobileNavigation;
