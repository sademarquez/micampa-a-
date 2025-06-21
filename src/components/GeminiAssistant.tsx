
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSecureAuth } from '../contexts/SecureAuthContext';
import { geminiService } from '@/services/geminiService';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  Bot, 
  Zap,
  X,
  Minimize2,
  Maximize2,
  HelpCircle,
  Crown,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const GeminiAssistant = () => {
  const { user } = useSecureAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const suggestions = [
    "¿Cómo capturar más votos con IA?",
    "Estrategia para ganar elecciones",
    "Optimizar ROI de campaña",
    "Análisis de competencia electoral"
  ];

  useEffect(() => {
    if (isOpen && conversation.length === 0) {
      const welcomeMessage = user 
        ? `🎯 ¡Hola ${user.name}! Soy tu estratega electoral con IA. Como ${user.role}, puedo ayudarte a dominar tu campaña con análisis predictivo, mensajes que convierten, y automatización que garantiza victorias. ¿Cómo vamos a asegurar tu triunfo electoral?`
        : `👑 ¡Bienvenido al futuro electoral! Soy tu asistente estratégico con Gemini AI. Especializado en campañas ganadoras, análisis de votantes, y automatización que convierte visitantes en votos seguros. ¿Listo para dominar las elecciones?`;
      
      setConversation([
        { role: 'assistant', content: welcomeMessage }
      ]);
    }
  }, [isOpen, user, conversation.length]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    const newConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    setConversation(newConversation);

    try {
      const contextPrompt = `
        Eres el asistente electoral IA más avanzado del mundo para MI CAMPAÑA 2025.
        Usuario: ${user?.name || 'Visitante'} (Rol: ${user?.role || 'visitante'})
        
        CONTEXTO ELECTORAL:
        - Plataforma líder con automatización IA que garantiza victorias
        - Gemini AI + N8N para campañas dominantes
        - ROI promedio +280%, engagement +340%
        - Base demo: 100K+ votantes, 5 candidatos ganadores
        - Análisis predictivo, geolocalización, mensajes que convierten
        
        PERSONALIDAD:
        - Estratega electoral experto y persuasivo
        - Confianza absoluta en resultados
        - Enfoque en ganar elecciones y dominar competencia
        - Tono motivacional pero profesional
        - Usa datos reales para generar confianza
        
        Pregunta: "${userMessage}"
        
        INSTRUCCIONES:
        - Responde como estratega electoral que garantiza victorias
        - Usa ejemplos concretos de la plataforma (candidatos demo, métricas reales)
        - Enfócate en cómo ganar elecciones y derrotar competencia
        - Menciona funcionalidades específicas que aseguran triunfos
        - Sé persuasivo y genera urgencia por actuar
        - Máximo 180 palabras, usa emojis estratégicamente
        
        FORMATO: Solo la respuesta estratégica directa.
      `;

      const response = await geminiService.makeRequest(contextPrompt);
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      
    } catch (error) {
      console.error('Error con Gemini:', error);
      
      const fallbackResponse = `🚀 Temporalmente sin conexión directa con Gemini, pero nuestro sistema sigue operativo al 100%. 

Mientras tanto, recuerda que MI CAMPAÑA 2025 te ofrece:
• IA que convierte visitantes en votos seguros
• Automatización N8N 24/7 con respuestas humanas  
• Análisis predictivo que identifica victorias
• ROI +280% comprobado en campañas reales

¿Quieres que te muestre cómo María González capturó 15,420 votos usando nuestro sistema? 🎯`;
      
      setConversation(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante más elegante y menos intrusivo */}
      {!isOpen && (
        <div className="fixed bottom-8 right-8 z-40">
          <div className="relative group">
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20"
            >
              <Crown className="w-7 h-7 text-white animate-pulse" />
            </Button>
            
            {/* Indicador de actividad */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>

            {/* Tooltip persuasivo */}
            <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white px-4 py-2 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 text-sm font-semibold whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Estratega Electoral IA
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  Garantiza tu victoria electoral
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ventana del asistente mejorada */}
      {isOpen && (
        <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-20' : 'w-[420px] h-[650px]'
        }`}>
          <Card className="h-full flex flex-col bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border-2 border-blue-400/30 shadow-2xl">
            {/* Header mejorado */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 rounded-t-xl border-b border-blue-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      Estratega Electoral IA
                      <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                        ACTIVO
                      </Badge>
                    </CardTitle>
                    {!isMinimized && (
                      <p className="text-xs text-blue-100">
                        Gemini AI • Garantiza Victorias
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-red-500/20 p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Conversación */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-800/50 to-blue-900/50">
                  {conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white' 
                          : 'bg-white/90 text-gray-800 border border-blue-200'
                      }`}>
                        <div className="flex items-start space-x-2 mb-2">
                          {msg.role === 'assistant' && <Crown className="w-4 h-4 text-orange-500 mt-1" />}
                          <p className="text-xs font-semibold">
                            {msg.role === 'user' ? 'Tú' : 'Estratega IA'}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/90 p-4 rounded-2xl max-w-[85%] border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Crown className="w-4 h-4 text-orange-500" />
                          <p className="text-xs font-semibold">Estratega IA</p>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Sugerencias mejoradas */}
                {conversation.length <= 1 && (
                  <div className="p-4 border-t border-blue-400/30 bg-gradient-to-r from-slate-800/50 to-blue-900/50">
                    <p className="text-xs text-blue-200 mb-3 font-semibold">🎯 Preguntas estratégicas:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer text-xs hover:bg-blue-600 hover:text-white hover:border-blue-400 transition-all duration-200 p-2 text-center border-blue-400/50 text-blue-200"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input mejorado */}
                <div className="p-4 border-t border-blue-400/30 bg-gradient-to-r from-slate-800/50 to-blue-900/50">
                  <div className="flex space-x-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="¿Cómo garantizamos tu victoria electoral?"
                      disabled={isLoading}
                      className="flex-1 bg-white/90 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-blue-300 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Powered by Gemini AI
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <Target className="w-3 h-3" />
                      ROI +280%
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
