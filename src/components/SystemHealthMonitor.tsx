
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  Database,
  Shield,
  Network,
  Server
} from 'lucide-react';

interface HealthCheck {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastCheck: Date;
  details?: any;
}

export const SystemHealthMonitor = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');

  const runHealthChecks = async () => {
    setIsRunning(true);
    const checks: HealthCheck[] = [];

    // 1. Database Connectivity
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const duration = Date.now() - start;
      
      checks.push({
        component: 'Base de Datos',
        status: error ? 'error' : duration > 2000 ? 'warning' : 'healthy',
        message: error ? `Error: ${error.message}` : `Conectado (${duration}ms)`,
        lastCheck: new Date(),
        details: { duration, error }
      });
    } catch (error) {
      checks.push({
        component: 'Base de Datos',
        status: 'error',
        message: `Error crítico: ${error}`,
        lastCheck: new Date()
      });
    }

    // 2. Authentication System
    try {
      const { data: { user } } = await supabase.auth.getUser();
      checks.push({
        component: 'Autenticación',
        status: 'healthy',
        message: user ? 'Usuario autenticado' : 'Sin autenticación',
        lastCheck: new Date(),
        details: { authenticated: !!user }
      });
    } catch (error) {
      checks.push({
        component: 'Autenticación',
        status: 'error',
        message: `Error en autenticación: ${error}`,
        lastCheck: new Date()
      });
    }

    // 3. Tables Accessibility - Using literal table names
    const tableChecks = [
      { name: 'profiles', label: 'Tabla profiles' },
      { name: 'territories', label: 'Tabla territories' },
      { name: 'voters', label: 'Tabla voters' },
      { name: 'alerts', label: 'Tabla alerts' },
      { name: 'messages', label: 'Tabla messages' }
    ];

    for (const table of tableChecks) {
      try {
        const { data, error } = await supabase.from(table.name as any).select('*').limit(1);
        checks.push({
          component: table.label,
          status: error ? 'error' : 'healthy',
          message: error ? `Error: ${error.message}` : 'Accesible',
          lastCheck: new Date()
        });
      } catch (error) {
        checks.push({
          component: table.label,
          status: 'error',
          message: `Error crítico: ${error}`,
          lastCheck: new Date()
        });
      }
    }

    // 4. System Configuration
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .limit(1);
      
      checks.push({
        component: 'Configuración Sistema',
        status: error ? 'warning' : 'healthy',
        message: error ? 'No accesible' : 'Configuración OK',
        lastCheck: new Date()
      });
    } catch (error) {
      checks.push({
        component: 'Configuración Sistema',
        status: 'warning',
        message: 'Tabla no disponible',
        lastCheck: new Date()
      });
    }

    // 5. N8N Integration Check
    try {
      const { data, error } = await supabase
        .from('n8n_workflows')
        .select('*')
        .eq('active', true);
      
      checks.push({
        component: 'N8N Workflows',
        status: error ? 'warning' : 'healthy',
        message: error ? 'Error accediendo workflows' : `${data?.length || 0} workflows activos`,
        lastCheck: new Date(),
        details: { activeWorkflows: data?.length || 0 }
      });
    } catch (error) {
      checks.push({
        component: 'N8N Workflows',
        status: 'warning',
        message: 'Integración no disponible',
        lastCheck: new Date()
      });
    }

    setHealthChecks(checks);
    
    // Calculate overall health
    const hasError = checks.some(check => check.status === 'error');
    const hasWarning = checks.some(check => check.status === 'warning');
    
    if (hasError) {
      setOverallHealth('error');
    } else if (hasWarning) {
      setOverallHealth('warning');
    } else {
      setOverallHealth('healthy');
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    runHealthChecks();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(runHealthChecks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallStatusConfig = () => {
    switch (overallHealth) {
      case 'healthy':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          message: 'Sistema operando normalmente'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          message: 'Sistema con advertencias menores'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          message: 'Sistema con errores críticos'
        };
    }
  };

  const overallConfig = getOverallStatusConfig();
  const OverallIcon = overallConfig.icon;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Alert className={`${overallConfig.bgColor} border-2`}>
        <OverallIcon className={`h-5 w-5 ${overallConfig.color}`} />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-semibold ${overallConfig.color}`}>
                Estado General del Sistema
              </p>
              <p className={overallConfig.color}>{overallConfig.message}</p>
            </div>
            <Button 
              onClick={runHealthChecks} 
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? 'Verificando...' : 'Verificar Ahora'}
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Individual Health Checks */}
      <Card className="bg-gray-ecosystem-card shadow-ecosystem-soft border-gray-ecosystem-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-ecosystem-primary">
            <Activity className="w-5 h-5" />
            Diagnóstico Detallado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-ecosystem-border shadow-ecosystem-soft">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium text-gray-ecosystem-dark">{check.component}</p>
                  <p className="text-sm text-gray-ecosystem-text">{check.message}</p>
                  <p className="text-xs text-gray-ecosystem-medium">
                    Última verificación: {check.lastCheck.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Badge className={getStatusBadge(check.status)}>
                {check.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200 shadow-ecosystem-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {healthChecks.filter(c => c.status === 'healthy').length}
            </div>
            <div className="text-sm text-green-600">Saludables</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200 shadow-ecosystem-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {healthChecks.filter(c => c.status === 'warning').length}
            </div>
            <div className="text-sm text-yellow-600">Advertencias</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200 shadow-ecosystem-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {healthChecks.filter(c => c.status === 'error').length}
            </div>
            <div className="text-sm text-red-600">Errores</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200 shadow-ecosystem-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {healthChecks.length}
            </div>
            <div className="text-sm text-blue-600">Total</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
