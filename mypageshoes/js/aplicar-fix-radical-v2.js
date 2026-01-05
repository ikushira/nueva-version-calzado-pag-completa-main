// Script para aplicar la nueva solución radical v2 a todas las páginas HTML
// Actualizar todas las páginas HTML para incluir nuestro nuevo script y eliminar el anterior

const fs = require('fs');
const path = require('path');

// Directorio raíz del proyecto
const rootDir = __dirname;

// Buscar todos los archivos HTML
const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

console.log(`Encontrados ${htmlFiles.length} archivos HTML para actualizar`);

// Contador de archivos actualizados
let filesUpdated = 0;

// Procesar cada archivo HTML
htmlFiles.forEach(htmlFile => {
    const filePath = path.join(rootDir, htmlFile);
    
    // Leer el contenido del archivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si el archivo ya incluye el nuevo script
    if (content.includes('carrito-fix-radical-v2.js')) {
        console.log(`${htmlFile}: Ya incluye la solución v2, no se requieren cambios`);
        return;
    }
    
    // Buscar la línea donde se incluye el script anterior
    if (content.includes('carrito-fix-radical.js')) {
        // Reemplazar el script anterior por el nuevo
        content = content.replace(
            /<script src="js\/carrito-fix-radical\.js"><\/script>/g,
            '<script src="js/carrito-fix-radical-v2.js"></script>'
        );
        
        // Guardar los cambios
        fs.writeFileSync(filePath, content, 'utf8');
        
        filesUpdated++;
        console.log(`✅ ${htmlFile}: Actualizado correctamente`);
    } else {
        // Si no encuentra el script anterior, lo añade después del script de carrito.js
        if (content.includes('carrito.js')) {
            content = content.replace(
                /<script src="js\/carrito\.js"><\/script>/g,
                '<script src="js/carrito.js"></script>\n  <script src="js/carrito-fix-radical-v2.js"></script>'
            );
            
            // Guardar los cambios
            fs.writeFileSync(filePath, content, 'utf8');
            
            filesUpdated++;
            console.log(`✅ ${htmlFile}: Añadido script radical v2 después de carrito.js`);
        } else {
            console.log(`⚠️ ${htmlFile}: No se encontró carrito.js ni carrito-fix-radical.js para reemplazar`);
        }
    }
});

console.log(`\nResumen:\n- Total archivos HTML: ${htmlFiles.length}\n- Archivos actualizados: ${filesUpdated}`);
console.log('Proceso completado.');
