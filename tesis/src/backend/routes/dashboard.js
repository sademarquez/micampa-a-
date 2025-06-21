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

// GET /api/dashboard/overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const { territoryId, startDate, endDate } = req.query;

    // Obtener datos según el rol del usuario
    let userTerritories = [];
    if (req.user.role === 'admin') {
      // Admin ve todos los territorios
      userTerritories = ['territory-1', 'territory-2', 'territory-3', 'territory-4', 'territory-5'];
    } else if (req.user.role === 'coordinator') {
      // Coordinador ve territorios asignados
      userTerritories = ['territory-1', 'territory-2', 'territory-3'];
    } else {
      // Otros roles ven solo su territorio
      userTerritories = [req.user.territoryId || 'territory-1'];
    }

    // Filtrar por territorio específico si se proporciona
    if (territoryId && userTerritories.includes(territoryId)) {
      userTerritories = [territoryId];
    }

    // Datos simulados para demostración
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
        },
        volunteerEngagement: {
          active: 98,
          percentage: 78.4,
          trend: '+5.2%',
          change: 'positive'
        },
        eventAttendance: {
          average: 85.3,
          trend: '+3.1%',
          change: 'positive'
        },
        messageDelivery: {
          rate: 95.1,
          trend: '+0.8%',
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
        },
        {
          id: 'activity-2',
          type: 'volunteer_registered',
          title: 'Nuevo Voluntario',
          description: 'Ana María Rodríguez se registró como coordinadora',
          timestamp: '2024-02-14T16:30:00Z',
          territoryId: 'territory-1'
        },
        {
          id: 'activity-3',
          type: 'message_sent',
          title: 'Campaña SMS',
          description: '500 mensajes enviados al Centro Histórico',
          timestamp: '2024-02-14T10:00:00Z',
          territoryId: 'territory-1'
        }
      ],
      alerts: [
        {
          id: 'alert-1',
          type: 'low_support',
          severity: 'medium',
          message: 'Nivel de apoyo bajo detectado en Usaquén',
          territoryId: 'territory-3',
          timestamp: '2024-02-14T15:45:00Z'
        },
        {
          id: 'alert-2',
          type: 'volunteer_shortage',
          severity: 'low',
          message: 'Falta de voluntarios en Chapinero',
          territoryId: 'territory-2',
          timestamp: '2024-02-14T12:30:00Z'
        }
      ],
      territories: userTerritories.map(territoryId => ({
        id: territoryId,
        name: getTerritoryName(territoryId),
        metrics: {
          totalVoters: getRandomVoters(),
          registeredVoters: getRandomRegistered(),
          supportLevel: getRandomSupport(),
          volunteers: getRandomVolunteers(),
          events: getRandomEvents()
        }
      }))
    };

    res.json({
      success: true,
      data: overviewData,
      metadata: {
        userRole: req.user.role,
        territories: userTerritories,
        startDate: startDate || 'all',
        endDate: endDate || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo overview del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/dashboard/territory/:id
router.get('/territory/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Verificar acceso al territorio
    if (!hasTerritoryAccess(req.user, id)) {
      return res.status(403).json({ error: 'Acceso denegado a este territorio' });
    }

    // Obtener datos específicos del territorio
    const territoryData = {
      id,
      name: getTerritoryName(id),
      coordinates: getTerritoryCoordinates(id),
      demographics: {
        totalPopulation: getRandomPopulation(),
        votingAge: getRandomVotingAge(),
        registeredVoters: getRandomRegistered(),
        turnoutRate: getRandomTurnout()
      },
      campaign: {
        totalVoters: getRandomVoters(),
        registeredVoters: getRandomRegistered(),
        supportLevel: getRandomSupport(),
        undecided: getRandomUndecided(),
        opposition: getRandomOpposition()
      },
      volunteers: {
        total: getRandomVolunteers(),
        active: getRandomActiveVolunteers(),
        coordinators: getRandomCoordinators(),
        supervisors: getRandomSupervisors(),
        regular: getRandomRegularVolunteers()
      },
      events: {
        total: getRandomEvents(),
        completed: getRandomCompletedEvents(),
        scheduled: getRandomScheduledEvents(),
        cancelled: getRandomCancelledEvents(),
        averageAttendance: getRandomAttendance()
      },
      messages: {
        total: getRandomMessages(),
        sent: getRandomSentMessages(),
        delivered: getRandomDeliveredMessages(),
        opened: getRandomOpenedMessages(),
        deliveryRate: getRandomDeliveryRate()
      },
      performance: {
        voterContactRate: getRandomContactRate(),
        volunteerEfficiency: getRandomEfficiency(),
        eventSuccessRate: getRandomSuccessRate(),
        messageEffectiveness: getRandomEffectiveness()
      },
      recentActivity: [
        {
          id: 'activity-1',
          type: 'voter_contact',
          description: 'Juan Pérez contactó 15 votantes',
          timestamp: '2024-02-14T16:30:00Z',
          volunteer: 'Juan Pérez'
        },
        {
          id: 'activity-2',
          type: 'event_scheduled',
          description: 'Nuevo evento programado para el sábado',
          timestamp: '2024-02-14T14:15:00Z',
          event: 'Campaña Puerta a Puerta'
        },
        {
          id: 'activity-3',
          type: 'message_sent',
          description: 'Campaña SMS completada',
          timestamp: '2024-02-14T10:00:00Z',
          messages: 500
        }
      ],
      alerts: [
        {
          id: 'alert-1',
          type: 'low_support',
          severity: 'medium',
          message: 'Nivel de apoyo en descenso',
          timestamp: '2024-02-14T15:45:00Z'
        }
      ]
    };

    res.json({
      success: true,
      data: territoryData,
      metadata: {
        territoryId: id,
        startDate: startDate || 'all',
        endDate: endDate || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo datos del territorio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/dashboard/analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { metric, territoryId, period = '7d' } = req.query;

    // Verificar acceso al territorio si se especifica
    if (territoryId && !hasTerritoryAccess(req.user, territoryId)) {
      return res.status(403).json({ error: 'Acceso denegado a este territorio' });
    }

    // Datos de analytics simulados
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
      },
      volunteerEngagement: {
        trend: [
          { date: '2024-02-08', value: 90 },
          { date: '2024-02-09', value: 92 },
          { date: '2024-02-10', value: 94 },
          { date: '2024-02-11', value: 96 },
          { date: '2024-02-12', value: 97 },
          { date: '2024-02-13', value: 98 },
          { date: '2024-02-14', value: 98 }
        ],
        growth: '+5.2%',
        target: 100
      },
      eventAttendance: {
        trend: [
          { date: '2024-02-08', value: 82.1 },
          { date: '2024-02-09', value: 83.5 },
          { date: '2024-02-10', value: 84.2 },
          { date: '2024-02-11', value: 84.8 },
          { date: '2024-02-12', value: 85.1 },
          { date: '2024-02-13', value: 85.5 },
          { date: '2024-02-14', value: 85.3 }
        ],
        growth: '+3.1%',
        target: 90.0
      }
    };

    // Filtrar por métrica específica si se solicita
    const filteredData = metric ? { [metric]: analyticsData[metric] } : analyticsData;

    res.json({
      success: true,
      data: filteredData,
      metadata: {
        metric: metric || 'all',
        territoryId: territoryId || 'all',
        period,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo analytics:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/dashboard/reports
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const { type, territoryId, format = 'json' } = req.query;

    // Verificar acceso al territorio si se especifica
    if (territoryId && !hasTerritoryAccess(req.user, territoryId)) {
      return res.status(403).json({ error: 'Acceso denegado a este territorio' });
    }

    // Generar reporte según el tipo
    let reportData = {};

    switch (type) {
      case 'voter_summary':
        reportData = {
          title: 'Resumen de Votantes',
          generatedAt: new Date().toISOString(),
          data: {
            totalVoters: 15420,
            registeredVoters: 12850,
            registrationRate: 83.4,
            supportLevel: 82.3,
            undecided: 12.5,
            opposition: 5.2
          }
        };
        break;

      case 'volunteer_performance':
        reportData = {
          title: 'Rendimiento de Voluntarios',
          generatedAt: new Date().toISOString(),
          data: {
            totalVolunteers: 125,
            activeVolunteers: 98,
            averageHours: 28.5,
            totalContacts: 15420,
            averageContacts: 123.4,
            topPerformers: [
              { name: 'Juan Diego Martínez', contacts: 200, hours: 65 },
              { name: 'Ana María Rodríguez', contacts: 120, hours: 45 },
              { name: 'Laura Sofía Pérez', contacts: 95, hours: 28 }
            ]
          }
        };
        break;

      case 'event_summary':
        reportData = {
          title: 'Resumen de Eventos',
          generatedAt: new Date().toISOString(),
          data: {
            totalEvents: 45,
            completedEvents: 32,
            scheduledEvents: 8,
            cancelledEvents: 5,
            averageAttendance: 85.3,
            totalAttendance: 2730
          }
        };
        break;

      case 'message_campaign':
        reportData = {
          title: 'Campaña de Mensajes',
          generatedAt: new Date().toISOString(),
          data: {
            totalMessages: 125,
            sentMessages: 98,
            deliveredMessages: 93,
            openedMessages: 70,
            deliveryRate: 95.1,
            openRate: 75.3
          }
        };
        break;

      default:
        return res.status(400).json({ error: 'Tipo de reporte inválido' });
    }

    res.json({
      success: true,
      data: reportData,
      metadata: {
        type,
        territoryId: territoryId || 'all',
        format,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Funciones auxiliares
function hasTerritoryAccess(user, territoryId) {
  if (user.role === 'admin') return true;
  if (user.role === 'coordinator') {
    return ['territory-1', 'territory-2', 'territory-3'].includes(territoryId);
  }
  return user.territoryId === territoryId;
}

function getTerritoryName(territoryId) {
  const names = {
    'territory-1': 'Centro Histórico',
    'territory-2': 'Chapinero',
    'territory-3': 'Usaquén',
    'territory-4': 'Suba',
    'territory-5': 'Kennedy'
  };
  return names[territoryId] || 'Territorio Desconocido';
}

function getTerritoryCoordinates(territoryId) {
  const coordinates = {
    'territory-1': { longitude: -74.0721, latitude: 4.7110 },
    'territory-2': { longitude: -74.0521, latitude: 4.6710 },
    'territory-3': { longitude: -74.0321, latitude: 4.7310 },
    'territory-4': { longitude: -74.0921, latitude: 4.7510 },
    'territory-5': { longitude: -74.1121, latitude: 4.6910 }
  };
  return coordinates[territoryId] || { longitude: 0, latitude: 0 };
}

// Funciones para generar datos aleatorios simulados
function getRandomVoters() { return Math.floor(Math.random() * 5000) + 10000; }
function getRandomRegistered() { return Math.floor(Math.random() * 4000) + 8000; }
function getRandomSupport() { return Math.floor(Math.random() * 20) + 75; }
function getRandomVolunteers() { return Math.floor(Math.random() * 20) + 15; }
function getRandomEvents() { return Math.floor(Math.random() * 10) + 5; }
function getRandomPopulation() { return Math.floor(Math.random() * 10000) + 20000; }
function getRandomVotingAge() { return Math.floor(Math.random() * 5000) + 15000; }
function getRandomTurnout() { return Math.floor(Math.random() * 20) + 70; }
function getRandomUndecided() { return Math.floor(Math.random() * 10) + 10; }
function getRandomOpposition() { return Math.floor(Math.random() * 5) + 3; }
function getRandomActiveVolunteers() { return Math.floor(Math.random() * 15) + 10; }
function getRandomCoordinators() { return Math.floor(Math.random() * 3) + 1; }
function getRandomSupervisors() { return Math.floor(Math.random() * 5) + 2; }
function getRandomRegularVolunteers() { return Math.floor(Math.random() * 15) + 8; }
function getRandomCompletedEvents() { return Math.floor(Math.random() * 8) + 3; }
function getRandomScheduledEvents() { return Math.floor(Math.random() * 5) + 2; }
function getRandomCancelledEvents() { return Math.floor(Math.random() * 3) + 1; }
function getRandomAttendance() { return Math.floor(Math.random() * 20) + 80; }
function getRandomMessages() { return Math.floor(Math.random() * 50) + 100; }
function getRandomSentMessages() { return Math.floor(Math.random() * 40) + 80; }
function getRandomDeliveredMessages() { return Math.floor(Math.random() * 35) + 70; }
function getRandomOpenedMessages() { return Math.floor(Math.random() * 25) + 50; }
function getRandomDeliveryRate() { return Math.floor(Math.random() * 10) + 90; }
function getRandomContactRate() { return Math.floor(Math.random() * 20) + 70; }
function getRandomEfficiency() { return Math.floor(Math.random() * 15) + 80; }
function getRandomSuccessRate() { return Math.floor(Math.random() * 10) + 85; }
function getRandomEffectiveness() { return Math.floor(Math.random() * 15) + 75; }

module.exports = router; 