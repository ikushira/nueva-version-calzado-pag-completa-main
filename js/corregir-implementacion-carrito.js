// corregir-implementacion-carrito.js
// Script para corregir problemas de implementación del carrito en todas las páginas

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML principales (excluyendo archivos de diagnóstico)
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => 
        archivo.endsWith('.html') && 
        !archivo.includes('diagnostico') && 
        !archivo.includes('verificar') && 
        !archivo.includes('prueba') && 
        !archivo.includes('demo')
    );

console.log(`Encontrados ${archivos.length} archivos HTML principales para corregir`);

let corregidos = 0;
let paginasCorregidas = [];

// Corregir cada archivo
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    
    // Leer contenido del archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    let contenidoOriginal = contenido;
    
    // Corregir inclusiones duplicadas de carrito.js
    if ((contenido.match(/carrito\.js/g) || []).length > 1) {
        console.log(`⚠️ ${archivo}: Eliminando inclusiones duplicadas de carrito.js`);
        
        // Reemplazar todas las ocurrencias por un marcador temporal
        contenido = contenido.replace(/<script src="js\/carrito\.js"><\/script>/g, '<!-- CARRITO_JS_PLACEHOLDER -->');
        
        // Restaurar solo la primera ocurrencia
        contenido = contenido.replace('<!-- CARRITO_JS_PLACEHOLDER -->', '<script src="js/carrito.js"></script>');
        
        // Eliminar los marcadores restantes
        contenido = contenido.replace(/<!-- CARRITO_JS_PLACEHOLDER -->/g, '');
    }
    
    // Corregir falta de carrito.js
    const paginasQuePrecisanCarrito = [
        'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
        'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
        'nuevos.html', 'ofertas.html', 'index.html', 'cuenta.html', 
        'direccion_cuenta.html', 'editar_perfil.html', 'login.html'
    ];
    
    if (!contenido.includes('carrito.js') && paginasQuePrecisanCarrito.includes(archivo)) {
        console.log(`⚠️ ${archivo}: Agregando carrito.js (faltante)`);
        
        // Buscar cierre de body para insertar antes
        const cierreBody = '</body>';
        const posicionCierreBody = contenido.lastIndexOf(cierreBody);
        
        if (posicionCierreBody !== -1) {
            // Insertar script antes del cierre de body
            contenido = contenido.substring(0, posicionCierreBody) + 
                     '\n  <script src="js/carrito.js"></script>\n  ' + 
                     contenido.substring(posicionCierreBody);
        }
    }
    
    // Corregir orden de carga si es necesario
    if (contenido.includes('carrito.js') && contenido.includes('carrito-tarjetas-fix-v2.js')) {
        const posCarrito = contenido.indexOf('carrito.js');
        const posTarjetasFix = contenido.indexOf('carrito-tarjetas-fix-v2.js');
        
        if (posCarrito > posTarjetasFix) {
            console.log(`⚠️ ${archivo}: Corrigiendo orden de carga de scripts`);
            
            // Eliminar ambos scripts
            contenido = contenido.replace(/<script src="js\/carrito\.js"><\/script>/g, '');
            contenido = contenido.replace(/<script src="js\/carrito-tarjetas-fix-v2\.js"><\/script>/g, '');
            
            // Buscar cierre de body para insertar antes
            const cierreBody = '</body>';
            const posicionCierreBody = contenido.lastIndexOf(cierreBody);
            
            if (posicionCierreBody !== -1) {
                // Insertar scripts en el orden correcto
                contenido = contenido.substring(0, posicionCierreBody) + 
                         '\n  <script src="js/carrito.js"></script>\n  ' + 
                         '<script src="js/carrito-tarjetas-fix-v2.js"></script>\n  ' + 
                         contenido.substring(posicionCierreBody);
            }
        }
    }
    
    // Guardar cambios si hubo modificaciones
    if (contenido !== contenidoOriginal) {
        fs.writeFileSync(rutaArchivo, contenido, 'utf8');
        console.log(`✅ ${archivo}: Archivo corregido y guardado`);
        corregidos++;
        paginasCorregidas.push(archivo);
    } else {
        console.log(`ℹ️ ${archivo}: No requirió correcciones`);
    }
});

console.log("\n=== RESUMEN DE CORRECCIONES ===");
console.log(`Total de archivos HTML principales: ${archivos.length}`);
console.log(`Archivos corregidos: ${corregidos}`);
if (corregidos > 0) {
    console.log("Páginas corregidas:");
    paginasCorregidas.forEach(p => console.log(`- ${p}`));
}
