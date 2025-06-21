const Redis = require('redis');
require('dotenv').config();

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = Redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('❌ Máximo número de intentos de reconexión a Redis alcanzado');
              return new Error('Máximo número de intentos de reconexión alcanzado');
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.error('❌ Error de Redis:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('🔗 Conectando a Redis...');
      });

      this.client.on('ready', () => {
        console.log('✅ Redis conectado y listo');
        this.isConnected = true;
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Reconectando a Redis...');
      });

      this.client.on('end', () => {
        console.log('🔌 Conexión a Redis cerrada');
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('❌ Error conectando a Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Métodos básicos
  async ping() {
    return await this.client.ping();
  }

  async exists(key) {
    return await this.client.exists(key);
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, options = {}) {
    if (options.EX) {
      return await this.client.setEx(key, options.EX, value);
    }
    return await this.client.set(key, value);
  }

  async del(key) {
    return await this.client.del(key);
  }

  async expire(key, seconds) {
    return await this.client.expire(key, seconds);
  }

  // Métodos de hash
  async hGet(key, field) {
    return await this.client.hGet(key, field);
  }

  async hSet(key, field, value) {
    return await this.client.hSet(key, field, value);
  }

  async hGetAll(key) {
    return await this.client.hGetAll(key);
  }

  async hDel(key, field) {
    return await this.client.hDel(key, field);
  }

  // Métodos de lista
  async lPush(key, value) {
    return await this.client.lPush(key, value);
  }

  async rPush(key, value) {
    return await this.client.rPush(key, value);
  }

  async lPop(key) {
    return await this.client.lPop(key);
  }

  async rPop(key) {
    return await this.client.rPop(key);
  }

  async lRange(key, start, stop) {
    return await this.client.lRange(key, start, stop);
  }

  async lLen(key) {
    return await this.client.lLen(key);
  }

  // Métodos de conjunto
  async sAdd(key, member) {
    return await this.client.sAdd(key, member);
  }

  async sRem(key, member) {
    return await this.client.sRem(key, member);
  }

  async sMembers(key) {
    return await this.client.sMembers(key);
  }

  async sIsMember(key, member) {
    return await this.client.sIsMember(key, member);
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

  async geoRadiusWithCoord(key, longitude, latitude, radius, unit = 'km') {
    return await this.client.geoRadius(key, longitude, latitude, radius, unit, 'WITHCOORD');
  }

  async geoRadiusWithDist(key, longitude, latitude, radius, unit = 'km') {
    return await this.client.geoRadius(key, longitude, latitude, radius, unit, 'WITHDIST');
  }

  // Métodos de cola
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

  // Métodos de usuarios
  async setUser(userId, userData) {
    return await this.hSet('users', userId, JSON.stringify(userData));
  }

  async getUser(userId) {
    const data = await this.hGet('users', userId);
    return data ? JSON.parse(data) : null;
  }

  async getUserByEmail(email) {
    const users = await this.hGetAll('users');
    for (const [userId, userData] of Object.entries(users)) {
      const user = JSON.parse(userData);
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getAllUsers() {
    const users = await this.hGetAll('users');
    return Object.values(users).map(userData => JSON.parse(userData));
  }

  // Métodos de eventos
  async setEvent(eventId, eventData) {
    return await this.hSet('events', eventId, JSON.stringify(eventData));
  }

  async getEvent(eventId) {
    const data = await this.hGet('events', eventId);
    return data ? JSON.parse(data) : null;
  }

  async getEvents(filters = {}) {
    const events = await this.hGetAll('events');
    let filteredEvents = Object.values(events).map(eventData => JSON.parse(eventData));

    if (filters.status) {
      filteredEvents = filteredEvents.filter(event => event.status === filters.status);
    }

    if (filters.territoryId) {
      filteredEvents = filteredEvents.filter(event => event.territoryId === filters.territoryId);
    }

    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(event => new Date(event.startDate) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(event => new Date(event.endDate) <= new Date(filters.endDate));
    }

    // Aplicar paginación
    const start = filters.offset || 0;
    const end = start + (filters.limit || 50);
    return filteredEvents.slice(start, end);
  }

  async deleteEvent(eventId) {
    return await this.hDel('events', eventId);
  }

  async addEventToTerritory(territoryId, eventId) {
    return await this.sAdd(`territory:${territoryId}:events`, eventId);
  }

  async removeEventFromTerritory(territoryId, eventId) {
    return await this.sRem(`territory:${territoryId}:events`, eventId);
  }

  // Métodos de mensajes
  async setMessage(messageId, messageData) {
    return await this.hSet('messages', messageId, JSON.stringify(messageData));
  }

  async getMessage(messageId) {
    const data = await this.hGet('messages', messageId);
    return data ? JSON.parse(data) : null;
  }

  async getMessages(filters = {}) {
    const messages = await this.hGetAll('messages');
    let filteredMessages = Object.values(messages).map(messageData => JSON.parse(messageData));

    if (filters.status) {
      filteredMessages = filteredMessages.filter(msg => msg.status === filters.status);
    }

    if (filters.type) {
      filteredMessages = filteredMessages.filter(msg => msg.type === filters.type);
    }

    if (filters.territoryId) {
      filteredMessages = filteredMessages.filter(msg => msg.territoryId === filters.territoryId);
    }

    // Aplicar paginación
    const start = filters.offset || 0;
    const end = start + (filters.limit || 50);
    return filteredMessages.slice(start, end);
  }

  async setMessageDelivery(messageId, recipientId, deliveryData) {
    return await this.hSet(`message:${messageId}:deliveries`, recipientId, JSON.stringify(deliveryData));
  }

  async getMessageStats(messageId) {
    const deliveries = await this.hGetAll(`message:${messageId}:deliveries`);
    return Object.values(deliveries).map(deliveryData => JSON.parse(deliveryData));
  }

  async setMessageTemplate(templateId, templateData) {
    return await this.hSet('message_templates', templateId, JSON.stringify(templateData));
  }

  async getMessageTemplates(filters = {}) {
    const templates = await this.hGetAll('message_templates');
    let filteredTemplates = Object.values(templates).map(templateData => JSON.parse(templateData));

    if (filters.type) {
      filteredTemplates = filteredTemplates.filter(template => template.type === filters.type);
    }

    return filteredTemplates;
  }

  // Métodos de voluntarios
  async setVolunteer(volunteerId, volunteerData) {
    return await this.hSet('volunteers', volunteerId, JSON.stringify(volunteerData));
  }

  async getVolunteer(volunteerId) {
    const data = await this.hGet('volunteers', volunteerId);
    return data ? JSON.parse(data) : null;
  }

  async getVolunteers(filters = {}) {
    const volunteers = await this.hGetAll('volunteers');
    let filteredVolunteers = Object.values(volunteers).map(volunteerData => JSON.parse(volunteerData));

    if (filters.territoryId) {
      filteredVolunteers = filteredVolunteers.filter(vol => vol.territoryId === filters.territoryId);
    }

    if (filters.status) {
      filteredVolunteers = filteredVolunteers.filter(vol => vol.status === filters.status);
    }

    if (filters.role) {
      filteredVolunteers = filteredVolunteers.filter(vol => vol.role === filters.role);
    }

    // Aplicar paginación
    const start = filters.offset || 0;
    const end = start + (filters.limit || 50);
    return filteredVolunteers.slice(start, end);
  }

  async addVolunteerToTerritory(territoryId, volunteerId) {
    return await this.sAdd(`territory:${territoryId}:volunteers`, volunteerId);
  }

  async removeVolunteerFromTerritory(territoryId, volunteerId) {
    return await this.sRem(`territory:${territoryId}:volunteers`, volunteerId);
  }

  async addVolunteerActivity(volunteerId, activityData) {
    return await this.lPush(`volunteer:${volunteerId}:activities`, JSON.stringify(activityData));
  }

  async getVolunteerActivities(volunteerId) {
    const activities = await this.lRange(`volunteer:${volunteerId}:activities`, 0, -1);
    return activities.map(activityData => JSON.parse(activityData));
  }

  async getVolunteerActivitiesCount(volunteerId) {
    return await this.lLen(`volunteer:${volunteerId}:activities`);
  }

  // Métodos de territorios y mapdata
  async addLocation(key, longitude, latitude, data = {}) {
    return await this.geoAdd('territories', longitude, latitude, key, data);
  }

  async getNearbyTerritories(longitude, latitude, radius, unit = 'km') {
    const nearby = await this.geoRadiusWithDist('territories', longitude, latitude, radius, unit);
    const results = [];

    for (const item of nearby) {
      const territoryData = await this.hGet('territories', item.member);
      if (territoryData) {
        results.push({
          ...JSON.parse(territoryData),
          distance: parseFloat(item.distance)
        });
      }
    }

    return results;
  }

  async setTerritoryMetrics(territoryId, metrics) {
    return await this.hSet('territory_metrics', territoryId, JSON.stringify(metrics));
  }

  // Métodos de n8n
  async setN8NWorkflow(workflowId, workflowData) {
    return await this.hSet('n8n_workflows', workflowId, JSON.stringify(workflowData));
  }

  async getN8NWorkflow(workflowId) {
    const data = await this.hGet('n8n_workflows', workflowId);
    return data ? JSON.parse(data) : null;
  }

  async getN8NWorkflows(filters = {}) {
    const workflows = await this.hGetAll('n8n_workflows');
    let filteredWorkflows = Object.values(workflows).map(workflowData => JSON.parse(workflowData));

    if (filters.status) {
      filteredWorkflows = filteredWorkflows.filter(wf => wf.status === filters.status);
    }

    if (filters.type) {
      filteredWorkflows = filteredWorkflows.filter(wf => wf.type === filters.type);
    }

    return filteredWorkflows;
  }

  async addN8NExecution(executionData) {
    return await this.lPush('n8n_executions', JSON.stringify(executionData));
  }

  async getN8NExecutions(filters = {}) {
    const executions = await this.lRange('n8n_executions', 0, -1);
    let filteredExecutions = executions.map(executionData => JSON.parse(executionData));

    if (filters.workflowId) {
      filteredExecutions = filteredExecutions.filter(exec => exec.workflowId === filters.workflowId);
    }

    if (filters.status) {
      filteredExecutions = filteredExecutions.filter(exec => exec.status === filters.status);
    }

    // Aplicar paginación
    const start = filters.offset || 0;
    const end = start + (filters.limit || 50);
    return filteredExecutions.slice(start, end);
  }

  // Métodos de alertas
  async addAlert(alertData) {
    const alertId = alertData.id;
    return await this.hSet('alerts', alertId, JSON.stringify(alertData));
  }

  async getAlerts(filters = {}) {
    const alerts = await this.hGetAll('alerts');
    let filteredAlerts = Object.values(alerts).map(alertData => JSON.parse(alertData));

    if (filters.territoryId) {
      filteredAlerts = filteredAlerts.filter(alert => alert.territoryId === filters.territoryId);
    }

    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
    }

    return filteredAlerts;
  }

  // Métodos de contactos con votantes
  async addVoterContact(voterId, contactData) {
    return await this.lPush(`voter:${voterId}:contacts`, JSON.stringify(contactData));
  }

  async getVoterContacts(voterId) {
    const contacts = await this.lRange(`voter:${voterId}:contacts`, 0, -1);
    return contacts.map(contactData => JSON.parse(contactData));
  }

  // Métodos de KPIs
  async setKPI(category, metric, data) {
    const kpiKey = `kpi:${category}:${metric}:${Date.now()}`;
    return await this.set(kpiKey, JSON.stringify(data), { EX: 86400 * 30 }); // 30 días
  }

  async getKPIs(category, metric, startTime, endTime) {
    const pattern = `kpi:${category}:${metric}:*`;
    const keys = await this.client.keys(pattern);
    const kpis = [];

    for (const key of keys) {
      const data = await this.get(key);
      if (data) {
        const kpiData = JSON.parse(data);
        const timestamp = parseInt(key.split(':').pop());
        
        if (timestamp >= startTime && timestamp <= endTime) {
          kpis.push(kpiData);
        }
      }
    }

    return kpis;
  }

  // Métodos de analytics
  async getEventAnalytics(filters = {}) {
    // Implementación simulada - en producción usaría agregaciones de Redis
    return {
      totalEvents: 45,
      completedEvents: 32,
      inProgressEvents: 8,
      scheduledEvents: 5,
      cancelledEvents: 0
    };
  }

  async getMessageAnalytics(filters = {}) {
    // Implementación simulada
    return {
      totalMessages: 125,
      sentMessages: 98,
      scheduledMessages: 15,
      draftMessages: 12,
      totalRecipients: 45000,
      totalDelivered: 42800,
      totalOpened: 32100
    };
  }

  async getVolunteerAnalytics(filters = {}) {
    // Implementación simulada
    return {
      totalVolunteers: 125,
      activeVolunteers: 98,
      inactiveVolunteers: 27,
      totalHoursWorked: 2840,
      totalVotersContacted: 15420,
      averagePerformance: 87.3
    };
  }

  async getN8NAnalytics(filters = {}) {
    // Implementación simulada
    return {
      totalWorkflows: 8,
      activeWorkflows: 6,
      totalExecutions: 240,
      successfulExecutions: 235,
      failedExecutions: 5,
      averageExecutionTime: 45.2,
      successRate: 97.9
    };
  }
}

// Crear instancia singleton
const redisClient = new RedisClient();

module.exports = redisClient; 