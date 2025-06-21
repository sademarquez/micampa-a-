
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LogOut, MessageCircle } from "lucide-react";
import { useSecureAuth } from "../contexts/SecureAuthContext";

interface NavigationHelperProps {
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showLogoutButton?: boolean;
  customTitle?: string;
}

const NavigationHelper = ({ 
  showBackButton = true, 
  showHomeButton = true, 
  showLogoutButton = true,
  customTitle 
}: NavigationHelperProps) => {
  const navigate = useNavigate();
  const { logout } = useSecureAuth();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="hidden lg:flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 mb-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
        )}
        
        {showHomeButton && (
          <Button
            onClick={handleHome}
            variant="outline"
            size="sm"
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300 transition-all duration-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Button>
        )}

        {customTitle && (
          <h1 className="text-lg font-semibold text-gray-800 ml-4">
            {customTitle}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* WhatsApp para futuras integraciones */}
        <Button
          variant="outline"
          size="sm"
          className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200 hover:border-green-300 transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>

        {showLogoutButton && (
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationHelper;
