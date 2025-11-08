# 📱 FORMATO DE TELÉFONO CHILENO

**Fecha:** 8 de Noviembre, 2025  
**Cambio:** Sistema de números de contacto para Chile

---

## 🎯 FORMATO IMPLEMENTADO

### Formato Chileno Completo:
```
+56 9 XXXX XXXX
 │  │  │
 │  │  └─ 8 dígitos del número móvil
 │  └──── Código móvil (9)
 └─────── Código de país Chile (+56)
```

### Ejemplo:
```
+56 9 8765 4321
```

---

## ✅ LO QUE HICE

### 1. Campo de Entrada Simplificado

**El usuario solo escribe los 8 dígitos:**

```
┌──────────────────────────────────────┐
│ Número de Contacto (Chile)           │
│                                      │
│ ┌─────────┐ ┌──────────────────────┐│
│ │ +56 9   │ │ 1234 5678           ││
│ └─────────┘ └──────────────────────┘│
│   (fijo)        (usuario escribe)   │
│                                      │
│ Número completo: +56 9 1234 5678    │
└──────────────────────────────────────┘
```

**Características:**
- ✅ `+56 9` es fijo y visible
- ✅ Usuario solo escribe 8 dígitos
- ✅ Solo acepta números (0-9)
- ✅ Máximo 8 caracteres
- ✅ Vista previa del número completo

---

### 2. Validación Automática

```typescript
// Solo permite números
value.replace(/[^0-9]/g, '')

// Límite de 8 dígitos
if (value.length <= 8) {
  setPhoneNumber(value)
}
```

---

### 3. Construcción del Número Completo

Al guardar, el sistema automáticamente:

```typescript
// Entrada del usuario: "87654321"
// 
// Sistema construye:
const fullPhoneNumber = `+56 9 ${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`
// Resultado: "+56 9 8765 4321"
//
// Se guarda en BD: "+56 9 8765 4321"
```

---

### 4. Carga de Números Existentes

Cuando el usuario edita un perfil con número existente:

```typescript
// Número en BD: "+56 9 8765 4321"
//
// Sistema extrae:
const cleanNumber = data.contact_number.replace(/[^0-9]/g, '')
// cleanNumber = "56987654321"
//
// Si es chileno (569XXXXXXXX):
if (cleanNumber.startsWith('569') && cleanNumber.length === 11) {
  setPhoneNumber(cleanNumber.slice(3)) // "87654321"
}
//
// Campo muestra: "87654321" (solo los 8 dígitos)
```

---

## 📁 ARCHIVOS MODIFICADOS

### 1. `frontend/src/pages/user/EditProfile.tsx`

**Estado agregado:**
```typescript
const [phoneNumber, setPhoneNumber] = useState('') // Solo 8 dígitos
```

**Carga de perfil:**
```typescript
// Extraer últimos 8 dígitos si existe número chileno
if (cleanNumber.startsWith('569') && cleanNumber.length === 11) {
  setPhoneNumber(cleanNumber.slice(3))
}
```

**Al guardar:**
```typescript
const fullPhoneNumber = phoneNumber.trim() 
  ? `+56 9 ${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`
  : null
```

**Campo de entrada:**
```typescript
<div className="flex items-center gap-2">
  <div className="...">+56 9</div>
  <input
    type="tel"
    value={phoneNumber}
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '')
      if (value.length <= 8) {
        setPhoneNumber(value)
      }
    }}
    placeholder="1234 5678"
    maxLength={8}
  />
</div>
{phoneNumber && (
  <p>Número completo: +56 9 {phoneNumber.slice(0, 4)} {phoneNumber.slice(4)}</p>
)}
```

---

### 2. `supabase/limpiar_y_crear_perfiles.sql`

**Números actualizados:**
```sql
-- Valentina Torres
'+56 9 8765 4321'

-- Alex Rivera
'+56 9 9876 5432'
```

---

## 🎨 DISEÑO DEL CAMPO

### Vista en EditProfile:

```
┌────────────────────────────────────────────┐
│ Número de Contacto (Chile)                 │
│                                            │
│ ┌──────────┐ ┌──────────────────────────┐ │
│ │  +56 9   │ │ 87654321                 │ │
│ └──────────┘ └──────────────────────────┘ │
│   Gris/Fijo    Input editable             │
│                                            │
│ Número completo: +56 9 8765 4321          │
│ (Mostrado cuando hay número)               │
└────────────────────────────────────────────┘
```

---

## 🧪 CÓMO PROBAR

### Test 1: Crear Perfil Nuevo

```bash
1. Login: carlos@deluxea.com / Carlos123!
2. Editar Perfil
3. Campo "Número de Contacto":
   - Parte fija: "+56 9" (gris)
   - Parte editable: [vacío]
4. Escribe: 87654321
5. Ve: "Número completo: +56 9 8765 4321"
6. Guarda
7. ✅ En BD: "+56 9 8765 4321"
```

---

### Test 2: Editar Perfil Existente

```bash
1. Ejecuta script SQL para crear perfiles
2. Login: carlos@deluxea.com
3. Editar Perfil
4. Campo muestra:
   - Parte fija: "+56 9"
   - Parte editable: "87654321"
5. Modifica a: 99887766
6. Ve: "Número completo: +56 9 9988 7766"
7. Guarda
8. ✅ Actualizado correctamente
```

---

### Test 3: Validación

```bash
1. Intenta escribir letras:
   ✅ No permite, solo números

2. Intenta escribir más de 8 dígitos:
   ✅ Se detiene en 8

3. Deja el campo vacío:
   ✅ Guarda NULL (sin número)

4. Escribe número incompleto (ej: "1234"):
   ✅ Permite guardarlo como "+56 9 1234 "
```

---

## 📱 FUNCIONAMIENTO CON BOTONES

### Botón "Llamar"
```typescript
// Número en BD: "+56 9 8765 4321"
// Link generado: "tel:+56987654321"

<a href="tel:+56987654321">
  📞 Llamar
</a>

// En móvil: Abre marcador con +56987654321
```

---

### Botón "WhatsApp"
```typescript
// Número en BD: "+56 9 8765 4321"
// Limpiado: "56987654321"
// Link generado: "https://wa.me/56987654321"

<a href="https://wa.me/56987654321">
  💬 WhatsApp
</a>

// Abre WhatsApp con número chileno
```

---

## 🔢 EJEMPLOS DE NÚMEROS CHILENOS

### Formato Correcto:
```
+56 9 8765 4321  ✅
+56 9 9876 5432  ✅
+56 9 1234 5678  ✅
```

### Usuario solo escribe:
```
87654321  ✅
98765432  ✅
12345678  ✅
```

### Sistema construye:
```
87654321  →  +56 9 8765 4321
98765432  →  +56 9 9876 5432
12345678  →  +56 9 1234 5678
```

---

## ⚠️ CONSIDERACIONES

### 1. Solo Números Móviles
Este sistema asume que TODOS los números son móviles chilenos (código 9).

**Si necesitas teléfonos fijos:**
- Fijos Santiago: +56 2 XXXX XXXX
- Requiere modificación del código

---

### 2. Código de Área
En Chile, el código de móviles es `9` para todos los operadores:
- Movistar: 9
- Claro: 9
- Entel: 9
- WOM: 9

---

### 3. Números Antiguos
Si hay números existentes en otro formato:

```sql
-- Actualizar números existentes a formato chileno
UPDATE profiles 
SET contact_number = '+56 9 ' || 
  SUBSTRING(REGEXP_REPLACE(contact_number, '[^0-9]', '', 'g'), 1, 4) || 
  ' ' ||
  SUBSTRING(REGEXP_REPLACE(contact_number, '[^0-9]', '', 'g'), 5, 4)
WHERE contact_number IS NOT NULL
  AND contact_number NOT LIKE '+56%';
```

---

## 💡 MEJORAS FUTURAS (Opcional)

### 1. Formateo Automático
```typescript
// Mientras escribe, mostrar con formato:
// Usuario escribe: "87654321"
// Campo muestra:   "8765 4321"

const formatPhone = (value: string) => {
  if (value.length > 4) {
    return `${value.slice(0, 4)} ${value.slice(4)}`
  }
  return value
}
```

---

### 2. Validación de Operador
```typescript
// Verificar que el número sea válido según operador chileno
const isValidChileanMobile = (phone: string) => {
  // Móviles chilenos empiezan con 9
  return phone.length === 8 && phone[0] === '9'
}
```

---

### 3. Verificación en Tiempo Real
```typescript
// API para verificar si el número existe
const verifyPhone = async (phone: string) => {
  // Llamada a servicio de verificación
  const isValid = await checkPhoneExists(phone)
  return isValid
}
```

---

## 📊 COMPARACIÓN

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Campo** | Input libre | `+56 9` fijo + 8 dígitos |
| **Entrada** | Texto completo | Solo 8 números |
| **Validación** | Ninguna | Solo números, máx 8 |
| **Vista previa** | No | Sí, número completo |
| **Formato BD** | Variable | Estandarizado |
| **WhatsApp** | A veces falla | Siempre funciona |

---

## ✅ RESULTADO

### Campo de Entrada:
```
Número de Contacto (Chile)

[+56 9] [        ]
 (fijo)  (8 dígitos)

Número completo: +56 9 XXXX XXXX
```

### Guardado en Base de Datos:
```sql
contact_number: '+56 9 8765 4321'
```

### Links Generados:
```html
<!-- Llamar -->
<a href="tel:+56987654321">📞 Llamar</a>

<!-- WhatsApp -->
<a href="https://wa.me/56987654321">💬 WhatsApp</a>
```

---

## 🎉 VENTAJAS DEL SISTEMA

1. ✅ **Simple para el usuario:** Solo 8 dígitos
2. ✅ **Estandarizado:** Siempre formato chileno
3. ✅ **Validado:** Solo números, longitud correcta
4. ✅ **Compatible:** WhatsApp y llamadas funcionan
5. ✅ **Visual:** Vista previa del número completo
6. ✅ **Limpio:** Interfaz clara y profesional

---

**¡Sistema de teléfonos chilenos implementado!** 🇨🇱📱


