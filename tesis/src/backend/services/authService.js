const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');

class AuthService {
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'agora-secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'agora-refresh-secret', {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
  }

  async storeRefreshToken(userId, refreshToken) {
    await redis.set(`refresh_token:${userId}`, refreshToken, { EX: 7 * 24 * 60 * 60 });
  }

  async getRefreshToken(userId) {
    return await redis.get(`refresh_token:${userId}`);
  }

  async invalidateRefreshToken(userId) {
    await redis.del(`refresh_token:${userId}`);
  }

  async getUserByEmail(email) {
    return await redis.getUserByEmail(email);
  }

  async getUserById(userId) {
    return await redis.getUser(userId);
  }

  async createUser(user) {
    await redis.setUser(user.id, user);
  }

  async updateUser(userId, data) {
    await redis.setUser(userId, data);
  }
}

module.exports = new AuthService(); 