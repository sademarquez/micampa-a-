/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import React, { useState } from 'react';
import { LogOut, Bell, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface UserHeaderProps {
  onToggleSidebar: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <header className={cn(
      "flex items-center justify-between px-6 py-4 shadow-md",
      theme.headerGradient
    )}>
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="text-gray-500 focus:outline-none lg:hidden">
          <MenuIcon size={24} />
        </button>
      </div>

      <div className="flex items-center">
        <button className={cn("flex mx-4", theme.textColor)}>
          <Bell size={24} />
        </button>

        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className={cn("relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none", theme.ringColor, 'focus:ring-2')}>
            <img
              className="h-full w-full object-cover"
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              alt="Your avatar"
            />
          </button>

          {dropdownOpen && (
            <div 
              onClick={() => setDropdownOpen(false)} 
              className="fixed inset-0 h-full w-full z-10"
            ></div>
          )}

          {dropdownOpen && (
            <div className={cn(
              "absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20",
              theme.backgroundColor,
              theme.borderColor,
              'border'
            )}>
              <a href="#" className={cn("block px-4 py-2 text-sm", theme.textColor, "hover:bg-gray-200/50")}>
                Perfil
              </a>
              <a href="#" className={cn("block px-4 py-2 text-sm", theme.textColor, "hover:bg-gray-200/50")}>
                Configuración
              </a>
              <a
                onClick={logout}
                href="#"
                className={cn("block px-4 py-2 text-sm", theme.textColor, "hover:bg-red-500/20")}
              >
                <LogOut className="inline w-4 h-4 mr-2" />
                Cerrar Sesión
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
