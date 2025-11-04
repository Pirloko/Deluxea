# ⚡ Quick Start - Deluxea

Comandos rápidos para iniciar el desarrollo.

---

## 🚀 Inicio Rápido (Primera vez)

### 1. Configurar Supabase
```bash
# 1. Crear proyecto en supabase.com
# 2. Ejecutar SQL en: supabase/migrations/001_initial_schema.sql
# 3. Copiar credenciales del proyecto
```

### 2. Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate
# Activar (Mac/Linux)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear .env (copiar del ejemplo y completar)
cp .env.example .env

# Iniciar servidor
python main.py
```

### 3. Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Crear .env (copiar del ejemplo y completar)
cp .env.example .env

# Iniciar servidor
npm run dev
```

---

## 🔄 Inicio Diario (Después de configuración inicial)

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
python main.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Acceder a la aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🐳 Usando Docker (Alternativa)

### Primera vez
```bash
# Crear archivo .env en la raíz con todas las variables
cp .env.example .env

# Iniciar contenedores
docker-compose up -d
```

### Inicio diario
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f
```

### Detener
```bash
docker-compose down
```

---

## 📦 Comandos Útiles

### Frontend

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint

# Formatear código
npm run format  # (si está configurado)
```

### Backend

```bash
# Activar entorno virtual
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Instalar nueva dependencia
pip install nombre-paquete
pip freeze > requirements.txt

# Ver rutas de la API
python -c "from main import app; print(app.routes)"

# Tests (cuando estén implementados)
pytest
pytest -v  # verbose
pytest --cov  # con coverage
```

### Base de Datos (Supabase)

```bash
# Acceder a SQL Editor en Supabase Dashboard
# https://app.supabase.com/project/TU_PROJECT_ID/editor/sql

# Ver tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

# Contar usuarios
SELECT role, COUNT(*) FROM users GROUP BY role;

# Ver últimas historias
SELECT * FROM stories 
WHERE expires_at > NOW() 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🛠️ Problemas Comunes - Soluciones Rápidas

### ❌ Puerto en uso

```bash
# Ver qué está usando el puerto 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Matar proceso
kill -9 PID  # Mac/Linux
taskkill /PID PID /F  # Windows
```

### ❌ Módulos no encontrados (Frontend)

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error de dependencias (Backend)

```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### ❌ Error de CORS

Verifica en `backend/.env`:
```
CORS_ORIGINS=http://localhost:3000
```

Reinicia el backend.

### ❌ Error de Supabase connection

1. Verifica las URLs en `.env`
2. Verifica que no haya espacios extra
3. Verifica que el proyecto esté activo en Supabase

---

## 📝 Crear Primer Usuario Admin

### Opción 1: Via API Docs

1. Ir a http://localhost:8000/docs
2. Buscar `POST /api/v1/users`
3. Click "Try it out"
4. Usar:
```json
{
  "email": "admin@deluxea.com",
  "password": "admin123",
  "role": "admin",
  "is_active": true,
  "must_change_password": false
}
```

### Opción 2: Via Supabase Dashboard

1. Authentication > Users > Add user
2. Table Editor > users > Insert row

Detalles en [SETUP.md](SETUP.md)

---

## 🧪 Testing (Cuando esté implementado)

### Frontend
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Backend
```bash
pytest
pytest -v
pytest --cov=app tests/
```

---

## 🔧 Variables de Entorno Requeridas

### Frontend `.env`
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_API_URL=http://localhost:8000
```

### Backend `.env`
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGci...  (service_role)
SUPABASE_JWT_SECRET=tu-jwt-secret
JWT_SECRET_KEY=genera-uno-aleatorio-min-32-chars
CORS_ORIGINS=http://localhost:3000
```

---

## 📚 Estructura de Carpetas

```
instagram/
├── frontend/          → React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   └── package.json
│
├── backend/           → FastAPI
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   └── models/
│   └── main.py
│
└── supabase/
    └── migrations/
```

---

## 🎯 Próximos Pasos

Después de la configuración inicial:

1. ✅ Crear usuario administrador
2. ✅ Explorar el panel de admin
3. ✅ Crear un usuario con perfil de prueba
4. ✅ Registrar un visitante
5. ✅ Probar todas las funcionalidades
6. 🚀 Comenzar a desarrollar nuevas features

---

## 📞 Ayuda

- 📖 [README.md](README.md) - Documentación completa
- 🚀 [SETUP.md](SETUP.md) - Guía de instalación detallada
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - Guía de contribución

---

<div align="center">

**¡Happy Coding!** 💜✨

[⬆ Volver al inicio](#-quick-start---deluxea)

</div>

