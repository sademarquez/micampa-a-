import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthenticatedUser } from '../types'; // Use AuthenticatedUser for user type
// updateCandidateProfile is handled by useAuth().updateUserProfile
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { UserCircleIcon, PencilIcon, EnvelopeIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const CandidateProfilePage: React.FC = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  // Use Partial<AuthenticatedUser> for formData as it reflects the structure of the logged-in user (candidate)
  const [formData, setFormData] = useState<Partial<AuthenticatedUser>>({});
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.nombreCompleto,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        welcomeMessage: user.welcomeMessage,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Simular subida y obtener URL, o convertir a base64 para demo
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPageLoading(true);
    try {
      // updateUserProfile expects Partial<User>, which Partial<AuthenticatedUser> is compatible with
      await updateUserProfile(formData); 
      setSuccess('Perfil actualizado con éxito.');
      setIsEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError('No se pudo actualizar el perfil.');
    } finally {
      setPageLoading(false);
    }
  };

  if (authLoading || !user) {
    return <LoadingSpinner message="Cargando perfil del candidato..." />;
  }
  
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";


  return (
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
         <img 
            src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombreCompleto || 'Candidato')}&background=random&color=fff&size=128`} 
            alt="Foto de perfil" 
            className="h-24 w-24 rounded-full object-cover mr-6 shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.nombreCompleto}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow hover:shadow-md"
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Editar Perfil
          </button>
        )}
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}
      
      {pageLoading && <LoadingSpinner message="Guardando cambios..." />}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input type="text" name="nombreCompleto" id="nombreCompleto" value={formData.nombreCompleto || ''} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700">URL de Imagen de Perfil</label>
            <input type="text" name="profileImageUrl" id="profileImageUrl" placeholder="https://ejemplo.com/imagen.jpg" value={formData.profileImageUrl || ''} onChange={handleChange} className={inputClass} />
            <span className="text-xs text-gray-500">O sube una nueva imagen:</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 text-sm"/>
          </div>
          <div>
            <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">Mensaje de Bienvenida</label>
            <textarea name="welcomeMessage" id="welcomeMessage" rows={3} value={formData.welcomeMessage || ''} onChange={handleChange} className={inputClass} placeholder="Un breve mensaje para tus seguidores..." />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => { 
                  setIsEditing(false); 
                  setError(null); 
                  setSuccess(null); 
                  if(user) { // Reset form to current user state
                    setFormData({
                        nombreCompleto: user.nombreCompleto,
                        email: user.email,
                        profileImageUrl: user.profileImageUrl,
                        welcomeMessage: user.welcomeMessage,
                    });
                  }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pageLoading}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow hover:shadow-md"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
            <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-1 mr-3"/>
                <div>
                    <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                    <p className="text-gray-800">{user.email}</p>
                </div>
            </div>
             <div className="flex items-start">
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400 mt-1 mr-3"/>
                <div>
                    <p className="text-sm font-medium text-gray-500">Mensaje de Bienvenida</p>
                    <p className="text-gray-800 italic">{user.welcomeMessage || 'No especificado.'}</p>
                </div>
            </div>
            {/* Display other User fields if necessary, e.g., user.rol, user.puntosCompromiso */}
        </div>
      )}
    </div>
  );
};

export default CandidateProfilePage;