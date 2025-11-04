# 🚀 Guía de Deployment - Deluxea

Esta guía te ayudará a desplegar Deluxea en producción.

---

## 📋 Tabla de Contenidos

1. [Preparación](#preparación)
2. [Frontend (Vercel/Netlify)](#frontend-deployment)
3. [Backend (Railway/Render/Fly.io)](#backend-deployment)
4. [Base de Datos (Supabase)](#base-de-datos)
5. [Variables de Entorno](#variables-de-entorno)
6. [Checklist Pre-Deploy](#checklist-pre-deploy)
7. [Post-Deploy](#post-deploy)

---

## 🔧 Preparación

### 1. Build de Producción Local

Antes de deployar, verifica que todo funcione en modo producción:

```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
# Activar venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
# Probar en modo producción
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Optimizaciones Pre-Deploy

#### Frontend
```bash
# Analizar tamaño del bundle
npm run build -- --analyze

# Optimizar imágenes (si usas)
npm install -D vite-plugin-imagemin
```

#### Backend
```bash
# Generar requirements.txt actualizado
pip freeze > requirements.txt

# Verificar seguridad
pip install safety
safety check
```

---

## 🌐 Frontend Deployment

### Opción 1: Vercel (Recomendado)

#### Paso 1: Preparar el Proyecto

```bash
cd frontend
npm install -g vercel
```

#### Paso 2: Configurar `vercel.json`

Crear `frontend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Paso 3: Deploy

```bash
vercel

# Para producción
vercel --prod
```

#### Paso 4: Configurar Variables de Entorno

En Vercel Dashboard:
1. Project Settings > Environment Variables
2. Agregar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (URL del backend en producción)

### Opción 2: Netlify

#### Crear `frontend/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### Deploy:

```bash
# Instalar CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Producción
netlify deploy --prod
```

---

## ⚙️ Backend Deployment

### Opción 1: Railway (Recomendado)

#### Paso 1: Preparar archivos

Crear `backend/Procfile`:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Crear `backend/runtime.txt`:

```
python-3.11.0
```

#### Paso 2: Deploy

1. Ir a [railway.app](https://railway.app)
2. Conectar GitHub repo
3. Seleccionar carpeta `backend`
4. Railway detectará automáticamente Python

#### Paso 3: Variables de Entorno

En Railway Dashboard agregar:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SUPABASE_JWT_SECRET`
- `JWT_SECRET_KEY`
- `CORS_ORIGINS` (URL del frontend)

### Opción 2: Render

#### Crear `backend/render.yaml`:

```yaml
services:
  - type: web
    name: deluxea-api
    env: python
    region: oregon
    plan: free
    branch: main
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
      - key: SUPABASE_JWT_SECRET
        sync: false
      - key: JWT_SECRET_KEY
        sync: false
      - key: CORS_ORIGINS
        sync: false
```

### Opción 3: Fly.io

```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
cd backend
flyctl launch
flyctl deploy
```

---

## 🗄️ Base de Datos

### Supabase en Producción

#### 1. Upgrade a Plan de Pago (Opcional)

Si esperas tráfico alto:
- Pro Plan: $25/mes
- Mejor performance
- Más almacenamiento
- Soporte prioritario

#### 2. Configurar Backups

En Supabase Dashboard:
1. Database > Backups
2. Habilitar backups automáticos
3. Configurar frecuencia

#### 3. Optimizar Queries

```sql
-- Analizar queries lentas
SELECT * FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 10;

-- Agregar índices si es necesario
CREATE INDEX idx_custom ON tabla(columna);
```

#### 4. Configurar RLS

Verificar que todas las tablas tengan RLS habilitado:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## 🔐 Variables de Entorno

### Frontend (Producción)

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
VITE_API_URL=https://tu-backend.railway.app
```

### Backend (Producción)

```env
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_KEY=tu_service_role_key_aqui
SUPABASE_JWT_SECRET=tu_jwt_secret
JWT_SECRET_KEY=tu_secret_key_produccion
CORS_ORIGINS=https://tu-frontend.vercel.app,https://deluxea.com
API_V1_PREFIX=/api/v1
PROJECT_NAME=Deluxea API
```

**⚠️ IMPORTANTE:** Nunca commitees archivos `.env` al repositorio!

---

## ✅ Checklist Pre-Deploy

### Seguridad
- [ ] Variables de entorno configuradas
- [ ] Secrets seguros (min 32 caracteres)
- [ ] CORS configurado correctamente
- [ ] RLS habilitado en todas las tablas
- [ ] Rate limiting implementado
- [ ] HTTPS habilitado

### Performance
- [ ] Índices en base de datos
- [ ] Compresión de assets
- [ ] CDN configurado (opcional)
- [ ] Lazy loading implementado
- [ ] Bundle size optimizado

### Funcionalidad
- [ ] Tests pasando
- [ ] Migraciones ejecutadas
- [ ] Datos iniciales cargados
- [ ] Error handling implementado
- [ ] Logging configurado

### Legal
- [ ] Términos y condiciones
- [ ] Política de privacidad
- [ ] Cookie policy
- [ ] Verificación de mayoría de edad

---

## 🎯 Post-Deploy

### 1. Verificación

```bash
# Verificar frontend
curl https://tu-frontend.vercel.app

# Verificar backend
curl https://tu-backend.railway.app/health

# Verificar API
curl https://tu-backend.railway.app/api/v1/gifts
```

### 2. Monitoreo

#### Configurar Monitoring

**Frontend (Vercel):**
- Analytics integrado
- Web Vitals
- Error tracking

**Backend (Railway/Render):**
- Application logs
- Resource usage
- Uptime monitoring

**Herramientas Adicionales:**
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [UptimeRobot](https://uptimerobot.com/) - Uptime monitoring

### 3. Crear Usuario Admin en Producción

```bash
# Opción 1: Via API
curl -X POST https://tu-backend.railway.app/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@deluxea.com",
    "password": "SecurePassword123!",
    "role": "admin",
    "is_active": true,
    "must_change_password": false
  }'

# Opción 2: Via Supabase Dashboard
# Authentication > Users > Add user
# Luego agregar en tabla users
```

### 4. Testing en Producción

```bash
# Crear cuenta de prueba
# Verificar todas las funcionalidades
# Probar flujos críticos:
# - Registro de usuario
# - Login/Logout
# - Creación de perfil
# - Envío de regalo
# - Publicación de contenido
```

---

## 🔄 CI/CD (Opcional)

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd backend && pip install -r requirements.txt
      # Deploy a Railway/Render automáticamente
```

---

## 🌍 Dominio Personalizado

### 1. Comprar Dominio

- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### 2. Configurar DNS

**Para Frontend (Vercel):**

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Para Backend (Railway):**

```
Type: CNAME
Name: api
Value: tu-app.railway.app
```

### 3. Configurar SSL

Vercel y Railway proporcionan SSL automático con Let's Encrypt.

---

## 📊 Métricas de Éxito

### KPIs a Monitorear

- **Uptime**: > 99.9%
- **Response Time**: < 200ms
- **Error Rate**: < 1%
- **Page Load**: < 2s
- **API Latency**: < 100ms

### Herramientas

- Google Analytics
- Vercel Analytics
- Supabase Dashboard
- Custom logging

---

## 🆘 Troubleshooting

### Error: CORS

**Solución:**
```python
# backend/main.py
CORS_ORIGINS = [
    "https://tu-frontend.vercel.app",
    "https://deluxea.com",
    "https://www.deluxea.com"
]
```

### Error: Environment Variables

**Solución:**
Verificar que todas las variables estén configuradas en el dashboard del hosting.

### Error: Database Connection

**Solución:**
Verificar que la IP del servidor esté en la whitelist de Supabase (generalmente no necesario con Supabase).

---

## 📞 Soporte

Si tienes problemas durante el deployment:

1. Revisa los logs del servicio de hosting
2. Consulta la documentación del proveedor
3. Verifica las variables de entorno
4. Contacta al soporte del proveedor

---

## 🎉 ¡Listo!

Tu aplicación Deluxea está ahora en producción. 

**Próximos pasos:**
1. ✅ Monitorear métricas
2. ✅ Recopilar feedback
3. ✅ Iterar y mejorar
4. ✅ Escalar según demanda

---

<div align="center">

**¡Felicidades por tu deployment!** 🚀🎉

[⬆ Volver al inicio](#-guía-de-deployment---deluxea)

</div>

