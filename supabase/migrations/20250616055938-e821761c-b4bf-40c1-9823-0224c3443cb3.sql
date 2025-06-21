
-- Crear esquema demo separado
CREATE SCHEMA IF NOT EXISTS demo;

-- Tabla de usuarios demo
CREATE TABLE demo.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('master', 'candidato', 'lider', 'votante')),
  phone VARCHAR(20),
  address TEXT,
  territory_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de territorios demo
CREATE TABLE demo.territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('departamento', 'ciudad', 'barrio', 'vereda')),
  parent_id UUID REFERENCES demo.territories(id),
  coordinates JSONB,
  population INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de candidatos demo
CREATE TABLE demo.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES demo.users(id),
  position VARCHAR(100) NOT NULL CHECK (position IN ('gobernador', 'alcalde', 'concejal', 'edil')),
  territory_id UUID REFERENCES demo.territories(id),
  photo_url TEXT,
  slogan TEXT,
  proposals JSONB,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de votos demo
CREATE TABLE demo.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id UUID REFERENCES demo.users(id),
  candidate_id UUID REFERENCES demo.candidates(id),
  position VARCHAR(100) NOT NULL,
  territory_id UUID REFERENCES demo.territories(id),
  vote_intention VARCHAR(20) CHECK (vote_intention IN ('confirmed', 'likely', 'undecided', 'unlikely')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(voter_id, candidate_id, position)
);

-- Tabla de alertas demo georreferenciadas
CREATE TABLE demo.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('security', 'event', 'campaign', 'infrastructure')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  territory_id UUID REFERENCES demo.territories(id),
  coordinates JSONB,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'closed')),
  created_by UUID REFERENCES demo.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de interacciones de visitantes (para N8N y Gemini)
CREATE TABLE demo.visitor_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  territory_id UUID REFERENCES demo.territories(id),
  interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('map_view', 'alert_click', 'candidate_view', 'registration_start', 'vote_intention')),
  data JSONB,
  gemini_analysis JSONB,
  n8n_workflow_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar territorios base
INSERT INTO demo.territories (name, type, coordinates, population) VALUES
('Cundinamarca', 'departamento', '{"lat": 4.7110, "lng": -74.0721}', 2919060),
('Bogotá', 'ciudad', '{"lat": 4.7110, "lng": -74.0721}', 7412566),
('Chapinero', 'barrio', '{"lat": 4.6731, "lng": -74.0479}', 32000),
('Suba', 'barrio', '{"lat": 4.7590, "lng": -74.0890}', 67000),
('Usaquén', 'barrio', '{"lat": 4.6946, "lng": -74.0309}', 28000),
('Kennedy', 'barrio', '{"lat": 4.6280, "lng": -74.1472}', 89000),
('Engativá', 'barrio', '{"lat": 4.7547, "lng": -74.1134}', 52000),
('Centro', 'barrio', '{"lat": 4.5981, "lng": -74.0758}', 45000);

-- Insertar usuarios master
INSERT INTO demo.users (email, password_hash, name, role, phone) VALUES
('master@micampana.com', '$2b$10$demo.hash', 'Carlos Master Rodriguez', 'master', '+57 300 100 0001');

-- Insertar candidatos (5)
INSERT INTO demo.users (email, password_hash, name, role, phone, territory_id) VALUES
('maria.gonzalez@micampana.com', '$2b$10$demo.hash', 'María González', 'candidato', '+57 300 200 0001', (SELECT id FROM demo.territories WHERE name = 'Bogotá')),
('juan.martinez@micampana.com', '$2b$10$demo.hash', 'Juan Martínez', 'candidato', '+57 300 200 0002', (SELECT id FROM demo.territories WHERE name = 'Chapinero')),
('ana.rodriguez@micampana.com', '$2b$10$demo.hash', 'Ana Rodríguez', 'candidato', '+57 300 200 0003', (SELECT id FROM demo.territories WHERE name = 'Suba')),
('carlos.lopez@micampana.com', '$2b$10$demo.hash', 'Carlos López', 'candidato', '+57 300 200 0004', (SELECT id FROM demo.territories WHERE name = 'Kennedy')),
('lucia.torres@micampana.com', '$2b$10$demo.hash', 'Lucía Torres', 'candidato', '+57 300 200 0005', (SELECT id FROM demo.territories WHERE name = 'Usaquén'));

-- Insertar datos de candidatos en tabla candidates
INSERT INTO demo.candidates (user_id, position, territory_id, photo_url, slogan, proposals, vote_count) VALUES
((SELECT id FROM demo.users WHERE email = 'maria.gonzalez@micampana.com'), 'alcalde', (SELECT id FROM demo.territories WHERE name = 'Bogotá'), '/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png', '¡Juntos por el Cambio Real!', '["🏥 Salud gratuita para todos", "🎓 Educación de calidad", "🚌 Transporte público eficiente", "🌳 Espacios verdes en cada barrio", "💼 Empleos dignos para jóvenes"]'::jsonb, 15420),
((SELECT id FROM demo.users WHERE email = 'juan.martinez@micampana.com'), 'concejal', (SELECT id FROM demo.territories WHERE name = 'Chapinero'), '/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png', 'Chapinero Progresista', '["🏢 Desarrollo urbano sostenible", "🎭 Cultura y arte para todos", "🚴 Ciclovías seguras", "📚 Bibliotecas comunitarias"]'::jsonb, 8932),
((SELECT id FROM demo.users WHERE email = 'ana.rodriguez@micampana.com'), 'concejal', (SELECT id FROM demo.territories WHERE name = 'Suba'), '/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png', 'Suba Unida y Fuerte', '["🏠 Vivienda digna", "🚌 Mejor transporte", "⚽ Deportes para la juventud", "👵 Atención al adulto mayor"]'::jsonb, 12156),
((SELECT id FROM demo.users WHERE email = 'carlos.lopez@micampana.com'), 'edil', (SELECT id FROM demo.territories WHERE name = 'Kennedy'), '/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png', 'Kennedy Avanza', '["🛡️ Seguridad ciudadana", "🏭 Empleo local", "🌱 Medio ambiente limpio", "👨‍👩‍👧‍👦 Familias prósperas"]'::jsonb, 6743),
((SELECT id FROM demo.users WHERE email = 'lucia.torres@micampana.com'), 'concejal', (SELECT id FROM demo.territories WHERE name = 'Usaquén'), '/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png', 'Usaquén Sostenible', '["🌳 Parques ecológicos", "🎨 Arte urbano", "🚶‍♀️ Calles peatonales", "💡 Innovación tecnológica"]'::jsonb, 9287);

-- Insertar líderes (20)
INSERT INTO demo.users (email, password_hash, name, role, phone, territory_id) 
SELECT 
  'lider' || generate_series(1,20) || '@micampana.com',
  '$2b$10$demo.hash',
  'Líder ' || generate_series(1,20),
  'lider',
  '+57 300 300 ' || LPAD(generate_series(1,20)::text, 4, '0'),
  (SELECT id FROM demo.territories ORDER BY RANDOM() LIMIT 1);

-- Insertar votantes (simulando 100,000 pero insertando 1000 para pruebas)
INSERT INTO demo.users (email, password_hash, name, role, phone, territory_id)
SELECT 
  'votante' || generate_series(1,1000) || '@demo.com',
  '$2b$10$demo.hash',
  'Votante ' || generate_series(1,1000),
  'votante',
  '+57 300 400 ' || LPAD(generate_series(1,1000)::text, 4, '0'),
  (SELECT id FROM demo.territories ORDER BY RANDOM() LIMIT 1);

-- Insertar alertas georreferenciadas
INSERT INTO demo.alerts (title, description, type, priority, territory_id, coordinates, created_by) VALUES
('Mejoras en el Parque Simón Bolívar', 'Se están realizando mejoras en la infraestructura del parque principal', 'infrastructure', 'medium', (SELECT id FROM demo.territories WHERE name = 'Chapinero'), '{"lat": 4.6731, "lng": -74.0479}', (SELECT id FROM demo.users WHERE role = 'master' LIMIT 1)),
('Evento Cultural en la Plaza', 'Gran evento cultural este fin de semana con artistas locales', 'event', 'high', (SELECT id FROM demo.territories WHERE name = 'Suba'), '{"lat": 4.7590, "lng": -74.0890}', (SELECT id FROM demo.users WHERE role = 'master' LIMIT 1)),
('Campaña de Vacunación', 'Jornada de vacunación gratuita en el centro de salud local', 'campaign', 'high', (SELECT id FROM demo.territories WHERE name = 'Kennedy'), '{"lat": 4.6280, "lng": -74.1472}', (SELECT id FROM demo.users WHERE role = 'master' LIMIT 1)),
('Reparación de Vías', 'Trabajos de mantenimiento en las vías principales del sector', 'infrastructure', 'medium', (SELECT id FROM demo.territories WHERE name = 'Usaquén'), '{"lat": 4.6946, "lng": -74.0309}', (SELECT id FROM demo.users WHERE role = 'master' LIMIT 1)),
('Feria Empresarial', 'Oportunidades de empleo en la feria empresarial del barrio', 'event', 'medium', (SELECT id FROM demo.territories WHERE name = 'Engativá'), '{"lat": 4.7547, "lng": -74.1134}', (SELECT id FROM demo.users WHERE role = 'master' LIMIT 1));

-- Insertar votos demo distribuidos
INSERT INTO demo.votes (voter_id, candidate_id, position, territory_id, vote_intention)
SELECT 
  v.id,
  c.id,
  c.position,
  v.territory_id,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'confirmed'
    WHEN RANDOM() < 0.7 THEN 'likely'
    WHEN RANDOM() < 0.9 THEN 'undecided'
    ELSE 'unlikely'
  END
FROM demo.users v
CROSS JOIN demo.candidates c
WHERE v.role = 'votante' 
  AND RANDOM() < 0.3  -- Solo 30% de votantes votan por cada candidato
LIMIT 50000; -- Simular 50k votos

-- Crear índices para optimización
CREATE INDEX idx_demo_users_role ON demo.users(role);
CREATE INDEX idx_demo_users_territory ON demo.users(territory_id);
CREATE INDEX idx_demo_alerts_territory ON demo.alerts(territory_id);
CREATE INDEX idx_demo_alerts_status ON demo.alerts(status);
CREATE INDEX idx_demo_votes_candidate ON demo.votes(candidate_id);
CREATE INDEX idx_demo_visitor_interactions_session ON demo.visitor_interactions(session_id);
CREATE INDEX idx_demo_visitor_interactions_territory ON demo.visitor_interactions(territory_id);

-- Función para obtener métricas en tiempo real
CREATE OR REPLACE FUNCTION demo.get_territory_metrics(territory_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_voters', (SELECT COUNT(*) FROM demo.users WHERE territory_id = territory_uuid AND role = 'votante'),
    'active_alerts', (SELECT COUNT(*) FROM demo.alerts WHERE territory_id = territory_uuid AND status = 'active'),
    'vote_intentions', (
      SELECT jsonb_object_agg(vote_intention, count)
      FROM (
        SELECT vote_intention, COUNT(*) as count
        FROM demo.votes v
        JOIN demo.users u ON v.voter_id = u.id
        WHERE u.territory_id = territory_uuid
        GROUP BY vote_intention
      ) t
    ),
    'top_candidate', (
      SELECT jsonb_build_object('name', u.name, 'votes', COUNT(*))
      FROM demo.votes v
      JOIN demo.candidates c ON v.candidate_id = c.id
      JOIN demo.users u ON c.user_id = u.id
      JOIN demo.users voter ON v.voter_id = voter.id
      WHERE voter.territory_id = territory_uuid
      GROUP BY c.id, u.name
      ORDER BY COUNT(*) DESC
      LIMIT 1
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON SCHEMA demo IS 'Base de datos demo con 1 master, 5 candidatos, 20 líderes y datos simulados para testing completo del sistema electoral';
