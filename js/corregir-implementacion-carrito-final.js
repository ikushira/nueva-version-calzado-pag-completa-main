// corregir-implementacion-carrito-final.js
// Script definitivo para corregir todos los problemas de implementación del carrito

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML principales
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(`Encontrados ${archivos.length} archivos HTML para corregir`);

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
        
        // 1. ELIMINAR COMPLETAMENTE LOS SCRIPTS DE CARRITO Y RECONSTRUIRLOS
        // Eliminar todas las referencias a scripts de carrito
        contenido = contenido.replace(/<script src="js\/carrito\.js"><\/script>/g, '');
        contenido = contenido.replace(/<script src="js\/carrito-tarjetas-fix\.js"><\/script>/g, '');
        contenido = contenido.replace(/<script src="js\/carrito-tarjetas-fix-v2\.js"><\/script>/g, '');
        
        // 2. DETERMINAR SI ESTA PÁGINA NECESITA LOS SCRIPTS
        const paginasConCarrito = [
            'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
            'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
            'nuevos.html', 'ofertas.html', 'index.html', 'cuenta.html', 
            'direccion_cuenta.html', 'editar_perfil.html', 'login.html',
            'guia-tallas.html', 'limpiar-carrito.html', 'ver_usuarios.html'
        ];
        
        // 3. INSERTAR LOS SCRIPTS SI ES NECESARIO
        if (paginasConCarrito.includes(archivo)) {
            // Buscar cierre de body para insertar antes
            const cierreBody = '</body>';
            const posicionCierreBody = contenido.lastIndexOf(cierreBody);
            
            if (posicionCierreBody !== -1) {
                // Insertar los scripts en el orden correcto
                let scriptsParaInsertar = '  <script src="js/carrito.js"></script>\n';
                
                // Agregar carrito-tarjetas-fix-v2.js solo si es una página principal con productos
                const paginasConProductos = [
                    'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
                    'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
                    'nuevos.html', 'ofertas.html', 'index.html'
                ];
                
                if (paginasConProductos.includes(archivo)) {
                    scriptsParaInsertar += '  <script src="js/carrito-tarjetas-fix-v2.js"></script>\n';
                }
                
                // Insertar scripts antes del cierre de body
                contenido = contenido.substring(0, posicionCierreBody) + 
                         '\n' + scriptsParaInsertar + contenido.substring(posicionCierreBody);
                
                modificado = true;
            }
        }
        
        // Guardar cambios si hubo modificaciones
        if (contenido !== contenidoOriginal) {
            fs.writeFileSync(rutaArchivo, contenido, 'utf8');
            console.log(`✅ ${archivo}: Archivos de carrito reconstruidos correctamente`);
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
console.log(`Total de archivos HTML: ${archivos.length}`);
console.log(`Archivos corregidos: ${corregidos}`);
if (corregidos > 0) {
    console.log("Páginas corregidas:");
    paginasCorregidas.forEach(p => console.log(`- ${p}`));
}
