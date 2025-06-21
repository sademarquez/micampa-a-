
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Users, Bell, Bot, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Mensajes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 mr-3 text-slate-600" />
            Sistema de Mensajería
          </h1>
          <p className="text-lg text-slate-600">
            Comunicación directa con líderes y equipo de campaña
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Link to="/mensajes-privados">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800">Mensajes Directos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Comunicación privada con líderes y coordinadores
                </p>
                <Button className="w-full bg-slate-600 hover:bg-slate-700">
                  Abrir Bandeja de Entrada
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-gray-600">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Grupos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Coordinación por equipos y territorios
              </p>
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                Ver Grupos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-stone-600">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-stone-600 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-800">Notificaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Alertas importantes y actualizaciones
              </p>
              <Button className="w-full bg-stone-600 hover:bg-stone-700">
                Ver Alertas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600 bg-gradient-to-br from-blue-50 to-slate-50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    Asistente IA
                    <Zap className="w-4 h-4 text-blue-600" />
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Chatbot inteligente para mantener el compromiso político
              </p>
              <div className="text-xs text-blue-600 mb-3 font-medium">
                ✓ Respuestas automáticas 24/7
                <br />
                ✓ Información de campaña
                <br />
                ✓ Motivación para líderes
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Disponible en la esquina inferior derecha de tu pantalla
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Bot className="w-4 h-4 mr-2" />
                Usar Chatbot
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-gradient-to-r from-slate-600 to-stone-600 rounded-lg p-8 text-white text-center shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Comunicación Inteligente para tu Campaña
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Nuestro asistente de IA está disponible 24/7 para mantener a tu equipo informado y comprometido
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 p-4 rounded-lg">
              <Bot className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Respuestas Automáticas</h3>
              <p className="opacity-80">Información instantánea sobre propuestas y eventos</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Motivación Constante</h3>
              <p className="opacity-80">Mantiene a líderes y votantes comprometidos</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Gratis con Gemini</h3>
              <p className="opacity-80">Tecnología avanzada sin costo adicional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mensajes;
