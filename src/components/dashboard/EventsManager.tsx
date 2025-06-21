
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus, Clock } from "lucide-react";
import { useSecureAuth } from "../../contexts/SecureAuthContext";
import { useToast } from "@/hooks/use-toast";

type EventStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string;
  status: EventStatus;
  expected_attendees: number | null;
  actual_attendees: number | null;
  created_at: string;
}

interface Territory {
  id: string;
  name: string;
  type: string;
}

const EventsManager = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    expected_attendees: '',
    territory_id: ''
  });

  // Query para obtener eventos
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para obtener territorios
  const { data: territories = [] } = useQuery({
    queryKey: ['territories-for-events', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('territories')
        .select('id, name, type')
        .order('name');

      if (error) {
        console.error('Error fetching territories:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear evento
  const createEventMutation = useMutation({
    mutationFn: async (eventData: typeof newEvent) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description || null,
          location: eventData.location || null,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          expected_attendees: eventData.expected_attendees ? parseInt(eventData.expected_attendees) : null,
          territory_id: eventData.territory_id || null,
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
        title: "Evento creado",
        description: "El evento ha sido registrado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setNewEvent({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        expected_attendees: '',
        territory_id: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el evento.",
        variant: "destructive",
      });
    }
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.start_date || !newEvent.end_date) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    createEventMutation.mutate(newEvent);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear nuevo evento */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Plus className="w-5 h-5" />
            Nuevo Evento de Campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">Título del Evento *</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Ej: Encuentro Ciudadano - Plaza Central"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 font-medium">Ubicación</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                placeholder="Ej: Plaza Principal, Centro"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-gray-700 font-medium">Fecha y Hora Inicio *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={newEvent.start_date}
                onChange={(e) => setNewEvent({...newEvent, start_date: e.target.value})}
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-gray-700 font-medium">Fecha y Hora Fin *</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={newEvent.end_date}
                onChange={(e) => setNewEvent({...newEvent, end_date: e.target.value})}
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_attendees" className="text-gray-700 font-medium">Asistentes Esperados</Label>
              <Input
                id="expected_attendees"
                type="number"
                value={newEvent.expected_attendees}
                onChange={(e) => setNewEvent({...newEvent, expected_attendees: e.target.value})}
                placeholder="100"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Territorio</Label>
            <Select 
              value={newEvent.territory_id} 
              onValueChange={(value) => setNewEvent({...newEvent, territory_id: value})}
            >
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Selecciona territorio" />
              </SelectTrigger>
              <SelectContent>
                {territories.map((territory) => (
                  <SelectItem key={territory.id} value={territory.id}>
                    {territory.name} ({territory.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">Descripción del Evento</Label>
            <Textarea
              id="description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              placeholder="Describe el objetivo y actividades del evento..."
              className="min-h-[100px] border-gray-300 focus:border-blue-500"
            />
          </div>

          <Button 
            onClick={handleCreateEvent} 
            disabled={createEventMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createEventMutation.isPending ? "Creando..." : "Crear Evento"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de eventos */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Calendar className="w-5 h-5" />
            Próximos Eventos ({events.filter(e => e.status !== 'completed').length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando eventos...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay eventos programados
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-3">{event.description}</p>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Inicio: {formatDate(event.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Fin: {formatDate(event.end_date)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.expected_attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Esperados: {event.expected_attendees}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsManager;
