// Script para actualizar todas las páginas con los nuevos estilos mejorados
// Este script agrega la referencia a enhanced-shopping.css en todos los archivos HTML
// Utiliza una paleta de colores basada en rojo #ff0000
// Ejecutar con Node.js: node update-enhanced-styles.js

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
    
    // Agregar referencia a la nueva hoja de estilos si no existe
    if (!contenido.includes('enhanced-shopping.css') && contenido.includes('new-colors.css')) {
      let nuevoContenido = contenido.replace(
        '<link rel="stylesheet" href="css/new-colors.css">',
        '<link rel="stylesheet" href="css/new-colors.css">\n  <link rel="stylesheet" href="css/enhanced-shopping.css">'
      );
      
      // Guardar el archivo actualizado
      fs.writeFileSync(rutaArchivo, nuevoContenido);
      console.log(`✅ Actualizado: ${archivo}`);
    } else if (!contenido.includes('enhanced-shopping.css') && contenido.includes('styles.css')) {
      // Si no tiene new-colors.css pero sí styles.css
      let nuevoContenido = contenido.replace(
        '<link rel="stylesheet" href="css/styles.css">',
        '<link rel="stylesheet" href="css/styles.css">\n  <link rel="stylesheet" href="css/new-colors.css">\n  <link rel="stylesheet" href="css/enhanced-shopping.css">'
      );
      
      // Guardar el archivo actualizado
      fs.writeFileSync(rutaArchivo, nuevoContenido);
      console.log(`✅ Actualizado (completo): ${archivo}`);
    } else {
      console.log(`⏭️ No se requieren cambios en: ${archivo}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${archivo}:`, error);
  }
});

console.log('Proceso completado.');
