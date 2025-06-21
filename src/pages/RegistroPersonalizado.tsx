
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Vote, UserPlus, Shield, Crown, Users, MapPin } from 'lucide-react';

const RegistroPersonalizado = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    cedula: '',
    role: 'votante' as 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante',
    territorio: '',
    motivacion: '',
    experiencia: '',
    disponibilidad: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const roleConfig = {
    desarrollador: {
      icon: Shield,
      title: 'Registro Desarrollador',
      description: 'Acceso completo al sistema - Responsabilidades técnicas y de administración',
      color: 'bg-red-600',
      fields: ['nombre', 'email', 'telefono', 'experiencia', 'disponibilidad'],
      restricted: true
    },
    master: {
      icon: Crown,
      title: 'Registro Master de Campaña', 
      description: 'Gestión estratégica y coordinación general de candidatos',
      color: 'bg-purple-600',
      fields: ['nombre', 'email', 'telefono', 'direccion', 'experiencia', 'motivacion'],
      restricted: true
    },
    candidato: {
      icon: Vote,
      title: 'Registro Candidato',
      description: 'Liderazgo de campaña y coordinación de equipos territoriales',
      color: 'bg-blue-600',
      fields: ['nombre', 'email', 'telefono', 'direccion', 'territorio', 'motivacion', 'experiencia'],
      restricted: false
    },
    lider: {
      icon: MapPin,
      title: 'Registro Líder Territorial',
      description: 'Coordinación local y gestión de votantes en territorio específico',
      color: 'bg-green-600',
      fields: ['nombre', 'email', 'telefono', 'direccion', 'cedula', 'territorio', 'motivacion', 'disponibilidad'],
      restricted: false
    },
    votante: {
      icon: Users,
      title: 'Registro Votante',
      description: 'Participación activa en actividades de campaña',
      color: 'bg-indigo-600',
      fields: ['nombre', 'email', 'telefono', 'direccion', 'cedula', 'territorio', 'motivacion'],
      restricted: false
    }
  };

  const currentRole = roleConfig[formData.role];
  const Icon = currentRole.icon;

  const canRegisterRole = (role: string) => {
    if (!user) return role === 'votante';
    
    switch (user.role) {
      case 'desarrollador': return true;
      case 'master': return ['candidato', 'lider', 'votante'].includes(role);
      case 'candidato': return ['lider', 'votante'].includes(role);
      case 'lider': return role === 'votante';
      default: return role === 'votante';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validaciones específicas por rol
      if (!canRegisterRole(formData.role)) {
        setError('No tienes permisos para registrar este tipo de usuario');
        setIsLoading(false);
        return;
      }

      // Aquí iría la lógica de registro
      console.log('Registrando usuario:', formData);
      
      // Simular registro exitoso
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error en el registro. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center">
            <div className={`mx-auto w-16 h-16 ${currentRole.color} rounded-full flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">{currentRole.title}</CardTitle>
            <p className="text-gray-600">{currentRole.description}</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de rol */}
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Registro</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: any) => updateFormData('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([key, config]) => (
                      <SelectItem 
                        key={key} 
                        value={key}
                        disabled={!canRegisterRole(key)}
                      >
                        <div className="flex items-center gap-2">
                          <config.icon className="w-4 h-4" />
                          {config.title}
                          {!canRegisterRole(key) && <span className="text-red-500 text-xs">(Sin permisos)</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campos dinámicos según el rol */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentRole.fields.includes('nombre') && (
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => updateFormData('nombre', e.target.value)}
                      placeholder="Nombre completo"
                      required
                    />
                  </div>
                )}

                {currentRole.fields.includes('email') && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="correo@micampana.com"
                      required
                    />
                  </div>
                )}

                {currentRole.fields.includes('telefono') && (
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => updateFormData('telefono', e.target.value)}
                      placeholder="+57 300 123 4567"
                      required
                    />
                  </div>
                )}

                {currentRole.fields.includes('cedula') && (
                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input
                      id="cedula"
                      value={formData.cedula}
                      onChange={(e) => updateFormData('cedula', e.target.value)}
                      placeholder="Número de identificación"
                    />
                  </div>
                )}

                {currentRole.fields.includes('direccion') && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => updateFormData('direccion', e.target.value)}
                      placeholder="Dirección completa"
                    />
                  </div>
                )}

                {currentRole.fields.includes('territorio') && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="territorio">Territorio de Responsabilidad</Label>
                    <Select value={formData.territorio} onValueChange={(value) => updateFormData('territorio', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu territorio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barrio-esperanza">Barrio Esperanza</SelectItem>
                        <SelectItem value="comuna-1">Comuna 1</SelectItem>
                        <SelectItem value="zona-industrial">Zona Industrial</SelectItem>
                        <SelectItem value="sector-educativo">Sector Educativo</SelectItem>
                        <SelectItem value="centro-historico">Centro Histórico</SelectItem>
                        <SelectItem value="plaza-principal">Plaza Principal</SelectItem>
                        <SelectItem value="mercado-central">Mercado Central</SelectItem>
                        <SelectItem value="barrio-nuevo">Barrio Nuevo</SelectItem>
                        <SelectItem value="zona-residencial">Zona Residencial</SelectItem>
                        <SelectItem value="puerto-nuevo">Puerto Nuevo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Campos de texto largo */}
              {currentRole.fields.includes('motivacion') && (
                <div className="space-y-2">
                  <Label htmlFor="motivacion">Motivación para unirse a la campaña</Label>
                  <Textarea
                    id="motivacion"
                    value={formData.motivacion}
                    onChange={(e) => updateFormData('motivacion', e.target.value)}
                    placeholder="¿Por qué quieres ser parte de esta campaña?"
                    className="min-h-[80px]"
                  />
                </div>
              )}

              {currentRole.fields.includes('experiencia') && (
                <div className="space-y-2">
                  <Label htmlFor="experiencia">Experiencia relevante</Label>
                  <Textarea
                    id="experiencia"
                    value={formData.experiencia}
                    onChange={(e) => updateFormData('experiencia', e.target.value)}
                    placeholder="Describe tu experiencia en campañas, liderazgo o actividades comunitarias"
                    className="min-h-[80px]"
                  />
                </div>
              )}

              {currentRole.fields.includes('disponibilidad') && (
                <div className="space-y-2">
                  <Label htmlFor="disponibilidad">Disponibilidad de tiempo</Label>
                  <Select value={formData.disponibilidad} onValueChange={(value) => updateFormData('disponibilidad', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="¿Cuánto tiempo puedes dedicar?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiempo-completo">Tiempo completo (40+ horas/semana)</SelectItem>
                      <SelectItem value="medio-tiempo">Medio tiempo (20-40 horas/semana)</SelectItem>
                      <SelectItem value="fines-semana">Fines de semana (10-20 horas/semana)</SelectItem>
                      <SelectItem value="ocasional">Ocasional (menos de 10 horas/semana)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className={`w-full ${currentRole.color}`} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Registrar {currentRole.title.split(' ')[1]}
                  </div>
                )}
              </Button>

              {/* Información adicional por rol */}
              <div className={`p-4 rounded-lg border-2 border-dashed ${currentRole.color} border-opacity-20 bg-opacity-10`}>
                <h4 className="font-semibold text-sm mb-2">Responsabilidades como {formData.role}:</h4>
                <ul className="text-xs space-y-1">
                  {formData.role === 'desarrollador' && (
                    <>
                      <li>• Administración completa del sistema</li>
                      <li>• Gestión de usuarios y permisos</li>
                      <li>• Supervisión técnica y seguridad</li>
                      <li>• Configuración de funcionalidades avanzadas</li>
                    </>
                  )}
                  {formData.role === 'master' && (
                    <>
                      <li>• Coordinación estratégica de la campaña</li>
                      <li>• Gestión de candidatos y territorios</li>
                      <li>• Supervisión de métricas y reportes</li>
                      <li>• Toma de decisiones ejecutivas</li>
                    </>
                  )}
                  {formData.role === 'candidato' && (
                    <>
                      <li>• Liderazgo de equipo territorial</li>
                      <li>• Gestión de líderes y coordinadores</li>
                      <li>• Planificación de eventos y actividades</li>
                      <li>• Representación pública de la campaña</li>
                    </>
                  )}
                  {formData.role === 'lider' && (
                    <>
                      <li>• Coordinación del territorio asignado</li>
                      <li>• Registro y seguimiento de votantes</li>
                      <li>• Organización de actividades locales</li>
                      <li>• Reporte de avances y necesidades</li>
                    </>
                  )}
                  {formData.role === 'votante' && (
                    <>
                      <li>• Participación en eventos de campaña</li>
                      <li>• Promoción del candidato en su círculo social</li>
                      <li>• Colaboración en actividades específicas</li>
                      <li>• Asistencia a reuniones y capacitaciones</li>
                    </>
                  )}
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroPersonalizado;
