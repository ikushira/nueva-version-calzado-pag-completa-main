// limpiar-scripts-carrito.js
// Script definitivo para limpiar y corregir todos los scripts de carrito

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(`Encontrados ${archivos.length} archivos HTML para limpiar`);

// Definir scripts a buscar y eliminar
const scriptsALimpiar = [
    'carrito.js',
    'carrito-tarjetas-fix.js',
    'carrito-tarjetas-fix-v2.js',
    'carrito-fix.js',
    'carrito-fix-radical.js',
    'carrito-fix-radical-v2.js'
];

let corregidos = 0;
let paginasCorregidas = [];

// Procesar cada archivo
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    let modificado = false;
    
    try {
        // Leer contenido del archivo
        let contenido = fs.readFileSync(rutaArchivo, 'utf8');
        const contenidoOriginal = contenido;
        
        // Buscar TODAS las instancias de scripts de carrito y contar
        let conteo = {};
        scriptsALimpiar.forEach(script => {
            const regex = new RegExp(`<script[^>]*src="[^"]*${script}"[^>]*>`, 'g');
            const coincidencias = contenido.match(regex) || [];
            conteo[script] = coincidencias.length;
            
            if (coincidencias.length > 0) {
                console.log(`⚠️ ${archivo}: Encontradas ${coincidencias.length} referencias a ${script}`);
            }
        });
        
        // Si hay múltiples instancias, eliminar TODAS
        let scriptsDuplicados = false;
        Object.keys(conteo).forEach(script => {
            if (conteo[script] > 1) {
                scriptsDuplicados = true;
            }
        });
        
        // Eliminar todos los scripts de carrito si hay duplicados
        if (scriptsDuplicados) {
            console.log(`🔄 ${archivo}: Eliminando todas las referencias a scripts de carrito para reconstruir`);
            
            scriptsALimpiar.forEach(script => {
                const regex = new RegExp(`<script[^>]*src="[^"]*${script}"[^>]*>.*?<\\/script>`, 'g');
                contenido = contenido.replace(regex, '');
            });
            
            modificado = true;
        }
        
        // Determinar si la página necesita scripts de carrito
        const paginasConCarrito = [
            'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
            'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
            'nuevos.html', 'ofertas.html', 'index.html', 'cuenta.html', 
            'direccion_cuenta.html', 'editar_perfil.html', 'login.html',
            'guia-tallas.html', 'limpiar-carrito.html', 'ver_usuarios.html'
        ];
        
        // Agregar los scripts si es necesario y fueron eliminados
        if (paginasConCarrito.includes(archivo) && modificado) {
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
                
                console.log(`✅ ${archivo}: Scripts de carrito reconstruidos correctamente`);
            }
        }
        
        // Guardar cambios si hubo modificaciones
        if (contenido !== contenidoOriginal) {
            fs.writeFileSync(rutaArchivo, contenido, 'utf8');
            corregidos++;
            paginasCorregidas.push(archivo);
        } else if (!modificado) {
            console.log(`ℹ️ ${archivo}: No requirió correcciones`);
        }
    } catch (error) {
        console.error(`❌ ${archivo}: Error al procesar: ${error.message}`);
    }
});

console.log("\n=== RESUMEN DE LIMPIEZA ===");
console.log(`Total de archivos HTML: ${archivos.length}`);
console.log(`Archivos corregidos: ${corregidos}`);
if (corregidos > 0) {
    console.log("Páginas corregidas:");
    paginasCorregidas.forEach(p => console.log(`- ${p}`));
}
