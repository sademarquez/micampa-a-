
import credentialsData from '@/config/credentials.json';

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
  author: string;
  copyright: string;
  description: string;
}

export const useLocalCredentials = () => {
  const credentials: LocalCredential[] = credentialsData.credentials;
  const systemInfo: SystemInfo = credentialsData.systemInfo;
  const masterPassword: string = credentialsData.developerAccess.masterPassword;

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
