const redis = require('../config/redis');
const { validateEventData, validateEventId } = require('../utils/validators');

class EventsController {
  async list(req, res) {
    try {
      const { territoryId, status, startDate, endDate, page = 1, limit = 10 } = req.query;
      
      const cacheKey = `events:list:${territoryId || 'all'}:${status || 'all'}:${startDate || 'all'}:${endDate || 'all'}:${page}:${limit}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        // Simular datos de eventos
        const events = [
          {
            id: 1,
            name: 'Reunión de Coordinación Centro',
            description: 'Reunión para coordinar actividades del territorio centro',
            date: '2024-01-15T18:00:00Z',
            location: 'Centro Comunitario',
            territoryId: 1,
            status: 'scheduled',
            expectedAttendance: 120,
            actualAttendance: 115,
            organizer: 'Juan Pérez',
            type: 'meeting'
          },
          {
            id: 2,
            name: 'Evento de Campaña Norte',
            description: 'Evento masivo de campaña en el territorio norte',
            date: '2024-01-18T19:00:00Z',
            location: 'Plaza Central Norte',
            territoryId: 2,
            status: 'completed',
            expectedAttendance: 200,
            actualAttendance: 185,
            organizer: 'María García',
            type: 'campaign'
          },
          {
            id: 3,
            name: 'Encuentro de Voluntarios Sur',
            description: 'Capacitación y coordinación de voluntarios',
            date: '2024-01-20T16:00:00Z',
            location: 'Auditorio Sur',
            territoryId: 3,
            status: 'scheduled',
            expectedAttendance: 80,
            actualAttendance: null,
            organizer: 'Carlos López',
            type: 'training'
          }
        ];
        
        // Filtrar por territorio
        let filteredEvents = events;
        if (territoryId) {
          filteredEvents = events.filter(event => event.territoryId == territoryId);
        }
        
        // Filtrar por estado
        if (status) {
          filteredEvents = filteredEvents.filter(event => event.status === status);
        }
        
        // Filtrar por fecha
        if (startDate && endDate) {
          filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
          });
        }
        
        // Paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
        
        data = {
          events: paginatedEvents,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredEvents.length,
            pages: Math.ceil(filteredEvents.length / limit)
          }
        };
        
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en listar eventos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async get(req, res) {
    try {
      const { eventId } = req.params;
      
      if (!validateEventId(eventId)) {
        return res.status(400).json({ error: 'ID de evento inválido' });
      }

      const cacheKey = `events:${eventId}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        // Simular datos del evento
        data = {
          id: eventId,
          name: 'Reunión de Coordinación Centro',
          description: 'Reunión para coordinar actividades del territorio centro',
          date: '2024-01-15T18:00:00Z',
          location: 'Centro Comunitario',
          territoryId: 1,
          status: 'scheduled',
          expectedAttendance: 120,
          actualAttendance: 115,
          organizer: 'Juan Pérez',
          type: 'meeting',
          agenda: [
            'Revisión de objetivos',
            'Distribución de tareas',
            'Planificación de próximos eventos'
          ],
          attendees: [
            { id: 1, name: 'Juan Pérez', role: 'organizer' },
            { id: 2, name: 'María García', role: 'volunteer' },
            { id: 3, name: 'Carlos López', role: 'volunteer' }
          ],
          resources: [
            { name: 'Presentación', url: '/files/presentation.pdf' },
            { name: 'Lista de tareas', url: '/files/tasks.xlsx' }
          ]
        };
        
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en obtener evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const eventData = req.body;
      
      if (!validateEventData(eventData)) {
        return res.status(400).json({ error: 'Datos de evento inválidos' });
      }

      // Simular creación de evento
      const newEvent = {
        id: Date.now(),
        ...eventData,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Limpiar cache relacionado
      await redis.del('events:list:*');

      res.status(201).json({ 
        success: true, 
        data: newEvent,
        message: 'Evento creado exitosamente'
      });
    } catch (error) {
      console.error('Error en crear evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { eventId } = req.params;
      const updateData = req.body;
      
      if (!validateEventId(eventId)) {
        return res.status(400).json({ error: 'ID de evento inválido' });
      }

      // Simular actualización de evento
      const updatedEvent = {
        id: eventId,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Limpiar cache
      await redis.del(`events:${eventId}`);
      await redis.del('events:list:*');

      res.json({ 
        success: true, 
        data: updatedEvent,
        message: 'Evento actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error en actualizar evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async remove(req, res) {
    try {
      const { eventId } = req.params;
      
      if (!validateEventId(eventId)) {
        return res.status(400).json({ error: 'ID de evento inválido' });
      }

      // Simular eliminación de evento
      // En un caso real, aquí se marcaría como eliminado en la base de datos

      // Limpiar cache
      await redis.del(`events:${eventId}`);
      await redis.del('events:list:*');

      res.json({ 
        success: true, 
        message: 'Evento eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en eliminar evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async changeStatus(req, res) {
    try {
      const { eventId } = req.params;
      const { status } = req.body;
      
      if (!validateEventId(eventId)) {
        return res.status(400).json({ error: 'ID de evento inválido' });
      }

      const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      // Simular cambio de estado
      const updatedEvent = {
        id: eventId,
        status,
        updatedAt: new Date().toISOString()
      };

      // Limpiar cache
      await redis.del(`events:${eventId}`);
      await redis.del('events:list:*');

      res.json({ 
        success: true, 
        data: updatedEvent,
        message: 'Estado del evento actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error en cambiar estado del evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async analytics(req, res) {
    try {
      const { territoryId, period } = req.query;
      
      const cacheKey = `events:analytics:${territoryId || 'global'}:${period || 'month'}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        data = {
          totalEvents: 8,
          completedEvents: 6,
          scheduledEvents: 2,
          cancelledEvents: 0,
          averageAttendance: 85.3,
          attendanceRate: 78.2,
          topEventTypes: [
            { type: 'meeting', count: 4, attendance: 320 },
            { type: 'campaign', count: 2, attendance: 385 },
            { type: 'training', count: 2, attendance: 160 }
          ],
          trends: {
            daily: [0, 1, 0, 0, 1, 0, 1],
            weekly: [2, 3, 2, 1],
            monthly: [8, 6, 4, 3]
          },
          territoryPerformance: [
            { territory: 'Centro', events: 3, attendance: 320, rate: 89.1 },
            { territory: 'Norte', events: 3, attendance: 285, rate: 85.3 },
            { territory: 'Sur', events: 2, attendance: 160, rate: 82.7 }
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
      console.error('Error en analytics de eventos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new EventsController(); 