
-- Crear tabla para mesas de votación
CREATE TABLE IF NOT EXISTS public.voting_tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number TEXT NOT NULL,
  voting_place TEXT NOT NULL,
  address TEXT,
  coordinates JSONB,
  territory_id UUID REFERENCES public.territories(id),
  responsible_leader_id UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Habilitar RLS en mesas de votación
ALTER TABLE public.voting_tables ENABLE ROW LEVEL SECURITY;

-- Políticas para mesas de votación
CREATE POLICY "Leaders can view their voting tables"
  ON public.voting_tables
  FOR SELECT
  USING (
    responsible_leader_id = auth.uid() OR
    public.get_current_user_role() IN ('desarrollador', 'master', 'candidato')
  );

CREATE POLICY "Leaders and above can manage voting tables"
  ON public.voting_tables
  FOR ALL
  USING (
    public.get_current_user_role() IN ('desarrollador', 'master', 'candidato', 'lider')
  )
  WITH CHECK (
    public.get_current_user_role() IN ('desarrollador', 'master', 'candidato', 'lider')
  );

-- Actualizar tabla de alertas para incluir campo de visibilidad
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS visible_to_voters BOOLEAN DEFAULT false;

-- Actualizar políticas de alertas para permitir ver a todos pero crear solo a roles específicos
DROP POLICY IF EXISTS "Users can view alerts" ON public.alerts;
DROP POLICY IF EXISTS "Users can create alerts" ON public.alerts;

CREATE POLICY "Everyone can view alerts"
  ON public.alerts
  FOR SELECT
  USING (true);

CREATE POLICY "Leaders and above can create alerts"
  ON public.alerts
  FOR INSERT
  WITH CHECK (
    public.get_current_user_role() IN ('desarrollador', 'master', 'candidato', 'lider')
  );

CREATE POLICY "Leaders and above can update alerts"
  ON public.alerts
  FOR UPDATE
  USING (
    created_by = auth.uid() OR
    public.get_current_user_role() IN ('desarrollador', 'master', 'candidato')
  );

-- Agregar tabla para control de N8N workflows
CREATE TABLE IF NOT EXISTS public.n8n_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_name TEXT NOT NULL,
  workflow_id TEXT NOT NULL,
  webhook_url TEXT,
  trigger_role TEXT[] DEFAULT ARRAY['desarrollador'],
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  active BOOLEAN DEFAULT true
);

-- RLS para workflows N8N
ALTER TABLE public.n8n_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developers can manage N8N workflows"
  ON public.n8n_workflows
  FOR ALL
  USING (public.get_current_user_role() = 'desarrollador')
  WITH CHECK (public.get_current_user_role() = 'desarrollador');

CREATE POLICY "Users can view allowed workflows"
  ON public.n8n_workflows
  FOR SELECT
  USING (
    public.get_current_user_role() = ANY(trigger_role) OR
    public.get_current_user_role() = 'desarrollador'
  );
