#!/bin/bash

echo "🚀 Instalando Deluxea..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Backend
echo -e "${BLUE}📦 Instalando Backend...${NC}"
cd backend

# Crear entorno virtual
echo "Creando entorno virtual..."
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
echo "Instalando dependencias de Python..."
pip install -r requirements.txt

echo -e "${GREEN}✅ Backend instalado correctamente${NC}"
echo ""

# 2. Frontend
echo -e "${BLUE}📦 Instalando Frontend...${NC}"
cd ../frontend

echo "Instalando dependencias de Node..."
npm install

echo -e "${GREEN}✅ Frontend instalado correctamente${NC}"
echo ""

# 3. Verificar instalación
cd ..
echo -e "${BLUE}🔍 Verificando instalación...${NC}"
python3 check-setup.py

echo ""
echo -e "${GREEN}🎉 ¡Instalación completada!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Antes de iniciar los servidores${NC}"
echo ""
echo "1. Ve a tu proyecto en Supabase:"
echo "   https://supabase.com/dashboard/project/ryjwlwrwxyosmnhsmmma"
echo ""
echo "2. Ve a Settings → API → JWT Settings"
echo ""
echo "3. Copia el JWT Secret"
echo ""
echo "4. Abre el archivo: backend/.env"
echo ""
echo "5. Reemplaza PENDIENTE_OBTENER_DEL_DASHBOARD con el JWT Secret"
echo ""
echo -e "${BLUE}📝 Para iniciar los servidores:${NC}"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python3 main.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${GREEN}🌐 URLs:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000/docs"
echo ""

