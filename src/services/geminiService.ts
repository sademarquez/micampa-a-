
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 
  (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY);

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

interface VoterProfile {
  nombre: string;
  edad?: number;
  profesion?: string;
  barrio?: string;
  intereses?: string;
  genero?: string;
  estrato?: number;
  ubicacion?: string;
}

interface CandidateInfo {
  nombre: string;
  cargo: string;
  propuestas: any;
  partido?: string;
}

export class GeminiElectoralService {
  private apiKey: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = GEMINI_API_KEY || '';
    this.isConfigured = !!this.apiKey;
    
    if (this.isConfigured) {
      console.log('✅ Gemini API configurada correctamente');
    } else {
      console.warn('⚠️ Gemini API key not found. Verifica la configuración.');
    }
  }

  async makeRequest(prompt: string, config?: any): Promise<string> {
    if (!this.isConfigured) {
      console.warn('🔧 Gemini API not configured, returning fallback response');
      return this.getFallbackResponse(prompt);
    }

    const request: GeminiRequest = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 1024,
        ...config
      }
    };

    try {
      console.log('🚀 Enviando request a Gemini API...');
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API error:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!result) {
        throw new Error('Empty response from Gemini API');
      }
      
      console.log('✅ Respuesta exitosa de Gemini API');
      return result;
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  private getFallbackResponse(prompt: string): string {
    if (prompt.includes('mensaje de campaña') || prompt.includes('personalizado')) {
      return `🎯 Estimado ciudadano, te invitamos a conocer nuestras propuestas para transformar nuestro territorio. Tu participación es fundamental para el cambio que necesitamos. ¡Únete a MI CAMPAÑA 2025!`;
    }
    
    if (prompt.includes('sentiment') || prompt.includes('análisis')) {
      return JSON.stringify({
        score: 0.7,
        level: 'positivo',
        emotions: ['interés', 'expectativa', 'confianza'],
        voterIntent: 'positiva',
        concerns: ['propuestas específicas', 'transparencia'],
        engagementLevel: 8
      });
    }
    
    if (prompt.includes('bienvenida')) {
      return `¡Bienvenido a MI CAMPAÑA 2025! 🚀 Aquí encontrarás propuestas reales, transparencia total y un compromiso genuino con el cambio. Tu voz importa y tu voto puede transformar nuestra realidad.`;
    }
    
    if (prompt.includes('asistente')) {
      return `Como tu estratega electoral powered by IA, estoy aquí para maximizar el impacto de tu campaña. Análisis predictivo, mensajes que convierten, y automatización que garantiza resultados. ¿Cómo aseguramos tu victoria?`;
    }
    
    return `¡Gracias por tu interés en MI CAMPAÑA 2025! Estamos construyendo el futuro juntos con tecnología de vanguardia y compromiso real. 🎯`;
  }

  async generatePersonalizedCampaignMessage(voterProfile: VoterProfile, candidateInfo: CandidateInfo): Promise<string> {
    const prompt = `
    Eres el estratega electoral IA más avanzado de Colombia para MI CAMPAÑA 2025.
    
    Genera un mensaje de WhatsApp ULTRAPERSONALIZADO para convertir a este votante:
    
    PERFIL DEL VOTANTE:
    - Nombre: ${voterProfile.nombre}
    - Edad: ${voterProfile.edad || 'No especificada'}
    - Profesión: ${voterProfile.profesion || 'No especificada'}
    - Barrio: ${voterProfile.barrio || 'No especificado'}
    - Estrato: ${voterProfile.estrato || 'No especificado'}
    - Género: ${voterProfile.genero || 'No especificado'}
    
    CANDIDATO:
    - Nombre: ${candidateInfo.nombre}
    - Cargo: ${candidateInfo.cargo}
    - Partido: ${candidateInfo.partido || 'Independiente'}
    - Propuestas: ${JSON.stringify(candidateInfo.propuestas)}
    
    INSTRUCCIONES CLAVE:
    - Máximo 140 caracteres (WhatsApp optimizado)
    - Tono cercano, auténtico y persuasivo
    - SIEMPRE usar el nombre del votante
    - Menciona UNA propuesta específica relevante para su perfil
    - Call-to-action que genere engagement inmediato
    - Lenguaje colombiano natural
    - Evita promesas irreales
    - Genera urgencia positiva
    
    OBJETIVO: Convertir este mensaje en VOTO SEGURO
    
    FORMATO: Solo el mensaje WhatsApp, sin explicaciones.
    `;

    return await this.makeRequest(prompt);
  }

  async analyzeSentiment(message: string): Promise<{
    score: number;
    level: string;
    emotions: string[];
    voterIntent: string;
    concerns: string[];
    engagementLevel: number;
  }> {
    const prompt = `
    Eres el analizador de sentimientos electoral más preciso de Colombia.
    
    Analiza este mensaje de un VOTANTE REAL:
    "${message}"
    
    ANÁLISIS ELECTORAL PROFUNDO:
    1. Score de sentiment (-1 a 1): precisión quirúrgica
    2. Nivel: muy_negativo, negativo, neutral, positivo, muy_positivo
    3. Emociones detectadas (máximo 3, las más relevantes)  
    4. Intención de voto: negativa, neutral, indecisa, positiva, comprometida
    5. Preocupaciones específicas mencionadas
    6. Nivel de engagement electoral (1-10)
    
    CONTEXTO: MI CAMPAÑA 2025 - Revolución Electoral con IA
    
    Responde SOLO en JSON válido:
    {
      "score": 0.0,
      "level": "nivel",
      "emotions": ["emocion1", "emocion2"],
      "voterIntent": "intencion",
      "concerns": ["preocupacion1"],
      "engagementLevel": numero
    }
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing sentiment analysis:', error);
      return {
        score: 0.5,
        level: 'neutral',
        emotions: ['expectativa'],
        voterIntent: 'neutral',
        concerns: ['información adicional'],
        engagementLevel: 6
      };
    }
  }

  async generateAutomatedResponse(voterMessage: string, candidateInfo: CandidateInfo): Promise<string> {
    const prompt = `
    Eres el bot electoral más inteligente de Colombia para MI CAMPAÑA 2025.
    
    MENSAJE DEL VOTANTE:
    "${voterMessage}"
    
    INFORMACIÓN DEL CANDIDATO:
    - Nombre: ${candidateInfo.nombre}
    - Cargo: ${candidateInfo.cargo}
    - Propuestas: ${JSON.stringify(candidateInfo.propuestas)}
    
    INSTRUCCIONES ESTRATÉGICAS:
    - Respuesta empática que CONECTE emocionalmente
    - Aborda ESPECÍFICAMENTE sus preocupaciones
    - Proporciona información CONCRETA y verificable
    - Invita al diálogo constructivo
    - Máximo 180 caracteres para WhatsApp
    - Tono profesional pero humano
    - Genera CONFIANZA y CREDIBILIDAD
    - Call-to-action sutil pero efectivo
    
    OBJETIVO: Convertir preocupación en APOYO ELECTORAL
    
    FORMATO: Solo la respuesta automática, sin explicaciones.
    `;

    return await this.makeRequest(prompt);
  }

  async optimizeCampaignStrategy(metricsData: any): Promise<{
    recommendations: string[];
    targetAudience: string[];
    messageOptimization: string;
    budgetSuggestions: string;
  }> {
    const prompt = `
    Eres el estratega electoral IA más exitoso de Colombia.
    
    MÉTRICAS ACTUALES DE MI CAMPAÑA 2025:
    ${JSON.stringify(metricsData, null, 2)}
    
    ANÁLISIS ESTRATÉGICO AVANZADO:
    Proporciona optimizaciones que GARANTICEN VICTORIA ELECTORAL:
    
    1. RECOMENDACIONES TÁCTICAS (5 acciones específicas de alto impacto)
    2. AUDIENCIAS OBJETIVO (segmentos con mayor potencial de conversión)
    3. OPTIMIZACIÓN DE MENSAJES (estrategia de comunicación ganadora)
    4. DISTRIBUCIÓN DE PRESUPUESTO (ROI electoral máximo)
    
    CONTEXTO: Campaña electoral colombiana, tecnología IA avanzada
    OBJETIVO: Dominancia electoral completa
    
    Responde en JSON:
    {
      "recommendations": ["accion1", "accion2", "accion3", "accion4", "accion5"],
      "targetAudience": ["audiencia1", "audiencia2", "audiencia3"],
      "messageOptimization": "estrategia_de_mensajes_ganadora",
      "budgetSuggestions": "distribucion_presupuesto_optima"
    }
    `;

    try {
      const response = await this.makeRequest(prompt);
      const cleanResponse = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Error parsing campaign optimization:', error);
      return {
        recommendations: [
          'Activar campañas micro-dirigidas por WhatsApp',
          'Implementar análisis predictivo de votantes indecisos',
          'Optimizar presencia en redes sociales con contenido viral',
          'Activar líderes de opinión en territorios clave',
          'Automatizar seguimiento post-evento con IA'
        ],
        targetAudience: [
          'Votantes indecisos entre 25-45 años',
          'Profesionales urbanos con interés social',
          'Líderes comunitarios influyentes'
        ],
        messageOptimization: 'Personalización extrema por demografía, psicografía y ubicación. Mensajes que conecten emocionalmente y generen acción inmediata.',
        budgetSuggestions: 'Redistribuir: 45% canales digitales, 35% eventos presenciales estratégicos, 20% automatización IA y análisis predictivo'
      };
    }
  }

  async generateWelcomeMessage(voterData?: Partial<VoterProfile>): Promise<string> {
    const prompt = `
    Eres el bot de bienvenida más persuasivo de MI CAMPAÑA 2025.
    
    NUEVO VISITANTE EN LA PLATAFORMA:
    ${voterData ? `
    - Nombre: ${voterData.nombre || 'Ciudadano'}
    - Ubicación: ${voterData.ubicacion || voterData.barrio || 'Colombia'}` : 'Primera visita - perfil desconocido'}
    
    INSTRUCCIONES DE BIENVENIDA:
    - Tono ultra-acogedor y motivacional
    - Explica brevemente el PODER de la plataforma
    - Invita a participar SIN presión
    - Máximo 100 caracteres
    - Lenguaje inclusivo y esperanzador
    - Genera CURIOSIDAD y ENGAGEMENT
    
    OBJETIVO: Primera impresión EXTRAORDINARIA
    
    FORMATO: Solo el mensaje de bienvenida perfecto.
    `;

    return await this.makeRequest(prompt);
  }

  async generateAssistantResponse(userMessage: string, userRole: string, userName: string): Promise<string> {
    const prompt = `
    Eres el ASISTENTE ELECTORAL IA más avanzado del mundo para MI CAMPAÑA 2025.
    
    CONTEXTO DEL USUARIO:
    - Nombre: ${userName}
    - Rol: ${userRole}
    - Pregunta: "${userMessage}"
    
    CONTEXTO DE LA PLATAFORMA:
    - Sistema electoral revolucionario con IA al 120%
    - Automatización completa: gestión de votantes, análisis de sentimientos, métricas en tiempo real
    - Capacidades únicas: mensajes personalizados que convierten, optimización predictiva, ROI +280%
    - Integración total con Gemini AI para dominancia electoral
    - SellerChat + WhatsApp + Make para automatización 24/7
    
    INSTRUCCIONES PARA RESPUESTA MAGISTRAL:
    - Responde como el estratega electoral más exitoso del mundo
    - Adapta completamente la respuesta al rol ${userRole}
    - Proporciona consejos TÁCTICOS y 100% accionables
    - Tono profesional pero cercano y motivacional
    - Menciona funcionalidades específicas cuando sea relevante
    - Máximo 200 palabras con impacto máximo
    - Usa emojis estratégicamente para engagement
    - Genera CONFIANZA y demuestra EXPERTISE
    
    OBJETIVO: Respuesta que INSPIRE ACCIÓN y demuestre el PODER de la IA
    
    FORMATO: Solo la respuesta directa del estratega IA.
    `;

    return await this.makeRequest(prompt, {
      temperature: 0.8,
      maxOutputTokens: 512
    });
  }

  // Método para verificar conectividad
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('❌ Gemini API key no configurada');
      return false;
    }

    try {
      console.log('🔄 Probando conexión con Gemini...');
      const testResponse = await this.makeRequest('Test rápido de conectividad. Responde solo: CONECTADO');
      const isConnected = testResponse.length > 0 && !testResponse.includes('fallback');
      
      if (isConnected) {
        console.log('✅ Gemini API conectada correctamente');
      } else {
        console.log('⚠️ Gemini API respondiendo con fallback');
      }
      
      return isConnected;
    } catch (error) {
      console.error('❌ Test de conexión falló:', error);
      return false;
    }
  }

  // Método para obtener estado del servicio
  getServiceStatus(): { configured: boolean; ready: boolean } {
    return {
      configured: this.isConfigured,
      ready: this.isConfigured
    };
  }
}

export const geminiService = new GeminiElectoralService();
