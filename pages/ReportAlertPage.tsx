import React, { useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertType } from '../types';
import { ALERT_TYPE_OPTIONS } from '../constants';
import { submitAlert } from '../services/campaignService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { DocumentTextIcon as DocumentReportIcon, MapPinIcon as LocationMarkerIcon, PhotoIcon as PhotographIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ReportAlertPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tipoAlerta, setTipoAlerta] = useState<AlertType>(AlertType.FALLA_SERVICIO);
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [ubicacionManual, setUbicacionManual] = useState(''); // For manual input if geolocation fails
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacion({ lat: position.coords.latitude, lng: position.coords.longitude });
          setUbicacionManual(`Lat: ${position.coords.latitude.toFixed(5)}, Lng: ${position.coords.longitude.toFixed(5)}`);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error("Error obteniendo geolocalización:", err);
          setError("No se pudo obtener la geolocalización. Por favor, ingresa la ubicación manualmente.");
          setLoading(false);
        }
      );
    } else {
      setError("La geolocalización no es soportada por tu navegador. Ingresa la ubicación manualmente.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setMediaFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError("Debes estar autenticado para reportar una alerta.");
      return;
    }
    if (!descripcion.trim()) {
        setError("La descripción es obligatoria.");
        return;
    }
    if (!ubicacion && !ubicacionManual.trim()) {
        setError("La ubicación es obligatoria. Intenta obtenerla automáticamente o ingrésala manualmente.");
        return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate media upload (Cloudinary URL would be returned by actual upload service)
      let urlMedia;
      if (mediaFile) {
        // Mock upload delay and URL
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        urlMedia = `https://picsum.photos/seed/${Date.now()}/300/200`; // Placeholder URL
        console.log("Archivo simulado subido a:", urlMedia);
      }

      const alertData = {
        tipoAlerta,
        descripcion,
        // Use parsed manual location if auto-location failed or wasn't used
        latitud: ubicacion ? ubicacion.lat : parseFloat(ubicacionManual.split(',')[0].replace('Lat:', '').trim()) || 0,
        longitud: ubicacion ? ubicacion.lng : parseFloat(ubicacionManual.split(',')[1].replace('Lng:', '').trim()) || 0,
        urlMedia,
        reportadoPorUserID: user.userID, // user.userID is now available
      };

      await submitAlert(alertData);
      setSuccess("Alerta reportada con éxito. Los administradores serán notificados.");
      // Reset form
      setTipoAlerta(AlertType.FALLA_SERVICIO);
      setDescripcion('');
      setUbicacion(null);
      setUbicacionManual('');
      setMediaFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        navigate('/mapa-alertas');
      }, 2000);

    } catch (err) {
      console.error("Error al reportar alerta:", err);
      setError(err instanceof Error ? err.message : "Ocurrió un error al enviar la alerta.");
    } finally {
      setLoading(false);
    }
  };

  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-xl">
       <button onClick={() => navigate(-1)} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4">
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Volver
      </button>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <DocumentReportIcon className="h-8 w-8 mr-3 text-indigo-600"/>
        Reportar Nueva Alerta
      </h2>
      
      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="tipoAlerta" className="block text-sm font-medium text-gray-700">Tipo de Alerta</label>
          <select
            id="tipoAlerta"
            name="tipoAlerta"
            value={tipoAlerta}
            onChange={(e) => setTipoAlerta(e.target.value as AlertType)}
            className={commonInputClasses}
          >
            {ALERT_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={commonInputClasses}
            placeholder="Describe la alerta detalladamente..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ubicación</label>
          <div className="mt-1 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loading}
              className="flex-grow sm:flex-grow-0 items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:bg-indigo-300"
            >
              <LocationMarkerIcon className="h-5 w-5 mr-2 inline-block"/> Obtener Ubicación Actual
            </button>
            <input
              type="text"
              name="ubicacionManual"
              value={ubicacionManual}
              onChange={(e) => { setUbicacionManual(e.target.value); setUbicacion(null); }}
              placeholder="O ingresa Lat, Lng (ej: 3.45, -76.53)"
              className={`${commonInputClasses} flex-grow`}
            />
          </div>
          {ubicacion && <p className="mt-2 text-xs text-green-600">Ubicación obtenida: Lat {ubicacion.lat.toFixed(5)}, Lng {ubicacion.lng.toFixed(5)}</p>}
        </div>

        <div>
          <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-700">Foto/Video (Opcional)</label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              {mediaFile ? (
                <img src={URL.createObjectURL(mediaFile)} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <PhotographIcon className="h-full w-full text-gray-300" />
              )}
            </span>
            <input
                type="file"
                id="mediaFile"
                name="mediaFile"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </div>
           {mediaFile && <p className="mt-1 text-xs text-gray-500">{mediaFile.name} ({ (mediaFile.size / 1024).toFixed(1) } KB)</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Reportar Alerta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportAlertPage;