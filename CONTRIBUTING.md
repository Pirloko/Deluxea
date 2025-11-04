# 🤝 Guía de Contribución - Deluxea

¡Gracias por tu interés en contribuir a Deluxea! Esta guía te ayudará a entender cómo puedes colaborar.

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Contribuir](#cómo-contribuir)
3. [Estándares de Código](#estándares-de-código)
4. [Proceso de Pull Request](#proceso-de-pull-request)
5. [Reportar Bugs](#reportar-bugs)
6. [Solicitar Features](#solicitar-features)

---

## 📜 Código de Conducta

Este proyecto y todos sus participantes están regidos por un código de conducta. Al participar, se espera que mantengas este código. Por favor, reporta comportamientos inaceptables.

---

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork:
git clone https://github.com/tu-usuario/deluxea.git
cd deluxea
```

### 2. Crear una Rama

```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correcion-bug
```

**Convención de nombres de ramas:**
- `feature/` - Para nuevas funcionalidades
- `fix/` - Para correcciones de bugs
- `docs/` - Para cambios en documentación
- `refactor/` - Para refactorización de código
- `test/` - Para agregar tests

### 3. Hacer Cambios

- Escribe código limpio y legible
- Comenta código complejo
- Actualiza la documentación si es necesario
- Agrega tests si es aplicable

### 4. Commit

```bash
git add .
git commit -m "feat: agregar sistema de notificaciones"
```

**Convención de commits:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Formato, punto y coma, etc.
- `refactor:` - Refactorización de código
- `test:` - Agregar o actualizar tests
- `chore:` - Actualizar tareas de build, etc.

### 5. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego crea un Pull Request en GitHub.

---

## 💻 Estándares de Código

### Frontend (React + TypeScript)

- ✅ Usa TypeScript estricto
- ✅ Componentes funcionales con hooks
- ✅ Props tipados con interfaces
- ✅ Nombres de archivos en PascalCase para componentes
- ✅ Usa TailwindCSS para estilos
- ✅ Evita inline styles

**Ejemplo:**

```typescript
interface ProfileCardProps {
  name: string
  avatar?: string
  onClick?: () => void
}

export default function ProfileCard({ name, avatar, onClick }: ProfileCardProps) {
  return (
    <div className="card" onClick={onClick}>
      {avatar && <img src={avatar} alt={name} />}
      <h3>{name}</h3>
    </div>
  )
}
```

### Backend (FastAPI + Python)

- ✅ Sigue PEP 8
- ✅ Type hints en todas las funciones
- ✅ Docstrings en funciones complejas
- ✅ Usa Pydantic para validación
- ✅ Manejo adecuado de errores

**Ejemplo:**

```python
from fastapi import APIRouter, HTTPException
from app.models.user import User, UserCreate

router = APIRouter()

@router.post("/", response_model=User)
async def create_user(user: UserCreate) -> User:
    """
    Crear un nuevo usuario.
    
    Args:
        user: Datos del usuario a crear
        
    Returns:
        Usuario creado
        
    Raises:
        HTTPException: Si ocurre un error
    """
    try:
        # Lógica aquí
        pass
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### SQL

- ✅ Usa snake_case para nombres
- ✅ Comenta queries complejas
- ✅ Usa índices apropiados
- ✅ Implementa RLS cuando sea necesario

---

## 🔄 Proceso de Pull Request

1. **Asegúrate de que tu código compile y corra sin errores**
   ```bash
   # Frontend
   npm run build
   
   # Backend
   python -m pytest  # si tienes tests
   ```

2. **Actualiza el README.md** si agregas funcionalidad nueva

3. **Describe tu PR claramente**:
   - ¿Qué problema resuelve?
   - ¿Cómo lo probaste?
   - Screenshots si es cambio visual

4. **Espera la revisión** de un maintainer

5. **Realiza cambios solicitados** si los hay

6. **Una vez aprobado**, tu PR será merged

---

## 🐛 Reportar Bugs

Al reportar un bug, incluye:

### 📝 Descripción
Una descripción clara y concisa del bug.

### 🔄 Pasos para Reproducir
1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hasta '...'
4. Ve el error

### ✅ Comportamiento Esperado
Qué esperabas que sucediera.

### ❌ Comportamiento Actual
Qué sucedió en realidad.

### 📸 Screenshots
Si aplica, agrega screenshots.

### 🖥️ Entorno
- OS: [ej. Windows 11]
- Navegador: [ej. Chrome 120]
- Node: [ej. 18.17.0]
- Python: [ej. 3.11.0]

---

## ✨ Solicitar Features

Al solicitar una nueva funcionalidad:

### 📝 Descripción
Una descripción clara de la funcionalidad.

### 🎯 Problema que Resuelve
¿Qué problema o necesidad resuelve?

### 💡 Solución Propuesta
Cómo imaginas que debería funcionar.

### 🔄 Alternativas Consideradas
Otras soluciones que hayas considerado.

### 📷 Mockups/Ejemplos
Si aplica, mockups o ejemplos visuales.

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test  # cuando esté implementado
```

### Backend
```bash
cd backend
pytest  # cuando esté implementado
```

---

## 📚 Recursos Útiles

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## ❓ Preguntas?

Si tienes preguntas sobre cómo contribuir:
1. Revisa la documentación existente
2. Busca en Issues cerrados
3. Abre una nueva Issue con la etiqueta `question`

---

## 🎉 ¡Gracias!

Cada contribución, grande o pequeña, es valiosa. ¡Gracias por ayudar a mejorar Deluxea!

---

<div align="center">

**Happy Coding!** 💜

[⬆ Volver al inicio](#-guía-de-contribución---deluxea)

</div>

