// Endpoints simulados de Netlify Functions (o un backend en GCP)
export const API_ENDPOINTS = {
  LOGIN: '/.netlify/functions/loginCandidate', // POST
  GET_CANDIDATE_PROFILE: '/.netlify/functions/getCandidateProfile', // GET
  UPDATE_CANDIDATE_PROFILE: '/.netlify/functions/updateCandidateProfile', // PUT

  GET_AD_REPORTS: '/.netlify/functions/getAdReports', // GET
  CREATE_AD_REPORT: '/.netlify/functions/createAdReport', // POST

  REGISTER_VOTER: '/.netlify/functions/registerVoter', // POST
  GET_VOTERS: '/.netlify/functions/getVoters', // GET

  GET_CAMPAIGN_STRUCTURE: '/.netlify/functions/getCampaignStructure', // GET
  UPDATE_CAMPAIGN_STRUCTURE: '/.netlify/functions/updateCampaignStructure', // POST

  GET_GENERAL_REPORTS: '/.netlify/functions/getGeneralReports', // GET
  
  GET_POLLING_PLACES: '/.netlify/functions/getPollingPlaces', // GET
  GET_VOTER_LOCATION_DATA: '/.netlify/functions/getVoterLocationData', // GET (para mapas de calor, etc.)

  GET_DASHBOARD_STATS: '/.netlify/functions/getDashboardStats', // GET
  
  GET_MESSAGES: '/.netlify/functions/getMessages', // GET
  SEND_MESSAGE: '/.netlify/functions/sendMessage', // POST
  
  GET_APP_SETTINGS: '/.netlify/functions/getAppSettings', // GET
  UPDATE_APP_SETTINGS: '/.netlify/functions/updateAppSettings', // POST

  // Endpoints para "Mi Campaña" (simulados o reales)
  GET_CAMPAIGN_STATS: '/.netlify/functions/getCampaignStats', 
  REGISTER_CAMPAIGN_USER: '/.netlify/functions/registerCampaignUser',
  GET_ALERTS: '/.netlify/functions/getAlerts', 
  SUBMIT_ALERT: '/.netlify/functions/submitAlert',
  HANDLE_CHATBOT: '/.netlify/functions/gemini-chatbot', // Actualizado para el chatbot Gemini
  GET_MY_TEAM: '/.netlify/functions/getMyTeam', 
  SEND_MESSAGE_TO_TEAM: '/.netlify/functions/sendMessageToTeam', 
  GET_USER_PROFILE: '/.netlify/functions/getUserProfile',
  LOGIN_MI_CAMPANA: '/.netlify/functions/loginMiCampana', // Asumiendo que tendrás una función para esto
  REGISTER_DEMO_USER: '/.netlify/functions/registerDemoUser', // Asumiendo
};

export const SOCIAL_LINKS = {
  FACEBOOK: '#', // Reemplazar con URL real
  INSTAGRAM: '#',
  TIKTOK: '#',
};

export const DEFAULT_LANGUAGE = 'es';

// Missing constants
export const POINTS_SYSTEM = {
  REGISTER: 5,
  REPORT_ALERT: 10,
  REFER_MEMBER: 15,
  // Add other point-earning actions here
};

export const MAP_DEFAULT_CENTER: [number, number] = [4.0, -72.0]; // Approx center of Colombia
export const MAP_DEFAULT_ZOOM: number = 6;

export const ALERT_TYPE_OPTIONS = [
  { value: "Falla de Servicio Público", label: "Falla de Servicio Público" },
  { value: "Problema de Seguridad", label: "Problema de Seguridad" },
  { value: "Necesidad Comunitaria Urgente", label: "Necesidad Comunitaria Urgente" },
  { value: "Otro Tipo de Alerta", label: "Otro" },
];