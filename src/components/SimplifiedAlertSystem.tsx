
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
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Plus, Clock, User, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { useToast } from "@/hooks/use-toast";

type AlertType = 'security' | 'logistics' | 'political' | 'emergency' | 'information';
type AlertPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  priority: AlertPriority;
  territory_id: string | null;
  visible_to_voters: boolean | null;
  created_at: string;
  created_by: string;
  territories?: {
    name: string;
  };
  profiles?: {
    name: string;
  };
}

const SimplifiedAlertSystem = () => {
  const { user } = useAuth();
  const { canCreateAlerts } = useDataSegregation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    type: 'information' as AlertType,
    priority: 'medium' as AlertPriority,
    visible_to_voters: false
  });

  // Query para obtener alertas (todos pueden ver)
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['simplified-alerts', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      console.log('Obteniendo alertas para:', user.role);
      
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select(`
            *,
            territories(name),
            profiles!alerts_created_by_fkey(name)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error obteniendo alertas:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error en query alertas:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear nueva alerta
  const createAlertMutation = useMutation({
    mutationFn: async (alertData: typeof newAlert) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('alerts')
        .insert({
          title: alertData.title,
          description: alertData.description,
          type: alertData.type,
          priority: alertData.priority,
          visible_to_voters: alertData.visible_to_voters,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Alerta creada",
        description: "La alerta ha sido enviada exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['simplified-alerts'] });
      setNewAlert({
        title: '',
        description: '',
        type: 'information',
        priority: 'medium',
        visible_to_voters: false
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la alerta.",
        variant: "destructive",
      });
    }
  });

  const handleCreateAlert = () => {
    if (!newAlert.title.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe un título para la alerta",
        variant: "destructive"
      });
      return;
    }
    createAlertMutation.mutate(newAlert);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'security': return '🔒';
      case 'political': return '🗳️';
      case 'logistics': return '📋';
      case 'information': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sistema de Alertas</h2>
          <p className="text-slate-600">
            {canCreateAlerts 
              ? "Crea y gestiona alertas importantes para tu equipo" 
              : "Ve las alertas importantes del equipo de campaña"
            }
          </p>
        </div>
        {canCreateAlerts && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-lg px-6 py-3"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Alerta
          </Button>
        )}
      </div>

      {/* Formulario simplificado */}
      {showForm && canCreateAlerts && (
        <Card className="border-2 border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-6 h-6" />
              Crear Nueva Alerta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Título - Campo grande y claro */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold">
                ¿Qué está pasando? *
              </Label>
              <Input
                id="title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                placeholder="Escribe aquí lo que quieres comunicar..."
                className="text-lg p-4 h-12"
              />
            </div>

            {/* Tipo y Prioridad - Con iconos grandes */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold">¿Qué tipo de alerta es?</Label>
                <Select 
                  value={newAlert.type} 
                  onValueChange={(value) => setNewAlert({...newAlert, type: value as AlertType})}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency" className="text-lg py-3">
                      🚨 EMERGENCIA
                    </SelectItem>
                    <SelectItem value="security" className="text-lg py-3">
                      🔒 Seguridad
                    </SelectItem>
                    <SelectItem value="political" className="text-lg py-3">
                      🗳️ Política
                    </SelectItem>
                    <SelectItem value="logistics" className="text-lg py-3">
                      📋 Logística
                    </SelectItem>
                    <SelectItem value="information" className="text-lg py-3">
                      ℹ️ Información
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-lg font-semibold">¿Qué tan urgente es?</Label>
                <Select 
                  value={newAlert.priority} 
                  onValueChange={(value) => setNewAlert({...newAlert, priority: value as AlertPriority})}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent" className="text-lg py-3 text-red-600">
                      🔴 MUY URGENTE
                    </SelectItem>
                    <SelectItem value="high" className="text-lg py-3 text-orange-600">
                      🟠 Urgente
                    </SelectItem>
                    <SelectItem value="medium" className="text-lg py-3 text-yellow-600">
                      🟡 Normal
                    </SelectItem>
                    <SelectItem value="low" className="text-lg py-3 text-green-600">
                      🟢 Baja
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descripción opcional */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-semibold">
                Más detalles (opcional)
              </Label>
              <Textarea
                id="description"
                value={newAlert.description}
                onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                placeholder="Si quieres agregar más información..."
                className="min-h-[100px] text-lg p-4"
              />
            </div>

            {/* Opción para votantes */}
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Switch
                id="visible_to_voters"
                checked={newAlert.visible_to_voters}
                onCheckedChange={(checked) => setNewAlert({...newAlert, visible_to_voters: checked})}
              />
              <Label htmlFor="visible_to_voters" className="text-lg">
                📱 Que los votantes también vean esta alerta
              </Label>
            </div>

            {/* Botones grandes */}
            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1 h-12 text-lg"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateAlert}
                disabled={createAlertMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 h-12 text-lg"
              >
                {createAlertMutation.isPending ? "Enviando..." : "✉️ Enviar Alerta"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de alertas */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Cargando alertas...</p>
            </CardContent>
          </Card>
        ) : alerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay alertas en este momento</p>
              {canCreateAlerts && (
                <p className="text-sm mt-2">
                  Usa el botón "Nueva Alerta" para crear una
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`hover:shadow-lg transition-shadow ${
                alert.priority === 'urgent' ? 'border-l-4 border-l-red-500' :
                alert.priority === 'high' ? 'border-l-4 border-l-orange-500' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-1">
                        {alert.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        {alert.visible_to_voters && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            📱 Visible para votantes
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {alert.description && (
                  <p className="text-slate-700 mb-4 text-lg leading-relaxed">
                    {alert.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-slate-500 border-t pt-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                  {alert.profiles && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {alert.profiles.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SimplifiedAlertSystem;
