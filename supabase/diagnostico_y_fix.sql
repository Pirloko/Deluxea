-- =============================================
-- DIAGNÓSTICO Y SOLUCIÓN COMPLETA
-- Ejecuta esto en Supabase SQL Editor
-- =============================================

-- PASO 1: Verificar si la tabla users existe y tiene datos
-- =============================================
SELECT 'PASO 1: Verificando tabla users...' as paso;

SELECT COUNT(*) as total_usuarios FROM public.users;

-- Si muestra 0, la tabla está vacía y debemos insertar los usuarios
-- Si muestra un error, la tabla no existe

-- PASO 2: Ver los usuarios que existen
-- =============================================
SELECT 'PASO 2: Usuarios en la tabla...' as paso;

SELECT id, email, role, is_active FROM public.users;

-- PASO 3: Verificar usuarios en auth.users (Supabase Auth)
-- =============================================
SELECT 'PASO 3: Usuarios en Auth...' as paso;

SELECT id, email, created_at FROM auth.users;

-- PASO 4: SINCRONIZAR - Insertar usuarios faltantes en public.users
-- =============================================
SELECT 'PASO 4: Sincronizando usuarios...' as paso;

-- Insertar usuarios de auth.users que no estén en public.users
INSERT INTO public.users (id, email, role, is_active, must_change_password)
SELECT 
  au.id,
  au.email,
  'visitor' as role, -- Por defecto, asignar rol visitor
  true as is_active,
  false as must_change_password
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- PASO 5: Actualizar roles de usuarios específicos
-- =============================================
SELECT 'PASO 5: Actualizando roles de usuarios conocidos...' as paso;

-- Actualizar el admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@deluxea.com';

-- Actualizar los profile_users
UPDATE public.users 
SET role = 'profile_user' 
WHERE email IN ('carlos@deluxea.com', 'maria@deluxea.com');

-- Actualizar el visitor
UPDATE public.users 
SET role = 'visitor' 
WHERE email = 'visitor@deluxea.com';

-- PASO 6: Verificar que los roles se actualizaron
-- =============================================
SELECT 'PASO 6: Verificando roles actualizados...' as paso;

SELECT id, email, role, is_active FROM public.users ORDER BY role;

-- PASO 7: Deshabilitar RLS temporalmente para diagnóstico
-- =============================================
SELECT 'PASO 7: Deshabilitando RLS temporalmente...' as paso;

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships DISABLE ROW LEVEL SECURITY;

-- PASO 8: Limpiar políticas antiguas
-- =============================================
SELECT 'PASO 8: Limpiando políticas antiguas...' as paso;

-- Eliminar TODAS las políticas de la tabla users
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.users';
    END LOOP;
END $$;

-- PASO 9: Crear políticas simples y funcionales
-- =============================================
SELECT 'PASO 9: Creando políticas RLS...' as paso;

-- Permitir que todos los usuarios autenticados lean su propia información
CREATE POLICY "Enable read access for authenticated users"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Permitir que los usuarios actualicen su propia información
CREATE POLICY "Enable update for users based on id"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- PASO 10: Habilitar RLS de nuevo
-- =============================================
SELECT 'PASO 10: Habilitando RLS...' as paso;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- PASO 11: Crear políticas para otras tablas críticas
-- =============================================
SELECT 'PASO 11: Configurando otras tablas...' as paso;

-- PROFILES: Todos pueden leer
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO authenticated, anon
USING (true);

-- PROFILES: Los usuarios pueden crear su propio perfil
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- PROFILES: Los usuarios pueden actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- GIFTS: Todos pueden leer regalos activos
DROP POLICY IF EXISTS "Active gifts are viewable by everyone" ON public.gifts;
CREATE POLICY "Active gifts are viewable by everyone"
ON public.gifts FOR SELECT
TO authenticated, anon
USING (is_active = true);

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- PASO 12: Crear balances de créditos para usuarios existentes
-- =============================================
SELECT 'PASO 12: Creando balances de créditos...' as paso;

INSERT INTO public.credits (user_id, balance)
SELECT id, 0
FROM public.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.credits WHERE user_id = users.id
)
ON CONFLICT (user_id) DO NOTHING;

-- PASO FINAL: Resumen
-- =============================================
SELECT 'PASO FINAL: Resumen del sistema' as paso;

SELECT 
  'USUARIOS' as tabla,
  COUNT(*) as total,
  SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
  SUM(CASE WHEN role = 'profile_user' THEN 1 ELSE 0 END) as profile_users,
  SUM(CASE WHEN role = 'visitor' THEN 1 ELSE 0 END) as visitors
FROM public.users;

SELECT '✅ CONFIGURACIÓN COMPLETADA' as mensaje;
SELECT 'Ahora intenta hacer login nuevamente' as instruccion;

