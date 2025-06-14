
import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-center px-4">
      <ExclamationTriangleIcon className="h-20 w-20 text-yellow-500 mb-6" />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Error 404</h1>
      <p className="text-xl text-gray-600 mb-8">
        La página que estás buscando no existe o ha sido movida.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
