This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Evaniie - Plataforma de Gestión de Eventos

Evaniie es una plataforma moderna para la gestión de eventos, que permite a los organizadores crear, publicar y gestionar eventos de todo tipo, así como procesar inscripciones y administrar participantes.

## Características

- Dashboard completo para la gestión de eventos
- Creación y edición de eventos con múltiples opciones de configuración
- Categorización de eventos por tipo y temática
- Gestión de inscripciones y participantes
- Publicación de eventos para visualización pública
- Interfaz intuitiva y responsive

## Tecnologías

- Next.js 15
- React
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Tailwind CSS
- Shadcn UI

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Gudrum/evaniie_app_events.git
cd evaniie_app_events

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos

# Configurar la base de datos
bun run db:setup

# Iniciar el servidor de desarrollo
bun run dev
```

## Uso

Accede al dashboard de administración en `/dashboard` para gestionar todos los aspectos de tus eventos.

## Requisitos

- Node.js 18+ (recomendado usar LTS)
- Bun 1.0+
- Acceso a la base de datos Neon PostgreSQL (o configurar una propia)
- macOS, Linux o Windows con WSL

## Configuración para desarrollo en macOS

Hemos incluido un script para configurar fácilmente el ambiente de desarrollo en macOS:

```bash
# Hacer el script ejecutable
chmod +x setup-dev-macos.sh

# Ejecutar el script
./setup-dev-macos.sh
```

Este script realizará las siguientes acciones:
1. Verificar e instalar Homebrew si es necesario
2. Verificar e instalar Bun si es necesario
3. Instalar dependencias del proyecto
4. Verificar y configurar el archivo `.env`
5. Aplicar migraciones de Prisma
6. Generar el cliente de Prisma
7. Opcionalmente, poblar la base de datos con eventos de prueba
8. Generar una compilación de producción
9. Iniciar el servidor (desarrollo o producción)

## Configuración manual

Si prefieres configurar manualmente o estás en un sistema operativo diferente, sigue estos pasos:

1. Clona el repositorio:
```bash
git clone <url-repositorio>
cd prisma-postgres-app
```

2. Instala las dependencias:
```bash
bun install
```

3. Configura el archivo `.env` con la URL de tu base de datos:
```
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/basededatos?sslmode=require"
```

4. Aplica las migraciones de Prisma:
```bash
bunx prisma db push
```

5. Genera el cliente de Prisma:
```bash
bunx prisma generate
```

6. (Opcional) Puebla la base de datos con eventos de prueba:
```bash
bun run db:seed-events
```

7. Inicia el servidor de desarrollo:
```bash
bun run dev
```

La aplicación estará disponible en http://localhost:3000

## Estructura del proyecto

```
prisma-postgres-app/
├── prisma/                 # Configuración de Prisma y migraciones
│   ├── schema.prisma       # Esquema de la base de datos
│   ├── seed.ts             # Script para poblar usuarios iniciales
│   └── seed-events.ts      # Script para poblar eventos de prueba
├── public/                 # Archivos estáticos
├── src/
│   ├── app/                # Rutas de Next.js
│   │   ├── api/            # Endpoints de API
│   │   ├── eventos/        # Rutas de eventos
│   │   └── ...
│   ├── components/         # Componentes React
│   ├── lib/                # Utilidades y funciones
│   └── ...
├── setup-dev-macos.sh      # Script de configuración para macOS
└── ...
```

## Modos de funcionamiento

La aplicación incluye un modo de respaldo con datos de ejemplo que se activa automáticamente cuando hay problemas con la conexión a la base de datos. Esto garantiza que la aplicación siempre muestre contenido al usuario, incluso si hay problemas temporales con la base de datos.

## Endpoints API

La aplicación incluye los siguientes endpoints API:

- `GET /api/events` - Lista todos los eventos
- `GET /api/users` - Lista todos los usuarios
- `POST /api/events/[id]/register` - Registrarse para un evento

## Licencia

MIT

## Desarrollado por

Gudrum
