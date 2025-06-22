# 🚀 DESPLIEGUE AGORA EN GOOGLE CLOUD PREMIUM

## 📋 **REQUISITOS PREVIOS**

- ✅ Cuenta Google Cloud Premium
- ✅ $300 de crédito gratuito activado
- ✅ Google Cloud CLI instalado
- ✅ Docker instalado

## 🎯 **ARQUITECTURA DESPLEGADA**

```
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD PREMIUM                     │
├─────────────────────────────────────────────────────────────┤
│  🌐 Cloud Load Balancer (HTTPS)                            │
│  ├── Cloud Run (Agora PWA) - Auto-scaling                  │
│  ├── Cloud Run (n8n Backend) - Auto-scaling                │
│  ├── Cloud SQL (PostgreSQL) - Managed                      │
│  ├── Cloud Memorystore (Redis) - Managed                   │
│  └── Cloud Storage (Assets) - CDN Global                   │
└─────────────────────────────────────────────────────────────┘
```

## ⚡ **DESPLIEGUE RÁPIDO (15 minutos)**

### **Paso 1: Preparación**
```bash
# Clonar repositorio
git clone [tu-repo]
cd asad

# Instalar Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Autenticarse
gcloud auth login
gcloud auth application-default login
```

### **Paso 2: Ejecutar Script Automatizado**
```bash
# Dar permisos de ejecución
chmod +x scripts/deploy-google-cloud.sh

# Ejecutar despliegue
./scripts/deploy-google-cloud.sh
```

### **Paso 3: Configurar Billing**
1. Ve a: https://console.cloud.google.com/billing
2. Selecciona tu proyecto
3. Vincula una cuenta de billing
4. Regresa al terminal y presiona Enter

## 🔧 **CONFIGURACIÓN MANUAL (Alternativa)**

### **1. Crear Proyecto**
```bash
PROJECT_ID="agora-campaign-$(date +%s)"
gcloud projects create $PROJECT_ID --name="Agora Campaign Platform"
gcloud config set project $PROJECT_ID
```

### **2. Habilitar APIs**
```bash
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### **3. Crear Base de Datos**
```bash
gcloud sql instances create agora-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB

gcloud sql databases create agora_db --instance=agora-postgres
gcloud sql users create agora_user \
  --instance=agora-postgres \
  --password=agora2024secure
```

### **4. Crear Redis**
```bash
gcloud redis instances create agora-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_6_x \
  --tier=basic
```

### **5. Desplegar Aplicación**
```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 💰 **COSTOS ESTIMADOS (Con Premium)**

| Servicio | Configuración | Costo Normal | Con Premium |
|----------|---------------|--------------|-------------|
| **Cloud Run** | 2 instancias | $40/mes | $20/mes |
| **Cloud SQL** | db-f1-micro | $25/mes | $12/mes |
| **Redis** | 1GB | $30/mes | $15/mes |
| **Load Balancer** | Global | $20/mes | $10/mes |
| **Storage** | 10GB + CDN | $15/mes | $8/mes |
| **Gemini API** | 1M requests | $30/mes | $15/mes |
| **Total** | | **$160/mes** | **$80/mes** |

## 🌐 **URLs DESPUÉS DEL DESPLIEGUE**

- **Frontend**: `https://agora-frontend-[PROJECT-ID].run.app`
- **Backend**: `https://agora-backend-[PROJECT-ID].run.app`
- **n8n Dashboard**: `https://agora-backend-[PROJECT-ID].run.app`
- **Base de Datos**: `[CONNECTION-NAME]`
- **Redis**: `[REDIS-HOST]`

## 🔐 **CREDENCIALES POR DEFECTO**

- **n8n Admin**: `admin` / `agora2024`
- **PostgreSQL**: `agora_user` / `agora2024secure`
- **Redis**: Sin autenticación (red privada)

## 📊 **MONITOREO Y MANTENIMIENTO**

### **Ver Logs**
```bash
gcloud logging read 'resource.type=cloud_run_revision'
```

### **Escalar Servicios**
```bash
gcloud run services update agora-frontend --max-instances=10
gcloud run services update agora-backend --max-instances=5
```

### **Backup Automático**
- PostgreSQL: Diario a las 2:00 AM
- Redis: Automático cada hora
- Storage: Replicación automática

### **Monitoreo**
```bash
# Crear dashboard de monitoreo
gcloud monitoring dashboards create --config-from-file=monitoring/dashboard.yaml
```

## 🚨 **TROUBLESHOOTING**

### **Error: Billing no configurado**
```bash
# Configurar billing manualmente
gcloud billing projects link [PROJECT_ID] --billing-account=[BILLING_ACCOUNT_ID]
```

### **Error: APIs no habilitadas**
```bash
# Habilitar todas las APIs necesarias
gcloud services enable run.googleapis.com sqladmin.googleapis.com redis.googleapis.com
```

### **Error: Permisos insuficientes**
```bash
# Asignar roles necesarios
gcloud projects add-iam-policy-binding [PROJECT_ID] \
  --member="user:[TU-EMAIL]" \
  --role="roles/owner"
```

## 🎉 **VENTAJAS DEL DESPLIEGUE EN GOOGLE CLOUD**

1. **⚡ Rendimiento**: Infraestructura de clase mundial
2. **🧠 IA Nativa**: Integración perfecta con Gemini
3. **📈 Auto-scaling**: Se adapta automáticamente a la carga
4. **🔒 Seguridad**: Cumple estándares empresariales
5. **💰 Costo-efectivo**: Con Premium, 50% de descuento
6. **🌍 Global**: CDN en 200+ ubicaciones
7. **📊 Monitoreo**: Métricas en tiempo real
8. **🛠️ DevOps**: CI/CD integrado

## 📞 **SOPORTE**

- **Documentación**: https://cloud.google.com/docs
- **Soporte Premium**: Incluido con tu cuenta
- **Comunidad**: https://cloud.google.com/community
- **Status**: https://status.cloud.google.com

---

**¡Agora está listo para conquistar el mundo electoral! 🚀** 