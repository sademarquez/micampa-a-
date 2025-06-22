export interface RoleTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  headerGradient: string;
  buttonClass: string;
  ringColor: string;
}

export const roleThemes: Record<string, RoleTheme> = {
  desarrollador: {
    primaryColor: '#4338ca', // Indigo 700
    secondaryColor: '#059669', // Emerald 600
    accentColor: '#db2777', // Pink 600
    backgroundColor: 'bg-gray-900',
    textColor: 'text-gray-100',
    borderColor: 'border-indigo-500',
    headerGradient: 'bg-gradient-to-r from-gray-800 via-indigo-900 to-black',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    ringColor: 'ring-indigo-500',
  },
  master: {
    primaryColor: '#f59e0b', // Amber 500
    secondaryColor: '#3b82f6', // Blue 500
    accentColor: '#8b5cf6', // Violet 500
    backgroundColor: 'bg-slate-900',
    textColor: 'text-amber-100',
    borderColor: 'border-amber-400',
    headerGradient: 'bg-gradient-to-r from-slate-800 via-amber-900 to-black',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white',
    ringColor: 'ring-amber-500',
  },
  candidato: {
    primaryColor: '#16a34a', // Green 600
    secondaryColor: '#2563eb', // Blue 600
    accentColor: '#ea580c', // Orange 600
    backgroundColor: 'bg-white',
    textColor: 'text-gray-800',
    borderColor: 'border-green-500',
    headerGradient: 'bg-gradient-to-r from-green-50 via-green-100 to-lime-100',
    buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
    ringColor: 'ring-green-600',
  },
  lider: {
    primaryColor: '#2563eb', // Blue 600
    secondaryColor: '#f59e0b', // Amber 500
    accentColor: '#14b8a6', // Teal 500
    backgroundColor: 'bg-blue-50',
    textColor: 'text-gray-900',
    borderColor: 'border-blue-400',
    headerGradient: 'bg-gradient-to-r from-blue-100 to-sky-100',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    ringColor: 'ring-blue-500',
  },
  votante: {
    primaryColor: '#7c3aed', // Violet 600
    secondaryColor: '#db2777', // Pink 600
    accentColor: '#10b981', // Emerald 500
    backgroundColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    borderColor: 'border-violet-300',
    headerGradient: 'bg-white',
    buttonClass: 'bg-violet-600 hover:bg-violet-700 text-white',
    ringColor: 'ring-violet-500',
  },
  visitante: {
    primaryColor: '#475569', // Slate 600
    secondaryColor: '#64748b', // Slate 500
    accentColor: '#94a3b8', // Slate 400
    backgroundColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    headerGradient: 'bg-gray-200',
    buttonClass: 'bg-slate-500 hover:bg-slate-600 text-white',
    ringColor: 'ring-slate-500',
  },
};

export const getTheme = (role?: string): RoleTheme => {
  const userRole = role || 'visitante';
  return roleThemes[userRole] || roleThemes['visitante'];
}; 