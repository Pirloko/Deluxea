-- =============================================
-- CONFIGURAR SUPABASE STORAGE
-- Crear buckets y políticas para subida de archivos
-- =============================================

-- IMPORTANTE: Ejecuta esto en Supabase Dashboard
-- Storage > Policies o SQL Editor

-- =============================================
-- NOTA: Los buckets se crean desde la UI de Supabase
-- =============================================
-- Ve a: Storage > Create a new bucket
-- Crea estos 4 buckets:
--   1. photos (público)
--   2. reels (público)
--   3. stories (público)
--   4. avatars (público)

-- =============================================
-- POLÍTICAS DE ACCESO PARA STORAGE
-- =============================================

-- Una vez creados los buckets, ejecuta estas políticas:

-- BUCKET: photos
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
DROP POLICY IF EXISTS "photos_public_access" ON storage.objects;
DROP POLICY IF EXISTS "photos_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "photos_delete_own" ON storage.objects;

-- Política 1: Cualquiera puede ver fotos
CREATE POLICY "photos_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Política 2: Usuarios autenticados pueden subir sus fotos
CREATE POLICY "photos_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 3: Usuarios pueden eliminar sus propias fotos
CREATE POLICY "photos_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================

-- BUCKET: reels
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "reels_public_access" ON storage.objects;
DROP POLICY IF EXISTS "reels_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "reels_delete_own" ON storage.objects;

-- Política 1: Cualquiera puede ver reels
CREATE POLICY "reels_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'reels');

-- Política 2: Usuarios autenticados pueden subir reels
CREATE POLICY "reels_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'reels' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 3: Usuarios pueden eliminar sus propios reels
CREATE POLICY "reels_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'reels' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================

-- BUCKET: stories
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "stories_public_access" ON storage.objects;
DROP POLICY IF EXISTS "stories_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "stories_delete_own" ON storage.objects;

-- Política 1: Cualquiera puede ver historias
CREATE POLICY "stories_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'stories');

-- Política 2: Usuarios autenticados pueden subir historias
CREATE POLICY "stories_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'stories' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 3: Usuarios pueden eliminar sus propias historias
CREATE POLICY "stories_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'stories' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================

-- BUCKET: avatars
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "avatars_public_access" ON storage.objects;
DROP POLICY IF EXISTS "avatars_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;

-- Política 1: Cualquiera puede ver avatars
CREATE POLICY "avatars_public_access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Política 2: Usuarios autenticados pueden subir avatars
CREATE POLICY "avatars_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 3: Usuarios pueden actualizar su propio avatar
CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política 4: Usuarios pueden eliminar su propio avatar
CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- =============================================

SELECT '✅ Políticas de Storage creadas' as mensaje;
SELECT 'Ahora los usuarios pueden subir archivos desde la app' as resultado;

