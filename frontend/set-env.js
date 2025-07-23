const fs = require("fs");
const path = require("path");

const apiUrl = process.env.NG_APP_API_URL;
if (!apiUrl) {
  console.error(
    "Error: La variable de entorno NG_APP_API_URL no está definida."
  );
  process.exit(1);
}

console.log(`La URL del API para producción es: ${apiUrl}`);

// El contenido que tendrá el archivo de entorno final
const environmentContent = `
   export const environment = {
     production: true,
     apiUrl: '${apiUrl}'
   };
   `;

// La ruta al archivo de entorno que Angular usa por defecto
const targetPath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.ts"
);

// Escribimos directamente sobre el archivo environment.ts
fs.writeFile(targetPath, environmentContent, "utf8", (err) => {
  if (err) {
    console.error("Error escribiendo el archivo de entorno:", err);
    return process.exit(1);
  }
  console.log(
    `Archivo ${targetPath} configurado para producción exitosamente.`
  );
});
