// Este script aplica la corrección del carrito a todas las páginas HTML

const fs = require('fs');
const path = require('path');

// Directorio principal
const directorio = __dirname;

// Buscar todos los archivos HTML
const archivosHTML = fs.readdirSync(directorio).filter(archivo => 
    archivo.endsWith('.html') && 
    archivo !== 'diagnostico-tarjetas.html' && 
    archivo !== 'verificar-tarjetas.html'
);

console.log(`Encontrados ${archivosHTML.length} archivos HTML para modificar`);

// Procesar cada archivo
archivosHTML.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Verificar si ya incluye el archivo de corrección
    if (contenido.includes('carrito-fix.js')) {
        console.log(`✓ ${archivo} ya tiene la corrección aplicada`);
        return;
    }
    
    // Verificar si incluye carrito.js
    if (!contenido.includes('carrito.js')) {
        console.log(`⚠ ${archivo} no incluye carrito.js, saltando`);
        return;
    }
    
    // Reemplazar la inclusión de carrito.js para agregar la corrección después
    contenido = contenido.replace(
        '<script src="js/carrito.js"></script>', 
        '<script src="js/carrito.js"></script>\n  <script src="js/carrito-fix.js"></script>'
    );
    
    // Guardar el archivo modificado
    fs.writeFileSync(rutaArchivo, contenido, 'utf8');
    console.log(`✅ ${archivo} modificado correctamente`);
});

console.log('Proceso completado');
