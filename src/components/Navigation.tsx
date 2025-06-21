
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, MapPin, User, BarChart3, Network, LogOut, FileText, Shield, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import ModernMobileNavigation from "./ModernMobileNavigation";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useSecureAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/dashboard?tab=electoral", label: "IA Electoral", icon: Zap },
    { href: "/dashboard?tab=visitor", label: "Visitantes", icon: Users },
    { href: "/registro", label: "Registro", icon: User },
    { href: "/mapa-alertas", label: "Mapa", icon: MapPin },
    { href: "/informes", label: "Informes", icon: FileText },
    { href: "/liderazgo", label: "Liderazgo", icon: Users },
    { href: "/red-ayudantes", label: "Red Ayudantes", icon: Network },
    { href: "/configuracion", label: "Configuración", icon: Shield }
  ];

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
      {/* Navegación móvil moderna */}
      <ModernMobileNavigation />

      {/* Navegación desktop moderna */}
      <nav className="hidden md:block header-modern border-b border-gray-200 shadow-modern-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo moderno */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg-primary rounded-xl flex items-center justify-center shadow-modern-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl gradient-text-primary">
                  MI CAMPAÑA 2025
                </span>
                <div className="text-xs text-gray-500">Automatización Electoral IA</div>
              </div>
            </Link>

            {/* Desktop Navigation moderna */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.slice(0, 6).map((item) => {
                const active = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                      active
                        ? 'gradient-bg-primary text-white shadow-modern-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">({user.role})</p>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>

            {/* Mobile menu trigger - solo para tablets */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-50">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-white border-l border-gray-200">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">Rol: {user.role}</p>
                    </div>
                    {navigationItems.map((item) => {
                      const active = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                            active
                              ? 'gradient-bg-primary text-white shadow-modern-md'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                    <Button 
                      onClick={handleLogout}
                      className="bg-red-50 hover:bg-red-100 text-red-600 shadow-modern-sm mt-6"
                      variant="ghost"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
