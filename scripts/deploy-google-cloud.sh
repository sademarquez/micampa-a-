#!/bin/bash

# Script de despliegue automatizado para Google Cloud
echo "🚀 DESPLIEGUE AUTOMATIZADO - AGORA EN GOOGLE CLOUD"
echo "=================================================="

# Variables
PROJECT_ID="agora-campaign-$(date +%s)"
REGION="us-central1"
ZONE="us-central1-a"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📋 Configurando proyecto: $PROJECT_ID${NC}"

# 1. Crear proyecto
gcloud projects create $PROJECT_ID --name="Agora Campaign Platform"
gcloud config set project $PROJECT_ID

# 2. Habilitar APIs
echo -e "${YELLOW}🔧 Habilitando servicios...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable compute.googleapis.com

# 3. Configurar billing (requiere interacción manual)
echo -e "${RED}⚠️  IMPORTANTE: Configura el billing manualmente en la consola${NC}"
echo -e "${YELLOW}🌐 Ve a: https://console.cloud.google.com/billing/projects/$PROJECT_ID${NC}"
read -p "Presiona Enter cuando hayas configurado el billing..."

# 4. Crear base de datos PostgreSQL
echo -e "${YELLOW}🗄️  Creando base de datos PostgreSQL...${NC}"
gcloud sql instances create agora-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=02:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=03:00

gcloud sql databases create agora_db --instance=agora-postgres

# 5. Crear usuario de base de datos
echo -e "${YELLOW}👤 Creando usuario de base de datos...${NC}"
gcloud sql users create agora_user \
  --instance=agora-postgres \
  --password=agora2024secure

# 6. Crear instancia Redis
echo -e "${YELLOW}🔴 Creando instancia Redis...${NC}"
gcloud redis instances create agora-redis \
  --size=1 \
  --region=$REGION \
  --redis-version=redis_6_x \
  --tier=basic

# 7. Obtener información de conexión
echo -e "${YELLOW}🔗 Obteniendo información de conexión...${NC}"
DB_HOST=$(gcloud sql instances describe agora-postgres --format="value(connectionName)")
REDIS_HOST=$(gcloud redis instances describe agora-redis --region=$REGION --format="value(host)")

# 8. Configurar variables de entorno
echo -e "${YELLOW}⚙️  Configurando variables de entorno...${NC}"
export DATABASE_URL="postgresql://agora_user:agora2024secure@$DB_HOST:5432/agora_db"
export REDIS_URL="redis://$REDIS_HOST:6379"

# 9. Desplegar con Cloud Build
echo -e "${YELLOW}🏗️  Desplegando con Cloud Build...${NC}"
gcloud builds submit --config cloudbuild.yaml .

# 10. Configurar dominio personalizado (opcional)
echo -e "${YELLOW}🌐 Configurando dominio...${NC}"
read -p "¿Tienes un dominio personalizado? (y/n): " has_domain
if [ "$has_domain" = "y" ]; then
    read -p "Ingresa tu dominio: " domain
    gcloud run domain-mappings create --service agora-frontend --domain $domain --region=$REGION
fi

# 11. Mostrar URLs finales
echo -e "${GREEN}✅ ¡Despliegue completado!${NC}"
echo -e "${GREEN}🌐 Frontend: https://agora-frontend-$(gcloud config get-value project).run.app${NC}"
echo -e "${GREEN}🔧 Backend: https://agora-backend-$(gcloud config get-value project).run.app${NC}"
echo -e "${GREEN}🗄️  Base de datos: $DB_HOST${NC}"
echo -e "${GREEN}🔴 Redis: $REDIS_HOST${NC}"

# 12. Mostrar comandos útiles
echo -e "${YELLOW}📚 Comandos útiles:${NC}"
echo "Ver logs: gcloud logging read 'resource.type=cloud_run_revision'"
echo "Escalar: gcloud run services update agora-frontend --max-instances=10"
echo "Monitorear: gcloud monitoring dashboards list"

echo -e "${GREEN}🎉 ¡Agora está desplegado en Google Cloud!${NC}" 