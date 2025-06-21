
# 🚀 GUÍA DE PUBLICACIÓN - MI CAMPAÑA 2025

## 📋 Lista de Verificación Pre-Publicación

### ✅ Verificaciones Técnicas

#### 1. Funcionalidad
- [ ] Sistema de login funciona correctamente
- [ ] Todos los roles pueden acceder a sus respectivas funciones
- [ ] Navegación entre páginas sin errores
- [ ] Responsive design en móviles y tablets
- [ ] Funcionalidades offline básicas (PWA)

#### 2. Seguridad
- [ ] Credenciales de producción configuradas
- [ ] RLS (Row Level Security) habilitado en Supabase
- [ ] No hay credenciales hardcodeadas expuestas
- [ ] HTTPS habilitado
- [ ] Políticas de seguridad implementadas

#### 3. Performance
- [ ] Tiempos de carga optimizados
- [ ] Imágenes comprimidas
- [ ] Bundle size optimizado
- [ ] Lazy loading implementado donde corresponde

#### 4. PWA
- [ ] Manifest.json configurado
- [ ] Service Worker funcionando
- [ ] Iconos para diferentes dispositivos
- [ ] Instalable como app móvil

---

## 🛠️ Configuración de Producción

### 1. Build de Producción

```bash
# 1. Limpiar dependencias
rm -rf node_modules package-lock.json
npm install

# 2. Ejecutar linting
npm run lint

# 3. Construir para producción
npm run build

# 4. Verificar build localmente
npm run preview
```

### 2. Configuración de Variables

```typescript
// Verificar configuración en src/integrations/supabase/client.ts
const SUPABASE_URL = "https://zecltlsdkbndhqimpjjo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIs...";

// ✅ Estas credenciales son públicas y seguras para exposición
// ✅ Las credenciales privadas están en el servidor de Supabase
```

### 3. Optimización PWA

```typescript
// Verificar configuración en vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5000000
      },
      manifest: {
        name: 'Mi Campaña 2025',
        short_name: 'MiCampaña',
        description: 'Sistema de Gestión Electoral 2025',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png', 
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

---

## 🌐 Opciones de Despliegue

### Opción 1: Lovable (Recomendado para Demo)

1. **En Lovable Editor**:
   - Clic en botón "Share" (esquina superior derecha)
   - Seleccionar "Publish"
   - Configurar dominio personalizado (opcional)
   - Clic en "Publish App"

2. **Ventajas**:
   - ✅ Despliegue inmediato
   - ✅ SSL automático
   - ✅ CDN global
   - ✅ Actualizaciones automáticas
   - ✅ Sin configuración adicional

### Opción 2: Vercel (Recomendado para Producción)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Conectar con GitHub (opcional)
# - Hacer push del código a GitHub
# - Conectar repositorio en vercel.com

# 3. Desplegar directamente
vercel

# 4. Configurar dominio personalizado
vercel --prod
```

**Configuración vercel.json**:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {},
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Opción 3: Netlify

```bash
# 1. Construir aplicación
npm run build

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Desplegar
netlify deploy --prod --dir=dist
```

**Configuración netlify.toml**:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔐 Configuración de Base de Datos

### 1. Verificar Políticas RLS

```sql
-- Verificar que RLS esté habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 2. Configurar Usuarios Demo (Producción)

```sql
-- Crear usuarios demo para presentaciones
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES 
-- Desarrollador
(
  gen_random_uuid(),
  'admin@micampana.com',
  crypt('AdminSecure2025!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
),
-- Master  
(
  gen_random_uuid(),
  'master@micampana.com', 
  crypt('MasterSecure2025!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
),
-- Candidato
(
  gen_random_uuid(),
  'candidato@micampana.com',
  crypt('CandidatoSecure2025!', gen_salt('bf')), 
  NOW(),
  NOW(),
  NOW()
),
-- Líder
(
  gen_random_uuid(),
  'lider@micampana.com',
  crypt('LiderSecure2025!', gen_salt('bf')),
  NOW(),
  NOW(), 
  NOW()
);
```

---

## 📱 Configuración PWA

### 1. Iconos Requeridos

Crear iconos en `/public/`:
- `favicon.ico` (32x32)
- `icon-192.png` (192x192) 
- `icon-512.png` (512x512)
- `apple-touch-icon.png` (180x180)

### 2. Manifest Web App

```json
{
  "name": "Mi Campaña 2025",
  "short_name": "MiCampaña", 
  "description": "Sistema de Gestión Electoral 2025",
  "theme_color": "#1e40af",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/",
  "start_url": "/",
  "categories": ["politics", "productivity", "business"],
  "lang": "es-ES",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192", 
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png", 
      "purpose": "any maskable"
    }
  ]
}
```

---

## 🔍 Testing Pre-Publicación

### 1. Tests Manuales

#### Login y Autenticación
- [ ] Login con cada rol funciona
- [ ] Logout funciona correctamente
- [ ] Redirecciones automáticas funcionan
- [ ] Estados de carga se muestran correctamente

#### Navegación
- [ ] Todas las rutas cargan sin error
- [ ] Navegación entre páginas fluida
- [ ] Rutas protegidas bloquean acceso no autorizado
- [ ] 404 para rutas inexistentes

#### Responsive Design
- [ ] Móvil (320px - 768px)
- [ ] Tablet (768px - 1024px) 
- [ ] Desktop (1024px+)
- [ ] Orientación portrait y landscape

#### PWA
- [ ] Instalable en móvil
- [ ] Funciona offline (básico)
- [ ] Iconos se muestran correctamente
- [ ] Splash screen funciona

### 2. Tests Automatizados

```bash
# Ejecutar tests (si están configurados)
npm test

# Verificar cobertura
npm run test:coverage

# Tests de accessibility
npm run test:a11y
```

---

## 📊 Monitoreo Post-Publicación

### 1. Analytics Básico

```typescript
// Tracking de eventos importantes
const trackEvent = (event: string, properties?: object) => {
  console.log(`📊 Event: ${event}`, properties);
  
  // En producción, enviar a Google Analytics, etc.
  if (typeof gtag !== 'undefined') {
    gtag('event', event, properties);
  }
};

// Eventos clave a trackear
trackEvent('app_started');
trackEvent('user_login', { role: user.role });
trackEvent('page_view', { page: location.pathname });
```

### 2. Error Monitoring  

```typescript
// Captura de errores globales
window.addEventListener('error', (event) => {
  console.error('💥 Global Error:', event.error);
  
  // En producción, enviar a Sentry, etc.
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(event.error);
  }
});

// Errores de promesas no capturadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled Promise Rejection:', event.reason);
});
```

---

## 🚀 Lista Final de Publicación

### Pre-Publicación
- [ ] ✅ Todos los tests pasan
- [ ] ✅ Build de producción exitoso
- [ ] ✅ PWA configurado correctamente  
- [ ] ✅ Base de datos con datos demo
- [ ] ✅ Políticas de seguridad activas
- [ ] ✅ Performance optimizado

### Publicación
- [ ] ✅ Aplicación desplegada
- [ ] ✅ Dominio personalizado configurado (opcional)
- [ ] ✅ HTTPS habilitado  
- [ ] ✅ CDN configurado
- [ ] ✅ Monitoreo básico activo

### Post-Publicación
- [ ] ✅ Verificar funcionamiento en diferentes dispositivos
- [ ] ✅ Probar instalación PWA
- [ ] ✅ Verificar velocidad de carga
- [ ] ✅ Documentar URL final
- [ ] ✅ Compartir credenciales de demo

---

## 📞 URLs y Credenciales Finales

### URLs de Aplicación
- **Staging (Lovable)**: `https://your-app.lovable.app`
- **Producción**: `https://tu-dominio-personalizado.com`
- **GitHub**: `https://github.com/usuario/mi-campana-2025`

### Credenciales Demo (Para Presentaciones)

| Rol | Email | Contraseña | 
|-----|--------|------------|
| **Desarrollador** | `admin@micampana.com` | `AdminSecure2025!` |
| **Master** | `master@micampana.com` | `MasterSecure2025!` |
| **Candidato** | `candidato@micampana.com` | `CandidatoSecure2025!` |
| **Líder** | `lider@micampana.com` | `LiderSecure2025!` |

### Panel de Administración
- **Supabase Dashboard**: `https://app.supabase.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard` (si aplica)

---

## 🎯 Próximos Pasos

1. **Presentación Demo**
   - Preparar script de demostración
   - Probar en diferentes dispositivos
   - Preparar datos de muestra

2. **Feedback y Mejoras**
   - Recopilar feedback de usuarios
   - Implementar mejoras prioritarias
   - Planificar versión 2.1

3. **Escalabilidad**
   - Monitorear uso y performance
   - Planificar infraestructura para escala
   - Implementar métricas avanzadas

---

*Guía de publicación - MI CAMPAÑA 2025 v2.0*  
*¡Lista para producción! 🚀*
