import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MapPin, Users, Heart, Star, Sparkles } from "lucide-react";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    email: "",
    municipio: "",
    barrioVereda: "",
    liderReferenteID: "",
    motivacion: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const municipios = [
    "Buenaventura",
    "Tumaco",
    "Quibdó",
    "Guapi",
    "Timbiquí",
    "López de Micay",
    "Nuquí",
    "Bahía Solano"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría la lógica para enviar los datos a Google Sheets
      console.log("Datos del formulario:", formData);
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "¡Registro Exitoso!",
        description: "Bienvenido a Mi Campaña. Pronto un líder territorial se pondrá en contacto contigo.",
      });

      // Resetear formulario
      setFormData({
        nombreCompleto: "",
        telefono: "",
        email: "",
        municipio: "",
        barrioVereda: "",
        liderReferenteID: "",
        motivacion: ""
      });
    } catch (error) {
      toast({
        title: "Error en el registro",
        description: "Por favor intenta nuevamente o contacta a nuestro equipo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-secondary py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Únete a Mi Campaña
            </h1>
            <p className="text-xl text-purple-600/80">
              Sé parte de la red de corazones que transforma el Pacífico colombiano
            </p>
          </div>

          {/* Registration Form */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur">
            <CardHeader className="gradient-primary text-white rounded-t-xl">
              <CardTitle className="text-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 mr-3" />
                Tu Historia de Esperanza Comienza Aquí
              </CardTitle>
              <CardDescription className="text-purple-100 text-center">
                Todos los campos marcados con ✨ son obligatorios
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Personal */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-4 border-b border-purple-200">
                    <User className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-semibold text-purple-700">
                      Información Personal
                    </h3>
                  </div>
                  
                  <div>
                    <Label htmlFor="nombreCompleto" className="text-base font-medium text-purple-700 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-purple-500" />
                      Nombre Completo ✨
                    </Label>
                    <Input
                      id="nombreCompleto"
                      type="text"
                      value={formData.nombreCompleto}
                      onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                      required
                      className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="telefono" className="text-base font-medium text-purple-700 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-purple-500" />
                        Teléfono WhatsApp ✨
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="+57 300 123 4567"
                        required
                        className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-base font-medium text-purple-700 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-purple-500" />
                        Email (opcional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Territorial */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-4 border-b border-purple-200">
                    <MapPin className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-semibold text-purple-700">
                      Tu Territorio de Esperanza
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="municipio" className="text-base font-medium text-purple-700">
                        Municipio ✨
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("municipio", value)}>
                        <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-400">
                          <SelectValue placeholder="Selecciona tu municipio" />
                        </SelectTrigger>
                        <SelectContent>
                          {municipios.map((municipio) => (
                            <SelectItem key={municipio} value={municipio}>
                              {municipio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="barrioVereda" className="text-base font-medium text-purple-700">
                        Barrio/Vereda ✨
                      </Label>
                      <Input
                        id="barrioVereda"
                        type="text"
                        value={formData.barrioVereda}
                        onChange={(e) => handleInputChange("barrioVereda", e.target.value)}
                        placeholder="Nombre de tu barrio o vereda"
                        required
                        className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Referencia y Motivación */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-4 border-b border-purple-200">
                    <Heart className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-semibold text-purple-700">
                      Tu Motivación y Conexiones
                    </h3>
                  </div>
                  
                  <div>
                    <Label htmlFor="liderReferenteID" className="text-base font-medium text-purple-700">
                      ID del Líder que Iluminó tu Camino (opcional)
                    </Label>
                    <Input
                      id="liderReferenteID"
                      type="text"
                      value={formData.liderReferenteID}
                      onChange={(e) => handleInputChange("liderReferenteID", e.target.value)}
                      placeholder="Ej: LID001"
                      className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivacion" className="text-base font-medium text-purple-700">
                      ¿Qué te inspira a unirte a Mi Campaña? 💜
                    </Label>
                    <Textarea
                      id="motivacion"
                      value={formData.motivacion}
                      onChange={(e) => handleInputChange("motivacion", e.target.value)}
                      placeholder="Comparte qué mueve tu corazón a participar en este sueño colectivo..."
                      rows={4}
                      className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gradient-primary hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-102 rounded-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-pulse mr-3">💜</div>
                        Tejiendo tu historia...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="w-5 h-5 mr-3" />
                        Unir mi Corazón a la Campaña
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-8 gradient-accent border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="font-bold text-purple-800 text-xl">
                  ¿Qué sucede después de unir tu corazón?
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-purple-700 space-y-3">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-purple-500" />
                    Recibirás una bienvenida llena de amor por WhatsApp
                  </li>
                  <li className="flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-purple-500" />
                    Un líder territorial se convertirá en tu compañero de ruta
                  </li>
                </ul>
                <ul className="text-purple-700 space-y-3">
                  <li className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                    Accederás a herramientas que transforman comunidades
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Participarás en eventos que siembran esperanza
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Registro;
