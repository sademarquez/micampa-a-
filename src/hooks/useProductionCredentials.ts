
export interface ProductionCredential {
  name: string;
  email: string;
  password: string;
  role: string;
  description: string;
  territory?: string;
  verified: boolean;
}

export const useProductionCredentials = () => {
  const productionCredentials: ProductionCredential[] = [
    {
      name: 'Administrador',
      email: 'admin@campana.com',
      password: 'CampAdmin2025!',
      role: 'desarrollador',
      description: 'Control total del sistema electoral y configuración',
      territory: 'Nacional',
      verified: true
    },
    {
      name: 'Director de Campaña',
      email: 'director@campana.com', 
      password: 'Director2025!',
      role: 'master',
      description: 'Gestión completa de campaña y estrategia electoral',
      territory: 'Regional',
      verified: true
    },
    {
      name: 'Coordinador Territorial',
      email: 'coordinador@campana.com',
      password: 'Coord2025!',
      role: 'candidato', 
      description: 'Gestión territorial especializada y coordinación',
      territory: 'Departamental',
      verified: true
    },
    {
      name: 'Líder Zonal',
      email: 'lider@campana.com',
      password: 'Lider2025!',
      role: 'lider',
      description: 'Coordinación zonal y gestión de equipos locales',
      territory: 'Municipal',
      verified: true
    },
    {
      name: 'Operador Electoral',
      email: 'operador@campana.com',
      password: 'Opera2025!',
      role: 'votante',
      description: 'Operación electoral y gestión de base de datos',
      territory: 'Local',
      verified: true
    }
  ];

  const nameToEmailMap: Record<string, string> = {
    'Administrador': 'admin@campana.com',
    'administrador': 'admin@campana.com',
    'ADMINISTRADOR': 'admin@campana.com',
    'admin': 'admin@campana.com',
    'Admin': 'admin@campana.com',
    'ADMIN': 'admin@campana.com',
    'Director': 'director@campana.com',
    'director': 'director@campana.com',
    'DIRECTOR': 'director@campana.com',
    'Coordinador': 'coordinador@campana.com',
    'coordinador': 'coordinador@campana.com',
    'COORDINADOR': 'coordinador@campana.com',
    'Líder': 'lider@campana.com',
    'líder': 'lider@campana.com',
    'Lider': 'lider@campana.com',
    'lider': 'lider@campana.com',
    'LÍDER': 'lider@campana.com',
    'LIDER': 'lider@campana.com',
    'Operador': 'operador@campana.com',
    'operador': 'operador@campana.com',
    'OPERADOR': 'operador@campana.com'
  };

  const getEmailFromName = (name: string): string | null => {
    const cleanName = name.trim();
    const email = nameToEmailMap[cleanName];
    
    console.log(`🔍 Buscando email para "${cleanName}":`, email || 'NO ENCONTRADO');
    
    return email || null;
  };

  const getCredentialByName = (name: string): ProductionCredential | null => {
    const email = getEmailFromName(name);
    if (!email) return null;
    
    return productionCredentials.find(cred => cred.email === email) || null;
  };

  const getCredentialByEmail = (email: string): ProductionCredential | null => {
    return productionCredentials.find(cred => cred.email === email) || null;
  };

  const getAllCredentials = (): ProductionCredential[] => {
    return productionCredentials;
  };

  const validateCredential = (email: string, password: string): boolean => {
    const credential = getCredentialByEmail(email);
    const isValid = credential ? credential.password === password && credential.verified : false;
    
    console.log(`🔐 Validando credencial:`, {
      email,
      found: !!credential,
      verified: credential?.verified || false,
      passwordMatch: credential ? credential.password === password : false,
      isValid
    });
    
    return isValid;
  };

  return {
    productionCredentials,
    nameToEmailMap,
    getEmailFromName,
    getCredentialByName,
    getCredentialByEmail,
    getAllCredentials,
    validateCredential
  };
};
