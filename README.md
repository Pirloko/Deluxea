# 👑 Deluxea

![Deluxea Banner](https://via.placeholder.com/1200x300/d946ef/ffffff?text=Deluxea+-+Tu+Red+Social+Premium)

**Deluxea** es una plataforma web tipo Instagram administrada con membresías, regalos virtuales y sistema de interacción completo. Diseñada para ofrecer experiencias premium con 3 roles de usuario: Admin, Usuario con Perfil y Visitante.

---

## 🎯 Características Principales

### 👑 Roles de Usuario

#### **Administrador**
- ✅ Gestión completa de usuarios (crear, editar, eliminar)
- ✅ Activar/desactivar cuentas
- ✅ Asignar membresías (semanal o mensual)
- ✅ Panel de estadísticas y métricas
- ✅ Gestión del catálogo de regalos
- ✅ Control de retiros monetarios

#### **Usuario con Perfil**
- ✅ Cambio de contraseña obligatorio en primer inicio
- ✅ Edición de perfil completo (nombre, edad, descripción, etc.)
- ✅ Subida de fotos, reels e historias (24h)
- ✅ Vista de regalos recibidos con valor monetario
- ✅ Gestión de reseñas
- ✅ Notificaciones en tiempo real

#### **Visitante**
- ✅ Navegación sin login (feed, reels, historias)
- ✅ Registro opcional con confirmación de mayoría de edad
- ✅ Sistema de me gusta y comentarios
- ✅ Lista de favoritos personalizada
- ✅ Reseñas (1 por perfil cada 24h)
- ✅ Envío de regalos virtuales
- ✅ Sistema de créditos

---

## 🛠️ Stack Tecnológico

### **Frontend**
- ⚛️ React 18.2
- 📘 TypeScript 5.3
- 🎨 TailwindCSS 3.4
- 🚀 Vite 5.1
- 🔄 React Router 6
- 🐻 Zustand (State Management)
- 🎨 Lucide React (Iconos)

### **Backend**
- 🐍 FastAPI (Python)
- 🔐 JWT Authentication
- 📊 Supabase (Database, Auth, Storage)
- 🔄 WebSockets/Realtime

### **Base de Datos**
- 🐘 PostgreSQL (via Supabase)
- 🔒 Row Level Security (RLS)
- 📦 14 tablas principales

---

## 📁 Estructura del Proyecto

```
instagram/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── auth/          # Autenticación
│   │   │   └── layout/        # Navbar, Footer
│   │   ├── layouts/           # Layouts principales
│   │   │   ├── MainLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── pages/             # Páginas de la app
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── public/        # Home, Reels, Stories, Profile
│   │   │   ├── admin/         # Dashboard, Users, Gifts, Withdrawals
│   │   │   ├── user/          # UserDashboard, EditProfile, Content, Gifts, Reviews
│   │   │   └── visitor/       # VisitorDashboard, Favorites, Credits
│   │   ├── store/             # Zustand stores
│   │   ├── lib/               # Utilidades y configuración
│   │   └── App.tsx            # Configuración de rutas
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # API FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/ # Endpoints por recurso
│   │   │       │   ├── users.py
│   │   │       │   ├── profiles.py
│   │   │       │   ├── gifts.py
│   │   │       │   ├── memberships.py
│   │   │       │   ├── content.py
│   │   │       │   └── reviews.py
│   │   │       └── api.py
│   │   ├── core/              # Configuración
│   │   │   ├── config.py
│   │   │   └── supabase.py
│   │   └── models/            # Modelos Pydantic
│   │       ├── user.py
│   │       ├── gift.py
│   │       ├── content.py
│   │       ├── review.py
│   │       └── membership.py
│   ├── main.py
│   └── requirements.txt
│
├── supabase/
│   └── migrations/             # Migraciones SQL
│       └── 001_initial_schema.sql
│
├── .gitignore
└── README.md
```

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ y npm/yarn
- Python 3.10+
- Cuenta de Supabase

### **1. Configurar Supabase**

1. Crea un nuevo proyecto en [supabase.com](https://supabase.com)
2. Ve a `SQL Editor` y ejecuta el script en `supabase/migrations/001_initial_schema.sql`
3. Copia las credenciales:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`

### **2. Configurar Frontend**

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_API_URL=http://localhost:8000

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

### **3. Configurar Backend**

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret
JWT_SECRET_KEY=tu_secret_key_aqui
CORS_ORIGINS=http://localhost:3000

# Iniciar servidor
python main.py
```

El backend estará disponible en `http://localhost:8000`

La documentación API estará en `http://localhost:8000/docs`

---

## 📊 Modelo de Base de Datos

### **Tablas Principales**

| Tabla | Descripción |
|-------|-------------|
| `users` | Información de autenticación y roles |
| `profiles` | Perfiles públicos de usuarios |
| `memberships` | Membresías activas (semanal/mensual) |
| `gifts` | Catálogo de regalos virtuales |
| `gift_transactions` | Historial de regalos enviados |
| `stories` | Historias (expiran en 24h) |
| `reels` | Videos cortos |
| `photos` | Fotos de perfiles |
| `likes` | Me gusta en contenido |
| `comments` | Comentarios |
| `reviews` | Reseñas de perfiles |
| `favorites` | Perfiles favoritos |
| `credits` | Balance de créditos |
| `credit_transactions` | Historial de créditos |

---

## 🎨 Diseño y UI

### **Paleta de Colores**

```css
Primary: #d946ef (Púrpura/Magenta)
Primary Variants: #f0abfc, #c026d3, #a21caf
Accent: Pink gradient
```

### **Características de UI**

- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Modo claro optimizado
- ✅ Animaciones suaves con Tailwind
- ✅ Iconos modernos de Lucide React
- ✅ Tipografía: Inter (Google Fonts)

---

## 🔐 Autenticación y Seguridad

- 🔒 JWT Tokens con Supabase Auth
- 🔒 Row Level Security (RLS) en todas las tablas
- 🔒 Roles y permisos granulares
- 🔒 Cambio de contraseña obligatorio para nuevos usuarios con perfil
- 🔒 Confirmación de mayoría de edad para visitantes

---

## 🌟 Funcionalidades Destacadas

### **Sistema de Regalos Virtuales**
- 6 regalos predeterminados (Rosa, Corazón, Estrella, Corona, Anillo, Diamante)
- Valores desde $5 hasta $100
- Conversión automática a valor monetario
- Historial completo de transacciones

### **Sistema de Membresías**
- Membresía semanal y mensual
- Control de expiración automático
- Panel de administración de membresías

### **Contenido Efímero**
- Historias que expiran en 24 horas
- Limpieza automática de contenido expirado

### **Sistema de Reseñas**
- Límite de 1 reseña por perfil cada 24h
- Calificación de 1 a 5 estrellas
- Promedio de calificación visible

---

## 📱 API Endpoints

### **Usuarios** (`/api/v1/users`)
- `GET /` - Listar usuarios
- `GET /{id}` - Obtener usuario
- `POST /` - Crear usuario
- `PATCH /{id}` - Actualizar usuario
- `DELETE /{id}` - Eliminar usuario

### **Perfiles** (`/api/v1/profiles`)
- `GET /` - Listar perfiles
- `GET /{user_id}` - Obtener perfil
- `POST /` - Crear perfil
- `PATCH /{user_id}` - Actualizar perfil

### **Regalos** (`/api/v1/gifts`)
- `GET /` - Listar regalos
- `POST /` - Crear regalo
- `PATCH /{id}` - Actualizar regalo
- `POST /send` - Enviar regalo
- `GET /received/{user_id}` - Regalos recibidos

### **Contenido** (`/api/v1/content`)
- Stories: `GET/POST /stories`
- Reels: `GET/POST /reels`
- Photos: `GET/POST /photos`

### **Reseñas** (`/api/v1/reviews`)
- `GET /profile/{profile_id}` - Reseñas de perfil
- `POST /` - Crear reseña
- `PATCH /{id}` - Actualizar reseña
- `DELETE /{id}` - Eliminar reseña

Documentación completa en: `http://localhost:8000/docs`

---

## 🚧 Próximas Funcionalidades

- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat directo entre usuarios
- [ ] Pasarela de pagos para créditos
- [ ] Sistema de retiros para usuarios con perfil
- [ ] Subida de archivos a Supabase Storage
- [ ] Filtros y búsqueda avanzada
- [ ] Reportes y analytics avanzados
- [ ] Sistema de verificación de perfiles
- [ ] Modo oscuro

---

## 🤝 Contribución

Este es un proyecto privado. Si deseas contribuir, contacta al administrador del proyecto.

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2025 Deluxea

---

## 👨‍💻 Autor

Desarrollado con ❤️ por el equipo de Deluxea

---

## 📞 Soporte

Para soporte o consultas:
- Email: support@deluxea.com
- Discord: [Únete a nuestra comunidad]

---

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**¡Gracias por usar Deluxea!** 👑

[⬆ Volver arriba](#-deluxea)

</div>

