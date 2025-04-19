#!/bin/bash

# Script de configuración para ambiente de desarrollo en macOS
# Este script configura y arranca la aplicación con toda la funcionalidad de producción

# Colores para mejor legibilidad
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Configuración de Ambiente de Desarrollo - macOS ===${NC}"
echo -e "${BLUE}=== Aplicación de Eventos Culturales con Prisma y PostgreSQL ===${NC}"
echo

# Verificar si Homebrew está instalado
echo -e "${YELLOW}Verificando si Homebrew está instalado...${NC}"
if ! command -v brew &> /dev/null; then
    echo -e "${RED}Homebrew no está instalado. Instalando...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo -e "${GREEN}Homebrew ya está instalado.${NC}"
fi

# Verificar si Bun está instalado
echo -e "${YELLOW}Verificando si Bun está instalado...${NC}"
if ! command -v bun &> /dev/null; then
    echo -e "${RED}Bun no está instalado. Instalando...${NC}"
    brew tap oven-sh/bun
    brew install bun
else
    echo -e "${GREEN}Bun ya está instalado.${NC}"
fi

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}No se encontró el archivo package.json. Asegúrate de ejecutar este script en el directorio del proyecto.${NC}"
    exit 1
fi

# Instalar dependencias
echo -e "${YELLOW}Instalando dependencias del proyecto...${NC}"
bun install
echo -e "${GREEN}Dependencias instaladas correctamente.${NC}"

# Verificar archivo .env
echo -e "${YELLOW}Verificando configuración de base de datos...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}No se encontró el archivo .env. Creando uno con la configuración de la base de datos...${NC}"
    cat > .env << EOF
DATABASE_URL="postgresql://evaniie_db_owner:npg_0PRgx4cXSTIl@ep-yellow-tooth-a48xk9l7-pooler.us-east-1.aws.neon.tech/evaniie_db?sslmode=require"
EOF
    echo -e "${GREEN}Archivo .env creado.${NC}"
else
    echo -e "${GREEN}Archivo .env ya existe.${NC}"
fi

# Aplicar migraciones de Prisma
echo -e "${YELLOW}Aplicando migraciones de Prisma...${NC}"
bunx prisma db push
echo -e "${GREEN}Migraciones aplicadas.${NC}"

# Generar cliente de Prisma
echo -e "${YELLOW}Generando cliente de Prisma...${NC}"
bunx prisma generate
echo -e "${GREEN}Cliente de Prisma generado.${NC}"

# Ejecutar script de seed para poblar la base de datos con datos de prueba
echo -e "${YELLOW}¿Deseas poblar la base de datos con eventos de prueba? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
    echo -e "${YELLOW}Ejecutando script de seed para poblar la base de datos...${NC}"
    bun run db:seed-events
    echo -e "${GREEN}Base de datos poblada con eventos de prueba.${NC}"
else
    echo -e "${BLUE}Omitiendo poblado de la base de datos.${NC}"
fi

# Generando compilación de producción
echo -e "${YELLOW}Generando compilación de producción...${NC}"
bun run build
echo -e "${GREEN}Compilación de producción generada correctamente.${NC}"

# Iniciar servidor de desarrollo
echo -e "${YELLOW}¿Cómo deseas iniciar el servidor? (Selecciona una opción)${NC}"
echo "1) Modo desarrollo (bun run dev)"
echo "2) Modo producción (bun run start)"
read -r start_option

if [ "$start_option" = "1" ]; then
    echo -e "${BLUE}Iniciando servidor en modo desarrollo...${NC}"
    echo -e "${GREEN}¡Servidor iniciado! Abre http://localhost:3000 en tu navegador.${NC}"
    bun run dev
elif [ "$start_option" = "2" ]; then
    echo -e "${BLUE}Iniciando servidor en modo producción...${NC}"
    echo -e "${GREEN}¡Servidor iniciado! Abre http://localhost:3000 en tu navegador.${NC}"
    bun run start
else
    echo -e "${RED}Opción no válida. Iniciando en modo desarrollo por defecto.${NC}"
    echo -e "${GREEN}¡Servidor iniciado! Abre http://localhost:3000 en tu navegador.${NC}"
    bun run dev
fi
