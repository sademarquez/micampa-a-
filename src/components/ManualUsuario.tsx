
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, Crown, Vote, MapPin, Users, 
  CheckCircle, AlertTriangle, Info, 
  Settings, BarChart3, MessageSquare,
  Calendar, FileText, Network
} from 'lucide-react';

interface ManualUsuarioProps {
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
}

const ManualUsuario = ({ role }: ManualUsuarioProps) => {
  const roleConfig = {
    desarrollador: {
      icon: Shield,
      title: 'Manual del Desarrollador',
      color: 'bg-red-600',
      badge: 'Sistema Completo',
      accesos: [
        'Panel de Control Total',
        'Gestión de Usuarios',
        'Configuración del Sistema',
        'Base de Datos',
        'Logs y Monitoreo',
        'Respaldos y Seguridad'
      ],
      funciones: [
        {
          categoria: 'Administración',
          items: [
            'Crear/modificar cualquier tipo de usuario',
            'Asignar roles y permisos',
            'Configurar territorios y jerarquías',
            'Gestionar credenciales demo'
          ]
        },
        {
          categoria: 'Monitoreo',
          items: [
            'Supervisar actividad del sistema',
            'Revisar logs de errores',
            'Generar reportes de uso',
            'Auditoría de cambios'
          ]
        },
        {
          categoria: 'Mantenimiento',
          items: [
            'Respaldos automáticos',
            'Optimización de rendimiento',
            'Actualizaciones de seguridad',
            'Limpieza de datos'
          ]
        }
      ],
      checklist: [
        'Verificar estado del sistema diariamente',
        'Revisar logs de errores',
        'Supervisar métricas de uso',
        'Validar respaldos automáticos',
        'Actualizar documentación técnica'
      ]
    },
    master: {
      icon: Crown,
      title: 'Manual del Master de Campaña',
      color: 'bg-purple-600',
      badge: 'Estrategia General',
      accesos: [
        'Dashboard Ejecutivo',
        'Gestión de Candidatos',
        'Reportes Globales',
        'Coordinación Estratégica',
        'Red de Comunicación',
        'Sistema de Alertas'
      ],
      funciones: [
        {
          categoria: 'Gestión Estratégica',
          items: [
            'Coordinar candidatos regionales',
            'Definir objetivos de campaña',
            'Asignar recursos y presupuestos',
            'Supervisar métricas globales'
          ]
        },
        {
          categoria: 'Coordinación',
          items: [
            'Gestionar red de candidatos',
            'Supervisar actividades territoriales',
            'Coordinar eventos principales',
            'Mantener comunicación estratégica'
          ]
        },
        {
          categoria: 'Análisis',
          items: [
            'Revisar reportes de progreso',
            'Analizar métricas de rendimiento',
            'Identificar oportunidades',
            'Tomar decisiones ejecutivas'
          ]
        }
      ],
      checklist: [
        'Revisar métricas diarias de candidatos',
        'Coordinar reunión semanal estratégica',
        'Supervisar cumplimiento de objetivos',
        'Analizar reportes territoriales',
        'Actualizar estrategia según resultados'
      ]
    },
    candidato: {
      icon: Vote,
      title: 'Manual del Candidato',
      color: 'bg-blue-600',
      badge: 'Liderazgo Regional',
      accesos: [
        'Panel de Liderazgo',
        'Gestión de Equipo',
        'Eventos de Campaña',
        'Reportes Territoriales',
        'Comunicación Directa',
        'Coordinación de Líderes'
      ],
      funciones: [
        {
          categoria: 'Liderazgo',
          items: [
            'Liderar equipo territorial',
            'Inspirar y motivar líderes',
            'Representar la campaña públicamente',
            'Tomar decisiones regionales'
          ]
        },
        {
          categoria: 'Gestión de Equipo',
          items: [
            'Asignar líderes a territorios',
            'Supervisar actividades locales',
            'Brindar apoyo y recursos',
            'Evaluar rendimiento del equipo'
          ]
        },
        {
          categoria: 'Actividades Públicas',
          items: [
            'Organizar eventos de campaña',
            'Participar en foros y debates',
            'Mantener presencia en medios',
            'Interactuar con la comunidad'
          ]
        }
      ],
      checklist: [
        'Reunión semanal con líderes territoriales',
        'Revisar avances de registro de votantes',
        'Planificar eventos públicos',
        'Coordinar con el Master estrategias',
        'Mantener comunicación con la comunidad'
      ]
    },
    lider: {
      icon: MapPin,
      title: 'Manual del Líder Territorial',
      color: 'bg-green-600',
      badge: 'Coordinación Local',
      accesos: [
        'Panel Territorial',
        'Registro de Votantes',
        'Gestión Local',
        'Comunicación con Equipo',
        'Reportes de Territorio',
        'Actividades Locales'
      ],
      funciones: [
        {
          categoria: 'Gestión Territorial',
          items: [
            'Coordinar territorio asignado',
            'Registrar nuevos votantes',
            'Mantener base de datos actualizada',
            'Organizar actividades locales'
          ]
        },
        {
          categoria: 'Registro de Votantes',
          items: [
            'Identificar posibles simpatizantes',
            'Completar formularios de registro',
            'Verificar datos de contacto',
            'Clasificar nivel de compromiso'
          ]
        },
        {
          categoria: 'Comunicación',
          items: [
            'Mantener contacto con votantes',
            'Reportar novedades al candidato',
            'Coordinar con otros líderes',
            'Transmitir mensajes de campaña'
          ]
        }
      ],
      checklist: [
        'Contactar al menos 5 votantes por día',
        'Registrar nuevos simpatizantes semanalmente',
        'Reportar actividades al candidato',
        'Organizar reunión mensual territorial',
        'Mantener datos actualizados en el sistema'
      ]
    },
    votante: {
      icon: Users,
      title: 'Manual del Votante Activo',
      color: 'bg-indigo-600',
      badge: 'Participación Activa',
      accesos: [
        'Dashboard Personal',
        'Tareas Asignadas',
        'Eventos de Campaña',
        'Chat del Equipo',
        'Mi Progreso',
        'Información Electoral'
      ],
      funciones: [
        {
          categoria: 'Participación',
          items: [
            'Asistir a eventos de campaña',
            'Completar tareas asignadas',
            'Promover candidato en círculo social',
            'Participar en actividades comunitarias'
          ]
        },
        {
          categoria: 'Promoción',
          items: [
            'Compartir información de campaña',
            'Invitar amigos y familiares',
            'Usar redes sociales responsablemente',
            'Distribuir material de campaña'
          ]
        },
        {
          categoria: 'Compromiso',
          items: [
            'Mantener comunicación con líder',
            'Reportar actividades realizadas',
            'Sugerir mejoras y oportunidades',
            'Demostrar compromiso constante'
          ]
        }
      ],
      checklist: [
        'Revisar tareas pendientes diariamente',
        'Participar en eventos programados',
        'Mantener contacto con el líder',
        'Promocionar candidato en redes sociales',
        'Invitar al menos 1 persona nueva por semana'
      ]
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{config.title}</CardTitle>
              <Badge variant="outline" className="mt-1">{config.badge}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="accesos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accesos">Accesos</TabsTrigger>
          <TabsTrigger value="funciones">Funciones</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="credenciales">Credenciales</TabsTrigger>
        </TabsList>

        <TabsContent value="accesos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Accesos del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {config.accesos.map((acceso, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{acceso}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funciones">
          <div className="space-y-4">
            {config.funciones.map((categoria, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{categoria.categoria}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoria.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Checklist Diario/Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credenciales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Credenciales Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Credenciales de Prueba</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Estas credenciales son solo para demostración. En producción, cada usuario tendrá sus propias credenciales únicas.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Email Demo:</div>
                    <div className="text-sm text-gray-600">{role}@micampana.com</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Contraseña Demo:</div>
                    <div className="text-sm text-gray-600">{role.charAt(0).toUpperCase() + role.slice(1)}Secure2025!</div>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Base de Datos Demo</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• 1 Master de Campaña</p>
                    <p>• 3 Candidatos Regionales</p>
                    <p>• 10 Líderes Territoriales</p>
                    <p>• 100 Votantes Registrados</p>
                    <p>• Eventos, Tareas y Alertas de ejemplo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManualUsuario;
