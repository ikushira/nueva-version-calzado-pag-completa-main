// agregar-css-carrito.js
// Script para añadir el archivo CSS de corrección de imágenes del carrito a todas las páginas HTML
// Fecha: 27/07/2025

const fs = require('fs');
const path = require('path');

// Lista de páginas principales donde queremos hacer la modificación
const paginasPrincipales = [
  'index.html',
  'mujeres.html',
  'hombres.html',
  'ninas.html',
  'ninos.html',
  'colegiales.html',
  'dotacion.html',
  'accesorios.html',
  'marcas.html',
  'nuevos.html',
  'ofertas.html',
  'login.html',
  'cuenta.html',
  'direccion_cuenta.html',
  'editar_perfil.html',
  'guia-tallas.html',
  'ver_usuarios.html'
];

console.log("=== AÑADIENDO CSS DE CORRECCIÓN DE IMÁGENES DEL CARRITO ===");

// Directorio raíz del proyecto
const directorio = '.';

// Procesar cada página
for (const pagina of paginasPrincipales) {
  const rutaArchivo = path.join(directorio, pagina);
  
  // Verificar si el archivo existe
  if (!fs.existsSync(rutaArchivo)) {
    console.log(`ℹ️ ${pagina}: No encontrado, saltando...`);
    continue;
  }
  
  try {
    // Leer el archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    
    // Verificar si ya tiene el CSS incluido
    if (contenido.includes('carrito-imagen-fix.css')) {
      console.log(`ℹ️ ${pagina}: Ya tiene el CSS incluido`);
      continue;
    }
    
    // Buscar la posición para insertar el nuevo CSS (justo después del último enlace a CSS de carrito)
    const regexLastCarritoCss = /<link[^>]*href="[^"]*carrito[^"]*\.css"[^>]*>/g;
    let ultimoCarritoCss = null;
    let coincidencia;
    
    while ((coincidencia = regexLastCarritoCss.exec(contenido)) !== null) {
      ultimoCarritoCss = coincidencia;
    }
    
    if (ultimoCarritoCss) {
      const posicionInsercion = ultimoCarritoCss.index + ultimoCarritoCss[0].length;
      
      // Insertar el nuevo enlace CSS
      const nuevoEnlace = '\n  <link rel="stylesheet" href="css/carrito-imagen-fix.css">';
      contenido = contenido.substring(0, posicionInsercion) + nuevoEnlace + contenido.substring(posicionInsercion);
      
      // Guardar el archivo modificado
      fs.writeFileSync(rutaArchivo, contenido, 'utf8');
      console.log(`✅ ${pagina}: CSS añadido correctamente`);
    } else {
      // Si no encontramos un CSS de carrito, buscar antes de </head>
      const posicionHead = contenido.indexOf('</head>');
      if (posicionHead !== -1) {
        const nuevoEnlace = '  <link rel="stylesheet" href="css/carrito-imagen-fix.css">\n  ';
        contenido = contenido.substring(0, posicionHead) + nuevoEnlace + contenido.substring(posicionHead);
        
        // Guardar el archivo modificado
        fs.writeFileSync(rutaArchivo, contenido, 'utf8');
        console.log(`✅ ${pagina}: CSS añadido antes de </head>`);
      } else {
        console.log(`❌ ${pagina}: No se pudo encontrar un lugar para insertar el CSS`);
      }
    }
  } catch (error) {
    console.error(`❌ ${pagina}: Error al procesar - ${error.message}`);
  }
}

console.log("\n=== RESUMEN ===");
console.log("El CSS de corrección de imágenes del carrito ha sido añadido a las páginas principales.");
console.log("Archivo CSS creado: css/carrito-imagen-fix.css");
