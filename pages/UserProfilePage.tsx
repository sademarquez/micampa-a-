import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { PencilIcon, ArrowDownTrayIcon, UserCircleIcon, PhoneIcon, EnvelopeIcon as MailIcon, MapPinIcon as LocationMarkerIcon, HashtagIcon, StarIcon, CalendarDaysIcon as CalendarIcon } from '@heroicons/react/24/outline';

const UserProfilePage: React.FC = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombreCompleto: user.nombreCompleto,
        telefono: user.telefono,
        email: user.email,
        municipio: user.municipio,
        barrioVereda: user.barrioVereda,
        profileImageUrl: user.profileImageUrl, // Added for consistency
      });
    }
    setPageLoading(false);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(null);
    setPageLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      await updateUserProfile(formData);
      setSuccess('Perfil actualizado con éxito.');
      setEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError('No se pudo actualizar el perfil.');
    } finally {
      setPageLoading(false);
    }
  };
  
  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm";
  const displayField = (label: string, value: string | number | undefined, icon?: React.ReactNode) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-100 last:border-b-0">
      <dt className="text-sm font-medium text-gray-500 flex items-center">{icon && <span className="mr-2 text-sky-500">{icon}</span>}{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'No especificado'}</dd>
    </div>
  );


  if (authLoading || pageLoading) {
    return (
      <div className="flex justify-center items-center py-10">
         <LoadingSpinner message="Cargando perfil..." />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-500">No se pudo cargar la información del usuario.</p>;
  }
  
  const currentProfileImageUrl = formData.profileImageUrl || user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombreCompleto || 'Usuario')}&background=0284C7&color=fff&size=128`;


  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
            <img 
                src={currentProfileImageUrl}
                alt="Foto de perfil" 
                className="h-16 w-16 rounded-full object-cover mr-4 shadow-md"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{editing ? 'Editar Perfil' : 'Mi Perfil'}</h2>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center text-sm bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 rounded-lg transition duration-300 shadow hover:shadow-md"
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Editar
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
           <div>
            <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700">URL Foto de Perfil</label>
            <input type="text" name="profileImageUrl" id="profileImageUrl" value={formData.profileImageUrl || ''} onChange={handleChange} className={commonInputClasses} placeholder="https://ejemplo.com/foto.png"/>
            <span className="text-xs text-gray-500">O sube una nueva:</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 text-sm"/>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => { 
                  setEditing(false); 
                  setError(null); 
                  setSuccess(null); 
                  if(user) {
                    setFormData({
                        nombreCompleto: user.nombreCompleto,
                        telefono: user.telefono,
                        email: user.email,
                        municipio: user.municipio,
                        barrioVereda: user.barrioVereda,
                        profileImageUrl: user.profileImageUrl
                    });
                  }
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-3 rounded-lg transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-3 rounded-lg transition duration-300 shadow hover:shadow-md"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Guardar
            </button>
          </div>
        </form>
      ) : (
        <dl>
          {displayField('Nombre Completo', user.nombreCompleto, <UserCircleIcon className="h-5 w-5"/>)}
          {displayField('Teléfono', user.telefono, <PhoneIcon className="h-5 w-5"/>)}
          {displayField('Correo Electrónico', user.email, <MailIcon className="h-5 w-5"/>)}
          {displayField('Municipio', user.municipio, <LocationMarkerIcon className="h-5 w-5"/>)}
          {displayField('Barrio/Vereda', user.barrioVereda, <LocationMarkerIcon className="h-5 w-5"/>)}
          {displayField('Rol', user.rol, <HashtagIcon className="h-5 w-5"/>)}
          {displayField('Puntos de Compromiso', user.puntosCompromiso, <StarIcon className="h-5 w-5 text-yellow-500"/>)}
          {displayField('Fecha de Registro', new Date(user.fechaRegistro).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), <CalendarIcon className="h-5 w-5"/>)}
          {user.liderReferenteID && displayField('Líder Referente ID', user.liderReferenteID, <UserCircleIcon className="h-5 w-5"/>)}
        </dl>
      )}
    </div>
  );
};

export default UserProfilePage;
