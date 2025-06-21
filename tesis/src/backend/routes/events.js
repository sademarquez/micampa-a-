const express = require('express');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

const router = express.Router();

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'agora-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};

// GET /api/events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, territoryId, startDate, endDate, limit = 50, offset = 0 } = req.query;

    // Obtener eventos desde Redis
    const events = await redis.getEvents({
      status,
      territoryId,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Datos simulados para demostración
    const mockEvents = [
      {
        id: 'event-1',
        title: 'Campaña Puerta a Puerta - Centro Histórico',
        description: 'Actividad de contacto directo con votantes en el centro histórico',
        type: 'door_to_door',
        status: 'scheduled',
        territoryId: 'territory-1',
        coordinates: { longitude: -74.0721, latitude: 4.7110 },
        startDate: '2024-02-15T08:00:00Z',
        endDate: '2024-02-15T17:00:00Z',
        volunteers: 15,
        targetVoters: 500,
        createdBy: 'user-1',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
      },
      {
        id: 'event-2',
        title: 'Mitin Político - Kennedy',
        description: 'Evento masivo de presentación de propuestas',
        type: 'rally',
        status: 'completed',
        territoryId: 'territory-5',
        coordinates: { longitude: -74.1121, latitude: 4.6910 },
        startDate: '2024-02-10T18:00:00Z',
        endDate: '2024-02-10T21:00:00Z',
        volunteers: 25,
        targetVoters: 2000,
        actualAttendance: 1800,
        createdBy: 'user-2',
        createdAt: '2024-01-05T14:30:00Z',
        updatedAt: '2024-02-10T21:30:00Z'
      },
      {
        id: 'event-3',
        title: 'Taller de Capacitación - Suba',
        description: 'Capacitación de voluntarios en técnicas de campaña',
        type: 'training',
        status: 'in_progress',
        territoryId: 'territory-4',
        coordinates: { longitude: -74.0921, latitude: 4.7510 },
        startDate: '2024-02-12T09:00:00Z',
        endDate: '2024-02-12T16:00:00Z',
        volunteers: 30,
        targetVoters: 0,
        createdBy: 'user-1',
        createdAt: '2024-01-08T11:15:00Z',
        updatedAt: '2024-02-12T09:30:00Z'
      }
    ];

    // Filtrar eventos según parámetros
    let filteredEvents = mockEvents;

    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    if (territoryId) {
      filteredEvents = filteredEvents.filter(event => event.territoryId === territoryId);
    }

    if (startDate) {
      filteredEvents = filteredEvents.filter(event => new Date(event.startDate) >= new Date(startDate));
    }

    if (endDate) {
      filteredEvents = filteredEvents.filter(event => new Date(event.endDate) <= new Date(endDate));
    }

    // Aplicar paginación
    const paginatedEvents = filteredEvents.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: paginatedEvents,
      metadata: {
        total: filteredEvents.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < filteredEvents.length,
        filters: { status, territoryId, startDate, endDate },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/events/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener evento específico desde Redis
    const event = await redis.getEvent(id);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Error obteniendo evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/events
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

    // Generar ID único
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Crear objeto del evento
    const event = {
      id: eventId,
      title,
      description,
      type,
      status: 'scheduled',
      territoryId,
      coordinates: longitude && latitude ? { longitude: parseFloat(longitude), latitude: parseFloat(latitude) } : null,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      volunteers: parseInt(volunteers) || 0,
      targetVoters: parseInt(targetVoters) || 0,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Guardar evento en Redis
    await redis.setEvent(eventId, event);

    // Agregar a lista de eventos por territorio
    await redis.addEventToTerritory(territoryId, eventId);

    // Registrar KPI
    await redis.setKPI('events', 'event_created', {
      eventId,
      type,
      territoryId,
      createdBy: req.user.userId,
      timestamp: new Date().toISOString()
    });

    // Enviar a cola de n8n para automatización
    await redis.addToQueue('n8n_events', {
      action: 'event_created',
      event,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: event
    });

  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/events/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Obtener evento existente
    const existingEvent = await redis.getEvent(id);

    if (!existingEvent) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Actualizar evento
    const updatedEvent = {
      ...existingEvent,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Guardar evento actualizado
    await redis.setEvent(id, updatedEvent);

    // Enviar a cola de n8n
    await redis.addToQueue('n8n_events', {
      action: 'event_updated',
      eventId: id,
      changes: updateData,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      data: updatedEvent
    });

  } catch (error) {
    console.error('Error actualizando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener evento existente
    const existingEvent = await redis.getEvent(id);

    if (!existingEvent) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Eliminar evento de Redis
    await redis.deleteEvent(id);

    // Remover de lista de territorio
    await redis.removeEventFromTerritory(existingEvent.territoryId, id);

    // Enviar a cola de n8n
    await redis.addToQueue('n8n_events', {
      action: 'event_deleted',
      eventId: id,
      event: existingEvent,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/events/:id/status
router.post('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status es requerido' });
    }

    // Validar status válido
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'status inválido' });
    }

    // Obtener evento existente
    const existingEvent = await redis.getEvent(id);

    if (!existingEvent) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Actualizar status
    const updatedEvent = {
      ...existingEvent,
      status,
      updatedAt: new Date().toISOString()
    };

    // Guardar evento actualizado
    await redis.setEvent(id, updatedEvent);

    // Registrar cambio de status
    await redis.setKPI('events', 'status_changed', {
      eventId: id,
      oldStatus: existingEvent.status,
      newStatus: status,
      changedBy: req.user.userId,
      timestamp: new Date().toISOString()
    });

    // Enviar a cola de n8n
    await redis.addToQueue('n8n_events', {
      action: 'status_changed',
      eventId: id,
      oldStatus: existingEvent.status,
      newStatus: status,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Status del evento actualizado exitosamente',
      data: updatedEvent
    });

  } catch (error) {
    console.error('Error actualizando status del evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/events/analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { territoryId, startDate, endDate } = req.query;

    // Obtener estadísticas de eventos
    const analytics = await redis.getEventAnalytics({
      territoryId,
      startDate,
      endDate
    });

    // Datos simulados para demostración
    const mockAnalytics = {
      totalEvents: 45,
      completedEvents: 32,
      inProgressEvents: 8,
      scheduledEvents: 5,
      cancelledEvents: 0,
      totalVolunteers: 450,
      totalTargetVoters: 15000,
      totalActualAttendance: 12800,
      averageAttendance: 85.3,
      eventsByType: {
        door_to_door: 20,
        rally: 8,
        training: 12,
        meeting: 5
      },
      eventsByTerritory: {
        'territory-1': 12,
        'territory-2': 8,
        'territory-3': 6,
        'territory-4': 10,
        'territory-5': 9
      },
      recentActivity: [
        {
          eventId: 'event-2',
          action: 'completed',
          timestamp: '2024-02-10T21:30:00Z'
        },
        {
          eventId: 'event-3',
          action: 'started',
          timestamp: '2024-02-12T09:30:00Z'
        }
      ]
    };

    res.json({
      success: true,
      data: mockAnalytics,
      metadata: {
        territoryId: territoryId || 'all',
        startDate: startDate || 'all',
        endDate: endDate || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo analytics de eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 