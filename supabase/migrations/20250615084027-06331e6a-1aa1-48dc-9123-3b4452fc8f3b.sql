
-- Crear el enum de roles
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('desarrollador', 'master', 'candidato', 'lider', 'votante');

-- Agregar la columna role si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'votante'::public.user_role;
    ELSE
        ALTER TABLE public.profiles ALTER COLUMN role TYPE public.user_role USING role::text::public.user_role;
    END IF;
END $$;

-- Crear tabla de jerarquías
CREATE TABLE IF NOT EXISTS public.user_hierarchies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  superior_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subordinate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(superior_id, subordinate_id)
);

-- Habilitar RLS
ALTER TABLE public.user_hierarchies ENABLE ROW LEVEL SECURITY;

-- Crear función de seguridad para verificar roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

-- Política para ver jerarquías
CREATE POLICY "Users can view their hierarchies"
  ON public.user_hierarchies
  FOR SELECT
  USING (
    auth.uid() = superior_id OR 
    auth.uid() = subordinate_id OR
    public.get_current_user_role() IN ('desarrollador', 'master')
  );

-- Política para gestionar jerarquías
CREATE POLICY "Developers and masters can manage hierarchies"
  ON public.user_hierarchies
  FOR ALL
  USING (public.get_current_user_role() IN ('desarrollador', 'master'))
  WITH CHECK (public.get_current_user_role() IN ('desarrollador', 'master'));

-- Función corregida para obtener subordinados
CREATE OR REPLACE FUNCTION public.get_user_subordinates(user_id UUID)
RETURNS TABLE(subordinate_id UUID, subordinate_name TEXT, subordinate_role TEXT) 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
AS $$
  WITH RECURSIVE hierarchy AS (
    -- Caso base: subordinados directos
    SELECT h.subordinate_id, p.name, p.role::text, 1 as level
    FROM public.user_hierarchies h
    JOIN public.profiles p ON h.subordinate_id = p.id
    WHERE h.superior_id = user_id
    
    UNION ALL
    
    -- Caso recursivo: subordinados de subordinados
    SELECT h.subordinate_id, p.name, p.role::text, hier.level + 1
    FROM public.user_hierarchies h
    JOIN public.profiles p ON h.subordinate_id = p.id
    JOIN hierarchy hier ON h.superior_id = hier.subordinate_id
    WHERE hier.level < 10  -- Prevenir recursión infinita
  )
  SELECT hierarchy.subordinate_id, hierarchy.name as subordinate_name, hierarchy.role as subordinate_role
  FROM hierarchy;
$$;

-- Función para verificar si un usuario puede gestionar otro
CREATE OR REPLACE FUNCTION public.can_manage_user(manager_id UUID, target_id UUID)
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = manager_id 
    AND role::text IN ('desarrollador', 'master')
  ) OR EXISTS (
    SELECT 1 FROM public.get_user_subordinates(manager_id) 
    WHERE subordinate_id = target_id
  );
$$;

-- Actualizar usuarios existentes con rol por defecto
UPDATE public.profiles SET role = 'votante'::public.user_role WHERE role IS NULL;
