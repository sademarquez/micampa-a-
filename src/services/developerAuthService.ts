import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export interface DeveloperUser {
  id: string;
  email: string;
  name: string;
  role: 'developer' | 'admin' | 'master' | 'candidato' | 'lider';
  created_at: string;
  last_login?: string;
}

export interface MasterDatabase {
  id: string;
  master_id: string;
  campaign_name: string;
  google_account: string;
  api_key_primary: string;
  database_url: string;
  database_type: 'supabase' | 'postgresql' | 'mysql' | 'mongodb';
  connection_status: 'connected' | 'disconnected' | 'error';
  last_sync: string;
  compressed_data: any;
  created_at: string;
  updated_at: string;
}

class DeveloperAuthService {
  private static instance: DeveloperAuthService;
  private currentUser: DeveloperUser | null = null;

  private constructor() {}

  static getInstance(): DeveloperAuthService {
    if (!DeveloperAuthService.instance) {
      DeveloperAuthService.instance = new DeveloperAuthService();
    }
    return DeveloperAuthService.instance;
  }

  // Crear usuario desarrollador automáticamente
  async createDeveloperUser(email: string, password: string, name: string): Promise<DeveloperUser> {
    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'developer'
          }
        }
      });

      if (authError) throw authError;

      // Crear perfil en la tabla profiles
      const profileData: ProfileInsert = {
        id: authData.user!.id,
        name,
        role: 'developer',
        created_by: null
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) throw profileError;

      // Log del evento
      await this.logSystemEvent('user_created', 'developer', `Usuario desarrollador creado: ${email}`);

      return {
        id: profile.id,
        email,
        name: profile.name || name,
        role: profile.role || 'developer',
        created_at: profile.created_at
      };

    } catch (error) {
      console.error('Error creating developer user:', error);
      throw error;
    }
  }

  // Login automático del desarrollador
  async loginDeveloper(email: string, password: string): Promise<DeveloperUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Obtener perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      this.currentUser = {
        id: profile.id,
        email: data.user.email!,
        name: profile.name || 'Desarrollador',
        role: profile.role || 'developer',
        created_at: profile.created_at,
        last_login: new Date().toISOString()
      };

      // Log del login
      await this.logSystemEvent('user_login', 'developer', `Login exitoso: ${email}`);

      return this.currentUser;

    } catch (error) {
      console.error('Error logging in developer:', error);
      throw error;
    }
  }

  // Verificar si el usuario desarrollador existe
  async checkDeveloperExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', email)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): DeveloperUser | null {
    return this.currentUser;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
      await this.logSystemEvent('user_logout', 'developer', 'Logout del desarrollador');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Log de eventos del sistema
  async logSystemEvent(
    action: string, 
    category: string, 
    message: string, 
    details?: any
  ): Promise<void> {
    try {
      await supabase.rpc('log_system_event', {
        p_level: 'info',
        p_category: category,
        p_message: message,
        p_details: details || null,
        p_user_id: this.currentUser?.id || null
      });
    } catch (error) {
      console.error('Error logging system event:', error);
    }
  }

  // Registrar base de datos de un master
  async registerMasterDatabase(masterData: Omit<MasterDatabase, 'id' | 'last_sync' | 'created_at' | 'updated_at'>): Promise<MasterDatabase> {
    try {
      // Si no se proporciona API key, usar la genérica de Google
      const apiKeyToUse = masterData.api_key_primary || process.env.REACT_APP_GOOGLE_GEMINI_API_KEY || 'default_google_key';
      
      const { data, error } = await supabase
        .from('master_databases')
        .insert({
          ...masterData,
          api_key_primary: apiKeyToUse,
          last_sync: new Date().toISOString(),
          compressed_data: {}
        })
        .select()
        .single();

      if (error) throw error;

      await this.logSystemEvent(
        'master_db_registered', 
        'database', 
        `Base de datos registrada: ${masterData.campaign_name}`
      );

      return data;
    } catch (error) {
      console.error('Error registering master database:', error);
      throw error;
    }
  }

  // Obtener todas las bases de datos de masters
  async getMasterDatabases(): Promise<MasterDatabase[]> {
    try {
      const { data, error } = await supabase
        .from('master_databases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting master databases:', error);
      return [];
    }
  }

  // Actualizar datos comprimidos de una base de datos master
  async updateCompressedData(
    masterId: string, 
    compressedData: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('master_databases')
        .update({
          compressed_data: compressedData,
          last_sync: new Date().toISOString()
        })
        .eq('master_id', masterId);

      if (error) throw error;

      await this.logSystemEvent(
        'data_compressed', 
        'database', 
        `Datos comprimidos actualizados para master: ${masterId}`
      );
    } catch (error) {
      console.error('Error updating compressed data:', error);
      throw error;
    }
  }

  // Obtener API key para un master específico
  async getMasterApiKey(masterId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('master_databases')
        .select('api_key_primary')
        .eq('master_id', masterId)
        .single();

      if (error) throw error;
      
      return data.api_key_primary || process.env.REACT_APP_GOOGLE_GEMINI_API_KEY || '';
    } catch (error) {
      console.error('Error getting master API key:', error);
      return process.env.REACT_APP_GOOGLE_GEMINI_API_KEY || '';
    }
  }

  // Actualizar API key para un master específico
  async updateMasterApiKey(masterId: string, apiKey: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('master_databases')
        .update({ api_key_primary: apiKey, updated_at: new Date().toISOString() })
        .eq('master_id', masterId);

      if (error) {
        // Si no existe una fila para el master, se puede crear una nueva
        if (error.code === 'PGRST204') {
          const { error: insertError } = await supabase
            .from('master_databases')
            .insert({
              master_id: masterId,
              api_key_primary: apiKey,
              // Aquí puedes añadir valores por defecto para otros campos si es necesario
              campaign_name: `Campaña de ${masterId}`, 
              database_url: '',
              google_account: ''
            });
          
          if (insertError) throw insertError;
        } else {
          throw error;
        }
      }
      
      await this.logSystemEvent(
        'master_api_key_updated',
        'security',
        `API key actualizada para master: ${masterId}`
      );
    } catch (error) {
      console.error('Error updating master API key:', error);
      throw error;
    }
  }

  // Inicializar automáticamente el usuario desarrollador
  async initializeDeveloperUser(): Promise<DeveloperUser> {
    const email = 'daniel@dev.com';
    const password = 'mariana';
    const name = 'Daniel Developer';

    try {
      // Verificar si el usuario ya existe
      const exists = await this.checkDeveloperExists(email);
      
      if (!exists) {
        // Crear usuario si no existe
        return await this.createDeveloperUser(email, password, name);
      } else {
        // Hacer login si ya existe
        return await this.loginDeveloper(email, password);
      }
    } catch (error) {
      console.error('Error initializing developer user:', error);
      throw error;
    }
  }

  // Crear un nuevo usuario con el rol de master
  async createMasterUser(email: string, password: string): Promise<{ id: string }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'master',
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario master en Supabase Auth.");

      // Crear el perfil correspondiente en la tabla 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: email.split('@')[0], // Un nombre por defecto
          role: 'master',
          email: email,
        });

      if (profileError) {
        // Si falla la creación del perfil, se debería borrar el usuario de auth para consistencia.
        // Esta es una operación de admin, requiere cuidado.
        console.error("Error creando el perfil, el usuario de auth podría quedar huérfano:", profileError);
        throw profileError;
      }

      await this.logSystemEvent(
        'master_user_created',
        'user_management',
        `Nuevo usuario master creado: ${email}`
      );
      
      return { id: authData.user.id };
    } catch (error) {
      console.error('Error creating master user:', error);
      throw error;
    }
  }

  // Crear un nuevo usuario con el rol de candidato, por un Master
  async createCandidateUser(email: string, password: string, name: string, createdByMasterId: string): Promise<{ id: string }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'candidato',
            name: name,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario candidato en Supabase Auth.");

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: name,
          role: 'candidato',
          email: email,
          created_by: createdByMasterId
        });
      
      if (profileError) throw profileError;

      await this.logSystemEvent(
        'candidate_user_created',
        'user_management',
        `Nuevo candidato creado por ${createdByMasterId}: ${email}`
      );
      
      return { id: authData.user.id };
    } catch (error) {
      console.error('Error creating candidate user:', error);
      throw error;
    }
  }

  // Crear un nuevo usuario con el rol de lider, por un Candidato
  async createLeaderUser(email: string, password: string, name: string, createdByCandidateId: string): Promise<{ id: string }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'lider',
            name: name,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario líder en Supabase Auth.");

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: name,
          role: 'lider',
          email: email,
          created_by: createdByCandidateId
        });
      
      if (profileError) throw profileError;

      await this.logSystemEvent(
        'leader_user_created',
        'user_management',
        `Nuevo líder creado por ${createdByCandidateId}: ${email}`
      );
      
      return { id: authData.user.id };
    } catch (error) {
      console.error('Error creating leader user:', error);
      throw error;
    }
  }
}

export const developerAuthService = DeveloperAuthService.getInstance(); 