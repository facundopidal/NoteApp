# Backend - NoteApp

API RESTful construida con NestJS y Prisma.

## Estructura y convenciones

- Modularización por dominio: `auth`, `user`, `group`, `note`, `prisma`.
- DTOs y validaciones para cada endpoint.
- Prisma como ORM, migraciones versionadas.
- Control de errores: siempre se responde con mensajes claros y status HTTP adecuados.
- Nombres de entidades y campos en inglés, lógica de dominio en español si aplica.

## Comandos útiles

- `npm install` — Instala dependencias.
- `npm run start:dev` — Levanta el servidor en modo desarrollo.
- `npx prisma migrate dev` — Aplica migraciones a la base de datos.
- `npx prisma studio` — Interfaz visual para la base de datos.

## Convenciones de endpoints

- `/auth/*` — Autenticación y registro.
- `/group/*` — CRUD de grupos, validación de unicidad por usuario.
- `/note/*` — CRUD de notas, siempre asociadas a un grupo y usuario.

## Buenas prácticas

- No exponer información sensible en los errores.
- Validar siempre los datos recibidos.
- Mantener la lógica de negocio en los servicios, no en los controladores.
- Documentar endpoints y flujos complejos aquí.

---

Para detalles globales, ver el README en la raíz del proyecto.
