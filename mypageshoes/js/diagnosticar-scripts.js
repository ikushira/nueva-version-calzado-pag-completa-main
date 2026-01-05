// diagnosticar-scripts.js
// Script para diagnosticar la situación actual de los scripts en cada página HTML
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(`Encontrados ${archivos.length} archivos HTML para diagnosticar`);

// Lista de todos los scripts de JavaScript
let todosLosScripts = new Set();
let scriptsPorArchivo = {};
let resumenScripts = {};

// Procesar cada archivo HTML
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    
    try {
        // Leer contenido del archivo
        let contenido = fs.readFileSync(rutaArchivo, 'utf8');
        
        // Buscar todos los scripts (tanto externos como en línea)
        let scriptsExternos = [];
        let scriptsEnLinea = 0;
        
        // Encontrar scripts externos
        const regexExternos = /<script[^>]*src="([^"]*)"[^>]*>.*?<\/script>/g;
        let coincidencia;
        
        while ((coincidencia = regexExternos.exec(contenido)) !== null) {
            const rutaScript = coincidencia[1];
            scriptsExternos.push(rutaScript);
            todosLosScripts.add(rutaScript);
            
            // Contabilizar en el resumen
            if (!resumenScripts[rutaScript]) {
                resumenScripts[rutaScript] = 1;
            } else {
                resumenScripts[rutaScript]++;
            }
        }
        
        // Encontrar scripts en línea
        const regexEnLinea = /<script\b(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/g;
        const coincidenciasEnLinea = contenido.match(regexEnLinea) || [];
        scriptsEnLinea = coincidenciasEnLinea.length;
        
        // Guardar información
        scriptsPorArchivo[archivo] = {
            scriptsExternos,
            scriptsEnLinea
        };
        
    } catch (error) {
        console.error(`❌ ${archivo}: Error al diagnosticar - ${error.message}`);
    }
});

// Generar reporte
let reporte = "# Diagnóstico de Scripts\n\n";
reporte += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
reporte += `## Resumen\n\n`;
reporte += `Total de archivos HTML: ${archivos.length}\n`;
reporte += `Total de scripts únicos: ${todosLosScripts.size}\n\n`;

// Ordenar los scripts por frecuencia
const scriptsOrdenados = Object.entries(resumenScripts)
    .sort((a, b) => b[1] - a[1]);

reporte += `## Scripts por frecuencia\n\n`;
scriptsOrdenados.forEach(([script, cantidad]) => {
    reporte += `- \`${script}\`: ${cantidad} páginas\n`;
});

// Detalles por archivo
reporte += `\n## Detalles por archivo\n\n`;

archivos.forEach(archivo => {
    const info = scriptsPorArchivo[archivo];
    reporte += `### ${archivo}\n\n`;
    
    if (info) {
        reporte += `- Scripts externos: ${info.scriptsExternos.length}\n`;
        reporte += `- Scripts en línea: ${info.scriptsEnLinea}\n\n`;
        
        if (info.scriptsExternos.length > 0) {
            reporte += "Scripts externos:\n";
            info.scriptsExternos.forEach(script => {
                reporte += `- \`${script}\`\n`;
            });
        }
    } else {
        reporte += "Error al procesar este archivo\n";
    }
    
    reporte += "\n";
});

// Análisis de dependencias de carrito
reporte += `## Análisis de scripts relacionados con el carrito\n\n`;

const scriptsCarrito = Array.from(todosLosScripts)
    .filter(script => script.includes('carrito'));

reporte += `Scripts relacionados con el carrito: ${scriptsCarrito.length}\n\n`;

scriptsCarrito.forEach(script => {
    reporte += `### ${script}\n\n`;
    
    // Listar páginas que usan este script
    const paginasQueUsan = Object.entries(scriptsPorArchivo)
        .filter(([_, info]) => info.scriptsExternos.includes(script))
        .map(([archivo, _]) => archivo);
    
    reporte += `Usado en ${paginasQueUsan.length} páginas:\n`;
    paginasQueUsan.forEach(pagina => {
        reporte += `- ${pagina}\n`;
    });
    
    reporte += "\n";
});

// Guardar reporte
fs.writeFileSync(path.join(directorio, 'diagnostico-scripts.md'), reporte);
console.log("Reporte de diagnóstico guardado en diagnostico-scripts.md");

// Detectar inconsistencias
console.log("\n=== ANÁLISIS DE INCONSISTENCIAS ===");

// Identificar archivos con diferentes conjuntos de scripts
const gruposPorScripts = {};

archivos.forEach(archivo => {
    const info = scriptsPorArchivo[archivo];
    if (!info) return;
    
    // Crear una clave única basada en los scripts usados
    const claveScripts = info.scriptsExternos.sort().join('|');
    
    if (!gruposPorScripts[claveScripts]) {
        gruposPorScripts[claveScripts] = [];
    }
    
    gruposPorScripts[claveScripts].push(archivo);
});

console.log(`Grupos de páginas con scripts idénticos: ${Object.keys(gruposPorScripts).length}`);

// Si hay más de un grupo, hay inconsistencias
if (Object.keys(gruposPorScripts).length > 1) {
    console.log("\nPáginas agrupadas por scripts idénticos:");
    
    Object.entries(gruposPorScripts).forEach(([_, grupo], index) => {
        console.log(`\nGrupo ${index + 1} (${grupo.length} páginas):`);
        grupo.forEach(pagina => console.log(`- ${pagina}`));
    });
}

// Analizar scripts de carrito en particular
console.log("\n=== ANÁLISIS DE SCRIPTS DE CARRITO ===");

const paginasConScriptsCarrito = {};

archivos.forEach(archivo => {
    const info = scriptsPorArchivo[archivo];
    if (!info) return;
    
    const scriptsCarritoEnPagina = info.scriptsExternos
        .filter(script => script.includes('carrito'));
    
    if (scriptsCarritoEnPagina.length > 0) {
        paginasConScriptsCarrito[archivo] = scriptsCarritoEnPagina;
    }
});

console.log(`Páginas con scripts de carrito: ${Object.keys(paginasConScriptsCarrito).length}`);

// Páginas con más de un script de carrito
const paginasMultiplesScriptsCarrito = Object.entries(paginasConScriptsCarrito)
    .filter(([_, scripts]) => scripts.length > 1)
    .map(([archivo, scripts]) => ({ archivo, cantidadScripts: scripts.length }));

if (paginasMultiplesScriptsCarrito.length > 0) {
    console.log("\nPáginas con múltiples scripts de carrito:");
    paginasMultiplesScriptsCarrito.forEach(info => 
        console.log(`- ${info.archivo}: ${info.cantidadScripts} scripts de carrito`)
    );
}

// Recomendar acciones
console.log("\n=== RECOMENDACIONES ===");
console.log("1. Ejecute el script 'limpiar-y-simplificar-scripts.js' para unificar todos los scripts de carrito");
console.log("2. Revise el reporte en 'diagnostico-scripts.md' para ver más detalles");
console.log("3. Si hay scripts en línea, considere ejecutar 'extraer-scripts-en-linea.js' para mejorar la mantenibilidad");
