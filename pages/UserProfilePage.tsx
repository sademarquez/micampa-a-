import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { PencilIcon, ArrowDownTrayIcon, UserCircleIcon, PhoneIcon, EnvelopeIcon as MailIcon, MapPinIcon as LocationMarkerIcon, HashtagIcon, StarIcon, CalendarDaysIcon as CalendarIcon } from '@heroicons/react/24/outline';

const UserProfilePage: React.FC = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth(); // Changed updateUser to updateUserProfile
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        // These fields are now part of the AuthenticatedUser (which extends User)
        nombreCompleto: user.nombreCompleto,
        telefono: user.telefono,
        email: user.email,
        municipio: user.municipio,
        barrioVereda: user.barrioVereda,
      });
    }
    setPageLoading(false);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(null);
    setPageLoading(true);
    try {
      // Simulate API call to update user profile
      // In a real app, this would be an API call to a Netlify function.
      await new Promise(resolve => setTimeout(resolve, 500)); 
      await updateUserProfile(formData); // Use updateUserProfile from context
      setSuccess('Perfil actualizado con éxito.');
      setEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError('No se pudo actualizar el perfil.');
    } finally {
      setPageLoading(false);
    }
  };
  
  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const displayField = (label: string, value: string | number | undefined, icon?: React.ReactNode) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500 flex items-center">{icon && <span className="mr-2">{icon}</span>}{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'No especificado'}</dd>
    </div>
  );


  if (authLoading || pageLoading) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  if (!user) {
    return <p className="text-center text-red-500">No se pudo cargar la información del usuario.</p>;
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Mi Perfil</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Editar Perfil
          </button>
        )}
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input type="text" name="nombreCompleto" id="nombreCompleto" value={formData.nombreCompleto || ''} onChange={handleChange} className={commonInputClasses} />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="tel" name="telefono" id="telefono" value={formData.telefono || ''} onChange={handleChange} className={commonInputClasses} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className={commonInputClasses} />
          </div>
          <div>
            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">Municipio</label>
            <input type="text" name="municipio" id="municipio" value={formData.municipio || ''} onChange={handleChange} className={commonInputClasses} />
          </div>
          <div>
            <label htmlFor="barrioVereda" className="block text-sm font-medium text-gray-700">Barrio/Vereda</label>
            <input type="text" name="barrioVereda" id="barrioVereda" value={formData.barrioVereda || ''} onChange={handleChange} className={commonInputClasses} />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => { 
                  setEditing(false); 
                  setError(null); 
                  setSuccess(null); 
                  if(user) { // Reset form data to current user state
                    setFormData({
                        nombreCompleto: user.nombreCompleto,
                        telefono: user.telefono,
                        email: user.email,
                        municipio: user.municipio,
                        barrioVereda: user.barrioVereda,
                    });
                  }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        <dl className="divide-y divide-gray-200">
          {displayField('Nombre Completo', user.nombreCompleto, <UserCircleIcon className="h-5 w-5 text-gray-400"/>)}
          {displayField('Teléfono', user.telefono, <PhoneIcon className="h-5 w-5 text-gray-400"/>)}
          {displayField('Correo Electrónico', user.email, <MailIcon className="h-5 w-5 text-gray-400"/>)}
          {displayField('Municipio', user.municipio, <LocationMarkerIcon className="h-5 w-5 text-gray-400"/>)}
          {displayField('Barrio/Vereda', user.barrioVereda, <LocationMarkerIcon className="h-5 w-5 text-gray-400"/>)}
          {displayField('Rol', user.rol, <HashtagIcon className="h-5 w-5 text-gray-400"/>)}
          {displayField('Puntos de Compromiso', user.puntosCompromiso, <StarIcon className="h-5 w-5 text-yellow-400"/>)}
          {displayField('Fecha de Registro', new Date(user.fechaRegistro).toLocaleDateString('es-CO'), <CalendarIcon className="h-5 w-5 text-gray-400"/>)}
          {user.liderReferenteID && displayField('Líder Referente ID', user.liderReferenteID, <UserCircleIcon className="h-5 w-5 text-gray-400"/>)}
        </dl>
      )}
    </div>
  );
};

export default UserProfilePage;