
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
import { CheckCircle, Clock, Plus, Calendar, User } from "lucide-react";
import { useSecureAuth } from "../../contexts/SecureAuthContext";
import { useToast } from "@/hooks/use-toast";

type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: string;
  due_date: string | null;
  assigned_to: string | null;
  created_at: string;
  profiles?: {
    name: string;
  };
}

const TaskManager = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    due_date: ''
  });

  // Query para obtener tareas
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          profiles!tasks_assigned_to_fkey(name)
        `)
        .or(`assigned_to.eq.${user.id},assigned_by.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear tarea
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: typeof newTask) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description || null,
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
        title: "Tarea creada",
        description: "La tarea ha sido registrada exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la tarea.",
        variant: "destructive",
      });
    }
  });

  // Mutación para completar tarea
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!supabase) throw new Error('No hay conexión');

      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Tarea completada",
        description: "¡Excelente trabajo!",
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleCreateTask = () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Por favor completa el título de la tarea",
        variant: "destructive"
      });
      return;
    }
    createTaskMutation.mutate(newTask);
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear nueva tarea */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Plus className="w-5 h-5" />
            Nueva Tarea de Campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">Título de la Tarea *</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Ej: Preparar evento en plaza central"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Prioridad</Label>
              <Select 
                value={newTask.priority} 
                onValueChange={(value) => setNewTask({...newTask, priority: value as TaskPriority})}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
            <Label htmlFor="due_date" className="text-gray-700 font-medium">Fecha Límite</Label>
            <Input
              id="due_date"
              type="datetime-local"
              value={newTask.due_date}
              onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">Descripción</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Describe los detalles de la tarea..."
              className="min-h-[100px] border-gray-300 focus:border-blue-500"
            />
          </div>

          <Button 
            onClick={handleCreateTask} 
            disabled={createTaskMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createTaskMutation.isPending ? "Creando..." : "Crear Tarea"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Clock className="w-5 h-5" />
            Mis Tareas Activas ({tasks.filter(t => t.status !== 'completed').length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando tareas...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay tareas asignadas
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                      {task.profiles && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {task.profiles.name}
                        </div>
                      )}
                    </div>
                    
                    {task.status !== 'completed' && (
                      <Button
                        onClick={() => completeTaskMutation.mutate(task.id)}
                        disabled={completeTaskMutation.isPending}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completar
                      </Button>
                    )}
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

export default TaskManager;
