
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
import { AlertTriangle, CheckCircle, Clock, User, Plus } from "lucide-react";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useToast } from "@/hooks/use-toast";

type AlertType = 'security' | 'logistics' | 'political' | 'emergency' | 'information';
type AlertPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Alert {
  id: string;
  title: string;
  description: string | null;
  type: AlertType;
  priority: AlertPriority;
  status: string;
  created_at: string;
  created_by: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  profiles?: {
    name: string;
  };
}

const AlertSystem = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    type: 'information' as AlertType,
    priority: 'medium' as AlertPriority
  });

  // Query para obtener alertas
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          profiles!alerts_created_by_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear alerta
  const createAlertMutation = useMutation({
    mutationFn: async (alertData: typeof newAlert) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('alerts')
        .insert({
          title: alertData.title,
          description: alertData.description || null,
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
        title: "Alerta creada",
        description: "La alerta ha sido registrada exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setNewAlert({
        title: '',
        description: '',
        type: 'information',
        priority: 'medium'
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la alerta.",
        variant: "destructive",
      });
    }
  });

  // Mutación para resolver alerta
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      if (!supabase || !user) throw new Error('No hay conexión');

      const { error } = await supabase
        .from('alerts')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: user.id
        })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta.",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });

  const handleCreateAlert = () => {
    if (!newAlert.title) {
      toast({
        title: "Error",
        description: "Por favor completa el título de la alerta",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'security': return Clock;
      case 'information': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear nueva alerta */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Plus className="w-5 h-5" />
            Nueva Alerta de Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">Título de la Alerta *</Label>
            <Input
              id="title"
              value={newAlert.title}
              onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
              placeholder="Ej: Problema logístico en zona norte"
              className="border-gray-300 focus:border-red-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Prioridad</Label>
              <Select 
                value={newAlert.priority} 
                onValueChange={(value: AlertPriority) => setNewAlert({...newAlert, priority: value})}
              >
                <SelectTrigger className="border-gray-300 focus:border-red-500">
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
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Tipo de Alerta</Label>
              <Select 
                value={newAlert.type} 
                onValueChange={(value: AlertType) => setNewAlert({...newAlert, type: value})}
              >
                <SelectTrigger className="border-gray-300 focus:border-red-500">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">Descripción</Label>
            <Textarea
              id="description"
              value={newAlert.description}
              onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
              placeholder="Describe la situación o problema..."
              className="min-h-[100px] border-gray-300 focus:border-red-500"
            />
          </div>

          <Button 
            onClick={handleCreateAlert} 
            disabled={createAlertMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {createAlertMutation.isPending ? "Creando..." : "Crear Alerta"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de alertas */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <AlertTriangle className="w-5 h-5" />
            Alertas del Sistema ({alerts.filter(a => a.status === 'active').length} activas)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando alertas...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay alertas registradas
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const TypeIcon = getTypeIcon(alert.type);
                return (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-lg text-gray-800">
                          {alert.title}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {alert.description && (
                      <p className="text-gray-600 mb-3 ml-8">{alert.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between ml-8">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {alert.profiles?.name || 'Usuario desconocido'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </div>
                      
                      {alert.status === 'active' && (
                        <Button
                          onClick={() => resolveAlertMutation.mutate(alert.id)}
                          disabled={resolveAlertMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolver
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSystem;
