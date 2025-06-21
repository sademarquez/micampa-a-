
# 🔐 GUÍA RÁPIDA - Credenciales SIMPLIFICADAS

## ⚡ CONTRASEÑA FIJA PARA TODOS

### 🔑 **CONTRASEÑA ÚNICA: `12345678`**

**TODOS LOS USUARIOS USAN LA MISMA CONTRASEÑA:** `12345678`

## 📋 CREDENCIALES ACTUALIZADAS

| Rol | **NOMBRE DE USUARIO** | Email | Contraseña |
|-----|----------------------|-------|------------|
| **Desarrollador** | `Desarrollador` | `dev@demo.com` | `12345678` |
| **Master** | `Master` | `master@demo.com` | `12345678` |
| **Candidato** | `Candidato` | `candidato@demo.com` | `12345678` |
| **Líder** | `Lider` | `lider@demo.com` | `12345678` |
| **Votante** | `Votante` | `votante@demo.com` | `12345678` |

## 🎯 PROCESO DE LOGIN SIMPLIFICADO

### 1. **Ir a `/login`**

### 2. **Crear usuarios demo** (botón verde)
- Hacer clic en "Crear usuarios demo"
- Esperar confirmación

### 3. **Usar credenciales:**
- **Usuario:** `Desarrollador`
- **Contraseña:** `12345678`

## ✅ PRUEBA RÁPIDA

**Para verificar que funciona:**

1. Abrir `/login`
2. Hacer clic en "Crear usuarios demo"
3. En el formulario:
   - **Nombre de Usuario:** `Desarrollador`
   - **Contraseña:** `12345678`
4. Hacer clic en "Iniciar Sesión"

## 🔧 VENTAJAS DE LA SIMPLIFICACIÓN

- **Emails válidos** para Supabase (@demo.com)
- **Sin caracteres especiales** (evita problemas)
- **Contraseña memorable** y sin conflictos
- **Login por nombre** evita problemas de email
- **Proceso unificado** para todos los usuarios

## 🚨 TROUBLESHOOTING

### Si no funciona:

1. **Verificar que se crearon los usuarios:**
   - Buscar mensaje "Usuarios creados"
   - Ver logs en consola del navegador (F12)

2. **Usar credenciales exactas:**
   - Nombre: `Desarrollador` (CON mayúscula inicial)
   - Contraseña: `12345678` (8 dígitos)

3. **Revisar base de datos:**
   - Los usuarios deben existir en `auth.users`
   - Los perfiles deben estar en `public.profiles`

## 💡 ESTRUCTURA TÉCNICA

```
📊 BASE DE DATOS:
├── auth.users (Supabase Auth)
│   ├── Email: dev@demo.com
│   └── Password: 12345678
│
├── public.profiles
│   ├── name: "Desarrollador"
│   ├── role: "desarrollador"
│   └── id: [UUID de auth.users]
│
└── Login por mapeo directo de nombres

🔐 LOGIN PROCESS:
1. Usuario ingresa: "Desarrollador"
2. Sistema mapea a: "dev@demo.com"
3. Realiza login con email mapeado
4. Autentica con contraseña: 12345678
```

## 🎯 USUARIOS RECOMENDADOS PARA PRUEBAS

**Usuario Principal:**
- `Desarrollador` / `12345678` - Todos los permisos

**Usuarios Secundarios:**
- `Master` / `12345678` - Gestión de candidatos
- `Candidato` / `12345678` - Gestión territorial

---

*Sistema simplificado con emails válidos y mapeo directo*
