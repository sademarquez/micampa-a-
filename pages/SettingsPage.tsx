
import React, { useEffect, useState, FormEvent } from 'react';
import { getAppSettings, updateAppSettings } from '../services/electoralPwaService';
import { AppSettings } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { CogIcon, BellAlertIcon, LanguageIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<AppSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getAppSettings();
        setSettings(data);
      } catch (err) {
        setError("Error al cargar la configuración.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateAppSettings(settings);
      setSuccess("Configuración guardada con éxito.");
    } catch (err) {
      setError("Error al guardar la configuración.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const toggleClass = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const toggleHandleClass = "inline-block w-4 h-4 transform bg-white rounded-full transition-transform";


  if (loading) {
    return <LoadingSpinner message="Cargando configuración..." />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <CogIcon className="h-8 w-8 mr-3 text-gray-700" />
        Configuración de la Aplicación
      </h1>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Language Setting */}
        <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-1">
                <LanguageIcon className="h-5 w-5 mr-2 text-gray-500"/>Idioma
            </h2>
            <p className="text-sm text-gray-500 mb-3">Selecciona el idioma de la interfaz.</p>
            <select
                name="language"
                value={settings.language || 'es'}
                onChange={handleChange}
                className={commonInputClasses + " max-w-xs"}
            >
                <option value="es">Español</option>
                <option value="en">English</option>
            </select>
        </div>

        {/* Notifications Setting */}
        <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-1">
                <BellAlertIcon className="h-5 w-5 mr-2 text-gray-500"/>Notificaciones Push
            </h2>
            <p className="text-sm text-gray-500 mb-3">Habilitar o deshabilitar notificaciones push en este dispositivo.</p>
            <button
                type="button"
                name="notificationsEnabled"
                onClick={() => setSettings(s => ({...s, notificationsEnabled: !s.notificationsEnabled}))}
                className={`${toggleClass} ${settings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                aria-pressed={settings.notificationsEnabled}
            >
                <span className="sr-only">Habilitar notificaciones</span>
                <span className={`${toggleHandleClass} ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
        
        {/* Theme Setting */}
        <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-1">
                {settings.theme === 'dark' ? <MoonIcon className="h-5 w-5 mr-2 text-gray-500"/> : <SunIcon className="h-5 w-5 mr-2 text-gray-500"/>}
                Tema Visual
            </h2>
            <p className="text-sm text-gray-500 mb-3">Elige el tema visual de la aplicación (claro u oscuro).</p>
             <select
                name="theme"
                value={settings.theme || 'light'}
                onChange={handleChange}
                className={commonInputClasses + " max-w-xs"}
            >
                <option value="light">Claro</option>
                <option value="dark">Oscuro (Próximamente)</option> 
            </select>
            {settings.theme === 'dark' && <p className="text-xs text-yellow-600 mt-1">El tema oscuro es una funcionalidad en desarrollo.</p>}
        </div>


        <div className="pt-5">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {saving ? <LoadingSpinner size="sm" /> : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
