-- =============================================
-- FIX: Políticas de Row Level Security (RLS)
-- Para permitir que los usuarios accedan a sus datos
-- =============================================

-- IMPORTANTE: Ejecuta este script en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Pega este código > Run

-- =============================================
-- 1. USUARIOS (users)
-- =============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Permitir que usuarios lean su propia información
CREATE POLICY "Users can read their own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Permitir que admins lean todos los usuarios
CREATE POLICY "Admins can read all users"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Permitir que usuarios actualicen su propia información
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- =============================================
-- 2. PERFILES (profiles)
-- =============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Permitir que TODOS lean perfiles (son públicos)
CREATE POLICY "Anyone can read profiles"
ON public.profiles
FOR SELECT
USING (true);

-- Permitir crear perfil propio
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Permitir actualizar perfil propio
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- =============================================
-- 3. REGALOS (gifts)
-- =============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Anyone can read active gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can manage gifts" ON public.gifts;

-- Permitir que TODOS lean los regalos activos
CREATE POLICY "Anyone can read active gifts"
ON public.gifts
FOR SELECT
USING (is_active = true);

-- Permitir que admins gestionen regalos
CREATE POLICY "Admins can manage gifts"
ON public.gifts
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =============================================
-- 4. TRANSACCIONES DE REGALOS (gift_transactions)
-- =============================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can read their gift transactions" ON public.gift_transactions;
DROP POLICY IF EXISTS "Users can create gift transactions" ON public.gift_transactions;

-- Permitir leer transacciones propias (enviadas o recibidas)
CREATE POLICY "Users can read their gift transactions"
ON public.gift_transactions
FOR SELECT
USING (
  auth.uid() = from_user_id OR 
  auth.uid() = to_user_id OR
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Permitir crear transacciones (enviar regalos)
CREATE POLICY "Users can create gift transactions"
ON public.gift_transactions
FOR INSERT
WITH CHECK (auth.uid() = from_user_id);

-- =============================================
-- 5. CONTENIDO (stories, reels, photos)
-- =============================================

-- STORIES
DROP POLICY IF EXISTS "Anyone can read stories" ON public.stories;
DROP POLICY IF EXISTS "Users can create their own stories" ON public.stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON public.stories;

CREATE POLICY "Anyone can read stories"
ON public.stories FOR SELECT USING (true);

CREATE POLICY "Users can create their own stories"
ON public.stories FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
ON public.stories FOR DELETE USING (auth.uid() = user_id);

-- REELS
DROP POLICY IF EXISTS "Anyone can read reels" ON public.reels;
DROP POLICY IF EXISTS "Users can create their own reels" ON public.reels;
DROP POLICY IF EXISTS "Users can delete their own reels" ON public.reels;

CREATE POLICY "Anyone can read reels"
ON public.reels FOR SELECT USING (true);

CREATE POLICY "Users can create their own reels"
ON public.reels FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reels"
ON public.reels FOR DELETE USING (auth.uid() = user_id);

-- PHOTOS
DROP POLICY IF EXISTS "Anyone can read photos" ON public.photos;
DROP POLICY IF EXISTS "Users can create their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON public.photos;

CREATE POLICY "Anyone can read photos"
ON public.photos FOR SELECT USING (true);

CREATE POLICY "Users can create their own photos"
ON public.photos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
ON public.photos FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 6. INTERACCIÓN SOCIAL (likes, comments, reviews, favorites)
-- =============================================

-- LIKES
DROP POLICY IF EXISTS "Anyone can read likes" ON public.likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.likes;

CREATE POLICY "Anyone can read likes"
ON public.likes FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes"
ON public.likes FOR ALL USING (auth.uid() = user_id);

-- COMMENTS
DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

CREATE POLICY "Anyone can read comments"
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- REVIEWS
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

CREATE POLICY "Anyone can read reviews"
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews"
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- FAVORITES
DROP POLICY IF EXISTS "Users can read their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;

CREATE POLICY "Users can read their own favorites"
ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 7. CRÉDITOS (credits, credit_transactions)
-- =============================================

-- CREDITS
DROP POLICY IF EXISTS "Users can read their own credits" ON public.credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.credits;

CREATE POLICY "Users can read their own credits"
ON public.credits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON public.credits FOR UPDATE USING (auth.uid() = user_id);

-- CREDIT TRANSACTIONS
DROP POLICY IF EXISTS "Users can read their own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can create credit transactions" ON public.credit_transactions;

CREATE POLICY "Users can read their own credit transactions"
ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create credit transactions"
ON public.credit_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 8. MEMBRESÍAS (memberships)
-- =============================================

DROP POLICY IF EXISTS "Users can read their own memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admins can manage memberships" ON public.memberships;

CREATE POLICY "Users can read their own memberships"
ON public.memberships FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage memberships"
ON public.memberships FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =============================================
-- ✅ POLÍTICAS CREADAS EXITOSAMENTE
-- =============================================

-- Verificar que RLS esté habilitado en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

SELECT 'Políticas de RLS configuradas correctamente ✅' as mensaje;

