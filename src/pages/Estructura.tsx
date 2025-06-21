
import MapaEstructura from "@/components/MapaEstructura";
import { Building2 } from "lucide-react";

const Estructura = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-purple-600" />
          <span>Mapa de la Estructura Organizacional</span>
        </h1>
        <p className="text-gray-600">Visualización geográfica y jerárquica del equipo de campaña.</p>
      </div>

      <MapaEstructura />
    </div>
  );
};

export default Estructura;
