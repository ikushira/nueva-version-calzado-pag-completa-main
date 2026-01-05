// Script para agregar navegación móvil a todas las páginas HTML
// Este script actualiza automáticamente todas las páginas para incluir el menú móvil

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const directorio = './';

// CSS y JS a agregar
const mobileNavCss = '<link rel="stylesheet" href="css/mobile-navigation.css">';
const mobileNavJs = '<script src="js/mobile-navigation.js"></script>';

// Función para procesar un archivo HTML
function procesarArchivo(archivo) {
    const rutaCompleta = path.join(directorio, archivo);
    
    try {
        let contenido = fs.readFileSync(rutaCompleta, 'utf8');
        let cambios = false;
        
        // Verificar y agregar CSS si no existe
        if (!contenido.includes('mobile-navigation.css')) {
            const posicionHead = contenido.indexOf('</head>');
            if (posicionHead !== -1) {
                const antesHead = contenido.substring(0, posicionHead);
                const despuesHead = contenido.substring(posicionHead);
                
                contenido = antesHead + '  ' + mobileNavCss + '\n' + despuesHead;
                cambios = true;
            }
        }
        
        // Verificar y agregar JS si no existe
        if (!contenido.includes('mobile-navigation.js')) {
            const posicionBody = contenido.indexOf('</body>');
            if (posicionBody !== -1) {
                const antesBody = contenido.substring(0, posicionBody);
                const despuesBody = contenido.substring(posicionBody);
                
                contenido = antesBody + '  ' + mobileNavJs + '\n' + despuesBody;
                cambios = true;
            }
        }
        
        if (cambios) {
            // Escribir el archivo actualizado
            fs.writeFileSync(rutaCompleta, contenido, 'utf8');
            console.log(`✓ ${archivo} actualizado con navegación móvil`);
        } else {
            console.log(`✓ ${archivo} ya tiene navegación móvil`);
        }
        
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
    
    console.log('\n🎉 Proceso completado. Todas las páginas ahora tienen navegación móvil.');
    
} catch (error) {
    console.error('Error leyendo el directorio:', error.message);
}
