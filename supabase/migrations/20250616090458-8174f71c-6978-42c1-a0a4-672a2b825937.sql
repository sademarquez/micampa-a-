
-- Crear función para insertar usuarios demo de manera segura
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_users RECORD;
    result_text text := 'Usuarios demo creados: ';
BEGIN
    -- Array de usuarios demo con contraseña fija
    FOR demo_users IN 
        SELECT * FROM (VALUES
            ('dev@demo.com', 'Desarrollador', 'desarrollador'),
            ('master@demo.com', 'Master', 'master'), 
            ('candidato@demo.com', 'Candidato', 'candidato'),
            ('lider@demo.com', 'Lider', 'lider'),
            ('votante@demo.com', 'Votante', 'votante')
        ) AS t(email, name, role)
    LOOP
        -- Insertar en auth.users si no existe
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = demo_users.email) THEN
            INSERT INTO auth.users (
                instance_id,
                id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                created_at,
                updated_at,
                confirmation_token,
                email_change,
                email_change_token_new,
                recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000',
                gen_random_uuid(),
                'authenticated',
                'authenticated',
                demo_users.email,
                crypt('12345678', gen_salt('bf')),
                NOW(),
                NOW(), 
                NOW(),
                '',
                '',
                '',
                ''
            );
            
            result_text := result_text || demo_users.name || ', ';
        END IF;
    END LOOP;
    
    -- Crear perfiles para usuarios que no los tengan
    INSERT INTO public.profiles (id, name, role, created_at)
    SELECT 
        u.id,
        CASE 
            WHEN u.email = 'dev@demo.com' THEN 'Desarrollador'
            WHEN u.email = 'master@demo.com' THEN 'Master'
            WHEN u.email = 'candidato@demo.com' THEN 'Candidato'
            WHEN u.email = 'lider@demo.com' THEN 'Lider'
            WHEN u.email = 'votante@demo.com' THEN 'Votante'
        END,
        CASE 
            WHEN u.email = 'dev@demo.com' THEN 'desarrollador'::user_role
            WHEN u.email = 'master@demo.com' THEN 'master'::user_role
            WHEN u.email = 'candidato@demo.com' THEN 'candidato'::user_role
            WHEN u.email = 'lider@demo.com' THEN 'lider'::user_role
            WHEN u.email = 'votante@demo.com' THEN 'votante'::user_role
        END,
        NOW()
    FROM auth.users u
    WHERE u.email IN ('dev@demo.com', 'master@demo.com', 'candidato@demo.com', 'lider@demo.com', 'votante@demo.com')
    AND NOT EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = u.id
    );
    
    RETURN result_text || 'Completado exitosamente.';
END;
$$;

-- Ejecutar la función para crear usuarios
SELECT create_demo_users();
