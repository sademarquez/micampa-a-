
# 🤖 MANUAL PARA LLM - DIAGNÓSTICOS Y CORRECCIÓN AUTOMÁTICA

## 🎯 OBJETIVO
Este manual proporciona instrucciones específicas para que un LLM pueda diagnosticar, analizar y corregir automáticamente errores en el sistema MI CAMPAÑA PWA SEGURA v2.0.

## 🔍 SISTEMA DE DIAGNÓSTICOS

### 1. IDENTIFICACIÓN DE ERRORES

#### Patrones de Error Comunes
```javascript
// ❌ ERROR TIPO 1: Autenticación
"[AUTH] Error de login: AuthApiError: Invalid login credentials"
"[AUTH] Error de login: AuthApiError: Email not confirmed"

// ❌ ERROR TIPO 2: Base de Datos  
"[DATABASE] Error fetching data: relation does not exist"
"[DATABASE] RLS policy violation"

// ❌ ERROR TIPO 3: UI/Frontend
"TypeError: Cannot read properties of undefined"
"[UI] Component render error"

// ❌ ERROR TIPO 4: Sistema
"[SYSTEM] Health check failed"
"[SYSTEM] Configuration error"
```

### 2. COMANDO DE DIAGNÓSTICO AUTOMÁTICO

```bash
# Para diagnosticar el sistema, ejecutar en consola:
console.log('🔍 DIAGNÓSTICO AUTOMÁTICO INICIADO');

// Verificar salud del sistema
const systemHealth = document.querySelector('[data-system-health]')?.textContent;
console.log('Estado del Sistema:', systemHealth);

// Verificar últimos logs
const logs = performance.getEntriesByType('navigation');
console.log('Logs de Navegación:', logs);

// Verificar errores de autenticación
const authErrors = localStorage.getItem('auth-errors');
console.log('Errores de Auth:', authErrors);
```

## 🔧 GUÍA DE CORRECCIÓN AUTOMÁTICA

### PROTOCOLO DE CORRECCIÓN AUTOMÁTICA

#### PASO 1: Identificar Categoría del Error
```typescript
const diagnoseError = (error: string) => {
  if (error.includes('[AUTH]')) {
    return 'AUTHENTICATION_ERROR';
  } else if (error.includes('[DATABASE]')) {
    return 'DATABASE_ERROR';
  } else if (error.includes('[UI]')) {
    return 'UI_ERROR';
  } else if (error.includes('[SYSTEM]')) {
    return 'SYSTEM_ERROR';
  }
  return 'UNKNOWN_ERROR';
};
```

#### PASO 2: Aplicar Corrección Específica

### 🔐 ERRORES DE AUTENTICACIÓN

#### Error: "Invalid login credentials"
```typescript
// DIAGNÓSTICO:
// 1. Verificar credenciales en SecureLogin.tsx
// 2. Comprobar tabla auth.users en Supabase
// 3. Verificar encriptación de contraseñas

// CORRECCIÓN AUTOMÁTICA:
const fixAuthCredentials = () => {
  // Actualizar credenciales seguras
  const secureCredentials = [
    { email: "admin@micampana.com", password: "AdminSecure2025!" },
    { email: "master@micampana.com", password: "MasterSecure2025!" },
    { email: "candidato@micampana.com", password: "CandidatoSecure2025!" }
  ];
  
  // Verificar que las contraseñas estén encriptadas correctamente
  // SQL a ejecutar en Supabase:
  /*
  UPDATE auth.users 
  SET encrypted_password = crypt('AdminSecure2025!', gen_salt('bf'))
  WHERE email = 'admin@micampana.com';
  */
};
```

#### Error: "Email not confirmed"
```sql
-- CORRECCIÓN SQL AUTOMÁTICA:
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email IN ('admin@micampana.com', 'master@micampana.com', 'candidato@micampana.com');
```

### 🗄️ ERRORES DE BASE DE DATOS

#### Error: "relation does not exist"
```sql
-- DIAGNÓSTICO: Tabla faltante
-- CORRECCIÓN: Verificar migración
-- SQL DE CORRECCIÓN:
CREATE TABLE IF NOT EXISTS public.missing_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);
```

#### Error: "RLS policy violation"
```sql
-- CORRECCIÓN RLS:
-- 1. Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'table_name';

-- 2. Crear política faltante
CREATE POLICY "Users can access own data" 
ON public.table_name 
FOR ALL 
USING (auth.uid() = user_id);
```

### 🎨 ERRORES DE UI

#### Error: "Cannot read properties of undefined"
```typescript
// CORRECCIÓN AUTOMÁTICA:
const fixUndefinedProps = () => {
  // Agregar verificaciones de seguridad
  const safeComponent = ({ data }: { data?: any }) => {
    if (!data) {
      console.warn('⚠️ Datos no definidos, renderizando componente vacío');
      return <div>Cargando...</div>;
    }
    
    return <div>{data.property}</div>;
  };
};
```

### ⚙️ ERRORES DEL SISTEMA

#### Error: "System health check failed"
```typescript
// CORRECCIÓN AUTOMÁTICA:
const fixSystemHealth = async () => {
  try {
    // Verificar configuración del sistema
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('key', 'maintenance_mode');
    
    if (error) {
      // Recrear configuración faltante
      await supabase
        .from('system_config')
        .insert({
          key: 'maintenance_mode',
          value: false,
          description: 'Modo de mantenimiento',
          category: 'system',
          is_public: true
        });
    }
  } catch (error) {
    console.error('Error corrigiendo salud del sistema:', error);
  }
};
```

## 🚨 ALERTAS Y NOTIFICACIONES AUTOMÁTICAS

### Sistema de Alertas en Código
```typescript
// ALERTA TIPO 1: Error Crítico
const CRITICAL_ERROR_ALERT = `
🚨 ERROR CRÍTICO DETECTADO 🚨
Tipo: {errorType}
Mensaje: {errorMessage}
Ubicación: {errorLocation}
Tiempo: {timestamp}
Acción: {suggestedAction}
`;

// ALERTA TIPO 2: Warning
const WARNING_ALERT = `
⚠️ ADVERTENCIA DEL SISTEMA ⚠️
Componente: {component}
Problema: {issue}
Impacto: {impact}
Solución: {solution}
`;

// ALERTA TIPO 3: Info
const INFO_ALERT = `
ℹ️ INFORMACIÓN DEL SISTEMA ℹ️
Evento: {event}
Estado: {status}
Detalles: {details}
`;
```

### Implementación de Alertas
```typescript
const alertSystem = {
  critical: (message: string, details?: any) => {
    console.error('🚨 CRÍTICO:', message, details);
    // Enviar a sistema de logging
    logError('system', message, new Error(message), details);
    
    // Mostrar toast crítico
    toast({
      title: "Error Crítico",
      description: message,
      variant: "destructive"
    });
  },
  
  warning: (message: string, details?: any) => {
    console.warn('⚠️ ADVERTENCIA:', message, details);
    logWarning('system', message, details);
  },
  
  info: (message: string, details?: any) => {
    console.info('ℹ️ INFO:', message, details);
    logInfo('system', message, details);
  }
};
```

## 🔄 PROCESO DE AUTOCORRECCIÓN

### Algoritmo de Autocorrección
```typescript
const autoCorrection = async (error: Error, context: string) => {
  console.log('🔄 INICIANDO AUTOCORRECCIÓN...');
  
  // PASO 1: Clasificar error
  const errorType = diagnoseError(error.message);
  
  // PASO 2: Aplicar corrección específica
  switch (errorType) {
    case 'AUTHENTICATION_ERROR':
      await fixAuthCredentials();
      break;
    case 'DATABASE_ERROR':
      await fixDatabaseIssue(error);
      break;
    case 'UI_ERROR':
      await fixUIIssue(error);
      break;
    case 'SYSTEM_ERROR':
      await fixSystemHealth();
      break;
  }
  
  // PASO 3: Verificar corrección
  const isFixed = await verifyFix(errorType);
  
  // PASO 4: Reportar resultado
  if (isFixed) {
    console.log('✅ AUTOCORRECCIÓN EXITOSA');
    alertSystem.info('Error corregido automáticamente', {
      error: error.message,
      context,
      correctionType: errorType
    });
  } else {
    console.log('❌ AUTOCORRECCIÓN FALLÓ');
    alertSystem.critical('Error no pudo ser corregido automáticamente', {
      error: error.message,
      context,
      requiresManualIntervention: true
    });
  }
};
```

## 📊 MÉTRICAS Y MONITOREO

### Dashboard de Diagnósticos
```typescript
const diagnosticsDashboard = {
  // Contadores de errores
  errorCounts: {
    auth: 0,
    database: 0,
    ui: 0,
    system: 0
  },
  
  // Correcciones exitosas
  successfulFixes: 0,
  
  // Estado del sistema
  systemStatus: 'healthy',
  
  // Último chequeo
  lastHealthCheck: new Date(),
  
  // Generar reporte
  generateReport: () => {
    return {
      timestamp: new Date(),
      totalErrors: Object.values(errorCounts).reduce((a, b) => a + b, 0),
      successRate: (successfulFixes / totalErrors) * 100,
      systemHealth: systemStatus,
      recommendations: generateRecommendations()
    };
  }
};
```

## 🎯 COMANDOS PARA LLM

### Comandos de Diagnóstico
```bash
# Para usar en chat con LLM:

1. "Diagnosticar sistema completo"
   -> Ejecutar checkSystemHealth()
   -> Revisar system_logs tabla
   -> Verificar configuraciones

2. "Corregir errores de autenticación"
   -> Ejecutad fixAuthCredentials()
   -> Verificar credenciales en SecureLogin.tsx
   -> Actualizar auth.users si necesario

3. "Revisar logs del sistema"
   -> Query: SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 50;
   -> Analizar patrones de errores
   -> Sugerir correcciones

4. "Estado de salud actual"
   -> Verificar SystemHealthIndicator
   -> Comprobar system_config
   -> Reportar estado general
```

### Formato de Respuesta para LLM
```markdown
## 🔍 DIAGNÓSTICO COMPLETADO

**Estado del Sistema**: [Healthy/Warning/Error]
**Errores Detectados**: [Número]
**Correcciones Aplicadas**: [Número]

### Errores Encontrados:
1. **Tipo**: [AUTH/DATABASE/UI/SYSTEM]
   **Mensaje**: [Error message]
   **Solución**: [Applied solution]
   **Estado**: [Fixed/Pending/Failed]

### Acciones Recomendadas:
- [ ] [Acción 1]
- [ ] [Acción 2] 
- [ ] [Acción 3]

### Próximos Pasos:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]
```

---

## 📝 NOTAS IMPORTANTES PARA EL LLM

1. **Siempre verificar logs antes de aplicar correcciones**
2. **Hacer backup de configuraciones críticas**
3. **Probar correcciones en ambiente de desarrollo primero**
4. **Documentar todas las correcciones aplicadas**
5. **Verificar el impacto de las correcciones en el sistema completo**

**Versión del Manual**: 2.0.0  
**Última Actualización**: 2025-01-15  
**Compatible con**: MI CAMPAÑA PWA SEGURA v2.0
