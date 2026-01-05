// verificar-implementacion-carrito.js
// Script para verificar que todas las páginas tengan la implementación correcta del carrito

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML principales (excluyendo archivos de diagnóstico)
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => 
        archivo.endsWith('.html') && 
        !archivo.includes('diagnostico') && 
        !archivo.includes('verificar') && 
        !archivo.includes('prueba') && 
        !archivo.includes('demo')
    );

console.log(`Encontrados ${archivos.length} archivos HTML principales para verificar`);

let correctos = 0;
let problematicos = 0;
let paginas = {
    scriptCarrito: [],
    scriptCarritoTarjetasFixV2: [],
    problemasDetectados: []
};

// Verificar cada archivo
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    
    // Leer contenido del archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    let problemas = [];
    
    // Verificar carrito.js
    if (!contenido.includes('carrito.js')) {
        problemas.push('Falta carrito.js');
    } else {
        paginas.scriptCarrito.push(archivo);
    }
    
    // Verificar carrito-tarjetas-fix-v2.js
    if (!contenido.includes('carrito-tarjetas-fix-v2.js')) {
        // Si es una página que debería tener tarjetas de productos
        if (['mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 'colegiales.html', 
             'dotacion.html', 'accesorios.html', 'marcas.html', 'nuevos.html', 'ofertas.html', 
             'index.html'].includes(archivo)) {
            problemas.push('Falta carrito-tarjetas-fix-v2.js (necesario para tarjetas de productos)');
        }
    } else {
        paginas.scriptCarritoTarjetasFixV2.push(archivo);
    }
    
    // Verificar orden de carga
    if (contenido.includes('carrito.js') && contenido.includes('carrito-tarjetas-fix-v2.js')) {
        const posCarrito = contenido.indexOf('carrito.js');
        const posTarjetasFix = contenido.indexOf('carrito-tarjetas-fix-v2.js');
        
        if (posCarrito > posTarjetasFix) {
            problemas.push('Orden incorrecto: carrito-tarjetas-fix-v2.js debe cargarse después de carrito.js');
        }
    }
    
    // Verificar duplicados
    if (contenido.match(/carrito\.js/g)?.length > 1) {
        problemas.push(`carrito.js incluido múltiples veces (${contenido.match(/carrito\.js/g).length})`);
    }
    
    if (contenido.match(/carrito-tarjetas-fix-v2\.js/g)?.length > 1) {
        problemas.push(`carrito-tarjetas-fix-v2.js incluido múltiples veces (${contenido.match(/carrito-tarjetas-fix-v2\.js/g).length})`);
    }
    
    // Resumir hallazgos
    if (problemas.length > 0) {
        console.log(`❌ ${archivo}: Problemas detectados`);
        problemas.forEach(p => console.log(`  - ${p}`));
        problematicos++;
        paginas.problemasDetectados.push({archivo, problemas});
    } else {
        console.log(`✅ ${archivo}: Implementación correcta`);
        correctos++;
    }
});

console.log("\n=== RESUMEN DE VERIFICACIÓN ===");
console.log(`Total de archivos HTML principales: ${archivos.length}`);
console.log(`Archivos con implementación correcta: ${correctos}`);
console.log(`Archivos con problemas: ${problematicos}`);
console.log(`Archivos con carrito.js: ${paginas.scriptCarrito.length}`);
console.log(`Archivos con carrito-tarjetas-fix-v2.js: ${paginas.scriptCarritoTarjetasFixV2.length}`);

if (problematicos > 0) {
    console.log("\n=== PROBLEMAS DETECTADOS ===");
    paginas.problemasDetectados.forEach(item => {
        console.log(`Archivo: ${item.archivo}`);
        item.problemas.forEach(p => console.log(`  - ${p}`));
    });
}
