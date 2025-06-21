const redis = require('../config/redis');
const { validateTerritoryId, validateDateRange } = require('../utils/validators');

class DashboardController {
  async overview(req, res) {
    try {
      const { territoryId, startDate, endDate } = req.query;
      
      // Validar parámetros
      if (territoryId && !validateTerritoryId(territoryId)) {
        return res.status(400).json({ error: 'ID de territorio inválido' });
      }
      
      if (startDate && endDate && !validateDateRange(startDate, endDate)) {
        return res.status(400).json({ error: 'Rango de fechas inválido' });
      }

      // Obtener datos del cache o calcular
      const cacheKey = `dashboard:overview:${territoryId || 'global'}:${startDate || 'all'}:${endDate || 'all'}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        // Simular datos del dashboard
        data = {
          totalVoters: 15420,
          registeredVoters: 12850,
          participationRate: 83.4,
          territories: 12,
          activeVolunteers: 45,
          pendingTasks: 23,
          recentEvents: 8,
          messagesSent: 1250,
          conversionRate: 76.2,
          topTerritories: [
            { id: 1, name: 'Centro', voters: 3200, participation: 89.1 },
            { id: 2, name: 'Norte', voters: 2800, participation: 85.3 },
            { id: 3, name: 'Sur', voters: 2400, participation: 82.7 }
          ],
          trends: {
            daily: [65, 72, 68, 75, 80, 78, 85],
            weekly: [420, 450, 480, 520, 490, 530, 580],
            monthly: [1800, 2100, 2400, 2800, 3200, 3500, 3800]
          }
        };
        
        // Cache por 5 minutos
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ 
        success: true, 
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          territoryId: territoryId || 'global',
          dateRange: { startDate, endDate }
        }
      });
    } catch (error) {
      console.error('Error en dashboard overview:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async territory(req, res) {
    try {
      const { territoryId } = req.params;
      
      if (!validateTerritoryId(territoryId)) {
        return res.status(400).json({ error: 'ID de territorio inválido' });
      }

      const cacheKey = `dashboard:territory:${territoryId}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        data = {
          id: territoryId,
          name: `Territorio ${territoryId}`,
          totalVoters: 3200,
          registeredVoters: 2850,
          participationRate: 89.1,
          volunteers: 8,
          events: 3,
          messages: 450,
          conversionRate: 82.3,
          demographics: {
            ageGroups: {
              '18-25': 15.2,
              '26-35': 28.4,
              '36-45': 32.1,
              '46-55': 18.7,
              '55+': 5.6
            },
            gender: {
              male: 48.3,
              female: 51.7
            }
          },
          performance: {
            daily: [45, 52, 48, 55, 60, 58, 65],
            weekly: [320, 350, 380, 420, 390, 430, 480],
            monthly: [1200, 1400, 1600, 1800, 2000, 2200, 2400]
          }
        };
        
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error en dashboard territory:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async analytics(req, res) {
    try {
      const { metric, period, territoryId } = req.query;
      
      const cacheKey = `dashboard:analytics:${metric}:${period}:${territoryId || 'global'}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        const analyticsData = {
          voterRegistration: {
            daily: [120, 135, 110, 145, 160, 140, 175],
            weekly: [850, 920, 880, 1000, 950, 1050, 1150],
            monthly: [3200, 3800, 4200, 4800, 5200, 5800, 6500]
          },
          participation: {
            daily: [65, 72, 68, 75, 80, 78, 85],
            weekly: [420, 450, 480, 520, 490, 530, 580],
            monthly: [1800, 2100, 2400, 2800, 3200, 3500, 3800]
          },
          conversion: {
            daily: [72, 78, 75, 82, 85, 83, 88],
            weekly: [480, 520, 550, 580, 560, 600, 620],
            monthly: [2100, 2400, 2700, 3000, 3300, 3600, 3900]
          }
        };
        
        data = analyticsData[metric] || analyticsData.participation;
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ 
        success: true, 
        data,
        metadata: {
          metric,
          period,
          territoryId: territoryId || 'global',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en dashboard analytics:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async reports(req, res) {
    try {
      const { type, territoryId, startDate, endDate } = req.query;
      
      const cacheKey = `dashboard:reports:${type}:${territoryId || 'global'}:${startDate || 'all'}:${endDate || 'all'}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        const reports = {
          performance: {
            summary: {
              totalVoters: 15420,
              participationRate: 83.4,
              conversionRate: 76.2,
              territories: 12,
              volunteers: 45
            },
            details: [
              { territory: 'Centro', voters: 3200, participation: 89.1, conversion: 82.3 },
              { territory: 'Norte', voters: 2800, participation: 85.3, conversion: 78.9 },
              { territory: 'Sur', voters: 2400, participation: 82.7, conversion: 75.6 }
            ]
          },
          volunteers: {
            summary: {
              total: 45,
              active: 38,
              inactive: 7,
              averagePerformance: 85.2
            },
            details: [
              { name: 'Juan Pérez', territory: 'Centro', performance: 92.1, tasks: 15 },
              { name: 'María García', territory: 'Norte', performance: 88.7, tasks: 12 },
              { name: 'Carlos López', territory: 'Sur', performance: 85.4, tasks: 18 }
            ]
          },
          events: {
            summary: {
              total: 8,
              completed: 6,
              pending: 2,
              averageAttendance: 85.3
            },
            details: [
              { name: 'Reunión Centro', date: '2024-01-15', attendance: 120, territory: 'Centro' },
              { name: 'Evento Norte', date: '2024-01-18', attendance: 95, territory: 'Norte' },
              { name: 'Encuentro Sur', date: '2024-01-20', attendance: 110, territory: 'Sur' }
            ]
          }
        };
        
        data = reports[type] || reports.performance;
        await redis.setex(cacheKey, 300, JSON.stringify(data));
      } else {
        data = JSON.parse(data);
      }

      res.json({ 
        success: true, 
        data,
        metadata: {
          type,
          territoryId: territoryId || 'global',
          dateRange: { startDate, endDate },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en dashboard reports:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async kpis(req, res) {
    try {
      const { territoryId } = req.query;
      
      const cacheKey = `dashboard:kpis:${territoryId || 'global'}`;
      let data = await redis.get(cacheKey);
      
      if (!data) {
        data = {
          voterRegistration: {
            current: 15420,
            target: 20000,
            percentage: 77.1,
            trend: 'up',
            change: 5.2
          },
          participation: {
            current: 83.4,
            target: 90.0,
            percentage: 92.7,
            trend: 'up',
            change: 2.1
          },
          conversion: {
            current: 76.2,
            target: 80.0,
            percentage: 95.3,
            trend: 'up',
            change: 3.8
          },
          volunteers: {
            current: 45,
            target: 60,
            percentage: 75.0,
            trend: 'up',
            change: 8.5
          },
          events: {
            current: 8,
            target: 15,
            percentage: 53.3,
            trend: 'up',
            change: 12.5
          }
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
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en dashboard KPIs:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new DashboardController(); 