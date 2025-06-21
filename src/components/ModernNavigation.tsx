import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Target, 
  BarChart3, 
  Settings, 
  Brain, 
  MessageSquare, 
  MapPin,
  FileText,
  Bell,
  Search,
  Menu,
  X,
  Zap,
  Shield,
  Globe,
  Database,
  Code,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Custom Hook para notificaciones
const useNotifications = () => {
  const [notifications] = useState([
    { id: 1, type: 'ai', message: 'IA detectó nueva tendencia', time: '2m' },
    { id: 2, type: 'system', message: 'Sincronización completada', time: '5m' },
    { id: 3, type: 'alert', message: 'Alto engagement en zona norte', time: '10m' }
  ]);

  return notifications;
};

// Componente de Logo
const AgoraLogo = () => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
      <Brain className="w-6 h-6 text-white" />
    </div>
    <div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        AGORA
      </h1>
      <p className="text-xs text-gray-500">Inteligencia Electoral</p>
    </div>
  </div>
);

// Componente de Item de Navegación
const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  badge, 
  isActive 
}: {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: string | number;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
    <span className="font-medium">{label}</span>
    {badge && (
      <Badge 
        variant={isActive ? 'default' : 'secondary'} 
        className="ml-auto text-xs"
      >
        {badge}
      </Badge>
    )}
  </Link>
);

// Componente de Notificación
const NotificationItem = ({ notification }: { notification: any }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return Brain;
      case 'system': return Database;
      case 'alert': return Bell;
      default: return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'ai': return 'text-purple-600 bg-purple-100';
      case 'system': return 'text-blue-600 bg-blue-100';
      case 'alert': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const Icon = getIcon(notification.type);

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${getColor(notification.type)}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
        <p className="text-xs text-gray-500">{notification.time}</p>
      </div>
    </div>
  );
};

// Componente de Búsqueda
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      toast({
        title: "🔍 Búsqueda iniciada",
        description: `Buscando: "${query}"`,
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar en Agora..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
      />
    </form>
  );
};

// Navegación Principal
export const ModernNavigation = () => {
  const location = useLocation();
  const notifications = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard', badge: undefined },
    { to: '/liderazgo', icon: Users, label: 'Liderazgo', badge: '12' },
    { to: '/estructura', icon: Target, label: 'Estructura', badge: undefined },
    { to: '/informes', icon: BarChart3, label: 'Informes', badge: '3' },
    { to: '/mensajes', icon: MessageSquare, label: 'Mensajes', badge: '5' },
    { to: '/mapa', icon: MapPin, label: 'Mapa', badge: undefined },
    { to: '/developer', icon: Code, label: 'Developer', badge: 'IA' },
    { to: '/configuracion', icon: Settings, label: 'Configuración', badge: undefined }
  ];

  const handleNotificationClick = () => {
    toast({
      title: "🔔 Notificaciones",
      description: "Panel de notificaciones abierto",
    });
  };

  return (
    <>
      {/* Navegación Desktop */}
      <nav className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 h-screen sticky top-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <AgoraLogo />
        </div>

        {/* Búsqueda */}
        <div className="p-4 border-b border-gray-200">
          <SearchBar />
        </div>

        {/* Navegación Principal */}
        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              isActive={location.pathname === item.to}
            />
          ))}
        </div>

        {/* Footer con Estado del Sistema */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Sistema Online</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Database className="w-3 h-3" />
            <span>IA Operativa</span>
          </div>
        </div>
      </nav>

      {/* Navegación Mobile */}
      <div className="lg:hidden">
        {/* Header Mobile */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center justify-between p-4">
            <AgoraLogo />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotificationClick}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Búsqueda Mobile */}
          <div className="px-4 pb-4">
            <SearchBar />
          </div>
        </div>

        {/* Menú Mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden">
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl">
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    isActive={location.pathname === item.to}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel de Notificaciones (Desktop) */}
      <div className="hidden lg:block fixed top-4 right-4 w-80 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            <Badge variant="secondary" className="text-xs">
              {notifications.length}
            </Badge>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </>
  );
}; 