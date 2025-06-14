
import React from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface AlertMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  const typeStyles = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      Icon: CheckCircleIcon,
      iconColor: 'text-green-500',
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      Icon: XCircleIcon,
      iconColor: 'text-red-500',
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      Icon: InformationCircleIcon,
      iconColor: 'text-blue-500',
    },
  };

  const currentStyle = typeStyles[type];

  if (!message) return null;

  return (
    <div className={`border-l-4 ${currentStyle.borderColor} ${currentStyle.bgColor} p-4 my-4 rounded-md shadow-sm`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <currentStyle.Icon className={`h-5 w-5 ${currentStyle.iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${currentStyle.textColor}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex ${currentStyle.bgColor} rounded-md p-1.5 ${currentStyle.textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentStyle.borderColor.replace('border-', 'focus:ring-')}`}
              >
                <span className="sr-only">Descartar</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
