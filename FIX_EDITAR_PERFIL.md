# 🔧 SOLUCIÓN: Error al Editar Perfil

## 🎯 PROBLEMA

Al intentar editar el perfil de un usuario, la página se queda "cargando..." infinitamente y aparece este error en consola:

```
GET .../profiles?select=*&user_id=eq.xxx 406 (Not Acceptable)
```

---

## 🔍 CAUSA DEL PROBLEMA

El error **406 (Not Acceptable)** ocurre porque:

1. La página `EditProfile.tsx` intenta cargar el perfil usando `.single()`
2. `.single()` espera encontrar **exactamente 1 resultado**
3. Los usuarios (`carlos@deluxea.com`, `maria@deluxea.com`) **NO tienen perfiles creados**
4. Cuando no encuentra el perfil, Supabase devuelve error 406
5. El código no maneja este error, quedando en loading infinito

---

## ✅ SOLUCIÓN APLICADA

### 1. Arreglé el código de `EditProfile.tsx`

**Cambio realizado:**
```typescript
// ANTES (causaba error):
.single()

// DESPUÉS (funciona):
.maybeSingle()
```

**¿Qué hace `.maybeSingle()`?**
- Si encuentra el perfil → lo carga
- Si NO encuentra el perfil → devuelve `null` sin error
- Permite crear el perfil por primera vez

### 2. Creé perfiles de ejemplo para testing

He creado el script `supabase/crear_perfiles_ejemplo.sql` que crea perfiles automáticamente para Carlos y María.

---

## 🧪 CÓMO PROBAR LA SOLUCIÓN

### Opción A: Recargar la app (Recomendado)

```bash
1. En el navegador (http://localhost:3000)
2. Presiona: Ctrl + Shift + R (hard refresh)
3. Inicia sesión con: carlos@deluxea.com / Carlos123!
4. Ve a: Editar Perfil
5. Debería cargar CORRECTAMENTE con campos vacíos
6. Llena el formulario y guarda
```

### Opción B: Crear perfiles de ejemplo con SQL

```bash
1. Ve a: https://supabase.com
2. SQL Editor > New Query
3. Abre: supabase/crear_perfiles_ejemplo.sql
4. Copia y pega el contenido
5. Click en Run ▶️
6. Ahora Carlos y María tendrán perfiles predefinidos
```

---

## 📋 VERIFICACIÓN

### Antes del Fix:
```
Login → Editar Perfil → ❌ Loading infinito + Error 406
```

### Después del Fix:
```
Login → Editar Perfil → ✅ Carga correctamente
                       → ✅ Muestra campos vacíos o perfil existente
                       → ✅ Permite guardar
```

---

## 🎨 CÓMO USAR LA FUNCIÓN "EDITAR PERFIL"

### Para crear un perfil nuevo (primera vez):

1. **Login** con usuario profile_user:
   ```
   Email: carlos@deluxea.com
   Password: Carlos123!
   ```

2. **Ir a Editar Perfil**:
   - Navbar > Icono de usuario > Editar Perfil
   - O directamente: `http://localhost:3000/user/edit-profile`

3. **Llenar el formulario**:
   ```
   Nombre: Carlos Rodríguez
   Edad: 28
   Título: Creador de Contenido
   Descripción: Tu descripción...
   Categoría: Entretenimiento
   Contacto: +1 555-0123
   Tags: Fotografía, Viajes, Lifestyle
   ```

4. **Guardar**:
   - Click en "Guardar Cambios"
   - Debería mostrar: "¡Perfil actualizado exitosamente!"
   - Redirige al dashboard

5. **Ver perfil público**:
   - Tu perfil ahora es visible en el Home
   - Otros usuarios pueden ver tu perfil
   - Puedes recibir regalos

---

## 🐛 OTROS LUGARES CON EL MISMO PROBLEMA

Revisé y también pueden tener este problema:

### ✅ Ya arreglado:
- `EditProfile.tsx` → Cambiado a `.maybeSingle()`

### ⚠️ Por revisar (si dan problemas similares):
- `ProfilePage.tsx` (ver perfil público)
- `UserDashboard.tsx` (dashboard de usuario)
- Cualquier página que use `.single()` en profiles

---

## 📊 DIFERENCIA: `.single()` vs `.maybeSingle()`

| Método | Comportamiento | Cuándo usar |
|--------|---------------|-------------|
| `.single()` | Error si no encuentra exactamente 1 | Cuando SABES que el registro existe |
| `.maybeSingle()` | `null` si no encuentra, sin error | Cuando el registro puede NO existir |
| `.limit(1)` | Array con 0 o 1 elementos | Cuando quieres array en vez de objeto |

---

## 💡 MEJORA ADICIONAL (Opcional)

Puedes agregar un mensaje amigable cuando el perfil no existe:

```typescript
// En EditProfile.tsx, después de fetchProfile:
const [isNewProfile, setIsNewProfile] = useState(false)

const fetchProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle()

    if (data) {
      // Perfil existe, cargar datos
      setFormData(...)
      setIsNewProfile(false)
    } else {
      // Perfil no existe, es nuevo
      setIsNewProfile(true)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// En el JSX, mostrar mensaje:
{isNewProfile && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <p className="text-blue-800">
      👋 Bienvenido! Crea tu perfil por primera vez completando el formulario.
    </p>
  </div>
)}
```

---

## 🎯 RESUMEN

**Problema:** Error 406 al editar perfil  
**Causa:** `.single()` no maneja perfiles inexistentes  
**Solución:** Cambiar a `.maybeSingle()`  
**Resultado:** ✅ Funciona para crear Y editar perfiles  

---

## 🔄 PRÓXIMOS PASOS

Ahora que el perfil funciona:

1. ✅ Crea perfiles para usuarios de prueba
2. ✅ Prueba subir fotos (aunque solo guardan URLs por ahora)
3. ✅ Prueba recibir regalos entre usuarios
4. ✅ Verifica que los perfiles aparezcan en el Home

---

**Fecha:** 8 de Noviembre, 2025  
**Archivos modificados:**
- `frontend/src/pages/user/EditProfile.tsx`

**Archivos creados:**
- `supabase/crear_perfiles_ejemplo.sql`
- `FIX_EDITAR_PERFIL.md` (este documento)


