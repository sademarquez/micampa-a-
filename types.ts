export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  welcomeMessage?: string;
  // Otros campos relevantes para el perfil del candidato
}

// Enum for User Roles
export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  LIDER_MUNICIPAL = 'LIDER_MUNICIPAL',
  LIDER_ZONAL = 'LIDER_ZONAL',
  LIDER_BARRIO = 'LIDER_BARRIO',
  LIDER_VEREDA = 'LIDER_VEREDA',
  SIMPATIZANTE = 'SIMPATIZANTE',
}

// Comprehensive User interface
export interface User {
  userID: string;
  nombreCompleto: string;
  telefono?: string;
  email: string;
  municipio?: string;
  barrioVereda?: string;
  rol: UserRole;
  puntosCompromiso: number;
  fechaRegistro: string; // ISO Date string
  liderReferenteID?: string;
  // Candidate specific fields can be merged if a user can also be a candidate
  profileImageUrl?: string; // from Candidate
  welcomeMessage?: string; // from Candidate
  // id: string; // from Candidate, userID is more specific for general user
  // fullName: string; // from Candidate, nombreCompleto is used
}


export interface Voter {
  id: string;
  fullName: string;
  idNumber: string; // Cédula o DNI
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  pollingPlaceId?: string; // ID del lugar de votación asignado
  registrationDate: string; // ISO Date string
  // Otros campos relevantes
}

export interface AdCampaignReport {
  id: string;
  campaignName: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'Google Ads' | 'Other';
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  budget: number;
  reach?: number;
  engagement?: number; // Clicks, likes, shares, etc.
  // Otros campos
}

export interface CampaignTeamMember {
  id: string;
  name: string;
  role: string; // Ej: Coordinador General, Líder Zonal, Voluntario
  contact: string;
  // Otros campos
}

export interface CampaignStructureNode {
    id: string;
    name: string; // Ej: "Coordinación General", "Equipo de Logística"
    manager?: string; // Nombre del responsable
    membersCount?: number;
    children?: CampaignStructureNode[];
}


export interface GeneralReport {
  id: string;
  title: string;
  generatedDate: string; // ISO Date string
  summary: string;
  dataUrl?: string; // Enlace a datos más detallados o visualización
}

export interface PollingPlace {
  id:string;
  name: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  // Otros campos
}

export interface Message {
  id: string;
  subject?: string;
  body: string;
  sender: string; // O un User/Candidate ID
  recipient: string; // O un User/Candidate ID / 'all'
  timestamp: string; // ISO Date string
  read: boolean;
}

export interface AppSettings {
  language: 'es' | 'en';
  notificationsEnabled: boolean;
  theme: 'light' | 'dark'; // Ejemplo
}

// For the authentication
// The AuthenticatedUser is now based on the comprehensive User type
export interface AuthenticatedUser extends User {
  // Candidate fields are already part of User if we assume candidate IS A user.
  // If candidate is a separate entity that a user can manage, structure is different.
  // For now, AuthenticatedUser is a User, which includes candidate-like fields.
  // The original `AuthenticatedUser extends Candidate` was too restrictive.
  // Let's assume the `AuthenticatedUser` IS the `Candidate` for this PWA, so `id` from `Candidate` is `userID`.
  // `fullName` from `Candidate` is `nombreCompleto`.
}


// Specific types for campaignService.ts that were missing
export interface CampaignStats {
  numeroMiembros: number;
  numeroAlertasAtendidas: number;
}

export enum AlertType {
  FALLA_SERVICIO = "Falla de Servicio Público",
  PROBLEMA_SEGURIDAD = "Problema de Seguridad",
  NECESIDAD_COMUNITARIA = "Necesidad Comunitaria Urgente",
  OTRO = "Otro Tipo de Alerta"
}

export enum AlertStatus {
  ABIERTA = "Abierta",
  EN_PROCESO = "En Proceso",
  RESUELTA = "Resuelta",
  DESCARTADA = "Descartada"
}

export interface Alert {
  alertaID: string;
  tipoAlerta: AlertType;
  descripcion: string;
  latitud: number;
  longitud: number;
  reportadoPorUserID: string;
  nombreReportador?: string; // Added for display
  estado: AlertStatus;
  fechaReporte: string; // ISO Date string
  urlMedia?: string; // URL to photo/video evidence
  // municipio?: string; // If needed for filtering
}

export interface NewsItem {
  id: string;
  titulo: string;
  resumen: string;
  fecha: string; // ISO Date string
  imagenUrl?: string;
  enlace?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}