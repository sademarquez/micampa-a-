const redis = require('../config/redis');

class MessagesService {
  async createMessage(message) {
    await redis.setMessage(message.id, message);
  }

  async getMessage(messageId) {
    return await redis.getMessage(messageId);
  }

  async updateMessage(messageId, data) {
    await redis.setMessage(messageId, data);
  }

  async listMessages(filters) {
    return await redis.getMessages(filters);
  }

  async createTemplate(template) {
    await redis.setMessageTemplate(template.id, template);
  }

  async getTemplates(filters) {
    return await redis.getMessageTemplates(filters);
  }

  async getMessageStats(messageId) {
    return await redis.getMessageStats(messageId);
  }

  async getAnalytics(filters) {
    return await redis.getMessageAnalytics(filters);
  }
}

module.exports = new MessagesService(); 