
import React, { useState, FormEvent } from 'react';
import { Voter } from '../types';
import { registerVoter } from '../services/electoralPwaService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const RegisterVoterPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<Voter, 'id' | 'registrationDate'>>({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pollingPlaceId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!formData.fullName || !formData.idNumber || !formData.city) {
        setError("Nombre completo, número de identificación y ciudad son obligatorios.");
        setLoading(false);
        return;
      }
      const newVoter = await registerVoter(formData);
      setSuccess(`Votante ${newVoter.fullName} registrado con éxito (ID: ${newVoter.id}).`);
      // Reset form
      setFormData({ fullName: '', idNumber: '', phone: '', email: '', address: '', city: '', pollingPlaceId: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el votante.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <UserPlusIcon className="h-8 w-8 mr-3 text-green-600" />
        Registrar Nuevo Votante
      </h1>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre Completo*</label>
            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">Nº Identificación (Cédula/DNI)*</label>
            <input type="text" name="idNumber" id="idNumber" value={formData.idNumber} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad*</label>
            <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className={inputClass} required/>
          </div>
          <div>
            <label htmlFor="pollingPlaceId" className="block text-sm font-medium text-gray-700">ID Lugar de Votación (Opcional)</label>
            <input type="text" name="pollingPlaceId" id="pollingPlaceId" value={formData.pollingPlaceId} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Registrar Votante'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterVoterPage;
