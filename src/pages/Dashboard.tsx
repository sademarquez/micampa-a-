import React from 'react';
import { ModernDashboard } from '@/components/ModernDashboard';
import { ModernNavigation } from '@/components/ModernNavigation';

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ModernNavigation />
      <main className="flex-1 overflow-auto">
        <ModernDashboard />
      </main>
    </div>
  );
};

export default DashboardPage;
