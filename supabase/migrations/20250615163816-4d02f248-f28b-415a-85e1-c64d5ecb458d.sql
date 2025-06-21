
-- Arreglar el problema del confirmation_token en la tabla auth.users
-- El problema es que algunos usuarios tienen valores NULL en confirmation_token
-- pero el esquema espera que no sea NULL

-- Actualizar valores NULL a string vacío para confirmation_token
UPDATE auth.users 
SET confirmation_token = '' 
WHERE confirmation_token IS NULL;

-- Actualizar valores NULL a string vacío para otras columnas problemáticas
UPDATE auth.users 
SET email_change_token_new = COALESCE(email_change_token_new, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_current = COALESCE(email_change_token_current, '')
WHERE email_change_token_new IS NULL 
   OR phone_change_token IS NULL 
   OR recovery_token IS NULL 
   OR email_change_token_current IS NULL;

-- Verificar que los usuarios de prueba existen correctamente
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email IN ('lider@micampana.com', 'candidato@micampana.com', 'master@micampana.com', 'admin@micampana.com');

-- Verificar que los perfiles correspondientes existen
SELECT p.id, p.name, p.role, u.email 
FROM public.profiles p 
JOIN auth.users u ON p.id = u.id 
WHERE u.email IN ('lider@micampana.com', 'candidato@micampana.com', 'master@micampana.com', 'admin@micampana.com');
