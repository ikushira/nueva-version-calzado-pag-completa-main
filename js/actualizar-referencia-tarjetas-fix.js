// actualizar-referencia-tarjetas-fix.js
// Script para actualizar la referencia al archivo carrito-tarjetas-fix.js por la versión v2
const fs = require('fs');
const path = require('path');

// Directorio raíz del proyecto
const rootDir = path.resolve(__dirname, '..');

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
    
    // Verificar si el archivo incluye la referencia a carrito-tarjetas-fix.js
    if (content.includes('carrito-tarjetas-fix.js')) {
        // Reemplazar la referencia por la nueva versión
        content = content.replace(
            /carrito-tarjetas-fix\.js/g,
            'carrito-tarjetas-fix-v2.js'
        );
        
        // Guardar los cambios
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ ${htmlFile}: Referencia actualizada a carrito-tarjetas-fix-v2.js`);
        filesUpdated++;
    } else {
        console.log(`⚠️ ${htmlFile}: No incluye referencia a carrito-tarjetas-fix.js`);
    }
});

console.log(`\nResumen:\n- Total archivos HTML: ${htmlFiles.length}\n- Archivos actualizados: ${filesUpdated}`);
console.log('Proceso completado.');
