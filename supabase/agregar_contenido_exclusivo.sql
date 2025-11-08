-- =============================================
-- SISTEMA DE CONTENIDO EXCLUSIVO
-- Permite monetizar fotos con créditos
-- =============================================

-- PASO 1: Agregar campos a la tabla photos
-- =============================================
ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS is_exclusive BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS unlock_price INTEGER DEFAULT NULL CHECK (unlock_price >= 0);

-- Comentarios explicativos
COMMENT ON COLUMN public.photos.is_exclusive IS 'Si es true, la foto requiere pago para verla';
COMMENT ON COLUMN public.photos.unlock_price IS 'Precio en créditos para desbloquear (null si es pública)';

-- =============================================
-- PASO 2: Crear tabla de desbloqueos
-- =============================================
CREATE TABLE IF NOT EXISTS public.photo_unlocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    credits_paid INTEGER NOT NULL CHECK (credits_paid > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(photo_id, user_id) -- Un usuario solo puede desbloquear una foto una vez
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_photo_unlocks_photo_id ON public.photo_unlocks(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_unlocks_user_id ON public.photo_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_unlocks_created_at ON public.photo_unlocks(created_at DESC);

COMMENT ON TABLE public.photo_unlocks IS 'Registro de fotos desbloqueadas por usuarios';

-- =============================================
-- PASO 3: Políticas RLS para photo_unlocks
-- =============================================

-- Habilitar RLS
ALTER TABLE public.photo_unlocks ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propios desbloqueos
DROP POLICY IF EXISTS "Users can read their own unlocks" ON public.photo_unlocks;
CREATE POLICY "Users can read their own unlocks"
ON public.photo_unlocks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios pueden crear desbloqueos (comprar acceso)
DROP POLICY IF EXISTS "Users can create unlocks" ON public.photo_unlocks;
CREATE POLICY "Users can create unlocks"
ON public.photo_unlocks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Los dueños de fotos pueden ver quién desbloqueó sus fotos
DROP POLICY IF EXISTS "Photo owners can see who unlocked" ON public.photo_unlocks;
CREATE POLICY "Photo owners can see who unlocked"
ON public.photo_unlocks FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.photos p
    WHERE p.id = photo_unlocks.photo_id 
    AND p.user_id = auth.uid()
  )
);

-- =============================================
-- PASO 4: Función para verificar si un usuario desbloqueó una foto
-- =============================================
CREATE OR REPLACE FUNCTION has_unlocked_photo(photo_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.photo_unlocks 
    WHERE photo_id = photo_id_param 
    AND user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PASO 5: Función para desbloquear una foto (comprar acceso)
-- =============================================
CREATE OR REPLACE FUNCTION unlock_photo(
  photo_id_param UUID,
  user_id_param UUID
)
RETURNS JSON AS $$
DECLARE
  photo_record RECORD;
  user_credits_record RECORD;
  unlock_price INTEGER;
  result JSON;
BEGIN
  -- Verificar que la foto existe y es exclusiva
  SELECT * INTO photo_record 
  FROM public.photos 
  WHERE id = photo_id_param AND is_exclusive = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Foto no encontrada o no es exclusiva');
  END IF;
  
  unlock_price := photo_record.unlock_price;
  
  -- Verificar que el usuario no haya desbloqueado ya esta foto
  IF has_unlocked_photo(photo_id_param, user_id_param) THEN
    RETURN json_build_object('success', false, 'error', 'Ya tienes acceso a esta foto');
  END IF;
  
  -- Verificar que el usuario tenga suficientes créditos
  SELECT * INTO user_credits_record 
  FROM public.credits 
  WHERE user_id = user_id_param;
  
  IF NOT FOUND OR user_credits_record.balance < unlock_price THEN
    RETURN json_build_object('success', false, 'error', 'Créditos insuficientes');
  END IF;
  
  -- Descontar créditos
  UPDATE public.credits 
  SET balance = balance - unlock_price,
      updated_at = NOW()
  WHERE user_id = user_id_param;
  
  -- Registrar desbloqueo
  INSERT INTO public.photo_unlocks (photo_id, user_id, credits_paid)
  VALUES (photo_id_param, user_id_param, unlock_price);
  
  -- Registrar transacción de créditos
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (
    user_id_param,
    -unlock_price,
    'spend',
    'Desbloqueo de foto exclusiva'
  );
  
  -- Actualizar balance del dueño de la foto (recibe los créditos)
  UPDATE public.credits
  SET balance = balance + unlock_price,
      updated_at = NOW()
  WHERE user_id = photo_record.user_id;
  
  -- Registrar ingreso del dueño
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (
    photo_record.user_id,
    unlock_price,
    'purchase',
    'Venta de foto exclusiva'
  );
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Foto desbloqueada exitosamente',
    'credits_remaining', (SELECT balance FROM public.credits WHERE user_id = user_id_param)
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PASO 6: Crear algunas fotos exclusivas de ejemplo
-- =============================================

-- Actualizar algunas fotos existentes para hacerlas exclusivas
UPDATE public.photos 
SET is_exclusive = true, unlock_price = 50
WHERE id IN (
  SELECT id FROM public.photos 
  WHERE caption LIKE '%playa%' 
  LIMIT 1
);

UPDATE public.photos 
SET is_exclusive = true, unlock_price = 100
WHERE id IN (
  SELECT id FROM public.photos 
  WHERE caption LIKE '%exclusivo%' 
  LIMIT 1
);

-- =============================================
-- PASO 7: Verificación
-- =============================================
SELECT 'FOTOS EXCLUSIVAS CREADAS:' as info;
SELECT 
  p.caption,
  p.is_exclusive,
  p.unlock_price,
  u.email as owner
FROM public.photos p
JOIN public.users u ON u.id = p.user_id
WHERE p.is_exclusive = true;

SELECT '✅ Sistema de contenido exclusivo configurado' as mensaje;
SELECT 'Los usuarios ahora pueden monetizar sus fotos' as resultado;

