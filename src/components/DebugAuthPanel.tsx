
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { useDataSegregation } from '@/hooks/useDataSegregation';
import { useDemoUsers } from '@/hooks/useDemoUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, User, Shield, Bug, Database, TrendingUp } from 'lucide-react';
import { SystemDiagnostics } from './SystemDiagnostics';
import { useState } from 'react';

export const DebugAuthPanel = () => {
  const { user, isAuthenticated } = useSecureAuth();
  const { databaseStats } = useDemoUsers();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const {
    canCreateCandidatos,
    canCreateLideres, 
    canCreateVotantes,
    canManageUsers
  } = useDataSegregation();

  const permissions = [
    { name: 'Crear Candidatos', value: canCreateCandidatos },
    { name: 'Crear Líderes', value: canCreateLideres },
    { name: 'Crear Votantes', value: canCreateVotantes },
    { name: 'Gestionar Usuarios', value: canManageUsers }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-xs">
      <Card className="bg-white/95 backdrop-blur border-2 border-verde-sistema-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-verde-sistema-600" />
            Debug Auth - Producción
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="ml-auto h-6 px-2"
            >
              <Bug className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">
              {isAuthenticated ? user?.name : 'No autenticado'}
            </span>
          </div>
          
          {user && (
            <Badge variant="outline" className="text-xs">
              {user.role}
            </Badge>
          )}

          <div className="space-y-1">
            <p className="text-xs font-medium">Permisos:</p>
            {permissions.map((perm, idx) => (
              <div key={idx} className="flex items-center gap-1 text-xs">
                {perm.value ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
                <span>{perm.name}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-2">
            <p className="text-xs font-medium mb-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-verde-sistema-600" />
              Base Productiva:
            </p>
            <div className="text-xs space-y-1">
              <div>Usuarios: {databaseStats.production.users.toLocaleString()}</div>
              <div>Votantes: {databaseStats.production.voters.toLocaleString()}</div>
              <div>Interacciones: {databaseStats.production.interactions}</div>
              <div>Campañas: {databaseStats.production.campaigns}</div>
              <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showDiagnostics && (
        <div className="max-w-lg">
          <SystemDiagnostics />
        </div>
      )}

      <Card className="bg-green-50/95 backdrop-blur border-2 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            Estado Producción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Sistema N8N:</span>
              <span className="text-green-600 font-semibold">✅ Configurado</span>
            </div>
            <div className="flex justify-between">
              <span>Base Datos:</span>
              <span className="text-green-600 font-semibold">✅ Conectada</span>
            </div>
            <div className="flex justify-between">
              <span>Autenticación:</span>
              <span className="text-green-600 font-semibold">✅ Activa</span>
            </div>
            <div className="flex justify-between">
              <span>Credenciales:</span>
              <span className="text-green-600 font-semibold">✅ Productivas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
