const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const redis = require('../config/redis');

const router = express.Router();

// Esquema de validación para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Credenciales de prueba (en producción usar base de datos)
const users = [
  {
    id: '1',
    email: 'admin@agora.com',
    password: '$2a$10$rQZ8KjX9mN2vB3cL5hF7gT8uI9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL',
    role: 'admin',
    name: 'Administrador Agora'
  },
  {
    id: '2',
    email: 'estratega@agora.com',
    password: '$2a$10$rQZ8KjX9mN2vB3cL5hF7gT8uI9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL',
    role: 'estratega',
    name: 'Estratega Principal'
  },
  {
    id: '3',
    email: 'lider@agora.com',
    password: '$2a$10$rQZ8KjX9mN2vB3cL5hF7gT8uI9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL',
    role: 'lider',
    name: 'Líder Territorial'
  },
  {
    id: '4',
    email: 'candidato@agora.com',
    password: '$2a$10$rQZ8KjX9mN2vB3cL5hF7gT8uI9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL',
    role: 'candidato',
    name: 'Candidato'
  }
];

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

// Middleware para verificar roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: permisos insuficientes' });
    }

    next();
  };
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'volunteer' } = req.body;

    // Validar campos requeridos
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'email, password y name son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Validar longitud de password
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Validar roles permitidos
    const allowedRoles = ['admin', 'coordinator', 'supervisor', 'volunteer'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await redis.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Generar ID único
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Encriptar password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0
    };

    // Guardar usuario en Redis
    await redis.setUser(userId, user);

    // Generar tokens
    const accessToken = jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET || 'agora-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId, email },
      process.env.JWT_REFRESH_SECRET || 'agora-refresh-secret',
      { expiresIn: '7d' }
    );

    // Guardar refresh token
    await redis.set(`refresh_token:${userId}`, refreshToken, { EX: 7 * 24 * 60 * 60 }); // 7 días

    // Registrar KPI
    await redis.setKPI('auth', 'user_registered', {
      userId,
      role,
      timestamp: new Date().toISOString()
    });

    // Enviar a cola de n8n para automatización
    await redis.addToQueue('n8n_auth', {
      action: 'user_registered',
      user: { ...user, password: undefined }, // No enviar password
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'email y password son requeridos' 
      });
    }

    // Buscar usuario por email
    const user = await redis.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar status del usuario
    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Cuenta deshabilitada' });
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'agora-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET || 'agora-refresh-secret',
      { expiresIn: '7d' }
    );

    // Actualizar información de login
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1
    };

    await redis.setUser(user.id, updatedUser);

    // Guardar refresh token
    await redis.set(`refresh_token:${user.id}`, refreshToken, { EX: 7 * 24 * 60 * 60 });

    // Registrar KPI
    await redis.setKPI('auth', 'user_login', {
      userId: user.id,
      role: user.role,
      timestamp: new Date().toISOString()
    });

    // Enviar a cola de n8n
    await redis.addToQueue('n8n_auth', {
      action: 'user_login',
      userId: user.id,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          lastLogin: updatedUser.lastLogin
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requerido' });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'agora-refresh-secret');
    
    // Verificar si el token existe en Redis
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    // Obtener usuario
    const user = await redis.getUser(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'agora-secret',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    console.error('Error renovando token:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Invalidar refresh token
    if (refreshToken) {
      await redis.del(`refresh_token:${req.user.userId}`);
    }

    // Registrar logout
    await redis.setKPI('auth', 'user_logout', {
      userId: req.user.userId,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await redis.getUser(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No enviar password
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await redis.getUser(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Validar email único si se está cambiando
    if (email && email !== user.email) {
      const existingUser = await redis.getUserByEmail(email);
      if (existingUser && existingUser.id !== req.user.userId) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    // Actualizar usuario
    const updatedUser = {
      ...user,
      name: name || user.name,
      email: email || user.email,
      updatedAt: new Date().toISOString()
    };

    await redis.setUser(req.user.userId, updatedUser);

    // No enviar password
    const { password, ...userProfile } = updatedUser;

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: userProfile
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'currentPassword y newPassword son requeridos' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const user = await redis.getUser(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar password actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    // Encriptar nueva password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar password
    const updatedUser = {
      ...user,
      password: hashedNewPassword,
      updatedAt: new Date().toISOString()
    };

    await redis.setUser(req.user.userId, updatedUser);

    // Invalidar todos los refresh tokens
    await redis.del(`refresh_token:${req.user.userId}`);

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/users (solo admin)
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role, status, limit = 50, offset = 0 } = req.query;

    const users = await redis.getAllUsers();
    let filteredUsers = users;

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Aplicar paginación
    const paginatedUsers = filteredUsers.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    // No enviar passwords
    const safeUsers = paginatedUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.json({
      success: true,
      data: safeUsers,
      metadata: {
        total: filteredUsers.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < filteredUsers.length,
        filters: { role, status }
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/auth/users/:id/status (solo admin)
router.put('/users/:id/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const user = await redis.getUser(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updatedUser = {
      ...user,
      status,
      updatedAt: new Date().toISOString()
    };

    await redis.setUser(id, updatedUser);

    // Si se suspende, invalidar tokens
    if (status === 'suspended') {
      await redis.del(`refresh_token:${id}`);
    }

    // Registrar KPI
    await redis.setKPI('auth', 'user_status_changed', {
      userId: id,
      oldStatus: user.status,
      newStatus: status,
      changedBy: req.user.userId,
      timestamp: new Date().toISOString()
    });

    const { password, ...safeUser } = updatedUser;

    res.json({
      success: true,
      message: 'Status de usuario actualizado exitosamente',
      data: safeUser
    });

  } catch (error) {
    console.error('Error actualizando status de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 