# 🚀 INICIAR DELUXEA - Todo Configurado

## ✅ Configuración Completa

**¡Todo está listo!** Tus credenciales están configuradas:

- ✅ Base de datos creada (14 tablas)
- ✅ Supabase configurado
- ✅ JWT Secret configurado
- ✅ Archivos .env creados
- ✅ 6 regalos virtuales insertados

---

## 📦 Paso 1: Instalar Dependencias

Ejecuta este comando para instalar todo automáticamente:

```bash
./instalar.sh
```

**O manualmente:**

### Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### Frontend:
```bash
cd frontend
npm install
cd ..
```

---

## ▶️ Paso 2: Iniciar los Servidores

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate
python3 main.py
```

**Deberías ver:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 2 - Frontend (nueva terminal):
```bash
cd frontend
npm run dev
```

**Deberías ver:**
```
  VITE v5.1.0  ready in 500 ms
  ➜  Local:   http://localhost:3000/
```

---

## 🌐 Paso 3: Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

---

## 👤 Paso 4: Crear Usuario Administrador

### Método 1: Via API (Recomendado - 30 segundos)

1. Abre: http://localhost:8000/docs
2. Busca: **POST /api/v1/users**
3. Click: **"Try it out"**
4. Copia y pega este JSON:

```json
{
  "email": "admin@deluxea.com",
  "password": "Admin123456!",
  "role": "admin",
  "is_active": true,
  "must_change_password": false
}
```

5. Click: **"Execute"**
6. Deberías ver una respuesta exitosa con código 201

### Método 2: Via Supabase Dashboard (2 minutos)

1. Ve a: https://supabase.com/dashboard/project/ryjwlwrwxyosmnhsmmma
2. **Authentication** → **Users** → **Add user**
3. Completa:
   - Email: `admin@deluxea.com`
   - Password: `Admin123456!`
   - ✅ Auto Confirm User
4. Click: **Create user**
5. Copia el **User UID** generado
6. Ve a: **Table Editor** → **users** → **Insert** → **Insert row**
7. Completa:
   - id: (pega el UID)
   - email: `admin@deluxea.com`
   - role: `admin` (escribe exactamente)
   - is_active: `true` (checkbox)
   - must_change_password: `false` (checkbox)
8. Click: **Save**

---

## 🎉 Paso 5: Iniciar Sesión

1. Ve a: http://localhost:3000/login
2. Ingresa:
   - **Email**: `admin@deluxea.com`
   - **Password**: `Admin123456!`
3. Click: **Iniciar Sesión**
4. **¡Verás el panel de administración!** 🎊

---

## 🎯 Próximos Pasos

Ahora puedes:

### Como Administrador:
- ✅ Crear usuarios con perfil
- ✅ Gestionar membresías
- ✅ Administrar regalos virtuales
- ✅ Ver estadísticas

### Probar la App:
1. Crea un usuario con perfil
2. Registra un visitante
3. Prueba enviar regalos
4. Sube contenido (fotos, reels)
5. Escribe reseñas

---

## 🔍 Verificar que Todo Funciona

### Backend:
```bash
# Verificar salud de la API
curl http://localhost:8000/health

# Ver regalos
curl http://localhost:8000/api/v1/gifts
```

### Frontend:
- HomePage: http://localhost:3000/
- Login: http://localhost:3000/login
- Reels: http://localhost:3000/reels
- Stories: http://localhost:3000/stories

---

## ❓ Problemas Comunes

### "Module not found" en Backend:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "Module not found" en Frontend:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error "Cannot connect to Supabase":
```bash
# Verifica que el archivo backend/.env tiene el JWT Secret correcto
cat backend/.env | grep SUPABASE_JWT_SECRET
```

### Error de CORS:
- Reinicia el servidor backend
- Verifica que `CORS_ORIGINS=http://localhost:3000` esté en `backend/.env`

---

## 📊 Tu Configuración Actual

### Supabase:
```
URL: https://ryjwlwrwxyosmnhsmmma.supabase.co
Proyecto: ryjwlwrwxyosmnhsmmma
```

### Base de Datos:
- ✅ 14 tablas creadas
- ✅ 6 regalos virtuales:
  - 🌹 Rosa ($5)
  - ❤️ Corazón ($10)
  - ⭐ Estrella ($15)
  - 👑 Corona ($25)
  - 💍 Anillo ($50)
  - 💎 Diamante ($100)

### Archivos de Configuración:
- ✅ `backend/.env` - Configurado ✅
- ✅ `frontend/.env` - Configurado ✅

---

## 🎊 ¡Listo para Usar!

Tu aplicación Deluxea está **100% configurada** y lista para funcionar.

**Solo ejecuta:**
```bash
./instalar.sh
```

Y luego inicia los servidores en dos terminales.

---

<div align="center">

## 🚀 ¡A programar! 🚀

**Todo está configurado y listo**

[📖 README](README.md) • [⚡ QUICKSTART](QUICKSTART.md) • [🛠️ SETUP](SETUP.md)

</div>

