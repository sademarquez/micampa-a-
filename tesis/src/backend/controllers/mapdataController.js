const redis = require('../config/redis');
const { validateMapDataRequest } = require('../utils/validators');

class MapDataController {
  async list(req, res) {
    try {
      const { territoryId, type, page = 1, limit = 10 } = req.query;
      const cacheKey = `mapdata:list:${territoryId || 'all'}:${type || 'all'}:${page}:${limit}`;
      let data = await redis.get(cacheKey);
      if (!data) {
        // Simular datos geoespaciales
        const mapdata = [
          {
            id: 1,
            name: 'Centro',
            type: 'territory',
            coordinates: [
              [-58.3816, -34.6037],
              [-58.3820, -34.6040],
              [-58.3812, -34.6045]
            ],
            voters: 3200,
            events: 3,
            volunteers: 8
          },
          {
            id: 2,
            name: 'Norte',
            type: 'territory',
            coordinates: [
              [-58.3700, -34.5900],
              [-58.3710, -34.5910],
              [-58.3720, -34.5920]
            ],
            voters: 2800,
            events: 2,
            volunteers: 7
          },
          {
            id: 3,
            name: 'Sur',
            type: 'territory',
            coordinates: [
              [-58.4000, -34.6200],
              [-58.4010, -34.6210],
              [-58.4020, -34.6220]
            ],
            voters: 2400,
            events: 2,
            volunteers: 6
          }
        ];
        let filtered = mapdata;
        if (territoryId) filtered = filtered.filter(m => m.id == territoryId);
        if (type) filtered = filtered.filter(m => m.type === type);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginated = filtered.slice(startIndex, endIndex);
        data = {
          mapdata: paginated,
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
      console.error('Error en listar datos geoespaciales:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async get(req, res) {
    try {
      const { mapdataId } = req.params;
      const cacheKey = `mapdata:${mapdataId}`;
      let data = await redis.get(cacheKey);
      if (!data) {
        data = {
          id: mapdataId,
          name: 'Centro',
          type: 'territory',
          coordinates: [
            [-58.3816, -34.6037],
            [-58.3820, -34.6040],
            [-58.3812, -34.6045]
          ],
          voters: 3200,
          events: 3,
          volunteers: 8,
          geojson: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-58.3816, -34.6037],
                [-58.3820, -34.6040],
                [-58.3812, -34.6045],
                [-58.3816, -34.6037]
              ]]
            },
            properties: {
              name: 'Centro',
              voters: 3200
            }
          }
        };
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en obtener dato geoespacial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async create(req, res) {
    try {
      const mapData = req.body;
      if (!validateMapDataRequest(mapData)) {
        return res.status(400).json({ error: 'Datos geoespaciales inválidos' });
      }
      const newMapData = {
        id: Date.now(),
        ...mapData,
        createdAt: new Date().toISOString()
      };
      await redis.del('mapdata:list:*');
      res.status(201).json({ success: true, data: newMapData, message: 'Dato geoespacial creado exitosamente' });
    } catch (error) {
      console.error('Error en crear dato geoespacial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async update(req, res) {
    try {
      const { mapdataId } = req.params;
      const updateData = req.body;
      const updatedMapData = {
        id: mapdataId,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      await redis.del(`mapdata:${mapdataId}`);
      await redis.del('mapdata:list:*');
      res.json({ success: true, data: updatedMapData, message: 'Dato geoespacial actualizado exitosamente' });
    } catch (error) {
      console.error('Error en actualizar dato geoespacial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async remove(req, res) {
    try {
      const { mapdataId } = req.params;
      await redis.del(`mapdata:${mapdataId}`);
      await redis.del('mapdata:list:*');
      res.json({ success: true, message: 'Dato geoespacial eliminado exitosamente' });
    } catch (error) {
      console.error('Error en eliminar dato geoespacial:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async analytics(req, res) {
    try {
      const { territoryId, period } = req.query;
      const cacheKey = `mapdata:analytics:${territoryId || 'global'}:${period || 'month'}`;
      let data = await redis.get(cacheKey);
      if (!data) {
        data = {
          totalTerritories: 12,
          totalVoters: 15420,
          averageVotersPerTerritory: 1285,
          topTerritories: [
            { name: 'Centro', voters: 3200 },
            { name: 'Norte', voters: 2800 },
            { name: 'Sur', voters: 2400 }
          ],
          trends: {
            daily: [120, 135, 110, 145, 160, 140, 175],
            weekly: [850, 920, 880, 1000, 950, 1050, 1150],
            monthly: [3200, 3800, 4200, 4800, 5200, 5800, 6500]
          },
          territoryPerformance: [
            { territory: 'Centro', voters: 3200 },
            { territory: 'Norte', voters: 2800 },
            { territory: 'Sur', voters: 2400 }
          ]
        };
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }
      res.json({ success: true, data, metadata: { territoryId: territoryId || 'global', period: period || 'month', timestamp: new Date().toISOString() } });
    } catch (error) {
      console.error('Error en analytics de datos geoespaciales:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new MapDataController(); 