
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { geminiService } from "@/services/geminiService";
import { 
  Satellite,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MapPin,
  Globe,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const GeminiMapTester = () => {
  const [isTestingMap, setIsTestingMap] = useState(false);
  const [mapTestResult, setMapTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error',
    message: string,
    canAccessMaps: boolean
  }>({
    status: 'idle',
    message: '',
    canAccessMaps: false
  });

  const testGeminiMapAccess = async () => {
    setIsTestingMap(true);
    setMapTestResult({ status: 'testing', message: 'Probando acceso a mapas...', canAccessMaps: false });

    try {
      const mapTestPrompt = `
        Eres un asistente de MI CAMPAÑA 2025 con acceso a información geográfica.
        
        PREGUNTA DE PRUEBA:
        ¿Puedes proporcionar información sobre coordenadas geográficas y datos satelitales para análisis electoral?
        
        INSTRUCCIONES:
        - Si tienes acceso a información geográfica, responde: "SÍ - Acceso confirmado a datos geográficos"
        - Si no tienes acceso, responde: "NO - Sin acceso a datos satelitales"
        - Menciona brevemente qué tipo de análisis geográfico podrías realizar
        
        Responde en máximo 100 palabras.
      `;

      const response = await geminiService.makeRequest(mapTestPrompt);
      
      if (response && response.length > 0) {
        const hasMapAccess = response.toUpperCase().includes('SÍ') || 
                            response.toLowerCase().includes('acceso confirmado') ||
                            response.toLowerCase().includes('coordenadas') ||
                            response.toLowerCase().includes('geográfic');
        
        setMapTestResult({
          status: 'success',
          message: response,
          canAccessMaps: hasMapAccess
        });

        if (hasMapAccess) {
          toast.success("🗺️ Gemini AI tiene acceso a información geográfica");
        } else {
          toast.info("ℹ️ Gemini AI está activo pero con acceso limitado a mapas");
        }
      } else {
        throw new Error("Respuesta vacía de Gemini");
      }
    } catch (error) {
      setMapTestResult({
        status: 'error',
        message: `Error conectando con Gemini: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        canAccessMaps: false
      });
      toast.error("❌ Error probando acceso a mapas con Gemini");
    } finally {
      setIsTestingMap(false);
    }
  };

  const getStatusIcon = () => {
    switch (mapTestResult.status) {
      case 'testing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'success':
        return mapTestResult.canAccessMaps 
          ? <CheckCircle className="w-5 h-5 text-green-600" />
          : <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Satellite className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (mapTestResult.status) {
      case 'success':
        return mapTestResult.canAccessMaps 
          ? 'border-green-200 bg-green-50'
          : 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'testing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="campaign-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Test de Acceso: Gemini + Mapas Satelitales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              <Zap className="w-3 h-3 mr-1" />
              Gemini AI
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              <Satellite className="w-3 h-3 mr-1" />
              Mapas
            </Badge>
          </div>
          
          <Button
            onClick={testGeminiMapAccess}
            disabled={isTestingMap}
            className="btn-modern-primary"
          >
            {isTestingMap ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <Satellite className="w-4 h-4 mr-2" />
                Probar Acceso
              </>
            )}
          </Button>
        </div>

        {/* Resultado del test */}
        {mapTestResult.status !== 'idle' && (
          <div className={`p-4 rounded-xl border-2 ${getStatusColor()}`}>
            <div className="flex items-start gap-3">
              {getStatusIcon()}
              <div className="flex-1">
                <h4 className="font-medium mb-2">
                  {mapTestResult.status === 'testing' && 'Verificando Conexión...'}
                  {mapTestResult.status === 'success' && mapTestResult.canAccessMaps && '✅ Acceso a Mapas Confirmado'}
                  {mapTestResult.status === 'success' && !mapTestResult.canAccessMaps && '⚠️ Acceso Limitado'}
                  {mapTestResult.status === 'error' && '❌ Error de Conexión'}
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  {mapTestResult.message}
                </p>
                
                {mapTestResult.status === 'success' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Badge 
                      variant={mapTestResult.canAccessMaps ? "default" : "outline"}
                      className={mapTestResult.canAccessMaps ? "bg-green-100 text-green-800" : ""}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {mapTestResult.canAccessMaps ? 'Mapas OK' : 'Sin Mapas'}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      API Activa
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info adicional */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="mb-1">
            <strong>Nota técnica:</strong> Este test verifica si Gemini AI puede procesar consultas geográficas.
          </p>
          <p>
            Para mapas satelitales completos, considera integrar Google Maps API o Mapbox directamente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiMapTester;
