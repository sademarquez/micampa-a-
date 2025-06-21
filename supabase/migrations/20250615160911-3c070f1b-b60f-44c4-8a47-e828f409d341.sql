
-- Limpiar datos de prueba existentes y crear estructura sólida
TRUNCATE TABLE public.profiles CASCADE;

-- Crear usuarios reales con credenciales seguras
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  phone_change_token,
  recovery_token,
  email_change_token_current
) VALUES 
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@micampana.com',
    crypt('AdminSecure2025!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Administrador Principal"}',
    false,
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    ''
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'master@micampana.com',
    crypt('MasterSecure2025!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Master Campaign"}',
    false,
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    ''
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'candidato@micampana.com',
    crypt('CandidatoSecure2025!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Candidato Principal"}',
    false,
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    ''
  );

-- Crear tabla de bitácora de sistema
CREATE TABLE IF NOT EXISTS public.system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  level text NOT NULL CHECK (level IN ('info', 'warning', 'error', 'critical')),
  category text NOT NULL,
  message text NOT NULL,
  details jsonb,
  user_id uuid REFERENCES auth.users(id),
  session_id text,
  ip_address inet,
  user_agent text,
  stack_trace text,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id)
);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON public.system_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON public.system_logs(category);

-- Crear tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS public.system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insertar configuraciones iniciales
INSERT INTO public.system_config (key, value, description, category, is_public) VALUES
  ('app_version', '"1.0.0"', 'Versión actual de la aplicación', 'system', true),
  ('maintenance_mode', 'false', 'Modo de mantenimiento activado', 'system', true),
  ('max_login_attempts', '5', 'Máximo número de intentos de login', 'security', false),
  ('session_timeout', '3600', 'Tiempo de expiración de sesión en segundos', 'security', false),
  ('enable_diagnostics', 'true', 'Habilitar diagnósticos automáticos', 'debug', false);

-- Función para logging automático
CREATE OR REPLACE FUNCTION public.log_system_event(
  p_level text,
  p_category text,
  p_message text,
  p_details jsonb DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.system_logs (level, category, message, details, user_id)
  VALUES (p_level, p_category, p_message, p_details, COALESCE(p_user_id, auth.uid()))
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Trigger para logging automático de cambios críticos
CREATE OR REPLACE FUNCTION public.audit_critical_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log cambios en perfiles de usuario
  IF TG_TABLE_NAME = 'profiles' THEN
    PERFORM public.log_system_event(
      'info',
      'user_management',
      'Profile modified: ' || COALESCE(NEW.name, OLD.name),
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'old_data', to_jsonb(OLD),
        'new_data', to_jsonb(NEW)
      ),
      COALESCE(NEW.id, OLD.id)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar trigger a tablas críticas
DROP TRIGGER IF EXISTS audit_profiles_changes ON public.profiles;
CREATE TRIGGER audit_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_critical_changes();

-- Habilitar RLS en nuevas tablas
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para system_logs
CREATE POLICY "Users can view their own logs" ON public.system_logs
  FOR SELECT USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert logs" ON public.system_logs
  FOR INSERT WITH CHECK (true);

-- Políticas RLS para system_config
CREATE POLICY "Public configs visible to all" ON public.system_config
  FOR SELECT USING (is_public = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can modify config" ON public.system_config
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
