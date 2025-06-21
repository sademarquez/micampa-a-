
-- Crear función RPC para obtener email por user_id
CREATE OR REPLACE FUNCTION public.get_user_email(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT email FROM auth.users WHERE id = user_id;
$$;

-- Verificar que los usuarios demo tengan perfiles correctos
DO $$
BEGIN
  -- Insertar perfil para desarrollador si no existe
  INSERT INTO public.profiles (id, name, role, created_at)
  SELECT 
    u.id,
    'Desarrollador',
    'desarrollador'::user_role,
    NOW()
  FROM auth.users u
  WHERE u.email = 'dev@micampana.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

  -- Insertar perfiles para otros usuarios demo
  INSERT INTO public.profiles (id, name, role, created_at)
  SELECT 
    u.id,
    CASE 
      WHEN u.email = 'master1@demo.com' THEN 'Master'
      WHEN u.email = 'candidato@demo.com' THEN 'Candidato'
      WHEN u.email = 'lider@demo.com' THEN 'Lider'
      WHEN u.email = 'votante@demo.com' THEN 'Votante'
    END,
    CASE 
      WHEN u.email = 'master1@demo.com' THEN 'master'::user_role
      WHEN u.email = 'candidato@demo.com' THEN 'candidato'::user_role
      WHEN u.email = 'lider@demo.com' THEN 'lider'::user_role
      WHEN u.email = 'votante@demo.com' THEN 'votante'::user_role
    END,
    NOW()
  FROM auth.users u
  WHERE u.email IN ('master1@demo.com', 'candidato@demo.com', 'lider@demo.com', 'votante@demo.com')
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );
END $$;
