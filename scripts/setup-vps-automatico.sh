#!/bin/bash

# Script de configuración automática de VPS Hostinger para Agora
# Autor: Daniel Lopez - Sistema Electoral 2025
# Fecha: $(date)

set -e  # Salir en caso de error

echo "🚀 INICIANDO CONFIGURACIÓN AUTOMÁTICA DE VPS PARA AGORA"
echo "========================================================"

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

# Variables de configuración
N8N_PORT=5678
REDIS_PORT=6379
DOMAIN=""
IP_ADDRESS=$(hostname -I | awk '{print $1}')

# Función para obtener configuración del usuario
get_configuration() {
    log_info "Configuración inicial del sistema Agora"
    echo ""
    
    read -p "¿Tienes un dominio configurado? (y/n): " has_domain
    if [[ $has_domain == "y" || $has_domain == "Y" ]]; then
        read -p "Ingresa tu dominio (ej: n8n.tudominio.com): " DOMAIN
    else
        log_warning "Usando IP del servidor: $IP_ADDRESS"
        DOMAIN=$IP_ADDRESS
    fi
    
    echo ""
    log_info "Resumen de configuración:"
    echo "  - n8n URL: http://$DOMAIN:$N8N_PORT"
    echo "  - Redis: localhost:$REDIS_PORT"
    echo "  - Usuario n8n: admin"
    echo "  - Contraseña n8n: agora2024!"
    echo ""
    
    read -p "¿Continuar con esta configuración? (y/n): " confirm
    if [[ $confirm != "y" && $confirm != "Y" ]]; then
        log_error "Configuración cancelada por el usuario"
        exit 1
    fi
}

# Función para verificar requisitos del sistema
check_system_requirements() {
    log_info "Verificando requisitos del sistema..."
    
    # Verificar sistema operativo
    if [[ "$OSTYPE" != "linux-gnu"* ]]; then
        log_error "Este script está diseñado para Linux"
        exit 1
    fi
    
    # Verificar si es Ubuntu/Debian
    if ! command -v apt-get &> /dev/null; then
        log_warning "Sistema no basado en Debian/Ubuntu detectado"
        log_warning "Algunas funciones pueden no funcionar correctamente"
    fi
    
    # Verificar espacio en disco
    DISK_SPACE=$(df / | awk 'NR==2 {print $4}')
    if [ $DISK_SPACE -lt 5242880 ]; then  # 5GB en KB
        log_error "Espacio insuficiente en disco. Se requieren al menos 5GB libres"
        exit 1
    fi
    
    # Verificar memoria RAM
    RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    RAM_GB=$((RAM_KB / 1024 / 1024))
    if [ $RAM_GB -lt 1 ]; then
        log_warning "Memoria RAM baja detectada: ${RAM_GB}GB"
        log_warning "Se recomienda al menos 2GB para mejor rendimiento"
    fi
    
    log_success "Requisitos del sistema verificados"
}

# Función para instalar Docker
install_docker() {
    log_info "Instalando Docker..."
    
    if command -v docker &> /dev/null; then
        log_success "Docker ya está instalado"
        return
    fi
    
    # Actualizar repositorios
    sudo apt-get update
    
    # Instalar dependencias
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Agregar GPG key oficial de Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Configurar repositorio estable
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Instalar Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Agregar usuario actual al grupo docker
    sudo usermod -aG docker $USER
    
    # Habilitar Docker para iniciar con el sistema
    sudo systemctl enable docker
    sudo systemctl start docker
    
    log_success "Docker instalado correctamente"
}

# Función para instalar Docker Compose
install_docker_compose() {
    log_info "Instalando Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        log_success "Docker Compose ya está instalado"
        return
    fi
    
    # Descargar Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Dar permisos de ejecución
    sudo chmod +x /usr/local/bin/docker-compose
    
    log_success "Docker Compose instalado correctamente"
}

# Función para crear directorio del proyecto
create_project_directory() {
    log_info "Creando directorio del proyecto..."
    
    PROJECT_DIR="$HOME/agora-n8n"
    
    if [ -d "$PROJECT_DIR" ]; then
        log_warning "El directorio $PROJECT_DIR ya existe"
        read -p "¿Deseas sobrescribir? (y/n): " overwrite
        if [[ $overwrite == "y" || $overwrite == "Y" ]]; then
            rm -rf "$PROJECT_DIR"
        else
            log_error "Configuración cancelada"
            exit 1
        fi
    fi
    
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    log_success "Directorio del proyecto creado: $PROJECT_DIR"
}

# Función para crear docker-compose.yml
create_docker_compose() {
    log_info "Creando archivo docker-compose.yml..."
    
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: agora-n8n
    restart: unless-stopped
    ports:
      - "${N8N_PORT}:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_USER_MANAGEMENT_DISABLED=false
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=agora2024!
      - N8N_ENCRYPTION_KEY=agora-encryption-key-2024
      - N8N_REDIS_HOST=redis
      - N8N_REDIS_PORT=${REDIS_PORT}
      - N8N_REDIS_DB=0
      - N8N_REDIS_PASSWORD=agora-redis-2024
      - N8N_LOG_LEVEL=info
      - N8N_EDITOR_BASE_URL=http://${DOMAIN}:${N8N_PORT}
      - WEBHOOK_URL=http://${DOMAIN}:${N8N_PORT}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - redis
    networks:
      - agora-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: agora-redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT}:6379"
    command: redis-server --requirepass agora-redis-2024 --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - agora-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "agora-redis-2024", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  n8n_data:
    driver: local
  redis_data:
    driver: local

networks:
  agora-network:
    driver: bridge
EOF

    log_success "Archivo docker-compose.yml creado"
}

# Función para crear script de monitoreo
create_monitoring_script() {
    log_info "Creando script de monitoreo..."
    
    cat > monitor.sh << 'EOF'
#!/bin/bash

# Script de monitoreo para Agora
# Uso: ./monitor.sh

echo "📊 MONITOREO DE SERVICIOS AGORA"
echo "================================"
echo "Fecha: $(date)"
echo ""

# Verificar n8n
echo "🔍 Verificando n8n..."
if curl -s http://localhost:5678 > /dev/null 2>&1; then
    echo "✅ n8n está funcionando"
    N8N_STATUS="ACTIVO"
else
    echo "❌ n8n no está respondiendo"
    N8N_STATUS="INACTIVO"
fi

# Verificar Redis
echo "🔍 Verificando Redis..."
if docker exec agora-redis redis-cli -a agora-redis-2024 ping > /dev/null 2>&1; then
    echo "✅ Redis está funcionando"
    REDIS_STATUS="ACTIVO"
else
    echo "❌ Redis no está respondiendo"
    REDIS_STATUS="INACTIVO"
fi

# Verificar contenedores
echo ""
echo "🐳 Estado de contenedores:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep agora

# Verificar uso de recursos
echo ""
echo "💾 Uso de recursos:"
echo "  Memoria: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2 }')"
echo "  Disco: $(df -h / | awk 'NR==2{print $5}')"

# Verificar logs recientes
echo ""
echo "📋 Logs recientes de n8n:"
docker logs --tail 5 agora-n8n 2>/dev/null || echo "No se pueden obtener logs"

echo ""
echo "📋 Logs recientes de Redis:"
docker logs --tail 3 agora-redis 2>/dev/null || echo "No se pueden obtener logs"

echo ""
echo "🌐 URLs de acceso:"
echo "  n8n: http://localhost:5678"
echo "  Usuario: admin"
echo "  Contraseña: agora2024!"
EOF

    chmod +x monitor.sh
    log_success "Script de monitoreo creado"
}

# Función para crear script de backup
create_backup_script() {
    log_info "Creando script de backup..."
    
    cat > backup.sh << 'EOF'
#!/bin/bash

# Script de backup para Agora
# Uso: ./backup.sh

BACKUP_DIR="$HOME/agora-backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 INICIANDO BACKUP DE AGORA"
echo "============================"
echo "Fecha: $DATE"
echo ""

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

# Backup de volúmenes Docker
echo "🔍 Creando backup de volúmenes..."
docker run --rm -v agora-n8n_n8n_data:/data -v "$BACKUP_DIR:/backup" alpine tar czf /backup/n8n_data_$DATE.tar.gz -C /data .
docker run --rm -v agora-n8n_redis_data:/data -v "$BACKUP_DIR:/backup" alpine tar czf /backup/redis_data_$DATE.tar.gz -C /data .

# Backup de configuración
echo "🔍 Creando backup de configuración..."
cp docker-compose.yml "$BACKUP_DIR/docker-compose_$DATE.yml"

echo ""
echo "✅ Backup completado:"
echo "  Ubicación: $BACKUP_DIR"
echo "  Archivos:"
ls -la "$BACKUP_DIR"/*$DATE*

echo ""
echo "🧹 Limpiando backups antiguos (más de 7 días)..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.yml" -mtime +7 -delete

echo "✅ Limpieza completada"
EOF

    chmod +x backup.sh
    log_success "Script de backup creado"
}

# Función para crear script de actualización
create_update_script() {
    log_info "Creando script de actualización..."
    
    cat > update.sh << 'EOF'
#!/bin/bash

# Script de actualización para Agora
# Uso: ./update.sh

echo "🔄 ACTUALIZANDO AGORA"
echo "====================="
echo "Fecha: $(date)"
echo ""

# Crear backup antes de actualizar
echo "💾 Creando backup de seguridad..."
./backup.sh

# Detener servicios
echo "🛑 Deteniendo servicios..."
docker-compose down

# Actualizar imágenes
echo "⬇️ Descargando nuevas imágenes..."
docker-compose pull

# Iniciar servicios
echo "🚀 Iniciando servicios actualizados..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado
echo "🔍 Verificando estado de servicios..."
./monitor.sh

echo ""
echo "✅ Actualización completada"
EOF

    chmod +x update.sh
    log_success "Script de actualización creado"
}

# Función para iniciar servicios
start_services() {
    log_info "Iniciando servicios..."
    
    # Iniciar servicios en segundo plano
    docker-compose up -d
    
    # Esperar a que los servicios estén listos
    log_info "Esperando a que los servicios estén listos..."
    sleep 30
    
    # Verificar estado
    log_info "Verificando estado de servicios..."
    ./monitor.sh
}

# Función para configurar firewall
configure_firewall() {
    log_info "Configurando firewall..."
    
    # Verificar si ufw está instalado
    if command -v ufw &> /dev/null; then
        # Habilitar ufw
        sudo ufw --force enable
        
        # Permitir SSH
        sudo ufw allow ssh
        
        # Permitir puertos de Agora
        sudo ufw allow $N8N_PORT
        sudo ufw allow $REDIS_PORT
        
        log_success "Firewall configurado"
    else
        log_warning "ufw no está instalado. Configurando manualmente..."
        
        # Instalar ufw
        sudo apt-get update
        sudo apt-get install -y ufw
        
        # Configurar firewall
        sudo ufw --force enable
        sudo ufw allow ssh
        sudo ufw allow $N8N_PORT
        sudo ufw allow $REDIS_PORT
        
        log_success "Firewall instalado y configurado"
    fi
}

# Función para mostrar información final
show_final_info() {
    echo ""
    echo "🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE"
    echo "========================================"
    echo ""
    echo "📋 INFORMACIÓN IMPORTANTE:"
    echo "  🌐 n8n URL: http://$DOMAIN:$N8N_PORT"
    echo "  👤 Usuario: admin"
    echo "  🔑 Contraseña: agora2024!"
    echo "  🔧 Redis: localhost:$REDIS_PORT"
    echo "  📁 Directorio: $HOME/agora-n8n"
    echo ""
    echo "📋 COMANDOS ÚTILES:"
    echo "  🔍 Monitoreo: ./monitor.sh"
    echo "  💾 Backup: ./backup.sh"
    echo "  🔄 Actualizar: ./update.sh"
    echo "  🛑 Detener: docker-compose down"
    echo "  🚀 Iniciar: docker-compose up -d"
    echo ""
    echo "📋 VARIABLES PARA NETLIFY:"
    echo "  VITE_PRODUCTION_MODE=true"
    echo "  VITE_N8N_API_URL=http://$DOMAIN:$N8N_PORT"
    echo "  VITE_N8N_API_KEY=agora-api-key-2024"
    echo ""
    echo "🔐 SEGURIDAD:"
    echo "  ⚠️ Cambia las contraseñas por defecto"
    echo "  ⚠️ Configura SSL/HTTPS para producción"
    echo "  ⚠️ Configura backups automáticos"
    echo ""
    echo "📞 SOPORTE:"
    echo "  Si tienes problemas, ejecuta: ./monitor.sh"
    echo "  Para logs detallados: docker logs agora-n8n"
    echo ""
}

# Función principal
main() {
    echo "🚀 CONFIGURACIÓN AUTOMÁTICA DE VPS PARA AGORA"
    echo "=============================================="
    echo "Este script configurará automáticamente:"
    echo "  - Docker y Docker Compose"
    echo "  - n8n (orquestador de workflows)"
    echo "  - Redis (base de datos en memoria)"
    echo "  - Scripts de monitoreo y backup"
    echo "  - Configuración de firewall"
    echo ""
    
    # Obtener configuración del usuario
    get_configuration
    
    # Verificar requisitos
    check_system_requirements
    
    # Instalar dependencias
    install_docker
    install_docker_compose
    
    # Crear estructura del proyecto
    create_project_directory
    create_docker_compose
    create_monitoring_script
    create_backup_script
    create_update_script
    
    # Configurar firewall
    configure_firewall
    
    # Iniciar servicios
    start_services
    
    # Mostrar información final
    show_final_info
    
    log_success "¡Configuración completada! Tu VPS está listo para Agora."
}

# Ejecutar función principal
main "$@" 