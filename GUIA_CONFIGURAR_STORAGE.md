# 📦 GUÍA: Configurar Supabase Storage

**Objetivo:** Permitir subida real de archivos desde móviles/tablets  
**Tiempo estimado:** 10-15 minutos  
**Estado:** ⚠️ CRÍTICO - Necesario para que funcione

---

## 🎯 ¿QUÉ VAMOS A HACER?

Configurar Supabase Storage para que los usuarios puedan:
- 📸 Tomar fotos con la cámara y subirlas
- 🎥 Grabar videos y subirlos
- 📱 Seleccionar archivos de su galería
- ☁️ Almacenarlos en la nube (Supabase)

---

## 📋 PASO A PASO

### PASO 1: Ir a Supabase Dashboard (2 min)

```bash
1. Abre: https://supabase.com
2. Inicia sesión
3. Selecciona tu proyecto: ryjwlwrwxyosmnhsmmma
4. En el menú lateral izquierdo, click en: "Storage"
```

---

### PASO 2: Crear los Buckets (5 min)

Un "bucket" es como una carpeta donde se almacenan los archivos.

#### Crear Bucket 1: **photos**
```
1. Click en "Create a new bucket"
2. Name: photos
3. Public bucket: ✅ (activado)
4. Click "Create bucket"
```

#### Crear Bucket 2: **reels**
```
1. Click en "Create a new bucket"
2. Name: reels
3. Public bucket: ✅ (activado)
4. Click "Create bucket"
```

#### Crear Bucket 3: **stories**
```
1. Click en "Create a new bucket"
2. Name: stories
3. Public bucket: ✅ (activado)
4. Click "Create bucket"
```

#### Crear Bucket 4: **avatars**
```
1. Click en "Create a new bucket"
2. Name: avatars
3. Public bucket: ✅ (activado)
4. Click "Create bucket"
```

**✅ Deberías tener 4 buckets creados**

---

### PASO 3: Configurar Políticas de Seguridad (5 min)

```bash
1. En Supabase, ve a: SQL Editor
2. Click en: New Query
3. Abre el archivo: supabase/configurar_storage.sql
4. Copia TODO el contenido
5. Pégalo en el SQL Editor
6. Click en Run ▶️
7. Espera el mensaje: ✅ Políticas de Storage creadas
```

**Esto configura los permisos para que:**
- Todos puedan VER los archivos
- Solo el dueño pueda SUBIR/ELIMINAR sus archivos

---

### PASO 4: Verificar Configuración (2 min)

```bash
1. En Supabase Storage, click en cada bucket
2. Click en "Policies" (arriba a la derecha)
3. Deberías ver 3 políticas por bucket:
   - Public Access (SELECT)
   - Authenticated users can upload (INSERT)
   - Users can delete own... (DELETE)
```

---

### PASO 5: Probar en la App (3 min)

```bash
1. Recarga: http://localhost:3000 (Ctrl + Shift + R)
2. Login: carlos@deluxea.com / Carlos123!
3. Ve a: Mi Contenido
4. Click: + Subir Contenido
5. Verás opciones:
   ┌────────────────────────────────┐
   │ [📤 Seleccionar archivo]       │
   │ [📷 Tomar foto con cámara]     │
   └────────────────────────────────┘
6. ¡Pruébalo! 🎉
```

---

## 📱 NUEVO SISTEMA DE SUBIDA

### Antes (No funcionaba):
```
❌ Solo aceptaba URLs
❌ No podías tomar fotos
❌ No podías subir desde galería
❌ Inútil en móviles
```

### Ahora (Funcional):
```
✅ Toma fotos con la cámara
✅ Selecciona de galería
✅ Sube archivos reales a la nube
✅ Preview antes de subir
✅ Barra de progreso
✅ Compresión automática de imágenes
✅ Perfecto para móviles
```

---

## 🎨 INTERFAZ OPTIMIZADA PARA MÓVILES

### Modal de Subida (Sin archivo):

```
┌───────────────────────────────────┐
│ Subir Fotos                  [X]  │
├───────────────────────────────────┤
│                                   │
│   ┌─────────────────────────┐    │
│   │    📤 Subir             │    │
│   │                         │    │
│   │  Click para seleccionar │    │
│   │  Desde tu galería       │    │
│   └─────────────────────────┘    │
│                                   │
│   ┌─────────────────────────┐    │
│   │    📷 Cámara            │    │
│   │                         │    │
│   │  Tomar Foto             │    │
│   └─────────────────────────┘    │
│                                   │
└───────────────────────────────────┘
```

### Modal de Subida (Con archivo):

```
┌───────────────────────────────────┐
│ Subir Fotos                  [X]  │
├───────────────────────────────────┤
│                                   │
│  Vista Previa              [X]    │
│  ┌─────────────────────────┐     │
│  │                         │     │
│  │   [Preview imagen]      │     │
│  │                         │     │
│  └─────────────────────────┘     │
│                                   │
│  Archivo: foto.jpg                │
│  Tamaño: 2.4 MB                   │
│                                   │
│  Descripción (Opcional)           │
│  ┌─────────────────────────┐     │
│  │ Mi nueva foto...        │     │
│  └─────────────────────────┘     │
│                                   │
│  Subiendo... 75%                  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 75%       │
│                                   │
│  [Cancelar]        [Subir]        │
└───────────────────────────────────┘
```

---

## 🎯 CARACTERÍSTICAS DEL NUEVO SISTEMA

### 1. 📷 Captura Directa con Cámara
```html
<input 
  type="file" 
  accept="image/*" 
  capture="environment"  ← Abre cámara
/>
```
**En móviles:** Abre la cámara directamente  
**En desktop:** Permite seleccionar archivo

---

### 2. 📱 Optimizado para Móviles
- Botones grandes y táctiles
- Interfaz simple y clara
- Cámara frontal/trasera
- Galería del dispositivo

---

### 3. 🗜️ Compresión Automática
```typescript
// Imágenes se comprimen antes de subir:
- Redimensiona a máx 1920px
- Calidad: 85%
- Reduce tamaño ~70%
- Sube más rápido
```

---

### 4. 📊 Barra de Progreso
```
Subiendo...
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ 75%

Estados:
0%   → Inicio
20%  → Comprimiendo
40%  → Subiendo a Storage
70%  → Guardando en BD
100% → Completado
```

---

### 5. ✅ Validaciones Automáticas
- Tipo de archivo (solo imágenes/videos permitidos)
- Tamaño máximo (10MB fotos, 100MB videos)
- Preview antes de subir
- Manejo de errores claro

---

## 📊 LÍMITES Y VALIDACIONES

### Fotos:
```
Tipos: JPG, PNG, GIF, WEBP
Tamaño máx: 10 MB
Compresión: Sí (automática)
Redimensión: Máx 1920px ancho
```

### Reels (Videos):
```
Tipos: MP4, MOV, WEBM
Tamaño máx: 100 MB
Compresión: No (muy lento)
Duración: Sin límite (recomendado: <60s)
```

### Historias:
```
Imágenes: JPG, PNG, GIF, WEBP (máx 10 MB)
Videos: MP4, MOV, WEBM (máx 100 MB)
Expiración: Automática 24h
```

---

## 🚀 FLUJO COMPLETO DE SUBIDA

### Desde Móvil:

```
1. Usuario abre app en móvil
   ↓
2. Mi Contenido > Subir Contenido
   ↓
3. Ve opciones:
   - [📤 Galería]
   - [📷 Tomar Foto]
   ↓
4. Toca "Tomar Foto"
   ↓
5. Se abre cámara nativa del móvil
   ↓
6. Toma la foto
   ↓
7. Preview en pantalla
   ↓
8. Agrega descripción (opcional)
   ↓
9. Toca "Subir"
   ↓
10. Barra de progreso:
    - 20%: Comprimiendo...
    - 40%: Subiendo...
    - 70%: Guardando...
    - 100%: ¡Listo!
   ↓
11. Foto aparece en galería
```

---

## 🔧 TROUBLESHOOTING

### Problema 1: "Bucket does not exist"

**Solución:**
```
1. Ve a Supabase Storage
2. Verifica que creaste los 4 buckets:
   - photos
   - reels
   - stories
   - avatars
3. Nombres EXACTOS (minúsculas, sin espacios)
```

---

### Problema 2: "Unauthorized"

**Solución:**
```
1. Ejecuta el script: configurar_storage.sql
2. Verifica las políticas en cada bucket
3. Debe haber al menos 3 políticas por bucket
```

---

### Problema 3: Cámara no abre en desktop

**Solución:**
```
Es normal. En desktop:
- No hay cámara integrada (mayoría)
- El botón "Tomar Foto" abrirá selector de archivos
- En móviles SÍ abre la cámara
```

---

### Problema 4: Archivo muy grande

**Solución:**
```
- Fotos: Máx 10 MB
- Videos: Máx 100 MB
- El sistema muestra error si excede
- Comprime manualmente antes de subir
- O usa app de compresión
```

---

## 📱 EXPERIENCIA EN DIFERENTES DISPOSITIVOS

### iPhone/iPad:
```
Botón "Tomar Foto":
→ Abre cámara nativa iOS
→ Frontal/Trasera disponible
→ Flash, HDR, etc.
→ Retorno automático a app

Botón "Seleccionar":
→ Abre Photos app
→ Múltiples fuentes (Galería, iCloud, etc.)
```

### Android:
```
Botón "Tomar Foto":
→ Abre cámara nativa Android
→ Todas las funciones de cámara
→ Retorno automático

Botón "Seleccionar":
→ Abre Google Photos o galería
→ Múltiples fuentes disponibles
```

### Desktop/Laptop:
```
Botón "Tomar Foto":
→ Si tiene webcam, la activa
→ Si no, selector de archivos

Botón "Seleccionar":
→ Explorador de archivos normal
→ Arrastra y suelta (futuro)
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

Antes de probar, verifica que completaste:

- [ ] Creado bucket "photos" (público)
- [ ] Creado bucket "reels" (público)
- [ ] Creado bucket "stories" (público)
- [ ] Creado bucket "avatars" (público)
- [ ] Ejecutado script configurar_storage.sql
- [ ] Verificado políticas en cada bucket
- [ ] Recargado el frontend (Ctrl + Shift + R)
- [ ] Probado subida desde móvil/desktop

---

## 🎯 RESULTADO ESPERADO

### Después de configurar:

**Usuario desde móvil:**
```
1. Abre app
2. Mi Contenido
3. Toca "Subir Contenido"
4. Toca "📷 Tomar Foto"
5. 📸 Cámara se abre
6. Toma foto
7. Ve preview
8. Agrega descripción
9. Toca "Subir"
10. ✅ Foto se sube a Supabase
11. ✅ Aparece en su galería
12. ✅ Visible para todos
```

**Usuario desde desktop:**
```
1. Abre app
2. Mi Contenido
3. Click "Subir Contenido"
4. Click "Seleccionar archivo"
5. Selecciona archivo
6. Ve preview
7. Agrega descripción
8. Click "Subir"
9. ✅ Archivo se sube
10. ✅ Aparece en galería
```

---

## 🔐 SEGURIDAD

Las políticas configuradas garantizan:

```
✅ Todos pueden VER el contenido (público)
✅ Solo usuarios autenticados pueden SUBIR
✅ Solo el dueño puede ELIMINAR su contenido
✅ Archivos organizados por user_id
✅ URLs públicas generadas automáticamente
```

---

## 📊 ESTRUCTURA DE ALMACENAMIENTO

```
Supabase Storage/
├── photos/
│   ├── {user_id}/
│   │   ├── 1730000001_abc123.jpg
│   │   ├── 1730000002_def456.jpg
│   │   └── 1730000003_ghi789.jpg
│   └── {otro_user_id}/
│       └── ...
│
├── reels/
│   ├── {user_id}/
│   │   ├── 1730000001_xyz.mp4
│   │   └── 1730000002_uvw.mp4
│   └── ...
│
├── stories/
│   └── {user_id}/
│       └── ...
│
└── avatars/
    └── {user_id}/
        └── avatar.jpg
```

---

## 💡 CARACTERÍSTICAS TÉCNICAS

### Compresión de Imágenes:
```typescript
Imagen original: 5 MB (4000x3000px)
     ↓
Procesamiento:
- Redimensiona a 1920px ancho
- Calidad JPEG 85%
     ↓
Imagen final: 1.5 MB (1920x1440px)
     ↓
Sube 70% más rápido ✅
```

### Generación de Nombres:
```typescript
// Formato: {userId}/{timestamp}_{random}.{ext}
// Ejemplo: 394d3288.../1730577421_abc123.jpg

Ventajas:
- Único (no hay colisiones)
- Organizado por usuario
- Fácil de rastrear
```

### URLs Públicas:
```
https://ryjwlwrwxyosmnhsmmma.supabase.co/storage/v1/object/public/photos/394d3288.../file.jpg

✅ Accesible desde cualquier lugar
✅ CDN de Supabase (rápido)
✅ HTTPS seguro
```

---

## 🧪 PRUEBAS RECOMENDADAS

### Test 1: Foto desde Cámara (Móvil)
```
1. Abre app en móvil
2. Mi Contenido > Subir
3. Toca "Tomar Foto"
4. Cámara se abre
5. Toma foto
6. Preview aparece
7. Descripción: "Test desde cámara"
8. Subir
9. ✅ Debe funcionar
```

### Test 2: Foto desde Galería
```
1. Subir Contenido
2. "Seleccionar archivo"
3. Elige foto de galería
4. Preview
5. Subir
6. ✅ Debe funcionar
```

### Test 3: Video Reel
```
1. Tab Reels
2. Subir Contenido
3. "Grabar Video" o "Seleccionar"
4. Selecciona video
5. Preview de video
6. Subir
7. ✅ Debe funcionar
```

### Test 4: Historia
```
1. Tab Historias
2. Tipo: Imagen
3. Tomar foto
4. Subir
5. ✅ Aparece en historias
6. ✅ Expira en 24h automáticamente
```

---

## ⚠️ IMPORTANTE

### Buckets DEBEN ser públicos:
```
Al crear cada bucket, marca:
✅ Public bucket: SÍ

Si no:
❌ Las imágenes no se verán en la app
❌ Error de permisos
```

### Nombres exactos:
```
✅ photos (minúscula, plural)
✅ reels (minúscula, plural)
✅ stories (minúscula, plural)
✅ avatars (minúscula, plural)

❌ Photos (mayúscula)
❌ photo (singular)
❌ fotos (español)
```

---

## 🎉 BENEFICIOS DEL SISTEMA

### Para Usuarios:
1. ✅ **Fácil:** Solo toma foto y sube
2. ✅ **Rápido:** Compresión automática
3. ✅ **Intuitivo:** Como Instagram/TikTok
4. ✅ **Confiable:** Preview antes de subir
5. ✅ **Seguro:** Solo tú puedes eliminar tus archivos

### Para el Proyecto:
1. ✅ **Escalable:** Storage ilimitado (Supabase)
2. ✅ **Rápido:** CDN global
3. ✅ **Económico:** Free tier: 1GB
4. ✅ **Seguro:** Políticas RLS
5. ✅ **Profesional:** Sistema completo

---

## 💰 COSTOS DE SUPABASE STORAGE

### Free Tier:
```
- 1 GB de almacenamiento
- 2 GB de ancho de banda/mes
- Suficiente para: ~1,000 fotos o ~20 videos
```

### Pro Plan ($25/mes):
```
- 100 GB de almacenamiento
- 200 GB de ancho de banda/mes
- Suficiente para: ~100,000 fotos o ~2,000 videos
```

---

## 📝 PRÓXIMOS PASOS

### 1. Configurar Storage (AHORA)
```
- Crear 4 buckets
- Ejecutar script SQL
- Probar subida
```

### 2. Mejorar UI (Opcional)
```
- Drag & drop
- Múltiples archivos
- Editor de fotos
- Filtros estilo Instagram
```

### 3. Optimizaciones (Futuro)
```
- Thumbnails automáticos
- Lazy loading
- Infinite scroll
- Cache de imágenes
```

---

## ✅ RESUMEN

**ANTES:** Sistema con URLs (no funcional en móviles)  
**AHORA:** Sistema con cámara y galería (perfecto para móviles)

**CONFIGURACIÓN REQUERIDA:**
1. Crear 4 buckets en Supabase Storage
2. Ejecutar script configurar_storage.sql
3. Recargar frontend

**TIEMPO TOTAL:** 10-15 minutos

**RESULTADO:** Sistema 100% funcional para subir contenido desde móviles 📱✨

---

**¡Sigue los pasos y tendrás subida real de archivos funcionando!** 🚀


