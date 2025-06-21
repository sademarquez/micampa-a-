
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  MapPin, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Phone, 
  Mail,
  Home,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  Building,
  UserPlus,
  MessageCircle
} from 'lucide-react';

const CandidatoFunnel = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [userSector, setUserSector] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    interests: [] as string[],
    priority: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener geolocalización del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          // Determinar sector basado en coordenadas (simulado)
          determineSector(location);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Usar ubicación por defecto (Bogotá centro)
          setUserLocation({ lat: 4.60971, lng: -74.08175 });
          setUserSector('Centro');
        }
      );
    }
  }, []);

  const determineSector = (location: {lat: number, lng: number}) => {
    // Lógica simplificada para determinar sector
    if (location.lat > 4.65) {
      setUserSector('Norte (Chapinero/Usaquén)');
    } else if (location.lat > 4.60) {
      setUserSector('Centro (La Candelaria/Teusaquillo)');
    } else if (location.lat > 4.55) {
      setUserSector('Sur (Kennedy/Bosa)');
    } else {
      setUserSector('Periferia (Suba/Engativá)');
    }
  };

  const propuestas = [
    {
      icon: Home,
      title: 'Vivienda Digna',
      subtitle: 'Proyectos habitacionales accesibles',
      description: 'Facilitaremos el acceso a vivienda propia con subsidios y financiación especial para familias trabajadoras.',
      benefits: ['Subsidios hasta 50%', 'Créditos 0% interés', 'Lotes urbanizados']
    },
    {
      icon: Briefcase,
      title: 'Empleo y Economía',
      subtitle: 'Oportunidades laborales locales',
      description: 'Crearemos 5,000 empleos directos promoviendo el emprendimiento y atrayendo empresas a nuestra región.',
      benefits: ['Incubadoras empresariales', 'Capacitación gratuita', 'Microcréditos']
    },
    {
      icon: GraduationCap,
      title: 'Educación de Calidad',
      subtitle: 'Futuro brillante para nuestros hijos',
      description: 'Modernizaremos colegios, aumentaremos becas universitarias y crearemos centros tecnológicos.',
      benefits: ['Tecnología en aulas', 'Becas 100%', 'Idiomas gratis']
    },
    {
      icon: Shield,
      title: 'Seguridad Ciudadana',
      subtitle: 'Calles seguras para todos',
      description: 'Implementaremos un sistema integral de seguridad con cámaras, alarmas comunitarias y más policía.',
      benefits: ['Cámaras HD 24/7', 'App de alertas', 'Policía comunitaria']
    },
    {
      icon: Zap,
      title: 'Servicios Públicos',
      subtitle: 'Infraestructura moderna y eficiente',
      description: 'Garantizaremos agua potable, energía estable e internet de alta velocidad para todos los sectores.',
      benefits: ['Agua 24 horas', 'Energía confiable', 'Internet fibra óptica']
    },
    {
      icon: Building,
      title: 'Desarrollo Urbano',
      subtitle: 'Espacios dignos para vivir',
      description: 'Construiremos parques, mejoraremos vías, y crearemos centros comerciales y deportivos.',
      benefits: ['Parques ecológicos', 'Vías pavimentadas', 'Centros deportivos']
    }
  ];

  const testimonios = [
    {
      name: 'María González',
      sector: 'Chapinero',
      role: 'Madre de familia',
      testimonial: 'Por fin alguien que entiende nuestras necesidades. Sus propuestas de educación transformarán el futuro de mis hijos.',
      avatar: '👩‍💼'
    },
    {
      name: 'Carlos Ruiz',
      sector: 'Kennedy',
      role: 'Comerciante',
      testimonial: 'Como pequeño empresario, veo esperanza en sus planes de empleo. Necesitamos más oportunidades aquí.',
      avatar: '👨‍💼'
    },
    {
      name: 'Ana Morales',
      sector: 'Suba',
      role: 'Docente',
      testimonial: 'Sus propuestas educativas son realistas y necesarias. Finalmente un candidato que prioriza la educación.',
      avatar: '👩‍🏫'
    }
  ];

  const handleStepForward = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    console.log('User location:', userLocation);
    console.log('User sector:', userSector);
    // Aquí implementar envío a base de datos
    setCurrentStep(4); // Paso de agradecimiento
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Mi Candidato 2025</h1>
                <p className="text-blue-200 text-sm">{userSector && `Tu sector: ${userSector}`}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Acceso Equipo
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {currentStep === 1 && (
          <div className="space-y-12">
            {/* Historia Personal */}
            <div className="text-center mb-12">
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Users className="w-24 h-24 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Juan Carlos Mendoza
                    </h2>
                    <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                      Nacido y criado en nuestra comunidad. Ingeniero, padre de familia, y líder comunitario 
                      con 15 años trabajando por el desarrollo de nuestros barrios.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-white/20 px-4 py-2 rounded-full text-white">
                        <GraduationCap className="w-4 h-4 inline mr-2" />
                        Ingeniero Civil
                      </div>
                      <div className="bg-white/20 px-4 py-2 rounded-full text-white">
                        <Users className="w-4 h-4 inline mr-2" />
                        15 años de liderazgo
                      </div>
                      <div className="bg-white/20 px-4 py-2 rounded-full text-white">
                        <Heart className="w-4 h-4 inline mr-2" />
                        Padre de 3 hijos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Propuestas */}
            <div>
              <h3 className="text-3xl font-bold text-white text-center mb-8">
                Nuestras Propuestas para Transformar tu Comunidad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propuestas.map((propuesta, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                          <propuesta.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{propuesta.title}</h4>
                          <p className="text-blue-200 text-sm">{propuesta.subtitle}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-100 mb-4">{propuesta.description}</p>
                      <div className="space-y-2">
                        {propuesta.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-blue-100 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleStepForward}
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Conocer Testimonios
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Lo que Dicen Nuestros Vecinos
              </h2>
              <p className="text-xl text-blue-200">
                Testimonios reales de personas como tú que apoyan nuestras propuestas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonios.map((testimonio, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur border-white/20 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{testimonio.avatar}</div>
                      <h4 className="text-white font-bold">{testimonio.name}</h4>
                      <p className="text-blue-200 text-sm">{testimonio.role} - {testimonio.sector}</p>
                    </div>
                    <blockquote className="text-blue-100 italic text-center">
                      "{testimonio.testimonial}"
                    </blockquote>
                    <div className="flex justify-center mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={handleStepForward}
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Quiero Formar Parte
                <UserPlus className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-blue-200">
                Únete a más de 15,000 vecinos que ya apoyan nuestro proyecto
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">
                  <UserPlus className="w-8 h-8 mx-auto mb-2" />
                  Regístrate en Nuestra Comunidad
                </CardTitle>
                <p className="text-blue-200 text-center">
                  Comparte tus datos para recibir información personalizada de nuestras propuestas
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Tu nombre completo"
                      className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Tu número de teléfono"
                      className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="correo@ejemplo.com"
                    className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-white">Dirección (Opcional)</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Tu dirección"
                    className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                  />
                </div>

                <div>
                  <Label className="text-white mb-3 block">¿Qué temas te interesan más?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Vivienda', 'Empleo', 'Educación', 'Seguridad', 'Servicios', 'Desarrollo'].map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        onClick={() => handleInterestToggle(interest)}
                        className={`${formData.interests.includes(interest) 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' 
                          : 'border-white/30 text-white hover:bg-white/10'
                        }`}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-white">¿Cuál es tu mayor prioridad para la comunidad?</Label>
                  <Textarea
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    placeholder="Cuéntanos qué es lo más importante para ti..."
                    className="bg-white/20 border-white/30 text-white placeholder-blue-200"
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-xl"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Confirmar Registro
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center space-y-8">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                ¡Gracias por Unirte!
              </h2>
              <p className="text-xl text-blue-200 mb-6">
                Ahora eres parte de nuestra comunidad. Te mantendremos informado sobre nuestras propuestas 
                y cómo puedes participar en la transformación de tu sector.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Button 
                  onClick={() => navigate('/mapa-alertas')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Ver Mapa de tu Zona
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contactar Equipo
                </Button>
              </div>

              <div className="text-blue-200">
                <p className="mb-2">📱 Te contactaremos pronto</p>
                <p className="mb-2">📧 Revisa tu email para más información</p>
                <p>🗳️ Tu voto cuenta - ¡Juntos haremos el cambio!</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {currentStep < 4 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/20 backdrop-blur rounded-full px-6 py-3 flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-yellow-400' : 'bg-white/30'
                  }`}
                />
              ))}
              <span className="text-white text-sm ml-2">
                Paso {currentStep} de 3
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatoFunnel;
