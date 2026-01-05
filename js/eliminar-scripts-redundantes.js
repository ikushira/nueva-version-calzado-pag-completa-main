// eliminar-scripts-redundantes.js
// Script para eliminar scripts redundantes del sistema
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Scripts relacionados con el carrito que deben ser eliminados
const scriptsAEliminar = [
    'carrito.js',
    'carrito-tarjetas-fix.js',
    'carrito-tarjetas-fix-v2.js',
    'carrito-fix.js',
    'carrito-fix-radical.js',
    'carrito-fix-radical-v2.js',
    'carrito-visualizacion-fix.js',
    'carrito-correccion-final.js',
    'carrito-ui-enhanced.js',
    'carrito-ui-enhanced-v2.js',
    'diagnostico-carrito.js',
    'diagnostico-carrito-tarjetas.js',
    'carrito-inicializacion.js',
    'carrito-fix-definitivo.js',
    'carrito-fix-radical-v2.js',
    'carrito-debug.js'
];

console.log("=== ELIMINANDO SCRIPTS REDUNDANTES ===");

// Ruta al directorio de scripts
const directorioScripts = path.join('.', 'js');

// Verificar si existe el directorio de scripts
if (!fs.existsSync(directorioScripts)) {
    console.error(`El directorio ${directorioScripts} no existe`);
    process.exit(1);
}

// Crear directorio de backup
const directorioBackup = path.join(directorioScripts, 'backup_scripts');
if (!fs.existsSync(directorioBackup)) {
    fs.mkdirSync(directorioBackup);
    console.log(`Directorio de backup creado: ${directorioBackup}`);
}

// Contador de scripts eliminados
let eliminados = 0;

// Eliminar cada script
scriptsAEliminar.forEach(script => {
    const rutaScript = path.join(directorioScripts, script);
    
    if (fs.existsSync(rutaScript)) {
        try {
            // Crear backup
            const rutaBackup = path.join(directorioBackup, script);
            fs.copyFileSync(rutaScript, rutaBackup);
            
            // Eliminar archivo original
            fs.unlinkSync(rutaScript);
            
            eliminados++;
            console.log(`✅ ${script}: Eliminado (backup creado)`);
        } catch (error) {
            console.error(`❌ ${script}: Error al eliminar - ${error.message}`);
        }
    } else {
        console.log(`ℹ️ ${script}: No encontrado`);
    }
});

console.log(`\nTotal de scripts eliminados: ${eliminados}`);
console.log(`Se han creado copias de seguridad en: ${directorioBackup}`);
console.log("\nSi necesita restaurar algún script, puede copiarlo desde el directorio de backup.");
