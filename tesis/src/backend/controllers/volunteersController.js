const redis = require('../config/redis');
const { validateVolunteerData, validateVolunteerId } = require('../utils/validators');

class VolunteersController {
  async list(req, res) {
    try {
      const { territoryId, status, page = 1, limit = 10 } = req.query;
      const cacheKey = `volunteers:list:${territoryId || 'all'}:${status || 'all'}:${page}:${limit}`;
      let data = await redis.get(cacheKey);
      if (!data) {
        // Simular datos de voluntarios
        const volunteers = [
          {
            id: 1,
            name: 'Juan Pérez',
            territoryId: 1,
            status: 'active',
            tasks: 15,
            performance: 92.1,
            joinedAt: '2023-12-01T10:00:00Z',
            contact: 'juan.perez@email.com'
          },
          {
            id: 2,
            name: 'María García',
            territoryId: 2,
            status: 'active',
            tasks: 12,
            performance: 88.7,
            joinedAt: '2023-12-10T11:00:00Z',
            contact: 'maria.garcia@email.com'
          },
          {
            id: 3,
            name: 'Carlos López',
            territoryId: 3,
            status: 'inactive',
            tasks: 18,
            performance: 85.4,
            joinedAt: '2023-12-15T09:00:00Z',
            contact: 'carlos.lopez@email.com'
          }
        ];
        let filtered = volunteers;
        if (territoryId) filtered = filtered.filter(v => v.territoryId == territoryId);
        if (status) filtered = filtered.filter(v => v.status === status);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginated = filtered.slice(startIndex, endIndex);
        data = {
          volunteers: paginated,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filtered.length,
            pages: Math.ceil(filtered.length / limit)
          }
        };
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en listar voluntarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async get(req, res) {
    try {
      const { volunteerId } = req.params;
      if (!validateVolunteerId(volunteerId)) {
        return res.status(400).json({ error: 'ID de voluntario inválido' });
      }
      const cacheKey = `volunteers:${volunteerId}`;
      let data = await redis.get(cacheKey);
      if (!data) {
        data = {
          id: volunteerId,
          name: 'Juan Pérez',
          territoryId: 1,
          status: 'active',
          tasks: 15,
          performance: 92.1,
          joinedAt: '2023-12-01T10:00:00Z',
          contact: 'juan.perez@email.com',
          history: [
            { date: '2024-01-10', action: 'Participó en evento', details: 'Evento Centro' },
            { date: '2024-01-12', action: 'Completó tarea', details: 'Reclutamiento' }
          ]
        };
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en obtener voluntario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const volunteerData = req.body;
      if (!validateVolunteerData(volunteerData)) {
        return res.status(400).json({ error: 'Datos de voluntario inválidos' });
      }
      const newVolunteer = {
        id: Date.now(),
        ...volunteerData,
        status: 'active',
        joinedAt: new Date().toISOString()
      };
      await redis.del('volunteers:list:*');
      res.status(201).json({ success: true, data: newVolunteer, message: 'Voluntario creado exitosamente' });
    } catch (error) {
      console.error('Error en crear voluntario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { volunteerId } = req.params;
      const updateData = req.body;
      if (!validateVolunteerId(volunteerId)) {
        return res.status(400).json({ error: 'ID de voluntario inválido' });
      }
      const updatedVolunteer = {
        id: volunteerId,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      await redis.del(`volunteers:${volunteerId}`);
      await redis.del('volunteers:list:*');
      res.json({ success: true, data: updatedVolunteer, message: 'Voluntario actualizado exitosamente' });
    } catch (error) {
      console.error('Error en actualizar voluntario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async remove(req, res) {
    try {
      const { volunteerId } = req.params;
      if (!validateVolunteerId(volunteerId)) {
        return res.status(400).json({ error: 'ID de voluntario inválido' });
      }
      await redis.del(`volunteers:${volunteerId}`);
      await redis.del('volunteers:list:*');
      res.json({ success: true, message: 'Voluntario eliminado exitosamente' });
    } catch (error) {
      console.error('Error en eliminar voluntario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async analytics(req, res) {
    try {
      const { territoryId, period } = req.query;
      const cacheKey = `volunteers:analytics:${territoryId || 'global'}:${period || 'month'}`;
      let data = await redis.get(cacheKey);
      if (!data) {
        data = {
          totalVolunteers: 45,
          activeVolunteers: 38,
          inactiveVolunteers: 7,
          averagePerformance: 85.2,
          topVolunteers: [
            { name: 'Juan Pérez', performance: 92.1, tasks: 15 },
            { name: 'María García', performance: 88.7, tasks: 12 },
            { name: 'Carlos López', performance: 85.4, tasks: 18 }
          ],
          trends: {
            daily: [2, 3, 1, 4, 2, 3, 2],
            weekly: [12, 15, 13, 16, 14, 17, 18],
            monthly: [38, 40, 42, 45, 43, 44, 45]
          },
          territoryPerformance: [
            { territory: 'Centro', volunteers: 15, performance: 89.1 },
            { territory: 'Norte', volunteers: 13, performance: 85.3 },
            { territory: 'Sur', volunteers: 10, performance: 82.7 }
          ]
        };
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }
      res.json({ success: true, data, metadata: { territoryId: territoryId || 'global', period: period || 'month', timestamp: new Date().toISOString() } });
    } catch (error) {
      console.error('Error en analytics de voluntarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new VolunteersController(); 