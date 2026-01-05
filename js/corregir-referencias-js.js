// Script para corregir referencias JS faltantes
const fs = require('fs');
const path = require('path');

console.log('🔧 CORRIGIENDO REFERENCIAS JS FALTANTES\n');

// Archivos que necesitan corrección
const archivosEspecificos = [
    'cuenta.html',
    'dotacion.html', 
    'editar_perfil.html',
    'marcas.html',
    'mujeres.html',
    'ninas.html',
    'ninos.html',
    'nuevos.html',
    'ofertas.html'
];

// Referencias JS que no existen y deben ser removidas o reemplazadas
const referenciasProblematicas = [
    'js/carrito-correccion-final.js',
    'js/carrito-tarjetas-fix.js', 
    'js/diagnostico-carrito-tarjetas.js',
    'js/carrito.js',
    'js/carrito-fix-radical-v2.js',
    'js/carrito-visualizacion-fix.js',
    'js/carrito-ui-enhanced.js',
    'js/diagnostico-carrito.js'
];

// Referencias JS correctas para reemplazar
const referenciasCorrectas = [
    'js/carrito-simplificado.js',
    'js/carrito-estilo-fix.js'
];

function corregirReferencias() {
    archivosEspecificos.forEach(archivo => {
        try {
            console.log(`📝 Procesando ${archivo}...`);
            
            let contenido = fs.readFileSync(archivo, 'utf8');
            let cambios = 0;
            
            // Buscar y remover referencias problemáticas
            referenciasProblematicas.forEach(refProblematica => {
                const regex = new RegExp(`\\s*<script\\s+src\\s*=\\s*['"](${refProblematica.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})['"]+[^>]*>\\s*</script>\\s*`, 'gi');
                
                if (contenido.match(regex)) {
                    contenido = contenido.replace(regex, '');
                    cambios++;
                    console.log(`  ❌ Removida: ${refProblematica}`);
                }
            });
            
            // Verificar que las referencias correctas estén presentes
            const tieneCarritoSimplificado = contenido.includes('js/carrito-simplificado.js');
            const tieneCarritoEstilo = contenido.includes('js/carrito-estilo-fix.js');
            
            if (!tieneCarritoSimplificado || !tieneCarritoEstilo) {
                // Buscar dónde insertar las referencias (antes del cierre del body)
                const bodyCloseIndex = contenido.lastIndexOf('</body>');
                
                if (bodyCloseIndex !== -1) {
                    let scriptsToAdd = '';
                    
                    if (!tieneCarritoSimplificado) {
                        scriptsToAdd += '    <script src="js/carrito-simplificado.js"></script>\n';
                        console.log(`  ✅ Agregada: js/carrito-simplificado.js`);
                        cambios++;
                    }
                    
                    if (!tieneCarritoEstilo) {
                        scriptsToAdd += '    <script src="js/carrito-estilo-fix.js"></script>\n';
                        console.log(`  ✅ Agregada: js/carrito-estilo-fix.js`);
                        cambios++;
                    }
                    
                    if (scriptsToAdd) {
                        contenido = contenido.substring(0, bodyCloseIndex) + 
                                  scriptsToAdd + 
                                  contenido.substring(bodyCloseIndex);
                    }
                }
            }
            
            // Guardar archivo si hubo cambios
            if (cambios > 0) {
                fs.writeFileSync(archivo, contenido);
                console.log(`  💾 ${archivo} actualizado (${cambios} cambios)\n`);
            } else {
                console.log(`  ✅ ${archivo} no necesita cambios\n`);
            }
            
        } catch (error) {
            console.error(`❌ Error procesando ${archivo}:`, error.message);
        }
    });
}

function verificarReferenciasCorrectas() {
    console.log('🔍 VERIFICANDO REFERENCIAS CORREGIDAS\n');
    
    archivosEspecificos.forEach(archivo => {
        try {
            const contenido = fs.readFileSync(archivo, 'utf8');
            const regex = /<script\s+src\s*=\s*["'](js\/[^"']+)["'][^>]*>/gi;
            let match;
            const referencias = [];
            
            while ((match = regex.exec(contenido)) !== null) {
                referencias.push(match[1]);
            }
            
            console.log(`📄 ${archivo}:`);
            referencias.forEach(ref => {
                const existe = fs.existsSync(ref) ? '✅' : '❌';
                console.log(`  ${existe} ${ref}`);
            });
            console.log('');
            
        } catch (error) {
            console.error(`❌ Error verificando ${archivo}:`, error.message);
        }
    });
}

// Ejecutar correcciones
corregirReferencias();
verificarReferenciasCorrectas();

console.log('🎉 CORRECCIÓN DE REFERENCIAS COMPLETADA');
