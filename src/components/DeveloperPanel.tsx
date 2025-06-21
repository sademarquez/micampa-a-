import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GeminiElectoralService } from "@/services/geminiService";
import { 
  Eye, 
  EyeOff, 
  KeyRound, 
  RadioTower, 
  Cloud, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Zap,
  Shield,
  Database
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function DeveloperPanel() {
  const { toast } = useToast();
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiProApiKey, setGeminiProApiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showGeminiProKey, setShowGeminiProKey] = useState(false);
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [isTestingGeminiPro, setIsTestingGeminiPro] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    gemini: 'idle' | 'testing' | 'success' | 'error' | 'quota';
    geminiPro: 'idle' | 'testing' | 'success' | 'error' | 'quota';
  }>({
    gemini: 'idle',
    geminiPro: 'idle'
  });

  // Cargar claves guardadas al montar el componente
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('geminiApiKey');
    const savedGeminiProKey = localStorage.getItem('geminiProApiKey');
    
    if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
    if (savedGeminiProKey) setGeminiProApiKey(savedGeminiProKey);
  }, []);

  const saveApiKey = (key: string, type: 'gemini' | 'geminiPro') => {
    const storageKey = type === 'gemini' ? 'geminiApiKey' : 'geminiProApiKey';
    localStorage.setItem(storageKey, key);
    
    toast({
      title: "✅ Clave guardada",
      description: `La clave de ${type === 'gemini' ? 'Gemini' : 'Gemini Pro'} ha sido guardada exitosamente.`,
      duration: 3000,
    });
  };

  const handleTestGeminiConnection = async () => {
    if (!geminiApiKey.trim()) {
      toast({
        title: "❌ Error",
        description: "Por favor, ingresa una clave de API de Gemini primero.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingGemini(true);
    setConnectionStatus(prev => ({ ...prev, gemini: 'testing' }));

    try {
      const geminiService = new GeminiElectoralService(geminiApiKey);
      const response = await geminiService.makeRequest(
        "Responde solo con 'OK' si puedes leer este mensaje."
      );

      if (response && response.includes('OK')) {
        setConnectionStatus(prev => ({ ...prev, gemini: 'success' }));
        toast({
          title: "✅ Conexión exitosa",
          description: "La conexión con Gemini API está funcionando correctamente.",
          duration: 4000,
        });
      } else {
        throw new Error("Respuesta inesperada de la API");
      }
    } catch (error: any) {
      console.error("Error testing Gemini connection:", error);
      
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setConnectionStatus(prev => ({ ...prev, gemini: 'quota' }));
        toast({
          title: "⚠️ Límite de cuota alcanzado",
          description: "Has superado el límite de peticiones gratuitas. Intenta de nuevo en unos minutos.",
          duration: 5000,
        });
      } else {
        setConnectionStatus(prev => ({ ...prev, gemini: 'error' }));
        toast({
          title: "❌ Error de conexión",
          description: error.message || "No se pudo conectar con Gemini API. Verifica tu clave.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } finally {
      setIsTestingGemini(false);
    }
  };

  const handleTestGeminiProConnection = async () => {
    if (!geminiProApiKey.trim()) {
      toast({
        title: "❌ Error",
        description: "Por favor, ingresa una clave de API de Gemini Pro primero.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingGeminiPro(true);
    setConnectionStatus(prev => ({ ...prev, geminiPro: 'testing' }));

    try {
      const geminiService = new GeminiElectoralService(geminiProApiKey);
      const response = await geminiService.makeRequest(
        "Responde solo con 'OK' si puedes leer este mensaje."
      );

      if (response && response.includes('OK')) {
        setConnectionStatus(prev => ({ ...prev, geminiPro: 'success' }));
        toast({
          title: "✅ Conexión exitosa",
          description: "La conexión con Gemini Pro API está funcionando correctamente.",
          duration: 4000,
        });
      } else {
        throw new Error("Respuesta inesperada de la API");
      }
    } catch (error: any) {
      console.error("Error testing Gemini Pro connection:", error);
      
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setConnectionStatus(prev => ({ ...prev, geminiPro: 'quota' }));
        toast({
          title: "⚠️ Límite de cuota alcanzado",
          description: "Has superado el límite de peticiones gratuitas. Intenta de nuevo en unos minutos.",
          duration: 5000,
        });
      } else {
        setConnectionStatus(prev => ({ ...prev, geminiPro: 'error' }));
        toast({
          title: "❌ Error de conexión",
          description: error.message || "No se pudo conectar con Gemini Pro API. Verifica tu clave.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } finally {
      setIsTestingGeminiPro(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'testing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Probando...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-700">Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'quota':
        return <Badge variant="outline" className="border-orange-300 text-orange-600">Cuota agotada</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500">No probado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración de IA</h2>
          <p className="text-gray-600">Configura tus claves de API para habilitar las funcionalidades de IA</p>
        </div>
      </div>

      {/* Gemini Standard */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Google Gemini (Estándar)</span>
                {getStatusBadge(connectionStatus.gemini)}
              </div>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Modelo gratuito para funcionalidades básicas de IA
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-api-key" className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Clave de API
            </Label>
            <div className="relative">
              <Input
                id="gemini-api-key"
                type={showGeminiKey ? "text" : "password"}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Ingresa tu clave de API de Gemini"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
              >
                {showGeminiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => saveApiKey(geminiApiKey, 'gemini')}
              variant="outline"
              className="flex-1"
              disabled={!geminiApiKey.trim()}
            >
              <Shield className="w-4 h-4 mr-2" />
              Guardar Clave
            </Button>
            <Button
              onClick={handleTestGeminiConnection}
              disabled={isTestingGemini || !geminiApiKey.trim()}
              className="flex-1"
            >
              {isTestingGemini ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <RadioTower className="w-4 h-4 mr-2" />
                  Probar Conexión
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Gemini Pro */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Cloud className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Google Gemini Pro</span>
                {getStatusBadge(connectionStatus.geminiPro)}
              </div>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Modelo avanzado para funcionalidades premium (requiere plan de pago)
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-pro-api-key" className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Clave de API Pro
            </Label>
            <div className="relative">
              <Input
                id="gemini-pro-api-key"
                type={showGeminiProKey ? "text" : "password"}
                value={geminiProApiKey}
                onChange={(e) => setGeminiProApiKey(e.target.value)}
                placeholder="Ingresa tu clave de API de Gemini Pro"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowGeminiProKey(!showGeminiProKey)}
              >
                {showGeminiProKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => saveApiKey(geminiProApiKey, 'geminiPro')}
              variant="outline"
              className="flex-1"
              disabled={!geminiProApiKey.trim()}
            >
              <Shield className="w-4 h-4 mr-2" />
              Guardar Clave
            </Button>
            <Button
              onClick={handleTestGeminiProConnection}
              disabled={isTestingGeminiPro || !geminiProApiKey.trim()}
              className="flex-1"
            >
              {isTestingGeminiPro ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <RadioTower className="w-4 h-4 mr-2" />
                  Probar Conexión
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Información importante</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Las claves se guardan localmente en tu navegador</li>
                <li>• El plan gratuito de Gemini tiene límites de uso diario</li>
                <li>• Para uso intensivo, considera actualizar a un plan de pago</li>
                <li>• Las claves nunca se comparten con terceros</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 