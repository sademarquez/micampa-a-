
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
import { MapPin, Plus, Users, Edit, Eye } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDataSegregation } from "../hooks/useDataSegregation";
import { useToast } from "@/hooks/use-toast";

interface VotingTable {
  id: string;
  table_number: string;
  voting_place: string;
  address: string | null;
  coordinates: any;
  territory_id: string | null;
  responsible_leader_id: string | null;
  active: boolean;
  territories?: {
    name: string;
  };
  profiles?: {
    name: string;
  };
}

interface Territory {
  id: string;
  name: string;
  type: string;
}

interface Leader {
  id: string;
  name: string;
}

const VotingTablesManager = () => {
  const { user } = useAuth();
  const { canManageVotingTables, canViewVotingTables } = useDataSegregation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [newTable, setNewTable] = useState({
    table_number: '',
    voting_place: '',
    address: '',
    territory_id: '',
    responsible_leader_id: ''
  });

  // Query para obtener mesas de votación
  const { data: votingTables = [], isLoading } = useQuery({
    queryKey: ['voting-tables', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      console.log('Obteniendo mesas de votación para:', user.role);
      
      try {
        let query = supabase
          .from('voting_tables')
          .select(`
            *,
            territories(name),
            profiles!voting_tables_responsible_leader_id_fkey(name)
          `)
          .order('voting_place', { ascending: true });

        const { data, error } = await query;
        if (error) {
          console.error('Error obteniendo mesas:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error en query mesas:', error);
        return [];
      }
    },
    enabled: !!supabase && !!user && canViewVotingTables
  });

  // Query para territorios
  const { data: territories = [] } = useQuery({
    queryKey: ['territories-for-tables', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('territories')
        .select('id, name, type')
        .order('name');

      if (error) {
        console.error('Error obteniendo territorios:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Query para líderes
  const { data: leaders = [] } = useQuery({
    queryKey: ['leaders-for-tables', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', 'lider')
        .order('name');

      if (error) {
        console.error('Error obteniendo líderes:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user && canManageVotingTables
  });

  // Mutación para crear mesa
  const createTableMutation = useMutation({
    mutationFn: async (tableData: typeof newTable) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('voting_tables')
        .insert({
          table_number: tableData.table_number,
          voting_place: tableData.voting_place,
          address: tableData.address || null,
          territory_id: tableData.territory_id || null,
          responsible_leader_id: tableData.responsible_leader_id || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mesa creada",
        description: "La mesa de votación ha sido registrada exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['voting-tables'] });
      setNewTable({
        table_number: '',
        voting_place: '',
        address: '',
        territory_id: '',
        responsible_leader_id: ''
      });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la mesa.",
        variant: "destructive",
      });
    }
  });

  const handleCreateTable = () => {
    if (!newTable.table_number || !newTable.voting_place) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    createTableMutation.mutate(newTable);
  };

  if (!canViewVotingTables) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No tienes permisos para ver las mesas de votación.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mesas de Votación</h2>
          <p className="text-slate-600">Gestión de mesas de votación para el día de elecciones</p>
        </div>
        {canManageVotingTables && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-slate-600 hover:bg-slate-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Mesa
          </Button>
        )}
      </div>

      {/* Formulario nueva mesa */}
      {showForm && canManageVotingTables && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nueva Mesa de Votación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="table_number">Número de Mesa *</Label>
                <Input
                  id="table_number"
                  value={newTable.table_number}
                  onChange={(e) => setNewTable({...newTable, table_number: e.target.value})}
                  placeholder="Ej: Mesa 001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voting_place">Lugar de Votación *</Label>
                <Input
                  id="voting_place"
                  value={newTable.voting_place}
                  onChange={(e) => setNewTable({...newTable, voting_place: e.target.value})}
                  placeholder="Ej: Escuela Central"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={newTable.address}
                onChange={(e) => setNewTable({...newTable, address: e.target.value})}
                placeholder="Dirección completa del lugar de votación"
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Territorio</Label>
                <Select 
                  value={newTable.territory_id} 
                  onValueChange={(value) => setNewTable({...newTable, territory_id: value})}
                >
                  <SelectTrigger>
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
                <Label>Líder Responsable</Label>
                <Select 
                  value={newTable.responsible_leader_id} 
                  onValueChange={(value) => setNewTable({...newTable, responsible_leader_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona líder" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaders.map((leader) => (
                      <SelectItem key={leader.id} value={leader.id}>
                        {leader.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTable}
                disabled={createTableMutation.isPending}
                className="bg-slate-600 hover:bg-slate-700"
              >
                {createTableMutation.isPending ? "Creando..." : "Crear Mesa"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de mesas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mesas Registradas ({votingTables.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando mesas...</div>
          ) : votingTables.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay mesas registradas</p>
              {canManageVotingTables && (
                <p className="text-sm mt-2">
                  Usa el botón "Nueva Mesa" para empezar
                </p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {votingTables.map((table) => (
                <Card key={table.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {table.table_number}
                        </h3>
                        <p className="text-sm text-slate-600">{table.voting_place}</p>
                      </div>
                      <Badge variant={table.active ? "default" : "secondary"}>
                        {table.active ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    
                    {table.address && (
                      <p className="text-xs text-slate-500 mb-2">{table.address}</p>
                    )}
                    
                    <div className="space-y-1 text-xs text-slate-500">
                      {table.territories && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {table.territories.name}
                        </div>
                      )}
                      {table.profiles && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {table.profiles.name}
                        </div>
                      )}
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

export default VotingTablesManager;
