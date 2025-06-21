
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  Crown, 
  Shield, 
  Users, 
  MapPin, 
  Vote,
  Globe,
  Sparkles,
  Zap,
  ArrowLeft,
  MessageCircle
} from "lucide-react";

const UserHeader = () => {
  const { user, logout } = useSecureAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getRoleInfo = () => {
    switch (user?.role) {
      case 'desarrollador':
        return {
          icon: Shield,
          label: 'Desarrollador Principal',
          description: 'Control técnico total del sistema',
          color: 'from-red-500 to-pink-600',
          bgColor: 'from-red-50 to-pink-50',
          borderColor: 'border-red-200'
        };
      case 'master':
        return {
          icon: Crown,
          label: 'Master de Campaña',
          description: 'Coordinación estratégica general',
          color: 'from-purple-600 to-blue-700',
          bgColor: 'from-purple-50 to-blue-50',
          borderColor: 'border-purple-200'
        };
      case 'candidato':
        return {
          icon: Users,
          label: 'Candidato Líder',
          description: 'Liderazgo directo de campaña',
          color: 'from-blue-600 to-cyan-600',
          bgColor: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-200'
        };
      case 'lider':
        return {
          icon: MapPin,
          label: 'Líder Territorial',
          description: 'Coordinación de zona específica',
          color: 'from-green-600 to-emerald-600',
          bgColor: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-200'
        };
      case 'votante':
        return {
          icon: Vote,
          label: 'Votante Activo',
          description: 'Participación ciudadana comprometida',
          color: 'from-orange-600 to-yellow-600',
          bgColor: 'from-orange-50 to-yellow-50',
          borderColor: 'border-orange-200'
        };
      case 'visitante':
        return {
          icon: Globe,
          label: 'Visitante Explorador',
          description: 'Descubriendo oportunidades electorales',
          color: 'from-indigo-600 to-purple-600',
          bgColor: 'from-indigo-50 to-purple-50',
          borderColor: 'border-indigo-200'
        };
      default:
        return {
          icon: Users,
          label: 'Usuario',
          description: 'Participante del sistema',
          color: 'from-gray-600 to-gray-700',
          bgColor: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  if (!user) return null;

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  return (
    <div className={`campaign-card p-6 bg-gradient-to-br ${roleInfo.bgColor} border-2 ${roleInfo.borderColor} animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Botón de regreso */}
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>

          {/* Avatar y rol */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${roleInfo.color} rounded-2xl flex items-center justify-center shadow-modern-lg animate-pulse-glow`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                ¡Hola, {user.name}! 👋
              </h2>
              <p className="text-lg text-gray-700 font-medium">
                {roleInfo.description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className={`${roleInfo.borderColor.replace('border-', 'border-')} ${roleInfo.bgColor.replace('from-', 'bg-').replace(' to-', '').replace('-50', '-100')} text-gray-800`}>
                  {roleInfo.label}
                </Badge>
                {user.role === 'desarrollador' || user.role === 'master' ? (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Crown className="w-3 h-3 mr-1" />
                    Acceso Total
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Usuario Activo
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="hidden lg:block">
            <div className="text-center px-6 border-l border-gray-300">
              <p className="text-sm text-gray-600 mb-1">Sistema Electoral</p>
              <p className="text-lg font-bold gradient-text-primary">MI CAMPAÑA 2025</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">IA Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones de escritorio */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Último acceso</p>
            <p className="text-sm font-medium text-gray-800">
              {new Date().toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          {/* WhatsApp para futuras integraciones */}
          <Button
            variant="outline"
            className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200 hover:border-green-300 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Solo mostrar info en móvil */}
        <div className="lg:hidden">
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Activo
          </Badge>
        </div>
      </div>
      
      {/* Mensaje motivacional específico por rol */}
      <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
        <p className="text-sm text-gray-700 italic">
          {user.role === 'desarrollador' && '💻 Tu código construye el futuro democrático de nuestra comunidad'}
          {user.role === 'master' && '👑 Tu liderazgo estratégico coordina cada victoria electoral'}
          {user.role === 'candidato' && '🎯 Tu visión inspira y moviliza a toda la organización'}
          {user.role === 'lider' && '🌟 Tu trabajo territorial es la base sólida de nuestro éxito'}
          {user.role === 'votante' && '🗳️ Tu participación activa construye el cambio que necesitamos'}
          {user.role === 'visitante' && '🚀 Explora las posibilidades ilimitadas de participación ciudadana'}
        </p>
      </div>
    </div>
  );
};

export default UserHeader;
