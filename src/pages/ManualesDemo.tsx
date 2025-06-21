
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ManualUsuario from '@/components/ManualUsuario';
import ManualCodigo from '@/components/ManualCodigo';
import { 
  Shield, Crown, Vote, MapPin, Users, 
  Code, BookOpen, Download, 
  CheckCircle, Info, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ManualesDemo = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante'>('votante');

  const roles = [
    { 
      id: 'desarrollador' as const, 
      name: 'Desarrollador', 
      icon: Shield, 
      color: 'bg-red-600',
      badge: 'Sistema Completo',
      credentials: 'admin@micampana.com / AdminSecure2025!'
    },
    { 
      id: 'master' as const, 
      name: 'Master', 
      icon: Crown, 
      color: 'bg-purple-600',
      badge: 'Estrategia General',
      credentials: 'master@micampana.com / MasterSecure2025!'
    },
    { 
      id: 'candidato' as const, 
      name: 'Candidato', 
      icon: Vote, 
      color: 'bg-blue-600',
      badge: 'Liderazgo Regional',
      credentials: 'candidato@micampana.com / CandidatoSecure2025!'
    },
    { 
      id: 'lider' as const, 
      name: 'Líder', 
      icon: MapPin, 
      color: 'bg-green-600',
      badge: 'Coordinación Local',
      credentials: 'lider@micampana.com / LiderSecure2025!'
    },
    { 
      id: 'votante' as const, 
      name: 'Votante', 
      icon: Users, 
      color: 'bg-indigo-600',
      badge: 'Participación Activa',
      credentials: 'votante@micampana.com / VotanteSecure2025!'
    }
  ];

  const demoStats = {
    usuarios: {
      desarrollador: 1,
      master: 1, 
      candidato: 3,
      lider: 10,
      votante: 100
    },
    datos: {
      territorios: 10,
      eventos: 3,
      alertas: 3,
      tareas: 3,
      jerarquias: 13
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Manuales del Sistema Mi Campaña</CardTitle>
                  <p className="text-gray-600">Documentación completa para cada rol y funcionalidad</p>
                </div>
              </div>
              <Badge variant="outline" className="text-sm">Demo v2.0</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Stats de la demo */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(demoStats.usuarios).map(([role, count]) => {
            const roleData = roles.find(r => r.id === role);
            if (!roleData) return null;
            const Icon = roleData.icon;
            
            return (
              <Card key={role} className="text-center">
                <CardContent className="pt-4">
                  <div className={`w-8 h-8 ${roleData.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-gray-600">{roleData.name}s</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estado actual del usuario */}
        {user && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Sesión Actual</div>
                  <div className="text-sm text-blue-700">
                    Conectado como: <strong>{user.name}</strong> ({user.role}) - {user.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navegación principal */}
        <Tabs defaultValue="manuales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manuales">Manuales de Usuario</TabsTrigger>
            <TabsTrigger value="codigo">Manual de Código</TabsTrigger>
            <TabsTrigger value="checklist">Checklist Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="manuales">
            <div className="space-y-6">
              {/* Selector de rol */}
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona el Rol para ver su Manual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      
                      return (
                        <Button
                          key={role.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`h-auto p-4 flex flex-col gap-2 ${isSelected ? role.color : ''}`}
                          onClick={() => setSelectedRole(role.id)}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-semibold">{role.name}</span>
                          <Badge variant={isSelected ? "secondary" : "outline"} className="text-xs">
                            {role.badge}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Manual del rol seleccionado */}
              <ManualUsuario role={selectedRole} />
            </div>
          </TabsContent>

          <TabsContent value="codigo">
            <ManualCodigo />
          </TabsContent>

          <TabsContent value="checklist">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Checklist de Demostración
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="font-semibold text-green-800 mb-3">✅ Sistema Completamente Configurado</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>5 Credenciales demo configuradas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Base de datos poblada con 114 registros</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Jerarquías organizacionales definidas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Sistema de permisos funcionando</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Dashboard personalizado por rol</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Datos demo realistas y completos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Manuales de usuario completos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Documentación técnica actualizada</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Flujo de Demostración Sugerido</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ol className="text-sm space-y-2">
                            <li className="flex gap-2">
                              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                              <span>Probar login con credencial de Desarrollador</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                              <span>Explorar panel completo y gestión de usuarios</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
                              <span>Cambiar a Master para ver coordinación estratégica</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">4</span>
                              <span>Probar Candidato para liderazgo territorial</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">5</span>
                              <span>Ver perspectiva de Líder local</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">6</span>
                              <span>Finalizar con experiencia de Votante</span>
                            </li>
                          </ol>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Datos Demo Disponibles</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>Territorios:</span>
                              <Badge variant="outline">{demoStats.datos.territorios}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Eventos programados:</span>
                              <Badge variant="outline">{demoStats.datos.eventos}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Alertas activas:</span>
                              <Badge variant="outline">{demoStats.datos.alertas}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Tareas asignadas:</span>
                              <Badge variant="outline">{demoStats.datos.tareas}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Relaciones jerárquicas:</span>
                              <Badge variant="outline">{demoStats.datos.jerarquias}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Total votantes:</span>
                              <Badge variant="outline">{demoStats.usuarios.votante}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">Sistema Listo para Producción</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            El sistema cuenta con autenticación segura, base de datos estructurada, 
                            permisos granulares, y experiencia personalizada para cada tipo de usuario. 
                            Ideal para campañas electorales reales con adaptaciones mínimas.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManualesDemo;
