// Este script aplica la corrección radical del carrito a todas las páginas HTML

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
    
    // Verificar si ya incluye el archivo de corrección radical
    if (contenido.includes('carrito-fix-radical.js')) {
        console.log(`✓ ${archivo} ya tiene la corrección radical aplicada`);
        return;
    }
    
    // Verificar si incluye carrito.js
    if (!contenido.includes('carrito.js')) {
        console.log(`⚠ ${archivo} no incluye carrito.js, saltando`);
        return;
    }
    
    // Reemplazar el script de corrección anterior con el radical
    if (contenido.includes('carrito-fix.js')) {
        contenido = contenido.replace(
            '<script src="js/carrito-fix.js"></script>', 
            '<script src="js/carrito-fix-radical.js"></script>'
        );
        console.log(`✅ ${archivo} actualizado de fix a fix-radical`);
    } else {
        // Si no tiene el fix anterior, agregar el radical después de carrito.js
        contenido = contenido.replace(
            '<script src="js/carrito.js"></script>', 
            '<script src="js/carrito.js"></script>\n  <script src="js/carrito-fix-radical.js"></script>'
        );
        console.log(`✅ ${archivo} modificado para incluir fix-radical`);
    }
    
    // Guardar el archivo modificado
    fs.writeFileSync(rutaArchivo, contenido, 'utf8');
});

console.log('Proceso completado');
