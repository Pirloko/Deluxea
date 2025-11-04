#!/usr/bin/env python3
"""
Script de verificación de configuración para Deluxea
Ejecutar antes de iniciar el desarrollo para verificar que todo esté configurado correctamente.
"""

import os
import sys
from pathlib import Path

def check_color(text, color):
    """Colorear texto en la terminal"""
    colors = {
        'green': '\033[92m',
        'yellow': '\033[93m',
        'red': '\033[91m',
        'blue': '\033[94m',
        'end': '\033[0m'
    }
    return f"{colors.get(color, '')}{text}{colors['end']}"

def print_header(text):
    """Imprimir encabezado"""
    print(f"\n{check_color('=' * 60, 'blue')}")
    print(check_color(f"  {text}", 'blue'))
    print(f"{check_color('=' * 60, 'blue')}\n")

def check_mark(status):
    """Retornar marca de verificación"""
    return check_color("✓", "green") if status else check_color("✗", "red")

def check_file_exists(filepath, description):
    """Verificar si un archivo existe"""
    exists = os.path.exists(filepath)
    status = "OK" if exists else "FALTA"
    color = "green" if exists else "red"
    print(f"{check_mark(exists)} {description}: {check_color(status, color)}")
    return exists

def check_env_vars(filepath, required_vars):
    """Verificar variables de entorno en un archivo .env"""
    if not os.path.exists(filepath):
        return False
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    missing = []
    for var in required_vars:
        if f"{var}=" not in content or f"{var}=your" in content or f"{var}=tu" in content:
            missing.append(var)
    
    if missing:
        print(f"  {check_color('⚠ Variables faltantes o no configuradas:', 'yellow')}")
        for var in missing:
            print(f"    - {var}")
        return False
    return True

def main():
    """Función principal"""
    print_header("🔍 VERIFICACIÓN DE CONFIGURACIÓN - DELUXEA")
    
    all_good = True
    
    # Verificar estructura de carpetas
    print_header("📁 Estructura de Carpetas")
    
    folders = [
        ("frontend/src", "Frontend source"),
        ("frontend/src/components", "Components"),
        ("frontend/src/pages", "Pages"),
        ("frontend/src/store", "Store"),
        ("backend/app", "Backend app"),
        ("backend/app/api", "API"),
        ("backend/app/models", "Models"),
        ("supabase/migrations", "Migrations"),
    ]
    
    for folder, desc in folders:
        exists = check_file_exists(folder, desc)
        all_good = all_good and exists
    
    # Verificar archivos importantes
    print_header("📄 Archivos Importantes")
    
    files = [
        ("frontend/package.json", "Frontend package.json"),
        ("frontend/vite.config.ts", "Vite config"),
        ("frontend/tailwind.config.js", "Tailwind config"),
        ("backend/requirements.txt", "Backend requirements"),
        ("backend/main.py", "Backend main"),
        ("supabase/migrations/001_initial_schema.sql", "Database schema"),
        ("README.md", "README"),
    ]
    
    for file, desc in files:
        exists = check_file_exists(file, desc)
        all_good = all_good and exists
    
    # Verificar archivos .env
    print_header("🔐 Archivos de Configuración (.env)")
    
    frontend_env_exists = check_file_exists("frontend/.env", "Frontend .env")
    backend_env_exists = check_file_exists("backend/.env", "Backend .env")
    
    if frontend_env_exists:
        print("\n  Verificando variables del frontend...")
        frontend_vars = [
            "VITE_SUPABASE_URL",
            "VITE_SUPABASE_ANON_KEY",
            "VITE_API_URL"
        ]
        frontend_configured = check_env_vars("frontend/.env", frontend_vars)
        all_good = all_good and frontend_configured
    else:
        all_good = False
    
    if backend_env_exists:
        print("\n  Verificando variables del backend...")
        backend_vars = [
            "SUPABASE_URL",
            "SUPABASE_KEY",
            "SUPABASE_JWT_SECRET",
            "JWT_SECRET_KEY",
            "CORS_ORIGINS"
        ]
        backend_configured = check_env_vars("backend/.env", backend_vars)
        all_good = all_good and backend_configured
    else:
        all_good = False
    
    # Verificar dependencias
    print_header("📦 Dependencias")
    
    # Frontend
    frontend_installed = os.path.exists("frontend/node_modules")
    print(f"{check_mark(frontend_installed)} Frontend dependencies: {check_color('INSTALADAS' if frontend_installed else 'FALTANTES', 'green' if frontend_installed else 'yellow')}")
    if not frontend_installed:
        print(f"  {check_color('→ Ejecuta: cd frontend && npm install', 'yellow')}")
    
    # Backend
    backend_venv = os.path.exists("backend/venv")
    print(f"{check_mark(backend_venv)} Backend virtual environment: {check_color('CREADO' if backend_venv else 'FALTA', 'green' if backend_venv else 'yellow')}")
    if not backend_venv:
        print(f"  {check_color('→ Ejecuta: cd backend && python -m venv venv', 'yellow')}")
    
    # Resumen final
    print_header("📊 Resumen")
    
    if all_good and frontend_installed and backend_venv:
        print(f"{check_color('✓ ¡Todo está configurado correctamente!', 'green')}")
        print(f"\n{check_color('Próximos pasos:', 'blue')}")
        print("  1. Configurar base de datos en Supabase")
        print("  2. Ejecutar migración SQL")
        print("  3. Iniciar backend: cd backend && python main.py")
        print("  4. Iniciar frontend: cd frontend && npm run dev")
        print(f"\n{check_color('📚 Consulta SETUP.md para instrucciones detalladas', 'blue')}")
    else:
        print(f"{check_color('⚠ Hay elementos que necesitan atención (marcados arriba)', 'yellow')}")
        print(f"\n{check_color('Acciones requeridas:', 'yellow')}")
        
        if not frontend_env_exists or not backend_env_exists:
            print("  1. Crear archivos .env (ver .env.example)")
        if not frontend_installed:
            print("  2. Instalar dependencias del frontend: cd frontend && npm install")
        if not backend_venv:
            print("  3. Crear entorno virtual del backend: cd backend && python -m venv venv")
        
        print(f"\n{check_color('📚 Consulta SETUP.md para ayuda detallada', 'blue')}")
    
    print(f"\n{check_color('=' * 60, 'blue')}\n")
    
    return 0 if (all_good and frontend_installed and backend_venv) else 1

if __name__ == "__main__":
    sys.exit(main())

