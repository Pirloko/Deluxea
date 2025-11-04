# 🚀 Guía de Instalación Detallada - Deluxea

Esta guía te llevará paso a paso por la configuración completa del proyecto Deluxea.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Configuración del Backend](#configuración-del-backend)
4. [Configuración del Frontend](#configuración-del-frontend)
5. [Crear Usuario Administrador](#crear-usuario-administrador)
6. [Problemas Comunes](#problemas-comunes)

---

## 1. Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** 18.x o superior ([Descargar](https://nodejs.org/))
- **Python** 3.10 o superior ([Descargar](https://www.python.org/))
- **Git** ([Descargar](https://git-scm.com/))
- **Cuenta de Supabase** (Gratis en [supabase.com](https://supabase.com))

Verifica las instalaciones:
```bash
node --version   # debe mostrar v18.x.x o superior
python --version # debe mostrar 3.10.x o superior
git --version    # debe mostrar 2.x.x o superior
```

---

## 2. Configuración de Supabase

### Paso 1: Crear Proyecto

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en **"New Project"**
3. Completa los datos:
   - **Name**: Deluxea (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a ti
   - **Pricing Plan**: Free (para desarrollo)
4. Haz clic en **"Create new project"**
5. Espera 2-3 minutos mientras se crea el proyecto

### Paso 2: Ejecutar Migraciones

1. Una vez creado el proyecto, ve a **SQL Editor** en el menú lateral
2. Haz clic en **"New query"**
3. Copia todo el contenido del archivo `supabase/migrations/001_initial_schema.sql`
4. Pégalo en el editor
5. Haz clic en **"Run"** (abajo a la derecha)
6. Deberías ver el mensaje: **"Success. No rows returned"**

### Paso 3: Obtener Credenciales

1. Ve a **Project Settings** (ícono de engranaje en el menú lateral)
2. Selecciona **API** en el menú
3. Copia y guarda estas credenciales:

```
Project URL: https://tuproyecto.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (¡secreto!)
```

4. Ve a **Settings** > **Database**
5. En la sección **Connection string** > **URI**, copia el `JWT Secret`:

```
JWT Secret: tu-jwt-secret-aquí
```

---

## 3. Configuración del Backend

### Paso 1: Navegar al directorio

```bash
cd backend
```

### Paso 2: Crear entorno virtual

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**En Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Deberías ver `(venv)` al inicio de tu terminal.

### Paso 3: Instalar dependencias

```bash
pip install -r requirements.txt
```

Esto puede tardar 1-2 minutos.

### Paso 4: Configurar variables de entorno

1. Crea un archivo `.env` en el directorio `backend/`:

```bash
touch .env  # En Mac/Linux
type nul > .env  # En Windows (cmd)
```

2. Abre `.env` con tu editor favorito y agrega:

```env
# Supabase (obtenidas en el paso anterior)
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_KEY=tu_service_role_key_aquí
SUPABASE_JWT_SECRET=tu_jwt_secret_aquí

# JWT Configuration
JWT_SECRET_KEY=genera_un_secret_aleatorio_aquí_min_32_caracteres
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000

# API
API_V1_PREFIX=/api/v1
PROJECT_NAME=Deluxea API
```

**Importante:** Para `JWT_SECRET_KEY`, genera una clave aleatoria segura:

```bash
# En Python:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Paso 5: Iniciar el servidor

```bash
python main.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Visita `http://localhost:8000/docs` para ver la documentación de la API.

---

## 4. Configuración del Frontend

**Abre una nueva terminal** (deja el backend corriendo).

### Paso 1: Navegar al directorio

```bash
cd frontend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto puede tardar 2-3 minutos la primera vez.

### Paso 3: Configurar variables de entorno

1. Crea un archivo `.env` en el directorio `frontend/`:

```bash
touch .env  # En Mac/Linux
type nul > .env  # En Windows (cmd)
```

2. Abre `.env` y agrega:

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_public_key_aquí
VITE_API_URL=http://localhost:8000
```

### Paso 4: Iniciar el servidor de desarrollo

```bash
npm run dev
```

Deberías ver:
```
  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Visita `http://localhost:3000` para ver la aplicación.

---

## 5. Crear Usuario Administrador

Ahora que todo está corriendo, necesitas crear un usuario administrador.

### Opción 1: Usando la API (Recomendado)

1. Ve a `http://localhost:8000/docs`
2. Busca el endpoint `POST /api/v1/users`
3. Haz clic en **"Try it out"**
4. Usa este JSON (cambia el email y password):

```json
{
  "email": "admin@deluxea.com",
  "password": "admin123456",
  "role": "admin",
  "is_active": true,
  "must_change_password": false
}
```

5. Haz clic en **"Execute"**
6. Deberías ver una respuesta exitosa (código 201)

### Opción 2: Usando Supabase Dashboard

1. Ve a tu proyecto en Supabase
2. Navega a **Authentication** > **Users**
3. Haz clic en **"Add user"** > **"Create new user"**
4. Completa:
   - Email: `admin@deluxea.com`
   - Password: `admin123456` (o la que prefieras)
   - Confirma el email automáticamente
5. Haz clic en **"Create user"**
6. Copia el **User UID** que se genera
7. Ve a **Table Editor** > **users**
8. Haz clic en **"Insert"** > **"Insert row"**
9. Completa:
   - id: El User UID que copiaste
   - email: `admin@deluxea.com`
   - role: `admin`
   - is_active: `true`
   - must_change_password: `false`
10. Haz clic en **"Save"**

### Paso Final: Iniciar Sesión

1. Ve a `http://localhost:3000/login`
2. Ingresa las credenciales del admin
3. ¡Deberías tener acceso al panel de administración!

---

## 6. Problemas Comunes

### ❌ Error: "Module not found"

**Solución:**
```bash
# En frontend:
cd frontend
rm -rf node_modules package-lock.json
npm install

# En backend:
cd backend
pip install --upgrade -r requirements.txt
```

### ❌ Error de CORS en el navegador

**Solución:**
1. Verifica que en `backend/.env` tengas:
   ```
   CORS_ORIGINS=http://localhost:3000
   ```
2. Reinicia el servidor de backend

### ❌ "Supabase connection failed"

**Solución:**
1. Verifica que las URLs y Keys en `.env` estén correctas
2. Asegúrate de no tener espacios extra
3. Verifica que el proyecto de Supabase esté activo

### ❌ "Table does not exist"

**Solución:**
1. Ve a Supabase Dashboard > SQL Editor
2. Ejecuta nuevamente el script de migración
3. Verifica que todas las tablas se crearon en **Table Editor**

### ❌ El login no funciona

**Solución:**
1. Verifica que el usuario existe en **Authentication** > **Users**
2. Verifica que el usuario también existe en la tabla **users**
3. Asegúrate de que `is_active` sea `true`

---

## 🎉 ¡Listo!

Tu instalación de Deluxea está completa. Ahora puedes:

- ✅ Explorar el panel de administración
- ✅ Crear usuarios con perfil
- ✅ Registrar visitantes
- ✅ Subir contenido
- ✅ Gestionar regalos

Para más información, consulta el [README.md](README.md) principal.

---

## 📞 Necesitas Ayuda?

Si tienes problemas:
1. Revisa esta guía nuevamente
2. Verifica los logs de errores en la consola
3. Consulta la [documentación de Supabase](https://supabase.com/docs)
4. Contacta al equipo de desarrollo

---

<div align="center">

**¡Feliz desarrollo!** 🚀👑

[⬆ Volver al inicio](#-guía-de-instalación-detallada---deluxea)

</div>

