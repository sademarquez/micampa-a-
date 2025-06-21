
-- Actualizar el enum de roles para incluir 'lider'
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'lider';

-- Crear un usuario líder de prueba con credenciales seguras
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
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'lider@micampana.com',
  crypt('LiderSecure2025!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Líder Territorial"}',
  false,
  'authenticated',
  'authenticated'
);

-- Actualizar políticas RLS para permitir acceso por jerarquía
CREATE POLICY "Users can view profiles in their hierarchy" ON public.profiles
  FOR SELECT 
  USING (
    auth.uid() = id OR 
    public.can_manage_user(auth.uid(), id) OR
    public.get_current_user_role() IN ('desarrollador', 'master')
  );

CREATE POLICY "Users can create subordinate profiles" ON public.profiles
  FOR INSERT 
  WITH CHECK (
    public.get_current_user_role() IN ('desarrollador', 'master', 'candidato', 'lider')
  );

-- Política para actualizar perfiles
CREATE POLICY "Users can update manageable profiles" ON public.profiles
  FOR UPDATE 
  USING (
    auth.uid() = id OR 
    public.can_manage_user(auth.uid(), id)
  )
  WITH CHECK (
    auth.uid() = id OR 
    public.can_manage_user(auth.uid(), id)
  );

-- Log de sistema para debugging
INSERT INTO public.system_logs (level, category, message, details) 
VALUES ('info', 'system', 'Roles y permisos actualizados', 
  jsonb_build_object('roles_available', ARRAY['desarrollador', 'master', 'candidato', 'lider', 'votante']));
