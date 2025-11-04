#!/bin/bash

echo "🚀 Subiendo Deluxea a GitHub..."
echo ""

# Verificar que estemos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en el directorio del proyecto"
    exit 1
fi

echo "📝 Estado actual:"
git status --short
echo ""

echo "📊 Archivos a subir: $(git ls-files | wc -l) archivos"
echo ""

# Verificar si hay un remote configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Configurando remote..."
    git remote add origin https://github.com/Pirloko/Deluxea.git
fi

echo "🔗 Repositorio remoto:"
git remote get-url origin
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔐 NECESITAS AUTENTICACIÓN"
echo ""
echo "Opción 1: Token de GitHub"
echo "  1. Ve a: https://github.com/settings/tokens"
echo "  2. Genera un nuevo token con permisos 'repo'"
echo "  3. Ejecuta:"
echo ""
echo "     git remote set-url origin https://TU_TOKEN@github.com/Pirloko/Deluxea.git"
echo "     git push -u origin main"
echo ""
echo "Opción 2: GitHub CLI (más fácil)"
echo "  brew install gh"
echo "  gh auth login"
echo "  git push -u origin main"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Preguntar si quiere intentar el push
read -p "¿Ya configuraste la autenticación? (s/n): " respuesta

if [ "$respuesta" = "s" ] || [ "$respuesta" = "S" ]; then
    echo ""
    echo "🚀 Intentando push..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ ¡Éxito! Tu proyecto está en GitHub"
        echo ""
        echo "🌐 Ver en: https://github.com/Pirloko/Deluxea"
        echo ""
    else
        echo ""
        echo "❌ Error en el push"
        echo ""
        echo "Lee las instrucciones en: SUBIR_A_GITHUB.md"
        echo ""
    fi
else
    echo ""
    echo "📖 Lee las instrucciones completas en: SUBIR_A_GITHUB.md"
    echo ""
fi

