// Script para limpiar todos los scripts inline de los archivos HTML
// y crear archivos JS organizados para cada uno

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const directorio = './';

// Función para extraer scripts inline de un archivo HTML
function extraerScriptsInline(contenido, nombreArchivo) {
    const regex = /<script(?:[^>]*)>([\s\S]*?)<\/script>/gi;
    const scripts = [];
    let match;
    
    while ((match = regex.exec(contenido)) !== null) {
        const scriptContent = match[1].trim();
        if (scriptContent && !scriptContent.includes('src=') && scriptContent.length > 50) {
            scripts.push({
                contenido: scriptContent,
                original: match[0]
            });
        }
    }
    
    return scripts;
}

// Función para crear archivo JS desde script inline
function crearArchivoJS(scriptContent, nombreArchivo) {
    const nombreJS = nombreArchivo.replace('.html', '-inline.js');
    const rutaJS = path.join('js', nombreJS);
    
    // Crear contenido del archivo JS con header
    const contenidoJS = `/**
 * ${nombreJS}
 * Script extraído de ${nombreArchivo}
 * Convertido de script inline a archivo separado
 */

(function() {
    'use strict';
    
    // Código original del script inline
    ${scriptContent}
    
})();`;

    return { rutaJS, contenidoJS, nombreJS };
}

// Función para procesar un archivo HTML
function procesarArchivo(archivo) {
    const rutaCompleta = path.join(directorio, archivo);
    
    try {
        let contenido = fs.readFileSync(rutaCompleta, 'utf8');
        
        // Extraer scripts inline
        const scripts = extraerScriptsInline(contenido, archivo);
        
        if (scripts.length === 0) {
            console.log(`✓ ${archivo} - No tiene scripts inline`);
            return;
        }
        
        console.log(`🔧 ${archivo} - Encontrados ${scripts.length} scripts inline`);
        
        let contenidoModificado = contenido;
        const archivosJS = [];
        
        // Procesar cada script
        scripts.forEach((script, index) => {
            const { rutaJS, contenidoJS, nombreJS } = crearArchivoJS(script.contenido, archivo);
            
            // Crear archivo JS
            try {
                fs.writeFileSync(rutaJS, contenidoJS, 'utf8');
                archivosJS.push(nombreJS);
                console.log(`  📄 Creado: ${rutaJS}`);
            } catch (error) {
                console.error(`  ✗ Error creando ${rutaJS}:`, error.message);
                return;
            }
            
            // Reemplazar script inline con referencia al archivo
            const scriptTag = `<script src="js/${nombreJS}"></script>`;
            contenidoModificado = contenidoModificado.replace(script.original, scriptTag);
        });
        
        // Escribir archivo HTML modificado
        fs.writeFileSync(rutaCompleta, contenidoModificado, 'utf8');
        
        console.log(`✓ ${archivo} - Scripts convertidos a archivos JS: ${archivosJS.join(', ')}`);
        
    } catch (error) {
        console.error(`✗ Error procesando ${archivo}:`, error.message);
    }
}

// Función principal
function limpiarScriptsInline() {
    console.log('🧹 Iniciando limpieza de scripts inline...\n');
    
    try {
        // Verificar que existe la carpeta js
        if (!fs.existsSync('js')) {
            fs.mkdirSync('js');
            console.log('📁 Carpeta js creada\n');
        }
        
        // Obtener archivos HTML
        const archivos = fs.readdirSync(directorio);
        const archivosHTML = archivos.filter(archivo => 
            archivo.endsWith('.html') && 
            !archivo.startsWith('demo-') && 
            !archivo.startsWith('test-') &&
            !archivo.startsWith('diagnostico-') &&
            !archivo.startsWith('prueba-')
        );
        
        console.log(`📋 Procesando ${archivosHTML.length} archivos HTML:\n`);
        
        // Procesar cada archivo
        archivosHTML.forEach(procesarArchivo);
        
        console.log('\n🎉 Limpieza completada!');
        console.log('📝 Todos los scripts inline han sido convertidos a archivos JS separados.');
        console.log('🗂️ Los archivos están organizados en la carpeta js/');
        
    } catch (error) {
        console.error('❌ Error en la limpieza:', error.message);
    }
}

// Función para verificar problemas después de la limpieza
function verificarProblemas() {
    console.log('\n🔍 Verificando posibles problemas...\n');
    
    try {
        const archivos = fs.readdirSync(directorio);
        const archivosHTML = archivos.filter(archivo => archivo.endsWith('.html'));
        
        let problemasEncontrados = 0;
        
        archivosHTML.forEach(archivo => {
            const rutaCompleta = path.join(directorio, archivo);
            const contenido = fs.readFileSync(rutaCompleta, 'utf8');
            
            // Buscar scripts inline restantes
            const regex = /<script(?:[^>]*)>([\s\S]*?)<\/script>/gi;
            let match;
            const scriptsRestantes = [];
            
            while ((match = regex.exec(contenido)) !== null) {
                const scriptContent = match[1].trim();
                if (scriptContent && !scriptContent.includes('src=') && scriptContent.length > 20) {
                    scriptsRestantes.push(scriptContent.substring(0, 100) + '...');
                }
            }
            
            if (scriptsRestantes.length > 0) {
                console.log(`⚠️  ${archivo} - Aún tiene ${scriptsRestantes.length} scripts inline`);
                problemasEncontrados++;
            }
        });
        
        if (problemasEncontrados === 0) {
            console.log('✅ No se encontraron scripts inline restantes');
        } else {
            console.log(`⚠️  Se encontraron scripts inline en ${problemasEncontrados} archivos`);
        }
        
    } catch (error) {
        console.error('Error en verificación:', error.message);
    }
}

// Ejecutar limpieza
limpiarScriptsInline();

// Verificar resultados
setTimeout(verificarProblemas, 1000);
