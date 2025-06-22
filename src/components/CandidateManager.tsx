import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { developerAuthService } from '@/services/developerAuthService';
import { useTheme } from '@/contexts/ThemeContext';
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

const candidateSchema = z.object({
  name: z.string().min(3, "El nombre del candidato es requerido"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

export const CandidateManager: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme } = useTheme();
  const masterTheme = roleThemes['master'];
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: CandidateFormValues) => {
    if (user?.role !== 'master') {
        toast({ title: "Acceso denegado", description: "No tienes permiso para realizar esta acción.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    try {
      await developerAuthService.createCandidateUser(values.email, values.password, values.name, user.id);
      toast({
        title: "✅ Candidato Creado",
        description: `El usuario candidato ${values.name} ha sido creado exitosamente.`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo crear el candidato.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("border-2", masterTheme.borderColor, `bg-gradient-to-br from-slate-900 to-gray-900`)}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-900/50">
            <UserPlus className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">Crear Nuevo Candidato</CardTitle>
            <CardDescription className="text-amber-200">
              Registra un nuevo usuario para un candidato bajo tu gestión.
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
                    <FormLabel className="text-amber-200 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Nombre del Candidato</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} className="bg-gray-800 border-amber-700 text-white placeholder:text-gray-500" />
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
                    <FormLabel className="text-amber-200 flex items-center gap-2"><Mail className="w-4 h-4" /> Email del Candidato</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="candidato@ejemplo.com" {...field} className="bg-gray-800 border-amber-700 text-white placeholder:text-gray-500" />
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
                    <FormLabel className="text-amber-200 flex items-center gap-2"><Key className="w-4 h-4" /> Contraseña Temporal</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} className="bg-gray-800 border-amber-700 text-white placeholder:text-gray-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className={cn("w-full text-lg py-6", masterTheme.buttonClass, "hover:shadow-amber-500/40 shadow-lg")} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando Candidato...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Registrar Candidato
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};