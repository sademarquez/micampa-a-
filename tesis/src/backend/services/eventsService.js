const redis = require('../config/redis');

class EventsService {
  async createEvent(event) {
    await redis.setEvent(event.id, event);
    await redis.addEventToTerritory(event.territoryId, event.id);
  }

  async getEvent(eventId) {
    return await redis.getEvent(eventId);
  }

  async updateEvent(eventId, data) {
    await redis.setEvent(eventId, data);
  }

  async deleteEvent(eventId, territoryId) {
    await redis.deleteEvent(eventId);
    await redis.removeEventFromTerritory(territoryId, eventId);
  }

  async listEvents(filters) {
    return await redis.getEvents(filters);
  }

  async setEventStatus(eventId, status) {
    const event = await redis.getEvent(eventId);
    if (event) {
      event.status = status;
      event.updatedAt = new Date().toISOString();
      await redis.setEvent(eventId, event);
    }
    return event;
  }

  async getAnalytics(filters) {
    return await redis.getEventAnalytics(filters);
  }
}

module.exports = new EventsService(); 