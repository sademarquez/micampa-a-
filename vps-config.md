# 🖥️ CONFIGURACIÓN VPS - SISTEMA ELECTORAL 2025

## 📋 ESPECIFICACIONES RECOMENDADAS

### **Requisitos Mínimos**
- **CPU**: 2 vCPUs
- **RAM**: 4GB
- **Almacenamiento**: 80GB SSD
- **Red**: 1Gbps
- **Sistema Operativo**: Ubuntu 22.04 LTS

### **Requisitos Recomendados**
- **CPU**: 4 vCPUs
- **RAM**: 8GB
- **Almacenamiento**: 160GB SSD
- **Red**: 1Gbps
- **Sistema Operativo**: Ubuntu 22.04 LTS

---

## 🚀 CONFIGURACIÓN INICIAL DEL VPS

### **1. Conectar al VPS**
```bash
ssh root@tu-ip-del-vps
```

### **2. Actualizar el sistema**
```bash
apt update && apt upgrade -y
```

### **3. Instalar dependencias básicas**
```bash
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw fail2ban
```

### **4. Configurar firewall**
```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 80
ufw allow 443
ufw enable
```

---

## 🐳 CONFIGURACIÓN CON DOCKER

### **1. Instalar Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER
```

### **2. Instalar Docker Compose**
```bash
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### **3. Crear docker-compose.yml**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./dist:/usr/share/nginx/html
    depends_on:
      - app
    restart: unless-stopped

  app:
    build: .
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    volumes:
      - ./dist:/app/dist
    restart: unless-stopped

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - WEBHOOK_URL=https://n8n.tudominio.com
      - GENERIC_TIMEZONE=America/Bogota
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:
```

### **4. Crear Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

---

## 🌐 CONFIGURACIÓN DE NGINX

### **1. Configuración principal (nginx.conf)**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    upstream app {
        server app:3000;
    }

    upstream n8n {
        server n8n:5678;
    }

    server {
        listen 80;
        server_name tudominio.com www.tudominio.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name tudominio.com www.tudominio.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Root directory
        root /usr/share/nginx/html;
        index index.html;

        # Main application
        location / {
            try_files $uri $uri/ /index.html;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # API proxy
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # n8n webhooks
        location /webhook/ {
            limit_req zone=api burst=50 nodelay;
            proxy_pass http://n8n;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # n8n interface (protected)
        location /n8n/ {
            auth_basic "n8n Access";
            auth_basic_user_file /etc/nginx/.htpasswd;
            
            proxy_pass http://n8n;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Security for login
        location /login {
            limit_req zone=login burst=5 nodelay;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

---

## 🔐 CONFIGURACIÓN SSL

### **1. Obtener certificado SSL con Let's Encrypt**
```bash
certbot --nginx -d tudominio.com -d www.tudominio.com
```

### **2. Configurar renovación automática**
```bash
crontab -e
# Agregar esta línea:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 MONITOREO Y LOGS

### **1. Configurar logrotate**
```bash
cat > /etc/logrotate.d/nginx << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx nginx
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
EOF
```

### **2. Configurar monitoreo básico**
```bash
# Instalar htop para monitoreo
apt install -y htop

# Configurar alertas de disco
apt install -y smartmontools
```

---

## 🔄 DESPLIEGUE AUTOMÁTICO

### **1. Script de despliegue (deploy.sh)**
```bash
#!/bin/bash

echo "🚀 Iniciando despliegue..."

# Pull latest changes
git pull origin main

# Build application
npm run build

# Restart Docker containers
docker-compose down
docker-compose up -d --build

# Clear nginx cache
docker exec nginx nginx -s reload

echo "✅ Despliegue completado!"
```

### **2. Configurar webhook de GitHub**
```bash
# Crear webhook en GitHub que ejecute deploy.sh
# URL: https://tudominio.com/webhook/deploy
# Secret: tu-secret-key
```

---

## 🛡️ SEGURIDAD ADICIONAL

### **1. Configurar Fail2ban**
```bash
cat > /etc/fail2ban/jail.local << EOF
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
EOF

systemctl restart fail2ban
```

### **2. Configurar respaldo automático**
```bash
cat > /root/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de la aplicación
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /app

# Backup de n8n
docker run --rm -v n8n_data:/data -v $BACKUP_DIR:/backup alpine tar -czf /backup/n8n_$DATE.tar.gz -C /data .

# Limpiar backups antiguos (mantener últimos 7 días)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completado: $DATE"
EOF

chmod +x /root/backup.sh

# Agregar a crontab
echo "0 2 * * * /root/backup.sh" | crontab -
```

---

## 📱 CONFIGURACIÓN DE DOMINIO

### **1. DNS Records**
```
A     @           tu-ip-del-vps
A     www         tu-ip-del-vps
CNAME n8n         tudominio.com
```

### **2. Variables de entorno (.env)**
```bash
SUPABASE_URL=https://zecltlsdkbndhqimpjjo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
N8N_PASSWORD=tu-password-seguro
N8N_WEBHOOK_URL=https://tudominio.com/webhook
```

---

## 🚀 COMANDOS ÚTILES

### **Gestión del sistema**
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Ver uso de recursos
htop

# Verificar SSL
certbot certificates

# Backup manual
/root/backup.sh
```

### **Monitoreo**
```bash
# Verificar estado de servicios
systemctl status nginx
systemctl status fail2ban
docker ps

# Ver logs de nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 📞 SOPORTE

- **Documentación**: Este archivo
- **Logs**: `/var/log/nginx/`
- **Configuración**: `/etc/nginx/`
- **Backups**: `/backups/`
- **Docker**: `docker-compose.yml`

---

*Configuración VPS generada para Sistema Electoral 2025*
*Fecha: ${new Date().toLocaleDateString('es-ES')}* 