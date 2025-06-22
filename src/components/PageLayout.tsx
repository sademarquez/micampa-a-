import React, { useState } from 'react';
import Navigation from './Navigation';
import UserHeader from './UserHeader';
import { useTheme } from '@/contexts/ThemeContext';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen ${theme.backgroundColor} ${theme.textColor}`}>
      <Navigation isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
