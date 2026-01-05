// Script para añadir la corrección universal de tarjetas a todas las páginas HTML
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
    
    // Verificar si el archivo ya incluye la corrección de tarjetas
    if (content.includes('carrito-tarjetas-fix.js')) {
        console.log(`${htmlFile}: Ya incluye la corrección de tarjetas, no se requieren cambios`);
        return;
    }
    
    // Buscar donde insertar la corrección de tarjetas (después del último script de carrito)
    const carritoScripts = [
        'carrito-correccion-final.js',
        'carrito-visualizacion-fix.js',
        'carrito-ui-enhanced-v2.js',
        'carrito-ui-enhanced.js',
        'carrito-fix-radical-v2.js',
        'carrito-fix-radical.js',
        'carrito-fix.js',
        'carrito.js'
    ];
    
    let updated = false;
    
    // Intentar insertar después de cada script de carrito, comenzando por los más específicos
    for (const script of carritoScripts) {
        if (content.includes(script) && !updated) {
            content = content.replace(
                new RegExp(`<script src="js/${script}"></script>`),
                `<script src="js/${script}"></script>\n  <script src="js/carrito-tarjetas-fix.js"></script>`
            );
            updated = true;
            console.log(`✅ ${htmlFile}: Corrección de tarjetas añadida después de ${script}`);
            break;
        }
    }
    
    // Si no se ha actualizado, buscar justo antes del cierre del body
    if (!updated) {
        content = content.replace(
            '</body>',
            '  <script src="js/carrito-tarjetas-fix.js"></script>\n</body>'
        );
        console.log(`✅ ${htmlFile}: Corrección de tarjetas añadida antes del cierre del body`);
        updated = true;
    }
    
    // Guardar los cambios
    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        filesUpdated++;
    }
});

console.log(`\nResumen:\n- Total archivos HTML: ${htmlFiles.length}\n- Archivos actualizados: ${filesUpdated}`);
console.log('Proceso completado.');
