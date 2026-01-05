// extraer-scripts-en-linea.js
// Script para extraer scripts en línea de los archivos HTML y moverlos a archivos separados
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(`Encontrados ${archivos.length} archivos HTML para extraer scripts`);

let scriptsExtraidos = 0;
let archivosModificados = [];

// Crear directorio para scripts extraídos si no existe
const dirScriptsExtraidos = path.join(directorio, 'js', 'scripts_extraidos');
if (!fs.existsSync(dirScriptsExtraidos)) {
    fs.mkdirSync(dirScriptsExtraidos, { recursive: true });
}

// Procesar cada archivo HTML
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    const nombreBase = path.basename(archivo, '.html');
    
    try {
        // Leer contenido del archivo
        let contenido = fs.readFileSync(rutaArchivo, 'utf8');
        const contenidoOriginal = contenido;
        
        // Buscar scripts en línea (que no sean referencias a archivos externos)
        const regex = /<script\b(?![^>]*src=)[^>]*>([sS]*?)<\/script>/g;
        let coincidencia;
        let contador = 0;
        let modificado = false;
        
        // Usar un conjunto para evitar duplicados
        const scriptsUnicos = new Set();
        
        // Reemplazar cada script en línea
        while ((coincidencia = regex.exec(contenido)) !== null) {
            const scriptCompleto = coincidencia[0];
            const contenidoScript = coincidencia[1].trim();
            
            // Saltear scripts vacíos o muy cortos
            if (contenidoScript.length < 10) continue;
            
            // Usar un hash del contenido para detectar duplicados
            const hashScript = Buffer.from(contenidoScript).toString('base64').substring(0, 20);
            if (scriptsUnicos.has(hashScript)) continue;
            scriptsUnicos.add(hashScript);
            
            // Crear nombre de archivo para el script
            contador++;
            const nombreArchivo = `${nombreBase}_script_${contador}.js`;
            const rutaScriptExtraido = path.join(dirScriptsExtraidos, nombreArchivo);
            
            // Guardar el script en un archivo separado
            fs.writeFileSync(rutaScriptExtraido, contenidoScript);
            scriptsExtraidos++;
            
            // Reemplazar el script en línea con una referencia al archivo
            contenido = contenido.replace(
                scriptCompleto,
                `<script src="js/scripts_extraidos/${nombreArchivo}"></script>`
            );
            
            modificado = true;
            console.log(`✅ ${archivo}: Script #${contador} extraído a ${nombreArchivo}`);
        }
        
        // Guardar cambios si hubo modificaciones
        if (modificado) {
            fs.writeFileSync(rutaArchivo, contenido, 'utf8');
            archivosModificados.push({ archivo, scriptCount: contador });
        }
    } catch (error) {
        console.error(`❌ ${archivo}: Error al extraer scripts - ${error.message}`);
    }
});

console.log("\n=== RESUMEN DE EXTRACCIÓN ===");
console.log(`Total de scripts extraídos: ${scriptsExtraidos}`);
console.log(`Archivos modificados: ${archivosModificados.length}`);

if (archivosModificados.length > 0) {
    console.log("\nDetalle de archivos modificados:");
    archivosModificados.forEach(item => 
        console.log(`- ${item.archivo}: ${item.scriptCount} scripts extraídos`)
    );
}
