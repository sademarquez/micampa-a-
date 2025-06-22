import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MasterDashboard } from '@/components/MasterDashboard';
import { ElectoralDashboard } from '@/components/ElectoralDashboard';
import { CandidateManager } from '@/components/CandidateManager';
import { LeaderManager } from '@/components/LeaderManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, LayoutDashboard, Zap, Shield, Users } from 'lucide-react';
import { UserHeader } from '@/components/UserHeader';
import { DeveloperPanel } from '@/components/DeveloperPanel';
import { MasterDatabaseManager } from '@/components/MasterDatabaseManager';
import { ModernDashboard } from '@/components/ModernDashboard';
import { VoterManager } from '@/components/VoterManager';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  if (!user) {
    return <div className="flex items-center justify-center h-full">Cargando...</div>;
  }

  const renderDeveloperDashboard = () => (
    <Tabs defaultValue="master_management" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="master_management">
          <UserPlus className="mr-2" /> Gestionar Masters
        </TabsTrigger>
        <TabsTrigger value="api_keys">
          <Zap className="mr-2" /> API Keys & Config
        </TabsTrigger>
      </TabsList>
      <TabsContent value="master_management">
        <MasterDatabaseManager />
      </TabsContent>
      <TabsContent value="api_keys">
        <DeveloperPanel />
      </TabsContent>
    </Tabs>
  );

  const renderMasterDashboard = () => (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard General</TabsTrigger>
        <TabsTrigger value="electoral"><Zap className="w-4 h-4 mr-2" />IA Electoral</TabsTrigger>
        <TabsTrigger value="candidates"><UserPlus className="w-4 h-4 mr-2" />Gestionar Candidatos</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard"><ModernDashboard /></TabsContent>
      <TabsContent value="electoral"><ElectoralDashboard /></TabsContent>
      <TabsContent value="candidates"><CandidateManager /></TabsContent>
    </Tabs>
  );

  const renderCandidateDashboard = () => (
    <Tabs defaultValue="leaders" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="leaders">
          <Users className="mr-2" /> Gestionar Líderes
        </TabsTrigger>
        <TabsTrigger value="profile">
          <Shield className="mr-2" /> Mi Perfil
        </TabsTrigger>
      </TabsList>
      <TabsContent value="leaders">
        <LeaderManager />
      </TabsContent>
      <TabsContent value="profile">
        <p>Aquí iría la configuración del perfil del candidato.</p>
      </TabsContent>
    </Tabs>
  );

  const renderLeaderDashboard = () => (
    <Tabs defaultValue="voters" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="voters">
          <Users className="mr-2" /> Gestionar Votantes
        </TabsTrigger>
        <TabsTrigger value="profile">
          <Shield className="mr-2" /> Mi Perfil
        </TabsTrigger>
      </TabsList>
      <TabsContent value="voters">
        <VoterManager />
      </TabsContent>
      <TabsContent value="profile">
        <p>Aquí iría la configuración del perfil del líder.</p>
      </TabsContent>
    </Tabs>
  );

  const renderContent = () => {
    switch (user?.role) {
      case 'developer':
        return renderDeveloperDashboard();
      case 'master':
        return renderMasterDashboard();
      case 'candidato':
        return renderCandidateDashboard();
      case 'lider':
        return renderLeaderDashboard();
      default:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold">Bienvenido, {user.name}</h1>
            <p className="text-muted-foreground">Rol no reconocido: {user.role}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <UserHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;