# 🚀 Instrucciones Rápidas - Configuración Final

## ⚠️ PASO IMPORTANTE: Obtener JWT Secret

Antes de continuar, necesitas obtener el **JWT Secret** de Supabase:

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/ryjwlwrwxyosmnhsmmma
2. Ve a **Settings** (⚙️) → **API** 
3. Busca la sección **JWT Settings**
4. Copia el valor de **JWT Secret** (una cadena larga)
5. Abre el archivo `backend/.env`
6. Reemplaza `PENDIENTE_OBTENER_DEL_DASHBOARD` con el JWT Secret que copiaste

**Ejemplo:**
```env
SUPABASE_JWT_SECRET=tu-jwt-secret-muy-largo-aqui
```

---

## 📝 Ya está TODO configurado, solo ejecuta:

### 1. Instalar Backend (primera vez)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Instalar Frontend (primera vez)

```bash
cd frontend
npm install
```

### 3. Iniciar Backend

**Terminal 1:**
```bash
cd backend
source venv/bin/activate
python3 main.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 4. Iniciar Frontend

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Deberías ver:
```
➜  Local:   http://localhost:3000/
```

---

## 🎯 Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

---

## 👤 Crear Usuario Admin

### Opción 1: Via API (Más Fácil)

1. Ve a http://localhost:8000/docs
2. Busca `POST /api/v1/users`
3. Click "Try it out"
4. Pega este JSON:

```json
{
  "email": "admin@deluxea.com",
  "password": "Admin123!",
  "role": "admin",
  "is_active": true,
  "must_change_password": false
}
```

5. Click "Execute"

### Opción 2: Via Supabase Dashboard

1. Ve a https://supabase.com/dashboard/project/ryjwlwrwxyosmnhsmmma
2. **Authentication** → **Users** → **Add user**
3. Email: `admin@deluxea.com`
4. Password: `Admin123!`
5. Confirmar email automáticamente ✅
6. Copiar el User ID generado
7. **Table Editor** → **users** → **Insert row**:
   - id: (el que copiaste)
   - email: `admin@deluxea.com`
   - role: `admin`
   - is_active: `true`
   - must_change_password: `false`

---

## ✅ Iniciar Sesión

1. Ve a http://localhost:3000/login
2. Email: `admin@deluxea.com`
3. Password: `Admin123!`
4. ¡Listo! Verás el panel de admin 🎉

---

## 🔍 Verificar Instalación

```bash
python3 check-setup.py
```

---

## 📱 Próximos Pasos

1. ✅ Explora el panel de administración
2. ✅ Crea usuarios de prueba
3. ✅ Prueba las funcionalidades
4. ✅ Personaliza el diseño

---

## ❓ Problemas Comunes

### "Module not found" en Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "Module not found" en Frontend
```bash
cd frontend
rm -rf node_modules
npm install
```

### Error de CORS
Verifica que `backend/.env` tenga:
```
CORS_ORIGINS=http://localhost:3000
```

---

## 🎉 ¡Todo Listo!

Solo falta:
1. ⚠️ Obtener el JWT Secret (pasos arriba)
2. ▶️ Ejecutar los comandos
3. 🎊 ¡Disfrutar de Deluxea!

