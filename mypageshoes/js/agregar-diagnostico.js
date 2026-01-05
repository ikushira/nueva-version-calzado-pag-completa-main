// Script para agregar el script de diagnóstico a todos los HTML
// Este script recorre todos los archivos HTML en el directorio y agrega el script de diagnóstico
// Ejecutar con Node.js: node agregar-diagnostico.js

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
    
    // Buscar la línea donde está el script tallas.js
    if (contenido.includes('tallas.js')) {
      // Verificar si ya tiene el script de diagnóstico
      if (!contenido.includes('diagnostico-tallas.js')) {
        // Reemplazar el script de tallas para añadir el de diagnóstico
        let nuevoContenido = contenido.replace(
          /<script src="js\/tallas.js"><\/script>/g,
          '<script src="js/tallas.js"></script>\n  <script src="js/diagnostico-tallas.js"></script>'
        );
        
        // Guardar el archivo actualizado
        fs.writeFileSync(rutaArchivo, nuevoContenido);
        console.log(`✅ Actualizado: ${archivo}`);
      } else {
        console.log(`⏭️ Ya actualizado: ${archivo}`);
      }
    } else {
      console.log(`⚠️ No se encontró tallas.js en: ${archivo}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${archivo}:`, error);
  }
});

console.log('Proceso completado.');
