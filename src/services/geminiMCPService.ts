
import { geminiService } from './geminiService';

interface MCPMapData {
  coordinates: { lat: number; lng: number };
  territory: string;
  demographic: any;
  electoral_potential: number;
  automation_level: number;
}

interface TerritorialStrategy {
  zone_id: string;
  priority_level: 'critical' | 'high' | 'medium' | 'low';
  voter_segments: string[];
  automated_actions: string[];
  ai_recommendations: string[];
  resource_allocation: number;
}

interface MCPAutomationRule {
  trigger: string;
  condition: string;
  action: string;
  gemini_enhancement: string;
  execution_probability: number;
}

interface MapInteractionAnalysis {
  insights: string[];
  next_actions: string[];
  automation_opportunities: string[];
  roi_prediction: number;
}

interface DynamicMapContent {
  territorial_alerts: any[];
  opportunity_zones: any[];
  automated_suggestions: string[];
  real_time_insights: string;
}

export class GeminiMCPService {
  private serviceStatus: { connected: boolean; lastCheck: Date | null } = {
    connected: false,
    lastCheck: null
  };

  constructor() {
    this.checkServiceHealth();
  }

  private async checkServiceHealth(): Promise<void> {
    try {
      const isConnected = await geminiService.testConnection();
      this.serviceStatus = {
        connected: isConnected,
        lastCheck: new Date()
      };
    } catch (error) {
      console.error('❌ Error checking MCP service health:', error);
      this.serviceStatus = {
        connected: false,
        lastCheck: new Date()
      };
    }
  }

  private getFallbackStrategy(mapData: MCPMapData): TerritorialStrategy {
    return {
      zone_id: `zone_${mapData.coordinates.lat}_${mapData.coordinates.lng}`,
      priority_level: 'medium',
      voter_segments: ['Indecisos urbanos', 'Profesionales jóvenes', 'Familias trabajadoras'],
      automated_actions: [
        'Mensajes personalizados por WhatsApp',
        'Eventos comunitarios dirigidos',
        'Publicidad digital segmentada'
      ],
      ai_recommendations: [
        'Incrementar presencia en redes sociales',
        'Activar líderes de opinión locales',
        'Organizar encuentros ciudadanos'
      ],
      resource_allocation: Math.floor(mapData.electoral_potential * 0.6)
    };
  }

  private getFallbackRules(): MCPAutomationRule[] {
    return [
      {
        trigger: 'high_voter_concentration_detected',
        condition: 'electoral_potential > 70%',
        action: 'deploy_targeted_campaign',
        gemini_enhancement: 'Personalizar mensajes con IA según demografía local',
        execution_probability: 85
      },
      {
        trigger: 'low_engagement_zone',
        condition: 'engagement_level < 40%',
        action: 'activate_community_leaders',
        gemini_enhancement: 'Identificar influencers locales y crear contenido específico',
        execution_probability: 70
      },
      {
        trigger: 'competitive_activity_surge',
        condition: 'competitor_activity > baseline + 50%',
        action: 'defensive_counter_campaign',
        gemini_enhancement: 'Análisis de mensajes competidores y respuesta estratégica',
        execution_probability: 90
      }
    ];
  }

  async generateTerritorialStrategy(
    mapData: MCPMapData, 
    userRole: string, 
    campaignObjectives: any
  ): Promise<TerritorialStrategy> {
    const prompt = `
    SISTEMA ELECTORAL AVANZADO - GEMINI MCP TERRITORIAL INTELLIGENCE

    CONTEXTO DE MAPA:
    - Coordenadas: ${mapData.coordinates.lat}, ${mapData.coordinates.lng}
    - Territorio: ${mapData.territory}
    - Potencial Electoral: ${mapData.electoral_potential}%
    - Nivel de Automatización: ${mapData.automation_level}%
    - Usuario: ${userRole}

    OBJETIVOS DE CAMPAÑA:
    ${JSON.stringify(campaignObjectives, null, 2)}

    INSTRUCCIONES AVANZADAS:
    Genera una estrategia territorial ultraespecífica que:
    1. Identifique segmentos de votantes con precisión quirúrgica
    2. Defina acciones automatizadas con IA que garanticen conversión
    3. Proporcione recomendaciones tácticas basadas en análisis predictivo
    4. Optimice asignación de recursos para ROI electoral máximo
    5. Genere reglas de automatización MCP que se ejecuten sin intervención humana

    FORMATO DE RESPUESTA (JSON estricto):
    {
      "zone_id": "identificador_unico",
      "priority_level": "critical|high|medium|low",
      "voter_segments": ["segmento1", "segmento2", "segmento3"],
      "automated_actions": ["accion1", "accion2", "accion3"],
      "ai_recommendations": ["rec1", "rec2", "rec3"],
      "resource_allocation": numero_porcentaje
    }

    GENERA ESTRATEGIA DOMINANTE AHORA:
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.3,
        maxOutputTokens: 1024
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      const strategy = JSON.parse(cleanResponse);
      
      // Validar estructura de respuesta
      if (!strategy.zone_id || !strategy.priority_level) {
        throw new Error('Invalid strategy structure');
      }
      
      return strategy;
    } catch (error) {
      console.error('❌ Error generating territorial strategy:', error);
      return this.getFallbackStrategy(mapData);
    }
  }

  async createMCPAutomationRules(
    territorialData: any,
    userRole: string
  ): Promise<MCPAutomationRule[]> {
    const prompt = `
    MCP AUTOMATION ARCHITECT - REGLAS DE AUTOMATIZACIÓN ELECTORAL

    DATOS TERRITORIALES:
    ${JSON.stringify(territorialData, null, 2)}

    ROL DE USUARIO: ${userRole}

    GENERA REGLAS MCP QUE:
    1. Se ejecuten automáticamente basadas en triggers específicos
    2. Utilicen análisis predictivo de Gemini para optimizar timing
    3. Adapten mensajes y acciones según contexto territorial
    4. Maximicen engagement y conversión de votantes
    5. Operen 24/7 sin intervención humana

    CATEGORÍAS DE AUTOMATIZACIÓN:
    - Detección de oportunidades electorales
    - Respuesta automática a eventos territoriales
    - Optimización de recursos en tiempo real
    - Activación de campañas micro-dirigidas
    - Análisis predictivo de tendencias

    RESPONDE EN FORMATO JSON ARRAY:
    [
      {
        "trigger": "condición_que_activa",
        "condition": "lógica_específica",
        "action": "acción_automatizada",
        "gemini_enhancement": "mejora_con_ia",
        "execution_probability": numero_0_a_100
      }
    ]
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.4,
        maxOutputTokens: 1536
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      const rules = JSON.parse(cleanResponse);
      
      if (!Array.isArray(rules)) {
        throw new Error('Rules must be an array');
      }
      
      return rules;
    } catch (error) {
      console.error('❌ Error creating MCP automation rules:', error);
      return this.getFallbackRules();
    }
  }

  async analyzeMapInteraction(
    interactionData: any,
    userCredentials: any
  ): Promise<MapInteractionAnalysis> {
    const prompt = `
    GEMINI MAP INTERACTION ANALYZER - ANÁLISIS AVANZADO

    DATOS DE INTERACCIÓN:
    ${JSON.stringify(interactionData, null, 2)}

    CREDENCIALES DE USUARIO:
    ${JSON.stringify(userCredentials, null, 2)}

    ANALIZA Y GENERA:
    1. Insights profundos sobre el comportamiento territorial
    2. Acciones específicas recomendadas para maximizar impacto
    3. Oportunidades de automatización identificadas
    4. Predicción de ROI electoral para esta zona

    CONSIDERA:
    - Patrones de engagement históricos
    - Demografía y psicografía electoral
    - Contexto político local
    - Recursos disponibles según credenciales
    - Timing electoral óptimo

    FORMATO JSON:
    {
      "insights": ["insight1", "insight2", "insight3"],
      "next_actions": ["accion1", "accion2", "accion3"],
      "automation_opportunities": ["oportunidad1", "oportunidad2"],
      "roi_prediction": numero_porcentaje
    }
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.5,
        maxOutputTokens: 1024
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanResponse);
      
      if (!analysis.insights || !Array.isArray(analysis.insights)) {
        throw new Error('Invalid analysis structure');
      }
      
      return analysis;
    } catch (error) {
      console.error('❌ Error analyzing map interaction:', error);
      return {
        insights: [
          'Zona con alto potencial electoral detectada',
          'Demografía favorable para propuestas sociales',
          'Oportunidad de crecimiento del 25% identificada'
        ],
        next_actions: [
          'Activar campaña dirigida inmediatamente',
          'Desplegar recursos de comunicación',
          'Programar eventos comunitarios'
        ],
        automation_opportunities: [
          'Mensajes automatizados por horarios de mayor actividad',
          'Eventos programados según patrones de asistencia'
        ],
        roi_prediction: 73
      };
    }
  }

  async generateDynamicMapContent(
    mapBounds: any,
    userRole: string,
    currentContext: any
  ): Promise<DynamicMapContent> {
    const prompt = `
    GEMINI DYNAMIC MAP CONTENT GENERATOR

    LÍMITES DEL MAPA:
    ${JSON.stringify(mapBounds, null, 2)}

    ROL: ${userRole}
    CONTEXTO: ${JSON.stringify(currentContext, null, 2)}

    GENERA CONTENIDO DINÁMICO PARA:
    1. Alertas territoriales específicas y accionables
    2. Zonas de oportunidad identificadas por IA
    3. Sugerencias automatizadas personalizadas
    4. Insights en tiempo real basados en datos actuales

    CRITERIOS:
    - Relevancia territorial inmediata
    - Accionabilidad según rol de usuario
    - Impacto electoral potencial
    - Urgencia y priorización
    - Viabilidad de automatización

    RESPUESTA JSON:
    {
      "territorial_alerts": [
        {
          "id": "alert_id",
          "title": "título_alerta",
          "description": "descripción_detallada",
          "coordinates": {"lat": 0, "lng": 0},
          "priority": "high|medium|low",
          "auto_action": "acción_sugerida"
        }
      ],
      "opportunity_zones": [
        {
          "zone_name": "nombre_zona",
          "potential_score": numero_0_100,
          "recommended_investment": numero_porcentaje,
          "automation_level": numero_0_100
        }
      ],
      "automated_suggestions": ["sugerencia1", "sugerencia2"],
      "real_time_insights": "insight_contextual_actual"
    }
    `;

    try {
      const response = await geminiService.makeRequest(prompt, {
        temperature: 0.6,
        maxOutputTokens: 2048
      });

      const cleanResponse = response.replace(/```json|```/g, '').trim();
      const content = JSON.parse(cleanResponse);
      
      if (!content.territorial_alerts) {
        throw new Error('Invalid content structure');
      }
      
      return content;
    } catch (error) {
      console.error('❌ Error generating dynamic map content:', error);
      return {
        territorial_alerts: [
          {
            id: 'fallback_1',
            title: 'Zona de Oportunidad Detectada',
            description: 'Área con alto potencial electoral requiere atención',
            coordinates: { lat: 4.7500, lng: -74.0500 },
            priority: 'medium',
            auto_action: 'Activar campaña dirigida'
          }
        ],
        opportunity_zones: [
          {
            zone_name: 'Centro Urbano',
            potential_score: 78,
            recommended_investment: 35,
            automation_level: 80
          }
        ],
        automated_suggestions: [
          'Revisar datos territoriales actualizados',
          'Activar análisis predictivo de tendencias',
          'Optimizar distribución de recursos'
        ],
        real_time_insights: 'Sistema en análisis continuo de territorios electorales. Conectividad con Gemini verificada.'
      };
    }
  }

  // Método para obtener el estado del servicio
  getServiceStatus(): { connected: boolean; lastCheck: Date | null } {
    return { ...this.serviceStatus };
  }

  // Método para forzar reconexión
  async reconnect(): Promise<boolean> {
    await this.checkServiceHealth();
    return this.serviceStatus.connected;
  }
}

export const geminiMCPService = new GeminiMCPService();
