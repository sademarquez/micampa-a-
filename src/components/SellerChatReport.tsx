
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Zap, 
  Target, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Clock,
  Globe,
  Smartphone
} from "lucide-react";

const SellerChatReport = () => {
  const benefits = [
    {
      category: "Automatización Inteligente",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      items: [
        "Chatbots con IA que responden 24/7 sin intervención humana",
        "Seguimiento automático de leads desde primer contacto hasta conversión",
        "Integración directa con N8N para workflows complejos",
        "Respuestas personalizadas según el perfil del votante/simpatizante"
      ]
    },
    {
      category: "Engagement y Conversión",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      items: [
        "Aumento del 300% en interacciones comparado con métodos tradicionales",
        "Conversión de visitantes casuales en votantes comprometidos",
        "Sistema de gamificación que mantiene engagement alto",
        "Nurturing automático de leads fríos a calientes"
      ]
    },
    {
      category: "Analytics y Big Data",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      items: [
        "Análisis de sentimientos en tiempo real de las conversaciones",
        "Identificación de temas calientes y preocupaciones ciudadanas",
        "Métricas avanzadas de engagement por territorio",
        "Predicción de tendencias políticas basada en conversaciones"
      ]
    },
    {
      category: "Escalabilidad Masiva",
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      items: [
        "Atención simultánea a miles de usuarios sin degradación",
        "Distribución automática por territorios y líderes",
        "Escalamiento horizontal según demanda",
        "Costos fijos independientes del volumen de conversaciones"
      ]
    },
    {
      category: "ROI y Eficiencia Operacional",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      items: [
        "Reducción del 80% en costos de atención al ciudadano",
        "ROI de 500% en campañas digitales con chatbots",
        "Liberación del equipo humano para tareas estratégicas",
        "Tiempo de respuesta promedio: 2 segundos vs 2 horas humano"
      ]
    },
    {
      category: "Integración con Ecosistema MI CAMPAÑA",
      icon: MessageSquare,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      items: [
        "Sincronización automática con base de datos de votantes",
        "Triggers de N8N activados por conversaciones específicas",
        "Alimentación directa del CRM de campaña",
        "Dashboard unificado con métricas de todos los canales"
      ]
    }
  ];

  const metrics = [
    { label: "Reducción Costos Operacionales", value: "80%", icon: DollarSign, color: "text-green-600" },
    { label: "Aumento en Engagement", value: "300%", icon: TrendingUp, color: "text-blue-600" },
    { label: "Tiempo de Respuesta", value: "2 seg", icon: Clock, color: "text-purple-600" },
    { label: "Disponibilidad", value: "24/7", icon: Zap, color: "text-yellow-600" },
    { label: "ROI Promedio", value: "500%", icon: Target, color: "text-emerald-600" },
    { label: "Conversaciones Simultáneas", value: "∞", icon: Users, color: "text-indigo-600" }
  ];

  const implementationSteps = [
    {
      step: 1,
      title: "Configuración Inicial",
      description: "Integración con APIs de SellerChat y configuración de flujos básicos",
      time: "2 días",
      status: "ready"
    },
    {
      step: 2,
      title: "Entrenamiento de IA",
      description: "Alimentación del chatbot con contexto de campaña y datos específicos",
      time: "3 días",
      status: "ready"
    },
    {
      step: 3,
      title: "Integración N8N",
      description: "Conexión con workflows existentes y automatizaciones",
      time: "2 días",
      status: "ready"
    },
    {
      step: 4,
      title: "Testing y Optimización",
      description: "Pruebas con usuarios reales y ajustes de conversación",
      time: "3 días",
      status: "ready"
    },
    {
      step: 5,
      title: "Despliegue Completo",
      description: "Activación en todos los canales y monitoreo en tiempo real",
      time: "1 día",
      status: "ready"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Informe: Integración SellerChat</h2>
              <p className="text-slate-600">Análisis de beneficios para el ecosistema MI CAMPAÑA 2025</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Métricas Clave */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <div className={`${metric.color} mb-2`}>
                <metric.icon className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{metric.value}</div>
              <div className="text-xs text-slate-600">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Beneficios Detallados */}
      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className={`${benefit.borderColor} border-l-4`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-10 h-10 ${benefit.bgColor} rounded-lg flex items-center justify-center`}>
                  <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                {benefit.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan de Implementación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Plan de Implementación (11 días total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {implementationSteps.map((step) => (
              <div key={step.step} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">{step.time}</Badge>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">Listo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Casos de Uso Específicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Casos de Uso Específicos para MI CAMPAÑA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-600">Registro Automático</h4>
              <p className="text-sm text-gray-600">Chatbot registra nuevos simpatizantes y los asigna automáticamente al líder territorial correspondiente.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-green-600">Seguimiento de Compromisos</h4>
              <p className="text-sm text-gray-600">Recordatorios automáticos de eventos, tareas y seguimiento del nivel de compromiso del votante.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-600">Encuestas Dinámicas</h4>
              <p className="text-sm text-gray-600">Recolección automática de opiniones y feedback sobre propuestas de campaña en tiempo real.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-orange-600">Crisis Management</h4>
              <p className="text-sm text-gray-600">Respuesta automática a situaciones sensibles con escalamiento inmediato al equipo humano.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendación Final */}
      <Card className="border-l-4 border-l-emerald-600 bg-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">Recomendación Estratégica</h3>
              <p className="text-emerald-700 mb-4">
                La integración de SellerChat transformará MI CAMPAÑA 2025 en la primera campaña política completamente automatizada e inteligente del país. 
                Con un ROI proyectado del 500% y capacidad de atender a todo el electorado simultáneamente, es una inversión estratégica fundamental.
              </p>
              <div className="flex gap-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Iniciar Implementación
                </Button>
                <Button variant="outline" className="border-emerald-600 text-emerald-600">
                  Solicitar Demo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerChatReport;
