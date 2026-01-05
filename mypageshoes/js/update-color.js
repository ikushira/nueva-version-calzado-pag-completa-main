// Script para actualizar todas las ocurrencias del color #ff3131 a #ff0000
// Ejecutar con Node.js: node update-color.js

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos CSS
const directorio = path.join(__dirname, 'css');

// Obtener todos los archivos CSS
const archivosCss = fs.readdirSync(directorio).filter(archivo => 
  archivo.endsWith('.css')
);

console.log(`Encontrados ${archivosCss.length} archivos CSS para actualizar`);

// Procesar cada archivo
archivosCss.forEach(archivo => {
  const rutaArchivo = path.join(directorio, archivo);
  
  try {
    // Leer el contenido del archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Buscar todas las ocurrencias de #ff3131 (sin distinguir entre mayúsculas y minúsculas)
    const regex = /#ff3131/gi;
    const ocurrencias = contenido.match(regex);
    
    if (ocurrencias && ocurrencias.length > 0) {
      console.log(`Encontradas ${ocurrencias.length} ocurrencias de #ff3131 en ${archivo}`);
      
      // Reemplazar todas las ocurrencias
      let nuevoContenido = contenido.replace(regex, '#ff0000');
      
      // Guardar el archivo actualizado
      fs.writeFileSync(rutaArchivo, nuevoContenido);
      console.log(`✅ Actualizado: ${archivo}`);
    } else {
      console.log(`⏭️ No se encontraron ocurrencias en: ${archivo}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${archivo}:`, error);
  }
});

console.log('Proceso de actualización de color completado.');
