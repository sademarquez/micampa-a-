
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Plus, Zap, Play, Pause } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { useToast } from "@/hooks/use-toast";

interface N8NWorkflow {
  id: string;
  workflow_name: string;
  workflow_id: string;
  webhook_url: string | null;
  trigger_role: string[];
  active: boolean;
  created_at: string;
}

const N8NWorkflowManager = () => {
  const { user } = useAuth();
  const { canManageN8N } = useDataSegregation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    workflow_name: '',
    workflow_id: '',
    webhook_url: '',
    trigger_role: ['desarrollador']
  });

  // Query para obtener workflows
  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['n8n-workflows', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      console.log('Obteniendo workflows N8N para:', user.role);
      
      try {
        const { data, error } = await supabase
          .from('n8n_workflows')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error obteniendo workflows:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error en query workflows:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear workflow
  const createWorkflowMutation = useMutation({
    mutationFn: async (workflowData: typeof newWorkflow) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('n8n_workflows')
        .insert({
          workflow_name: workflowData.workflow_name,
          workflow_id: workflowData.workflow_id,
          webhook_url: workflowData.webhook_url || null,
          trigger_role: workflowData.trigger_role,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Workflow creado",
        description: "El workflow de N8N ha sido registrado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['n8n-workflows'] });
      setNewWorkflow({
        workflow_name: '',
        workflow_id: '',
        webhook_url: '',
        trigger_role: ['desarrollador']
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el workflow.",
        variant: "destructive",
      });
    }
  });

  // Mutación para ejecutar webhook
  const executeWebhookMutation = useMutation({
    mutationFn: async (webhookUrl: string) => {
      if (!webhookUrl) {
        throw new Error('URL de webhook no disponible');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          triggered_by: user?.name || user?.id,
          trigger_time: new Date().toISOString(),
          user_role: user?.role
        })
      });

      if (!response.ok) {
        throw new Error('Error ejecutando webhook');
      }

      return response;
    },
    onSuccess: () => {
      toast({
        title: "Workflow ejecutado",
        description: "El workflow de N8N ha sido activado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo ejecutar el workflow.",
        variant: "destructive",
      });
    }
  });

  const handleCreateWorkflow = () => {
    if (!newWorkflow.workflow_name || !newWorkflow.workflow_id) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    createWorkflowMutation.mutate(newWorkflow);
  };

  const handleExecuteWorkflow = (webhookUrl: string) => {
    executeWebhookMutation.mutate(webhookUrl);
  };

  if (!canManageN8N && user?.role !== 'desarrollador') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Solo los desarrolladores pueden gestionar workflows N8N.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">N8N Workflow Manager</h2>
          <p className="text-slate-600">Gestión de automatizaciones con N8N</p>
        </div>
        {canManageN8N && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-slate-600 hover:bg-slate-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Workflow
          </Button>
        )}
      </div>

      {/* Formulario nuevo workflow */}
      {showForm && canManageN8N && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Nuevo Workflow N8N
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workflow_name">Nombre del Workflow *</Label>
                <Input
                  id="workflow_name"
                  value={newWorkflow.workflow_name}
                  onChange={(e) => setNewWorkflow({...newWorkflow, workflow_name: e.target.value})}
                  placeholder="Ej: Notificar Nueva Alerta"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow_id">ID del Workflow *</Label>
                <Input
                  id="workflow_id"
                  value={newWorkflow.workflow_id}
                  onChange={(e) => setNewWorkflow({...newWorkflow, workflow_id: e.target.value})}
                  placeholder="ID desde N8N"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook_url">URL del Webhook</Label>
              <Input
                id="webhook_url"
                value={newWorkflow.webhook_url}
                onChange={(e) => setNewWorkflow({...newWorkflow, webhook_url: e.target.value})}
                placeholder="https://your-n8n-instance.com/webhook/..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateWorkflow}
                disabled={createWorkflowMutation.isPending}
                className="bg-slate-600 hover:bg-slate-700"
              >
                {createWorkflowMutation.isPending ? "Creando..." : "Crear Workflow"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Workflows Registrados ({workflows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando workflows...</div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay workflows registrados</p>
              {canManageN8N && (
                <p className="text-sm mt-2">
                  Usa el botón "Nuevo Workflow" para empezar
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {workflow.workflow_name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          ID: {workflow.workflow_id}
                        </p>
                        {workflow.webhook_url && (
                          <p className="text-xs text-slate-500 mt-1 truncate">
                            Webhook: {workflow.webhook_url}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={workflow.active ? "default" : "secondary"}>
                          {workflow.active ? "Activo" : "Inactivo"}
                        </Badge>
                        {workflow.webhook_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExecuteWorkflow(workflow.webhook_url!)}
                            disabled={executeWebhookMutation.isPending}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex gap-2">
                        {workflow.trigger_role.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                      <span>
                        {new Date(workflow.created_at).toLocaleDateString()}
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

export default N8NWorkflowManager;
