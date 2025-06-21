import { DeveloperPanel } from "@/components/DeveloperPanel";
import Navigation from "@/components/Navigation";
import { Code } from "lucide-react";

const DeveloperPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <Code className="w-8 h-8 text-blue-500" />
            Panel del Desarrollador
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Configura tu infraestructura cognitiva de forma segura.
          </p>
        </div>
        <DeveloperPanel />
      </div>
    </div>
  );
};

export default DeveloperPage; 