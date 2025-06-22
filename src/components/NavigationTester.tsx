import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Navigation,
  MousePointer,
  ArrowRight,
  Home,
  Users,
  MapPin,
  BarChart3,
  Settings,
  Code,
  Target,
  MessageSquare,
  Calendar,
  ClipboardList,
  TrendingUp,
  Smartphone,
  Shield,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface NavigationTest {
  name: string;
  path: string;
  icon: any;
  description: string;
  category: 'main' | 'tools' | 'reports' | 'admin';
  testResult?: 'success' | 'error' | 'pending';
  errorMessage?: string;
}

const NavigationTester: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({});
  const [isTesting, setIsTesting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigationTests: NavigationTest[] = [
    // Navegación Principal
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Página principal del dashboard',
      category: 'main'
    },
    {
      name: 'Mapa de Alertas',
      path: '/mapa-alertas',
      icon: MapPin,
      description: 'Mapa interactivo de alertas',
      category: 'main'
    },
    {
      name: 'Registro de Votantes',
      path: '/registro',
      icon: Users,
      description: 'Registro y gestión de votantes',
      category: 'main'
    },
    {
      name: 'Liderazgo',
      path: '/liderazgo',
      icon: Target,
      description: 'Gestión de liderazgo territorial',
      category: 'main'
    },
    
    // Herramientas
    {
      name: 'Tareas',
      path: '/tareas',
      icon: ClipboardList,
      description: 'Gestión de tareas y actividades',
      category: 'tools'
    },
    {
      name: 'Eventos',
      path: '/eventos',
      icon: Calendar,
      description: 'Calendario y gestión de eventos',
      category: 'tools'
    },
    {
      name: 'Acciones Rápidas',
      path: '/acciones-rapidas',
      icon: Zap,
      description: 'Acciones rápidas del sistema',
      category: 'tools'
    },
    {
      name: 'Red de Ayudantes',
      path: '/red-ayudantes',
      icon: MessageSquare,
      description: 'Red de comunicación de ayudantes',
      category: 'tools'
    },
    
    // Informes
    {
      name: 'Informes',
      path: '/informes',
      icon: BarChart3,
      description: 'Informes y estadísticas',
      category: 'reports'
    },
    {
      name: 'Análisis de Visitantes',
      path: '/visitor-funnel',
      icon: TrendingUp,
      description: 'Análisis del funnel de visitantes',
      category: 'reports'
    },
    {
      name: 'Auditoría Móvil',
      path: '/mobile-audit',
      icon: Smartphone,
      description: 'Auditoría de funcionalidad móvil',
      category: 'reports'
    },
    
    // Administración
    {
      name: 'Configuración',
      path: '/configuracion',
      icon: Settings,
      description: 'Configuración del sistema',
      category: 'admin'
    },
    {
      name: 'Panel de Desarrollador',
      path: '/developer',
      icon: Code,
      description: 'Panel de configuración para desarrolladores',
      category: 'admin'
    },
    {
      name: 'Mensajes',
      path: '/mensajes',
      icon: MessageSquare,
      description: 'Sistema de mensajería',
      category: 'admin'
    },
    {
      name: 'Mensajes Privados',
      path: '/mensajes-privados',
      icon: MessageSquare,
      description: 'Mensajes privados del sistema',
      category: 'admin'
    }
  ];

  const testNavigation = async (test: NavigationTest): Promise<'success' | 'error'> => {
    try {
      // Simular navegación
      const currentPath = window.location.pathname;
      
      // Navegar a la ruta
      navigate(test.path);
      
      // Esperar un momento para que la navegación se complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar que la URL cambió correctamente
      if (window.location.pathname === test.path) {
        return 'success';
      } else {
        return 'error';
      }
    } catch (error) {
      return 'error';
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    const results: Record<string, 'success' | 'error' | 'pending'> = {};
    
    // Inicializar todos los tests como pending
    navigationTests.forEach(test => {
      results[test.path] = 'pending';
    });
    
    setTestResults(results);
    
    // Ejecutar tests uno por uno
    for (const test of navigationTests) {
      try {
        const result = await testNavigation(test);
        results[test.path] = result;
        setTestResults({ ...results });
        
        // Pequeña pausa entre tests
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        results[test.path] = 'error';
        setTestResults({ ...results });
      }
    }
    
    setIsTesting(false);
    
    // Mostrar resumen
    const successCount = Object.values(results).filter(r => r === 'success').length;
    const errorCount = Object.values(results).filter(r => r === 'error').length;
    
    toast({
      title: "Pruebas de Navegación Completadas",
      description: `${successCount} exitosas, ${errorCount} errores`,
      variant: errorCount === 0 ? 'default' : 'destructive'
    });
  };

  const testSingleNavigation = async (test: NavigationTest) => {
    try {
      const result = await testNavigation(test);
      setTestResults(prev => ({ ...prev, [test.path]: result }));
      
      toast({
        title: result === 'success' ? 'Navegación Exitosa' : 'Error de Navegación',
        description: test.name,
        variant: result === 'success' ? 'default' : 'destructive'
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, [test.path]: 'error' }));
      toast({
        title: 'Error de Navegación',
        description: `Error al navegar a ${test.name}`,
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Exitoso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'main':
        return <Home className="w-4 h-4" />;
      case 'tools':
        return <Zap className="w-4 h-4" />;
      case 'reports':
        return <BarChart3 className="w-4 h-4" />;
      case 'admin':
        return <Settings className="w-4 h-4" />;
      default:
        return <Navigation className="w-4 h-4" />;
    }
  };

  const categories = [
    { id: 'main', name: 'Navegación Principal', icon: Home },
    { id: 'tools', name: 'Herramientas', icon: Zap },
    { id: 'reports', name: 'Informes', icon: BarChart3 },
    { id: 'admin', name: 'Administración', icon: Settings }
  ];

  const successCount = Object.values(testResults).filter(r => r === 'success').length;
  const errorCount = Object.values(testResults).filter(r => r === 'error').length;
  const pendingCount = Object.values(testResults).filter(r => r === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tester de Navegación</h2>
          <p className="text-gray-600">Verificación de rutas y redirecciones del sistema</p>
        </div>
        <Button
          onClick={runAllTests}
          disabled={isTesting}
          className="flex items-center gap-2"
        >
          <MousePointer className="w-4 h-4" />
          {isTesting ? 'Probando...' : 'Probar Todas'}
        </Button>
      </div>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-6 h-6" />
            Resumen de Pruebas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-700">Exitosas</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-red-700">Errores</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-yellow-700">Pendientes</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{navigationTests.length}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tests por Categoría */}
      {categories.map(category => {
        const categoryTests = navigationTests.filter(test => test.category === category.id);
        const CategoryIcon = category.icon;
        
        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="w-5 h-5" />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryTests.map(test => {
                  const TestIcon = test.icon;
                  const status = testResults[test.path] || 'pending';
                  
                  return (
                    <Card key={test.path} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <div>
                              <h3 className="font-semibold text-gray-900">{test.name}</h3>
                              <p className="text-sm text-gray-500">{test.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(status)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <TestIcon className="w-4 h-4" />
                            <span className="font-mono">{test.path}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testSingleNavigation(test)}
                            disabled={isTesting}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Alertas */}
      {errorCount > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Se encontraron {errorCount} errores de navegación. Revisa las rutas y componentes.
          </AlertDescription>
        </Alert>
      )}

      {successCount === navigationTests.length && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            ¡Excelente! Todas las navegaciones funcionan correctamente.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NavigationTester; 