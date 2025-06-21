
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Plus,
  Filter
} from "lucide-react";

interface Message {
  id: string;
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'sent' | 'delivered';
  category: 'general' | 'emergency' | 'coordination' | 'event' | 'campaign';
  created_at: string;
  sent_at?: string;
  sender_id: string;
}

const SistemaMensajeria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState<{
    subject: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
    category: 'general' | 'emergency' | 'coordination' | 'event' | 'campaign';
  }>({
    subject: '',
    content: '',
    priority: 'medium',
    category: 'general'
  });

  const { data: messages = [], isLoading, refetch } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async (): Promise<Message[]> => {
      if (!user) return [];

      console.log('📨 Consultando mensajes...');
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error consultando mensajes:', error);
        throw error;
      }

      console.log('✅ Mensajes obtenidos:', data?.length || 0);
      
      // Map database types to interface types
      return (data || []).map(msg => ({
        id: msg.id,
        subject: msg.subject,
        content: msg.content,
        priority: ['low', 'medium', 'high'].includes(msg.priority) ? msg.priority as 'low' | 'medium' | 'high' : 'medium',
        status: ['draft', 'sent', 'delivered'].includes(msg.status) ? msg.status as 'draft' | 'sent' | 'delivered' : 'sent',
        category: ['general', 'emergency', 'coordination', 'event', 'campaign'].includes(msg.category) ? msg.category as 'general' | 'emergency' | 'coordination' | 'event' | 'campaign' : 'general',
        created_at: msg.created_at,
        sent_at: msg.sent_at,
        sender_id: msg.sender_id
      }));
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const handleSendMessage = async () => {
    if (!user || !newMessage.subject.trim() || !newMessage.content.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('📤 Enviando mensaje...');
      
      const { error } = await supabase
        .from('messages')
        .insert({
          subject: newMessage.subject.trim(),
          content: newMessage.content.trim(),
          priority: newMessage.priority,
          category: newMessage.category,
          status: 'sent',
          sent_at: new Date().toISOString(),
          sender_id: user.id
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Mensaje enviado",
        description: "El mensaje ha sido enviado exitosamente",
      });

      // Limpiar formulario
      setNewMessage({
        subject: '',
        content: '',
        priority: 'medium',
        category: 'general'
      });
      setShowNewMessage(false);
      
      // Recargar mensajes
      refetch();
      
      console.log('✅ Mensaje enviado exitosamente');
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'draft': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando mensajes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón nuevo mensaje */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sistema de Mensajería</h2>
          <p className="text-slate-600">Comunícate con tu equipo de campaña</p>
        </div>
        <Button
          onClick={() => setShowNewMessage(true)}
          className="bg-slate-600 hover:bg-slate-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Mensaje
        </Button>
      </div>

      {/* Formulario nuevo mensaje */}
      {showNewMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Nuevo Mensaje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Asunto</label>
              <Input
                placeholder="Asunto del mensaje..."
                value={newMessage.subject}
                onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prioridad</label>
                <Select 
                  value={newMessage.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setNewMessage(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <Select 
                  value={newMessage.category} 
                  onValueChange={(value: 'general' | 'emergency' | 'coordination' | 'event' | 'campaign') => 
                    setNewMessage(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                    <SelectItem value="coordination">Coordinación</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="campaign">Campaña</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contenido</label>
              <Textarea
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
                value={newMessage.content}
                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowNewMessage(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSendMessage}
                className="bg-slate-600 hover:bg-slate-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de mensajes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Mensajes Enviados ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No has enviado mensajes aún</p>
              <p className="text-sm mt-2">
                Usa el botón "Nuevo Mensaje" para empezar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {message.subject}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusIcon(message.status)}
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>Categoría: {message.category}</span>
                        <span>Estado: {message.status}</span>
                      </div>
                      <span>
                        {message.sent_at 
                          ? new Date(message.sent_at).toLocaleString()
                          : new Date(message.created_at).toLocaleString()
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SistemaMensajeria;
