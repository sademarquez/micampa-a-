import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/hooks/use-toast';
import { developerAuthService, Voter } from '@/services/developerAuthService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Loader2, UserPlus, Save, Hash, Phone, Mail, MapPin, CheckSquare, Edit, Star } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { roleThemes } from '@/config/roleThemes';

const voterSchema = z.object({
  name: z.string().min(3, "El nombre es requerido"),
  cedula: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Debe ser un email válido").optional().or(z.literal('')),
  address: z.string().optional(),
  voting_place: z.string().optional(),
  voting_table: z.string().optional(),
  commitment_level: z.number().min(1).max(5).default(3),
  notes: z.string().optional(),
});

type VoterFormValues = z.infer<typeof voterSchema>;

export const VoterManager: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const leaderTheme = roleThemes['lider'];
  const [isLoading, setIsLoading] = useState(false);
  const [commitment, setCommitment] = useState(3);

  const form = useForm<VoterFormValues>({
    resolver: zodResolver(voterSchema),
    defaultValues: {
      name: "",
      cedula: "",
      phone: "",
      email: "",
      address: "",
      voting_place: "",
      voting_table: "",
      commitment_level: 3,
      notes: "",
    },
  });

  const onSubmit = async (values: VoterFormValues) => {
    if (user?.role !== 'lider' || !user.id) {
        toast({ title: "Acceso denegado", description: "No tienes permiso para registrar votantes.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    try {
        const voterData: Omit<Voter, 'id'> = {
            ...values,
            commitment_level: commitment,
            registered_by: user.id
        }
      await developerAuthService.createVoter(voterData);
      toast({
        title: "✅ Votante Registrado",
        description: `El votante ${values.name} ha sido añadido a tu base de datos.`,
      });
      form.reset();
      setCommitment(3);
    } catch (error: any) {
      toast({
        title: "❌ Error al Registrar",
        description: error.message || "No se pudo registrar al votante.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("border-2", leaderTheme.borderColor, "bg-blue-50/50")}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <UserPlus className="w-8 h-8 text-blue-700" />
          </div>
          <div>
            <CardTitle className="text-2xl text-blue-900">Registrar Nuevo Votante</CardTitle>
            <CardDescription className="text-blue-800">
              Añade un nuevo simpatizante o votante a tu red personal.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><UserPlus className="w-4 h-4" />Nombre Completo</FormLabel><FormControl><Input placeholder="Nombre del votante" {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="cedula" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><Hash className="w-4 h-4" />Cédula (Opcional)</FormLabel><FormControl><Input placeholder="Número de identificación" {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><Phone className="w-4 h-4" />Teléfono</FormLabel><FormControl><Input placeholder="Contacto telefónico" {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><Mail className="w-4 h-4" />Email</FormLabel><FormControl><Input type="email" placeholder="correo@ejemplo.com" {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
            
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><MapPin className="w-4 h-4" />Dirección</FormLabel><FormControl><Input placeholder="Dirección de residencia" {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="voting_place" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><CheckSquare className="w-4 h-4" />Lugar de Votación</FormLabel><FormControl><Input placeholder="Ej: Colegio San José" {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="voting_table" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><Hash className="w-4 h-4" />Mesa</FormLabel><FormControl><Input placeholder="Ej: Mesa 24" {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>

            <FormField control={form.control} name="commitment_level" render={({ field }) => (
                 <FormItem>
                    <FormLabel className="flex items-center gap-2 text-blue-900"><Star className="w-4 h-4" />Nivel de Compromiso: {commitment}</FormLabel>
                    <FormControl>
                        <Slider defaultValue={[3]} min={1} max={5} step={1} onValueChange={(value) => setCommitment(value[0])} className="py-2" />
                    </FormControl>
                 </FormItem>
            )}/>

            <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2 text-blue-900"><Edit className="w-4 h-4" />Notas Adicionales</FormLabel><FormControl><Textarea placeholder="Información relevante sobre el votante..." {...field} className="border-blue-300" /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <Button type="submit" className={cn("w-full text-lg py-6", leaderTheme.buttonClass, "hover:shadow-blue-500/40 shadow-lg")} disabled={isLoading}>
              {isLoading ? ( <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registrando... </> ) : ( <> <Save className="mr-2 h-5 w-5" /> Guardar Votante </> )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 