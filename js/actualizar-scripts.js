// Script para actualizar todos los HTML con los nuevos scripts
// Este script recorre todos los archivos HTML en el directorio y agrega los nuevos scripts
// Ejecutar con Node.js: node actualizar-scripts.js

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const directorio = __dirname;

// Obtener todos los archivos HTML
const archivosHTML = fs.readdirSync(directorio).filter(archivo => 
  archivo.endsWith('.html') && 
  !['prueba-tallas.html', 'limpiar-carrito.html', 'diagnostico-carrito.html'].includes(archivo)
);

console.log(`Encontrados ${archivosHTML.length} archivos HTML para actualizar`);

// Procesar cada archivo
archivosHTML.forEach(archivo => {
  const rutaArchivo = path.join(directorio, archivo);
  
  try {
    // Leer el contenido del archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Buscar la línea donde está el script carrito.js
    if (contenido.includes('carrito.js')) {
      // Verificar si ya tiene los nuevos scripts
      if (!contenido.includes('tallas.js')) {
        // Reemplazar el script de carrito para añadir los nuevos scripts
        let nuevoContenido = contenido.replace(
          /<script src="js\/carrito.js"><\/script>/g,
          '<script src="js/carrito.js"></script>\n  <script src="js/tallas.js"></script>'
        );
        
        // Guardar el archivo actualizado
        fs.writeFileSync(rutaArchivo, nuevoContenido);
        console.log(`✅ Actualizado: ${archivo}`);
      } else {
        console.log(`⏭️ Ya actualizado: ${archivo}`);
      }
    } else {
      console.log(`⚠️ No se encontró carrito.js en: ${archivo}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${archivo}:`, error);
  }
});

console.log('Proceso completado.');
