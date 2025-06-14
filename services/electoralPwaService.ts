
import { API_ENDPOINTS } from '../constants';
import { 
  Candidate, Voter, AdCampaignReport, CampaignTeamMember, CampaignStructureNode, GeneralReport, PollingPlace, Message, AppSettings, AuthenticatedUser, UserRole 
} from '../types';

// Simulación de API con delay
const simulateApiCall = <T,>(data: T, delay = 300): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// --- Datos Mock ---
let mockCandidateData: AuthenticatedUser = {
  userID: 'cand001', // Changed from 'id'
  nombreCompleto: 'Candidato Ejemplo Nacional', // Changed from 'fullName'
  email: 'candidato@ejemplo.com',
  profileImageUrl: 'https://picsum.photos/seed/candidate/200/200',
  welcomeMessage: '¡Juntos por un futuro mejor! Contamos con tu apoyo.',
  rol: UserRole.ADMINISTRADOR, // Example role
  puntosCompromiso: 0, // Example points
  fechaRegistro: new Date().toISOString(), // Example date
};


let mockVoters: Voter[] = [
  { id: 'voter001', fullName: 'Ana Pérez', idNumber: '12345678A', city: 'Ciudad Capital', registrationDate: new Date(Date.now() - 10 * 86400000).toISOString(), pollingPlaceId: 'poll001', phone: '555-1234' },
  { id: 'voter002', fullName: 'Luis García', idNumber: '87654321B', city: 'Distrito Central', registrationDate: new Date(Date.now() - 5 * 86400000).toISOString(), pollingPlaceId: 'poll002', email: 'luis.g@example.com' },
];

let mockAdReports: AdCampaignReport[] = [
  { id: 'ad001', campaignName: 'Lanzamiento Redes', platform: 'Facebook', startDate: new Date(Date.now() - 30 * 86400000).toISOString(), endDate: new Date(Date.now() - 15 * 86400000).toISOString(), budget: 5000, reach: 150000, engagement: 7500 },
  { id: 'ad002', campaignName: 'Jóvenes con el Futuro', platform: 'TikTok', startDate: new Date(Date.now() - 10 * 86400000).toISOString(), endDate: new Date().toISOString(), budget: 3000, reach: 250000, engagement: 12000 },
];

let mockCampaignStructure: CampaignStructureNode = {
  id: 'root',
  name: 'Dirección General de Campaña',
  manager: 'Elena Rodriguez',
  membersCount: 1,
  children: [
    { id: 'coord1', name: 'Coordinación Estratégica', manager: 'Carlos Silva', membersCount: 5, children: [
      {id: 'coord1_1', name: 'Análisis y Datos', manager: 'Sofia Herrera', membersCount: 3}
    ]},
    { id: 'coord2', name: 'Coordinación Territorial', manager: 'Juan Mendoza', membersCount: 150, children: [
      { id: 'coord2_1', name: 'Zona Norte', manager: 'Laura Vargas', membersCount: 50},
      { id: 'coord2_2', name: 'Zona Sur', manager: 'Pedro Gómez', membersCount: 50},
      { id: 'coord2_3', name: 'Zona Centro', manager: 'Isabel Luna', membersCount: 50},
    ]},
    { id: 'coord3', name: 'Comunicaciones y Prensa', manager: 'Miguel Torres', membersCount: 8},
    { id: 'coord4', name: 'Logística y Eventos', manager: 'Andrea Paez', membersCount: 12},
  ]
};

let mockGeneralReports: GeneralReport[] = [
  {id: 'gr001', title: 'Resumen Semanal de Actividades', generatedDate: new Date().toISOString(), summary: 'Incremento del 15% en registros de simpatizantes esta semana.'},
  {id: 'gr002', title: 'Análisis de Encuestas Preliminares', generatedDate: new Date(Date.now() - 7 * 86400000).toISOString(), summary: 'Fuerte apoyo en el segmento de 25-40 años.'},
];

let mockPollingPlaces: PollingPlace[] = [
    {id: 'poll001', name: 'Escuela Central Principal', address: 'Calle Principal 123', city: 'Ciudad Capital', openingHours: '8 AM - 6 PM', latitude: 4.60971, longitude: -74.08175 }, // Bogotá
    {id: 'poll002', name: 'Gimnasio Municipal del Norte', address: 'Avenida Libertad 456', city: 'Distrito Central', openingHours: '8 AM - 6 PM', latitude: 3.451647, longitude: -76.532050 }, // Cali
    {id: 'poll003', name: 'Colegio San Juan Bosco', address: 'Carrera 43 #70-100', city: 'Medellín', openingHours: '7 AM - 5 PM', latitude: 6.25184, longitude: -75.56359 }, // Medellín
    {id: 'poll004', name: 'Universidad del Atlántico - Sede Norte', address: 'Corredor Universitario', city: 'Barranquilla', openingHours: '8 AM - 4 PM', latitude: 10.963889, longitude: -74.796389 }, // Barranquilla
];

let mockMessages: Message[] = [
    {id: 'msg001', subject: 'Reunión de Coordinadores', body: 'Recordatorio: La reunión semanal de coordinadores es mañana a las 10 AM.', sender: 'cand001', recipient: 'all_coordinators', timestamp: new Date().toISOString(), read: false},
    {id: 'msg002', subject: 'Material de Campaña Listo', body: 'El nuevo material promocional está disponible para recoger en la sede.', sender: 'logistica_team', recipient: 'all_leaders', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true},
];

let mockAppSettings: AppSettings = {
    language: 'es',
    notificationsEnabled: true,
    theme: 'light',
};


// --- Funciones del Servicio (simuladas) ---

export const loginCandidate = async (email: string, pass: string): Promise<AuthenticatedUser> => {
  console.log(`Llamando mock ${API_ENDPOINTS.LOGIN} con email: ${email}`);
  // Simular lógica de login
  if (email === 'candidato@ejemplo.com' && pass === 'password123') {
    return simulateApiCall(mockCandidateData);
  }
  throw new Error("Credenciales inválidas");
};

export const getCandidateProfile = async (): Promise<AuthenticatedUser> => { // Return type changed to AuthenticatedUser
  console.log(`Llamando mock ${API_ENDPOINTS.GET_CANDIDATE_PROFILE}`);
  return simulateApiCall(mockCandidateData);
};

export const updateCandidateProfile = async (profileData: Partial<AuthenticatedUser>): Promise<AuthenticatedUser> => {
  console.log(`Llamando mock ${API_ENDPOINTS.UPDATE_CANDIDATE_PROFILE}`, profileData);
  mockCandidateData = { ...mockCandidateData, ...profileData };
  return simulateApiCall(mockCandidateData);
};

export const getAdReports = async (): Promise<AdCampaignReport[]> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_AD_REPORTS}`);
    return simulateApiCall(mockAdReports);
};

export const createAdReport = async (reportData: Omit<AdCampaignReport, 'id'>): Promise<AdCampaignReport> => {
    console.log(`Llamando mock ${API_ENDPOINTS.CREATE_AD_REPORT}`, reportData);
    const newReport: AdCampaignReport = { ...reportData, id: `ad${Date.now()}` };
    mockAdReports.push(newReport);
    return simulateApiCall(newReport);
};

export const registerVoter = async (voterData: Omit<Voter, 'id' | 'registrationDate'>): Promise<Voter> => {
    console.log(`Llamando mock ${API_ENDPOINTS.REGISTER_VOTER}`, voterData);
    const newVoter: Voter = { ...voterData, id: `voter${Date.now()}`, registrationDate: new Date().toISOString() };
    mockVoters.push(newVoter);
    return simulateApiCall(newVoter);
};

export const getVoters = async (): Promise<Voter[]> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_VOTERS}`);
    return simulateApiCall(mockVoters);
};

export const getCampaignStructure = async (): Promise<CampaignStructureNode> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_CAMPAIGN_STRUCTURE}`);
    return simulateApiCall(mockCampaignStructure);
};

export const getGeneralReports = async (): Promise<GeneralReport[]> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_GENERAL_REPORTS}`);
    return simulateApiCall(mockGeneralReports);
};

export const getPollingPlaces = async (): Promise<PollingPlace[]> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_POLLING_PLACES}`);
    return simulateApiCall(mockPollingPlaces.filter(p => p.latitude && p.longitude)); // Ensure places have coordinates
};

export const getVoterLocationData = async (): Promise<any> => { // Debería retornar GeoJSON o similar
    console.log(`Llamando mock ${API_ENDPOINTS.GET_VOTER_LOCATION_DATA}`);
    // Simular datos para mapa de calor (ej. conteo de votantes por municipio)
    const locationData = mockVoters.reduce((acc, voter) => {
        const city = voter.city || 'Desconocido';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {} as {[key: string]: number});
    return simulateApiCall({ type: "FeatureCollection", features: Object.entries(locationData).map(([city, count], i) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [-74.0060 - (i*0.1), 40.7128 + (i*0.1)] }, // Coordenadas falsas
        properties: { city, count }
    }))});
};

export const getDashboardStats = async (): Promise<any> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_DASHBOARD_STATS}`);
    return simulateApiCall({
        totalVoters: mockVoters.length,
        adCampaignsActive: mockAdReports.filter(r => new Date(r.endDate) >= new Date()).length,
        teamMembers: mockCampaignStructure.children?.reduce((sum, child) => sum + (child.membersCount || 0), 0) || 0,
        upcomingEvents: 3 // Dato Falso
    });
};

export const getMessages = async (): Promise<Message[]> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_MESSAGES}`);
    return simulateApiCall(mockMessages.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
};

export const sendMessage = async (messageData: Omit<Message, 'id'| 'timestamp' | 'read'>): Promise<Message> => {
    console.log(`Llamando mock ${API_ENDPOINTS.SEND_MESSAGE}`, messageData);
    const newMessage: Message = {...messageData, id: `msg${Date.now()}`, timestamp: new Date().toISOString(), read: false};
    mockMessages.unshift(newMessage);
    return simulateApiCall(newMessage);
};

export const getAppSettings = async(): Promise<AppSettings> => {
    console.log(`Llamando mock ${API_ENDPOINTS.GET_APP_SETTINGS}`);
    return simulateApiCall(mockAppSettings);
};

export const updateAppSettings = async (settingsData: Partial<AppSettings>): Promise<AppSettings> => {
    console.log(`Llamando mock ${API_ENDPOINTS.UPDATE_APP_SETTINGS}`, settingsData);
    mockAppSettings = { ...mockAppSettings, ...settingsData };
    return simulateApiCall(mockAppSettings);
};
