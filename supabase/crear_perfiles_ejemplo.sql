-- =============================================
-- CREAR PERFILES DE EJEMPLO
-- Para usuarios de prueba
-- =============================================

-- IMPORTANTE: Ejecuta esto en Supabase SQL Editor

-- Verificar IDs de usuarios
SELECT 'IDs de usuarios actuales:' as info;
SELECT id, email, role FROM public.users;

-- Crear perfiles para carlos@deluxea.com y maria@deluxea.com
-- =============================================

-- Perfil para Carlos
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
  'Carlos Rodríguez',
  28,
  'Creador de Contenido',
  '¡Hola! Soy Carlos, creador de contenido digital. Me apasiona la fotografía y crear momentos únicos. Bienvenidos a mi perfil ✨',
  'Venta de Contenido',
  '+1 555-0123',
  ARRAY['Fotografía', 'Viajes', 'Lifestyle'],
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
FROM public.users 
WHERE email = 'carlos@deluxea.com'
ON CONFLICT (user_id) 
DO UPDATE SET
  name = EXCLUDED.name,
  age = EXCLUDED.age,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  contact_number = EXCLUDED.contact_number,
  tags = EXCLUDED.tags,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- Perfil para María
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
  'María González',
  25,
  'Modelo & Influencer',
  'Modelo profesional y amante del arte. Me encanta conectar con personas increíbles. ¡Sígueme para ver mi día a día! 💕',
  'Escort',
  '+1 555-0456',
  ARRAY['Modelaje', 'Moda', 'Arte'],
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
FROM public.users 
WHERE email = 'maria@deluxea.com'
ON CONFLICT (user_id) 
DO UPDATE SET
  name = EXCLUDED.name,
  age = EXCLUDED.age,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  contact_number = EXCLUDED.contact_number,
  tags = EXCLUDED.tags,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- Verificar que se crearon
SELECT 'Perfiles creados:' as info;
SELECT 
  p.name,
  p.age,
  p.title,
  p.category,
  u.email
FROM public.profiles p
JOIN public.users u ON u.id = p.user_id
WHERE u.email IN ('carlos@deluxea.com', 'maria@deluxea.com');

SELECT '✅ Perfiles de ejemplo creados exitosamente' as mensaje;

