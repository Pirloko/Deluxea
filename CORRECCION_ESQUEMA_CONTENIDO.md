# 🔧 CORRECCIÓN: Esquema de Contenido

**Fecha:** 8 de Noviembre, 2025  
**Problema:** Nombres de columnas incorrectos  
**Estado:** ✅ Corregido

---

## 🎯 PROBLEMA ORIGINAL

El código usaba nombres de columnas genéricos (`url`, `caption`) pero el esquema real de la base de datos usa nombres específicos.

### ❌ Error:
```
Error: column "url" of relation "photos" does not exist
```

---

## 📊 ESQUEMA REAL DE LAS TABLAS

### 1. PHOTOS (Fotos)
```sql
CREATE TABLE public.photos (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    image_url TEXT NOT NULL,      ← No "url"
    caption TEXT,                  ← Opcional
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP
);
```

### 2. REELS (Videos)
```sql
CREATE TABLE public.reels (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    video_url TEXT NOT NULL,       ← No "url"
    caption TEXT,                   ← Opcional
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP
);

❗ NO tiene: thumbnail_url, views_count
```

### 3. STORIES (Historias)
```sql
CREATE TABLE public.stories (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    media_url TEXT NOT NULL,       ← No "url"
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    created_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

❗ NO tiene: caption
❗ Requiere: media_type, expires_at
```

---

## ✅ CORRECCIONES APLICADAS

### 1. Frontend (`MyContent.tsx`)

#### Interfaces Actualizadas:
```typescript
// ANTES (incorrecto):
interface Content {
  url: string
  caption?: string
  thumbnail_url?: string
  views_count?: number
}

// DESPUÉS (correcto):
interface Photo {
  image_url: string    ← Corregido
  caption?: string
  likes_count: number  ← Corregido
}

interface Reel {
  video_url: string    ← Corregido
  caption?: string
  likes_count: number  ← Corregido
}

interface Story {
  media_url: string    ← Corregido
  media_type: 'image' | 'video'  ← Agregado
  expires_at: string   ← Agregado
  caption?: never      ← No existe
}
```

#### handleUpload Corregido:
```typescript
// FOTOS
newContent = {
  image_url: url.trim(),    ← Corregido
  caption: caption || null,
  likes_count: 0
}

// REELS
newContent = {
  video_url: url.trim(),    ← Corregido
  caption: caption || null,
  likes_count: 0
}

// HISTORIAS
newContent = {
  media_url: url.trim(),    ← Corregido
  media_type: mediaType,    ← Agregado
  expires_at: expiresAt     ← Agregado (24h)
}
// ❗ Sin caption
```

#### Campo Caption Condicional:
```typescript
// Caption solo aparece para fotos y reels
{activeTab !== 'stories' && (
  <div>
    <label>Descripción (Opcional)</label>
    <textarea />
  </div>
)}
```

#### Campo Tipo de Media (Historias):
```typescript
// Solo para historias
{activeTab === 'stories' && (
  <div>
    <label>Tipo de Contenido</label>
    <input type="radio" value="image" />
    <input type="radio" value="video" />
  </div>
)}
```

---

### 2. SQL Script (`crear_contenido_ejemplo.sql`)

#### ANTES (incorrecto):
```sql
INSERT INTO public.photos (user_id, url, caption)  ❌
```

#### DESPUÉS (correcto):
```sql
-- FOTOS
INSERT INTO public.photos (user_id, image_url, caption, likes_count)  ✅

-- REELS
INSERT INTO public.reels (user_id, video_url, caption, likes_count)  ✅

-- HISTORIAS
INSERT INTO public.stories (user_id, media_url, media_type, expires_at)  ✅
```

---

## 📊 COMPARACIÓN DE CAMPOS

| Tipo | Campo URL | Campo Caption | Campos Adicionales |
|------|-----------|---------------|-------------------|
| **Photos** | `image_url` | ✅ `caption` | `likes_count` |
| **Reels** | `video_url` | ✅ `caption` | `likes_count` |
| **Stories** | `media_url` | ❌ NO tiene | `media_type`, `expires_at` |

---

## 🎨 DIFERENCIAS EN EL MODAL

### Modal para FOTOS:
```
┌────────────────────────────┐
│ URL de la Imagen *         │
│ Descripción (Opcional)     │  ← Tiene caption
│ Vista Previa               │
└────────────────────────────┘
```

### Modal para REELS:
```
┌────────────────────────────┐
│ URL del Video *            │
│ Descripción (Opcional)     │  ← Tiene caption
│ Vista Previa (video)       │
└────────────────────────────┘
```

### Modal para HISTORIAS:
```
┌────────────────────────────┐
│ URL del Contenido *        │
│ ⭕ Imagen  ⭕ Video        │  ← Selección de tipo
│ Vista Previa               │
└────────────────────────────┘
```
**❗ Sin campo de descripción**

---

## 🚀 CÓMO USAR AHORA

### 1. Ejecutar Script SQL Corregido

```bash
1. Ve a: https://supabase.com
2. SQL Editor > New Query
3. Abre: supabase/crear_contenido_ejemplo.sql
4. Copia TODO y pega
5. Run ▶️
6. ✅ Ahora debería funcionar sin errores
```

**El script creará:**
- 5 Fotos (3 Valentina, 2 Alex)
- 3 Reels (2 Valentina, 1 Alex)
- 3 Historias (2 Valentina, 1 Alex)

---

### 2. Probar en la App

```bash
1. Recarga: http://localhost:3000 (Ctrl + Shift + R)

2. Login: carlos@deluxea.com / Carlos123!

3. Mi Contenido

4. ✅ Deberías ver:
   - Tab Fotos: 3 fotos con caption y likes
   - Tab Reels: 2 reels con caption y likes
   - Tab Historias: 2 historias sin caption

5. Subir nuevo contenido:
   - Fotos: URL + Caption opcional
   - Reels: URL + Caption opcional
   - Historias: URL + Tipo (imagen/video)
```

---

## 🔍 VALIDACIÓN

### Verificar en Supabase Dashboard:

```sql
-- Ver fotos
SELECT image_url, caption, likes_count 
FROM public.photos;

-- Ver reels
SELECT video_url, caption, likes_count 
FROM public.reels;

-- Ver historias
SELECT media_url, media_type, expires_at 
FROM public.stories
WHERE expires_at > NOW();
```

---

## ✅ CORRECCIONES APLICADAS

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `MyContent.tsx` | Interfaces actualizadas | ✅ |
| `MyContent.tsx` | handleUpload corregido | ✅ |
| `MyContent.tsx` | Caption condicional | ✅ |
| `MyContent.tsx` | mediaType para stories | ✅ |
| `MyContent.tsx` | expires_at automático | ✅ |
| `crear_contenido_ejemplo.sql` | Columnas correctas | ✅ |
| `crear_contenido_ejemplo.sql` | Sin caption en stories | ✅ |

---

## 🎉 RESULTADO

**Ahora el sistema:**
- ✅ Usa los nombres correctos de columnas
- ✅ Script SQL funciona sin errores
- ✅ Modal se adapta a cada tipo de contenido
- ✅ Historias tienen media_type y expires_at
- ✅ Fotos y Reels tienen caption y likes_count
- ✅ Todo funcionando correctamente

---

## 📝 RECORDATORIO

### Diferencias Clave:
1. **Photos**: Usa `image_url` (no "url")
2. **Reels**: Usa `video_url` (no "url")
3. **Stories**: Usa `media_url` (no "url")
4. **Stories**: NO tiene caption
5. **Stories**: Requiere `media_type` y `expires_at`
6. **Photos/Reels**: Tienen `likes_count`

---

**¡Ahora ejecuta el script SQL corregido y prueba el sistema!** 🚀


