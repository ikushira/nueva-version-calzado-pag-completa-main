// limpieza-final.js
// Script para la limpieza final de todos los scripts de carrito redundantes
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(`Encontrados ${archivos.length} archivos HTML para limpieza final`);

// Scripts relacionados con el carrito que deben ser eliminados
const scriptsAEliminar = [
    'carrito.js',
    'carrito-tarjetas-fix.js',
    'carrito-tarjetas-fix-v2.js',
    'carrito-fix.js',
    'carrito-fix-radical.js',
    'carrito-fix-radical-v2.js',
    'carrito-visualizacion-fix.js',
    'carrito-correccion-final.js',
    'carrito-ui-enhanced.js',
    'carrito-ui-enhanced-v2.js',
    'diagnostico-carrito.js',
    'diagnostico-carrito-tarjetas.js',
    'carrito-inicializacion.js',
    'carrito-fix-definitivo.js',
    'carrito-fix-radical-v2.js',
    'carrito-debug.js'
];

let corregidos = 0;
let paginasCorregidas = [];

// Procesar cada archivo HTML
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    
    try {
        // Leer contenido del archivo
        let contenido = fs.readFileSync(rutaArchivo, 'utf8');
        const contenidoOriginal = contenido;
        
        // Eliminar todos los scripts relacionados con el carrito
        scriptsAEliminar.forEach(script => {
            const regex = new RegExp(`<script[^>]*src="[^"]*${script}"[^>]*>.*?<\\/script>\\s*`, 'g');
            contenido = contenido.replace(regex, '');
        });
        
        // Verificar si ya tiene el script simplificado
        const tieneScriptSimplificado = contenido.includes('carrito-simplificado.js');
        
        // Determinar si este archivo necesita el script de carrito
        const paginasConCarrito = [
            'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
            'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
            'nuevos.html', 'ofertas.html', 'index.html', 'cuenta.html', 
            'direccion_cuenta.html', 'editar_perfil.html', 'login.html',
            'guia-tallas.html', 'limpiar-carrito.html', 'ver_usuarios.html'
        ];
        
        // Añadir el nuevo script simplificado si es necesario y no lo tiene aún
        if (paginasConCarrito.includes(archivo) && !tieneScriptSimplificado) {
            // Buscar la posición antes del cierre de body
            const cierreBody = '</body>';
            let posicionCierreBody = contenido.lastIndexOf(cierreBody);
            
            if (posicionCierreBody !== -1) {
                // Insertar nuestro nuevo script justo antes del cierre de body
                contenido = contenido.substring(0, posicionCierreBody) + 
                        '\n  <!-- Script unificado de carrito -->\n' +
                        '  <script src="js/carrito-simplificado.js"></script>\n' + 
                        contenido.substring(posicionCierreBody);
                
                console.log(`✅ ${archivo}: Script de carrito simplificado añadido`);
            }
        }
        
        // Guardar cambios si hubo modificaciones
        if (contenido !== contenidoOriginal) {
            fs.writeFileSync(rutaArchivo, contenido, 'utf8');
            corregidos++;
            paginasCorregidas.push(archivo);
            console.log(`✅ ${archivo}: Limpieza final completada`);
        } else {
            console.log(`ℹ️ ${archivo}: No requiere cambios`);
        }
    } catch (error) {
        console.error(`❌ ${archivo}: Error al procesar - ${error.message}`);
    }
});

console.log("\n=== RESUMEN DE LIMPIEZA FINAL ===");
console.log(`Total de archivos HTML: ${archivos.length}`);
console.log(`Archivos corregidos: ${corregidos}`);

if (corregidos > 0) {
    console.log("\nPáginas corregidas:");
    paginasCorregidas.forEach(p => console.log(`- ${p}`));
}

// Informar sobre scripts redundantes que pueden ser eliminados
console.log("\n=== ELIMINACIÓN DE SCRIPTS REDUNDANTES ===");
console.log("Los siguientes scripts pueden ser eliminados completamente:");

scriptsAEliminar.forEach(script => {
    const rutaScript = path.join(directorio, 'js', script);
    if (fs.existsSync(rutaScript)) {
        console.log(`- ${script}`);
    }
});

console.log("\nPara eliminar estos scripts, ejecute el siguiente comando en el terminal:");
console.log("node js/eliminar-scripts-redundantes.js");

// Crear script para eliminar scripts redundantes
const contenidoEliminador = `// eliminar-scripts-redundantes.js
// Script para eliminar scripts redundantes del sistema
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Scripts relacionados con el carrito que deben ser eliminados
const scriptsAEliminar = [
    'carrito.js',
    'carrito-tarjetas-fix.js',
    'carrito-tarjetas-fix-v2.js',
    'carrito-fix.js',
    'carrito-fix-radical.js',
    'carrito-fix-radical-v2.js',
    'carrito-visualizacion-fix.js',
    'carrito-correccion-final.js',
    'carrito-ui-enhanced.js',
    'carrito-ui-enhanced-v2.js',
    'diagnostico-carrito.js',
    'diagnostico-carrito-tarjetas.js',
    'carrito-inicializacion.js',
    'carrito-fix-definitivo.js',
    'carrito-fix-radical-v2.js',
    'carrito-debug.js'
];

console.log("=== ELIMINANDO SCRIPTS REDUNDANTES ===");

// Ruta al directorio de scripts
const directorioScripts = path.join('.', 'js');

// Verificar si existe el directorio de scripts
if (!fs.existsSync(directorioScripts)) {
    console.error(\`El directorio \${directorioScripts} no existe\`);
    process.exit(1);
}

// Crear directorio de backup
const directorioBackup = path.join(directorioScripts, 'backup_scripts');
if (!fs.existsSync(directorioBackup)) {
    fs.mkdirSync(directorioBackup);
    console.log(\`Directorio de backup creado: \${directorioBackup}\`);
}

// Contador de scripts eliminados
let eliminados = 0;

// Eliminar cada script
scriptsAEliminar.forEach(script => {
    const rutaScript = path.join(directorioScripts, script);
    
    if (fs.existsSync(rutaScript)) {
        try {
            // Crear backup
            const rutaBackup = path.join(directorioBackup, script);
            fs.copyFileSync(rutaScript, rutaBackup);
            
            // Eliminar archivo original
            fs.unlinkSync(rutaScript);
            
            eliminados++;
            console.log(\`✅ \${script}: Eliminado (backup creado)\`);
        } catch (error) {
            console.error(\`❌ \${script}: Error al eliminar - \${error.message}\`);
        }
    } else {
        console.log(\`ℹ️ \${script}: No encontrado\`);
    }
});

console.log(\`\\nTotal de scripts eliminados: \${eliminados}\`);
console.log(\`Se han creado copias de seguridad en: \${directorioBackup}\`);
console.log("\\nSi necesita restaurar algún script, puede copiarlo desde el directorio de backup.");
`;

// Guardar script eliminador
fs.writeFileSync(path.join(directorio, 'js', 'eliminar-scripts-redundantes.js'), contenidoEliminador);
