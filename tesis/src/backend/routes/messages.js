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

// GET /api/messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, territoryId, limit = 50, offset = 0 } = req.query;

    // Obtener mensajes desde Redis
    const messages = await redis.getMessages({
      status,
      type,
      territoryId,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Datos simulados para demostración
    const mockMessages = [
      {
        id: 'msg-1',
        title: 'Recordatorio de Evento - Centro Histórico',
        content: 'Hola {{name}}, te recordamos que mañana tenemos un evento importante en tu zona. ¡Esperamos verte!',
        type: 'sms',
        status: 'sent',
        territoryId: 'territory-1',
        templateId: 'template-1',
        scheduledAt: '2024-02-14T10:00:00Z',
        sentAt: '2024-02-14T10:00:00Z',
        recipients: 500,
        delivered: 485,
        opened: 320,
        createdBy: 'user-1',
        createdAt: '2024-02-13T15:30:00Z'
      },
      {
        id: 'msg-2',
        title: 'Invitación a Mitin - Kennedy',
        content: '{{name}}, te invitamos al gran mitin político este sábado. ¡Tu presencia es importante!',
        type: 'email',
        status: 'scheduled',
        territoryId: 'territory-5',
        templateId: 'template-2',
        scheduledAt: '2024-02-16T18:00:00Z',
        recipients: 2000,
        createdBy: 'user-2',
        createdAt: '2024-02-14T09:15:00Z'
      },
      {
        id: 'msg-3',
        title: 'Capacitación de Voluntarios',
        content: 'Hola {{name}}, este domingo tenemos capacitación para voluntarios. ¡No faltes!',
        type: 'whatsapp',
        status: 'draft',
        territoryId: 'territory-4',
        templateId: 'template-3',
        recipients: 30,
        createdBy: 'user-1',
        createdAt: '2024-02-14T11:45:00Z'
      }
    ];

    // Filtrar mensajes según parámetros
    let filteredMessages = mockMessages;

    if (status) {
      filteredMessages = filteredMessages.filter(msg => msg.status === status);
    }

    if (type) {
      filteredMessages = filteredMessages.filter(msg => msg.type === type);
    }

    if (territoryId) {
      filteredMessages = filteredMessages.filter(msg => msg.territoryId === territoryId);
    }

    // Aplicar paginación
    const paginatedMessages = filteredMessages.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: paginatedMessages,
      metadata: {
        total: filteredMessages.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < filteredMessages.length,
        filters: { status, type, territoryId },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/messages/templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;

    // Obtener plantillas desde Redis
    const templates = await redis.getMessageTemplates({ type });

    // Datos simulados de plantillas
    const mockTemplates = [
      {
        id: 'template-1',
        name: 'Recordatorio de Evento',
        type: 'sms',
        content: 'Hola {{name}}, te recordamos que mañana tenemos un evento importante en tu zona. ¡Esperamos verte!',
        variables: ['name'],
        createdBy: 'user-1',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'template-2',
        name: 'Invitación a Mitin',
        type: 'email',
        content: '{{name}}, te invitamos al gran mitin político este sábado. ¡Tu presencia es importante!',
        variables: ['name'],
        createdBy: 'user-2',
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 'template-3',
        name: 'Capacitación Voluntarios',
        type: 'whatsapp',
        content: 'Hola {{name}}, este domingo tenemos capacitación para voluntarios. ¡No faltes!',
        variables: ['name'],
        createdBy: 'user-1',
        createdAt: '2024-01-25T09:15:00Z'
      }
    ];

    let filteredTemplates = mockTemplates;

    if (type) {
      filteredTemplates = mockTemplates.filter(template => template.type === type);
    }

    res.json({
      success: true,
      data: filteredTemplates,
      metadata: {
        total: filteredTemplates.length,
        type: type || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo plantillas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/messages
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

    // Validar campos requeridos
    if (!title || !content || !type || !territoryId) {
      return res.status(400).json({ 
        error: 'title, content, type y territoryId son requeridos' 
      });
    }

    // Validar tipo de mensaje
    const validTypes = ['sms', 'email', 'whatsapp'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'type debe ser sms, email o whatsapp' });
    }

    // Generar ID único
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

    // Guardar mensaje en Redis
    await redis.setMessage(messageId, message);

    // Si está programado, agregar a cola de envío
    if (scheduledAt) {
      await redis.addToQueue('message_scheduler', {
        messageId,
        scheduledAt,
        timestamp: new Date().toISOString()
      });
    }

    // Registrar KPI
    await redis.setKPI('messages', 'message_created', {
      messageId,
      type,
      territoryId,
      createdBy: req.user.userId,
      timestamp: new Date().toISOString()
    });

    // Enviar a cola de n8n para automatización
    await redis.addToQueue('n8n_messages', {
      action: 'message_created',
      message,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Mensaje creado exitosamente',
      data: message
    });

  } catch (error) {
    console.error('Error creando mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/messages/:id/send
router.post('/:id/send', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener mensaje existente
    const message = await redis.getMessage(id);

    if (!message) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    if (message.status === 'sent') {
      return res.status(400).json({ error: 'El mensaje ya fue enviado' });
    }

    // Actualizar status a enviando
    const updatedMessage = {
      ...message,
      status: 'sending',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await redis.setMessage(id, updatedMessage);

    // Enviar a cola de envío
    await redis.addToQueue('message_sender', {
      messageId: id,
      message: updatedMessage,
      timestamp: new Date().toISOString()
    });

    // Enviar a n8n para procesamiento
    await redis.addToQueue('n8n_messages', {
      action: 'message_sending',
      messageId: id,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Mensaje enviado a cola de envío',
      data: updatedMessage
    });

  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/messages/:id/status
router.get('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener estado del mensaje
    const message = await redis.getMessage(id);

    if (!message) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    // Obtener estadísticas detalladas
    const stats = await redis.getMessageStats(id);

    const statusData = {
      messageId: id,
      status: message.status,
      recipients: message.recipients,
      delivered: message.delivered || 0,
      opened: message.opened || 0,
      failed: message.recipients - (message.delivered || 0),
      deliveryRate: message.recipients > 0 ? ((message.delivered || 0) / message.recipients * 100).toFixed(2) : 0,
      openRate: (message.delivered || 0) > 0 ? ((message.opened || 0) / (message.delivered || 0) * 100).toFixed(2) : 0,
      sentAt: message.sentAt,
      lastUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      data: statusData
    });

  } catch (error) {
    console.error('Error obteniendo estado del mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/messages/templates
router.post('/templates', authenticateToken, async (req, res) => {
  try {
    const { name, content, type, variables } = req.body;

    // Validar campos requeridos
    if (!name || !content || !type) {
      return res.status(400).json({ 
        error: 'name, content y type son requeridos' 
      });
    }

    // Validar tipo
    const validTypes = ['sms', 'email', 'whatsapp'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'type debe ser sms, email o whatsapp' });
    }

    // Generar ID único
    const templateId = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Crear plantilla
    const template = {
      id: templateId,
      name,
      content,
      type,
      variables: variables || [],
      createdBy: req.user.userId,
      createdAt: new Date().toISOString()
    };

    // Guardar plantilla en Redis
    await redis.setMessageTemplate(templateId, template);

    res.status(201).json({
      success: true,
      message: 'Plantilla creada exitosamente',
      data: template
    });

  } catch (error) {
    console.error('Error creando plantilla:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/messages/analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { territoryId, startDate, endDate } = req.query;

    // Obtener analytics de mensajes
    const analytics = await redis.getMessageAnalytics({
      territoryId,
      startDate,
      endDate
    });

    // Datos simulados para demostración
    const mockAnalytics = {
      totalMessages: 125,
      sentMessages: 98,
      scheduledMessages: 15,
      draftMessages: 12,
      totalRecipients: 45000,
      totalDelivered: 42800,
      totalOpened: 32100,
      averageDeliveryRate: 95.1,
      averageOpenRate: 75.0,
      messagesByType: {
        sms: 45,
        email: 60,
        whatsapp: 20
      },
      messagesByTerritory: {
        'territory-1': 25,
        'territory-2': 20,
        'territory-3': 15,
        'territory-4': 30,
        'territory-5': 35
      },
      recentActivity: [
        {
          messageId: 'msg-1',
          action: 'delivered',
          timestamp: '2024-02-14T10:30:00Z'
        },
        {
          messageId: 'msg-2',
          action: 'scheduled',
          timestamp: '2024-02-14T09:15:00Z'
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
    console.error('Error obteniendo analytics de mensajes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 