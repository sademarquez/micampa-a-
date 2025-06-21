const express = require('express');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

const router = express.Router();

// Middleware para verificar JWT (opcional para webhooks de n8n)
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

// Middleware para webhooks de n8n (sin autenticación)
const n8nWebhookAuth = (req, res, next) => {
  const webhookSecret = req.headers['x-n8n-webhook-secret'];
  
  if (webhookSecret !== process.env.N8N_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Webhook secret inválido' });
  }
  
  next();
};

// POST /api/n8n/webhook/event-completed
router.post('/webhook/event-completed', n8nWebhookAuth, async (req, res) => {
  try {
    const { eventId, status, metrics, participants } = req.body;

    if (!eventId || !status) {
      return res.status(400).json({ error: 'eventId y status son requeridos' });
    }

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

    res.json({
      success: true,
      message: 'Evento completado procesado exitosamente',
      data: { eventId, status }
    });

  } catch (error) {
    console.error('Error procesando webhook de evento completado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/n8n/webhook/message-delivered
router.post('/webhook/message-delivered', n8nWebhookAuth, async (req, res) => {
  try {
    const { messageId, recipientId, status, deliveredAt } = req.body;

    if (!messageId || !recipientId || !status) {
      return res.status(400).json({ error: 'messageId, recipientId y status son requeridos' });
    }

    // Actualizar estado del mensaje
    const message = await redis.getMessage(messageId);
    if (message) {
      const updatedMessage = {
        ...message,
        delivered: message.delivered + (status === 'delivered' ? 1 : 0),
        updatedAt: new Date().toISOString()
      };

      await redis.setMessage(messageId, updatedMessage);
    }

    // Registrar entrega individual
    await redis.setMessageDelivery(messageId, recipientId, {
      status,
      deliveredAt: deliveredAt || new Date().toISOString()
    });

    // Registrar KPI
    await redis.setKPI('messages', 'message_delivered', {
      messageId,
      recipientId,
      status,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Entrega de mensaje procesada exitosamente',
      data: { messageId, recipientId, status }
    });

  } catch (error) {
    console.error('Error procesando webhook de mensaje entregado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/n8n/webhook/voter-contact
router.post('/webhook/voter-contact', n8nWebhookAuth, async (req, res) => {
  try {
    const { voterId, volunteerId, contactType, outcome, notes } = req.body;

    if (!voterId || !volunteerId || !contactType) {
      return res.status(400).json({ error: 'voterId, volunteerId y contactType son requeridos' });
    }

    // Registrar contacto con votante
    const contact = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      voterId,
      volunteerId,
      contactType,
      outcome,
      notes,
      timestamp: new Date().toISOString()
    };

    await redis.addVoterContact(voterId, contact);

    // Actualizar estadísticas del voluntario
    const volunteer = await redis.getVolunteer(volunteerId);
    if (volunteer) {
      const updatedVolunteer = {
        ...volunteer,
        votersContacted: volunteer.votersContacted + 1,
        lastActivity: new Date().toISOString()
      };

      await redis.setVolunteer(volunteerId, updatedVolunteer);
    }

    // Registrar KPI
    await redis.setKPI('voters', 'contact_made', {
      voterId,
      volunteerId,
      contactType,
      outcome,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Contacto con votante registrado exitosamente',
      data: contact
    });

  } catch (error) {
    console.error('Error procesando webhook de contacto con votante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/n8n/webhook/territory-update
router.post('/webhook/territory-update', n8nWebhookAuth, async (req, res) => {
  try {
    const { territoryId, metrics, alerts } = req.body;

    if (!territoryId) {
      return res.status(400).json({ error: 'territoryId es requerido' });
    }

    // Actualizar métricas del territorio
    if (metrics) {
      await redis.setTerritoryMetrics(territoryId, {
        ...metrics,
        updatedAt: new Date().toISOString()
      });
    }

    // Procesar alertas
    if (alerts && alerts.length > 0) {
      for (const alert of alerts) {
        await redis.addAlert({
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          territoryId,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Registrar KPI
    await redis.setKPI('territories', 'territory_updated', {
      territoryId,
      metricsUpdated: !!metrics,
      alertsCount: alerts?.length || 0,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Actualización de territorio procesada exitosamente',
      data: { territoryId, metricsUpdated: !!metrics, alertsCount: alerts?.length || 0 }
    });

  } catch (error) {
    console.error('Error procesando webhook de actualización de territorio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/n8n/workflows
router.get('/workflows', authenticateToken, async (req, res) => {
  try {
    const { status, type } = req.query;

    // Obtener workflows desde Redis
    const workflows = await redis.getN8NWorkflows({ status, type });

    // Datos simulados para demostración
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
        successRate: 98.5,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'workflow-2',
        name: 'Volunteer Performance Tracking',
        description: 'Rastrea y analiza el rendimiento de voluntarios',
        type: 'analytics',
        status: 'active',
        triggers: ['volunteer_activity'],
        actions: ['calculate_metrics', 'generate_report'],
        lastExecuted: '2024-02-14T18:20:00Z',
        executionCount: 128,
        successRate: 99.2,
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 'workflow-3',
        name: 'Territory Alert System',
        description: 'Monitorea territorios y genera alertas automáticas',
        type: 'monitoring',
        status: 'active',
        triggers: ['territory_update', 'threshold_exceeded'],
        actions: ['send_alert', 'notify_coordinator'],
        lastExecuted: '2024-02-14T15:45:00Z',
        executionCount: 67,
        successRate: 97.8,
        createdAt: '2024-01-25T09:15:00Z'
      }
    ];

    let filteredWorkflows = mockWorkflows;

    if (status) {
      filteredWorkflows = filteredWorkflows.filter(wf => wf.status === status);
    }

    if (type) {
      filteredWorkflows = filteredWorkflows.filter(wf => wf.type === type);
    }

    res.json({
      success: true,
      data: filteredWorkflows,
      metadata: {
        total: filteredWorkflows.length,
        filters: { status, type },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo workflows:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/n8n/workflows/:id/trigger
router.post('/workflows/:id/trigger', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, priority = 'normal' } = req.body;

    // Obtener workflow
    const workflow = await redis.getN8NWorkflow(id);

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow no encontrado' });
    }

    if (workflow.status !== 'active') {
      return res.status(400).json({ error: 'Workflow no está activo' });
    }

    // Crear ejecución
    const execution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId: id,
      data,
      priority,
      status: 'queued',
      triggeredBy: req.user.userId,
      createdAt: new Date().toISOString()
    };

    // Agregar a cola de ejecución
    await redis.addToQueue('n8n_executions', execution);

    // Registrar KPI
    await redis.setKPI('n8n', 'workflow_triggered', {
      workflowId: id,
      triggeredBy: req.user.userId,
      priority,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Workflow enviado a cola de ejecución',
      data: { executionId: execution.id, workflowId: id }
    });

  } catch (error) {
    console.error('Error ejecutando workflow:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/n8n/executions
router.get('/executions', authenticateToken, async (req, res) => {
  try {
    const { workflowId, status, limit = 50, offset = 0 } = req.query;

    // Obtener ejecuciones desde Redis
    const executions = await redis.getN8NExecutions({
      workflowId,
      status,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Datos simulados para demostración
    const mockExecutions = [
      {
        id: 'exec-1',
        workflowId: 'workflow-1',
        workflowName: 'Automated Event Follow-up',
        status: 'completed',
        data: { eventId: 'event-2', participants: 1800 },
        result: { emailsSent: 1800, successRate: 98.5 },
        startedAt: '2024-02-14T16:30:00Z',
        completedAt: '2024-02-14T16:32:00Z',
        duration: 120,
        triggeredBy: 'system'
      },
      {
        id: 'exec-2',
        workflowId: 'workflow-2',
        workflowName: 'Volunteer Performance Tracking',
        status: 'completed',
        data: { volunteerId: 'vol-4', activityType: 'door_to_door' },
        result: { metricsUpdated: true, reportGenerated: true },
        startedAt: '2024-02-14T18:20:00Z',
        completedAt: '2024-02-14T18:21:00Z',
        duration: 60,
        triggeredBy: 'system'
      },
      {
        id: 'exec-3',
        workflowId: 'workflow-3',
        workflowName: 'Territory Alert System',
        status: 'running',
        data: { territoryId: 'territory-1', threshold: 'low_support' },
        startedAt: '2024-02-14T19:15:00Z',
        triggeredBy: 'system'
      }
    ];

    let filteredExecutions = mockExecutions;

    if (workflowId) {
      filteredExecutions = filteredExecutions.filter(exec => exec.workflowId === workflowId);
    }

    if (status) {
      filteredExecutions = filteredExecutions.filter(exec => exec.status === status);
    }

    // Aplicar paginación
    const paginatedExecutions = filteredExecutions.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: paginatedExecutions,
      metadata: {
        total: filteredExecutions.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < filteredExecutions.length,
        filters: { workflowId, status },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo ejecuciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/n8n/analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Obtener analytics de n8n
    const analytics = await redis.getN8NAnalytics({ startDate, endDate });

    // Datos simulados para demostración
    const mockAnalytics = {
      totalWorkflows: 8,
      activeWorkflows: 6,
      totalExecutions: 240,
      successfulExecutions: 235,
      failedExecutions: 5,
      averageExecutionTime: 45.2,
      successRate: 97.9,
      executionsByType: {
        automation: 120,
        analytics: 80,
        monitoring: 40
      },
      topWorkflows: [
        {
          id: 'workflow-2',
          name: 'Volunteer Performance Tracking',
          executions: 128,
          successRate: 99.2
        },
        {
          id: 'workflow-1',
          name: 'Automated Event Follow-up',
          executions: 45,
          successRate: 98.5
        },
        {
          id: 'workflow-3',
          name: 'Territory Alert System',
          executions: 67,
          successRate: 97.8
        }
      ],
      recentActivity: [
        {
          workflowId: 'workflow-1',
          action: 'completed',
          timestamp: '2024-02-14T16:32:00Z'
        },
        {
          workflowId: 'workflow-2',
          action: 'completed',
          timestamp: '2024-02-14T18:21:00Z'
        }
      ]
    };

    res.json({
      success: true,
      data: mockAnalytics,
      metadata: {
        startDate: startDate || 'all',
        endDate: endDate || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo analytics de n8n:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 