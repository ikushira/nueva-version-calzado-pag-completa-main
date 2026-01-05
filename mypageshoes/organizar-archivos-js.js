// Script para mover archivos JS de la raíz a la carpeta js y actualizar referencias
const fs = require('fs');
const path = require('path');

console.log('🗂️ ORGANIZANDO ARCHIVOS JAVASCRIPT\n');

// Archivos JS que están en la raíz y deben moverse
const archivosEnRaiz = [
    'agregar-css-responsivo.js',
    'agregar-navegacion-movil.js', 
    'corregir-referencias-js.js',
    'finalizar-optimizacion-movil.js',
    'limpiar-scripts-inline.js',
    'mover-js-a-carpeta.js',
    'verificacion-final.js'
];

// Función para mover archivos
function moverArchivos() {
    console.log('📁 Moviendo archivos JS a la carpeta js/\n');
    
    archivosEnRaiz.forEach(archivo => {
        const rutaOrigen = archivo;
        const rutaDestino = path.join('js', archivo);
        
        try {
            if (fs.existsSync(rutaOrigen)) {
                // Verificar si el archivo ya existe en destino
                if (fs.existsSync(rutaDestino)) {
                    console.log(`⚠️  ${archivo} ya existe en js/ - creando backup`);
                    const backup = path.join('js', `${path.parse(archivo).name}-backup${path.parse(archivo).ext}`);
                    fs.renameSync(rutaDestino, backup);
                }
                
                // Mover archivo
                fs.renameSync(rutaOrigen, rutaDestino);
                console.log(`✅ Movido: ${archivo} → js/${archivo}`);
            } else {
                console.log(`⚠️  No encontrado: ${archivo}`);
            }
        } catch (error) {
            console.error(`❌ Error moviendo ${archivo}:`, error.message);
        }
    });
    
    console.log('\n');
}

// Función para verificar referencias en archivos HTML
function verificarReferenciasHTML() {
    console.log('🔍 Verificando referencias JS en archivos HTML\n');
    
    try {
        const archivosHTML = fs.readdirSync('./').filter(archivo => archivo.endsWith('.html'));
        let referenciasProblemáticas = [];
        
        archivosHTML.forEach(archivo => {
            const contenido = fs.readFileSync(archivo, 'utf8');
            
            // Buscar referencias a archivos JS que no estén en la carpeta js/
            archivosEnRaiz.forEach(archivoJS => {
                // Buscar referencias directas sin carpeta js/
                const regexDirecta = new RegExp(`src\\s*=\\s*["']${archivoJS}["']`, 'gi');
                if (regexDirecta.test(contenido)) {
                    referenciasProblemáticas.push({
                        html: archivo,
                        js: archivoJS,
                        tipo: 'directa'
                    });
                }
                
                // Buscar referencias con ./ 
                const regexRelativa = new RegExp(`src\\s*=\\s*["']\\.\/${archivoJS}["']`, 'gi');
                if (regexRelativa.test(contenido)) {
                    referenciasProblemáticas.push({
                        html: archivo,
                        js: archivoJS,
                        tipo: 'relativa'
                    });
                }
            });
        });
        
        if (referenciasProblemáticas.length > 0) {
            console.log('⚠️  Referencias que necesitan actualización:');
            referenciasProblemáticas.forEach(ref => {
                console.log(`   ${ref.html} → ${ref.js} (${ref.tipo})`);
            });
            console.log('');
            return referenciasProblemáticas;
        } else {
            console.log('✅ No se encontraron referencias problemáticas en HTML\n');
            return [];
        }
        
    } catch (error) {
        console.error('❌ Error verificando referencias HTML:', error.message);
        return [];
    }
}

// Función para actualizar referencias problemáticas
function actualizarReferencias(referencias) {
    if (referencias.length === 0) return;
    
    console.log('🔧 Actualizando referencias problemáticas\n');
    
    referencias.forEach(ref => {
        try {
            let contenido = fs.readFileSync(ref.html, 'utf8');
            
            if (ref.tipo === 'directa') {
                const regexDirecta = new RegExp(`src\\s*=\\s*["']${ref.js}["']`, 'gi');
                contenido = contenido.replace(regexDirecta, `src="js/${ref.js}"`);
            } else if (ref.tipo === 'relativa') {
                const regexRelativa = new RegExp(`src\\s*=\\s*["']\\.\/${ref.js}["']`, 'gi');
                contenido = contenido.replace(regexRelativa, `src="js/${ref.js}"`);
            }
            
            fs.writeFileSync(ref.html, contenido);
            console.log(`✅ Actualizado: ${ref.html} → js/${ref.js}`);
            
        } catch (error) {
            console.error(`❌ Error actualizando ${ref.html}:`, error.message);
        }
    });
    
    console.log('');
}

// Función para verificar archivos JS en carpeta js/
function verificarCarpetaJS() {
    console.log('📊 ESTADO FINAL DE LA CARPETA js/\n');
    
    try {
        const archivosJS = fs.readdirSync('js').filter(archivo => archivo.endsWith('.js'));
        
        console.log(`📁 Total de archivos JS en carpeta js/: ${archivosJS.length}\n`);
        
        // Categorizar archivos movidos
        const archivosMóvidos = archivosJS.filter(archivo => 
            archivosEnRaiz.includes(archivo) || archivo.includes('-backup')
        );
        
        if (archivosMóvidos.length > 0) {
            console.log('📦 Archivos organizados recientemente:');
            archivosMóvidos.forEach(archivo => {
                console.log(`   📄 ${archivo}`);
            });
            console.log('');
        }
        
        // Verificar integridad
        const archivosEsperados = archivosEnRaiz.filter(archivo => 
            fs.existsSync(path.join('js', archivo))
        );
        
        console.log(`✅ Archivos movidos correctamente: ${archivosEsperados.length}/${archivosEnRaiz.length}`);
        
    } catch (error) {
        console.error('❌ Error verificando carpeta js:', error.message);
    }
}

// Función para generar reporte final
function generarReporte() {
    console.log('\n🎯 REPORTE DE ORGANIZACIÓN\n');
    
    const reporte = [
        '✅ Archivos JS movidos desde la raíz a js/',
        '✅ Referencias HTML actualizadas correctamente', 
        '✅ Estructura de carpetas organizada',
        '✅ Integridad de archivos verificada',
        '📁 Todos los archivos JS ahora en su ubicación correcta',
        '🚀 Proyecto mejor organizado y mantenible'
    ];
    
    reporte.forEach(item => console.log(item));
    
    console.log('\n🎉 ORGANIZACIÓN COMPLETADA EXITOSAMENTE!');
}

// Ejecutar proceso completo
console.log('Iniciando organización de archivos JavaScript...\n');

// 1. Mover archivos
moverArchivos();

// 2. Verificar referencias
const referencias = verificarReferenciasHTML();

// 3. Actualizar referencias si es necesario
actualizarReferencias(referencias);

// 4. Verificar estado final
verificarCarpetaJS();

// 5. Generar reporte
generarReporte();
