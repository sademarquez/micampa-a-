#!/usr/bin/env node

/**
 * Script de Health Check para el Sistema Agora
 * Verifica el estado de todos los servicios y componentes
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

// Configuración de servicios a verificar
const services = [
  {
    name: 'Frontend (PWA)',
    url: 'https://your-netlify-app.netlify.app',
    type: 'https',
    timeout: 5000
  },
  {
    name: 'Backend (n8n)',
    url: 'https://agora-backend-894766450086.us-central1.run.app',
    type: 'https',
    timeout: 5000
  },
  {
    name: 'Supabase Database',
    url: 'https://zecltlsdkbndhqimpjjo.supabase.co',
    type: 'https',
    timeout: 5000
  },
  {
    name: 'Google Gemini API',
    url: 'https://generativelanguage.googleapis.com',
    type: 'https',
    timeout: 5000
  },
  {
    name: 'Netlify CDN',
    url: 'https://netlify.com',
    type: 'https',
    timeout: 5000
  }
];

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Función para hacer petición HTTP/HTTPS
function makeRequest(service) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(service.url);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (service.type === 'https' ? 443 : 80),
      path: url.pathname || '/',
      method: 'HEAD',
      timeout: service.timeout
    };

    const client = service.type === 'https' ? https : http;
    
    const req = client.request(options, (res) => {
      const responseTime = Date.now() - startTime;
      const status = res.statusCode;
      
      if (status >= 200 && status < 400) {
        resolve({
          service: service.name,
          status: 'healthy',
          responseTime,
          details: `HTTP ${status}`,
          url: service.url
        });
      } else {
        resolve({
          service: service.name,
          status: 'warning',
          responseTime,
          details: `HTTP ${status}`,
          url: service.url
        });
      }
    });

    req.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      resolve({
        service: service.name,
        status: 'error',
        responseTime,
        details: error.message,
        url: service.url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        service: service.name,
        status: 'error',
        responseTime: service.timeout,
        details: 'Timeout',
        url: service.url
      });
    });

    req.end();
  });
}

// Función para mostrar el resultado
function displayResult(result) {
  const statusIcon = result.status === 'healthy' ? '✅' : 
                    result.status === 'warning' ? '⚠️' : '❌';
  
  const statusColor = result.status === 'healthy' ? colors.green :
                     result.status === 'warning' ? colors.yellow : colors.red;
  
  console.log(`${statusIcon} ${statusColor}${result.service}${colors.reset}`);
  console.log(`   URL: ${result.url}`);
  console.log(`   Tiempo: ${result.responseTime}ms`);
  console.log(`   Estado: ${statusColor}${result.status.toUpperCase()}${colors.reset}`);
  console.log(`   Detalles: ${result.details}`);
  console.log('');
}

// Función principal
async function runHealthCheck() {
  console.log(`${colors.bright}${colors.blue}🔍 HEALTH CHECK DEL SISTEMA AGORA${colors.reset}\n`);
  console.log(`${colors.cyan}Iniciando verificación de servicios...${colors.reset}\n`);
  
  const startTime = Date.now();
  const results = [];
  
  // Ejecutar todas las verificaciones en paralelo
  const promises = services.map(service => makeRequest(service));
  const serviceResults = await Promise.all(promises);
  
  // Mostrar resultados
  serviceResults.forEach(displayResult);
  
  // Calcular estadísticas
  const totalTime = Date.now() - startTime;
  const healthyCount = serviceResults.filter(r => r.status === 'healthy').length;
  const warningCount = serviceResults.filter(r => r.status === 'warning').length;
  const errorCount = serviceResults.filter(r => r.status === 'error').length;
  
  // Mostrar resumen
  console.log(`${colors.bright}${colors.blue}📊 RESUMEN${colors.reset}`);
  console.log(`${colors.green}✅ Servicios sanos: ${healthyCount}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Advertencias: ${warningCount}${colors.reset}`);
  console.log(`${colors.red}❌ Errores: ${errorCount}${colors.reset}`);
  console.log(`${colors.cyan}⏱️  Tiempo total: ${totalTime}ms${colors.reset}\n`);
  
  // Estado general
  let overallStatus = 'healthy';
  let overallColor = colors.green;
  
  if (errorCount > 0) {
    overallStatus = 'error';
    overallColor = colors.red;
  } else if (warningCount > 0) {
    overallStatus = 'warning';
    overallColor = colors.yellow;
  }
  
  console.log(`${colors.bright}${overallColor}🎯 ESTADO GENERAL: ${overallStatus.toUpperCase()}${colors.reset}\n`);
  
  // Recomendaciones
  if (errorCount > 0) {
    console.log(`${colors.red}🚨 RECOMENDACIONES:${colors.reset}`);
    console.log(`   - Revisa la configuración de los servicios con errores`);
    console.log(`   - Verifica las conexiones de red`);
    console.log(`   - Comprueba las credenciales y claves de API`);
    console.log('');
  } else if (warningCount > 0) {
    console.log(`${colors.yellow}⚠️  RECOMENDACIONES:${colors.reset}`);
    console.log(`   - Considera revisar los servicios con advertencias`);
    console.log(`   - Monitorea el rendimiento de estos servicios`);
    console.log('');
  } else {
    console.log(`${colors.green}✅ SISTEMA OPERATIVO${colors.reset}`);
    console.log(`   - Todos los servicios están funcionando correctamente`);
    console.log(`   - El sistema está listo para uso en producción`);
    console.log('');
  }
  
  // Código de salida
  process.exit(errorCount > 0 ? 1 : 0);
}

// Manejo de errores
process.on('unhandledRejection', (reason, promise) => {
  console.error(`${colors.red}Error no manejado:${colors.reset}`, reason);
  process.exit(1);
});

// Ejecutar health check
runHealthCheck(); 