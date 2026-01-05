// Este script debe ejecutarse en PowerShell para modificar todos los archivos HTML

// Obtener la lista de todos los archivos HTML en el directorio
const fs = require('fs');
const path = require('path');

const directorio = __dirname; // Directorio actual
const archivosHTML = fs.readdirSync(directorio).filter(archivo => archivo.endsWith('.html'));

console.log(`Se encontraron ${archivosHTML.length} archivos HTML para modificar`);

// Procesar cada archivo HTML
archivosHTML.forEach(archivo => {
    const rutaArchivo = path.join(directorio, archivo);
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Verificar si ya tiene los archivos incluidos
    const tieneCSS = contenido.includes('image-size-fix.css');
    const tieneJS = contenido.includes('image-size-fix.js');
    
    let modificado = false;
    
    // Añadir CSS si no existe
    if (!tieneCSS) {
        // Buscar la etiqueta </head> para insertar antes
        if (contenido.includes('</head>')) {
            contenido = contenido.replace('</head>', '    <link rel="stylesheet" href="./css/image-size-fix.css">\n</head>');
            modificado = true;
        }
    }
    
    // Añadir JS si no existe
    if (!tieneJS) {
        // Buscar la etiqueta </body> para insertar antes
        if (contenido.includes('</body>')) {
            contenido = contenido.replace('</body>', '    <script src="./js/image-size-fix.js"></script>\n</body>');
            modificado = true;
        }
    }
    
    // Guardar los cambios si se hizo alguna modificación
    if (modificado) {
        fs.writeFileSync(rutaArchivo, contenido, 'utf8');
        console.log(`✅ Archivo ${archivo} modificado correctamente`);
    } else {
        console.log(`ℹ️ Archivo ${archivo} no requirió modificaciones`);
    }
});

console.log('Proceso completado.');
