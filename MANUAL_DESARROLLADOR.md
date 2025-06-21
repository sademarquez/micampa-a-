
# 💻 MANUAL DE DESARROLLADOR - MI CAMPAÑA 2025

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Estado Global**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm

### Estructura del Proyecto
```
src/
├── components/           # Componentes UI reutilizables
│   ├── ui/              # Componentes shadcn/ui
│   └── [feature]/       # Componentes específicos
├── contexts/            # Context providers
│   └── AuthContext.tsx  # Autenticación y estado global
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Hook de autenticación
│   └── [others]/       # Otros hooks personalizados
├── pages/              # Páginas principales
├── lib/                # Utilidades y configuraciones
├── integrations/       # Integraciones externas
│   └── supabase/       # Cliente y tipos de Supabase
└── types/              # Definiciones de tipos TypeScript
```

---

## 🔐 Sistema de Autenticación

### Configuración de Supabase

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zecltlsdkbndhqimpjjo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIs...";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

### AuthContext Simplificado

```typescript
// Flujo de autenticación simplificado
const login = async (email: string, password: string) => {
  // 1. Autenticación con Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  // 2. Manejo de errores
  if (error) {
    return { success: false, error: mapErrorMessage(error) };
  }

  // 3. Éxito
  return { success: true };
};
```

### Gestión de Perfiles

```sql
-- Tabla profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role user_role DEFAULT 'votante',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enum de roles
CREATE TYPE user_role AS ENUM (
  'desarrollador',
  'master',
  'candidato', 
  'lider',
  'votante'
);
```

---

## 🛠️ Configuración del Entorno

### Requisitos Previos
- **Node.js** 18+ con npm
- **Git** para control de versiones
- **Cuenta de Supabase** para backend
- **Editor** con soporte TypeScript

### Instalación Local

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd mi-campana-2025

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# (Las URLs de Supabase están hardcodeadas en el cliente)

# 4. Ejecutar en desarrollo
npm run dev

# 5. Construir para producción
npm run build
```

### Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}
```

---

## 🔧 Componentes Principales

### AuthContext Provider

```typescript
// Uso del contexto de autenticación
const { user, login, logout, isAuthenticated, isLoading } = useAuth();

// Estados disponibles
interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Rutas Protegidas

```typescript
// Componente ProtectedRoute
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};
```

### Navegación

```typescript
// Sistema de navegación con roles
const Navigation = () => {
  const { user } = useAuth();
  
  return (
    <nav>
      {/* Elementos de navegación basados en rol */}
      {user?.role === 'desarrollador' && <AdminLinks />}
      {user?.role === 'master' && <MasterLinks />}
      {/* ... otros roles */}
    </nav>
  );
};
```

---

## 🗄️ Base de Datos

### Esquema Principal

```sql
-- Usuarios y perfiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role user_role DEFAULT 'votante',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Territorios
CREATE TABLE public.territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votantes
CREATE TABLE public.voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  territory_id UUID REFERENCES territories(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensajes
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alertas
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority alert_priority DEFAULT 'media',
  status alert_status DEFAULT 'activa',
  location_lat DECIMAL,
  location_lng DECIMAL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Políticas RLS

```sql
-- Ejemplo de política para perfiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Política jerárquica para votantes  
CREATE POLICY "Users can manage their voters"
ON public.voters FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM profiles 
    WHERE role IN ('desarrollador', 'master') 
    OR (role = 'candidato' AND created_by = auth.uid())
    OR (role = 'lider' AND created_by = auth.uid())
  )
);
```

---

## ⚡ Hooks Personalizados

### useAuth Hook

```typescript
// Hook de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### useSupabase Hook

```typescript
// Hook para operaciones con Supabase
export const useSupabase = () => {
  const { user } = useAuth();
  
  const insertData = async (table: string, data: any) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  };

  return { insertData, /* otras operaciones */ };
};
```

---

## 🎨 Guías de Estilo

### Componentes React

```typescript
// Estructura recomendada de componente
interface ComponentProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const Component = ({ title, children, className }: ComponentProps) => {
  // Estados locales
  const [state, setState] = useState(initialValue);
  
  // Efectos
  useEffect(() => {
    // lógica de efecto
  }, [dependencies]);
  
  // Handlers
  const handleAction = () => {
    // lógica del handler
  };
  
  // Render
  return (
    <div className={cn("base-classes", className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Component;
```

### Estilos con Tailwind

```typescript
// Uso recomendado de Tailwind CSS
const buttonStyles = {
  base: "px-4 py-2 rounded font-medium transition-colors",
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

// Componente con variantes
<button className={cn(buttonStyles.base, buttonStyles.primary)}>
  Botón Primario
</button>
```

---

## 🔄 Gestión de Estado

### Context Pattern

```typescript
// Patrón para contextos específicos
interface FeatureContextType {
  data: DataType[];
  loading: boolean;
  error: string | null;
  actions: {
    fetch: () => Promise<void>;
    create: (item: DataType) => Promise<void>;
    update: (id: string, item: Partial<DataType>) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider = ({ children }: { children: ReactNode }) => {
  // Implementación del proveedor
  const value = {
    data,
    loading,
    error,
    actions: { fetch, create, update, delete }
  };

  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
};
```

---

## 🚀 Despliegue

### Build de Producción

```bash
# 1. Instalar dependencias
npm ci

# 2. Ejecutar linting
npm run lint

# 3. Construir aplicación
npm run build

# 4. Verificar build
npm run preview
```

### Configuración PWA

```typescript
// vite.config.ts - Configuración PWA
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Mi Campaña 2025',
        short_name: 'MiCampaña',
        theme_color: '#1e40af',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

### Variables de Entorno

```typescript
// Configuración de variables (hardcodeadas en el cliente)
const config = {
  supabase: {
    url: "https://zecltlsdkbndhqimpjjo.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIs..."
  },
  app: {
    name: "Mi Campaña 2025",
    version: "2.0.0"
  }
};
```

---

## 🧪 Testing

### Jest + React Testing Library

```typescript
// Ejemplo de test de componente
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderWithAuth(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    renderWithAuth(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@micampana.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'AdminSecure2025!' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar comportamiento esperado
  });
});
```

---

## 🐛 Debugging

### Herramientas de Debug

```typescript
// Logger personalizado
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

// Uso en componentes
const Component = () => {
  useEffect(() => {
    logger.info('Component mounted');
    return () => logger.info('Component unmounted');
  }, []);
};
```

### React DevTools

```typescript
// Configuración para desarrollo
if (process.env.NODE_ENV === 'development') {
  // Habilitar herramientas de desarrollo
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
}
```

---

## 📊 Monitoreo y Analytics

### Logging de Eventos

```typescript
// Sistema de logging de eventos
const trackEvent = (event: string, properties?: Record<string, any>) => {
  console.log(`Event: ${event}`, properties);
  
  // En producción, enviar a servicio de analytics
  if (process.env.NODE_ENV === 'production') {
    // analytics.track(event, properties);
  }
};

// Uso en componentes
const handleLogin = async () => {
  trackEvent('user_login_attempt', { method: 'email' });
  
  try {
    await login(email, password);
    trackEvent('user_login_success');
  } catch (error) {
    trackEvent('user_login_error', { error: error.message });
  }
};
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### Error: "Module not found"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Build fails"
```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Verificar linting
npm run lint
```

#### Error: "Auth not working"
```typescript
// Verificar configuración de Supabase
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Auth status:', await supabase.auth.getSession());
```

### Logs de Desarrollo

```typescript
// Habilitar logs detallados en desarrollo
if (process.env.NODE_ENV === 'development') {
  // Logs de Supabase
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state change:', event, session);
  });
  
  // Logs de contexto
  console.log('Current user:', user);
  console.log('Current session:', session);
}
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Supabase**: https://supabase.com/docs
- **Vite**: https://vitejs.dev/

### Herramientas Recomendadas
- **VS Code** con extensiones React/TypeScript
- **Chrome DevTools** para debugging
- **Postman** para testing de API
- **Git** para control de versiones

---

*Manual técnico para desarrolladores - MI CAMPAÑA 2025 v2.0*  
*Fecha: Junio 2025 | Versión: 1.0*
