const redis = require('../config/redis');
const { validateMessageData, validateMessageId } = require('../utils/validators');

class MessagesController {
  async list(req, res) {
    try {
      const { territoryId, type, status, startDate, endDate, page = 1, limit = 10 } = req.query;
      
      const cacheKey = `messages:list:${territoryId || 'all'}:${type || 'all'}:${status || 'all'}:${startDate || 'all'}:${endDate || 'all'}:${page}:${limit}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        // Simular datos de mensajes
        const messages = [
          {
            id: 1,
            subject: 'Recordatorio de Evento',
            content: 'No olvides asistir al evento de mañana',
            type: 'notification',
            status: 'sent',
            territoryId: 1,
            sender: 'Juan Pérez',
            recipients: 120,
            sentAt: '2024-01-15T10:00:00Z',
            deliveredAt: '2024-01-15T10:05:00Z',
            readCount: 85
          },
          {
            id: 2,
            subject: 'Campaña de Voluntarios',
            content: 'Necesitamos voluntarios para el próximo evento',
            type: 'campaign',
            status: 'scheduled',
            territoryId: 2,
            sender: 'María García',
            recipients: 200,
            scheduledFor: '2024-01-18T09:00:00Z',
            sentAt: null,
            deliveredAt: null,
            readCount: 0
          },
          {
            id: 3,
            subject: 'Actualización de Tareas',
            content: 'Nuevas tareas asignadas para esta semana',
            type: 'task',
            status: 'sent',
            territoryId: 3,
            sender: 'Carlos López',
            recipients: 80,
            sentAt: '2024-01-16T14:30:00Z',
            deliveredAt: '2024-01-16T14:35:00Z',
            readCount: 65
          }
        ];
        
        // Filtrar por territorio
        let filteredMessages = messages;
        if (territoryId) {
          filteredMessages = messages.filter(message => message.territoryId == territoryId);
        }
        
        // Filtrar por tipo
        if (type) {
          filteredMessages = filteredMessages.filter(message => message.type === type);
        }
        
        // Filtrar por estado
        if (status) {
          filteredMessages = filteredMessages.filter(message => message.status === status);
        }
        
        // Filtrar por fecha
        if (startDate && endDate) {
          filteredMessages = filteredMessages.filter(message => {
            const messageDate = new Date(message.sentAt || message.scheduledFor);
            return messageDate >= new Date(startDate) && messageDate <= new Date(endDate);
          });
        }
        
        // Paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedMessages = filteredMessages.slice(startIndex, endIndex);
        
        data = {
          messages: paginatedMessages,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredMessages.length,
            pages: Math.ceil(filteredMessages.length / limit)
          }
        };
        
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en listar mensajes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async get(req, res) {
    try {
      const { messageId } = req.params;
      
      if (!validateMessageId(messageId)) {
        return res.status(400).json({ error: 'ID de mensaje inválido' });
      }

      const cacheKey = `messages:${messageId}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        // Simular datos del mensaje
        data = {
          id: messageId,
          subject: 'Recordatorio de Evento',
          content: 'No olvides asistir al evento de mañana',
          type: 'notification',
          status: 'sent',
          territoryId: 1,
          sender: 'Juan Pérez',
          recipients: 120,
          sentAt: '2024-01-15T10:00:00Z',
          deliveredAt: '2024-01-15T10:05:00Z',
          readCount: 85,
          deliveryStats: {
            sent: 120,
            delivered: 118,
            failed: 2,
            read: 85,
            clicked: 23
          },
          recipientsList: [
            { id: 1, name: 'Ana López', status: 'delivered', readAt: '2024-01-15T10:10:00Z' },
            { id: 2, name: 'Pedro García', status: 'delivered', readAt: '2024-01-15T10:15:00Z' },
            { id: 3, name: 'María Rodríguez', status: 'failed', readAt: null }
          ],
          attachments: [
            { name: 'evento.pdf', url: '/files/evento.pdf', size: '2.5MB' }
          ]
        };
        
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en obtener mensaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const messageData = req.body;
      
      if (!validateMessageData(messageData)) {
        return res.status(400).json({ error: 'Datos de mensaje inválidos' });
      }

      // Simular creación de mensaje
      const newMessage = {
        id: Date.now(),
        ...messageData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Limpiar cache relacionado
      await redis.del('messages:list:*');

      res.status(201).json({ 
        success: true, 
        data: newMessage,
        message: 'Mensaje creado exitosamente'
      });
    } catch (error) {
      console.error('Error en crear mensaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { messageId } = req.params;
      const updateData = req.body;
      
      if (!validateMessageId(messageId)) {
        return res.status(400).json({ error: 'ID de mensaje inválido' });
      }

      // Simular actualización de mensaje
      const updatedMessage = {
        id: messageId,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Limpiar cache
      await redis.del(`messages:${messageId}`);
      await redis.del('messages:list:*');

      res.json({ 
        success: true, 
        data: updatedMessage,
        message: 'Mensaje actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error en actualizar mensaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async remove(req, res) {
    try {
      const { messageId } = req.params;
      
      if (!validateMessageId(messageId)) {
        return res.status(400).json({ error: 'ID de mensaje inválido' });
      }

      // Simular eliminación de mensaje
      // En un caso real, aquí se marcaría como eliminado en la base de datos

      // Limpiar cache
      await redis.del(`messages:${messageId}`);
      await redis.del('messages:list:*');

      res.json({ 
        success: true, 
        message: 'Mensaje eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminar mensaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async send(req, res) {
    try {
      const { messageId } = req.params;
      
      if (!validateMessageId(messageId)) {
        return res.status(400).json({ error: 'ID de mensaje inválido' });
      }

      // Simular envío de mensaje
      const sentMessage = {
        id: messageId,
        status: 'sent',
        sentAt: new Date().toISOString(),
        deliveredAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos después
        updatedAt: new Date().toISOString()
      };

      // Limpiar cache
      await redis.del(`messages:${messageId}`);
      await redis.del('messages:list:*');

      res.json({ 
        success: true, 
        data: sentMessage,
        message: 'Mensaje enviado exitosamente'
      });
    } catch (error) {
      console.error('Error en enviar mensaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async schedule(req, res) {
    try {
      const { messageId } = req.params;
      const { scheduledFor } = req.body;
      
      if (!validateMessageId(messageId)) {
        return res.status(400).json({ error: 'ID de mensaje inválido' });
      }

      if (!scheduledFor) {
        return res.status(400).json({ error: 'Fecha de programación requerida' });
      }

      // Simular programación de mensaje
      const scheduledMessage = {
        id: messageId,
        status: 'scheduled',
        scheduledFor: new Date(scheduledFor).toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Limpiar cache
      await redis.del(`messages:${messageId}`);
      await redis.del('messages:list:*');

      res.json({ 
        success: true, 
        data: scheduledMessage,
        message: 'Mensaje programado exitosamente'
      });
    } catch (error) {
      console.error('Error en programar mensaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async analytics(req, res) {
    try {
      const { territoryId, period } = req.query;
      
      const cacheKey = `messages:analytics:${territoryId || 'global'}:${period || 'month'}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        data = {
          totalMessages: 1250,
          sentMessages: 1180,
          scheduledMessages: 45,
          draftMessages: 25,
          averageDeliveryRate: 94.2,
          averageReadRate: 72.8,
          averageClickRate: 18.5,
          topMessageTypes: [
            { type: 'notification', count: 450, deliveryRate: 96.1 },
            { type: 'campaign', count: 380, deliveryRate: 92.8 },
            { type: 'task', count: 320, deliveryRate: 93.5 }
          ],
          trends: {
            daily: [45, 52, 48, 55, 60, 58, 65],
            weekly: [320, 350, 380, 420, 390, 430, 480],
            monthly: [1200, 1400, 1600, 1800, 2000, 2200, 2400]
          },
          territoryPerformance: [
            { territory: 'Centro', messages: 450, deliveryRate: 95.2, readRate: 75.3 },
            { territory: 'Norte', messages: 380, deliveryRate: 93.8, readRate: 71.2 },
            { territory: 'Sur', messages: 320, deliveryRate: 92.5, readRate: 68.9 }
          ]
        };
        
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ 
        success: true, 
        data,
        metadata: {
          territoryId: territoryId || 'global',
          period: period || 'month',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en analytics de mensajes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new MessagesController(); 