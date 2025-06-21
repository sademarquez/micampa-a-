
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';

export const SystemHealthIndicator = () => {
  const { systemHealth } = useSecureAuth();
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastCheck(new Date());
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getHealthConfig = () => {
    switch (systemHealth) {
      case 'healthy':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          alertVariant: 'default' as const,
          message: 'Sistema operando normalmente'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'bg-yellow-100 text-yellow-800',
          alertVariant: 'default' as const,
          message: 'Sistema con advertencias menores'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800',
          alertVariant: 'destructive' as const,
          message: 'Sistema con errores críticos'
        };
    }
  };

  const config = getHealthConfig();
  const Icon = config.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <Badge className={`${config.color} flex items-center gap-2 px-3 py-2`}>
        <Shield className="w-4 h-4" />
        Sistema PWA Seguro
      </Badge>
      
      <Alert variant={config.alertVariant} className="w-80">
        <Icon className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <p className="font-medium">{config.message}</p>
            <p className="text-xs opacity-75">
              Última verificación: {lastCheck.toLocaleTimeString()}
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
