import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "../contexts/AuthContext";
import { 
  MessageSquare, 
  Send, 
  Bot,
  User,
  Loader2,
  Minimize2,
  X,
  Crown,
  Building2,
  Users,
  UserCheck,
  Star,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply';
}

interface ChatbotProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

const Chatbot = ({ isMinimized = false, onToggleMinimize, onClose }: ChatbotProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Key de Gemini configurada
  const GEMINI_API_KEY = "AIzaSyDaq-_E5FQtTF0mfJsohXvT2OHMgldjq14";

  const getWelcomeMessage = () => {
    const baseMessage = '🚀 ¡Hola! Soy tu asistente IA especializado de MI CAMPAÑA 2025. Powered by Gemini AI.';
    
    switch (user?.role) {
      case 'desarrollador':
        return `${baseMessage} Como desarrollador, tengo acceso completo a análisis técnicos, configuraciones N8N, optimización del ecosistema y diagnósticos avanzados.`;
      case 'master':
        return `${baseMessage} Como Master de Campaña, manejo estadísticas estratégicas completas, análisis de rendimiento territorial, coordinación de candidatos y métricas de engagement en tiempo real.`;
      case 'candidato':
        return `${baseMessage} Como candidato, te apoyo con estrategias de comunicación inteligente, análisis de territorio, coordinación con líderes, preparación de eventos y seguimiento de objetivos.`;
      case 'lider':
        return `${baseMessage} Como líder territorial, te asisto con gestión inteligente de votantes, organización de actividades locales, reportes automatizados y coordinación estratégica.`;
      case 'votante':
        return `${baseMessage} Como votante activo, te guío con tus tareas personalizadas, eventos próximos, formas de participar más efectivamente y conexión con tu comunidad.`;
      default:
        return `${baseMessage} Estoy aquí para ayudarte con información sobre nuestras propuestas, transparencia y honestidad. ¿En qué puedo apoyarte?`;
    }
  };

  const getQuickReplies = () => {
    const baseReplies = ["💡 Propuestas de campaña", "👤 Información del candidato"];
    
    switch (user?.role) {
      case 'desarrollador':
        return [...baseReplies, "⚡ Estado del sistema", "🔧 Configurar N8N", "📊 Analytics técnicos", "🔍 Debug avanzado"];
      case 'master':
        return [...baseReplies, "🎯 Estrategia general", "📈 Métricas de candidatos", "💰 ROI de campaña", "🗺️ Análisis territorial"];
      case 'candidato':
        return [...baseReplies, "👥 Mi equipo territorial", "📅 Próximos eventos", "🎯 Estrategia local", "📊 Reportes de progreso"];
      case 'lider':
        return [...baseReplies, "🗳️ Gestionar votantes", "🎪 Organizar evento", "📝 Reportar actividades", "📞 Contactar candidato"];
      case 'votante':
        return [...baseReplies, "✅ Mis tareas", "📅 Eventos próximos", "🤝 Cómo ayudar más", "🏆 Mi progreso"];
      default:
        return [...baseReplies, "❓ Cómo puedo ayudar", "📅 Eventos próximos", "🚨 Denuncias y reportes"];
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'desarrollador': return Star;
      case 'master': return Crown;
      case 'candidato': return Building2;
      case 'lider': return Users;
      case 'votante': return UserCheck;
      default: return Bot;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'desarrollador': return 'from-yellow-600 to-yellow-700';
      case 'master': return 'from-purple-600 to-purple-700';
      case 'candidato': return 'from-blue-600 to-blue-700';
      case 'lider': return 'from-green-600 to-green-700';
      case 'votante': return 'from-gray-600 to-gray-700';
      default: return 'from-blue-600 to-blue-700';
    }
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'desarrollador': return 'Asistente IA Técnico';
      case 'master': return 'Asistente IA Estratégico Master';
      case 'candidato': return 'Asistente IA de Candidato';
      case 'lider': return 'Asistente IA Territorial';
      case 'votante': return 'Asistente IA Personal';
      default: return 'Asistente IA MI CAMPAÑA';
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: getWelcomeMessage(),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user?.role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const roleContext = {
        desarrollador: "Eres un asistente IA técnico especializado en sistemas de campaña, N8N, análisis de datos, optimización técnica y diagnósticos avanzados.",
        master: "Eres un asistente IA estratégico de alta gerencia, especializado en análisis territorial, coordinación de candidatos, métricas de campaña, ROI político y gestión estratégica.",
        candidato: "Eres un asistente IA de candidato, especializado en estrategia local inteligente, comunicación política, gestión de equipo territorial y eventos de campaña.",
        lider: "Eres un asistente IA territorial, especializado en gestión inteligente de votantes, organización comunitaria, reportes locales automatizados y coordinación con candidatos.",
        votante: "Eres un asistente IA personal de campaña, especializado en motivar participación, explicar tareas, conectar con la comunidad, gamificación y engagement."
      };

      const prompt = `${roleContext[user?.role as keyof typeof roleContext] || roleContext.votante}
      
      Contexto de MI CAMPAÑA 2025:
      - Usuario actual: ${user?.name} (${user?.role})
      - Lema: "MI CAMPAÑA 2025 - Transparencia y Honestidad"
      - Sistema integrado con IA Gemini para análisis inteligente
      - Enfoque en datos en tiempo real y métricas estratégicas
      - Ecosistema completo: Master > Candidatos > Líderes > Votantes
      - Colores serios y opacos con fondo blanco
      - Publicidad no intrusiva y práctica útil
      
      Información por rol:
      - Desarrollador: Acceso total al sistema, configuración N8N, análisis técnico con IA
      - Master: Visión estratégica completa, métricas de todos los candidatos, ROI inteligente
      - Candidato: Gestión de territorio específico, equipo de líderes, eventos locales con IA
      - Líder: Base de datos de votantes, actividades territoriales, reportes automáticos
      - Votante: Tareas personalizadas, eventos próximos, progreso individual gamificado
      
      Responde como el asistente IA especializado para este rol específico.
      Pregunta del usuario: ${userMessage}
      
      Responde máximo en 150 palabras con un enfoque profesional, motivador y estratégico, usando emojis apropiados:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Respuesta inesperada de Gemini:', data);
        return "🤖 Disculpa, estoy procesando tu mensaje. ¿Puedes intentar de nuevo?";
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "⚠️ Temporalmente tengo dificultades técnicas. MI CAMPAÑA 2025 sigue activa y transparente. ¿Puedes intentar más tarde?";
    }
  };

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await generateBotResponse(message);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "🔧 Hubo un error al generar la respuesta. MI CAMPAÑA 2025 sigue funcionando. Por favor intenta de nuevo.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const RoleIcon = getRoleIcon();

  if (isMinimized) {
    return (
      <Card className={`fixed bottom-4 right-4 w-16 h-16 cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-white`} onClick={onToggleMinimize}>
        <CardContent className={`p-0 h-full flex items-center justify-center bg-gradient-to-r ${getRoleColor()} rounded-lg relative`}>
          <RoleIcon className="w-8 h-8 text-white" />
          <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-2xl border-slate-200 bg-white z-50">
      <CardHeader className={`bg-gradient-to-r ${getRoleColor()} text-white rounded-t-lg p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RoleIcon className="w-6 h-6" />
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <div>
              <CardTitle className="text-lg">{getRoleTitle()}</CardTitle>
              <p className="text-xs opacity-90">{user?.name}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleMinimize}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Badge className="bg-white/20 text-white w-fit">
          🚀 Transparencia y Honestidad 2025 | Powered by Gemini AI
        </Badge>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[400px] bg-white">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? `bg-gradient-to-r ${getRoleColor()} text-white`
                      : 'bg-slate-100 text-slate-800'
                  } shadow-sm`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <RoleIcon className="w-4 h-4 mt-1 text-slate-600" />}
                    {message.sender === 'user' && <User className="w-4 h-4 mt-1 text-white" />}
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <RoleIcon className="w-4 h-4 text-slate-600" />
                    <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-slate-600">Analizando con IA...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {getQuickReplies().map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className={`text-xs border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:${getRoleColor()} hover:text-white`}
              >
                {reply}
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="border-slate-300 focus:border-slate-500"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className={`bg-gradient-to-r ${getRoleColor()}`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
