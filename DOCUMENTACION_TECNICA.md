
# 📋 DOCUMENTACIÓN TÉCNICA - MI CAMPAÑA PWA SEGURA v2.0

## 🏗️ ARQUITECTURA DEL SISTEMA

### Estructura General
```
src/
├── hooks/                    # Hooks personalizados
│   ├── useSystemLogger.ts   # Sistema de logging automático
│   ├── useErrorHandler.ts   # Manejo centralizado de errores
│   └── useDataSegregation.ts # Segregación de datos por roles
├── contexts/
│   └── SecureAuthContext.tsx # Contexto de autenticación segura
├── components/
│   └── SystemHealthIndicator.tsx # Indicador de salud del sistema
└── pages/
    └── SecureLogin.tsx      # Página de login empresarial
```

## 🔐 SISTEMA DE AUTENTICACIÓN SEGURA

### Credenciales Corporativas
```typescript
// Usuarios predefinidos con credenciales seguras
const secureCredentials = [
  {
    email: "admin@micampana.com",
    password: "AdminSecure2025!",
    role: "Desarrollador"
  },
  {
    email: "master@micampana.com", 
    password: "MasterSecure2025!",
    role: "Master"
  },
  {
    email: "candidato@micampana.com",
    password: "CandidatoSecure2025!",
    role: "Candidato" 
  }
];
```

### Características de Seguridad
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Sesiones persistentes y seguras
- ✅ Logging automático de todos los accesos
- ✅ Verificación de salud del sistema
- ✅ Manejo automático de errores

## 📊 SISTEMA DE LOGGING Y DIAGNÓSTICOS

### Niveles de Log
```typescript
type LogLevel = 'info' | 'warning' | 'error' | 'critical';
type LogCategory = 'auth' | 'database' | 'ui' | 'business_logic' | 'security' | 'performance' | 'system';
```

### Funciones de Logging
```typescript
// Uso del sistema de logging
const { logInfo, logError, logWarning } = useSystemLogger();

// Ejemplos de uso
logInfo('auth', 'Usuario autenticado exitosamente', { userId,  email });
logError('database', 'Error conectando a la base de datos', error);
logWarning('performance', 'Consulta lenta detectada', { queryTime });
```

### Base de Datos de Logs
```sql
-- Tabla system_logs para auditoría completa
CREATE TABLE public.system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  level text NOT NULL CHECK (level IN ('info', 'warning', 'error', 'critical')),
  category text NOT NULL,
  message text NOT NULL,
  details jsonb,
  user_id uuid REFERENCES auth.users(id),
  session_id text,
  ip_address inet,
  user_agent text,
  stack_trace text,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id)
);
```

## 🔧 SISTEMA DE MANEJO DE ERRORES

### Hook useErrorHandler
```typescript
const { handleError, handleAsyncError } = useErrorHandler();

// Manejo automático de errores
try {
  await riskOperation();
} catch (error) {
  handleError(error, 'Operación crítica', {
    showToast: true,
    logToSystem: true,
    category: 'business_logic'
  });
}
```

### Características del Manejo de Errores
- ✅ Logging automático de errores
- ✅ Notificaciones Toast al usuario
- ✅ Stack traces completos
- ✅ Categorización de errores
- ✅ Diagnósticos automáticos en consola

## 📈 MONITOREO DE SALUD DEL SISTEMA

### Indicador de Salud
```typescript
// Estados del sistema
type SystemHealth = 'healthy' | 'warning' | 'error';

// Verificación automática cada 30 segundos
const checkSystemHealth = async () => {
  // Verifica estado de mantenimiento
  // Verifica conectividad de base de datos
  // Actualiza indicador visual
};
```

### Componente SystemHealthIndicator
- 🟢 **Healthy**: Sistema operando normalmente
- 🟡 **Warning**: Advertencias menores detectadas
- 🔴 **Error**: Errores críticos presentes

## 🗄️ CONFIGURACIÓN DEL SISTEMA

### Tabla system_config
```sql
-- Configuraciones centralizadas
INSERT INTO public.system_config (key, value, description, category, is_public) VALUES
  ('app_version', '"2.0.0"', 'Versión de la aplicación PWA', 'system', true),
  ('maintenance_mode', 'false', 'Modo de mantenimiento', 'system', true),
  ('max_login_attempts', '5', 'Intentos máximos de login', 'security', false),
  ('session_timeout', '3600', 'Timeout de sesión en segundos', 'security', false),
  ('enable_diagnostics', 'true', 'Diagnósticos automáticos', 'debug', false);
```

## 🔄 FLUJO DE AUTENTICACIÓN SEGURA

### Proceso de Login
1. **Validación de Campos**: Email y contraseña requeridos
2. **Logging de Intento**: Registro automático del intento
3. **Autenticación Supabase**: Verificación segura de credenciales
4. **Carga de Perfil**: Obtención de datos del usuario
5. **Establecimiento de Sesión**: Sesión persistente y segura
6. **Logging de Éxito**: Registro de acceso exitoso
7. **Redirección**: Navegación al dashboard

### Manejo de Errores de Autenticación
```typescript
// Tipos de errores manejados automáticamente
if (error.message.includes('Invalid login credentials')) {
  errorMsg = 'Credenciales incorrectas. Verifica email y contraseña.';
} else if (error.message.includes('Email not confirmed')) {
  errorMsg = 'Email no confirmado. Revisa tu correo.';
} else {
  errorMsg += error.message;
}
```

## 🚀 ESCALABILIDAD EMPRESARIAL

### Características Empresariales
- ✅ **Logging Centralizado**: Todos los eventos registrados
- ✅ **Configuración Dinámica**: Parámetros ajustables sin código
- ✅ **Monitoreo en Tiempo Real**: Salud del sistema visible
- ✅ **Manejo Robusto de Errores**: Recuperación automática
- ✅ **Seguridad Empresarial**: Autenticación robusta
- ✅ **Auditoría Completa**: Trazabilidad de todas las acciones

### Preparación para Escala
- 📊 **Métricas**: Sistema listo para métricas empresariales
- 🔍 **Observabilidad**: Logs estructurados para análisis
- ⚡ **Performance**: Optimizado para cargas empresariales
- 🛡️ **Seguridad**: Arquitectura segura por diseño
- 📱 **PWA**: Funcionalidad offline y actualizaciones automáticas

## 🔧 GUÍA DE RESOLUCIÓN DE PROBLEMAS

### Errores Comunes y Soluciones

#### Error: "Invalid login credentials"
```bash
# Verificar en consola:
[AUTH] Error de login: AuthApiError: Invalid login credentials

# Solución:
1. Verificar que las credenciales sean correctas
2. Verificar en system_logs para más detalles
3. Revisar la tabla auth.users en Supabase
```

#### Error: "Email not confirmed" 
```bash
# Solución:
1. Ir a Supabase Dashboard > Authentication > Settings
2. Desactivar "Confirm email" para desarrollo
3. O confirmar email manualmente en la tabla auth.users
```

#### Sistema en Estado "Warning" o "Error"
```bash
# Verificación:
1. Revisar system_logs para errores recientes
2. Verificar system_config para modo mantenimiento
3. Comprobar conectividad con Supabase
```

## 📱 CARACTERÍSTICAS PWA

### Funcionalidades Implementadas
- ✅ **Service Worker**: Cache inteligente
- ✅ **Manifest**: Instalación como app nativa
- ✅ **Offline Support**: Funcionalidad básica sin conexión
- ✅ **Auto-updates**: Actualizaciones automáticas
- ✅ **Responsive**: Diseño adaptativo completo

### Próximas Implementaciones
- 🔄 **Push Notifications**: Notificaciones en tiempo real
- 📱 **Device APIs**: Acceso a cámara y GPS
- 🔄 **Background Sync**: Sincronización en segundo plano
- 💾 **Advanced Caching**: Cache inteligente por roles

---

## 📞 SOPORTE TÉCNICO

Para problemas técnicos:
1. Revisar logs en consola del navegador
2. Verificar tabla `system_logs` en Supabase
3. Comprobar estado del sistema en `SystemHealthIndicator`
4. Contactar al equipo de desarrollo con logs específicos

**Versión**: 2.0.0  
**Última Actualización**: 2025-01-15  
**Estado**: Producción - Escalable Empresarialmente
