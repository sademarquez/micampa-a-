const redis = require('../config/redis');

class VolunteersService {
  async createVolunteer(volunteer) {
    await redis.setVolunteer(volunteer.id, volunteer);
    await redis.addVolunteerToTerritory(volunteer.territoryId, volunteer.id);
  }

  async getVolunteer(volunteerId) {
    return await redis.getVolunteer(volunteerId);
  }

  async updateVolunteer(volunteerId, data) {
    await redis.setVolunteer(volunteerId, data);
  }

  async listVolunteers(filters) {
    return await redis.getVolunteers(filters);
  }

  async addActivity(volunteerId, activity) {
    await redis.addVolunteerActivity(volunteerId, activity);
  }

  async getActivities(volunteerId) {
    return await redis.getVolunteerActivities(volunteerId);
  }

  async getAnalytics(filters) {
    return await redis.getVolunteerAnalytics(filters);
  }
}

module.exports = new VolunteersService(); 