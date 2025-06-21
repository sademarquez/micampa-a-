import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  AlertTriangle, 
  Calendar, 
  MessageSquare, 
  Users, 
  MapPin,
  Clock,
  CheckCircle,
  Send
} from "lucide-react";
import { useSecureAuth } from "../../contexts/SecureAuthContext";
import { useToast } from "@/hooks/use-toast";

type ActionType = 'alert' | 'task' | 'event' | 'message';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type AlertType = 'security' | 'logistics' | 'political' | 'emergency' | 'information';

const QuickActions = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [quickAlert, setQuickAlert] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    type: 'information' as AlertType
  });

  const [quickTask, setQuickTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    due_date: ''
  });

  const [quickEvent, setQuickEvent] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    expected_attendees: ''
  });

  // Mutación para alerta rápida
  const createQuickAlertMutation = useMutation({
    mutationFn: async (alertData: typeof quickAlert) => {
      if (!supabase || !user) throw new Error('No autorizado');

      const { data, error } = await supabase
        .from('alerts')
        .insert({
          title: alertData.title,
          description: alertData.description,
          type: alertData.type,
          priority: alertData.priority,
          created_by: user.id,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "¡Alerta creada!",
        description: "Tu alerta rápida ha sido enviada al equipo.",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setQuickAlert({ title: '', description: '', priority: 'medium', type: 'information' });
      setActiveAction(null);
    }
  });

  // Mutación para tarea rápida
  const createQuickTaskMutation = useMutation({
    mutationFn: async (taskData: typeof quickTask) => {
      if (!supabase || !user) throw new Error('No autorizado');

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.due_date || null,
          assigned_to: user.id,
          assigned_by: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "¡Tarea creada!",
        description: "Tu tarea rápida ha sido agregada.",
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setQuickTask({ title: '', description: '', priority: 'medium', due_date: '' });
      setActiveAction(null);
    }
  });

  // Mutación para evento rápido
  const createQuickEventMutation = useMutation({
    mutationFn: async (eventData: typeof quickEvent) => {
      if (!supabase || !user || !eventData.start_date) throw new Error('Datos incompletos');

      const startDate = new Date(eventData.start_date);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 horas

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location || null,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          expected_attendees: eventData.expected_attendees ? parseInt(eventData.expected_attendees) : null,
          created_by: user.id,
          responsible_user_id: user.id,
          status: 'planned'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "¡Evento programado!",
        description: "Tu evento rápido ha sido creado.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setQuickEvent({ title: '', description: '', location: '', start_date: '', expected_attendees: '' });
      setActiveAction(null);
    }
  });

  const quickActions = [
    {
      id: 'alert' as ActionType,
      title: 'Alerta Rápida',
      description: 'Reportar situación importante',
      icon: AlertTriangle,
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'task' as ActionType,
      title: 'Tarea Express',
      description: 'Crear recordatorio personal',
      icon: CheckCircle,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'event' as ActionType,
      title: 'Evento Flash',
      description: 'Programar reunión rápida',
      icon: Calendar,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'message' as ActionType,
      title: 'Mensaje Directo',
      description: 'Contactar al equipo',
      icon: MessageSquare,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    }
  ];

  const handleQuickAction = (actionType: ActionType) => {
    if (actionType === 'message') {
      toast({
        title: "Función disponible pronto",
        description: "El sistema de mensajería está en desarrollo.",
      });
      return;
    }
    setActiveAction(actionType);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Zap className="w-6 h-6 text-yellow-500" />
            Acciones Rápidas de Campaña
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Herramientas express para maximizar tu productividad en campo
          </p>
        </CardHeader>
      </Card>

      {/* Botones de acción rápida */}
      {!activeAction && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${action.color}`}
                onClick={() => handleQuickAction(action.id)}
              >
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${action.iconColor}`} />
                  <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Formulario de Alerta Rápida */}
      {activeAction === 'alert' && (
        <Card className="border-red-200 shadow-sm">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Crear Alerta Rápida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="alert-title">Título de la Alerta</Label>
              <Input
                id="alert-title"
                value={quickAlert.title}
                onChange={(e) => setQuickAlert({...quickAlert, title: e.target.value})}
                placeholder="Ej: Problema en zona norte"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Alerta</Label>
                <Select 
                  value={quickAlert.type} 
                  onValueChange={(value: AlertType) => setQuickAlert({...quickAlert, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="information">Información</SelectItem>
                    <SelectItem value="security">Seguridad</SelectItem>
                    <SelectItem value="logistics">Logística</SelectItem>
                    <SelectItem value="political">Política</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select 
                  value={quickAlert.priority} 
                  onValueChange={(value: Priority) => setQuickAlert({...quickAlert, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alert-description">Descripción de la Alerta</Label>
              <Textarea
                id="alert-description"
                value={quickAlert.description}
                onChange={(e) => setQuickAlert({...quickAlert, description: e.target.value})}
                placeholder="Describe la situación brevemente..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => createQuickAlertMutation.mutate(quickAlert)}
                disabled={!quickAlert.title || createQuickAlertMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {createQuickAlertMutation.isPending ? "Enviando..." : "Enviar Alerta"}
              </Button>
              <Button variant="outline" onClick={() => setActiveAction(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de Tarea Rápida */}
      {activeAction === 'task' && (
        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="w-5 h-5" />
              Crear Tarea Express
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Título de la Tarea</Label>
                <Input
                  id="task-title"
                  value={quickTask.title}
                  onChange={(e) => setQuickTask({...quickTask, title: e.target.value})}
                  placeholder="Ej: Llamar a coordinador zona norte"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due">Fecha Límite</Label>
                <Input
                  id="task-due"
                  type="datetime-local"
                  value={quickTask.due_date}
                  onChange={(e) => setQuickTask({...quickTask, due_date: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Descripción</Label>
              <Textarea
                id="task-description"
                value={quickTask.description}
                onChange={(e) => setQuickTask({...quickTask, description: e.target.value})}
                placeholder="Detalles de la tarea..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => createQuickTaskMutation.mutate(quickTask)}
                disabled={!quickTask.title || createQuickTaskMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {createQuickTaskMutation.isPending ? "Creando..." : "Crear Tarea"}
              </Button>
              <Button variant="outline" onClick={() => setActiveAction(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de Evento Rápido */}
      {activeAction === 'event' && (
        <Card className="border-green-200 shadow-sm">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Calendar className="w-5 h-5" />
              Programar Evento Flash
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Título del Evento</Label>
                <Input
                  id="event-title"
                  value={quickEvent.title}
                  onChange={(e) => setQuickEvent({...quickEvent, title: e.target.value})}
                  placeholder="Ej: Reunión con líderes barriales"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Ubicación</Label>
                <Input
                  id="event-location"
                  value={quickEvent.location}
                  onChange={(e) => setQuickEvent({...quickEvent, location: e.target.value})}
                  placeholder="Ej: Casa comunal, Barrio Centro"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Fecha y Hora</Label>
                <Input
                  id="event-date"
                  type="datetime-local"
                  value={quickEvent.start_date}
                  onChange={(e) => setQuickEvent({...quickEvent, start_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-attendees">Asistentes Esperados</Label>
                <Input
                  id="event-attendees"
                  type="number"
                  value={quickEvent.expected_attendees}
                  onChange={(e) => setQuickEvent({...quickEvent, expected_attendees: e.target.value})}
                  placeholder="15"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Descripción</Label>
              <Textarea
                id="event-description"
                value={quickEvent.description}
                onChange={(e) => setQuickEvent({...quickEvent, description: e.target.value})}
                placeholder="Objetivo y agenda del evento..."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => createQuickEventMutation.mutate(quickEvent)}
                disabled={!quickEvent.title || !quickEvent.start_date || createQuickEventMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {createQuickEventMutation.isPending ? "Programando..." : "Programar Evento"}
              </Button>
              <Button variant="outline" onClick={() => setActiveAction(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Acciones Hoy</p>
                <p className="text-2xl font-bold text-blue-800">8</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Tiempo Ahorrado</p>
                <p className="text-2xl font-bold text-green-800">2h 15m</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Equipo Activo</p>
                <p className="text-2xl font-bold text-purple-800">12</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickActions;
