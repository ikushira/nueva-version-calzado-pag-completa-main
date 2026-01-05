// script-verificar-implementacion.js
// Script para verificar que todas las páginas HTML tengan la corrección de tarjetas
const fs = require('fs');
const path = require('path');

// Directorio raíz del proyecto
const rootDir = path.resolve(__dirname, '..');

// Buscar todos los archivos HTML
const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

console.log(`Encontrados ${htmlFiles.length} archivos HTML para verificar`);

// Resultados
const resultados = {
  conCorreccion: [],
  sinCorreccion: []
};

// Verificar cada archivo HTML
htmlFiles.forEach(htmlFile => {
    const filePath = path.join(rootDir, htmlFile);
    
    try {
        // Leer el contenido del archivo
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si el archivo incluye la corrección de tarjetas
        if (content.includes('carrito-tarjetas-fix.js')) {
            resultados.conCorreccion.push(htmlFile);
            
            // Verificar si hay duplicados
            const matches = content.match(/carrito-tarjetas-fix\.js/g);
            if (matches && matches.length > 1) {
                console.log(`⚠️ ${htmlFile}: Tiene ${matches.length} referencias a carrito-tarjetas-fix.js (posible duplicación)`);
                
                // Corregir duplicación
                let contentCorregido = content;
                let primeraAparicion = contentCorregido.indexOf('carrito-tarjetas-fix.js');
                let segundaAparicion = contentCorregido.indexOf('carrito-tarjetas-fix.js', primeraAparicion + 1);
                
                while (segundaAparicion !== -1) {
                    // Buscar la etiqueta script completa
                    const inicioTag = contentCorregido.lastIndexOf('<script', segundaAparicion);
                    const finTag = contentCorregido.indexOf('</script>', segundaAparicion) + 9;
                    
                    if (inicioTag !== -1 && finTag !== -1) {
                        // Eliminar la etiqueta duplicada
                        contentCorregido = 
                            contentCorregido.substring(0, inicioTag) + 
                            contentCorregido.substring(finTag);
                        
                        console.log(`🔧 ${htmlFile}: Eliminada referencia duplicada a carrito-tarjetas-fix.js`);
                        
                        // Actualizar para la próxima iteración
                        segundaAparicion = contentCorregido.indexOf('carrito-tarjetas-fix.js', primeraAparicion + 1);
                    } else {
                        break;
                    }
                }
                
                // Guardar los cambios si hubo modificaciones
                if (contentCorregido !== content) {
                    fs.writeFileSync(filePath, contentCorregido, 'utf8');
                    console.log(`✅ ${htmlFile}: Archivo actualizado, duplicados eliminados`);
                }
            }
        } else {
            resultados.sinCorreccion.push(htmlFile);
            console.log(`❌ ${htmlFile}: No incluye la corrección de tarjetas`);
            
            // Aplicar la corrección
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
            let contentCorregido = content;
            
            // Intentar insertar después de cada script de carrito
            for (const script of carritoScripts) {
                if (contentCorregido.includes(script) && !updated) {
                    contentCorregido = contentCorregido.replace(
                        new RegExp(`<script src="js/${script}"></script>`),
                        `<script src="js/${script}"></script>\n  <script src="js/carrito-tarjetas-fix.js"></script>`
                    );
                    updated = true;
                    console.log(`🔧 ${htmlFile}: Corrección de tarjetas añadida después de ${script}`);
                    break;
                }
            }
            
            // Si no se ha actualizado, buscar justo antes del cierre del body
            if (!updated) {
                contentCorregido = contentCorregido.replace(
                    '</body>',
                    '  <script src="js/carrito-tarjetas-fix.js"></script>\n</body>'
                );
                console.log(`🔧 ${htmlFile}: Corrección de tarjetas añadida antes del cierre del body`);
                updated = true;
            }
            
            // Guardar los cambios
            if (updated) {
                fs.writeFileSync(filePath, contentCorregido, 'utf8');
                console.log(`✅ ${htmlFile}: Archivo actualizado`);
                resultados.conCorreccion.push(htmlFile);
                resultados.sinCorreccion.pop();
            }
        }
    } catch (error) {
        console.error(`❌ Error al procesar ${htmlFile}: ${error.message}`);
    }
});

// Mostrar resumen
console.log("\n=== RESUMEN DE VERIFICACIÓN ===");
console.log(`Total de archivos HTML: ${htmlFiles.length}`);
console.log(`Archivos con corrección: ${resultados.conCorreccion.length}`);

if (resultados.sinCorreccion.length > 0) {
    console.log(`Archivos sin corrección: ${resultados.sinCorreccion.length}`);
    console.log("Archivos faltantes:");
    resultados.sinCorreccion.forEach(file => console.log(`- ${file}`));
} else {
    console.log("✅ ÉXITO: Todos los archivos tienen la corrección implementada correctamente");
}
