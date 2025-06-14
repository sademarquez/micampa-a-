
import { API_ENDPOINTS, POINTS_SYSTEM } from '../constants';
import { User, Alert, CampaignStats, UserRole, AlertType, AlertStatus, NewsItem, AuthenticatedUser } from '../types';

// Simulación de la base de datos en memoria (para pruebas sin backend real)
let mockUsers: User[] = [
  { userID: 'admin1', nombreCompleto: 'Admin General', telefono: '3001234567', email: 'admin@campana.com', municipio: 'Bogotá', barrioVereda: 'Chapinero', rol: UserRole.ADMINISTRADOR, puntosCompromiso: 100, fechaRegistro: new Date().toISOString() },
  { userID: 'lider1', nombreCompleto: 'Líder Ana Pérez', telefono: '3011234568', email: 'lider.ana@campana.com', municipio: 'Cali', barrioVereda: 'San Fernando', rol: UserRole.LIDER_MUNICIPAL, puntosCompromiso: 50, fechaRegistro: new Date().toISOString() },
  { userID: 'simpatizante1', nombreCompleto: 'Carlos Ruiz', telefono: '3021234569', email: 'carlos.ruiz@example.com', municipio: 'Medellín', barrioVereda: 'Poblado', rol: UserRole.SIMPATIZANTE, puntosCompromiso: 5, fechaRegistro: new Date().toISOString(), liderReferenteID: 'lider1' },
];

let mockAlerts: Alert[] = [
  { alertaID: 'alert1', tipoAlerta: AlertType.FALLA_SERVICIO, descripcion: 'Fuga de agua en la calle principal', latitud: 3.43722, longitud: -76.5225, reportadoPorUserID: 'lider1', estado: AlertStatus.ABIERTA, fechaReporte: new Date().toISOString(), nombreReportador: 'Líder Ana Pérez', urlMedia: 'https://picsum.photos/300/200' },
  { alertaID: 'alert2', tipoAlerta: AlertType.PROBLEMA_SEGURIDAD, descripcion: 'Alumbrado público dañado, zona oscura.', latitud: 3.44000, longitud: -76.5300, reportadoPorUserID: 'lider1', estado: AlertStatus.EN_PROCESO, fechaReporte: new Date().toISOString(), nombreReportador: 'Líder Ana Pérez' },
];

let mockNews: NewsItem[] = [
    { id: 'news1', titulo: 'Ximena López Yule Lanza Iniciativa Comunitaria', resumen: 'La candidata presentó hoy su nuevo programa de apoyo a las comunidades vulnerables del Pacífico.', fecha: new Date(Date.now() - 86400000).toISOString(), imagenUrl: 'https://picsum.photos/seed/news1/400/200' },
    { id: 'news2', titulo: 'Foro de Desarrollo Social: Un Éxito Total', resumen: 'Más de 500 personas asistieron al foro organizado por la campaña, discutiendo soluciones para la región.', fecha: new Date(Date.now() - 2*86400000).toISOString(), imagenUrl: 'https://picsum.photos/seed/news2/400/200' },
    { id: 'news3', titulo: 'Próximo Evento: Encuentro con Líderes Barriales', resumen: 'Este sábado, Ximena se reunirá con líderes de varios barrios para coordinar esfuerzos.', fecha: new Date().toISOString(), enlace: '#' },
];


const simulateApiCall = <T,>(data: T, delay = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// En una app real, usarías fetch o axios para llamar a API_ENDPOINTS.variable
// y el backend (Netlify Function) interactuaría con Google Sheets.

export const getCampaignStats = async (): Promise<CampaignStats> => {
  console.log(`Llamando a mock ${API_ENDPOINTS.GET_CAMPAIGN_STATS}`);
  const stats: CampaignStats = {
    numeroMiembros: mockUsers.length,
    numeroAlertasAtendidas: mockAlerts.filter(a => a.estado === AlertStatus.RESUELTA).length,
  };
  return simulateApiCall(stats);
};

export const registerUser = async (userData: Omit<User, 'userID' | 'rol' | 'puntosCompromiso' | 'fechaRegistro'>): Promise<User> => {
  console.log(`Llamando a mock ${API_ENDPOINTS.REGISTER_CAMPAIGN_USER}`, userData);
  const newUser: User = {
    ...userData,
    userID: `user${Date.now()}`, // Simular ID de Netlify Identity
    rol: UserRole.SIMPATIZANTE, // Default role for new registrations via this function
    puntosCompromiso: POINTS_SYSTEM.REGISTER,
    fechaRegistro: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  if (userData.liderReferenteID) {
    const lider = mockUsers.find(u => u.userID === userData.liderReferenteID);
    if (lider) {
      lider.puntosCompromiso += POINTS_SYSTEM.REFER_MEMBER;
    }
  }
  return simulateApiCall(newUser);
};

export const getAlertsData = async (): Promise<Alert[]> => {
  console.log(`Llamando a mock ${API_ENDPOINTS.GET_ALERTS}`);
  // Enriquecer con nombre del reportador
  const alertsWithReporterNames = mockAlerts.map(alert => {
    const reporter = mockUsers.find(u => u.userID === alert.reportadoPorUserID);
    return { ...alert, nombreReportador: reporter ? reporter.nombreCompleto : 'Desconocido' };
  });
  return simulateApiCall(alertsWithReporterNames);
};

export const submitAlert = async (alertData: Omit<Alert, 'alertaID' | 'estado' | 'fechaReporte' | 'nombreReportador'>): Promise<Alert> => {
  console.log(`Llamando a mock ${API_ENDPOINTS.SUBMIT_ALERT}`, alertData);
  const reporterUser = mockUsers.find(u => u.userID === alertData.reportadoPorUserID);
  const newAlert: Alert = {
    ...alertData,
    alertaID: `alert${Date.now()}`,
    estado: AlertStatus.ABIERTA,
    fechaReporte: new Date().toISOString(),
    nombreReportador: reporterUser?.nombreCompleto || 'Desconocido',
  };
  mockAlerts.unshift(newAlert); // Add to beginning of array
  
  const reporter = mockUsers.find(u => u.userID === alertData.reportadoPorUserID);
  if (reporter) {
    reporter.puntosCompromiso += POINTS_SYSTEM.REPORT_ALERT;
  }
  // Simular llamada a sendWhatsAppAlert (Netlify Function llamaría a otra Netlify Function o servicio de Twilio)
  console.log('Simulando envío de notificación WhatsApp a administradores...');
  return simulateApiCall(newAlert);
};

export const handleChatbot = async (message: string): Promise<string> => {
  console.log(`Llamando a mock ${API_ENDPOINTS.HANDLE_CHATBOT} con mensaje: ${message}`);
  let response = "Lo siento, no entendí tu pregunta. Intenta preguntar sobre registro, propuestas o cómo ayudar.";
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('registrarme') || lowerMessage.includes('registro')) {
    response = "Puedes registrarte haciendo clic en 'Registrarse' en el menú. Necesitarás tu nombre, teléfono, municipio y barrio/vereda.";
  } else if (lowerMessage.includes('propuestas')) {
    response = "Las propuestas de Ximena López Yule se centran en el desarrollo social, apoyo a víctimas, y fortalecimiento comunitario en el Pacífico colombiano. Puedes ver más detalles en la sección de Noticias o en sus redes sociales.";
  } else if (lowerMessage.includes('ayudar') || lowerMessage.includes('colaborar')) {
    response = "¡Gracias por tu interés! Puedes ayudar registrándote, compartiendo la información de la campaña, o convirtiéndote en líder para reportar alertas y movilizar a tu comunidad.";
  } else if (lowerMessage.includes('líder') || lowerMessage.includes('lider')) {
    response = "Un líder de campaña ayuda a registrar nuevos miembros, reporta alertas comunitarias y moviliza a su red. Puedes convertirte en líder participando activamente y sumando puntos de compromiso.";
  } else if (lowerMessage.includes('mapa') || lowerMessage.includes('alertas')) {
     response = "El 'Mapa de Alertas' muestra en tiempo real las incidencias reportadas por nuestros líderes. Puedes consultarlo en el menú para estar al tanto de lo que sucede en tu comunidad.";
  }

  return simulateApiCall(response);
};

export const getMyTeam = async (leaderId: string): Promise<User[]> => {
  console.log(`Llamando a mock ${API_ENDPOINTS.GET_MY_TEAM} para líder: ${leaderId}`);
  const team = mockUsers.filter(user => user.liderReferenteID === leaderId);
  return simulateApiCall(team);
};

export const sendMessageToTeam = async (leaderId: string, message: string): Promise<{ success: boolean; message: string }> => {
  console.log(`Llamando a mock ${API_ENDPOINTS.SEND_MESSAGE_TO_TEAM} para líder: ${leaderId} con mensaje: "${message}"`);
  // Simulación: aquí se enviaría el mensaje (ej. vía WhatsApp a través de Netlify Function)
  const team = mockUsers.filter(user => user.liderReferenteID === leaderId);
  console.log(`Mensaje enviado a ${team.length} miembros del equipo de ${leaderId}.`);
  return simulateApiCall({ success: true, message: `Mensaje enviado a ${team.length} miembros.` });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
    console.log(`Llamando a mock ${API_ENDPOINTS.GET_USER_PROFILE} para userID: ${userId}`);
    // This function seems to get a generic user profile from the mockUsers list
    // The AuthenticatedUser in AuthContext is the candidate themselves.
    // If this is meant to get ANY user's profile:
    const user = mockUsers.find(u => u.userID === userId);
    return simulateApiCall(user || null);
};

export const getNewsFeed = async (): Promise<NewsItem[]> => {
    console.log("Llamando a mock para obtener noticias");
    return simulateApiCall(mockNews);
};

// Function to update user role (simulated admin action or gamification trigger)
export const updateUserRoleInMockDB = (userId: string, newRole: UserRole): User | null => {
    const userIndex = mockUsers.findIndex(u => u.userID === userId);
    if (userIndex !== -1) {
        mockUsers[userIndex].rol = newRole;
        // Also update the candidate's specific fields if this user is the candidate
        if (mockCandidate.userID === userId) { // Corrected: mockCandidate.id to mockCandidate.userID
            // This part might be tricky if Candidate and User are separate.
            // Assuming `AuthenticatedUser` (the candidate) is also in `mockUsers`.
            // For this PWA, user in AuthContext IS the candidate.
            // Here we are updating a generic user's role.
        }
        return mockUsers[userIndex];
    }
    return null;
}

// Mock candidate data - this is specific to the "PWA Electoral Pro" which is candidate-centric
// For the "Mi Campaña" app, the logged-in user (from AuthContext) is the one whose profile is being managed.
// The `AuthenticatedUser` now has all User fields, so `user.nombreCompleto` etc. will work.
let mockCandidate: AuthenticatedUser = {
    userID: 'cand001', // Changed 'id' to 'userID' to match User interface
    nombreCompleto: 'Ximena López Yule', // Changed 'fullName' to 'nombreCompleto'
    email: 'ximena.lopez@example.com',
    profileImageUrl: 'https://picsum.photos/seed/candidate/150/150', // This URL is used in HomePage
    welcomeMessage: '¡Uniendo fuerzas por el desarrollo social y el bienestar de las comunidades del Pacífico Colombiano!',
    rol: UserRole.ADMINISTRADOR, // Candidate is an admin of their own campaign
    puntosCompromiso: 1000,
    fechaRegistro: new Date().toISOString(),
    // Other User fields can be added if necessary
  };
  
  // This function is for the specific "PWA Electoral Pro" which this service seems to also contain mocks for
  // For "Mi Campaña", use useAuth().user for candidate data
  export const getElectoralCandidateProfile = async (): Promise<AuthenticatedUser> => {
    return simulateApiCall(mockCandidate);
  };
