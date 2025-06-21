
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code, Database, Settings, FileText, 
  GitBranch, Terminal, Package, 
  AlertTriangle, CheckCircle
} from 'lucide-react';
import { useState } from 'react';

const ManualCodigo = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Manual de Código - Sistema Mi Campaña</CardTitle>
              <Badge variant="outline" className="mt-1">Documentación Técnica v2.0</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="estructura" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="estructura">Estructura</TabsTrigger>
          <TabsTrigger value="componentes">Componentes</TabsTrigger>
          <TabsTrigger value="database">Base de Datos</TabsTrigger>
          <TabsTrigger value="auth">Autenticación</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
          <TabsTrigger value="troubleshooting">Solución de Problemas</TabsTrigger>
        </TabsList>

        <TabsContent value="estructura">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Estructura del Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── AlertSystem.tsx  # Sistema de alertas
│   ├── DashboardVotante.tsx
│   ├── MasterDashboard.tsx
│   ├── PersonalizedActions.tsx
│   ├── RoleBasedStats.tsx
│   ├── UserHeader.tsx
│   └── ...
├── contexts/            # Context providers
│   ├── AuthContext.tsx  # Autenticación principal
│   └── SecureAuthContext.tsx
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useDataSegregation.ts
│   ├── useErrorHandler.ts
│   └── useSystemLogger.ts
├── pages/               # Páginas principales
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Login.tsx        # Página de login
│   ├── RegistroPersonalizado.tsx
│   └── ...
├── integrations/        # Integraciones externas
│   └── supabase/        # Cliente y tipos de Supabase
└── lib/                 # Utilidades y configuración
    └── utils.ts

supabase/
├── migrations/          # Migraciones de BD
└── config.toml         # Configuración Supabase`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tecnologías Principales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'React 18', desc: 'Frontend framework' },
                    { name: 'TypeScript', desc: 'Tipado estático' },
                    { name: 'Tailwind CSS', desc: 'Estilos' },
                    { name: 'Supabase', desc: 'Backend/BD' },
                    { name: 'shadcn/ui', desc: 'Componentes UI' },
                    { name: 'React Router', desc: 'Enrutamiento' },
                    { name: 'Lucide Icons', desc: 'Iconografía' },
                    { name: 'Vite', desc: 'Build tool' }
                  ].map((tech, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-semibold text-sm">{tech.name}</div>
                      <div className="text-xs text-gray-600">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="componentes">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Componentes Clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: 'AuthContext',
                    file: 'src/contexts/AuthContext.tsx',
                    desc: 'Manejo de autenticación y estado del usuario',
                    code: `// Uso del AuthContext
import { useAuth } from '@/contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();`
                  },
                  {
                    name: 'PersonalizedActions',
                    file: 'src/components/PersonalizedActions.tsx',
                    desc: 'Acciones específicas por rol de usuario',
                    code: `// Configuración de acciones por rol
const getActionsConfig = () => {
  switch (user?.role) {
    case 'desarrollador':
      return developerActions;
    case 'master':
      return masterActions;
    // ...
  }
};`
                  },
                  {
                    name: 'RoleBasedStats',
                    file: 'src/components/RoleBasedStats.tsx',
                    desc: 'Estadísticas personalizadas según el rol',
                    code: `// Hook para segregación de datos
import { useDataSegregation } from '@/hooks/useDataSegregation';

const { getPermissions, filterData } = useDataSegregation();`
                  }
                ].map((comp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">{comp.name}</div>
                        <div className="text-sm text-gray-600">{comp.file}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(comp.code, `comp-${index}`)}
                      >
                        {copiedCode === `comp-${index}` ? <CheckCircle className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{comp.desc}</p>
                    <div className="bg-slate-900 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
                      <pre>{comp.code}</pre>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Esquema de Base de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`-- Tablas principales
profiles          # Perfiles de usuario (roles, nombres)
territories       # Estructura territorial
voters           # Base de datos de votantes
alerts           # Sistema de alertas
events           # Eventos de campaña
tasks            # Tareas asignadas
messages         # Sistema de mensajería
user_hierarchies # Jerarquías organizacionales

-- Tipos ENUM
user_role        # desarrollador, master, candidato, lider, votante
territory_type   # departamento, municipio, barrio, sector
alert_type       # security, logistics, political, emergency
message_priority # low, medium, high, urgent`}</pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Crear Usuario',
                        code: `-- Insertar nuevo perfil
INSERT INTO public.profiles (
  id, name, role, created_by
) VALUES (
  auth.uid(), 
  'Nombre Usuario', 
  'lider', 
  'id_del_creador'
);`
                      },
                      {
                        title: 'Consultar Votantes',
                        code: `-- Obtener votantes por territorio
SELECT v.*, t.name as territory_name
FROM voters v
LEFT JOIN territories t ON v.territory_id = t.id
WHERE t.responsible_user_id = auth.uid();`
                      },
                      {
                        title: 'Crear Alerta',
                        code: `-- Insertar nueva alerta
INSERT INTO public.alerts (
  title, description, type, 
  priority, created_by, territory_id
) VALUES (
  'Título', 'Descripción', 'security',
  'high', auth.uid(), 'territory_id'
);`
                      },
                      {
                        title: 'Jerarquía de Usuarios',
                        code: `-- Obtener subordinados
SELECT * FROM public.get_user_subordinates(
  auth.uid()
);

-- Verificar permisos
SELECT public.can_manage_user(
  auth.uid(), 'target_user_id'
);`
                      }
                    ].map((example, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-sm">{example.title}</div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(example.code, `sql-${index}`)}
                          >
                            {copiedCode === `sql-${index}` ? <CheckCircle className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="bg-slate-900 text-green-400 p-2 rounded text-xs font-mono overflow-x-auto">
                          <pre>{example.code}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Autenticación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Credenciales Demo Configuradas</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Desarrollador:</strong> admin@micampana.com / AdminSecure2025!</p>
                  <p><strong>Master:</strong> master@micampana.com / MasterSecure2025!</p>
                  <p><strong>Candidato:</strong> candidato@micampana.com / CandidatoSecure2025!</p>
                  <p><strong>Líder:</strong> lider@micampana.com / LiderSecure2025!</p>
                  <p><strong>Votante:</strong> votante@micampana.com / VotanteSecure2025!</p>
                </div>
              </div>

              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`// Configuración de autenticación
import { supabase } from '@/integrations/supabase/client';

// Login
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  });
  return { data, error };
};

// Logout
const logout = async () => {
  await supabase.auth.signOut();
};

// Obtener usuario actual
const getUser = () => {
  return supabase.auth.getUser();
};`}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Despliegue y Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Instalación',
                    commands: [
                      'npm install',
                      'npm run dev',
                      'npm run build'
                    ]
                  },
                  {
                    title: 'Supabase Setup',
                    commands: [
                      'npx supabase init',
                      'npx supabase start',
                      'npx supabase db reset'
                    ]
                  },
                  {
                    title: 'Variables de Entorno',
                    commands: [
                      'VITE_SUPABASE_URL=your_url',
                      'VITE_SUPABASE_ANON_KEY=your_key',
                      'DATABASE_URL=your_db_url'
                    ]
                  },
                  {
                    title: 'Deploy a Producción',
                    commands: [
                      'npm run build',
                      'npm run preview',
                      'Deploy to Vercel/Netlify'
                    ]
                  }
                ].map((section, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-semibold text-sm mb-2">{section.title}</div>
                    <div className="bg-slate-900 text-green-400 p-2 rounded text-xs font-mono">
                      {section.commands.map((cmd, cmdIndex) => (
                        <div key={cmdIndex}>{cmd}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Solución de Problemas Comunes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  problem: 'Error de autenticación "Invalid login credentials"',
                  solution: 'Verificar que las credenciales demo estén correctamente configuradas en Supabase. Revisar las migraciones de usuarios.',
                  code: 'SELECT * FROM auth.users WHERE email LIKE \'%@micampana.com\';'
                },
                {
                  problem: 'RLS Policy violation al insertar datos',
                  solution: 'Asegurar que el campo user_id esté siendo asignado correctamente y que las políticas RLS permitan la operación.',
                  code: 'ALTER TABLE table_name DISABLE ROW LEVEL SECURITY; -- temporal para debug'
                },
                {
                  problem: 'Componentes no se renderizan por rol',
                  solution: 'Verificar que useAuth esté retornando el rol correcto y que los permisos estén bien configurados.',
                  code: 'console.log(\'User role:\', user?.role); // Debug role'
                },
                {
                  problem: 'Error de Foreign Key en perfiles',
                  solution: 'Los usuarios deben existir en auth.users antes de crear perfiles. Usar el trigger handle_new_user.',
                  code: 'INSERT INTO auth.users (...) VALUES (...); -- Crear usuario primero'
                }
              ].map((issue, index) => (
                <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="font-semibold text-orange-800 mb-2">❌ {issue.problem}</div>
                  <div className="text-sm text-orange-700 mb-3">✅ {issue.solution}</div>
                  {issue.code && (
                    <div className="bg-slate-900 text-green-400 p-2 rounded text-xs font-mono overflow-x-auto">
                      <pre>{issue.code}</pre>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-800">Sistema Operativo</span>
            </div>
            <p className="text-sm text-green-700">
              El sistema está completamente funcional con 5 roles diferentes, base de datos demo poblada, 
              autenticación segura, y manuales de usuario para cada credencial. 
              Listo para demo y desarrollo adicional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualCodigo;
