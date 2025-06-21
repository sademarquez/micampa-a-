
export interface N8NConfig {
  baseUrl: string;
  webhookPrefix: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
  productionMode: boolean;
}

export interface N8NWebhookPayload {
  component: string;
  action: string;
  data: any;
  timestamp: string;
  userId?: string;
  userRole?: string;
  sessionId?: string;
  productionMode?: boolean;
}

export interface N8NResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionId?: string;
}

// Configuración de N8N para producción
export const defaultN8NConfig: N8NConfig = {
  baseUrl: 'https://n8n.sistema-electoral.com',
  webhookPrefix: '/webhook',
  timeout: 30000,
  retryAttempts: 3,
  productionMode: true
};

// Mapeo de componentes a webhooks N8N
export const componentWebhooks = {
  'user-auth': '/webhook/auth',
  'voter-registration': '/webhook/voters',
  'messaging-system': '/webhook/messaging',
  'whatsapp-integration': '/webhook/whatsapp',
  'email-campaigns': '/webhook/email',
  'sms-campaigns': '/webhook/sms',
  'territory-management': '/webhook/territory',
  'analytics-engine': '/webhook/analytics',
  'event-coordinator': '/webhook/events',
  'alert-system': '/webhook/alerts',
  'social-media': '/webhook/social'
};

// Cliente N8N optimizado para producción
export class N8NClient {
  private config: N8NConfig;

  constructor(config: Partial<N8NConfig> = {}) {
    this.config = { ...defaultN8NConfig, ...config };
  }

  async executeWebhook(
    component: string, 
    action: string, 
    data: any = {},
    metadata: any = {}
  ): Promise<N8NResponse> {
    const webhook = componentWebhooks[component as keyof typeof componentWebhooks];
    
    if (!webhook) {
      console.warn(`⚠️ Webhook no encontrado para el componente: ${component}`);
      return {
        success: false,
        error: `Webhook no encontrado para el componente: ${component}`
      };
    }

    const payload: N8NWebhookPayload = {
      component,
      action,
      data,
      timestamp: new Date().toISOString(),
      productionMode: this.config.productionMode,
      ...metadata
    };

    const url = `${this.config.baseUrl}${webhook}`;

    // Ejecución real de N8N
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`🔄 Ejecutando N8N webhook (intento ${attempt}):`, {
          url,
          component,
          action
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('✅ N8N webhook ejecutado exitosamente:', result);
        
        return {
          success: true,
          data: result,
          executionId: result.executionId
        };

      } catch (error) {
        console.error(`❌ Error en intento ${attempt}:`, error);
        
        if (attempt === this.config.retryAttempts) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    return {
      success: false,
      error: 'Máximo número de intentos alcanzado'
    };
  }

  // Métodos específicos para cada componente
  async authenticateUser(email: string, password: string) {
    return this.executeWebhook('user-auth', 'login', { email, password });
  }

  async registerVoter(voterData: any) {
    return this.executeWebhook('voter-registration', 'createVoter', voterData);
  }

  async sendMessage(messageData: any) {
    return this.executeWebhook('messaging-system', 'sendMessage', messageData);
  }

  async createTerritory(territoryData: any) {
    return this.executeWebhook('territory-management', 'createTerritory', territoryData);
  }

  async generateReport(reportData: any) {
    return this.executeWebhook('analytics-engine', 'generateReport', reportData);
  }

  async createEvent(eventData: any) {
    return this.executeWebhook('event-coordinator', 'createEvent', eventData);
  }

  async sendWhatsApp(messageData: any) {
    return this.executeWebhook('whatsapp-integration', 'sendWhatsApp', messageData);
  }

  async sendEmail(emailData: any) {
    return this.executeWebhook('email-campaigns', 'sendEmail', emailData);
  }

  async sendSMS(smsData: any) {
    return this.executeWebhook('sms-campaigns', 'sendSMS', smsData);
  }

  async publishSocialMedia(postData: any) {
    return this.executeWebhook('social-media', 'publishPost', postData);
  }

  async createAlert(alertData: any) {
    return this.executeWebhook('alert-system', 'createAlert', alertData);
  }

  updateConfig(newConfig: Partial<N8NConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): N8NConfig {
    return { ...this.config };
  }
}

// Instancia global del cliente N8N
export const n8nClient = new N8NClient();

// Hook para usar N8N en componentes React
export const useN8N = () => {
  return {
    client: n8nClient,
    config: n8nClient.getConfig(),
    updateConfig: n8nClient.updateConfig.bind(n8nClient),
    executeWebhook: n8nClient.executeWebhook.bind(n8nClient),
    authenticateUser: n8nClient.authenticateUser.bind(n8nClient),
    registerVoter: n8nClient.registerVoter.bind(n8nClient),
    sendMessage: n8nClient.sendMessage.bind(n8nClient),
    createTerritory: n8nClient.createTerritory.bind(n8nClient),
    generateReport: n8nClient.generateReport.bind(n8nClient),
    createEvent: n8nClient.createEvent.bind(n8nClient),
    sendWhatsApp: n8nClient.sendWhatsApp.bind(n8nClient),
    sendEmail: n8nClient.sendEmail.bind(n8nClient),
    sendSMS: n8nClient.sendSMS.bind(n8nClient),
    publishSocialMedia: n8nClient.publishSocialMedia.bind(n8nClient),
    createAlert: n8nClient.createAlert.bind(n8nClient)
  };
};
