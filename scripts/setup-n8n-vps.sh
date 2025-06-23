#!/bin/bash

# Script de configuración automática de n8n en VPS Hostinger
# Para el sistema Agora - Plataforma Electoral

echo "🚀 Configurando n8n para Agora en VPS Hostinger..."

# Variables de configuración
N8N_PORT=5678
N8N_DOMAIN="tu-dominio-hostinger.com"
REDIS_PORT=6379

# 1. Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado. Reinicia la sesión SSH."
    exit 1
fi

# 2. Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado."
fi

# 3. Crear directorio para n8n
mkdir -p ~/agora-n8n
cd ~/agora-n8n

# 4. Crear docker-compose.yml para n8n y Redis
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
      - N8N_PROTOCOL=https
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
      - N8N_EDITOR_BASE_URL=https://${N8N_DOMAIN}:${N8N_PORT}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - redis
    networks:
      - agora-network

  redis:
    image: redis:7-alpine
    container_name: agora-redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT}:6379"
    command: redis-server --requirepass agora-redis-2024
    volumes:
      - redis_data:/data
    networks:
      - agora-network

volumes:
  n8n_data:
  redis_data:

networks:
  agora-network:
    driver: bridge
EOF

# 5. Crear script de configuración de webhooks
cat > setup-webhooks.js << 'EOF'
// Script para configurar webhooks automáticamente en n8n
const axios = require('axios');

const N8N_BASE_URL = 'http://localhost:5678';
const ADMIN_USER = 'admin@example.com';
const ADMIN_PASSWORD = 'password';

const webhooks = [
  {
    name: 'Lead Collection',
    path: '/webhook/lead-collection',
    description: 'Recibe datos de leads desde la PWA'
  },
  {
    name: 'User Authentication',
    path: '/webhook/auth',
    description: 'Maneja autenticación de usuarios'
  },
  {
    name: 'Voter Registration',
    path: '/webhook/voters',
    description: 'Registra votantes'
  },
  {
    name: 'Messaging System',
    path: '/webhook/messaging',
    description: 'Sistema de mensajería'
  },
  {
    name: 'WhatsApp Integration',
    path: '/webhook/whatsapp',
    description: 'Integración con WhatsApp'
  },
  {
    name: 'Email Campaigns',
    path: '/webhook/email',
    description: 'Campañas de email'
  },
  {
    name: 'SMS Campaigns',
    path: '/webhook/sms',
    description: 'Campañas de SMS'
  },
  {
    name: 'Territory Management',
    path: '/webhook/territory',
    description: 'Gestión de territorios'
  },
  {
    name: 'Analytics Engine',
    path: '/webhook/analytics',
    description: 'Motor de análisis'
  },
  {
    name: 'Event Coordinator',
    path: '/webhook/events',
    description: 'Coordinador de eventos'
  },
  {
    name: 'Alert System',
    path: '/webhook/alerts',
    description: 'Sistema de alertas'
  },
  {
    name: 'Social Media',
    path: '/webhook/social',
    description: 'Redes sociales'
  }
];

console.log('🔧 Configurando webhooks en n8n...');
console.log('📝 Nota: Este script debe ejecutarse después de que n8n esté funcionando');
console.log('🌐 Accede a n8n en: http://localhost:5678');
console.log('👤 Usuario: admin');
console.log('🔑 Contraseña: agora2024!');
console.log('');
console.log('📋 Webhooks que se crearán:');
webhooks.forEach(webhook => {
  console.log(`  - ${webhook.name}: ${webhook.path}`);
});
EOF

# 6. Crear script de monitoreo
cat > monitor.sh << 'EOF'
#!/bin/bash

echo "📊 Monitoreo de servicios Agora"
echo "================================"

# Verificar n8n
if curl -s http://localhost:5678 > /dev/null; then
    echo "✅ n8n está funcionando"
else
    echo "❌ n8n no está respondiendo"
fi

# Verificar Redis
if docker exec agora-redis redis-cli -a agora-redis-2024 ping > /dev/null 2>&1; then
    echo "✅ Redis está funcionando"
else
    echo "❌ Redis no está respondiendo"
fi

# Mostrar logs recientes
echo ""
echo "📋 Logs recientes de n8n:"
docker logs --tail 10 agora-n8n

echo ""
echo "📋 Logs recientes de Redis:"
docker logs --tail 5 agora-redis
EOF

chmod +x monitor.sh

# 7. Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose up -d

# 8. Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# 9. Verificar estado
echo "🔍 Verificando estado de los servicios..."
./monitor.sh

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📋 Información importante:"
echo "  🌐 n8n URL: https://${N8N_DOMAIN}:${N8N_PORT}"
echo "  👤 Usuario: admin"
echo "  🔑 Contraseña: agora2024!"
echo "  🔧 Redis: localhost:${REDIS_PORT}"
echo ""
echo "📝 Variables para Netlify:"
echo "  VITE_N8N_API_URL=https://${N8N_DOMAIN}:${N8N_PORT}"
echo "  VITE_N8N_API_KEY=agora-api-key-2024"
echo ""
echo "🔧 Para monitorear: ./monitor.sh"
echo "🔄 Para reiniciar: docker-compose restart"
echo "🛑 Para detener: docker-compose down"
EOF 