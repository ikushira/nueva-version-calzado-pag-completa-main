// corregir-implementacion-carrito-v2.js
// Script mejorado para corregir problemas de implementación del carrito en todas las páginas

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
    let modificado = false;
    
    try {
        // Leer contenido del archivo
        let contenido = fs.readFileSync(rutaArchivo, 'utf8');
        
        // Hacer una copia del contenido original para comparar después
        const contenidoOriginal = contenido;
        
        // Corregir inclusiones duplicadas de carrito.js
        const coincidenciasCarrito = contenido.match(/<script src="js\/carrito\.js"><\/script>/g);
        if (coincidenciasCarrito && coincidenciasCarrito.length > 1) {
            console.log(`⚠️ ${archivo}: Tiene ${coincidenciasCarrito.length} inclusiones de carrito.js`);
            
            // Eliminar todas las ocurrencias
            contenido = contenido.replace(/<script src="js\/carrito\.js"><\/script>/g, '');
            
            // Buscar punto de inserción (antes del cierre de body)
            const cierreBody = '</body>';
            const posicionCierreBody = contenido.lastIndexOf(cierreBody);
            
            if (posicionCierreBody !== -1) {
                // Insertar script antes del cierre de body
                contenido = contenido.substring(0, posicionCierreBody) + 
                         '\n  <script src="js/carrito.js"></script>\n  ' + 
                         contenido.substring(posicionCierreBody);
            }
            
            modificado = true;
        }
        
        // Corregir falta de carrito.js
        const paginasQuePrecisanCarrito = [
            'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
            'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
            'nuevos.html', 'ofertas.html', 'index.html', 'cuenta.html', 
            'direccion_cuenta.html', 'editar_perfil.html', 'login.html',
            'guia-tallas.html', 'limpiar-carrito.html', 'ver_usuarios.html'
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
                
                modificado = true;
            }
        }
        
        // Asegurar que también tenga carrito-tarjetas-fix-v2.js si es necesario
        const paginasConProductos = [
            'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
            'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
            'nuevos.html', 'ofertas.html', 'index.html'
        ];
        
        if (!contenido.includes('carrito-tarjetas-fix-v2.js') && paginasConProductos.includes(archivo)) {
            console.log(`⚠️ ${archivo}: Agregando carrito-tarjetas-fix-v2.js (faltante)`);
            
            // Buscar cierre de body para insertar antes
            const cierreBody = '</body>';
            const posicionCierreBody = contenido.lastIndexOf(cierreBody);
            
            if (posicionCierreBody !== -1) {
                // Insertar script antes del cierre de body, pero después de carrito.js
                if (contenido.includes('carrito.js')) {
                    contenido = contenido.replace('<script src="js/carrito.js"></script>', 
                                                '<script src="js/carrito.js"></script>\n  <script src="js/carrito-tarjetas-fix-v2.js"></script>');
                } else {
                    contenido = contenido.substring(0, posicionCierreBody) + 
                             '\n  <script src="js/carrito-tarjetas-fix-v2.js"></script>\n  ' + 
                             contenido.substring(posicionCierreBody);
                }
                
                modificado = true;
            }
        }
        
        // Guardar cambios si hubo modificaciones
        if (modificado) {
            fs.writeFileSync(rutaArchivo, contenido, 'utf8');
            console.log(`✅ ${archivo}: Archivo corregido y guardado`);
            corregidos++;
            paginasCorregidas.push(archivo);
        } else {
            console.log(`ℹ️ ${archivo}: No requirió correcciones`);
        }
    } catch (error) {
        console.error(`❌ ${archivo}: Error al procesar: ${error.message}`);
    }
});

console.log("\n=== RESUMEN DE CORRECCIONES ===");
console.log(`Total de archivos HTML principales: ${archivos.length}`);
console.log(`Archivos corregidos: ${corregidos}`);
if (corregidos > 0) {
    console.log("Páginas corregidas:");
    paginasCorregidas.forEach(p => console.log(`- ${p}`));
}
