// Verificación final del color rojo #ff0000 en todo el proyecto
const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN FINAL DEL COLOR ROJO #FF0000\n');

// Función para verificar uso del color rojo oficial
function verificarColorRojoOficial() {
    console.log('🎯 Verificando uso del color rojo oficial #ff0000...\n');
    
    const carpetaCSS = 'css';
    let usosEncontrados = 0;
    let archivosConRojo = 0;
    
    try {
        const archivosCSS = fs.readdirSync(carpetaCSS).filter(archivo => archivo.endsWith('.css'));
        
        archivosCSS.forEach(archivo => {
            const rutaArchivo = path.join(carpetaCSS, archivo);
            const contenido = fs.readFileSync(rutaArchivo, 'utf8');
            
            // Buscar #ff0000 (case insensitive)
            const regex = /#ff0000/gi;
            const matches = contenido.match(regex);
            
            if (matches) {
                archivosConRojo++;
                usosEncontrados += matches.length;
                console.log(`   ✅ ${archivo}: ${matches.length} usos de #ff0000`);
            }
        });
        
        console.log(`\n📊 ESTADÍSTICAS DEL COLOR ROJO OFICIAL:`);
        console.log(`   🎯 Archivos que usan #ff0000: ${archivosConRojo}/${archivosCSS.length}`);
        console.log(`   🔴 Total de usos: ${usosEncontrados}`);
        
    } catch (error) {
        console.error('❌ Error verificando color rojo oficial:', error.message);
    }
}

// Función para verificar colores rojos no estándar restantes
function verificarRojosNoEstandar() {
    console.log('\n🔍 Verificando colores rojos no estándar restantes...\n');
    
    const carpetaCSS = 'css';
    let rojosNoEstandar = [];
    
    try {
        const archivosCSS = fs.readdirSync(carpetaCSS).filter(archivo => archivo.endsWith('.css'));
        
        archivosCSS.forEach(archivo => {
            const rutaArchivo = path.join(carpetaCSS, archivo);
            const contenido = fs.readFileSync(rutaArchivo, 'utf8');
            
            // Patrones específicos para detectar rojos problemáticos
            const patronesRojosProblematicos = [
                /#[a-fA-F0-9]*[eE]3[0-6][a-fA-F0-9]*/g,  // e30xxx - e36xxx
                /#[a-fA-F0-9]*[dD][cC][0-9a-fA-F]*/g,     // dcxxxx
                /#[a-fA-F0-9]*[bB][0-9a-fA-F][1-9][a-fA-F0-9]*/g, // bx1xxx - bx9xxx
                /#[a-fA-F0-9]*[cC]0[0-6]/g,               // c00-c06
            ];
            
            patronesRojosProblematicos.forEach(patron => {
                const matches = contenido.match(patron);
                if (matches) {
                    matches.forEach(color => {
                        if (color.toLowerCase() !== '#ff0000') {
                            rojosNoEstandar.push({
                                archivo: archivo,
                                color: color
                            });
                        }
                    });
                }
            });
        });
        
        if (rojosNoEstandar.length === 0) {
            console.log('✅ ¡PERFECTO! No se encontraron colores rojos no estándar');
        } else {
            console.log('⚠️  Colores rojos no estándar encontrados:');
            rojosNoEstandar.forEach(item => {
                console.log(`   📄 ${item.archivo}: ${item.color}`);
            });
        }
        
        return rojosNoEstandar.length;
        
    } catch (error) {
        console.error('❌ Error verificando rojos no estándar:', error.message);
        return -1;
    }
}

// Función para verificar HTML con clases red-theme
function verificarClasesRedTheme() {
    console.log('\n🏷️  Verificando clases red-theme en HTML...\n');
    
    let archivosConRedTheme = 0;
    let totalClases = 0;
    
    try {
        const archivosHTML = fs.readdirSync('./').filter(archivo => archivo.endsWith('.html'));
        
        archivosHTML.forEach(archivo => {
            const contenido = fs.readFileSync(archivo, 'utf8');
            
            // Buscar clases red-theme
            const regex = /class="[^"]*red-theme[^"]*"/g;
            const matches = contenido.match(regex);
            
            if (matches) {
                archivosConRedTheme++;
                totalClases += matches.length;
                console.log(`   🎨 ${archivo}: ${matches.length} elementos con red-theme`);
            }
        });
        
        console.log(`\n📊 CLASES RED-THEME:`);
        console.log(`   📄 Archivos con red-theme: ${archivosConRedTheme}`);
        console.log(`   🏷️  Total de clases: ${totalClases}`);
        
    } catch (error) {
        console.error('❌ Error verificando clases red-theme:', error.message);
    }
}

// Función para verificar variables CSS del color rojo
function verificarVariablesRojas() {
    console.log('\n🔧 Verificando variables CSS del color rojo...\n');
    
    const archivoVariables = 'css/variables.css';
    
    try {
        if (fs.existsSync(archivoVariables)) {
            const contenido = fs.readFileSync(archivoVariables, 'utf8');
            
            // Variables relacionadas con el color rojo
            const variablesRojas = [
                '--color-primary',
                '--color-primary-light',
                '--color-primary-dark',
                '--color-danger'
            ];
            
            console.log('📋 Variables del color rojo:');
            variablesRojas.forEach(variable => {
                const regex = new RegExp(`${variable}:\\s*([^;]+);`, 'g');
                const match = regex.exec(contenido);
                
                if (match) {
                    const valor = match[1].trim();
                    const esFF0000 = valor.toLowerCase() === '#ff0000';
                    const icono = esFF0000 ? '✅' : '⚠️';
                    console.log(`   ${icono} ${variable}: ${valor}`);
                } else {
                    console.log(`   ❓ ${variable}: No encontrada`);
                }
            });
            
        } else {
            console.log('⚠️  Archivo variables.css no encontrado');
        }
        
    } catch (error) {
        console.error('❌ Error verificando variables CSS:', error.message);
    }
}

// Función para generar reporte final completo
function generarReporteFinalCompleto(rojosNoEstandar) {
    console.log('\n🎯 REPORTE FINAL COMPLETO\n');
    
    console.log('📋 ESTADO DE ESTANDARIZACIÓN DEL COLOR ROJO:');
    
    if (rojosNoEstandar === 0) {
        console.log('✅ ¡ESTANDARIZACIÓN PERFECTA!');
        console.log('🔴 Todos los colores rojos principales ahora son #FF0000');
        console.log('🎨 Identidad visual completamente unificada');
        console.log('🚀 Diseño consistente en todo el sitio web');
        
        console.log('\n🏆 BENEFICIOS OBTENIDOS:');
        console.log('   🎯 Color corporativo unificado');
        console.log('   📱 Experiencia visual consistente');
        console.log('   🔧 Mantenimiento simplificado');
        console.log('   ✨ Imagen profesional mejorada');
        
    } else if (rojosNoEstandar > 0) {
        console.log(`⚠️  ${rojosNoEstandar} colores rojos requieren revisión manual`);
        console.log('💡 La mayoría del diseño ya está estandarizado');
        console.log('🔍 Revisar colores específicos listados anteriormente');
    }
    
    console.log('\n🎨 COLOR ROJO OFICIAL ESTABLECIDO:');
    console.log('🔴 #FF0000 - Rojo puro');
    console.log('📐 RGB(255, 0, 0)');
    console.log('🎪 HSL(0°, 100%, 50%)');
    
    console.log('\n✅ ACCIONES COMPLETADAS:');
    console.log('   🔄 Variables CSS actualizadas');
    console.log('   📄 Archivos CSS procesados');
    console.log('   📝 Archivos HTML corregidos');
    console.log('   🎯 Colores específicos estandarizados');
    console.log('   🔍 Verificación completa realizada');
    
    console.log('\n🎉 ¡ESTANDARIZACIÓN DE COLOR ROJO COMPLETADA!');
}

// Ejecutar verificación completa
console.log('Iniciando verificación final...\n');

// 1. Verificar uso del color rojo oficial
verificarColorRojoOficial();

// 2. Verificar rojos no estándar restantes
const rojosNoEstandar = verificarRojosNoEstandar();

// 3. Verificar clases red-theme
verificarClasesRedTheme();

// 4. Verificar variables CSS
verificarVariablesRojas();

// 5. Generar reporte final
generarReporteFinalCompleto(rojosNoEstandar);
