-- =============================================
-- LIMPIAR PERFILES EXISTENTES Y CREAR NUEVOS
-- =============================================

-- PASO 1: Eliminar todos los perfiles existentes
-- =============================================
DELETE FROM public.profiles;

SELECT '✅ Perfiles eliminados' as mensaje;

-- PASO 2: Crear 2 perfiles nuevos de ejemplo
-- =============================================

-- Perfil 1: Valentina - Escort
INSERT INTO public.profiles (
  user_id,
  name,
  age,
  title,
  description,
  category,
  contact_number,
  tags,
  avatar_url
)
SELECT 
  id,
  'Valentina Torres',
  24,
  'Modelo Profesional',
  '¡Hola! Soy Valentina 💕 Modelo profesional con experiencia en eventos exclusivos. Disponible para acompañamiento y sesiones fotográficas. Siempre con la mejor actitud y profesionalismo. ✨',
  'Escort',
  '+56 9 8765 4321',
  ARRAY['Elegante', 'Profesional', 'Bilingüe', 'Discreta'],
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina'
FROM public.users 
WHERE email = 'carlos@deluxea.com'
ON CONFLICT (user_id) DO NOTHING;

-- Perfil 2: Alex - Trans
INSERT INTO public.profiles (
  user_id,
  name,
  age,
  title,
  description,
  category,
  contact_number,
  tags,
  avatar_url
)
SELECT 
  id,
  'Alex Rivera',
  26,
  'Creadora de Contenido Trans',
  'Hola, soy Alex 🏳️‍⚧️ Creadora de contenido trans, activista y modelo. Me dedico a crear contenido auténtico y empoderar a la comunidad. Disponible para colaboraciones y contenido personalizado. 🌈',
  'Trans',
  '+56 9 9876 5432',
  ARRAY['Inclusiva', 'Auténtica', 'Contenido Premium', 'Activista'],
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
FROM public.users 
WHERE email = 'maria@deluxea.com'
ON CONFLICT (user_id) DO NOTHING;

-- PASO 3: Verificar perfiles creados
-- =============================================
SELECT 'PASO 3: Perfiles creados exitosamente' as mensaje;

SELECT 
  p.name,
  p.age,
  p.title,
  p.category,
  p.tags,
  u.email
FROM public.profiles p
JOIN public.users u ON u.id = p.user_id
ORDER BY p.name;

SELECT '✅ Proceso completado' as resultado;

