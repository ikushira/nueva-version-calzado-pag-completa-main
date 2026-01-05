// Script para actualizar todas las páginas con la nueva paleta de colores
// Este script cambia las clases de blue-theme a red-theme en todos los archivos HTML
// La nueva paleta utiliza #ff0000 como color base
// Ejecutar con Node.js: node update-color-theme.js

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const directorio = __dirname;

// Obtener todos los archivos HTML
const archivosHTML = fs.readdirSync(directorio).filter(archivo => 
  archivo.endsWith('.html')
);

console.log(`Encontrados ${archivosHTML.length} archivos HTML para actualizar`);

// Procesar cada archivo
archivosHTML.forEach(archivo => {
  const rutaArchivo = path.join(directorio, archivo);
  
  try {
    // Leer el contenido del archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Reemplazar blue-theme por red-theme
    let nuevoContenido = contenido.replace(/blue-theme/g, 'red-theme');
    
    // Agregar referencia a la nueva hoja de estilos si no existe
    if (!nuevoContenido.includes('new-colors.css') && nuevoContenido.includes('<link rel="stylesheet" href="css/styles.css">')) {
      nuevoContenido = nuevoContenido.replace(
        '<link rel="stylesheet" href="css/styles.css">',
        '<link rel="stylesheet" href="css/styles.css">\n  <link rel="stylesheet" href="css/new-colors.css">'
      );
    }
    
    // Guardar el archivo actualizado si hay cambios
    if (nuevoContenido !== contenido) {
      fs.writeFileSync(rutaArchivo, nuevoContenido);
      console.log(`✅ Actualizado: ${archivo}`);
    } else {
      console.log(`⏭️ No se requieren cambios en: ${archivo}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${archivo}:`, error);
  }
});

console.log('Proceso completado.');
