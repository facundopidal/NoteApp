# NoteApp

Proyecto fullstack para tomar notas, con autenticación, grupos y edición enriquecida.

## Estructura del proyecto

- `/frontend`: Aplicación Angular (SPA) para la UI.
- `/backend`: API RESTful con NestJS y Prisma.
- `docker-compose.yml`: Orquestación de servicios para desarrollo y despliegue.

## Instalación y ejecución rápida

1. Clona el repositorio.
2. Instala dependencias en cada subcarpeta (`frontend` y `backend`).
3. Usa `docker compose up` para levantar todo en desarrollo.

## Convenciones y formas de trabajo

- **Frontend**: Angular signals para estado, servicios centralizados, componentes standalone, estilos con Tailwind y clases utilitarias.
- **Backend**: NestJS modular, DTOs para validación, Prisma para acceso a datos, control de errores consistente (BadRequestException, etc).
- **Autenticación**: JWT, guardas en backend, manejo de sesión y refresh token en frontend (en progreso).
- **Errores**: Siempre se muestran en la UI, con fade-out automático.
- **Grupos**: No se pueden duplicar nombres por usuario, ni eliminar grupos con notas.
- **Notas**: CRUD completo, edición enriquecida con dile-editor.

## Buenas prácticas

- Mantener la UI sincronizada con el backend tras cualquier error.
- Usar signals y servicios para el estado global.
- Documentar endpoints y flujos complejos en los README de cada subproyecto.

## Cómo usar Docker Compose en desarrollo y producción

El archivo `docker-compose.yml` es un template comentado. Para alternar entre desarrollo y producción:

- **Producción (por defecto):**

  - Usa `Dockerfile` y puertos estándar (80 para frontend, 3000 para backend).
  - No montes volúmenes ni uses hot reload.
  - Comando de arranque: Nginx para frontend, Node para backend.

- **Desarrollo:**
  1. Cambia en `docker-compose.yml`:
     - `dockerfile: Dockerfile` → `dockerfile: Dockerfile.dev`
     - `ports: ["80:80"]` → `ports: ["4200:4200", "49153:49153"]` para frontend
     - Descomenta la sección `volumes` para frontend y backend
     - Cambia `NODE_ENV=production` → `NODE_ENV=development`
     - Cambia el comando a `npm run start` (frontend) y `npm run start:dev` (backend)
  2. Ejecuta:
     ```bash
     docker compose up --build
     ```

Así puedes alternar fácilmente entre entornos editando solo unas líneas.

## Contacto y soporte

Para dudas o mejoras, abre un issue o contacta al autor.
