// Reporte final de organización de archivos JavaScript
const fs = require('fs');
const path = require('path');

console.log('📊 REPORTE FINAL - ORGANIZACIÓN DE ARCHIVOS JAVASCRIPT\n');

// Verificar que no hay JS en la raíz
function verificarRaiz() {
    console.log('🔍 VERIFICACIÓN DE RAÍZ DEL PROYECTO\n');
    
    try {
        const archivos = fs.readdirSync('./');
        const archivosJS = archivos.filter(archivo => archivo.endsWith('.js'));
        
        if (archivosJS.length === 0) {
            console.log('✅ PERFECTO: No hay archivos JS en la raíz del proyecto');
            console.log('✅ Todos los archivos JS están correctamente organizados\n');
            return true;
        } else {
            console.log('⚠️  ADVERTENCIA: Archivos JS encontrados en la raíz:');
            archivosJS.forEach(archivo => {
                console.log(`   📄 ${archivo}`);
            });
            console.log('');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error verificando raíz:', error.message);
        return false;
    }
}

// Verificar estructura de carpeta js
function verificarCarpetaJS() {
    console.log('📁 ESTADO DE LA CARPETA js/\n');
    
    try {
        const archivosJS = fs.readdirSync('js').filter(archivo => archivo.endsWith('.js'));
        
        console.log(`📊 Total de archivos JavaScript: ${archivosJS.length}`);
        
        // Categorizar archivos
        const categorias = {
            'Sistema': [],
            'Carrito': [],
            'UI/UX': [],
            'Páginas': [],
            'Utilidades': [],
            'Organización': [],
            'Otros': []
        };
        
        archivosJS.forEach(archivo => {
            if (archivo.includes('gestor') || archivo.includes('login') || archivo.includes('cuenta')) {
                categorias.Sistema.push(archivo);
            } else if (archivo.includes('carrito')) {
                categorias.Carrito.push(archivo);
            } else if (archivo.includes('mobile') || archivo.includes('navigation') || archivo.includes('responsive')) {
                categorias['UI/UX'].push(archivo);
            } else if (archivo.includes('checkout') || archivo.includes('inline')) {
                categorias.Páginas.push(archivo);
            } else if (archivo.includes('verificar') || archivo.includes('limpiar') || archivo.includes('organizar') || archivo.includes('mover') || archivo.includes('agregar') || archivo.includes('aplicar') || archivo.includes('corregir') || archivo.includes('finalizar')) {
                categorias.Organización.push(archivo);
            } else if (archivo.includes('diagnostico') || archivo.includes('fix') || archivo.includes('update')) {
                categorias.Utilidades.push(archivo);
            } else {
                categorias.Otros.push(archivo);
            }
        });
        
        // Mostrar categorías
        Object.keys(categorias).forEach(categoria => {
            if (categorias[categoria].length > 0) {
                console.log(`\n📂 ${categoria} (${categorias[categoria].length} archivos):`);
                categorias[categoria].slice(0, 5).forEach(archivo => {
                    console.log(`   📄 ${archivo}`);
                });
                if (categorias[categoria].length > 5) {
                    console.log(`   ... y ${categorias[categoria].length - 5} archivos más`);
                }
            }
        });
        
        console.log(`\n📈 ESTADÍSTICAS:`);
        console.log(`   🎯 Sistema: ${categorias.Sistema.length} archivos`);
        console.log(`   🛒 Carrito: ${categorias.Carrito.length} archivos`);
        console.log(`   📱 UI/UX: ${categorias['UI/UX'].length} archivos`);
        console.log(`   📄 Páginas: ${categorias.Páginas.length} archivos`);
        console.log(`   🔧 Utilidades: ${categorias.Utilidades.length} archivos`);
        console.log(`   📋 Organización: ${categorias.Organización.length} archivos`);
        console.log(`   📦 Otros: ${categorias.Otros.length} archivos`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error verificando carpeta js:', error.message);
        return false;
    }
}

// Verificar referencias en HTML
function verificarReferenciasHTML() {
    console.log('\n🔗 VERIFICACIÓN DE REFERENCIAS EN HTML\n');
    
    try {
        const archivosHTML = fs.readdirSync('./').filter(archivo => archivo.endsWith('.html'));
        let totalReferencias = 0;
        let referenciasCorrectas = 0;
        
        archivosHTML.forEach(archivo => {
            const contenido = fs.readFileSync(archivo, 'utf8');
            const regex = /<script\s+src\s*=\s*['"](js\/[^'"]+\.js)['"][^>]*>/gi;
            let match;
            
            while ((match = regex.exec(contenido)) !== null) {
                totalReferencias++;
                const rutaJS = match[1];
                
                if (fs.existsSync(rutaJS)) {
                    referenciasCorrectas++;
                } else {
                    console.log(`⚠️  Referencia rota en ${archivo}: ${rutaJS}`);
                }
            }
        });
        
        console.log(`📊 Referencias JavaScript verificadas:`);
        console.log(`   ✅ Correctas: ${referenciasCorrectas}/${totalReferencias}`);
        
        if (referenciasCorrectas === totalReferencias) {
            console.log('   🎉 Todas las referencias están funcionando correctamente');
        }
        
        return referenciasCorrectas === totalReferencias;
        
    } catch (error) {
        console.error('❌ Error verificando referencias HTML:', error.message);
        return false;
    }
}

// Generar resumen final
function generarResumenFinal(raizLimpia, carpetaOK, referenciasOK) {
    console.log('\n🎯 RESUMEN FINAL DE ORGANIZACIÓN\n');
    
    const estado = {
        'Raíz del proyecto limpia': raizLimpia ? '✅' : '❌',
        'Carpeta js/ organizada': carpetaOK ? '✅' : '❌', 
        'Referencias HTML correctas': referenciasOK ? '✅' : '❌'
    };
    
    Object.keys(estado).forEach(item => {
        console.log(`${estado[item]} ${item}`);
    });
    
    const todoEnOrden = raizLimpia && carpetaOK && referenciasOK;
    
    if (todoEnOrden) {
        console.log('\n🎉 ¡ORGANIZACIÓN PERFECTA!');
        console.log('✨ Todos los archivos JavaScript están correctamente organizados');
        console.log('📁 Estructura de proyecto optimizada y mantenible');
        console.log('🚀 Listo para desarrollo futuro');
    } else {
        console.log('\n⚠️  Revisar elementos marcados con ❌');
    }
    
    console.log('\n📋 BENEFICIOS OBTENIDOS:');
    console.log('   🗂️  Mejor organización del código');
    console.log('   🔍 Fácil localización de archivos');
    console.log('   🛠️  Mantenimiento simplificado');
    console.log('   📚 Estructura estándar de proyecto');
    console.log('   ⚡ Desarrollo más eficiente');
}

// Ejecutar verificaciones
const raizLimpia = verificarRaiz();
const carpetaOK = verificarCarpetaJS();
const referenciasOK = verificarReferenciasHTML();

generarResumenFinal(raizLimpia, carpetaOK, referenciasOK);
