# Instrucciones para desplegar en Vercel

Para desplegar este proyecto en Vercel, sigue estos pasos:

## 1. Preparar el proyecto para Vercel

Ya hemos configurado los siguientes archivos necesarios para Vercel:
- `vercel.json` - Configuración para Vercel
- `.env.example` - Ejemplo de variables de entorno (no subir el .env original)
- Modificado `package.json` con comandos específicos para Vercel

## 2. Importar el proyecto en Vercel

1. Ir a [vercel.com](https://vercel.com) e iniciar sesión
2. Haz clic en "Add New..." > "Project"
3. Importa el repositorio de GitHub: `https://github.com/Gudrum/evaniie_app_events`
4. Configura el proyecto:
   - Build Command: `prisma generate && next build --no-lint`
   - Output Directory: `.next` (esta es la configuración por defecto)
   - Install Command: `npm install`

## 3. Configurar variables de entorno

En Vercel, añade la siguiente variable de entorno (usa tus propias credenciales de base de datos):

```
DATABASE_URL=postgresql://evaniie_db_owner:npg_0PRgx4cXSTIl@ep-yellow-tooth-a48xk9l7-pooler.us-east-1.aws.neon.tech/evaniie_db?sslmode=require
```

## 4. Desplegar

Haz clic en "Deploy" y espera a que se complete el proceso.

## Solución de problemas comunes

- **Error de Prisma**: Asegúrate de que el comando `prisma generate` se ejecute como parte del build.
- **Error de módulos no encontrados**: Verifica que todas las dependencias estén correctamente instaladas.
- **Error de variables de entorno**: Comprueba que todas las variables de entorno necesarias estén configuradas en Vercel.

## Notas adicionales

- Este proyecto utiliza Neon Postgres como base de datos. Asegúrate de que tu base de datos esté configurada y accesible.
- La aplicación usará la misma base de datos que en desarrollo, a menos que configures una base de datos separada para producción.
