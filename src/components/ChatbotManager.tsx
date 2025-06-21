import { useState, useEffect } from 'react';
import { useSecureAuth } from '@/contexts/SecureAuthContext';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface BotConfig {
  botId: string;
  name: string;
  role: string;
  personality: string;
  knowledgeBase: string[];
  activeHours: {
    start: string;
    end: string;
  };
}

const ChatbotManager = () => {
  const { user } = useSecureAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>>([]);

  // Configurar bot según el rol del usuario
  useEffect(() => {
    if (!user) return;

    const getBotConfig = (): BotConfig => {
      switch (user.role) {
        case 'desarrollador':
          return {
            botId: 'dev-bot-001',
            name: 'TechBot',
            role: 'Asistente Técnico',
            personality: 'Experto en desarrollo y sistemas',
            knowledgeBase: ['desarrollo', 'sistemas', 'debugging', 'arquitectura'],
            activeHours: { start: '00:00', end: '23:59' }
          };
        case 'master':
          return {
            botId: 'master-bot-001',
            name: 'MasterBot',
            role: 'Estratega de Campaña',
            personality: 'Experto en gestión y estrategia electoral',
            knowledgeBase: ['estrategia', 'gestión', 'análisis', 'campañas'],
            activeHours: { start: '06:00', end: '22:00' }
          };
        case 'candidato':
          return {
            botId: 'candidate-bot-001',
            name: 'LeaderBot',
            role: 'Asistente de Liderazgo',
            personality: 'Apoyo en liderazgo y toma de decisiones',
            knowledgeBase: ['liderazgo', 'propuestas', 'eventos', 'comunicación'],
            activeHours: { start: '07:00', end: '21:00' }
          };
        case 'lider':
          return {
            botId: 'leader-bot-001',
            name: 'CoordBot',
            role: 'Coordinador Territorial',
            personality: 'Especialista en gestión territorial y equipos',
            knowledgeBase: ['coordinación', 'territorios', 'equipos', 'logística'],
            activeHours: { start: '08:00', end: '20:00' }
          };
        case 'votante':
          return {
            botId: 'voter-bot-001',
            name: 'SupportBot',
            role: 'Asistente de Apoyo',
            personality: 'Guía amigable para colaboradores',
            knowledgeBase: ['tareas', 'eventos', 'participación', 'comunidad'],
            activeHours: { start: '09:00', end: '19:00' }
          };
        default:
          return {
            botId: 'general-bot-001',
            name: 'InfoBot',
            role: 'Asistente General',
            personality: 'Información general sobre la campaña',
            knowledgeBase: ['información', 'propuestas', 'eventos', 'contacto'],
            activeHours: { start: '08:00', end: '18:00' }
          };
      }
    };

    setBotConfig(getBotConfig());
  }, [user]);

  // Verificar si el bot está activo según las horas configuradas
  const isBotActive = (): boolean => {
    if (!botConfig) return false;
    
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    return currentTime >= botConfig.activeHours.start && currentTime <= botConfig.activeHours.end;
  };

  // Simular respuesta del bot (en producción se conectaría a N8N)
  const getBotResponse = async (userMessage: string): Promise<string> => {
    if (!botConfig || !isBotActive()) {
      return `Lo siento, ${botConfig?.name || 'el asistente'} no está disponible en este momento. Horario de atención: ${botConfig?.activeHours.start} - ${botConfig?.activeHours.end}`;
    }

    // Simular delay de respuesta
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Respuestas contextuales según el rol
    const responses = {
      desarrollador: [
        'Como desarrollador, puedo ayudarte con la arquitectura del sistema.',
        'Revisa los logs del sistema para más detalles técnicos.',
        'El sistema está funcionando correctamente según los indicadores.'
      ],
      master: [
        'Como estratega, te recomiendo revisar los datos territoriales.',
        'La campaña está progresando según los objetivos planteados.',
        'Considera ajustar la estrategia en las zonas de menor penetración.'
      ],
      candidato: [
        'Como tu asistente de liderazgo, te sugiero revisar el estado de los equipos.',
        'Los resultados de la campaña muestran un avance positivo.',
        'Es recomendable programar más eventos en territorios clave.'
      ],
      lider: [
        'Como coordinador territorial, puedo ayudarte con la gestión de tu zona.',
        'Revisa las tareas pendientes de tu equipo.',
        'Los votantes en tu territorio muestran buen nivel de compromiso.'
      ],
      votante: [
        'Como tu asistente de apoyo, estoy aquí para guiarte.',
        'Revisa tus tareas asignadas en el panel principal.',
        'Tu participación es valiosa para el éxito de la campaña.'
      ]
    };

    const roleResponses = responses[user?.role as keyof typeof responses] || [
      'Gracias por tu mensaje. ¿En qué puedo ayudarte?',
      'Estoy aquí para apoyarte en lo que necesites.',
      'Puedes consultar la información disponible en el sistema.'
    ];

    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Obtener respuesta del bot
    const botResponse = await getBotResponse(text);
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);

    // Tracking para analytics
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'Bot Interaction',
        content_category: user?.role,
        value: 1.00
      });
    }

    if (window.gtag) {
      window.gtag('event', 'bot_interaction', {
        bot_name: botConfig?.name,
        user_role: user?.role,
        message_length: text.length
      });
    }
  };

  if (!botConfig) return null;

  return (
    <>
      {/* Botón flotante del chatbot */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-gold shadow-gold-dark z-50 animate-float"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Panel del chatbot */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-80 h-96 shadow-elegant z-50 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-96'
        }`}>
          <CardHeader className="p-3 bg-gradient-gold text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold text-sm">{botConfig.name}</h3>
                  <p className="text-xs opacity-90">{botConfig.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-6 h-6 p-0 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-3 flex flex-col h-full">
              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto mb-3 space-y-2">
                {messages.length === 0 && (
                  <div className="text-center text-slate-500 text-sm py-4">
                    <p>¡Hola! Soy <strong>{botConfig.name}</strong></p>
                    <p>{botConfig.personality}</p>
                    <p className="text-xs mt-2">¿En qué puedo ayudarte?</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-xs ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input para mensajes */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 text-xs border rounded-lg input-elegant"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="btn-gold text-xs"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                    if (input) {
                      sendMessage(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Enviar
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatbotManager;
