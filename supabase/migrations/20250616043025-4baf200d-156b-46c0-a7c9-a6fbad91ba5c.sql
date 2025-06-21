
-- Crear tipos de datos específicos para el sistema electoral
CREATE TYPE voter_status AS ENUM ('activo', 'inactivo', 'contactado', 'convertido');
CREATE TYPE interaction_type AS ENUM ('llamada', 'whatsapp', 'sms', 'email', 'presencial', 'web');
CREATE TYPE campaign_status AS ENUM ('planificada', 'activa', 'pausada', 'completada');
CREATE TYPE sentiment_level AS ENUM ('muy_negativo', 'negativo', 'neutral', 'positivo', 'muy_positivo');

-- Tabla de votantes con información electoral completa
CREATE TABLE public.electoral_voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula VARCHAR(20) UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(15),
  email VARCHAR(100),
  direccion TEXT,
  barrio VARCHAR(50),
  comuna VARCHAR(50),
  ciudad VARCHAR(50) DEFAULT 'Bogotá',
  estrato INTEGER CHECK (estrato >= 1 AND estrato <= 6),
  edad INTEGER CHECK (edad >= 18 AND edad <= 120),
  genero VARCHAR(10) CHECK (genero IN ('masculino', 'femenino', 'otro')),
  profesion VARCHAR(50),
  nivel_educativo VARCHAR(30),
  estado_civil VARCHAR(20),
  intencion_voto VARCHAR(50),
  probabilidad_voto DECIMAL(3,2) DEFAULT 0.5 CHECK (probabilidad_voto >= 0 AND probabilidad_voto <= 1),
  ultima_interaccion TIMESTAMP,
  canal_contacto VARCHAR(20),
  status voter_status DEFAULT 'activo',
  territorio_asignado UUID REFERENCES public.territories(id),
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de candidatos
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  partido VARCHAR(50),
  propuestas JSONB,
  biografia TEXT,
  foto_url VARCHAR(200),
  redes_sociales JSONB,
  territorio_id UUID REFERENCES public.territories(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de interacciones electorales
CREATE TABLE public.electoral_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id UUID REFERENCES public.electoral_voters(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.candidates(id),
  user_id UUID REFERENCES public.profiles(id),
  tipo_interaccion interaction_type NOT NULL,
  canal VARCHAR(20) NOT NULL,
  mensaje TEXT,
  respuesta TEXT,
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  sentiment_level sentiment_level,
  efectividad DECIMAL(3,2) CHECK (efectividad >= 0 AND efectividad <= 1),
  duracion_minutos INTEGER,
  costo DECIMAL(8,2) DEFAULT 0,
  exitosa BOOLEAN DEFAULT false,
  seguimiento_requerido BOOLEAN DEFAULT false,
  proxima_accion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de campañas electorales
CREATE TABLE public.electoral_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id),
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  audiencia_objetivo JSONB,
  mensaje_principal TEXT,
  estado campaign_status DEFAULT 'planificada',
  fecha_inicio DATE,
  fecha_fin DATE,
  presupuesto DECIMAL(10,2) DEFAULT 0,
  gasto_actual DECIMAL(10,2) DEFAULT 0,
  roi DECIMAL(5,2),
  territorio_id UUID REFERENCES public.territories(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de métricas en tiempo real
CREATE TABLE public.electoral_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE DEFAULT CURRENT_DATE,
  territory_id UUID REFERENCES public.territories(id),
  candidate_id UUID REFERENCES public.candidates(id),
  total_contactos INTEGER DEFAULT 0,
  contactos_exitosos INTEGER DEFAULT 0,
  conversiones INTEGER DEFAULT 0,
  tasa_conversion DECIMAL(5,2) DEFAULT 0,
  sentiment_promedio DECIMAL(3,2) DEFAULT 0,
  costo_total DECIMAL(10,2) DEFAULT 0,
  roi DECIMAL(5,2) DEFAULT 0,
  proyeccion_votos INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de automatizaciones
CREATE TABLE public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  condiciones JSONB NOT NULL,
  acciones JSONB NOT NULL,
  activa BOOLEAN DEFAULT true,
  ejecutada_veces INTEGER DEFAULT 0,
  ultima_ejecucion TIMESTAMP,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_electoral_voters_territorio ON public.electoral_voters(territorio_asignado);
CREATE INDEX idx_electoral_voters_status ON public.electoral_voters(status);
CREATE INDEX idx_electoral_voters_probabilidad ON public.electoral_voters(probabilidad_voto);
CREATE INDEX idx_electoral_interactions_voter ON public.electoral_interactions(voter_id);
CREATE INDEX idx_electoral_interactions_date ON public.electoral_interactions(created_at);
CREATE INDEX idx_electoral_metrics_date ON public.electoral_metrics(fecha);
CREATE INDEX idx_electoral_metrics_territory ON public.electoral_metrics(territory_id);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.electoral_voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (los usuarios pueden ver datos de su territorio/jerarquía)
CREATE POLICY "Users can view electoral data based on role" ON public.electoral_voters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('desarrollador', 'master', 'candidato', 'lider')
    )
  );

CREATE POLICY "Users can insert electoral data" ON public.electoral_voters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('desarrollador', 'master', 'candidato', 'lider')
    )
  );

CREATE POLICY "Users can view candidates" ON public.candidates
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage candidates" ON public.candidates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('desarrollador', 'master', 'candidato')
    )
  );

CREATE POLICY "Users can view interactions" ON public.electoral_interactions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('desarrollador', 'master', 'candidato')
    )
  );

CREATE POLICY "Users can create interactions" ON public.electoral_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION update_electoral_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_electoral_voters_updated_at
    BEFORE UPDATE ON public.electoral_voters
    FOR EACH ROW
    EXECUTE FUNCTION update_electoral_updated_at();

CREATE TRIGGER trigger_candidates_updated_at
    BEFORE UPDATE ON public.candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_electoral_updated_at();

CREATE TRIGGER trigger_electoral_campaigns_updated_at
    BEFORE UPDATE ON public.electoral_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_electoral_updated_at();

CREATE TRIGGER trigger_electoral_metrics_updated_at
    BEFORE UPDATE ON public.electoral_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_electoral_updated_at();

-- Función para calcular métricas automáticamente
CREATE OR REPLACE FUNCTION calculate_electoral_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar métricas cuando se crea una nueva interacción
    INSERT INTO public.electoral_metrics (
        fecha,
        territory_id,
        candidate_id,
        total_contactos,
        contactos_exitosos,
        conversiones,
        tasa_conversion,
        sentiment_promedio
    )
    SELECT 
        CURRENT_DATE,
        ev.territorio_asignado,
        NEW.candidate_id,
        COUNT(*),
        COUNT(*) FILTER (WHERE ei.exitosa = true),
        COUNT(*) FILTER (WHERE ev.intencion_voto IS NOT NULL),
        ROUND((COUNT(*) FILTER (WHERE ei.exitosa = true)::DECIMAL / COUNT(*)) * 100, 2),
        AVG(ei.sentiment_score)
    FROM public.electoral_interactions ei
    JOIN public.electoral_voters ev ON ei.voter_id = ev.id
    WHERE ei.created_at::date = CURRENT_DATE
    AND ev.territorio_asignado = (
        SELECT territorio_asignado FROM public.electoral_voters WHERE id = NEW.voter_id
    )
    GROUP BY ev.territorio_asignado, NEW.candidate_id
    ON CONFLICT (fecha, territory_id, candidate_id) 
    DO UPDATE SET
        total_contactos = EXCLUDED.total_contactos,
        contactos_exitosos = EXCLUDED.contactos_exitosos,
        conversiones = EXCLUDED.conversiones,
        tasa_conversion = EXCLUDED.tasa_conversion,
        sentiment_promedio = EXCLUDED.sentiment_promedio,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_metrics
    AFTER INSERT ON public.electoral_interactions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_electoral_metrics();
