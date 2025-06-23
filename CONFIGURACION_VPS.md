# Configuración Automática de VPS Hostinger para Agora

## 🚀 Configuración Rápida

### 1. Conectar a tu VPS via SSH
```bash
ssh usuario@tu-ip-hostinger
```

### 2. Ejecutar el script de configuración automática
```bash
# Crear directorio del proyecto
mkdir -p ~/agora-n8n && cd ~/agora-n8n

# Descargar el script de configuración
wget https://raw.githubusercontent.com/tu-usuario/agora/main/scripts/setup-n8n-vps.sh
chmod +x setup-n8n-vps.sh
./setup-n8n-vps.sh
```

## 📋 Variables de Entorno para Netlify

Configura estas variables en tu dashboard de Netlify:

```
VITE_PRODUCTION_MODE=true
VITE_N8N_API_URL=https://tu-dominio-hostinger.com:5678
VITE_N8N_API_KEY=agora-api-key-2024
```

## 🔧 Configuración Manual (si el script falla)

### 1. Instalar Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Instalar Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Crear docker-compose.yml
```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: agora-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
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
      - N8N_REDIS_PORT=6379
      - N8N_REDIS_DB=0
      - N8N_REDIS_PASSWORD=agora-redis-2024
      - N8N_LOG_LEVEL=info
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
      - "6379:6379"
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
```

### 4. Iniciar servicios
```bash
docker-compose up -d
```

## 🌐 Configurar Dominio (Opcional)

Si tienes un dominio en Hostinger:

1. Ve al panel de control de Hostinger
2. Configura un subdominio (ej: `n8n.tudominio.com`)
3. Apunta al puerto 5678 de tu VPS
4. Actualiza la variable `VITE_N8N_API_URL` en Netlify

## 🔍 Verificar Funcionamiento

### 1. Verificar n8n
```bash
curl http://localhost:5678
```

### 2. Verificar Redis
```bash
docker exec agora-redis redis-cli -a agora-redis-2024 ping
```

### 3. Acceder a n8n
- URL: `http://tu-ip:5678`
- Usuario: `admin`
- Contraseña: `agora2024!`

## 📊 Monitoreo

Crear script de monitoreo:
```bash
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "📊 Estado de servicios Agora"
echo "============================"
echo "n8n: $(curl -s http://localhost:5678 > /dev/null && echo '✅' || echo '❌')"
echo "Redis: $(docker exec agora-redis redis-cli -a agora-redis-2024 ping > /dev/null 2>&1 && echo '✅' || echo '❌')"
EOF
chmod +x monitor.sh
```

## 🔄 Comandos Útiles

```bash
# Ver logs de n8n
docker logs agora-n8n

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Ver estado
docker-compose ps

# Actualizar n8n
docker-compose pull
docker-compose up -d
```

## 🚨 Solución de Problemas

### Puerto 5678 bloqueado
```bash
# Verificar si el puerto está en uso
sudo netstat -tlnp | grep 5678

# Si está bloqueado, cambiar puerto en docker-compose.yml
ports:
  - "5679:5678"  # Cambiar 5678 por 5679
```

### Problemas de memoria
```bash
# Verificar uso de memoria
free -h

# Si es necesario, limitar memoria de Redis
redis:
  deploy:
    resources:
      limits:
        memory: 512M
```

### Problemas de red
```bash
# Verificar conectividad
ping google.com

# Verificar puertos abiertos
sudo ufw status
```

## 📝 Notas Importantes

1. **Seguridad**: Cambia las contraseñas por defecto
2. **Backup**: Configura backups automáticos de los volúmenes
3. **Monitoreo**: Configura alertas de estado de servicios
4. **SSL**: Configura certificado SSL para HTTPS
5. **Firewall**: Abre solo los puertos necesarios (5678, 6379)

## 🔗 Enlaces Útiles

- [Documentación de n8n](https://docs.n8n.io/)
- [Documentación de Redis](https://redis.io/documentation)
- [Docker Compose](https://docs.docker.com/compose/)
- [Hostinger VPS](https://www.hostinger.com/vps-hosting) 