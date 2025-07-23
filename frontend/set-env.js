const fs = require("fs");
const path = require("path");

// Obtenemos la URL de la API desde las variables de entorno de Netlify
const apiUrl = process.env.NG_APP_API_URL;
if (!apiUrl) {
  console.error(
    "Error: La variable de entorno NG_APP_API_URL no está definida."
  );
  process.exit(1);
}

console.log(`La URL del API para producción es: ${apiUrl}`);

const templatePath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.prod.template.ts"
);
const targetPath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.prod.ts"
);

// Leemos la plantilla
fs.readFile(templatePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error leyendo el archivo de plantilla:", err);
    return process.exit(1);
  }

  // Reemplazamos el marcador de posición con el valor real
  const result = data.replace(/__API_URL__/g, apiUrl);

  // Escribimos el archivo final que usará Angular
  fs.writeFile(targetPath, result, "utf8", (err) => {
    if (err) {
      console.error(
        "Error escribiendo el archivo de entorno de producción:",
        err
      );
      return process.exit(1);
    }
    console.log(`Archivo ${targetPath} generado exitosamente.`);
  });
});
