# Frontend - NoteApp

SPA construida en Angular 17+.

## Estructura y convenciones

- Componentes standalone y modulares.
- Estado global con signals y servicios (DashboardState).
- Comunicación con backend vía servicios (HttpClient).
- Manejo de errores centralizado, con modal y fade-out automático.
- Estilos: Tailwind CSS + utilidades personalizadas.
- Nombres y textos en español para la UI.
- Editor enriquecido: dile-editor (web component).

## Comandos útiles

- `npm install` — Instala dependencias.
- `npm start` — Levanta el servidor de desarrollo.
- `npm run build` — Compila para producción.

## Flujo de trabajo

1. Login (JWT).
2. Selección/creación de grupo.
3. CRUD de notas dentro de cada grupo.
4. Sincronización de estado tras errores.

## Buenas prácticas

- No modificar el estado directamente, usar signals y métodos del servicio.
- Documentar cambios relevantes en este README.
- Mantener la UI sincronizada con el backend.

---

Para detalles globales, ver el README en la raíz del proyecto.
