#!/bin/bash

# Script para provisionar y configurar una VM en Google Compute Engine
# para desplegar la arquitectura "Agora" con Docker Compose.

# --- Configuración de Variables ---
# ¡IMPORTANTE! Personaliza estas variables según tus necesidades.

PROJECT_ID="tu-proyecto-de-gcp"  # Reemplaza con tu ID de Proyecto de GCP
INSTANCE_NAME="agora-vm-main"    # Nombre para tu máquina virtual
REGION="us-central1"             # Región de GCP donde se creará la VM
ZONE="us-central1-a"             # Zona específica dentro de la región
MACHINE_TYPE="e2-medium"         # Tipo de máquina. e2-medium es un buen punto de partida.
IMAGE_FAMILY="ubuntu-2204-lts"   # Imagen del sistema operativo
IMAGE_PROJECT="ubuntu-os-cloud"  # Proyecto de la imagen
NETWORK_TAG="agora-web-server"   # Etiqueta de red para las reglas de firewall
FIREWALL_RULE_NAME="allow-http-https-agora" # Nombre para la regla de firewall

# --- Fin de la Configuración ---

echo "🚀 Iniciando el despliegue de la VM para Agora en GCP..."

# Paso 1: Configurar el proyecto gcloud por defecto
echo "1/4: Configurando gcloud para usar el proyecto: $PROJECT_ID"
gcloud config set project $PROJECT_ID
echo "✅ Proyecto configurado."

# Paso 2: Crear regla de firewall para permitir tráfico web (HTTP y HTTPS)
echo "2/4: Creando regla de firewall '$FIREWALL_RULE_NAME'..."
# Comprueba si la regla ya existe para evitar errores.
if ! gcloud compute firewall-rules describe $FIREWALL_RULE_NAME &>/dev/null; then
    gcloud compute firewall-rules create $FIREWALL_RULE_NAME \
        --description="Permite tráfico HTTP y HTTPS entrante para los servidores web de Agora" \
        --direction=INGRESS \
        --priority=1000 \
        --network=default \
        --action=ALLOW \
        --rules=tcp:80,tcp:443 \
        --source-ranges=0.0.0.0/0 \
        --target-tags=$NETWORK_TAG
    echo "✅ Regla de firewall creada."
else
    echo "👍 La regla de firewall '$FIREWALL_RULE_NAME' ya existe. Omitiendo creación."
fi

# Paso 3: Crear la instancia de Google Compute Engine con un script de inicio
echo "3/4: Creando la instancia de VM '$INSTANCE_NAME'. Esto puede tardar unos minutos..."
echo "      La VM se configurará automáticamente con Docker y Docker Compose."

gcloud compute instances create $INSTANCE_NAME \
    --zone=$ZONE \
    --machine-type=$MACHINE_TYPE \
    --image-family=$IMAGE_FAMILY \
    --image-project=$IMAGE_PROJECT \
    --tags=$NETWORK_TAG \
    --metadata startup-script='#! /bin/bash
      # Actualizar paquetes
      apt-get update -y
      # Instalar dependencias
      apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

      # Añadir la clave GPG oficial de Docker
      mkdir -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

      # Configurar el repositorio de Docker
      echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

      # Instalar Docker Engine y Docker Compose
      apt-get update -y
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

      # Añadir el usuario ubuntu al grupo docker para ejecutar comandos sin sudo (opcional, pero útil)
      usermod -aG docker ubuntu

      echo "✅ Instalación de Docker y Docker Compose completada."
    '
echo "✅ Instancia '$INSTANCE_NAME' creada."


# Paso 4: Mostrar los próximos pasos
VM_IP=$(gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "🎉 ¡Despliegue de infraestructura completado!"
echo ""
echo "------------------------------------------------------------------"
echo "Próximos Pasos:"
echo ""
echo "1. Conéctate a tu nueva VM por SSH:"
echo "   gcloud compute ssh --zone \"$ZONE\" \"$INSTANCE_NAME\" --project \"$PROJECT_ID\""
echo ""
echo "2. Clona tu repositorio en la VM:"
echo "   git clone https://github.com/tu-usuario/tu-repositorio.git"
echo "   cd tu-repositorio"
echo ""
echo "3. Configura tus variables de entorno:"
echo "   cp .env.example .env"
echo "   nano .env  # (y edita DOMAIN_NAME con la IP de tu VM: $VM_IP, o tu dominio real)"
echo ""
echo "4. (Opcional pero recomendado) Genera un certificado SSL con Let's Encrypt."
echo ""
echo "5. ¡Lanza la aplicación!"
echo "   sudo docker compose up -d"
echo ""
echo "Tu servidor es accesible en la IP: $VM_IP"
echo "------------------------------------------------------------------" 