import credentialsData from '@/config/localCredentials.json';

export interface LocalCredential {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'desarrollador' | 'master' | 'candidato' | 'lider' | 'votante';
  permissions: string[];
  territory: string;
  description: string;
  active: boolean;
  created: string;
  isDemoUser: boolean;
}

export interface SystemInfo {
  name: string;
  version: string;
  description: string;
  copyright: string;
  environment: string;
  database: string;
}

export interface DeveloperAccess {
  enabled: boolean;
  features: string[];
  apiKeys: Record<string, string>;
}

export const useLocalCredentials = () => {
  const credentials: LocalCredential[] = credentialsData.credentials as LocalCredential[];
  const systemInfo: SystemInfo = credentialsData.system as SystemInfo;
  const developerAccess: DeveloperAccess = {
    enabled: true,
    features: ['gemini', 'n8n', 'analytics', 'mobile_audit'],
    apiKeys: {
      gemini: 'demo_key_123456',
      n8n: 'demo_webhook_123456'
    }
  };
  const masterPassword: string = 'admin123'; // Contraseña maestra fija para desarrollo

  const validateMasterPassword = (password: string): boolean => {
    return password === masterPassword;
  };

  const validateCredential = (username: string, password: string): LocalCredential | null => {
    const credential = credentials.find(cred => 
      (cred.username === username || cred.email === username) && 
      cred.password === password && 
      cred.active
    );
    
    console.log('🔐 Validando credencial local:', {
      username,
      found: !!credential,
      role: credential?.role
    });
    
    return credential || null;
  };

  const getCredentialByUsername = (username: string): LocalCredential | null => {
    return credentials.find(cred => 
      (cred.username === username || cred.email === username) && cred.active
    ) || null;
  };

  const getCredentialsByRole = (role: string): LocalCredential[] => {
    return credentials.filter(cred => cred.role === role && cred.active);
  };

  const getAllActiveCredentials = (): LocalCredential[] => {
    return credentials.filter(cred => cred.active);
  };

  const getUserPermissions = (credential: LocalCredential): string[] => {
    return credential.permissions;
  };

  const hasPermission = (credential: LocalCredential, permission: string): boolean => {
    return credential.permissions.includes(permission) || credential.permissions.includes('all');
  };

  return {
    credentials,
    systemInfo,
    developerAccess,
    masterPassword,
    validateMasterPassword,
    validateCredential,
    getCredentialByUsername,
    getCredentialsByRole,
    getAllActiveCredentials,
    getUserPermissions,
    hasPermission
  };
};
