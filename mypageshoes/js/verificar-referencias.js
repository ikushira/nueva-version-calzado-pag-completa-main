// verificar-referencias.js
// Script para verificar que todas las páginas tengan la referencia correcta a carrito-tarjetas-fix-v2.js
const fs = require('fs');
const path = require('path');

// Directorio raíz del proyecto
const rootDir = path.resolve(__dirname, '..');

// Buscar todos los archivos HTML
const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

console.log(`Encontrados ${htmlFiles.length} archivos HTML para verificar`);

// Resultados
const resultados = {
  correcto: [],
  conVieja: [],
  sinReferencia: [],
  duplicados: []
};

// Verificar cada archivo HTML
htmlFiles.forEach(htmlFile => {
    const filePath = path.join(rootDir, htmlFile);
    
    try {
        // Leer el contenido del archivo
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar referencia antigua
        if (content.includes('carrito-tarjetas-fix.js')) {
            resultados.conVieja.push(htmlFile);
            console.log(`❌ ${htmlFile}: Todavía contiene referencia a carrito-tarjetas-fix.js`);
            
            // Corregir la referencia
            const contentCorregido = content.replace(
                /carrito-tarjetas-fix\.js/g,
                'carrito-tarjetas-fix-v2.js'
            );
            
            // Guardar los cambios
            fs.writeFileSync(filePath, contentCorregido, 'utf8');
            console.log(`✅ ${htmlFile}: Referencia actualizada a carrito-tarjetas-fix-v2.js`);
        }
        
        // Verificar referencia nueva
        if (content.includes('carrito-tarjetas-fix-v2.js')) {
            resultados.correcto.push(htmlFile);
            
            // Verificar duplicados
            const matches = content.match(/carrito-tarjetas-fix-v2\.js/g);
            if (matches && matches.length > 1) {
                resultados.duplicados.push(htmlFile);
                console.log(`⚠️ ${htmlFile}: Tiene ${matches.length} referencias a carrito-tarjetas-fix-v2.js (posible duplicación)`);
                
                // Corregir duplicación
                let contentCorregido = content;
                let primeraAparicion = contentCorregido.indexOf('carrito-tarjetas-fix-v2.js');
                let segundaAparicion = contentCorregido.indexOf('carrito-tarjetas-fix-v2.js', primeraAparicion + 1);
                
                while (segundaAparicion !== -1) {
                    // Buscar la etiqueta script completa
                    const inicioTag = contentCorregido.lastIndexOf('<script', segundaAparicion);
                    const finTag = contentCorregido.indexOf('</script>', segundaAparicion) + 9;
                    
                    if (inicioTag !== -1 && finTag !== -1) {
                        // Eliminar la etiqueta duplicada
                        contentCorregido = 
                            contentCorregido.substring(0, inicioTag) + 
                            contentCorregido.substring(finTag);
                        
                        console.log(`🔧 ${htmlFile}: Eliminada referencia duplicada a carrito-tarjetas-fix-v2.js`);
                        
                        // Actualizar para la próxima iteración
                        segundaAparicion = contentCorregido.indexOf('carrito-tarjetas-fix-v2.js', primeraAparicion + 1);
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
        } else if (!content.includes('carrito-tarjetas-fix.js')) {
            resultados.sinReferencia.push(htmlFile);
            console.log(`ℹ️ ${htmlFile}: No incluye ninguna referencia a carrito-tarjetas-fix`);
        }
    } catch (error) {
        console.error(`❌ Error al procesar ${htmlFile}: ${error.message}`);
    }
});

// Mostrar resumen
console.log("\n=== RESUMEN DE VERIFICACIÓN ===");
console.log(`Total de archivos HTML: ${htmlFiles.length}`);
console.log(`Archivos con referencia correcta: ${resultados.correcto.length}`);
console.log(`Archivos con referencia antigua: ${resultados.conVieja.length}`);
console.log(`Archivos sin ninguna referencia: ${resultados.sinReferencia.length}`);
console.log(`Archivos con duplicados: ${resultados.duplicados.length}`);

if (resultados.conVieja.length > 0) {
    console.log("\nArchivos con referencia antigua:");
    resultados.conVieja.forEach(file => console.log(`- ${file}`));
}

if (resultados.sinReferencia.length > 0) {
    console.log("\nArchivos sin ninguna referencia:");
    resultados.sinReferencia.forEach(file => console.log(`- ${file}`));
}

if (resultados.duplicados.length > 0) {
    console.log("\nArchivos con duplicados:");
    resultados.duplicados.forEach(file => console.log(`- ${file}`));
}
