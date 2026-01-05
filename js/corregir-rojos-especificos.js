// Script específico para corregir colores rojos problemáticos detectados
const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECCIÓN ESPECÍFICA DE COLORES ROJOS PROBLEMÁTICOS\n');

// Colores rojos específicos que necesitan corrección
const coloresProblematicos = {
    '#e30613': '#ff0000',    // Carrito fix adicional
    '#e91e63': '#ff0000',    // Rosa/magenta
    '#c00': '#ff0000',       // Rojo corto
    '#dc2626': '#ff0000',    // Checkout CSS
    '#b91c1c': '#ff0000',    // Rojo oscuro
    '#b71c1c': '#ff0000',    // Rojo muy oscuro
    '#ff0000ef': '#ff0000',  // Rojo con transparencia
};

// Función para corregir colores específicos
function corregirColoresEspecificos() {
    console.log('🎯 Corrigiendo colores rojos específicos...\n');
    
    const carpetaCSS = 'css';
    let totalCambios = 0;
    
    try {
        const archivosCSS = fs.readdirSync(carpetaCSS).filter(archivo => archivo.endsWith('.css'));
        
        archivosCSS.forEach(archivo => {
            const rutaArchivo = path.join(carpetaCSS, archivo);
            let contenido = fs.readFileSync(rutaArchivo, 'utf8');
            let contenidoOriginal = contenido;
            let cambiosArchivo = 0;
            
            // Corregir cada color problemático
            Object.keys(coloresProblematicos).forEach(colorViejo => {
                const colorNuevo = coloresProblematicos[colorViejo];
                
                if (contenido.includes(colorViejo)) {
                    // Reemplazar todas las ocurrencias
                    const regex = new RegExp(colorViejo.replace('#', '\\#'), 'g');
                    const matches = contenido.match(regex);
                    
                    if (matches) {
                        contenido = contenido.replace(regex, colorNuevo);
                        cambiosArchivo += matches.length;
                        console.log(`   🔴 ${archivo}: ${colorViejo} → ${colorNuevo} (${matches.length} cambios)`);
                    }
                }
            });
            
            // Guardar si hubo cambios
            if (contenido !== contenidoOriginal) {
                fs.writeFileSync(rutaArchivo, contenido);
                totalCambios += cambiosArchivo;
                console.log(`   ✅ ${archivo} actualizado\n`);
            }
        });
        
        console.log(`📊 Total de cambios específicos realizados: ${totalCambios}\n`);
        
    } catch (error) {
        console.error('❌ Error corrigiendo colores específicos:', error.message);
    }
}

// Función para verificar y reportar colores rojos restantes
function verificarColoresRojosRestantes() {
    console.log('🔍 VERIFICANDO COLORES ROJOS RESTANTES...\n');
    
    const carpetaCSS = 'css';
    let coloresRojosEncontrados = [];
    
    try {
        const archivosCSS = fs.readdirSync(carpetaCSS).filter(archivo => archivo.endsWith('.css'));
        
        archivosCSS.forEach(archivo => {
            const rutaArchivo = path.join(carpetaCSS, archivo);
            const contenido = fs.readFileSync(rutaArchivo, 'utf8');
            
            // Buscar patrones específicos de colores rojos
            const patronesRojos = [
                /#[a-fA-F0-9]*[eE][0-9a-fA-F]*[0-6][0-9a-fA-F]*/g,  // Colores que empiecen con E y terminen en rojo
                /#[a-fA-F0-9]*[dD][a-fA-F0-9]*[2-6][a-fA-F0-9]*/g,   // Colores que empiecen con D y sean rojizos
                /#[a-fA-F0-9]*[cC][0-9a-fA-F]*[0-6][0-9a-fA-F]*/g,   // Colores que empiecen con C y sean rojizos
                /#[a-fA-F0-9]*[bB][0-9a-fA-F]*[1-6][0-9a-fA-F]*/g,   // Colores que empiecen con B y sean rojizos
            ];
            
            patronesRojos.forEach(patron => {
                const matches = contenido.match(patron);
                if (matches) {
                    matches.forEach(color => {
                        // Filtrar colores que claramente no son rojos
                        if (!color.includes('e7eb') && // Grises
                            !color.includes('ecef') && // Grises claros
                            !color.includes('c6e0') && // Azules
                            !color.includes('d366') && // Verdes
                            !color.includes('eaa7') && // Amarillos
                            !color.includes('f7d1') && // Grises
                            !color.includes('c7d1') && // Grises azulados
                            color.toLowerCase() !== '#ff0000'
                        ) {
                            coloresRojosEncontrados.push({
                                archivo: archivo,
                                color: color,
                                linea: contenido.split('\n').findIndex(line => line.includes(color)) + 1
                            });
                        }
                    });
                }
            });
        });
        
        // Mostrar colores encontrados agrupados por tipo
        if (coloresRojosEncontrados.length > 0) {
            console.log('⚠️  Colores potencialmente rojos encontrados:\n');
            
            // Agrupar por archivo
            const porArchivo = {};
            coloresRojosEncontrados.forEach(item => {
                if (!porArchivo[item.archivo]) {
                    porArchivo[item.archivo] = [];
                }
                porArchivo[item.archivo].push(item);
            });
            
            Object.keys(porArchivo).forEach(archivo => {
                console.log(`📄 ${archivo}:`);
                porArchivo[archivo].forEach(item => {
                    console.log(`   🔴 ${item.color} (línea ${item.linea})`);
                });
                console.log('');
            });
            
        } else {
            console.log('✅ ¡EXCELENTE! No se encontraron más colores rojos para corregir\n');
        }
        
        return coloresRojosEncontrados.length;
        
    } catch (error) {
        console.error('❌ Error verificando colores rojos:', error.message);
        return -1;
    }
}

// Función para generar reporte final mejorado
function generarReporteFinal(coloresRestantes) {
    console.log('🎯 REPORTE FINAL DE CORRECCIÓN\n');
    
    if (coloresRestantes === 0) {
        console.log('🎉 ¡PERFECTO! ESTANDARIZACIÓN COMPLETADA AL 100%');
        console.log('✅ Todos los colores rojos ahora son #FF0000');
        console.log('🔴 Identidad visual unificada');
        console.log('🚀 Diseño consistente en todo el sitio');
    } else if (coloresRestantes > 0) {
        console.log(`⚠️  Quedan ${coloresRestantes} colores por revisar manualmente`);
        console.log('💡 Algunos pueden ser colores válidos (grises, azules, etc.)');
        console.log('🔍 Revisar lista anterior para confirmación');
    } else {
        console.log('❌ Error en la verificación');
    }
    
    console.log('\n📋 RESUMEN DE ACCIONES:');
    console.log('✅ Colores principales corregidos a #FF0000');
    console.log('✅ Variables CSS actualizadas');
    console.log('✅ Archivos HTML procesados');
    console.log('✅ Colores problemáticos específicos corregidos');
    
    console.log('\n🎨 COLOR ROJO OFICIAL: #FF0000');
}

// Ejecutar corrección específica
console.log('Iniciando corrección específica de colores rojos...\n');

// 1. Corregir colores específicos problemáticos
corregirColoresEspecificos();

// 2. Verificar resultado final
const coloresRestantes = verificarColoresRojosRestantes();

// 3. Generar reporte final
generarReporteFinal(coloresRestantes);
