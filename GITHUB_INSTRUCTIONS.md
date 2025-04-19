# Instrucciones para subir a GitHub

El repositorio ha sido inicializado y configurado para subir a GitHub. Para completar la subida, debes:

## Opción 1: Conectar tu cuenta de GitHub en Same

1. Haz clic en el icono de Git en la esquina superior derecha de la interfaz de Same
2. Conéctate a GitHub siguiendo los pasos mostrados
3. Una vez conectado, ejecuta en la terminal:
   ```bash
   cd prisma-postgres-app
   git push -u origin main
   ```

## Opción 2: Subir desde tu computadora local

1. Descarga el proyecto usando el botón de descarga en Same
2. Descomprime el archivo en tu computadora
3. Abre una terminal en la carpeta del proyecto
4. Ejecuta los siguientes comandos:
   ```bash
   git init
   git add .
   git commit -m "Versión inicial: Evaniie - Plataforma de gestión de eventos"
   git branch -M main
   git remote add origin https://github.com/Gudrum/evaniie_app_events.git
   git push -u origin main
   ```

Una vez completado, tu proyecto estará disponible en: https://github.com/Gudrum/evaniie_app_events
