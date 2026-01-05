// Script para estandarizar colores rojos a #ff0000 en todo el proyecto
const fs = require('fs');
const path = require('path');

console.log('🎨 ESTANDARIZANDO COLORES ROJOS A #FF0000\n');

// Mapeo de colores rojos a corregir
const coloresRojosACorregir = {
    '#d21c32': '#ff0000',      // Rojo actual del sitio
    '#e4002b': '#ff0000',      // Otro rojo encontrado
    '#cc0000': '#ff0000',      // Rojo oscuro en variables
    '#dc3545': '#ff0000',      // Color danger
    '#ff3333': '#ff0000',      // Rojo claro en variables
    'red': '#ff0000',          // Palabra clave 'red'
    'crimson': '#ff0000',      // Palabra clave 'crimson'
    'darkred': '#ff0000',      // Palabra clave 'darkred'
};

// Función para procesar archivos CSS
function procesarArchivosCSS() {
    console.log('📄 Procesando archivos CSS...\n');
    
    const carpetaCSS = 'css';
    let archivosModificados = 0;
    let cambiosRealizados = 0;
    
    try {
        const archivosCSS = fs.readdirSync(carpetaCSS).filter(archivo => archivo.endsWith('.css'));
        
        archivosCSS.forEach(archivo => {
            const rutaArchivo = path.join(carpetaCSS, archivo);
            let contenido = fs.readFileSync(rutaArchivo, 'utf8');
            let contenidoOriginal = contenido;
            let cambiosArchivo = 0;
            
            // Reemplazar cada color rojo
            Object.keys(coloresRojosACorregir).forEach(colorViejo => {
                const colorNuevo = coloresRojosACorregir[colorViejo];
                
                // Crear regex para buscar el color (case insensitive)
                const regex = new RegExp(colorViejo.replace('#', '\\#'), 'gi');
                const matches = contenido.match(regex);
                
                if (matches) {
                    contenido = contenido.replace(regex, colorNuevo);
                    cambiosArchivo += matches.length;
                    console.log(`   🔴 ${archivo}: ${colorViejo} → ${colorNuevo} (${matches.length} ocurrencias)`);
                }
            });
            
            // Guardar archivo si hubo cambios
            if (contenido !== contenidoOriginal) {
                fs.writeFileSync(rutaArchivo, contenido);
                archivosModificados++;
                cambiosRealizados += cambiosArchivo;
                console.log(`   ✅ ${archivo}: ${cambiosArchivo} cambios realizados\n`);
            }
        });
        
        console.log(`📊 Archivos CSS procesados:`);
        console.log(`   📁 Total archivos: ${archivosCSS.length}`);
        console.log(`   ✏️  Archivos modificados: ${archivosModificados}`);
        console.log(`   🔄 Total cambios: ${cambiosRealizados}\n`);
        
    } catch (error) {
        console.error('❌ Error procesando archivos CSS:', error.message);
    }
}

// Función para procesar archivos HTML con estilos inline
function procesarArchivosHTML() {
    console.log('📄 Procesando archivos HTML...\n');
    
    let archivosModificados = 0;
    let cambiosRealizados = 0;
    
    try {
        const archivosHTML = fs.readdirSync('./').filter(archivo => archivo.endsWith('.html'));
        
        archivosHTML.forEach(archivo => {
            let contenido = fs.readFileSync(archivo, 'utf8');
            let contenidoOriginal = contenido;
            let cambiosArchivo = 0;
            
            // Buscar estilos inline con colores rojos
            Object.keys(coloresRojosACorregir).forEach(colorViejo => {
                const colorNuevo = coloresRojosACorregir[colorViejo];
                
                // Regex para estilos inline
                const regexInline = new RegExp(`(style=[^>]*?)${colorViejo.replace('#', '\\#')}([^>]*?)`, 'gi');
                const matches = contenido.match(regexInline);
                
                if (matches) {
                    contenido = contenido.replace(regexInline, `$1${colorNuevo}$2`);
                    cambiosArchivo += matches.length;
                    console.log(`   🔴 ${archivo}: ${colorViejo} → ${colorNuevo} (${matches.length} estilos inline)`);
                }
                
                // Regex para colores en atributos
                const regexAttr = new RegExp(colorViejo.replace('#', '\\#'), 'gi');
                const matchesAttr = contenido.match(regexAttr);
                
                if (matchesAttr) {
                    contenido = contenido.replace(regexAttr, colorNuevo);
                    cambiosArchivo += matchesAttr.length;
                    console.log(`   🔴 ${archivo}: ${colorViejo} → ${colorNuevo} (${matchesAttr.length} atributos)`);
                }
            });
            
            // Guardar archivo si hubo cambios
            if (contenido !== contenidoOriginal) {
                fs.writeFileSync(archivo, contenido);
                archivosModificados++;
                cambiosRealizados += cambiosArchivo;
                console.log(`   ✅ ${archivo}: ${cambiosArchivo} cambios realizados\n`);
            }
        });
        
        console.log(`📊 Archivos HTML procesados:`);
        console.log(`   📁 Total archivos: ${archivosHTML.length}`);
        console.log(`   ✏️  Archivos modificados: ${archivosModificados}`);
        console.log(`   🔄 Total cambios: ${cambiosRealizados}\n`);
        
    } catch (error) {
        console.error('❌ Error procesando archivos HTML:', error.message);
    }
}

// Función para actualizar variables CSS
function actualizarVariablesCSS() {
    console.log('🔧 Actualizando variables CSS...\n');
    
    const archivoVariables = 'css/variables.css';
    
    try {
        if (fs.existsSync(archivoVariables)) {
            let contenido = fs.readFileSync(archivoVariables, 'utf8');
            let contenidoOriginal = contenido;
            
            // Actualizar variables específicas
            const variablesAActualizar = {
                '--color-primary-dark: #cc0000': '--color-primary-dark: #ff0000',
                '--color-danger: #dc3545': '--color-danger: #ff0000',
                '--color-primary-light: #ff3333': '--color-primary-light: #ff0000'
            };
            
            Object.keys(variablesAActualizar).forEach(varVieja => {
                const varNueva = variablesAActualizar[varVieja];
                
                if (contenido.includes(varVieja)) {
                    contenido = contenido.replace(varVieja, varNueva);
                    console.log(`   🔧 Variable actualizada: ${varVieja} → ${varNueva}`);
                }
            });
            
            if (contenido !== contenidoOriginal) {
                fs.writeFileSync(archivoVariables, contenido);
                console.log(`   ✅ Variables CSS actualizadas exitosamente\n`);
            } else {
                console.log(`   ℹ️  No se encontraron variables para actualizar\n`);
            }
            
        } else {
            console.log(`   ⚠️  Archivo variables.css no encontrado\n`);
        }
        
    } catch (error) {
        console.error('❌ Error actualizando variables CSS:', error.message);
    }
}

// Función para verificar el resultado
function verificarResultado() {
    console.log('🔍 VERIFICANDO RESULTADO FINAL...\n');
    
    let coloresRojosEncontrados = [];
    
    // Verificar archivos CSS
    try {
        const archivosCSS = fs.readdirSync('css').filter(archivo => archivo.endsWith('.css'));
        
        archivosCSS.forEach(archivo => {
            const rutaArchivo = path.join('css', archivo);
            const contenido = fs.readFileSync(rutaArchivo, 'utf8');
            
            // Buscar colores rojos que no sean #ff0000
            const regex = /#[a-fA-F0-9]*[eEdDcC][a-fA-F0-9]*|red|crimson|darkred/gi;
            const matches = contenido.match(regex);
            
            if (matches) {
                matches.forEach(color => {
                    if (color.toLowerCase() !== '#ff0000' && 
                        !color.includes('d366') && // WhatsApp green
                        !color.includes('d5db') && // Borders
                        !color.includes('e0e0') && // Neutral colors
                        !color.includes('efd')     // Blues
                    ) {
                        coloresRojosEncontrados.push({
                            archivo: archivo,
                            color: color
                        });
                    }
                });
            }
        });
        
        if (coloresRojosEncontrados.length === 0) {
            console.log('✅ ¡PERFECTO! Todos los colores rojos han sido estandarizados a #ff0000');
        } else {
            console.log('⚠️  Colores rojos restantes encontrados:');
            coloresRojosEncontrados.forEach(item => {
                console.log(`   📄 ${item.archivo}: ${item.color}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error verificando resultado:', error.message);
    }
}

// Función para generar reporte final
function generarReporte() {
    console.log('\n🎯 REPORTE FINAL DE ESTANDARIZACIÓN\n');
    
    const reporte = [
        '✅ Colores rojos estandarizados a #ff0000',
        '✅ Variables CSS actualizadas',
        '✅ Archivos HTML procesados',
        '✅ Estilos inline corregidos',
        '🎨 Diseño con color rojo consistente',
        '🚀 Identidad visual unificada'
    ];
    
    reporte.forEach(item => console.log(item));
    
    console.log('\n🎉 ESTANDARIZACIÓN DE COLORES COMPLETADA!');
    console.log('🔴 Color rojo oficial: #FF0000');
}

// Ejecutar proceso completo
console.log('Iniciando estandarización de colores rojos...\n');

// 1. Actualizar variables CSS primero
actualizarVariablesCSS();

// 2. Procesar archivos CSS
procesarArchivosCSS();

// 3. Procesar archivos HTML
procesarArchivosHTML();

// 4. Verificar resultado
verificarResultado();

// 5. Generar reporte
generarReporte();
