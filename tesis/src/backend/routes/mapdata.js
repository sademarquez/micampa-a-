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

// GET /api/mapdata/territories
router.get('/territories', authenticateToken, async (req, res) => {
  try {
    const { bounds, radius = 10 } = req.query;
    
    // Datos de territorios simulados (en producción vendrían de Redis)
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
          volunteers: 23,
          lastUpdate: new Date().toISOString()
        }
      },
      {
        id: 'territory-2',
        name: 'Chapinero',
        coordinates: { longitude: -74.0521, latitude: 4.6710 },
        data: {
          totalVoters: 12340,
          registeredVoters: 9870,
          supportLevel: 82.3,
          events: 3,
          volunteers: 18,
          lastUpdate: new Date().toISOString()
        }
      },
      {
        id: 'territory-3',
        name: 'Usaquén',
        coordinates: { longitude: -74.0321, latitude: 4.7310 },
        data: {
          totalVoters: 9870,
          registeredVoters: 7650,
          supportLevel: 75.8,
          events: 2,
          volunteers: 12,
          lastUpdate: new Date().toISOString()
        }
      },
      {
        id: 'territory-4',
        name: 'Suba',
        coordinates: { longitude: -74.0921, latitude: 4.7510 },
        data: {
          totalVoters: 18760,
          registeredVoters: 15430,
          supportLevel: 89.2,
          events: 7,
          volunteers: 34,
          lastUpdate: new Date().toISOString()
        }
      },
      {
        id: 'territory-5',
        name: 'Kennedy',
        coordinates: { longitude: -74.1121, latitude: 4.6910 },
        data: {
          totalVoters: 22340,
          registeredVoters: 18920,
          supportLevel: 91.7,
          events: 8,
          volunteers: 45,
          lastUpdate: new Date().toISOString()
        }
      }
    ];

    // Si se especifican bounds, filtrar territorios
    let filteredTerritories = territories;
    if (bounds) {
      const { north, south, east, west } = JSON.parse(bounds);
      filteredTerritories = territories.filter(territory => {
        const { longitude, latitude } = territory.coordinates;
        return longitude >= west && longitude <= east && 
               latitude >= south && latitude <= north;
      });
    }

    // Convertir a formato GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: filteredTerritories.map(territory => ({
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

    res.json({
      success: true,
      data: geoJson,
      metadata: {
        totalTerritories: filteredTerritories.length,
        bounds: bounds ? JSON.parse(bounds) : null,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo datos de territorios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mapdata/nearby
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const { longitude, latitude, radius = 10, unit = 'km' } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'longitude y latitude son requeridos' });
    }

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
        count: nearbyTerritories.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo territorios cercanos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/mapdata/territory
router.post('/territory', authenticateToken, async (req, res) => {
  try {
    const { id, name, longitude, latitude, data } = req.body;

    if (!id || !name || !longitude || !latitude) {
      return res.status(400).json({ error: 'id, name, longitude y latitude son requeridos' });
    }

    // Agregar territorio a Redis
    await redis.addLocation(id, parseFloat(longitude), parseFloat(latitude), {
      name,
      ...data,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString()
    });

    // Registrar evento
    await redis.setKPI('system', 'territory_created', {
      territoryId: id,
      createdBy: req.user.userId,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Territorio creado exitosamente',
      data: { id, name, longitude, latitude }
    });

  } catch (error) {
    console.error('Error creando territorio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mapdata/voters
router.get('/voters', authenticateToken, async (req, res) => {
  try {
    const { territoryId, bounds } = req.query;

    // Datos de votantes simulados
    const voters = [
      {
        id: 'voter-1',
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        phone: '+573001234567',
        coordinates: { longitude: -74.0721, latitude: 4.7110 },
        territoryId: 'territory-1',
        status: 'registered',
        lastContact: '2024-01-15T10:30:00Z'
      },
      {
        id: 'voter-2',
        name: 'María García',
        email: 'maria.garcia@email.com',
        phone: '+573001234568',
        coordinates: { longitude: -74.0521, latitude: 4.6710 },
        territoryId: 'territory-2',
        status: 'pending',
        lastContact: '2024-01-14T15:45:00Z'
      },
      {
        id: 'voter-3',
        name: 'Carlos López',
        email: 'carlos.lopez@email.com',
        phone: '+573001234569',
        coordinates: { longitude: -74.0321, latitude: 4.7310 },
        territoryId: 'territory-3',
        status: 'registered',
        lastContact: '2024-01-13T09:15:00Z'
      }
    ];

    let filteredVoters = voters;

    // Filtrar por territorio
    if (territoryId) {
      filteredVoters = voters.filter(voter => voter.territoryId === territoryId);
    }

    // Filtrar por bounds
    if (bounds) {
      const { north, south, east, west } = JSON.parse(bounds);
      filteredVoters = filteredVoters.filter(voter => {
        const { longitude, latitude } = voter.coordinates;
        return longitude >= west && longitude <= east && 
               latitude >= south && latitude <= north;
      });
    }

    // Convertir a GeoJSON
    const geoJson = {
      type: 'FeatureCollection',
      features: filteredVoters.map(voter => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [voter.coordinates.longitude, voter.coordinates.latitude]
        },
        properties: {
          id: voter.id,
          name: voter.name,
          email: voter.email,
          phone: voter.phone,
          territoryId: voter.territoryId,
          status: voter.status,
          lastContact: voter.lastContact
        }
      }))
    };

    res.json({
      success: true,
      data: geoJson,
      metadata: {
        totalVoters: filteredVoters.length,
        territoryId: territoryId || 'all',
        bounds: bounds ? JSON.parse(bounds) : null,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo datos de votantes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/mapdata/analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { territoryId } = req.query;

    // Análisis geoespacial simulado
    const analytics = {
      totalTerritories: 45,
      totalVoters: 15420,
      averageSupportLevel: 82.3,
      coveragePercentage: 78.5,
      hotSpots: [
        { longitude: -74.0721, latitude: 4.7110, intensity: 0.9, name: 'Centro Histórico' },
        { longitude: -74.1121, latitude: 4.6910, intensity: 0.8, name: 'Kennedy' },
        { longitude: -74.0921, latitude: 4.7510, intensity: 0.7, name: 'Suba' }
      ],
      coldSpots: [
        { longitude: -74.0321, latitude: 4.7310, intensity: 0.3, name: 'Usaquén' },
        { longitude: -74.0521, latitude: 4.6710, intensity: 0.4, name: 'Chapinero' }
      ],
      territoryBreakdown: territoryId ? {
        territoryId,
        totalVoters: 15420,
        registeredVoters: 12850,
        supportLevel: 78.5,
        events: 5,
        volunteers: 23,
        lastUpdate: new Date().toISOString()
      } : null
    };

    res.json({
      success: true,
      data: analytics,
      metadata: {
        territoryId: territoryId || 'all',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error obteniendo análisis geoespacial:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 