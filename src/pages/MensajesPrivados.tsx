
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const MensajesPrivados = () => {
  // Placeholder data - this will come from Supabase
  const conversations = [
    { id: 1, name: "Juan Pérez (Líder Comunitario)", lastMessage: "¡Listo para la jornada de mañana!...", unread: 2 },
    { id: 2, name: "Maria Rodriguez (Votante)", lastMessage: "Tengo una pregunta sobre la propuesta de salud.", unread: 0 },
    { id: 3, name: "Equipo de Logística", lastMessage: "Confirmado el transporte para el evento.", unread: 1 },
  ];

  const isSupabaseConnected = false; // This would be dynamic in a real scenario

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 mr-3 text-slate-600" />
            Mensajes Directos
          </h1>
          <p className="text-lg text-slate-600">
            Conversaciones privadas con tu equipo y votantes.
          </p>
        </div>

        {!isSupabaseConnected && (
          <Card className="mb-6 bg-yellow-50 border-yellow-300">
            <CardHeader className="flex flex-row items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <CardTitle className="text-yellow-800">Funcionalidad Limitada</CardTitle>
                <CardDescription className="text-yellow-700">
                  Para habilitar el chat en tiempo real, es necesario conectar una base de datos.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800 mb-3">
                Por favor, conecta tu proyecto a Supabase para guardar y gestionar conversaciones de forma segura.
              </p>
              <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Conectar a Supabase (Acción Manual Requerida)
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Bandeja de Entrada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.map((convo) => (
                <Link to={`/mensajes-privados/${convo.id}`} key={convo.id} className="block hover:bg-slate-100 p-4 rounded-lg transition-colors cursor-pointer border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{convo.name}</p>
                        <p className="text-sm text-slate-500 truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                    {convo.unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {convo.unread}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MensajesPrivados;
