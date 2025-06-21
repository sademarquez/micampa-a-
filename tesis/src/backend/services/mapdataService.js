const redis = require('../config/redis');

class MapdataService {
  async addTerritory(territory) {
    await redis.addLocation(territory.id, territory.longitude, territory.latitude, territory.data);
  }

  async getNearbyTerritories(longitude, latitude, radius, unit) {
    return await redis.getNearbyTerritories(longitude, latitude, radius, unit);
  }

  async getTerritories() {
    // Simulación: obtener todos los territorios
    // En producción, usar Redis GEO y hash
    return [];
  }

  async getVoters(filters) {
    // Simulación: obtener votantes
    return [];
  }

  async getAnalytics(filters) {
    return await redis.getEventAnalytics(filters); // O crear método específico
  }
}

module.exports = new MapdataService(); 