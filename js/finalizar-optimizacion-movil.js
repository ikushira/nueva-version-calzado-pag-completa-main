// Script para agregar todos los CSS móviles mejorados a las páginas
// Este script completa la optimización móvil del sitio

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const directorio = './';

// CSS móviles a agregar según el tipo de página
const cssMoviles = {
    carrito: '<link rel="stylesheet" href="css/carrito-mobile-improvements.css">',
    checkout: '<link rel="stylesheet" href="css/checkout-mobile.css">'
};

// Páginas que necesitan CSS de carrito
const paginasCarrito = [
    'index.html', 'mujeres.html', 'hombres.html', 'ninos.html', 'ninas.html',
    'nuevos.html', 'ofertas.html', 'marcas.html', 'accesorios.html', 
    'colegiales.html', 'dotacion.html'
];

// Páginas que necesitan CSS de checkout
const paginasCheckout = [
    'checkout.html', 'checkout-success.html', 'checkout-error.html'
];

// Función para procesar un archivo HTML
function procesarArchivo(archivo) {
    const rutaCompleta = path.join(directorio, archivo);
    
    try {
        let contenido = fs.readFileSync(rutaCompleta, 'utf8');
        let cambios = false;
        
        // Agregar CSS de carrito móvil si es necesario
        if (paginasCarrito.includes(archivo)) {
            if (!contenido.includes('carrito-mobile-improvements.css')) {
                const posicionHead = contenido.indexOf('</head>');
                if (posicionHead !== -1) {
                    const antesHead = contenido.substring(0, posicionHead);
                    const despuesHead = contenido.substring(posicionHead);
                    
                    contenido = antesHead + '  ' + cssMoviles.carrito + '\n' + despuesHead;
                    cambios = true;
                }
            }
        }
        
        // Agregar CSS de checkout móvil si es necesario
        if (paginasCheckout.includes(archivo)) {
            if (!contenido.includes('checkout-mobile.css')) {
                const posicionHead = contenido.indexOf('</head>');
                if (posicionHead !== -1) {
                    const antesHead = contenido.substring(0, posicionHead);
                    const despuesHead = contenido.substring(posicionHead);
                    
                    contenido = antesHead + '  ' + cssMoviles.checkout + '\n' + despuesHead;
                    cambios = true;
                }
            }
        }
        
        if (cambios) {
            // Escribir el archivo actualizado
            fs.writeFileSync(rutaCompleta, contenido, 'utf8');
            console.log(`✓ ${archivo} actualizado con CSS móviles específicos`);
        } else {
            console.log(`✓ ${archivo} ya tiene CSS móviles correspondientes`);
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
    
    console.log('🎨 Agregando CSS móviles específicos...\n');
    
    console.log(`📱 Páginas con carrito (${paginasCarrito.length}):`);
    paginasCarrito.forEach(archivo => {
        if (archivosHTML.includes(archivo)) {
            console.log(`  - ${archivo}`);
            procesarArchivo(archivo);
        }
    });
    
    console.log(`\n💳 Páginas con checkout (${paginasCheckout.length}):`);
    paginasCheckout.forEach(archivo => {
        if (archivosHTML.includes(archivo)) {
            console.log(`  - ${archivo}`);
            procesarArchivo(archivo);
        }
    });
    
    console.log('\n🎉 Optimización móvil completada. El sitio ahora es totalmente responsivo.');
    
} catch (error) {
    console.error('Error leyendo el directorio:', error.message);
}
