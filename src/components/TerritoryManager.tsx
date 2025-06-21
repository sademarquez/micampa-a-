
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Users, BarChart3 } from "lucide-react";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useToast } from "@/hooks/use-toast";

type TerritoryType = 'barrio' | 'departamento' | 'municipio' | 'corregimiento' | 'vereda' | 'sector';

const TerritoryManager = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newTerritory, setNewTerritory] = useState({
    name: '',
    type: 'barrio' as TerritoryType,
    population_estimate: '',
    voter_estimate: ''
  });

  // Query para obtener territorios
  const { data: territories = [], isLoading } = useQuery({
    queryKey: ['territories', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('territories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching territories:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear territorio
  const createTerritoryMutation = useMutation({
    mutationFn: async (territoryData: typeof newTerritory) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      const { data, error } = await supabase
        .from('territories')
        .insert({
          name: territoryData.name,
          type: territoryData.type,
          population_estimate: territoryData.population_estimate ? parseInt(territoryData.population_estimate) : null,
          voter_estimate: territoryData.voter_estimate ? parseInt(territoryData.voter_estimate) : null,
          created_by: user.id,
          responsible_user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Territorio creado",
        description: "El territorio ha sido registrado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['territories'] });
      setNewTerritory({
        name: '',
        type: 'barrio',
        population_estimate: '',
        voter_estimate: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el territorio.",
        variant: "destructive",
      });
    }
  });

  const handleCreateTerritory = () => {
    if (!newTerritory.name) {
      toast({
        title: "Error",
        description: "Por favor completa el nombre del territorio",
        variant: "destructive"
      });
      return;
    }
    createTerritoryMutation.mutate(newTerritory);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'departamento': return 'bg-blue-100 text-blue-800';
      case 'municipio': return 'bg-green-100 text-green-800';
      case 'corregimiento': return 'bg-purple-100 text-purple-800';
      case 'barrio': return 'bg-yellow-100 text-yellow-800';
      case 'sector': return 'bg-orange-100 text-orange-800';
      case 'vereda': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear nuevo territorio */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Plus className="w-5 h-5" />
            Nuevo Territorio Electoral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nombre del Territorio *</Label>
              <Input
                id="name"
                value={newTerritory.name}
                onChange={(e) => setNewTerritory({...newTerritory, name: e.target.value})}
                placeholder="Ej: Barrio Centro, Comuna 1"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Tipo de Territorio</Label>
              <Select 
                value={newTerritory.type} 
                onValueChange={(value: TerritoryType) => setNewTerritory({...newTerritory, type: value})}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="municipio">Municipio</SelectItem>
                  <SelectItem value="corregimiento">Corregimiento</SelectItem>
                  <SelectItem value="barrio">Barrio</SelectItem>
                  <SelectItem value="vereda">Vereda</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="population" className="text-gray-700 font-medium">Población Estimada</Label>
              <Input
                id="population"
                type="number"
                value={newTerritory.population_estimate}
                onChange={(e) => setNewTerritory({...newTerritory, population_estimate: e.target.value})}
                placeholder="Ej: 5000"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voters" className="text-gray-700 font-medium">Votantes Estimados</Label>
              <Input
                id="voters"
                type="number"
                value={newTerritory.voter_estimate}
                onChange={(e) => setNewTerritory({...newTerritory, voter_estimate: e.target.value})}
                placeholder="Ej: 3500"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          <Button 
            onClick={handleCreateTerritory} 
            disabled={createTerritoryMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createTerritoryMutation.isPending ? "Creando..." : "Crear Territorio"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de territorios */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <MapPin className="w-5 h-5" />
            Territorios Registrados ({territories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando territorios...</div>
          ) : territories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay territorios registrados
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {territories.map((territory) => (
                <Card key={territory.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">{territory.name}</h3>
                      <Badge className={getTypeColor(territory.type)}>
                        {territory.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      {territory.population_estimate && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Población: {territory.population_estimate.toLocaleString()}</span>
                        </div>
                      )}
                      {territory.voter_estimate && (
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Votantes: {territory.voter_estimate.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Creado: {new Date(territory.created_at).toLocaleDateString()}</span>
                      </div>
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

export default TerritoryManager;
