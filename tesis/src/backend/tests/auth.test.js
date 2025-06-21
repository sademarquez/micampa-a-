const request = require('supertest');
const app = require('../server');
const redis = require('../config/redis');

describe('Autenticación', () => {
  beforeEach(async () => {
    // Limpiar datos de prueba
    await redis.client.flushAll();
  });

  describe('POST /api/auth/register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test',
        role: 'volunteer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('debe rechazar registro con email duplicado', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test'
      };

      // Primer registro
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Segundo registro con mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('El email ya está registrado');
    });

    it('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('email, password y name son requeridos');
    });

    it('debe validar formato de email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Usuario Test'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Formato de email inválido');
    });

    it('debe validar longitud de password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        name: 'Usuario Test'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    it('debe validar roles permitidos', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test',
        role: 'invalid_role'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Rol inválido');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('debe hacer login exitosamente con credenciales válidas', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('debe rechazar login con credenciales inválidas', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('debe rechazar login con email inexistente', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Credenciales inválidas');
    });

    it('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('email y password son requeridos');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      // Crear usuario y obtener refresh token
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      refreshToken = registerResponse.body.data.refreshToken;
    });

    it('debe renovar access token con refresh token válido', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('debe rechazar refresh token inválido', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.error).toBe('Refresh token inválido');
    });

    it('debe validar refresh token requerido', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Refresh token requerido');
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken;

    beforeEach(async () => {
      // Crear usuario y obtener token
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = registerResponse.body.data.accessToken;
    });

    it('debe hacer logout exitosamente', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken: 'test-refresh-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout exitoso');
    });

    it('debe hacer logout sin refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/auth/profile', () => {
    let accessToken;

    beforeEach(async () => {
      // Crear usuario y obtener token
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test',
        role: 'volunteer'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = registerResponse.body.data.accessToken;
    });

    it('debe obtener perfil de usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.name).toBe('Usuario Test');
      expect(response.body.data.role).toBe('volunteer');
      expect(response.body.data.password).toBeUndefined(); // No debe incluir password
    });

    it('debe rechazar acceso sin token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.error).toBe('Token de acceso requerido');
    });

    it('debe rechazar token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.error).toBe('Token inválido o expirado');
    });
  });

  describe('PUT /api/auth/profile', () => {
    let accessToken;

    beforeEach(async () => {
      // Crear usuario y obtener token
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = registerResponse.body.data.accessToken;
    });

    it('debe actualizar perfil exitosamente', async () => {
      const updateData = {
        name: 'Usuario Actualizado',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
    });

    it('debe validar email único al actualizar', async () => {
      // Crear segundo usuario
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'other@example.com',
          password: 'password123',
          name: 'Otro Usuario'
        });

      // Intentar actualizar con email existente
      const updateData = {
        email: 'other@example.com'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.error).toBe('El email ya está en uso');
    });
  });

  describe('POST /api/auth/change-password', () => {
    let accessToken;

    beforeEach(async () => {
      // Crear usuario y obtener token
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      accessToken = registerResponse.body.data.accessToken;
    });

    it('debe cambiar contraseña exitosamente', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Contraseña cambiada exitosamente');
    });

    it('debe validar contraseña actual', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.error).toBe('Contraseña actual incorrecta');
    });

    it('debe validar longitud de nueva contraseña', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: '123'
      };

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.error).toBe('La nueva contraseña debe tener al menos 6 caracteres');
    });

    it('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toContain('currentPassword y newPassword son requeridos');
    });
  });

  describe('GET /api/auth/users (solo admin)', () => {
    let adminToken;
    let regularToken;

    beforeEach(async () => {
      // Crear usuario admin
      const adminData = {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin Test',
        role: 'admin'
      };

      const adminResponse = await request(app)
        .post('/api/auth/register')
        .send(adminData);

      adminToken = adminResponse.body.data.accessToken;

      // Crear usuario regular
      const regularData = {
        email: 'user@example.com',
        password: 'password123',
        name: 'User Test',
        role: 'volunteer'
      };

      const regularResponse = await request(app)
        .post('/api/auth/register')
        .send(regularData);

      regularToken = regularResponse.body.data.accessToken;
    });

    it('debe permitir acceso a admin', async () => {
      const response = await request(app)
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('debe rechazar acceso a usuario regular', async () => {
      const response = await request(app)
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(response.body.error).toContain('Acceso denegado');
    });

    it('debe filtrar usuarios por rol', async () => {
      const response = await request(app)
        .get('/api/auth/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].role).toBe('admin');
    });

    it('debe aplicar paginación', async () => {
      const response = await request(app)
        .get('/api/auth/users?limit=1&offset=0')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.metadata.hasMore).toBe(true);
    });
  });
}); 