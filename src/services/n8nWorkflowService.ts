import { n8nConfig } from '../config/n8nConfig';

// Servicio de integración con n8n para orquestar el workflow electoral premium
// Conexión total con Agora, Master, Candidato y Desarrollador
// Experiencia inmersiva, IA y sincronización Google

export class N8nWorkflowService {
  private n8nBaseUrl = n8nConfig.baseURL;

  // Inicia el workflow de recolección de lead, requiere autenticación Gmail
  async iniciarWorkflowDeLead(leadData: any, userRole: string, gmailToken: string) {
    try {
      // El endpoint específico del webhook en n8n
      const webhookUrl = `${this.n8nBaseUrl}/webhook/lead-collection`;

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Podrías pasar el token de gmail si n8n lo necesita para la autorización
          'Authorization': `Bearer ${gmailToken}`
        },
        body: JSON.stringify({ ...leadData, role: userRole }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: 'ok',
        message: result.message || 'Lead registrado y sincronizado',
        animacion: result.animacion || 'lead-capturado',
      };
    } catch (error) {
      console.error("Error al iniciar el workflow de lead:", error);
      return {
        status: 'error',
        message: 'No se pudo conectar con el servicio de workflows.',
        animacion: 'error-conexion',
      };
    }
  }

  // Notifica a Master y Candidato sobre el nuevo lead o acción relevante
  async notificarMasterYCandidato(leadData: any, masterEmail: string, candidatoEmail: string) {
    // TODO: Implementar llamada al webhook de notificación de n8n
    // const webhookUrl = `${this.n8nBaseUrl}/webhook/notify-team`;
    // ...
    return {
      status: 'notificado',
      animacion: 'notificacion-enviada',
    };
  }

  // Sincroniza datos con Google Sheets, Drive y Contacts
  async sincronizarConGoogle(leadData: any, gmailToken: string) {
    // TODO: Implementar llamada al webhook de sincronización de Google
    // const webhookUrl = `${this.n8nBaseUrl}/webhook/sync-google`;
    // ...
    return {
      status: 'sincronizado',
      animacion: 'sincronizacion-exitosa',
    };
  }

  // Envía informe automático al Desarrollador
  async enviarInformeADesarrollador(informeData: any, desarrolladorEmail: string) {
    // TODO: Implementar llamada al webhook de envío de informes
    // const webhookUrl = `${this.n8nBaseUrl}/webhook/developer-report`;
    // ...
    return {
      status: 'enviado',
      animacion: 'informe-enviado',
    };
  }

  // Hook para feedback IA y animaciones premium en frontend
  async hookFeedbackIA(userId: string, evento: string, contexto: any) {
    // TODO: Implementar llamada al webhook de feedback de IA
    // const webhookUrl = `${this.n8nBaseUrl}/webhook/ai-feedback`;
    // ...
    return {
      mensaje: '¡Acción registrada! Agora recomienda contactar a este lead en las próximas 24h.',
      animacion: 'ia-sugerencia',
      sugerencia: 'Activa una campaña de WhatsApp para este segmento.'
    };
  }
}

// Instancia exportable para uso global
export const n8nWorkflowService = new N8nWorkflowService(); 