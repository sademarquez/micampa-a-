import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Server, 
  Database, 
  Globe, 
  Zap,
  Activity,
  Wifi,
  Shield,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { defaultN8NConfig } from '@/config/n8nConfig';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  responseTime?: number;
  lastCheck: Date;
  details?: string;
  endpoint?: string;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'error';
  services: HealthStatus[];
  lastUpdate: Date;
}

const SystemHealthMonitor: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    overall: 'unknown',
    services: [],
    lastUpdate: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const servicesToCheck = [
    {
      name: 'Frontend (PWA)',
      endpoint: window.location.origin,
      type: 'frontend'
    },
    {
      name: 'Backend (n8n)',
      endpoint: defaultN8NConfig.baseUrl,
      type: 'api'
    },
    {
      name: 'Supabase Database',
      endpoint: 'https://zecltlsdkbndhqimpjjo.supabase.co',
      type: 'database'
    },
    {
      name: 'Google Gemini API',
      endpoint: 'https://generativelanguage.googleapis.com',
      type: 'ai'
    },
    {
      name: 'Netlify CDN',
      endpoint: 'https://netlify.com',
      type: 'cdn'
    }
  ];

  const checkServiceHealth = async (service: any): Promise<HealthStatus> => {
    const startTime = Date.now();
    
    try {
      let response: Response;
      
      if (service.type === 'frontend') {
        // Para el frontend, solo verificamos que esté cargado
        response = await fetch(service.endpoint, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
      } else if (service.type === 'api') {
        // Para n8n, verificamos el endpoint de health
        response = await fetch(`${service.endpoint}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Para otros servicios, hacemos una petición HEAD
        response = await fetch(service.endpoint, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
      }

      const responseTime = Date.now() - startTime;
      
      if (response.ok || response.status === 0) { // status 0 para no-cors
        return {
          service: service.name,
          status: 'healthy',
          responseTime,
          lastCheck: new Date(),
          details: `Respuesta exitosa (${responseTime}ms)`,
          endpoint: service.endpoint
        };
      } else {
        return {
          service: service.name,
          status: 'warning',
          responseTime,
          lastCheck: new Date(),
          details: `HTTP ${response.status}`,
          endpoint: service.endpoint
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        service: service.name,
        status: 'error',
        responseTime,
        lastCheck: new Date(),
        details: error instanceof Error ? error.message : 'Error desconocido',
        endpoint: service.endpoint
      };
    }
  };

  const performHealthCheck = async () => {
    setIsChecking(true);
    
    try {
      const healthPromises = servicesToCheck.map(checkServiceHealth);
      const results = await Promise.all(healthPromises);
      
      const errorCount = results.filter(r => r.status === 'error').length;
      const warningCount = results.filter(r => r.status === 'warning').length;
      
      let overall: 'healthy' | 'warning' | 'error' = 'healthy';
      if (errorCount > 0) {
        overall = 'error';
      } else if (warningCount > 0) {
        overall = 'warning';
      }
      
      const newHealth: SystemHealth = {
        overall,
        services: results,
        lastUpdate: new Date()
      };
      
      setHealth(newHealth);
      
      toast({
        title: "Health Check Completado",
        description: `Estado general: ${overall.toUpperCase()}`,
        variant: overall === 'healthy' ? 'default' : 'destructive'
      });
      
    } catch (error) {
      toast({
        title: "Error en Health Check",
        description: "No se pudo completar la verificación",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    performHealthCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Sano</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const getOverallStatusColor = () => {
    switch (health.overall) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Monitoreo de Salud del Sistema</h2>
          <p className="text-gray-600">Estado de todos los servicios y componentes</p>
        </div>
        <Button
          onClick={performHealthCheck}
          disabled={isChecking}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Verificando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Estado General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Estado General del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(health.overall)}
              <span className={`text-lg font-semibold ${getOverallStatusColor()}`}>
                {health.overall.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {health.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {health.services.filter(s => s.status === 'healthy').length}
              </div>
              <div className="text-sm text-green-700">Servicios Sanos</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {health.services.filter(s => s.status === 'warning').length}
              </div>
              <div className="text-sm text-yellow-700">Advertencias</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {health.services.filter(s => s.status === 'error').length}
              </div>
              <div className="text-sm text-red-700">Errores</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servicios Individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {health.services.map((service, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.service}</h3>
                    <p className="text-sm text-gray-500">{service.endpoint}</p>
                  </div>
                </div>
                {getStatusBadge(service.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                {service.responseTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo de respuesta:</span>
                    <span className="font-mono">{service.responseTime}ms</span>
                  </div>
                )}
                {service.details && (
                  <div className="text-gray-600">
                    <span className="font-medium">Detalles:</span> {service.details}
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Última verificación:</span>
                  <span className="text-gray-800">{service.lastCheck.toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertas */}
      {health.services.some(s => s.status === 'error') && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Hay servicios con errores. Revisa la configuración y las conexiones de red.
          </AlertDescription>
        </Alert>
      )}

      {health.services.some(s => s.status === 'warning') && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Algunos servicios muestran advertencias. Considera revisar la configuración.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SystemHealthMonitor;
