
import { API_ENDPOINTS, POINTS_SYSTEM } from '../constants';
import { User, Alert, CampaignStats, UserRole, AlertType, AlertStatus, NewsItem, AuthenticatedUser } from '../types';

// Simulación de la base de datos en memoria (para pruebas sin backend real)
// En producción, estas funciones llamarán a Netlify Functions que interactúan con Google Sheets.
let mockUsers: User[] = [
  { userID: 'admin1', nombreCompleto: 'Admin General', telefono: '3001234567', email: 'admin@campana.com', municipio: 'Bogotá', barrioVereda: 'Chapinero', rol: UserRole.ADMINISTRADOR, puntosCompromiso: 100, fechaRegistro: new Date().toISOString(), profileImageUrl: 'https://picsum.photos/seed/admin/150/150', welcomeMessage: 'Bienvenido Admin!' },
  { userID: 'lider1', nombreCompleto: 'Líder Ana Pérez', telefono: '3011234568', email: 'lider.ana@campana.com', municipio: 'Cali', barrioVereda: 'San Fernando', rol: UserRole.LIDER_MUNICIPAL, puntosCompromiso: 50, fechaRegistro: new Date().toISOString(), profileImageUrl: 'https://picsum.photos/seed/lider1/150/150', welcomeMessage: 'Hola Líder Ana!' },
  { userID: 'simpatizante1', nombreCompleto: 'Carlos Ruiz', telefono: '3021234569', email: 'carlos.ruiz@example.com', municipio: 'Medellín', barrioVereda: 'Poblado', rol: UserRole.SIMPATIZANTE, puntosCompromiso: 5, fechaRegistro: new Date().toISOString(), liderReferenteID: 'lider1', profileImageUrl: 'https://picsum.photos/seed/simpatizante1/150/150' },
  { userID: 'demoUser', nombreCompleto: 'Usuario Demo', telefono: '3000000000', email: 'demo.user@campana.com', municipio: 'Ciudad Demo', barrioVereda: 'Centro Demo', rol: UserRole.LIDER_MUNICIPAL, puntosCompromiso: 25, fechaRegistro: new Date().toISOString(), profileImageUrl: 'https://picsum.photos/seed/demouser/150/150', welcomeMessage: 'Bienvenido Usuario Demo, ¡explora la app!' },
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


export const loginMiCampanaUser = async (email: string, pass: string): Promise<AuthenticatedUser> => {
  // En producción, esto llamaría a API_ENDPOINTS.LOGIN_MI_CAMPANA
  console.log(`Intentando login para Mi Campaña con email: ${email}`);
  const trimmedEmail = email.trim(); 
  const userFound = mockUsers.find(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());
  
  if (userFound && pass === "password123") {
    return simulateApiCall(userFound as AuthenticatedUser);
  }
  console.error(`Login fallido. User found: ${!!userFound}, Pass correct: ${pass === "password123"}`);
  throw new Error("Credenciales inválidas");
};

export const registerAndLoginDemoUser = async (): Promise<AuthenticatedUser> => {
  // En producción, esto llamaría a API_ENDPOINTS.REGISTER_DEMO_USER
  console.log('Registrando y logueando usuario demo...');
  let demoUser = mockUsers.find(u => u.userID === 'demoUser');

  if (!demoUser) {
    demoUser = {
      userID: 'demoUser',
      nombreCompleto: 'Usuario de Demostración',
      email: 'demo.user@campana.com',
      telefono: '123456789',
      municipio: 'DemoCiudad',
      barrioVereda: 'DemoBarrio',
      rol: UserRole.LIDER_MUNICIPAL, 
      puntosCompromiso: 10,
      fechaRegistro: new Date().toISOString(),
      profileImageUrl: 'https://picsum.photos/seed/demouser/150/150',
      welcomeMessage: '¡Bienvenido Usuario Demo! Explora todas las funciones.'
    };
    mockUsers.push(demoUser);
  }
  return simulateApiCall(demoUser as AuthenticatedUser);
};


export const getCampaignStats = async (): Promise<CampaignStats> => {
  // En producción, llamaría a API_ENDPOINTS.GET_CAMPAIGN_STATS
  const stats: CampaignStats = {
    numeroMiembros: mockUsers.length,
    numeroAlertasAtendidas: mockAlerts.filter(a => a.estado === AlertStatus.RESUELTA).length,
  };
  return simulateApiCall(stats);
};

export const registerUser = async (userData: Omit<User, 'userID' | 'rol' | 'puntosCompromiso' | 'fechaRegistro'>): Promise<User> => {
  // En producción, llamaría a API_ENDPOINTS.REGISTER_CAMPAIGN_USER
  const newUser: User = {
    ...userData,
    userID: `user${Date.now()}`, 
    rol: UserRole.SIMPATIZANTE, 
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
  // En producción, llamaría a API_ENDPOINTS.GET_ALERTS
  const alertsWithReporterNames = mockAlerts.map(alert => {
    const reporter = mockUsers.find(u => u.userID === alert.reportadoPorUserID);
    return { ...alert, nombreReportador: reporter ? reporter.nombreCompleto : 'Desconocido' };
  });
  return simulateApiCall(alertsWithReporterNames);
};

export const submitAlert = async (alertData: Omit<Alert, 'alertaID' | 'estado' | 'fechaReporte' | 'nombreReportador'>): Promise<Alert> => {
  // En producción, llamaría a API_ENDPOINTS.SUBMIT_ALERT
  const reporterUser = mockUsers.find(u => u.userID === alertData.reportadoPorUserID);
  const newAlert: Alert = {
    ...alertData,
    alertaID: `alert${Date.now()}`,
    estado: AlertStatus.ABIERTA,
    fechaReporte: new Date().toISOString(),
    nombreReportador: reporterUser?.nombreCompleto || 'Desconocido',
  };
  mockAlerts.unshift(newAlert); 
  
  const reporter = mockUsers.find(u => u.userID === alertData.reportadoPorUserID);
  if (reporter) {
    reporter.puntosCompromiso += POINTS_SYSTEM.REPORT_ALERT;
  }
  console.log('Simulando envío de notificación WhatsApp a administradores...');
  return simulateApiCall(newAlert);
};

export const handleChatbot = async (message: string, candidateContext?: any): Promise<string> => {
  // Llama a la Netlify Function del chatbot Gemini
  try {
    const response = await fetch(API_ENDPOINTS.HANDLE_CHATBOT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, candidateContext }), // candidateContext es opcional y para futura personalización
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la API del chatbot');
    }
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error al contactar el chatbot:', error);
    return "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo más tarde.";
  }
};

export const getMyTeam = async (leaderId: string): Promise<User[]> => {
  // En producción, llamaría a API_ENDPOINTS.GET_MY_TEAM
  const team = mockUsers.filter(user => user.liderReferenteID === leaderId);
  return simulateApiCall(team);
};

export const sendMessageToTeam = async (leaderId: string, message: string): Promise<{ success: boolean; message: string }> => {
  // En producción, llamaría a API_ENDPOINTS.SEND_MESSAGE_TO_TEAM
  const team = mockUsers.filter(user => user.liderReferenteID === leaderId);
  console.log(`Mensaje enviado a ${team.length} miembros del equipo de ${leaderId}.`);
  return simulateApiCall({ success: true, message: `Mensaje enviado a ${team.length} miembros.` });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
    // En producción, llamaría a API_ENDPOINTS.GET_USER_PROFILE
    const user = mockUsers.find(u => u.userID === userId);
    return simulateApiCall(user || null);
};

export const getNewsFeed = async (): Promise<NewsItem[]> => {
    // En producción, esto obtendría noticias de una hoja de cálculo o CMS
    return simulateApiCall(mockNews);
};

// Funciones de ejemplo para administrar la base de datos mock (solo para demo)
export const updateUserRoleInMockDB = (userId: string, newRole: UserRole): User | null => {
    const userIndex = mockUsers.findIndex(u => u.userID === userId);
    if (userIndex !== -1) {
        mockUsers[userIndex].rol = newRole;
        return mockUsers[userIndex];
    }
    return null;
}

// Datos y funciones relacionadas con `electoralPwaService.ts` se mantienen separados
// o se fusionan si ambas apps son la misma. Por ahora, asumiendo que son para contextos diferentes.
let mockCandidate: AuthenticatedUser = { 
    userID: 'cand001', 
    nombreCompleto: 'Ximena López Yule', 
    email: 'ximena.lopez@example.com',
    profileImageUrl: 'https://picsum.photos/seed/candidate/150/150', 
    welcomeMessage: '¡Uniendo fuerzas por el desarrollo social y el bienestar de las comunidades del Pacífico Colombiano!',
    rol: UserRole.ADMINISTRADOR, 
    puntosCompromiso: 1000,
    fechaRegistro: new Date().toISOString(),
  };
  
export const getElectoralCandidateProfile = async (): Promise<AuthenticatedUser> => {
  return simulateApiCall(mockCandidate);
};
