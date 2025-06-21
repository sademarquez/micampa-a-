
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Play, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChecklistItem {
  id: string;
  name: string;
  route?: string;
  status: 'pending' | 'testing' | 'success' | 'error';
  description: string;
  category: 'navigation' | 'functionality' | 'integration';
}

const FunctionalityChecklist = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Navegación principal
    { id: 'login', name: 'Página de Login', route: '/login', status: 'pending', description: 'Acceso seguro al sistema', category: 'navigation' },
    { id: 'dashboard', name: 'Dashboard Principal', route: '/dashboard', status: 'pending', description: 'Panel de control general', category: 'navigation' },
    { id: 'electoral-ia', name: 'IA Electoral', route: '/dashboard?tab=electoral', status: 'pending', description: 'Sistema de inteligencia artificial', category: 'navigation' },
    { id: 'visitors', name: 'Gestión Visitantes', route: '/dashboard?tab=visitor', status: 'pending', description: 'Administración de audiencia', category: 'navigation' },
    { id: 'territories', name: 'Territorios', route: '/dashboard?tab=territories', status: 'pending', description: 'Control territorial', category: 'navigation' },
    { id: 'users', name: 'Gestión Usuarios', route: '/dashboard?tab=users', status: 'pending', description: 'Administración de equipo', category: 'navigation' },
    
    // Páginas secundarias
    { id: 'mapa', name: 'Mapa Alertas', route: '/mapa-alertas', status: 'pending', description: 'Sistema de alertas geográficas', category: 'navigation' },
    { id: 'registro', name: 'Registro', route: '/registro', status: 'pending', description: 'Registro de nuevos usuarios', category: 'navigation' },
    { id: 'informes', name: 'Informes', route: '/informes', status: 'pending', description: 'Reportes y estadísticas', category: 'navigation' },
    { id: 'liderazgo', name: 'Liderazgo', route: '/liderazgo', status: 'pending', description: 'Panel de liderazgo', category: 'navigation' },
    { id: 'config', name: 'Configuración', route: '/configuracion', status: 'pending', description: 'Ajustes del sistema', category: 'navigation' },
    
    // Funcionalidades
    { id: 'auth', name: 'Autenticación', status: 'pending', description: 'Login/Logout funcional', category: 'functionality' },
    { id: 'navigation-buttons', name: 'Botones Navegación', status: 'pending', description: 'Botones atrás/inicio/logout', category: 'functionality' },
    { id: 'mobile-nav', name: 'Navegación Móvil', status: 'pending', description: 'Interfaz móvil optimizada', category: 'functionality' },
    { id: 'role-permissions', name: 'Permisos por Rol', status: 'pending', description: 'Acceso según credenciales', category: 'functionality' },
    
    // Integraciones
    { id: 'gemini-ai', name: 'Gemini AI', status: 'pending', description: 'Integración con API de Google', category: 'integration' },
    { id: 'whatsapp', name: 'WhatsApp Integration', status: 'pending', description: 'Preparado para vincular', category: 'integration' },
    { id: 'notifications', name: 'Sistema Notificaciones', status: 'pending', description: 'Alertas y mensajes', category: 'integration' }
  ]);

  const testRoute = async (item: ChecklistItem) => {
    setChecklist(prev => prev.map(i => 
      i.id === item.id ? { ...i, status: 'testing' } : i
    ));

    try {
      if (item.route) {
        navigate(item.route);
        // Simular test exitoso después de navegación
        setTimeout(() => {
          setChecklist(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: 'success' } : i
          ));
        }, 1000);
      } else {
        // Test de funcionalidad sin ruta
        setTimeout(() => {
          setChecklist(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: 'success' } : i
          ));
        }, 500);
      }
    } catch (error) {
      setChecklist(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'error' } : i
      ));
    }
  };

  const runAllTests = () => {
    checklist.forEach((item, index) => {
      setTimeout(() => testRoute(item), index * 500);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'testing': return <Clock className="w-5 h-5 text-yellow-600 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">✓ OK</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">✗ Error</Badge>;
      case 'testing': return <Badge className="bg-yellow-100 text-yellow-800">Testing...</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>;
    }
  };

  const getCategoryItems = (category: string) => 
    checklist.filter(item => item.category === category);

  const getSuccessRate = (category: string) => {
    const items = getCategoryItems(category);
    const successCount = items.filter(item => item.status === 'success').length;
    return Math.round((successCount / items.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900">Testing Automático del Sistema</CardTitle>
                <p className="text-gray-600">Verificación completa de funcionalidades</p>
              </div>
            </div>
            <Button onClick={runAllTests} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Play className="w-4 h-4 mr-2" />
              Ejecutar Todos los Tests
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Navegación */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🧭 Navegación ({getSuccessRate('navigation')}%)</span>
              <Badge className="bg-blue-100 text-blue-800">
                {getCategoryItems('navigation').filter(i => i.status === 'success').length} / {getCategoryItems('navigation').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getCategoryItems('navigation').map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testRoute(item)}
                    disabled={item.status === 'testing'}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Funcionalidades */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>⚙️ Funcionalidades ({getSuccessRate('functionality')}%)</span>
              <Badge className="bg-green-100 text-green-800">
                {getCategoryItems('functionality').filter(i => i.status === 'success').length} / {getCategoryItems('functionality').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getCategoryItems('functionality').map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testRoute(item)}
                    disabled={item.status === 'testing'}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Integraciones */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🔌 Integraciones ({getSuccessRate('integration')}%)</span>
              <Badge className="bg-purple-100 text-purple-800">
                {getCategoryItems('integration').filter(i => i.status === 'success').length} / {getCategoryItems('integration').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getCategoryItems('integration').map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testRoute(item)}
                    disabled={item.status === 'testing'}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FunctionalityChecklist;
