
-- 1. Crear tipos ENUM para categorización
CREATE TYPE public.territory_type AS ENUM ('departamento', 'municipio', 'corregimiento', 'vereda', 'barrio', 'sector');
CREATE TYPE public.message_status AS ENUM ('draft', 'sent', 'delivered', 'read', 'replied');
CREATE TYPE public.message_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.message_category AS ENUM ('general', 'coordination', 'event', 'emergency', 'campaign');
CREATE TYPE public.event_status AS ENUM ('planned', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.alert_type AS ENUM ('security', 'logistics', 'political', 'emergency', 'information');
CREATE TYPE public.alert_status AS ENUM ('active', 'resolved', 'dismissed');
CREATE TYPE public.report_type AS ENUM ('daily', 'weekly', 'event', 'incident', 'progress');

-- 2. Tabla de estructura territorial
CREATE TABLE public.territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type territory_type NOT NULL,
  parent_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  coordinates JSONB, -- Para almacenar lat/lng de polígonos
  population_estimate INTEGER,
  voter_estimate INTEGER,
  responsible_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 3. Sistema de mensajería avanzado
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status message_status DEFAULT 'draft' NOT NULL,
  priority message_priority DEFAULT 'medium' NOT NULL,
  category message_category DEFAULT 'general' NOT NULL,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Destinatarios de mensajes (para mensajes grupales)
CREATE TABLE public.message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Gestión de eventos de campaña
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  status event_status DEFAULT 'planned' NOT NULL,
  expected_attendees INTEGER,
  actual_attendees INTEGER,
  budget_allocated DECIMAL(10,2),
  budget_spent DECIMAL(10,2),
  responsible_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 6. Sistema de alertas y notificaciones
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type alert_type NOT NULL,
  status alert_status DEFAULT 'active' NOT NULL,
  priority message_priority DEFAULT 'medium' NOT NULL,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  affected_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Base de datos de votantes y simpatizantes
CREATE TABLE public.voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  voting_place TEXT,
  voting_table TEXT,
  commitment_level INTEGER CHECK (commitment_level BETWEEN 1 AND 5),
  notes TEXT,
  last_contact TIMESTAMPTZ,
  registered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Reportes y seguimiento
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type report_type NOT NULL,
  content JSONB NOT NULL, -- Contenido flexible del reporte
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Recursos y logística
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'vehicle', 'equipment', 'material', 'space'
  description TEXT,
  quantity INTEGER DEFAULT 1,
  available_quantity INTEGER DEFAULT 1,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  responsible_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 10. Reservas de recursos
CREATE TABLE public.resource_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  booked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  quantity INTEGER DEFAULT 1,
  purpose TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. Tareas y seguimiento automático
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  territory_id UUID REFERENCES public.territories(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  priority message_priority DEFAULT 'medium' NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  completion_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. Registro de actividades (log de auditoría)
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'message', 'event', 'voter', etc.
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ÍNDICES para optimización
CREATE INDEX idx_territories_parent ON public.territories(parent_id);
CREATE INDEX idx_territories_responsible ON public.territories(responsible_user_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_status ON public.messages(status);
CREATE INDEX idx_messages_priority ON public.messages(priority);
CREATE INDEX idx_message_recipients_message ON public.message_recipients(message_id);
CREATE INDEX idx_message_recipients_recipient ON public.message_recipients(recipient_id);
CREATE INDEX idx_events_territory ON public.events(territory_id);
CREATE INDEX idx_events_responsible ON public.events(responsible_user_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_alerts_territory ON public.alerts(territory_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_voters_territory ON public.voters(territory_id);
CREATE INDEX idx_voters_cedula ON public.voters(cedula);
CREATE INDEX idx_reports_territory ON public.reports(territory_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);

-- TRIGGERS para updated_at automático
CREATE TRIGGER update_territories_updated_at
  BEFORE UPDATE ON public.territories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voters_updated_at
  BEFORE UPDATE ON public.voters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_bookings_updated_at
  BEFORE UPDATE ON public.resource_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para todos los usuarios autenticados
CREATE POLICY "Authenticated users can view territories" ON public.territories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view messages" ON public.messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view message recipients" ON public.message_recipients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view alerts" ON public.alerts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view voters" ON public.voters FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view reports" ON public.reports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view resources" ON public.resources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view resource bookings" ON public.resource_bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view tasks" ON public.tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view activity log" ON public.activity_log FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas de inserción para usuarios autenticados
CREATE POLICY "Authenticated users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Authenticated users can insert message recipients" ON public.message_recipients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can insert voters" ON public.voters FOR INSERT WITH CHECK (auth.uid() = registered_by);
CREATE POLICY "Authenticated users can insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can insert resources" ON public.resources FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can insert resource bookings" ON public.resource_bookings FOR INSERT WITH CHECK (auth.uid() = booked_by);
CREATE POLICY "Authenticated users can insert tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = assigned_by);
CREATE POLICY "Authenticated users can insert territories" ON public.territories FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Políticas de actualización para usuarios autenticados
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);
CREATE POLICY "Users can update events they created" ON public.events FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = responsible_user_id);
CREATE POLICY "Users can update alerts they created" ON public.alerts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can update voters they registered" ON public.voters FOR UPDATE USING (auth.uid() = registered_by);
CREATE POLICY "Users can update their assigned tasks" ON public.tasks FOR UPDATE USING (auth.uid() = assigned_to OR auth.uid() = assigned_by);
CREATE POLICY "Users can update territories they're responsible for" ON public.territories FOR UPDATE USING (auth.uid() = responsible_user_id OR auth.uid() = created_by);

-- FUNCIONES DE AUTOMATIZACIÓN

-- Función para crear tareas automáticas cuando se crea un evento
CREATE OR REPLACE FUNCTION public.create_event_tasks()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear tarea de preparación del evento
  INSERT INTO public.tasks (title, description, assigned_to, event_id, due_date, priority, assigned_by)
  VALUES (
    'Preparar evento: ' || NEW.title,
    'Coordinar todos los aspectos logísticos para el evento ' || NEW.title,
    NEW.responsible_user_id,
    NEW.id,
    NEW.start_date - INTERVAL '2 days',
    'high',
    NEW.created_by
  );
  
  -- Crear tarea de seguimiento post-evento
  INSERT INTO public.tasks (title, description, assigned_to, event_id, due_date, priority, assigned_by)
  VALUES (
    'Seguimiento post-evento: ' || NEW.title,
    'Generar reporte y seguimiento de resultados del evento ' || NEW.title,
    NEW.responsible_user_id,
    NEW.id,
    NEW.end_date + INTERVAL '1 day',
    'medium',
    NEW.created_by
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear tareas automáticas
CREATE TRIGGER create_event_tasks_trigger
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.create_event_tasks();

-- Función para registrar actividades automáticamente
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, details)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para logging automático
CREATE TRIGGER log_messages_activity AFTER INSERT OR UPDATE OR DELETE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.log_activity();
CREATE TRIGGER log_events_activity AFTER INSERT OR UPDATE OR DELETE ON public.events FOR EACH ROW EXECUTE FUNCTION public.log_activity();
CREATE TRIGGER log_voters_activity AFTER INSERT OR UPDATE OR DELETE ON public.voters FOR EACH ROW EXECUTE FUNCTION public.log_activity();
CREATE TRIGGER log_alerts_activity AFTER INSERT OR UPDATE OR DELETE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.log_activity();

-- Función para actualizar estadísticas automáticamente
CREATE OR REPLACE FUNCTION public.update_territory_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar estadísticas del territorio cuando se agrega/modifica un votante
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Aquí se pueden agregar cálculos de estadísticas
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_territory_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.voters
  FOR EACH ROW EXECUTE FUNCTION public.update_territory_stats();

-- Insertar datos iniciales de ejemplo
INSERT INTO public.territories (name, type, population_estimate, voter_estimate) VALUES
('Cauca', 'departamento', 1400000, 980000),
('Popayán', 'municipio', 280000, 196000),
('Timbío', 'municipio', 35000, 24500);

-- Hacer que el territorio padre sea Cauca
UPDATE public.territories SET parent_id = (SELECT id FROM public.territories WHERE name = 'Cauca') 
WHERE name IN ('Popayán', 'Timbío');
