# 🔧 SOLUCIÓN: No se visualizan los dashboards

## 🎯 PROBLEMA IDENTIFICADO

Los dashboards no se visualizan debido a que **Row Level Security (RLS)** en Supabase está bloqueando las consultas. Los usuarios no tienen permisos para leer los datos de las tablas.

---

## ✅ SOLUCIÓN (5 minutos)

### Paso 1: Ir a Supabase Dashboard

1. Abre tu navegador
2. Ve a: **https://supabase.com**
3. Inicia sesión
4. Selecciona tu proyecto: **ryjwlwrwxyosmnhsmmma**

### Paso 2: Abrir SQL Editor

1. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
2. Haz clic en **"New Query"**

### Paso 3: Ejecutar el Script de Políticas

1. Abre el archivo: **`supabase/fix_rls_policies.sql`**
2. **Copia TODO el contenido** del archivo
3. **Pégalo** en el SQL Editor de Supabase
4. Haz clic en el botón **"Run"** (▶️) en la esquina inferior derecha
5. Espera unos segundos

### Paso 4: Verificar

Deberías ver un mensaje: `Políticas de RLS configuradas correctamente ✅`

---

## 🧪 PROBAR QUE FUNCIONA

### 1. Recargar el Frontend

```bash
# En tu navegador, ve a:
http://localhost:3000

# Presiona: Ctrl + Shift + R (Windows) o Cmd + Shift + R (Mac)
# Esto hace un hard refresh
```

### 2. Iniciar Sesión

Usa las credenciales del archivo `CREDENCIALES_PRUEBA.md`:

**Para probar Admin:**
```
Email: admin@deluxea.com
Password: Admin123!
```

Después de login, deberías ver:
- ✅ Dashboard de Admin
- ✅ Estadísticas de usuarios
- ✅ Acceso a todas las páginas

**Para probar Profile User:**
```
Email: carlos@deluxea.com
Password: Carlos123!
```

Deberías ver:
- ✅ Dashboard de Usuario
- ✅ Estadísticas personales
- ✅ Opciones de editar perfil

**Para probar Visitante:**
```
Email: visitor@deluxea.com
Password: Visitor123!
```

Deberías ver:
- ✅ Dashboard de Visitante
- ✅ Favoritos
- ✅ Créditos

---

## 🔍 DIAGNÓSTICO ADICIONAL

Si después de ejecutar el script **AÚN NO FUNCIONA**, verifica lo siguiente:

### 1. Abrir Consola del Navegador

1. En el navegador (con http://localhost:3000 abierto)
2. Presiona **F12** (Windows) o **Cmd + Option + I** (Mac)
3. Ve a la pestaña **"Console"**
4. Intenta hacer login
5. ¿Ves errores en rojo? Copia y pégamelos

### 2. Verificar que el Backend esté corriendo

```powershell
# Intenta acceder a:
http://localhost:8000/health

# Deberías ver:
{"status":"healthy"}
```

Si no funciona, reinicia el backend:
```powershell
cd C:\Users\jacqu\Downloads\Deluxea-main\backend
.\venv\Scripts\Activate.ps1
python main.py
```

### 3. Verificar que el Frontend esté corriendo

```powershell
# Deberías ver la app en:
http://localhost:3000

# Si no abre, reinicia el frontend:
cd C:\Users\jacqu\Downloads\Deluxea-main\frontend
npm run dev
```

### 4. Verificar Variables de Entorno

```powershell
cd frontend
Get-Content .env

# Deberías ver:
# VITE_SUPABASE_URL=https://ryjwlwrwxyosmnhsmmma.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
# VITE_API_URL=http://localhost:8000
```

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### Error: "JWT expired" o "Invalid token"

**Solución:**
```powershell
# Cierra sesión y vuelve a iniciar
# O limpia el Local Storage del navegador:
# F12 > Application > Local Storage > Clear
```

### Error: "Policy violation" o "RLS error"

**Solución:**
```
Ejecuta nuevamente el script fix_rls_policies.sql en Supabase
```

### Error: "Network error" o "Failed to fetch"

**Solución:**
```powershell
# Verifica que backend y frontend estén corriendo
# Backend: http://localhost:8000/health
# Frontend: http://localhost:3000
```

### No aparece nada después de login

**Solución:**
```
1. Abre F12 > Console
2. Busca errores en rojo
3. Si dice "can't read from table users":
   - El script RLS no se ejecutó correctamente
   - Ejecuta fix_rls_policies.sql de nuevo
```

---

## 📋 QUÉ HACE EL SCRIPT RLS

El script `fix_rls_policies.sql` crea políticas de seguridad que permiten:

### Para TODOS los usuarios:
- ✅ Leer su propia información
- ✅ Ver perfiles públicos
- ✅ Ver regalos disponibles
- ✅ Ver contenido (stories, reels, photos)
- ✅ Dar likes y comentar

### Para ADMIN:
- ✅ Ver TODOS los usuarios
- ✅ Gestionar usuarios
- ✅ Gestionar regalos
- ✅ Gestionar membresías

### Para PROFILE_USER:
- ✅ Crear/editar su perfil
- ✅ Subir contenido
- ✅ Ver sus regalos recibidos
- ✅ Ver sus estadísticas

### Para VISITOR:
- ✅ Enviar regalos
- ✅ Gestionar favoritos
- ✅ Gestionar créditos
- ✅ Escribir reseñas

---

## ✅ VERIFICACIÓN FINAL

Después de ejecutar el script, verifica que puedes:

- [ ] Iniciar sesión con `admin@deluxea.com`
- [ ] Ver el dashboard de admin
- [ ] Ver la lista de usuarios en `/admin/users`
- [ ] Iniciar sesión con `carlos@deluxea.com`
- [ ] Ver el dashboard de usuario
- [ ] Acceder a editar perfil
- [ ] Iniciar sesión con `visitor@deluxea.com`
- [ ] Ver el dashboard de visitante
- [ ] Ver favoritos y créditos

---

## 🆘 SI NADA FUNCIONA

Si después de todo esto aún no funciona:

1. **Copia el error exacto** de la consola del navegador (F12)
2. **Envíame una captura** del error
3. **Dime qué usuario** estás usando para login
4. **Verifica** que ejecutaste el script en Supabase correctamente

---

## 📞 PRÓXIMOS PASOS

Una vez que los dashboards funcionen:

1. ✅ Prueba enviar un regalo entre usuarios
2. ✅ Prueba crear contenido (aunque el upload no funcionará aún)
3. ✅ Explora todas las páginas
4. ✅ Verifica que cada rol vea lo correcto

---

**Creado:** 8 de Noviembre, 2025  
**Archivo de script:** `supabase/fix_rls_policies.sql`  
**Usuarios de prueba:** `CREDENCIALES_PRUEBA.md`


