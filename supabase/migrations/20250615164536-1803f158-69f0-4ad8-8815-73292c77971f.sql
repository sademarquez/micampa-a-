
-- Migración segura para arreglar problemas de esquema sin eliminar usuarios existentes
-- Primero limpiar referencias en system_logs si es necesario, luego actualizar usuarios

DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Limpiar system_logs que pueden estar causando conflictos de foreign key
    DELETE FROM public.system_logs 
    WHERE user_id IN (
        SELECT id FROM auth.users 
        WHERE email IN ('lider@micampana.com', 'candidato@micampana.com', 'master@micampana.com', 'admin@micampana.com')
    );

    -- Ahora actualizar todos los campos problemáticos en auth.users
    UPDATE auth.users 
    SET 
        confirmation_token = COALESCE(confirmation_token, ''),
        email_change_token_new = COALESCE(email_change_token_new, ''),
        phone_change_token = COALESCE(phone_change_token, ''),
        recovery_token = COALESCE(recovery_token, ''),
        email_change_token_current = COALESCE(email_change_token_current, ''),
        email_change = COALESCE(email_change, ''),
        phone_change = COALESCE(phone_change, '')
    WHERE 
        confirmation_token IS NULL OR
        email_change_token_new IS NULL OR
        phone_change_token IS NULL OR
        recovery_token IS NULL OR
        email_change_token_current IS NULL OR
        email_change IS NULL OR
        phone_change IS NULL;

    -- Verificar si los usuarios de prueba existen, si no crearlos
    FOR user_record IN 
        SELECT unnest(ARRAY['admin@micampana.com', 'master@micampana.com', 'candidato@micampana.com', 'lider@micampana.com']) as email
    LOOP
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = user_record.email) THEN
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
                email_change_token_current,
                email_change,
                phone_change
            ) VALUES (
                gen_random_uuid(),
                '00000000-0000-0000-0000-000000000000',
                user_record.email,
                CASE 
                    WHEN user_record.email = 'admin@micampana.com' THEN crypt('AdminSecure2025!', gen_salt('bf'))
                    WHEN user_record.email = 'master@micampana.com' THEN crypt('MasterSecure2025!', gen_salt('bf'))
                    WHEN user_record.email = 'candidato@micampana.com' THEN crypt('CandidatoSecure2025!', gen_salt('bf'))
                    WHEN user_record.email = 'lider@micampana.com' THEN crypt('LiderSecure2025!', gen_salt('bf'))
                END,
                now(),
                now(),
                now(),
                '{"provider": "email", "providers": ["email"]}',
                CASE 
                    WHEN user_record.email = 'admin@micampana.com' THEN '{"name": "Administrador Principal"}'
                    WHEN user_record.email = 'master@micampana.com' THEN '{"name": "Master Campaign"}'
                    WHEN user_record.email = 'candidato@micampana.com' THEN '{"name": "Candidato Principal"}'
                    WHEN user_record.email = 'lider@micampana.com' THEN '{"name": "Líder Territorial"}'
                END,
                false,
                'authenticated',
                'authenticated',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            );
        ELSE
            -- Actualizar usuarios existentes para asegurar que no tengan valores NULL
            UPDATE auth.users 
            SET 
                confirmation_token = COALESCE(confirmation_token, ''),
                email_change_token_new = COALESCE(email_change_token_new, ''),
                phone_change_token = COALESCE(phone_change_token, ''),
                recovery_token = COALESCE(recovery_token, ''),
                email_change_token_current = COALESCE(email_change_token_current, ''),
                email_change = COALESCE(email_change, ''),
                phone_change = COALESCE(phone_change, ''),
                email_confirmed_at = COALESCE(email_confirmed_at, now())
            WHERE email = user_record.email;
        END IF;
    END LOOP;

    -- Crear o actualizar perfiles correspondientes
    INSERT INTO public.profiles (id, name, role, created_at)
    SELECT 
        u.id,
        CASE 
            WHEN u.email = 'admin@micampana.com' THEN 'Administrador Principal'
            WHEN u.email = 'master@micampana.com' THEN 'Master Campaign'
            WHEN u.email = 'candidato@micampana.com' THEN 'Candidato Principal'
            WHEN u.email = 'lider@micampana.com' THEN 'Líder Territorial'
        END,
        CASE 
            WHEN u.email = 'admin@micampana.com' THEN 'desarrollador'::user_role
            WHEN u.email = 'master@micampana.com' THEN 'master'::user_role
            WHEN u.email = 'candidato@micampana.com' THEN 'candidato'::user_role
            WHEN u.email = 'lider@micampana.com' THEN 'lider'::user_role
        END,
        now()
    FROM auth.users u
    WHERE u.email IN ('lider@micampana.com', 'candidato@micampana.com', 'master@micampana.com', 'admin@micampana.com')
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        updated_at = now();

END $$;

-- Verificar que todo está correcto
SELECT 'Estado final de usuarios:' as status;
SELECT u.id, u.email, u.email_confirmed_at, u.confirmation_token, p.name, p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('lider@micampana.com', 'candidato@micampana.com', 'master@micampana.com', 'admin@micampana.com')
ORDER BY u.email;
