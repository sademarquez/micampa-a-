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

// GET /api/volunteers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { territoryId, status, role, limit = 50, offset = 0 } = req.query;

    // Obtener voluntarios desde Redis
    const volunteers = await redis.getVolunteers({
      territoryId,
      status,
      role,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Datos simulados para demostración
    const mockVolunteers = [
      {
        id: 'vol-1',
        name: 'Ana María Rodríguez',
        email: 'ana.rodriguez@email.com',
        phone: '+573001234567',
        status: 'active',
        role: 'coordinator',
        territoryId: 'territory-1',
        coordinates: { longitude: -74.0721, latitude: 4.7110 },
        skills: ['door_to_door', 'phone_banking', 'event_organization'],
        availability: ['monday', 'wednesday', 'friday', 'saturday'],
        hoursWorked: 45,
        votersContacted: 120,
        eventsParticipated: 8,
        performance: 92.5,
        joinedAt: '2024-01-15T10:00:00Z',
        lastActivity: '2024-02-14T16:30:00Z'
      },
      {
        id: 'vol-2',
        name: 'Carlos Eduardo López',
        email: 'carlos.lopez@email.com',
        phone: '+573001234568',
        status: 'active',
        role: 'volunteer',
        territoryId: 'territory-2',
        coordinates: { longitude: -74.0521, latitude: 4.6710 },
        skills: ['canvassing', 'data_entry'],
        availability: ['tuesday', 'thursday', 'sunday'],
        hoursWorked: 32,
        votersContacted: 85,
        eventsParticipated: 5,
        performance: 88.0,
        joinedAt: '2024-01-20T14:30:00Z',
        lastActivity: '2024-02-13T12:15:00Z'
      },
      {
        id: 'vol-3',
        name: 'María Fernanda García',
        email: 'maria.garcia@email.com',
        phone: '+573001234569',
        status: 'inactive',
        role: 'volunteer',
        territoryId: 'territory-3',
        coordinates: { longitude: -74.0321, latitude: 4.7310 },
        skills: ['phone_banking'],
        availability: ['saturday'],
        hoursWorked: 18,
        votersContacted: 45,
        eventsParticipated: 2,
        performance: 75.5,
        joinedAt: '2024-01-25T09:15:00Z',
        lastActivity: '2024-02-10T10:45:00Z'
      },
      {
        id: 'vol-4',
        name: 'Juan Diego Martínez',
        email: 'juan.martinez@email.com',
        phone: '+573001234570',
        status: 'active',
        role: 'supervisor',
        territoryId: 'territory-4',
        coordinates: { longitude: -74.0921, latitude: 4.7510 },
        skills: ['leadership', 'training', 'coordination'],
        availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        hoursWorked: 65,
        votersContacted: 200,
        eventsParticipated: 12,
        performance: 95.8,
        joinedAt: '2024-01-10T08:00:00Z',
        lastActivity: '2024-02-14T18:20:00Z'
      },
      {
        id: 'vol-5',
        name: 'Laura Sofía Pérez',
        email: 'laura.perez@email.com',
        phone: '+573001234571',
        status: 'active',
        role: 'volunteer',
        territoryId: 'territory-5',
        coordinates: { longitude: -74.1121, latitude: 4.6910 },
        skills: ['social_media', 'event_organization'],
        availability: ['friday', 'saturday', 'sunday'],
        hoursWorked: 28,
        votersContacted: 95,
        eventsParticipated: 6,
        performance: 90.2,
        joinedAt: '2024-01-30T11:45:00Z',
        lastActivity: '2024-02-14T14:10:00Z'
      }
    ];

    // Filtrar voluntarios según parámetros
    let filteredVolunteers = mockVolunteers;

    if (territoryId) {
      filteredVolunteers = filteredVolunteers.filter(vol => vol.territoryId === territoryId);
    }

    if (status) {
      filteredVolunteers = filteredVolunteers.filter(vol => vol.status === status);
    }

    if (role) {
      filteredVolunteers = filteredVolunteers.filter(vol => vol.role === role);
    }

    // Aplicar paginación
    const paginatedVolunteers = filteredVolunteers.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: paginatedVolunteers,
      metadata: {
        total: filteredVolunteers.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < filteredVolunteers.length,
        filters: { territoryId, status, role },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo voluntarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/volunteers/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener voluntario específico desde Redis
    const volunteer = await redis.getVolunteer(id);

    if (!volunteer) {
      return res.status(404).json({ error: 'Voluntario no encontrado' });
    }

    // Obtener historial de actividades
    const activities = await redis.getVolunteerActivities(id);

    const volunteerData = {
      ...volunteer,
      activities: activities || []
    };

    res.json({
      success: true,
      data: volunteerData
    });

  } catch (error) {
    console.error('Error obteniendo voluntario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/volunteers
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

    // Validar campos requeridos
    if (!name || !email || !phone || !role || !territoryId) {
      return res.status(400).json({ 
        error: 'name, email, phone, role y territoryId son requeridos' 
      });
    }

    // Validar email único
    const existingVolunteer = await redis.getVolunteerByEmail(email);
    if (existingVolunteer) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Generar ID único
    const volunteerId = `vol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

    // Registrar KPI
    await redis.setKPI('volunteers', 'volunteer_registered', {
      volunteerId,
      role,
      territoryId,
      registeredBy: req.user.userId,
      timestamp: new Date().toISOString()
    });

    // Enviar a cola de n8n para automatización
    await redis.addToQueue('n8n_volunteers', {
      action: 'volunteer_registered',
      volunteer,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Voluntario registrado exitosamente',
      data: volunteer
    });

  } catch (error) {
    console.error('Error registrando voluntario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/volunteers/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Obtener voluntario existente
    const existingVolunteer = await redis.getVolunteer(id);

    if (!existingVolunteer) {
      return res.status(404).json({ error: 'Voluntario no encontrado' });
    }

    // Actualizar voluntario
    const updatedVolunteer = {
      ...existingVolunteer,
      ...updateData,
      lastActivity: new Date().toISOString()
    };

    // Guardar voluntario actualizado
    await redis.setVolunteer(id, updatedVolunteer);

    // Si cambió el territorio, actualizar asignaciones
    if (updateData.territoryId && updateData.territoryId !== existingVolunteer.territoryId) {
      await redis.removeVolunteerFromTerritory(existingVolunteer.territoryId, id);
      await redis.addVolunteerToTerritory(updateData.territoryId, id);
    }

    // Enviar a n8n
    await redis.addToQueue('n8n_volunteers', {
      action: 'volunteer_updated',
      volunteerId: id,
      changes: updateData,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Voluntario actualizado exitosamente',
      data: updatedVolunteer
    });

  } catch (error) {
    console.error('Error actualizando voluntario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/volunteers/:id/activity
router.post('/:id/activity', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, hours, votersContacted, eventId } = req.body;

    // Obtener voluntario existente
    const volunteer = await redis.getVolunteer(id);

    if (!volunteer) {
      return res.status(404).json({ error: 'Voluntario no encontrado' });
    }

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

    await redis.setVolunteer(id, updatedVolunteer);

    // Registrar KPI
    await redis.setKPI('volunteers', 'activity_recorded', {
      volunteerId: id,
      activityType: type,
      hours: activity.hours,
      votersContacted: activity.votersContacted,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Actividad registrada exitosamente',
      data: {
        activity,
        updatedStats: {
          hoursWorked: updatedVolunteer.hoursWorked,
          votersContacted: updatedVolunteer.votersContacted,
          performance: updatedVolunteer.performance
        }
      }
    });

  } catch (error) {
    console.error('Error registrando actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/volunteers/analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { territoryId } = req.query;

    // Obtener analytics de voluntarios
    const analytics = await redis.getVolunteerAnalytics({ territoryId });

    // Datos simulados para demostración
    const mockAnalytics = {
      totalVolunteers: 125,
      activeVolunteers: 98,
      inactiveVolunteers: 27,
      totalHoursWorked: 2840,
      totalVotersContacted: 15420,
      averagePerformance: 87.3,
      volunteersByRole: {
        coordinator: 15,
        supervisor: 25,
        volunteer: 85
      },
      volunteersByTerritory: {
        'territory-1': 25,
        'territory-2': 20,
        'territory-3': 15,
        'territory-4': 30,
        'territory-5': 35
      },
      topPerformers: [
        {
          id: 'vol-4',
          name: 'Juan Diego Martínez',
          performance: 95.8,
          hoursWorked: 65,
          votersContacted: 200
        },
        {
          id: 'vol-1',
          name: 'Ana María Rodríguez',
          performance: 92.5,
          hoursWorked: 45,
          votersContacted: 120
        },
        {
          id: 'vol-5',
          name: 'Laura Sofía Pérez',
          performance: 90.2,
          hoursWorked: 28,
          votersContacted: 95
        }
      ],
      recentActivity: [
        {
          volunteerId: 'vol-1',
          action: 'activity_recorded',
          timestamp: '2024-02-14T16:30:00Z'
        },
        {
          volunteerId: 'vol-4',
          action: 'activity_recorded',
          timestamp: '2024-02-14T18:20:00Z'
        }
      ]
    };

    res.json({
      success: true,
      data: mockAnalytics,
      metadata: {
        territoryId: territoryId || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo analytics de voluntarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 