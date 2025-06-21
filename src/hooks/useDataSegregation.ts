import { useSecureAuth } from "../contexts/SecureAuthContext";

export const useDataSegregation = () => {
  const { user } = useSecureAuth();

  // Función para obtener territorios según el rol del usuario
  const getTerritoryFilter = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'desarrollador':
      case 'master':
        // Desarrollador y Master ven todos los territorios
        return {};
      case 'candidato':
        // Candidato solo ve territorios donde es responsable o los creó
        return {
          or: `responsible_user_id.eq.${user.id},created_by.eq.${user.id}`
        };
      case 'lider':
        // Líder ve territorios que maneja directamente
        return {
          responsible_user_id: user.id
        };
      case 'votante':
        // Votante solo ve información básica de su territorio
        return {
          responsible_user_id: user.id
        };
      default:
        return { id: 'null' }; // No acceso
    }
  };

  // Función para obtener filtro de votantes
  const getVoterFilter = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'desarrollador':
      case 'master':
        return {}; // Ve todos
      case 'candidato':
        // Solo votantes en territorios que maneja
        return {
          'territories.responsible_user_id': user.id
        };
      case 'lider':
        // Votantes en su territorio específico
        return {
          'territories.responsible_user_id': user.id
        };
      case 'votante':
        // Solo votantes que él registró
        return {
          registered_by: user.id
        };
      default:
        return { id: 'null' };
    }
  };

  // Función para obtener filtro de alertas
  const getAlertFilter = () => {
    if (!user) return null;
    
    // Todos pueden ver alertas según las nuevas políticas
    return {};
  };

  // Filtro para mesas de votación
  const getVotingTablesFilter = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'desarrollador':
      case 'master':
        return {}; // Ve todas
      case 'candidato':
        return {
          or: `responsible_leader_id.in.(${user.id}),created_by.eq.${user.id}`
        };
      case 'lider':
        return {
          responsible_leader_id: user.id
        };
      case 'votante':
        // Los votantes solo ven cuando reciben avisos específicos
        return {
          visible_to_voters: true,
          'territory_id.in': `(select territory_id from voters where registered_by = '${user.id}')`
        };
      default:
        return { id: 'null' };
    }
  };

  // Permisos actualizados según la nueva jerarquía
  const getPermissions = () => {
    if (!user) return {
      canCreateTerritory: false,
      canManageUsers: false,
      canViewAllData: false,
      canCreateDesarrollador: false,
      canCreateMaster: false,
      canCreateCandidatos: false,
      canCreateLideres: false,
      canCreateVotantes: false,
      canCreateAlerts: false,
      canManageVotingTables: false,
      canManageN8N: false,
      canViewVotingTables: false
    };

    switch (user.role) {
      case 'desarrollador':
        return {
          canCreateTerritory: true,
          canManageUsers: true,
          canViewAllData: true,
          canCreateDesarrollador: true,
          canCreateMaster: true,
          canCreateCandidatos: true,
          canCreateLideres: true,
          canCreateVotantes: true,
          canCreateAlerts: true,
          canManageVotingTables: true,
          canManageN8N: true,
          canViewVotingTables: true
        };
      case 'master':
        return {
          canCreateTerritory: true,
          canManageUsers: true,
          canViewAllData: true,
          canCreateDesarrollador: false,
          canCreateMaster: false,
          canCreateCandidatos: true,
          canCreateLideres: true,
          canCreateVotantes: true,
          canCreateAlerts: true,
          canManageVotingTables: true,
          canManageN8N: false,
          canViewVotingTables: true
        };
      case 'candidato':
        return {
          canCreateTerritory: true,
          canManageUsers: true,
          canViewAllData: false,
          canCreateDesarrollador: false,
          canCreateMaster: false,
          canCreateCandidatos: false,
          canCreateLideres: true,
          canCreateVotantes: true,
          canCreateAlerts: true,
          canManageVotingTables: true,
          canManageN8N: false,
          canViewVotingTables: true
        };
      case 'lider':
        return {
          canCreateTerritory: false,
          canManageUsers: true,
          canViewAllData: false,
          canCreateDesarrollador: false,
          canCreateMaster: false,
          canCreateCandidatos: false,
          canCreateLideres: true,
          canCreateVotantes: true,
          canCreateAlerts: true,
          canManageVotingTables: true,
          canManageN8N: false,
          canViewVotingTables: true
        };
      case 'votante':
        return {
          canCreateTerritory: false,
          canManageUsers: false,
          canViewAllData: false,
          canCreateDesarrollador: false,
          canCreateMaster: false,
          canCreateCandidatos: false,
          canCreateLideres: false,
          canCreateVotantes: false,
          canCreateAlerts: false,
          canManageVotingTables: false,
          canManageN8N: false,
          canViewVotingTables: true
        };
      default:
        return {
          canCreateTerritory: false,
          canManageUsers: false,
          canViewAllData: false,
          canCreateDesarrollador: false,
          canCreateMaster: false,
          canCreateCandidatos: false,
          canCreateLideres: false,
          canCreateVotantes: false,
          canCreateAlerts: false,
          canManageVotingTables: false,
          canManageN8N: false,
          canViewVotingTables: false
        };
    }
  };

  return {
    getTerritoryFilter,
    getVoterFilter,
    getAlertFilter,
    getVotingTablesFilter,
    getPermissions,
    ...getPermissions()
  };
};
