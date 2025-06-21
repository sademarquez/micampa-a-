
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  UserPlus,
  Bot,
  Zap,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { geminiService } from '@/services/geminiService';

interface VisitorData {
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  barrio?: string;
  edad?: number;
  mensaje?: string;
}

const AutomatedVisitorWindow = () => {
  const [visitorData, setVisitorData] = useState<VisitorData>({
    nombre: '',
    apellido: ''
  });
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const queryClient = useQueryClient();

  // Query para obtener métricas de visitantes
  const { data: visitorMetrics } = useQuery({
    queryKey: ['visitor-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('electoral_voters')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000
  });

  // Mutation para registrar nuevo votante
  const registerVoterMutation = useMutation({
    mutationFn: async (voterData: VisitorData) => {
      const { data, error } = await supabase
        .from('electoral_voters')
        .insert({
          nombre: voterData.nombre,
          apellido: voterData.apellido,
          telefono: voterData.telefono,
          email: voterData.email,
          barrio: voterData.barrio,
          edad: voterData.edad,
          canal_contacto: 'web',
          status: 'activo'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('¡Registro exitoso! Bienvenido a nuestra comunidad');
      queryClient.invalidateQueries({ queryKey: ['visitor-metrics'] });
      setConversationStep(3);
      
      // Registrar interacción inicial
      registerInteraction(data.id, visitorData.mensaje || 'Registro inicial desde web');
    },
    onError: () => {
      toast.error('Error al registrar. Por favor intenta nuevamente.');
    }
  });

  // Función para registrar interacción
  const registerInteraction = async (voterId: string, mensaje: string) => {
    try {
      // Analizar sentiment con Gemini
      const sentimentAnalysis = await geminiService.analyzeSentiment(mensaje);
      
      const { error } = await supabase
        .from('electoral_interactions')
        .insert({
          voter_id: voterId,
          tipo_interaccion: 'web',
          canal: 'plataforma',
          mensaje: mensaje,
          sentiment_score: sentimentAnalysis.score,
          sentiment_level: sentimentAnalysis.level as "muy_negativo" | "negativo" | "neutral" | "positivo" | "muy_positivo",
          exitosa: true,
          efectividad: 0.8
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error registering interaction:', error);
    }
  };

  // Generar mensaje de bienvenida automático
  useEffect(() => {
    const generateWelcome = async () => {
      try {
        const message = await geminiService.generateWelcomeMessage();
        setWelcomeMessage(message);
      } catch (error) {
        setWelcomeMessage('¡Bienvenido! Únete a nuestra comunidad electoral y sé parte del cambio.');
      }
    };
    
    generateWelcome();
  }, []);

  const handleInputChange = (field: keyof VisitorData, value: string | number) => {
    setVisitorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visitorData.nombre || !visitorData.apellido) {
      toast.error('Por favor completa al menos nombre y apellido');
      return;
    }

    setIsProcessing(true);
    try {
      await registerVoterMutation.mutateAsync(visitorData);
    } finally {
      setIsProcessing(false);
    }
  };

  const todayVisitors = visitorMetrics?.length || 0;
  const avgAge = visitorMetrics?.reduce((sum, v) => sum + (v.edad || 0), 0) / (visitorMetrics?.length || 1) || 0;

  return (
    <div className="space-y-6">
      {/* Métricas en tiempo real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitantes Hoy</p>
                <p className="text-2xl font-bold text-blue-600">{todayVisitors}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Edad Promedio</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(avgAge)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
                <p className="text-2xl font-bold text-purple-600">85%</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interacciones</p>
                <p className="text-2xl font-bold text-orange-600">{todayVisitors * 2}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ventana de Captura Automatizada */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Bot className="w-6 h-6" />
            Ventana de Visitantes - 100% Automatizada
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="w-3 h-3 mr-1" />
              IA Activada
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mensaje de bienvenida personalizado */}
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">Asistente IA</p>
                <p className="text-gray-700">{welcomeMessage}</p>
              </div>
            </div>
          </div>

          {conversationStep < 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Users className="w-4 h-4 inline mr-1" />
                    Nombre *
                  </label>
                  <Input
                    value={visitorData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <Input
                    value={visitorData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono
                  </label>
                  <Input
                    value={visitorData.telefono || ''}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="3001234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={visitorData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Barrio
                  </label>
                  <Input
                    value={visitorData.barrio || ''}
                    onChange={(e) => handleInputChange('barrio', e.target.value)}
                    placeholder="Tu barrio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edad
                  </label>
                  <Input
                    type="number"
                    value={visitorData.edad || ''}
                    onChange={(e) => handleInputChange('edad', parseInt(e.target.value) || 0)}
                    placeholder="25"
                    min="18"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Mensaje o Pregunta
                </label>
                <Textarea
                  value={visitorData.mensaje || ''}
                  onChange={(e) => handleInputChange('mensaje', e.target.value)}
                  placeholder="¿En qué te podemos ayudar? Cuéntanos tus inquietudes..."
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Únete a Nuestra Comunidad
                  </div>
                )}
              </Button>
            </form>
          )}

          {conversationStep === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                ¡Bienvenido a nuestra comunidad!
              </h3>
              <p className="text-gray-600 mb-4">
                Tu registro ha sido exitoso. Pronto nos pondremos en contacto contigo.
              </p>
              <Button 
                onClick={() => {
                  setConversationStep(0);
                  setVisitorData({ nombre: '', apellido: '' });
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Registrar Otra Persona
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visitantes Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Visitantes Recientes (Últimas 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {visitorMetrics?.slice(0, 10).map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {visitor.nombre} {visitor.apellido}
                    </span>
                    <Badge className="text-xs bg-blue-100 text-blue-800">
                      {visitor.canal_contacto}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    {visitor.barrio && <span>{visitor.barrio}</span>}
                    {visitor.edad && <span>{visitor.edad} años</span>}
                    <span>{new Date(visitor.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <Badge className={`${
                  visitor.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {visitor.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedVisitorWindow;
