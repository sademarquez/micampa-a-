# Capítulo 4: Implementación del Sistema

## 4.1 Arquitectura del Backend

### 4.1.1 Estructura del Servidor

El backend de Agora está implementado en Node.js con Express, siguiendo una arquitectura modular y escalable. La estructura principal incluye:

```javascript
// server.js - Servidor principal
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const redis = require('./config/redis');

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas requests desde esta IP, intenta de nuevo en 15 minutos'
  }
});
```

### 4.1.2 Configuración de Redis

Redis se utiliza como base de datos principal para el almacenamiento en memoria y gestión de sesiones:

```javascript
// config/redis.js
class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    this.client = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error('Máximo número de intentos de reconexión alcanzado');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });
  }

  // Métodos geoespaciales
  async geoAdd(key, longitude, latitude, member, data = {}) {
    const locationData = JSON.stringify(data);
    return await this.client.geoAdd(key, {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      member: member
    });
  }

  async geoRadius(key, longitude, latitude, radius, unit = 'km') {
    return await this.client.geoRadius(key, longitude, latitude, radius, unit);
  }
}
```

## 4.2 Sistema de Autenticación y Autorización

### 4.2.1 Registro de Usuarios

```javascript
// routes/auth.js
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'volunteer' } = req.body;

    // Validar campos requeridos
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'email, password y name son requeridos' 
      });
    }

    // Encriptar password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Generar tokens
    const accessToken = jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET || 'agora-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId, email },
      process.env.JWT_REFRESH_SECRET || 'agora-refresh-secret',
      { expiresIn: '7d' }
    );
  }
});
```

### 4.2.2 Middleware de Autorización

```javascript
// Middleware para verificar roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: permisos insuficientes' });
    }

    next();
  };
};

// Uso en rutas
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  // Solo administradores pueden acceder
});
```

## 4.3 Gestión de Datos Geoespaciales

### 4.3.1 API de Territorios

```javascript
// routes/mapdata.js
router.get('/territories', authenticateToken, async (req, res) => {
  try {
    const { bounds, radius = 10 } = req.query;
    
    // Datos de territorios con coordenadas
    const territories = [
      {
        id: 'territory-1',
        name: 'Centro Histórico',
        coordinates: { longitude: -74.0721, latitude: 4.7110 },
        data: {
          totalVoters: 15420,
          registeredVoters: 12850,
          supportLevel: 78.5,
          events: 5,
          volunteers: 23
        }
      }
    ];

    // Convertir a formato GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: territories.map(territory => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [territory.coordinates.longitude, territory.coordinates.latitude]
        },
        properties: {
          id: territory.id,
          name: territory.name,
          ...territory.data
        }
      }))
    };
  }
});
```

### 4.3.2 Búsqueda de Territorios Cercanos

```javascript
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const { longitude, latitude, radius = 10, unit = 'km' } = req.query;

    // Obtener territorios cercanos desde Redis
    const nearbyTerritories = await redis.getNearbyTerritories(
      parseFloat(longitude),
      parseFloat(latitude),
      parseFloat(radius),
      unit
    );

    res.json({
      success: true,
      data: nearbyTerritories,
      metadata: {
        center: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) },
        radius: parseFloat(radius),
        unit,
        count: nearbyTerritories.length
      }
    });
  }
});
```

## 4.4 Gestión de Eventos

### 4.4.1 Creación de Eventos

```javascript
// routes/events.js
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      territoryId,
      longitude,
      latitude,
      startDate,
      endDate,
      volunteers,
      targetVoters
    } = req.body;

    // Validar campos requeridos
    if (!title || !type || !territoryId || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'title, type, territoryId, startDate y endDate son requeridos' 
      });
    }

    // Crear objeto del evento
    const event = {
      id: eventId,
      title,
      description,
      type,
      status: scheduledAt ? 'scheduled' : 'draft',
      territoryId,
      coordinates: longitude && latitude ? { longitude: parseFloat(longitude), latitude: parseFloat(latitude) } : null,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      volunteers: parseInt(volunteers) || 0,
      targetVoters: parseInt(targetVoters) || 0,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString()
    };

    // Guardar evento en Redis
    await redis.setEvent(eventId, event);

    // Si está programado, agregar a cola de envío
    if (scheduledAt) {
      await redis.addToQueue('message_scheduler', {
        messageId,
        scheduledAt,
        timestamp: new Date().toISOString()
      });
    }
  }
});
```

### 4.4.2 Seguimiento de Eventos

```javascript
router.post('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar status válido
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'status inválido' });
    }

    // Actualizar status
    const updatedEvent = {
      ...existingEvent,
      status,
      updatedAt: new Date().toISOString()
    };

    // Registrar cambio de status
    await redis.setKPI('events', 'status_changed', {
      eventId: id,
      oldStatus: existingEvent.status,
      newStatus: status,
      changedBy: req.user.userId,
      timestamp: new Date().toISOString()
    });
  }
});
```

## 4.5 Sistema de Mensajería

### 4.5.1 Envío de Mensajes

```javascript
// routes/messages.js
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      territoryId,
      templateId,
      scheduledAt,
      recipients
    } = req.body;

    // Validar tipo de mensaje
    const validTypes = ['sms', 'email', 'whatsapp'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'type debe ser sms, email o whatsapp' });
    }

    // Crear objeto del mensaje
    const message = {
      id: messageId,
      title,
      content,
      type,
      status: scheduledAt ? 'scheduled' : 'draft',
      territoryId,
      templateId,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      recipients: parseInt(recipients) || 0,
      delivered: 0,
      opened: 0,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString()
    };

    // Si está programado, agregar a cola de envío
    if (scheduledAt) {
      await redis.addToQueue('message_scheduler', {
        messageId,
        scheduledAt,
        timestamp: new Date().toISOString()
      });
    }
  }
});
```

### 4.5.2 Plantillas de Mensajes

```javascript
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;

    // Obtener plantillas desde Redis
    const templates = await redis.getMessageTemplates({ type });

    const mockTemplates = [
      {
        id: 'template-1',
        name: 'Recordatorio de Evento',
        type: 'sms',
        content: 'Hola {{name}}, te recordamos que mañana tenemos un evento importante en tu zona. ¡Esperamos verte!',
        variables: ['name'],
        createdBy: 'user-1',
        createdAt: '2024-01-15T10:00:00Z'
      }
    ];

    res.json({
      success: true,
      data: filteredTemplates,
      metadata: {
        total: filteredTemplates.length,
        type: type || 'all'
      }
    });
  }
});
```

## 4.6 Gestión de Voluntarios

### 4.6.1 Registro de Voluntarios

```javascript
// routes/volunteers.js
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      territoryId,
      longitude,
      latitude,
      skills,
      availability
    } = req.body;

    // Validar email único
    const existingVolunteer = await redis.getVolunteerByEmail(email);
    if (existingVolunteer) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear objeto del voluntario
    const volunteer = {
      id: volunteerId,
      name,
      email,
      phone,
      status: 'active',
      role,
      territoryId,
      coordinates: longitude && latitude ? { longitude: parseFloat(longitude), latitude: parseFloat(latitude) } : null,
      skills: skills || [],
      availability: availability || [],
      hoursWorked: 0,
      votersContacted: 0,
      eventsParticipated: 0,
      performance: 0,
      joinedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    // Guardar voluntario en Redis
    await redis.setVolunteer(volunteerId, volunteer);

    // Agregar a lista de voluntarios por territorio
    await redis.addVolunteerToTerritory(territoryId, volunteerId);
  }
});
```

### 4.6.2 Seguimiento de Actividades

```javascript
router.post('/:id/activity', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, hours, votersContacted, eventId } = req.body;

    // Crear actividad
    const activity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      volunteerId: id,
      type,
      description,
      hours: parseFloat(hours) || 0,
      votersContacted: parseInt(votersContacted) || 0,
      eventId,
      recordedBy: req.user.userId,
      timestamp: new Date().toISOString()
    };

    // Guardar actividad
    await redis.addVolunteerActivity(id, activity);

    // Actualizar estadísticas del voluntario
    const updatedVolunteer = {
      ...volunteer,
      hoursWorked: volunteer.hoursWorked + activity.hours,
      votersContacted: volunteer.votersContacted + activity.votersContacted,
      lastActivity: new Date().toISOString()
    };

    // Recalcular performance
    const totalActivities = await redis.getVolunteerActivitiesCount(id);
    const avgPerformance = totalActivities > 0 ? (volunteer.performance * (totalActivities - 1) + 85) / totalActivities : 85;
    updatedVolunteer.performance = Math.round(avgPerformance * 10) / 10;
  }
});
```

## 4.7 Integración con n8n

### 4.7.1 Webhooks para Automatización

```javascript
// routes/n8n.js
router.post('/webhook/event-completed', n8nWebhookAuth, async (req, res) => {
  try {
    const { eventId, status, metrics, participants } = req.body;

    // Actualizar estado del evento
    const event = await redis.getEvent(eventId);
    if (event) {
      const updatedEvent = {
        ...event,
        status,
        actualAttendance: participants?.length || 0,
        metrics: metrics || {},
        completedAt: status === 'completed' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      };

      await redis.setEvent(eventId, updatedEvent);
    }

    // Registrar KPI
    await redis.setKPI('events', 'event_completed', {
      eventId,
      status,
      participants: participants?.length || 0,
      timestamp: new Date().toISOString()
    });

    // Notificar a voluntarios participantes
    if (participants && participants.length > 0) {
      for (const participantId of participants) {
        await redis.addToQueue('n8n_notifications', {
          type: 'event_completed',
          recipientId: participantId,
          eventId,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
});
```

### 4.7.2 Gestión de Workflows

```javascript
router.get('/workflows', authenticateToken, async (req, res) => {
  try {
    const { status, type } = req.query;

    // Obtener workflows desde Redis
    const workflows = await redis.getN8NWorkflows({ status, type });

    const mockWorkflows = [
      {
        id: 'workflow-1',
        name: 'Automated Event Follow-up',
        description: 'Envía mensajes de seguimiento automático después de eventos',
        type: 'automation',
        status: 'active',
        triggers: ['event_completed'],
        actions: ['send_email', 'update_metrics'],
        lastExecuted: '2024-02-14T16:30:00Z',
        executionCount: 45,
        successRate: 98.5
      }
    ];

    res.json({
      success: true,
      data: filteredWorkflows,
      metadata: {
        total: filteredWorkflows.length,
        filters: { status, type }
      }
    });
  }
});
```

## 4.8 Dashboard y Analytics

### 4.8.1 Overview del Dashboard

```javascript
// routes/dashboard.js
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const { territoryId, startDate, endDate } = req.query;

    // Obtener datos según el rol del usuario
    let userTerritories = [];
    if (req.user.role === 'admin') {
      userTerritories = ['territory-1', 'territory-2', 'territory-3', 'territory-4', 'territory-5'];
    } else if (req.user.role === 'coordinator') {
      userTerritories = ['territory-1', 'territory-2', 'territory-3'];
    } else {
      userTerritories = [req.user.territoryId || 'territory-1'];
    }

    const overviewData = {
      summary: {
        totalTerritories: userTerritories.length,
        totalVoters: 15420,
        totalVolunteers: 125,
        totalEvents: 45,
        totalMessages: 125,
        activeCampaigns: 3
      },
      metrics: {
        voterRegistration: {
          total: 12850,
          percentage: 83.4,
          trend: '+2.3%',
          change: 'positive'
        },
        supportLevel: {
          average: 82.3,
          trend: '+1.8%',
          change: 'positive'
        }
      },
      recentActivity: [
        {
          id: 'activity-1',
          type: 'event_completed',
          title: 'Mitin Político - Kennedy',
          description: 'Evento completado con 1800 asistentes',
          timestamp: '2024-02-14T21:30:00Z',
          territoryId: 'territory-5'
        }
      ]
    };
  }
});
```

### 4.8.2 Analytics Detallados

```javascript
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { metric, territoryId, period = '7d' } = req.query;

    const analyticsData = {
      voterRegistration: {
        trend: [
          { date: '2024-02-08', value: 12000 },
          { date: '2024-02-09', value: 12150 },
          { date: '2024-02-10', value: 12300 },
          { date: '2024-02-11', value: 12450 },
          { date: '2024-02-12', value: 12600 },
          { date: '2024-02-13', value: 12750 },
          { date: '2024-02-14', value: 12850 }
        ],
        growth: '+2.3%',
        target: 15000
      },
      supportLevel: {
        trend: [
          { date: '2024-02-08', value: 80.5 },
          { date: '2024-02-09', value: 81.2 },
          { date: '2024-02-10', value: 81.8 },
          { date: '2024-02-11', value: 82.1 },
          { date: '2024-02-12', value: 82.5 },
          { date: '2024-02-13', value: 82.8 },
          { date: '2024-02-14', value: 82.3 }
        ],
        growth: '+1.8%',
        target: 85.0
      }
    };
  }
});
```

## 4.9 Sistema de Colas y Procesamiento

### 4.9.1 Gestión de Colas

```javascript
// Métodos de cola en Redis
async addToQueue(queueName, data) {
  const queueData = {
    ...data,
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  return await this.lPush(`queue:${queueName}`, JSON.stringify(queueData));
}

async getFromQueue(queueName) {
  const data = await this.rPop(`queue:${queueName}`);
  return data ? JSON.parse(data) : null;
}

async getQueueLength(queueName) {
  return await this.lLen(`queue:${queueName}`);
}
```

### 4.9.2 Procesamiento de Mensajes

```javascript
// Ejemplo de procesamiento de cola de mensajes
async function processMessageQueue() {
  while (true) {
    const messageJob = await redis.getFromQueue('message_sender');
    
    if (messageJob) {
      try {
        const { messageId, message } = messageJob;
        
        // Procesar envío según tipo
        switch (message.type) {
          case 'sms':
            await sendSMS(message);
            break;
          case 'email':
            await sendEmail(message);
            break;
          case 'whatsapp':
            await sendWhatsApp(message);
            break;
        }
        
        // Actualizar estado
        await redis.setMessage(messageId, {
          ...message,
          status: 'sent',
          sentAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('Error procesando mensaje:', error);
        // Reintentar o marcar como fallido
      }
    }
    
    // Esperar antes del siguiente procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## 4.10 Seguridad y Validación

### 4.10.1 Middleware de Seguridad

```javascript
// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas requests desde esta IP, intenta de nuevo en 15 minutos'
  }
});

app.use(limiter);
```

### 4.10.2 Validación de Datos

```javascript
// Validación de entrada
const validateEventData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  }
  
  if (!data.startDate || new Date(data.startDate) <= new Date()) {
    errors.push('La fecha de inicio debe ser futura');
  }
  
  if (!data.endDate || new Date(data.endDate) <= new Date(data.startDate)) {
    errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
  }
  
  return errors;
};

// Uso en rutas
router.post('/events', authenticateToken, async (req, res) => {
  const validationErrors = validateEventData(req.body);
  
  if (validationErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Datos inválidos', 
      details: validationErrors 
    });
  }
  
  // Continuar con la creación del evento
});
```

## 4.11 Monitoreo y Logging

### 4.11.1 Sistema de Logging

```javascript
// Middleware de logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});
```

### 4.11.2 Health Check

```javascript
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a Redis
    const redisStatus = await redis.ping();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        redis: redisStatus === 'PONG' ? 'connected' : 'disconnected',
        server: 'running'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };

    const isHealthy = healthStatus.services.redis === 'connected';
    res.status(isHealthy ? 200 : 503).json(healthStatus);
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});
```

## 4.12 Configuración de Producción

### 4.12.1 Variables de Entorno

```bash
# .env
NODE_ENV=production
PORT=3001
REDIS_URL=redis://localhost:6379
JWT_SECRET=tu-jwt-secret-super-seguro
JWT_REFRESH_SECRET=tu-refresh-secret-super-seguro
N8N_WEBHOOK_SECRET=tu-n8n-webhook-secret
FRONTEND_URL=https://tu-dominio.com
```

### 4.12.2 Scripts de Inicio

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## 4.13 Conclusiones

La implementación del backend de Agora demuestra una arquitectura robusta y escalable que integra múltiples tecnologías:

1. **Redis** como base de datos principal para alta velocidad y funcionalidades geoespaciales
2. **JWT** para autenticación segura con refresh tokens
3. **Express** con middleware de seguridad para protección contra ataques comunes
4. **Sistema de colas** para procesamiento asíncrono de tareas
5. **Integración con n8n** para automatización de workflows
6. **APIs RESTful** bien estructuradas con validación y manejo de errores
7. **Monitoreo y logging** para observabilidad del sistema

El sistema está diseñado para ser escalable, mantenible y seguro, proporcionando una base sólida para la plataforma de inteligencia de campaña Agora. 