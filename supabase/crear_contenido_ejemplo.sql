-- =============================================
-- CREAR CONTENIDO DE EJEMPLO
-- Para testing del sistema de contenido
-- =============================================

-- FOTOS de Valentina (carlos@deluxea.com)
-- =============================================
INSERT INTO public.photos (user_id, image_url, caption, likes_count)
SELECT 
  id,
  'https://picsum.photos/seed/valentina1/800/800',
  'Sesión fotográfica en la playa 🌊 #modelo #beach',
  15
FROM public.users WHERE email = 'carlos@deluxea.com';

INSERT INTO public.photos (user_id, image_url, caption, likes_count)
SELECT 
  id,
  'https://picsum.photos/seed/valentina2/800/800',
  'Look del día 💕 #fashion #style',
  28
FROM public.users WHERE email = 'carlos@deluxea.com';

INSERT INTO public.photos (user_id, image_url, caption, likes_count)
SELECT 
  id,
  'https://picsum.photos/seed/valentina3/800/800',
  'Hora dorada ✨ #photography',
  42
FROM public.users WHERE email = 'carlos@deluxea.com';

-- FOTOS de Alex (maria@deluxea.com)
-- =============================================
INSERT INTO public.photos (user_id, image_url, caption, likes_count)
SELECT 
  id,
  'https://picsum.photos/seed/alex1/800/800',
  'Contenido exclusivo 🏳️‍⚧️ #trans #pride',
  67
FROM public.users WHERE email = 'maria@deluxea.com';

INSERT INTO public.photos (user_id, image_url, caption, likes_count)
SELECT 
  id,
  'https://picsum.photos/seed/alex2/800/800',
  'Nuevo look! 💜 #makeup #style',
  51
FROM public.users WHERE email = 'maria@deluxea.com';

-- REELS de Valentina
-- =============================================
INSERT INTO public.reels (user_id, video_url, caption, likes_count)
SELECT 
  id,
  'https://www.w3schools.com/html/mov_bbb.mp4',
  '¡Mira mi nuevo reel! 🎥 #reels #content',
  89
FROM public.users WHERE email = 'carlos@deluxea.com';

INSERT INTO public.reels (user_id, video_url, caption, likes_count)
SELECT 
  id,
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'Behind the scenes 🎬 #bts',
  76
FROM public.users WHERE email = 'carlos@deluxea.com';

-- REELS de Alex
-- =============================================
INSERT INTO public.reels (user_id, video_url, caption, likes_count)
SELECT 
  id,
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'Transformación del día 🌈 #trans #transformation',
  134
FROM public.users WHERE email = 'maria@deluxea.com';

-- HISTORIAS de Valentina (últimas 24h)
-- =============================================
INSERT INTO public.stories (user_id, media_url, media_type, expires_at)
SELECT 
  id,
  'https://picsum.photos/seed/story1/400/700',
  'image',
  NOW() + INTERVAL '24 hours'
FROM public.users WHERE email = 'carlos@deluxea.com';

INSERT INTO public.stories (user_id, media_url, media_type, expires_at)
SELECT 
  id,
  'https://picsum.photos/seed/story2/400/700',
  'image',
  NOW() + INTERVAL '24 hours'
FROM public.users WHERE email = 'carlos@deluxea.com';

-- HISTORIAS de Alex
-- =============================================
INSERT INTO public.stories (user_id, media_url, media_type, expires_at)
SELECT 
  id,
  'https://picsum.photos/seed/story3/400/700',
  'image',
  NOW() + INTERVAL '24 hours'
FROM public.users WHERE email = 'maria@deluxea.com';

-- Verificar contenido creado
-- =============================================
SELECT '📸 FOTOS CREADAS:' as tipo;
SELECT 
  u.email,
  p.caption,
  p.likes_count,
  p.created_at
FROM public.photos p
JOIN public.users u ON u.id = p.user_id
ORDER BY p.created_at DESC;

SELECT '🎥 REELS CREADOS:' as tipo;
SELECT 
  u.email,
  r.caption,
  r.likes_count,
  r.created_at
FROM public.reels r
JOIN public.users u ON u.id = r.user_id
ORDER BY r.created_at DESC;

SELECT '📖 HISTORIAS CREADAS:' as tipo;
SELECT 
  u.email,
  s.media_url,
  s.media_type,
  s.expires_at,
  s.created_at
FROM public.stories s
JOIN public.users u ON u.id = s.user_id
ORDER BY s.created_at DESC;

SELECT '✅ Contenido de ejemplo creado exitosamente' as mensaje;
