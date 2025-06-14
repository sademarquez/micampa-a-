
import React, { useEffect, useState } from 'react';
import { getCampaignStructure } from '../services/electoralPwaService';
import { CampaignStructureNode } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { UsersIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface NodeProps {
  node: CampaignStructureNode;
  level: number;
}

const TreeNode: React.FC<NodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Open first few levels by default

  return (
    <div style={{ marginLeft: `${level * 20}px` }} className="my-1">
      <div 
        className={`flex items-center p-2 rounded cursor-pointer ${level === 0 ? 'bg-blue-100' : level === 1 ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
        onClick={() => node.children && node.children.length > 0 && setIsOpen(!isOpen)}
      >
        {node.children && node.children.length > 0 ? (
          isOpen ? <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-500" /> : <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-500" />
        ) : (
          <span className="w-5 h-5 mr-2"></span> // Placeholder for alignment
        )}
        <span className="font-semibold text-gray-800">{node.name}</span>
        {node.manager && <span className="ml-2 text-sm text-gray-600">({node.manager})</span>}
        {node.membersCount !== undefined && <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">{node.membersCount} miembros</span>}
      </div>
      {isOpen && node.children && node.children.length > 0 && (
        <div className="mt-1 border-l-2 border-gray-300 pl-2">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};


const CampaignStructurePage: React.FC = () => {
  const [structure, setStructure] = useState<CampaignStructureNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStructure = async () => {
      setLoading(true);
      try {
        const data = await getCampaignStructure();
        setStructure(data);
      } catch (err) {
        setError("Error al cargar la estructura de la campaña.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStructure();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando estructura de campaña..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <UsersIcon className="h-8 w-8 mr-3 text-indigo-600" />
        Estructura de la Campaña
      </h1>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

      {structure ? (
         <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
           <TreeNode node={structure} level={0} />
         </div>
      ) : (
        !error && <p className="text-center text-gray-500">No se pudo cargar la estructura de la campaña.</p>
      )}
      <p className="text-xs text-gray-500 text-center">Haz clic en los nodos para expandir/colapsar.</p>
    </div>
  );
};

export default CampaignStructurePage;
