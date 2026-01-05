// actualizar-todas-paginas.js
// Script para actualizar todas las referencias de carrito-tarjetas-fix.js a carrito-tarjetas-fix-v2.js

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(`Encontrados ${archivos.length} archivos HTML para actualizar`);

let actualizados = 0;
let sinReferencia = 0;
let yaActualizados = 0;

// Procesar cada archivo
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    
    // Leer contenido del archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Verificar si contiene la referencia antigua
    if (contenido.includes('carrito-tarjetas-fix.js')) {
        // Reemplazar todas las ocurrencias
        const contenidoActualizado = contenido.replace(
            /carrito-tarjetas-fix\.js/g,
            'carrito-tarjetas-fix-v2.js'
        );
        
        // Guardar archivo actualizado
        fs.writeFileSync(rutaArchivo, contenidoActualizado, 'utf8');
        console.log(`✅ ${archivo}: Referencia actualizada`);
        actualizados++;
    } 
    // Verificar si ya tiene la referencia nueva
    else if (contenido.includes('carrito-tarjetas-fix-v2.js')) {
        console.log(`ℹ️ ${archivo}: Ya tiene la referencia actualizada`);
        yaActualizados++;
    } 
    // No tiene ninguna referencia
    else {
        console.log(`⚠️ ${archivo}: No incluye referencia al script de carrito-tarjetas-fix`);
        sinReferencia++;
    }
});

console.log("\n=== RESUMEN DE ACTUALIZACIÓN ===");
console.log(`Total de archivos HTML: ${archivos.length}`);
console.log(`Archivos actualizados: ${actualizados}`);
console.log(`Archivos ya actualizados previamente: ${yaActualizados}`);
console.log(`Archivos sin referencia: ${sinReferencia}`);
