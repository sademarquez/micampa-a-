
-- Crear trigger para crear perfiles automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'votante'::public.user_role,
    NOW()
  );
  RETURN new;
END;
$$;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Crear políticas RLS para profiles
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
CREATE POLICY "Users can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true); -- Permitir a todos ver perfiles básicos

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas para alerts
DROP POLICY IF EXISTS "Users can view alerts" ON public.alerts;
CREATE POLICY "Users can view alerts"
  ON public.alerts
  FOR SELECT
  USING (true); -- Por ahora permitir ver todas las alertas

DROP POLICY IF EXISTS "Users can create alerts" ON public.alerts;
CREATE POLICY "Users can create alerts"
  ON public.alerts
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Habilitar RLS en alerts
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Crear políticas para territories
DROP POLICY IF EXISTS "Users can view territories" ON public.territories;
CREATE POLICY "Users can view territories"
  ON public.territories
  FOR SELECT
  USING (true); -- Por ahora permitir ver todos los territorios

DROP POLICY IF EXISTS "Users can create territories" ON public.territories;
CREATE POLICY "Users can create territories"
  ON public.territories
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Habilitar RLS en territories
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;

-- Insertar algunos territorios de ejemplo
INSERT INTO public.territories (name, type, population_estimate, voter_estimate, created_by)
VALUES 
  ('Bogotá D.C.', 'departamento', 8000000, 6000000, NULL),
  ('Localidad de Chapinero', 'municipio', 140000, 100000, NULL),
  ('Zona Rosa', 'barrio', 15000, 12000, NULL),
  ('Medellín', 'municipio', 2500000, 1800000, NULL),
  ('El Poblado', 'barrio', 130000, 95000, NULL)
ON CONFLICT DO NOTHING;
