
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Shield, Mail, Calendar } from "lucide-react";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useToast } from "@/hooks/use-toast";

type UserRole = 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante' | 'visitante';

const UserManagement = () => {
  const { user } = useSecureAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'votante' as UserRole
  });

  // Query para obtener usuarios
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!supabase && !!user
  });

  // Mutación para crear usuario
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      if (!supabase || !user) {
        throw new Error('Datos incompletos');
      }

      // Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Actualizar perfil
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            role: userData.role,
            created_by: user.id
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      return authData;
    },
    onSuccess: () => {
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido registrado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewUser({
        email: '',
        password: '',
        name: '',
        role: 'votante'
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario.",
        variant: "destructive",
      });
    }
  });

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    createUserMutation.mutate(newUser);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'bg-purple-100 text-purple-800';
      case 'master': return 'bg-red-100 text-red-800';
      case 'candidato': return 'bg-blue-100 text-blue-800';
      case 'lider': return 'bg-green-100 text-green-800';
      case 'votante': return 'bg-yellow-100 text-yellow-800';
      case 'visitante': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'desarrollador': return 'Desarrollador';
      case 'master': return 'Master';
      case 'candidato': return 'Candidato';
      case 'lider': return 'Líder';
      case 'votante': return 'Votante';
      case 'visitante': return 'Visitante';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario para crear nuevo usuario */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Plus className="w-5 h-5" />
            Nuevo Usuario del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nombre Completo *</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Ej: Juan Pérez García"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Ej: juan@micampana.com"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                placeholder="Mínimo 8 caracteres"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Rol del Usuario</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visitante">Visitante</SelectItem>
                  <SelectItem value="votante">Votante</SelectItem>
                  <SelectItem value="lider">Líder</SelectItem>
                  <SelectItem value="candidato">Candidato</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="desarrollador">Desarrollador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCreateUser} 
            disabled={createUserMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createUserMutation.isPending ? "Creando..." : "Crear Usuario"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <User className="w-5 h-5" />
            Usuarios del Sistema ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay usuarios registrados
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map((userItem) => (
                <Card key={userItem.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{userItem.name}</h3>
                          <p className="text-sm text-gray-500">ID: {userItem.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <Badge className={getRoleColor(userItem.role)}>
                        {getRoleLabel(userItem.role)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Rol: {getRoleLabel(userItem.role)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Creado: {new Date(userItem.created_at).toLocaleDateString()}</span>
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

export default UserManagement;
