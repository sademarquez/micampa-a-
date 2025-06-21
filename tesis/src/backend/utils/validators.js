function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { isValid: true };
}

function validateUserData({ email, password, name, role }) {
  const errors = [];
  if (!email || !validateEmail(email)) errors.push('Formato de email inválido');
  if (!password || password.length < 6) errors.push('La contraseña debe tener al menos 6 caracteres');
  if (!name || name.length < 2) errors.push('El nombre es requerido');
  if (role && !['admin', 'coordinator', 'supervisor', 'volunteer'].includes(role)) errors.push('Rol inválido');
  return errors;
}

function validateEventData(data) {
  const errors = [];
  if (!data.title || data.title.length < 3) errors.push('El título debe tener al menos 3 caracteres');
  if (!data.type) errors.push('El tipo de evento es requerido');
  if (!data.territoryId) errors.push('El territorio es requerido');
  if (!data.startDate) errors.push('La fecha de inicio es requerida');
  if (!data.endDate) errors.push('La fecha de fin es requerida');
  return errors;
}

function validateMessageData(data) {
  const errors = [];
  if (!data.title) errors.push('El título es requerido');
  if (!data.content) errors.push('El contenido es requerido');
  if (!data.type || !['sms', 'email', 'whatsapp'].includes(data.type)) errors.push('Tipo de mensaje inválido');
  if (!data.territoryId) errors.push('El territorio es requerido');
  return errors;
}

function validateVolunteerData(data) {
  const errors = [];
  if (!data.name) errors.push('El nombre es requerido');
  if (!data.email || !validateEmail(data.email)) errors.push('Email inválido');
  if (!data.phone) errors.push('El teléfono es requerido');
  if (!data.role) errors.push('El rol es requerido');
  if (!data.territoryId) errors.push('El territorio es requerido');
  return errors;
}

function validateTerritoryData(data) {
  const errors = [];
  if (!data.id) errors.push('El ID es requerido');
  if (!data.name) errors.push('El nombre es requerido');
  if (typeof data.longitude !== 'number' || typeof data.latitude !== 'number') errors.push('Coordenadas inválidas');
  return errors;
}

// Funciones de validación adicionales para los controladores
function validateTerritoryId(territoryId) {
  return territoryId && !isNaN(territoryId) && territoryId > 0;
}

function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
}

function validateEventId(eventId) {
  return eventId && !isNaN(eventId) && eventId > 0;
}

function validateMessageId(messageId) {
  return messageId && !isNaN(messageId) && messageId > 0;
}

function validateVolunteerId(volunteerId) {
  return volunteerId && !isNaN(volunteerId) && volunteerId > 0;
}

function validateMapDataRequest(data) {
  const errors = [];
  if (!data.name) errors.push('El nombre es requerido');
  if (!data.type) errors.push('El tipo es requerido');
  if (!data.coordinates || !Array.isArray(data.coordinates)) errors.push('Las coordenadas son requeridas');
  return errors.length === 0;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUserData,
  validateEventData,
  validateMessageData,
  validateVolunteerData,
  validateTerritoryData,
  validateTerritoryId,
  validateDateRange,
  validateEventId,
  validateMessageId,
  validateVolunteerId,
  validateMapDataRequest
}; 