import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CampaignStats, NewsItem } from '../types';
import { getCampaignStats, getNewsFeed } from '../services/campaignService';
import LoadingSpinner from '../components/LoadingSpinner';
import { UsersIcon, ShieldCheckIcon, NewspaperIcon, CalendarDaysIcon as CalendarIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campaignStats, newsData] = await Promise.all([
          getCampaignStats(),
          getNewsFeed()
        ]);
        setStats(campaignStats);
        setNews(newsData);
      } catch (error) {
        console.error("Error al cargar datos de la página de inicio:", error);
        // Podrías setear un estado de error aquí para mostrar en la UI
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando datos de la campaña..." />;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6 rounded-lg shadow-xl text-center">
        <img src="https://picsum.photos/seed/candidate/150/150" alt="Ximena López Yule" className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg" />
        <h1 className="text-4xl font-bold mb-4">¡Bienvenido a la campaña de Ximena López Yule!</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Uniendo fuerzas por el desarrollo social y el bienestar de las comunidades del Pacífico Colombiano.
          Tu participación es clave para construir un futuro mejor.
        </p>
        <Link
          to="/registro"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-8 rounded-lg text-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Únete a la Campaña
        </Link>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="grid md:grid-cols-2 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <UsersIcon className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-indigo-700">{stats.numeroMiembros.toLocaleString()}</h2>
            <p className="text-gray-600">Miembros Comprometidos</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ShieldCheckIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-green-600">{stats.numeroAlertasAtendidas.toLocaleString()}</h2>
            <p className="text-gray-600">Alertas Comunitarias Atendidas</p>
          </div>
        </section>
      )}

      {/* News/Events Feed Section */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center">
          <NewspaperIcon className="h-8 w-8 mr-3 text-indigo-600" />
          Noticias y Eventos Recientes
        </h2>
        {news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                {item.imagenUrl && <img src={item.imagenUrl} alt={item.titulo} className="w-full h-48 object-cover"/>}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {new Date(item.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-700 mb-4 flex-grow">{item.resumen}</p>
                  {item.enlace && (
                    <a
                      href={item.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-indigo-600 hover:text-indigo-800 font-semibold transition duration-300"
                    >
                      Leer más &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay noticias o eventos recientes.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;