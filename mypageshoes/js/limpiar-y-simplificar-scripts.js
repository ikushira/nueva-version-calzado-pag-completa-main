// limpiar-y-simplificar-scripts.js
// Script para limpiar y simplificar los scripts de carrito en todas las páginas HTML
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(`Encontrados ${archivos.length} archivos HTML para simplificar`);

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
    'diagnostico-carrito-tarjetas.js'
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
        
        // Buscar y contar referencias a scripts de carrito
        let conteoScripts = {};
        let totalScriptsCarrito = 0;
        
        scriptsAEliminar.forEach(script => {
            const regex = new RegExp(`<script[^>]*src="[^"]*${script}"[^>]*>.*?<\\/script>`, 'g');
            const coincidencias = contenido.match(regex) || [];
            conteoScripts[script] = coincidencias.length;
            totalScriptsCarrito += coincidencias.length;
        });
        
        // Solo procesamos archivos que tengan scripts relacionados con el carrito
        if (totalScriptsCarrito > 0) {
            console.log(`⚠️ ${archivo}: Contiene ${totalScriptsCarrito} scripts relacionados con el carrito`);
            
            // Eliminar todos los scripts relacionados con el carrito
            scriptsAEliminar.forEach(script => {
                const regex = new RegExp(`<script[^>]*src="[^"]*${script}"[^>]*>.*?<\\/script>\\s*`, 'g');
                contenido = contenido.replace(regex, '');
            });
            
            // Determinar si este archivo necesita el script de carrito
            const paginasConCarrito = [
                'mujeres.html', 'hombres.html', 'ninas.html', 'ninos.html', 
                'colegiales.html', 'dotacion.html', 'accesorios.html', 'marcas.html', 
                'nuevos.html', 'ofertas.html', 'index.html', 'cuenta.html', 
                'direccion_cuenta.html', 'editar_perfil.html', 'login.html',
                'guia-tallas.html', 'limpiar-carrito.html', 'ver_usuarios.html'
            ];
            
            // Añadir el nuevo script simplificado si es necesario
            if (paginasConCarrito.includes(archivo)) {
                // Buscar la posición antes del cierre de body
                const cierreBody = '</body>';
                let posicionCierreBody = contenido.lastIndexOf(cierreBody);
                
                if (posicionCierreBody !== -1) {
                    // Insertar nuestro nuevo script justo antes del cierre de body
                    contenido = contenido.substring(0, posicionCierreBody) + 
                            '\n  <!-- Script unificado de carrito -->\n' +
                            '  <script src="js/carrito-simplificado.js"></script>\n' + 
                            contenido.substring(posicionCierreBody);
                    
                    console.log(`✅ ${archivo}: Scripts de carrito unificados y simplificados`);
                }
            }
            
            // Guardar cambios si hubo modificaciones
            if (contenido !== contenidoOriginal) {
                fs.writeFileSync(rutaArchivo, contenido, 'utf8');
                corregidos++;
                paginasCorregidas.push(archivo);
            }
        } else {
            console.log(`ℹ️ ${archivo}: No contiene scripts relacionados con el carrito`);
        }
    } catch (error) {
        console.error(`❌ ${archivo}: Error al procesar - ${error.message}`);
    }
});

console.log("\n=== RESUMEN DE SIMPLIFICACIÓN ===");
console.log(`Total de archivos HTML: ${archivos.length}`);
console.log(`Archivos simplificados: ${corregidos}`);

if (corregidos > 0) {
    console.log("\nPáginas corregidas:");
    paginasCorregidas.forEach(p => console.log(`- ${p}`));
}

// Ahora, buscar scripts en línea y moverlos a archivos separados
console.log("\n=== BUSCANDO SCRIPTS EN LÍNEA ===");

let scriptsEnLinea = 0;
let archivosConScriptsEnLinea = [];

// Procesar cada archivo HTML nuevamente para buscar scripts en línea
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    
    try {
        // Leer contenido del archivo
        const contenido = fs.readFileSync(rutaArchivo, 'utf8');
        
        // Buscar scripts en línea (que no sean referencias a archivos externos)
        const regex = /<script\b(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g;
        const coincidencias = contenido.match(regex) || [];
        
        if (coincidencias.length > 0) {
            console.log(`🔍 ${archivo}: Contiene ${coincidencias.length} scripts en línea`);
            scriptsEnLinea += coincidencias.length;
            archivosConScriptsEnLinea.push({ archivo, cantidad: coincidencias.length });
        }
    } catch (error) {
        console.error(`❌ ${archivo}: Error al buscar scripts en línea - ${error.message}`);
    }
});

console.log(`\nTotal de scripts en línea encontrados: ${scriptsEnLinea}`);

if (archivosConScriptsEnLinea.length > 0) {
    console.log("\nArchivos con scripts en línea:");
    archivosConScriptsEnLinea.forEach(item => 
        console.log(`- ${item.archivo}: ${item.cantidad} scripts`)
    );
    
    console.log("\nPara extraer los scripts en línea, ejecute el script 'extraer-scripts-en-linea.js'");
}

// Crear script para extraer scripts en línea
const contenidoExtractorScripts = `// extraer-scripts-en-linea.js
// Script para extraer scripts en línea de los archivos HTML y moverlos a archivos separados
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Obtener lista de archivos HTML
const directorio = '.';
const archivos = fs.readdirSync(directorio)
    .filter(archivo => archivo.endsWith('.html'));

console.log(\`Encontrados \${archivos.length} archivos HTML para extraer scripts\`);

let scriptsExtraidos = 0;
let archivosModificados = [];

// Crear directorio para scripts extraídos si no existe
const dirScriptsExtraidos = path.join(directorio, 'js', 'scripts_extraidos');
if (!fs.existsSync(dirScriptsExtraidos)) {
    fs.mkdirSync(dirScriptsExtraidos, { recursive: true });
}

// Procesar cada archivo HTML
archivos.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    const nombreBase = path.basename(archivo, '.html');
    
    try {
        // Leer contenido del archivo
        let contenido = fs.readFileSync(rutaArchivo, 'utf8');
        const contenidoOriginal = contenido;
        
        // Buscar scripts en línea (que no sean referencias a archivos externos)
        const regex = /<script\\b(?![^>]*src=)[^>]*>([\s\S]*?)<\\/script>/g;
        let coincidencia;
        let contador = 0;
        let modificado = false;
        
        // Usar un conjunto para evitar duplicados
        const scriptsUnicos = new Set();
        
        // Reemplazar cada script en línea
        while ((coincidencia = regex.exec(contenido)) !== null) {
            const scriptCompleto = coincidencia[0];
            const contenidoScript = coincidencia[1].trim();
            
            // Saltear scripts vacíos o muy cortos
            if (contenidoScript.length < 10) continue;
            
            // Usar un hash del contenido para detectar duplicados
            const hashScript = Buffer.from(contenidoScript).toString('base64').substring(0, 20);
            if (scriptsUnicos.has(hashScript)) continue;
            scriptsUnicos.add(hashScript);
            
            // Crear nombre de archivo para el script
            contador++;
            const nombreArchivo = \`\${nombreBase}_script_\${contador}.js\`;
            const rutaScriptExtraido = path.join(dirScriptsExtraidos, nombreArchivo);
            
            // Guardar el script en un archivo separado
            fs.writeFileSync(rutaScriptExtraido, contenidoScript);
            scriptsExtraidos++;
            
            // Reemplazar el script en línea con una referencia al archivo
            contenido = contenido.replace(
                scriptCompleto,
                \`<script src="js/scripts_extraidos/\${nombreArchivo}"></script>\`
            );
            
            modificado = true;
            console.log(\`✅ \${archivo}: Script #\${contador} extraído a \${nombreArchivo}\`);
        }
        
        // Guardar cambios si hubo modificaciones
        if (modificado) {
            fs.writeFileSync(rutaArchivo, contenido, 'utf8');
            archivosModificados.push({ archivo, scriptCount: contador });
        }
    } catch (error) {
        console.error(\`❌ \${archivo}: Error al extraer scripts - \${error.message}\`);
    }
});

console.log("\\n=== RESUMEN DE EXTRACCIÓN ===");
console.log(\`Total de scripts extraídos: \${scriptsExtraidos}\`);
console.log(\`Archivos modificados: \${archivosModificados.length}\`);

if (archivosModificados.length > 0) {
    console.log("\\nDetalle de archivos modificados:");
    archivosModificados.forEach(item => 
        console.log(\`- \${item.archivo}: \${item.scriptCount} scripts extraídos\`)
    );
}
`;

// Guardar script extractor
fs.writeFileSync(path.join(directorio, 'js', 'extraer-scripts-en-linea.js'), contenidoExtractorScripts);
console.log("\nScript 'extraer-scripts-en-linea.js' creado para procesar los scripts en línea");
