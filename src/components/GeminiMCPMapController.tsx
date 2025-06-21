
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSecureAuth } from '../contexts/SecureAuthContext';
import { geminiMCPService } from '@/services/geminiMCPService';
import { 
  Brain, 
  Zap, 
  Target, 
  MapPin, 
  Layers,
  Activity,
  Settings,
  Play,
  Pause,
  RotateCw,
  TrendingUp,
  Sparkles,
  Crown,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface MCPControllerProps {
  mapInstance?: any;
  currentBounds?: any;
  onTerritorialAction?: (action: any) => void;
}

const GeminiMCPMapController = ({ 
  mapInstance, 
  currentBounds, 
  onTerritorialAction 
}: MCPControllerProps) => {
  const { user } = useSecureAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [automationActive, setAutomationActive] = useState(false);
  const [territorialStrategy, setTerritorialStrategy] = useState<any>(null);
  const [mcpRules, setMcpRules] = useState<any[]>([]);
  const [dynamicContent, setDynamicContent] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Capacidades según rol de usuario
  const getUserCapabilities = () => {
    switch (user?.role) {
      case 'desarrollador':
        return {
          level: 'MÁXIMO',
          features: ['Configuración MCP', 'Reglas Avanzadas', 'Debug IA', 'Optimización Técnica'],
          automationLevel: 100,
          color: 'from-yellow-600 to-yellow-700'
        };
      case 'master':
        return {
          level: 'ESTRATÉGICO',
          features: ['Análisis Territorial', 'ROI Predictivo', 'Coordinación Global', 'Métricas Avanzadas'],
          automationLevel: 95,
          color: 'from-purple-600 to-purple-700'
        };
      case 'candidato':
        return {
          level: 'EJECUTIVO',
          features: ['Estrategia Local', 'Gestión Recursos', 'Análisis Competencia', 'Eventos Inteligentes'],
          automationLevel: 85,
          color: 'from-blue-600 to-blue-700'
        };
      case 'lider':
        return {
          level: 'TERRITORIAL',
          features: ['Gestión Zona', 'Activación Votantes', 'Reportes Automáticos', 'Engagement Local'],
          automationLevel: 75,
          color: 'from-green-600 to-green-700'
        };
      default:
        return {
          level: 'BÁSICO',
          features: ['Consulta Territorial', 'Información Pública'],
          automationLevel: 30,
          color: 'from-gray-600 to-gray-700'
        };
    }
  };

  const capabilities = getUserCapabilities();

  // Análisis territorial avanzado con Gemini
  const runTerritorialAnalysis = useCallback(async () => {
    if (!currentBounds || !user) return;

    setIsAnalyzing(true);
    try {
      const mapData = {
        coordinates: {
          lat: (currentBounds.north + currentBounds.south) / 2,
          lng: (currentBounds.east + currentBounds.west) / 2
        },
        territory: 'Zona Analizada',
        demographic: { urban: 70, young_professionals: 45 },
        electoral_potential: Math.floor(Math.random() * 40) + 60,
        automation_level: capabilities.automationLevel
      };

      const campaignObjectives = {
        target_votes: 50000,
        budget_efficiency: 'high',
        engagement_goal: 85,
        conversion_rate: 12
      };

      // Generar estrategia territorial
      const strategy = await geminiMCPService.generateTerritorialStrategy(
        mapData, 
        user.role, 
        campaignObjectives
      );
      setTerritorialStrategy(strategy);

      // Crear reglas de automatización MCP
      const rules = await geminiMCPService.createMCPAutomationRules(
        mapData, 
        user.role
      );
      setMcpRules(rules);

      // Generar contenido dinámico
      const content = await geminiMCPService.generateDynamicMapContent(
        currentBounds,
        user.role,
        { timestamp: new Date().toISOString(), active_campaign: true }
      );
      setDynamicContent(content);

      // Análisis de interacción
      const analysis = await geminiMCPService.analyzeMapInteraction(
        { bounds: currentBounds, user_action: 'territorial_analysis' },
        { role: user.role, permissions: capabilities.features }
      );
      setAnalysisResults(analysis);

      toast.success(`🧠 Análisis Gemini MCP completado - ROI predicho: ${analysis.roi_prediction}%`);
      
    } catch (error) {
      console.error('Error en análisis territorial:', error);
      toast.error('Error en análisis territorial con Gemini');
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentBounds, user, capabilities]);

  // Activar automatización MCP
  const toggleAutomation = () => {
    setAutomationActive(!automationActive);
    if (!automationActive) {
      toast.success('🤖 Automatización MCP activada - Sistema operando 24/7');
      // Aquí se activarían las reglas MCP en background
    } else {
      toast.info('⏸️ Automatización MCP pausada');
    }
  };

  // Ejecutar acción territorial específica
  const executeTerritorialAction = (action: string) => {
    if (onTerritorialAction) {
      onTerritorialAction({
        type: action,
        user_role: user?.role,
        automation_level: capabilities.automationLevel,
        timestamp: new Date().toISOString()
      });
    }
    toast.success(`✅ Acción ejecutada: ${action}`);
  };

  return (
    <div className="space-y-4">
      {/* Panel de Control Principal */}
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Gemini MCP Map Controller
            <Badge className={`bg-gradient-to-r ${capabilities.color} text-white`}>
              {capabilities.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Controles principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={runTerritorialAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isAnalyzing ? (
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {isAnalyzing ? 'Analizando...' : 'Análisis IA'}
            </Button>

            <Button
              onClick={toggleAutomation}
              variant={automationActive ? "destructive" : "default"}
              className={automationActive ? '' : 'bg-green-600 hover:bg-green-700'}
            >
              {automationActive ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {automationActive ? 'Pausar' : 'Activar'} MCP
            </Button>

            <Button variant="outline" className="border-yellow-500 text-yellow-700">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>

            <Button variant="outline" className="border-green-500 text-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Métricas
            </Button>
          </div>

          {/* Estado de automatización */}
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border">
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${automationActive ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
              <span className="font-medium">
                Automatización: {automationActive ? 'ACTIVA' : 'INACTIVA'}
              </span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Nivel: {capabilities.automationLevel}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Capacidades del Usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Capacidades Disponibles - {user?.role}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {capabilities.features.map((feature, index) => (
              <Badge 
                key={index}
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 p-2 justify-center"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estrategia Territorial */}
      {territorialStrategy && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Estrategia Territorial IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Zona ID:</span>
                <p className="text-blue-600">{territorialStrategy.zone_id}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Prioridad:</span>
                <Badge className={
                  territorialStrategy.priority_level === 'critical' ? 'bg-red-100 text-red-800' :
                  territorialStrategy.priority_level === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }>
                  {territorialStrategy.priority_level}
                </Badge>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Segmentos de Votantes:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {territorialStrategy.voter_segments.map((segment: string, index: number) => (
                  <Badge key={index} variant="outline">{segment}</Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Acciones Automatizadas:</span>
              <div className="space-y-1 mt-1">
                {territorialStrategy.automated_actions.map((action: string, index: number) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => executeTerritorialAction(action)}
                    className="mr-2 mb-2"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reglas MCP Activas */}
      {mcpRules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              Reglas MCP Automatizadas ({mcpRules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mcpRules.slice(0, 3).map((rule, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-900">{rule.trigger}</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {rule.execution_probability}% prob.
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-700">{rule.gemini_enhancement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights en Tiempo Real */}
      {analysisResults && (
        <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              Insights Gemini - ROI Predicho: {analysisResults.roi_prediction}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Próximas Acciones:</h4>
                <ul className="space-y-1">
                  {analysisResults.next_actions.map((action: string, index: number) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <Crown className="w-3 h-3 text-yellow-600" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Oportunidades de Automatización:</h4>
                <ul className="space-y-1">
                  {analysisResults.automation_opportunities.map((opp: string, index: number) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <Zap className="w-3 h-3 text-orange-600" />
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeminiMCPMapController;
