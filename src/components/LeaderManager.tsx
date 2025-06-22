import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { developerAuthService } from '@/services/developerAuthService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Loader2, UserPlus, Key, Mail, Save } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { roleThemes } from '@/config/roleThemes';

const leaderSchema = z.object({
  name: z.string().min(3, "El nombre del líder es requerido"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LeaderFormValues = z.infer<typeof leaderSchema>;

export const LeaderManager: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const candidateTheme = roleThemes['candidato'];
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LeaderFormValues>({
    resolver: zodResolver(leaderSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LeaderFormValues) => {
    if (user?.role !== 'candidato') {
        toast({ title: "Acceso denegado", description: "No tienes permiso para realizar esta acción.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    try {
      await developerAuthService.createLeaderUser(values.email, values.password, values.name, user.id);
      toast({
        title: "✅ Líder Creado",
        description: `El usuario líder ${values.name} ha sido creado exitosamente.`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo crear el líder.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("border", candidateTheme.borderColor, "bg-green-50/50")}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100">
            <UserPlus className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <CardTitle className="text-2xl text-green-900">Crear Nuevo Líder</CardTitle>
            <CardDescription className="text-green-800">
              Registra un nuevo líder territorial para tu equipo.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-900 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Nombre del Líder</FormLabel>
                    <FormControl>
                      <Input placeholder="Líder de equipo" {...field} className="bg-white border-green-300 placeholder:text-gray-400" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-900 flex items-center gap-2"><Mail className="w-4 h-4" /> Email del Líder</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="lider@ejemplo.com" {...field} className="bg-white border-green-300 placeholder:text-gray-400" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-900 flex items-center gap-2"><Key className="w-4 h-4" /> Contraseña Temporal</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} className="bg-white border-green-300 placeholder:text-gray-400" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className={cn("w-full text-lg py-6", candidateTheme.buttonClass, "hover:shadow-green-500/40 shadow-lg")} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando Líder...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Registrar Líder
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 