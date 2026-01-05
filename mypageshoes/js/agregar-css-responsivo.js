// Script para agregar CSS responsivo móvil a todas las páginas HTML
// Este script actualiza automáticamente todas las páginas para incluir responsive-mobile.css

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const directorio = './';

// CSS a agregar
const responsiveCss = '<link rel="stylesheet" href="css/responsive-mobile.css">';

// Función para procesar un archivo HTML
function procesarArchivo(archivo) {
    const rutaCompleta = path.join(directorio, archivo);
    
    try {
        let contenido = fs.readFileSync(rutaCompleta, 'utf8');
        
        // Verificar si ya tiene el CSS responsivo
        if (contenido.includes('responsive-mobile.css')) {
            console.log(`✓ ${archivo} ya tiene el CSS responsivo`);
            return;
        }
        
        // Buscar el lugar correcto para insertar el CSS (antes de la etiqueta </head>)
        const posicionHead = contenido.indexOf('</head>');
        if (posicionHead === -1) {
            console.log(`⚠ ${archivo} no tiene etiqueta </head>`);
            return;
        }
        
        // Insertar el CSS responsivo antes de </head>
        const antesHead = contenido.substring(0, posicionHead);
        const despuesHead = contenido.substring(posicionHead);
        
        // Agregar el CSS con indentación correcta
        const nuevoContenido = antesHead + '  ' + responsiveCss + '\n' + despuesHead;
        
        // Escribir el archivo actualizado
        fs.writeFileSync(rutaCompleta, nuevoContenido, 'utf8');
        console.log(`✓ ${archivo} actualizado con CSS responsivo`);
        
    } catch (error) {
        console.error(`✗ Error procesando ${archivo}:`, error.message);
    }
}

// Obtener todos los archivos HTML del directorio
try {
    const archivos = fs.readdirSync(directorio);
    const archivosHTML = archivos.filter(archivo => 
        archivo.endsWith('.html') && 
        !archivo.startsWith('demo-') && 
        !archivo.startsWith('test-') &&
        !archivo.startsWith('diagnostico-') &&
        !archivo.startsWith('prueba-') &&
        !archivo.startsWith('herramienta-')
    );
    
    console.log(`Encontrados ${archivosHTML.length} archivos HTML para procesar:`);
    archivosHTML.forEach(archivo => console.log(`  - ${archivo}`));
    console.log('');
    
    // Procesar cada archivo
    archivosHTML.forEach(procesarArchivo);
    
    console.log('\n🎉 Proceso completado. Todas las páginas ahora tienen CSS responsivo móvil.');
    
} catch (error) {
    console.error('Error leyendo el directorio:', error.message);
}
