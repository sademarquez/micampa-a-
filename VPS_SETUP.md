# Configuración VPS Hostinger para Agora

## Pasos Rápidos

1. **Conectar a VPS:**
```bash
ssh usuario@tu-ip-hostinger
```

2. **Instalar Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Crear proyecto:**
```bash
mkdir agora-n8n && cd agora-n8n
```

4. **Crear docker-compose.yml:**
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=agora2024!
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass agora-redis-2024
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  n8n_data:
  redis_data:
```

5. **Iniciar servicios:**
```bash
docker-compose up -d
```

6. **Verificar:**
- n8n: http://tu-ip:5678
- Usuario: admin
- Contraseña: agora2024!

## Variables para Netlify

```
VITE_PRODUCTION_MODE=true
VITE_N8N_API_URL=http://tu-ip:5678
VITE_N8N_API_KEY=agora-api-key-2024
``` 