# 🎉 ¡TODO ESTÁ LISTO! - Empieza Aquí

## ✅ Lo que ya está configurado:

- ✅ Base de datos creada en Supabase (14 tablas)
- ✅ 6 regalos predeterminados insertados
- ✅ Archivos `.env` creados con tus credenciales
- ✅ JWT Secret generado automáticamente
- ✅ Estructura completa del proyecto lista

---

## ⚠️ UN SOLO PASO PENDIENTE (2 minutos)

Necesitas obtener el **JWT Secret** de Supabase:

### 📝 Instrucciones:

1. **Abre tu proyecto en Supabase:**
   ```
   https://supabase.com/dashboard/project/ryjwlwrwxyosmnhsmmma
   ```

2. **Ve a Settings (⚙️) → API**

3. **Busca la sección "JWT Settings"**

4. **Copia el valor de "JWT Secret"** (es una cadena muy larga)

5. **Abre el archivo:** `backend/.env`

6. **Busca esta línea:**
   ```
   SUPABASE_JWT_SECRET=PENDIENTE_OBTENER_DEL_DASHBOARD
   ```

7. **Reemplaza** `PENDIENTE_OBTENER_DEL_DASHBOARD` con el JWT Secret que copiaste

8. **Guarda el archivo**

---

## 🚀 Instalación Automática

Una vez que hayas completado el paso anterior, ejecuta:

```bash
./instalar.sh
```

Este script instalará todo automáticamente (Backend y Frontend).

**O si prefieres hacerlo manualmente:**

### Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend:
```bash
cd frontend
npm install
```

---

## ▶️ Iniciar los Servidores

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate
python3 main.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Deberías ver:
```
➜  Local:   http://localhost:3000/
```

---

## 🌐 Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

---

## 👤 Crear tu Usuario Admin

### Opción 1: Via API (Más Rápido) ⭐

1. Abre: http://localhost:8000/docs
2. Busca: `POST /api/v1/users`
3. Click: "Try it out"
4. Pega este JSON:

```json
{
  "email": "admin@deluxea.com",
  "password": "Admin123456!",
  "role": "admin",
  "is_active": true,
  "must_change_password": false
}
```

5. Click: "Execute"
6. ¡Listo!

### Opción 2: Via Supabase Dashboard

1. Ve a: https://supabase.com/dashboard/project/ryjwlwrwxyosmnhsmmma
2. **Authentication** → **Users** → **Add user**
3. Completa:
   - Email: `admin@deluxea.com`
   - Password: `Admin123456!`
   - ✅ Confirm email
4. Copia el **User UID**
5. **Table Editor** → **users** → **Insert row**
6. Completa:
   - id: (el UID que copiaste)
   - email: `admin@deluxea.com`
   - role: `admin`
   - is_active: `true`
   - must_change_password: `false`

---

## 🎊 Iniciar Sesión

1. Ve a: http://localhost:3000/login
2. Email: `admin@deluxea.com`
3. Password: `Admin123456!`
4. **¡Verás el panel de administración!** 🎉

---

## 🔍 Verificar que Todo Funciona

Prueba estos endpoints:

### Backend:
- Health: http://localhost:8000/health
- Ver regalos: http://localhost:8000/api/v1/gifts

### Frontend:
- HomePage: http://localhost:3000/
- Login: http://localhost:3000/login

---

## 📊 Tu Configuración

### Supabase:
```
URL: https://ryjwlwrwxyosmnhsmmma.supabase.co
Proyecto ID: ryjwlwrwxyosmnhsmmma
```

### Tablas Creadas (14):
✅ users  
✅ profiles  
✅ memberships  
✅ gifts (con 6 regalos)  
✅ gift_transactions  
✅ stories  
✅ reels  
✅ photos  
✅ likes  
✅ comments  
✅ reviews  
✅ favorites  
✅ credits  
✅ credit_transactions  

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ Explora el panel de administración
2. ✅ Crea usuarios con perfil
3. ✅ Registra visitantes
4. ✅ Prueba subir contenido
5. ✅ Envía regalos virtuales
6. ✅ Personaliza el diseño

---

## ❓ ¿Problemas?

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

### Error de conexión a Supabase:
- Verifica que el JWT Secret esté configurado en `backend/.env`
- Reinicia el servidor backend

### Error de CORS:
- Verifica que `backend/.env` tenga: `CORS_ORIGINS=http://localhost:3000`

---

## 📚 Documentación

- **SETUP.md** - Guía detallada de instalación
- **QUICKSTART.md** - Comandos rápidos
- **README.md** - Documentación completa
- **INSTRUCCIONES_RAPIDAS.md** - Resumen de pasos

---

## 🎉 Resumen

### Lo que ESTÁ hecho: ✅
- ✅ Base de datos configurada
- ✅ Archivos `.env` creados
- ✅ Credenciales configuradas
- ✅ Script de instalación listo

### Lo que FALTA (solo 1 cosa): ⚠️
- ⚠️ Obtener y configurar el JWT Secret (2 minutos)

### Luego solo ejecutar: 🚀
```bash
./instalar.sh
```

---

<div align="center">

## 🎊 ¡Estás a UN PASO de tener Deluxea funcionando! 🎊

### 👉 Consigue el JWT Secret y ejecuta `./instalar.sh` 👈

---

**¿Necesitas ayuda? Revisa los archivos de documentación** 📚

[SETUP.md](SETUP.md) • [QUICKSTART.md](QUICKSTART.md) • [README.md](README.md)

---

**Desarrollado con** ❤️ **para ti**

</div>

