import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Play, Pause, RefreshCw, Settings, BarChart3, Activity } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  executions: number;
  lastExecution: string;
  avgExecutionTime: number;
  successRate: number;
}

const N8NWorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  // Datos de ejemplo
  const mockWorkflows: Workflow[] = [
    {
      id: '1',
      name: 'Autenticación de Usuarios',
      status: 'active',
      executions: 1250,
      lastExecution: '2024-01-15 14:30:00',
      avgExecutionTime: 2.3,
      successRate: 98.5
    },
    {
      id: '2',
      name: 'Sincronización de Datos',
      status: 'active',
      executions: 890,
      lastExecution: '2024-01-15 14:25:00',
      avgExecutionTime: 5.7,
      successRate: 95.2
    },
    {
      id: '3',
      name: 'Análisis de Métricas',
      status: 'inactive',
      executions: 450,
      lastExecution: '2024-01-15 12:00:00',
      avgExecutionTime: 8.1,
      successRate: 92.8
    },
    {
      id: '4',
      name: 'Notificaciones Push',
      status: 'error',
      executions: 320,
      lastExecution: '2024-01-15 13:45:00',
      avgExecutionTime: 1.2,
      successRate: 87.3
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setWorkflows(mockWorkflows);
      setLoading(false);
    }, 1000);
  }, []);

  const handleWorkflowAction = (workflowId: string, action: 'start' | 'stop' | 'restart') => {
    console.log(`Acción ${action} en workflow ${workflowId}`);
    // Aquí iría la lógica real de n8n
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando workflows...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Workflows n8n</h2>
          <p className="text-gray-600">Administra y monitorea tus flujos de trabajo automatizados</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configuración
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ejecuciones Hoy</p>
                <p className="text-2xl font-bold">
                  {workflows.reduce((sum, w) => sum + w.executions, 0)}
                </p>
            </div>
            </div>
          </CardContent>
        </Card>

      <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold">
                  {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`} />
                      <div>
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <p className="text-sm text-gray-500">ID: {workflow.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                        {getStatusText(workflow.status)}
                        </Badge>
                      
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWorkflowAction(workflow.id, 'start')}
                          disabled={workflow.status === 'active'}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWorkflowAction(workflow.id, 'stop')}
                          disabled={workflow.status === 'inactive'}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          onClick={() => handleWorkflowAction(workflow.id, 'restart')}
                          >
                          <RefreshCw className="h-3 w-3" />
                          </Button>
                      </div>
                      </div>
                    </div>
                    
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Ejecuciones</p>
                      <p className="font-medium">{workflow.executions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Última Ejecución</p>
                      <p className="font-medium">{workflow.lastExecution}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tiempo Promedio</p>
                      <p className="font-medium">{workflow.avgExecutionTime}s</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tasa de Éxito</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={workflow.successRate} className="w-16" />
                        <span className="font-medium">{workflow.successRate}%</span>
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tiempo de Respuesta Promedio</h4>
                  <Progress value={85} className="w-full" />
                  <p className="text-sm text-gray-500 mt-1">3.2 segundos</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Uso de Recursos</h4>
                  <Progress value={65} className="w-full" />
                  <p className="text-sm text-gray-500 mt-1">65% de CPU</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Memoria Utilizada</h4>
                  <Progress value={45} className="w-full" />
                  <p className="text-sm text-gray-500 mt-1">2.1 GB de 4.7 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Alert>
                  <AlertDescription>
                    <span className="text-green-600">[INFO]</span> Workflow "Autenticación de Usuarios" ejecutado exitosamente
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertDescription>
                    <span className="text-yellow-600">[WARN]</span> Workflow "Notificaciones Push" tardó más de lo esperado
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertDescription>
                    <span className="text-red-600">[ERROR]</span> Error en workflow "Análisis de Métricas": Timeout
                  </AlertDescription>
                </Alert>
              </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default N8NWorkflowManager;