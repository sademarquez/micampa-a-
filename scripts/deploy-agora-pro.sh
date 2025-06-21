#!/bin/bash

# 🚀 Script de Despliegue Agora Pro en GCP
# Autor: Daniel Felipe López
# Fecha: $(date +%Y-%m-%d)

set -e

echo "🚀 Iniciando despliegue de Agora Pro en GCP..."

# Variables de configuración
PROJECT_ID="agora-pro-2024"
CLUSTER_NAME="agora-cluster"
ZONE="us-central1-a"
NAMESPACE="agora-pro"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependencias
check_dependencies() {
    log_info "Verificando dependencias..."
    
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI no está instalado"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl no está instalado"
        exit 1
    fi
    
    log_success "Dependencias verificadas"
}

# Configurar proyecto GCP
setup_project() {
    log_info "Configurando proyecto GCP..."
    
    gcloud config set project $PROJECT_ID
    
    # Habilitar APIs necesarias
    gcloud services enable container.googleapis.com
    gcloud services enable redis.googleapis.com
    gcloud services enable pubsub.googleapis.com
    gcloud services enable monitoring.googleapis.com
    gcloud services enable logging.googleapis.com
    
    log_success "Proyecto configurado"
}

# Crear clúster GKE
create_cluster() {
    log_info "Creando clúster GKE..."
    
    gcloud container clusters create $CLUSTER_NAME \
        --zone=$ZONE \
        --num-nodes=3 \
        --enable-autoscaling \
        --min-nodes=1 \
        --max-nodes=10 \
        --machine-type=e2-standard-4 \
        --enable-autorepair \
        --enable-autoupgrade \
        --enable-network-policy \
        --enable-ip-alias \
        --create-subnetwork="" \
        --enable-master-authorized-networks \
        --master-authorized-networks=0.0.0.0/0
    
    # Configurar kubectl
    gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE
    
    log_success "Clúster GKE creado"
}

# Crear namespace
create_namespace() {
    log_info "Creando namespace..."
    
    kubectl apply -f k8s/namespace.yaml
    
    log_success "Namespace creado"
}

# Crear secrets
create_secrets() {
    log_info "Creando secrets..."
    
    kubectl apply -f k8s/secrets.yaml
    
    log_success "Secrets creados"
}

# Desplegar n8n
deploy_n8n() {
    log_info "Desplegando n8n..."
    
    kubectl apply -f k8s/n8n-deployment.yaml
    kubectl apply -f k8s/n8n-service.yaml
    kubectl apply -f k8s/n8n-hpa.yaml
    
    log_success "n8n desplegado"
}

# Configurar Ingress
setup_ingress() {
    log_info "Configurando Ingress..."
    
    kubectl apply -f k8s/n8n-ingress.yaml
    
    log_success "Ingress configurado"
}

# Crear Memorystore Redis
create_redis() {
    log_info "Creando Memorystore Redis..."
    
    gcloud redis instances create agora-redis \
        --size=5 \
        --region=us-central1 \
        --redis-version=redis_6_x \
        --tier=STANDARD \
        --connect-mode=PRIVATE_SERVICE_ACCESS
    
    log_success "Memorystore Redis creado"
}

# Configurar Pub/Sub
setup_pubsub() {
    log_info "Configurando Pub/Sub..."
    
    # Crear tópicos
    gcloud pubsub topics create eventos-electorales
    gcloud pubsub topics create procesamiento-mensajes
    gcloud pubsub topics create analisis-datos
    
    # Crear suscripciones
    gcloud pubsub subscriptions create procesamiento-votantes \
        --topic=eventos-electorales \
        --push-endpoint=https://webhook.agora-pro.com/webhook/votantes
    
    gcloud pubsub subscriptions create envio-mensajes \
        --topic=procesamiento-mensajes \
        --push-endpoint=https://webhook.agora-pro.com/webhook/mensajes
    
    log_success "Pub/Sub configurado"
}

# Configurar monitoreo
setup_monitoring() {
    log_info "Configurando monitoreo..."
    
    # Crear dashboard de monitoreo
    gcloud monitoring dashboards create --config-from-file=monitoring/dashboard.yaml
    
    # Crear alertas
    gcloud alpha monitoring policies create --policy-from-file=monitoring/alerts.yaml
    
    log_success "Monitoreo configurado"
}

# Verificar despliegue
verify_deployment() {
    log_info "Verificando despliegue..."
    
    # Verificar pods
    kubectl get pods -n $NAMESPACE
    
    # Verificar servicios
    kubectl get services -n $NAMESPACE
    
    # Verificar HPA
    kubectl get hpa -n $NAMESPACE
    
    # Verificar ingress
    kubectl get ingress -n $NAMESPACE
    
    log_success "Despliegue verificado"
}

# Mostrar información de acceso
show_access_info() {
    log_info "Información de acceso:"
    
    echo ""
    echo "🌐 n8n Dashboard: https://n8n.agora-pro.com"
    echo "🔗 Webhook URL: https://webhook.agora-pro.com/webhook/"
    echo "📊 Monitoring: https://console.cloud.google.com/monitoring"
    echo "🗄️  Redis: $(gcloud redis instances describe agora-redis --region=us-central1 --format='value(host)')"
    echo ""
    
    log_success "Despliegue completado exitosamente!"
}

# Función principal
main() {
    echo "🚀 ========================================="
    echo "   AGORA PRO - DESPLIEGUE EN GCP"
    echo "   ========================================="
    echo ""
    
    check_dependencies
    setup_project
    create_cluster
    create_namespace
    create_secrets
    deploy_n8n
    setup_ingress
    create_redis
    setup_pubsub
    setup_monitoring
    verify_deployment
    show_access_info
    
    echo ""
    echo "🎉 ¡Agora Pro ha sido desplegado exitosamente en GCP!"
    echo "📚 Consulta la documentación en: ARQUITECTURA_AGORA_PRO_GCP.md"
}

# Ejecutar función principal
main "$@" 