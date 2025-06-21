
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Calendar, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportePublicidad = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipo: "",
    ubicacion: "",
    descripcion: "",
    fecha: "",
    responsable: "",
    imagen: null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reporte enviado",
      description: "El reporte de publicidad ha sido registrado exitosamente.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-blue-500" />
              <span>Reporte de Publicidad</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Publicidad</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valla">Valla Publicitaria</SelectItem>
                    <SelectItem value="pancarta">Pancarta</SelectItem>
                    <SelectItem value="volante">Volante</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="television">Televisión</SelectItem>
                    <SelectItem value="digital">Digital/Redes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <div className="flex space-x-2">
                  <Input
                    id="ubicacion"
                    placeholder="Dirección o descripción del lugar"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de Colocación</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable</Label>
                <Input
                  id="responsable"
                  placeholder="Nombre del responsable"
                  value={formData.responsable}
                  onChange={(e) => setFormData({...formData, responsable: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el contenido y detalles de la publicidad"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagen</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
                  <Input type="file" accept="image/*" className="hidden" />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Enviar Reporte
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportePublicidad;
