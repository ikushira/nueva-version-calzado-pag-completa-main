// Script para agregar el archivo CSS de tarjetas estandarizadas a todas las páginas HTML
const fs = require('fs');
const path = require('path');

// Ruta base del proyecto
const basePath = process.cwd();

// Lista de archivos HTML a modificar (excluyendo direcciones y perfiles)
const htmlFiles = [
  'accesorios.html',
  'colegiales.html',
  'cuenta.html',
  'dotacion.html',
  'guia-tallas.html',
  'hombres.html',
  'index.html',
  'login.html',
  'marcas.html',
  'mujeres.html',
  'ninas.html',
  'ninos.html',
  'nuevos.html',
  'ofertas.html',
  'ver_usuarios.html'
];

// Líneas CSS que queremos agregar
const cssLinks = [
  '<link rel="stylesheet" href="css/variables.css">',
  '<link rel="stylesheet" href="css/standardized-cards.css">'
];

// Marcador para determinar dónde insertar las nuevas líneas (antes de styles.css)
const marker = '<link rel="stylesheet" href="css/styles.css">';

// Procesar cada archivo
htmlFiles.forEach(file => {
  const filePath = path.join(basePath, file);
  
  try {
    // Leer el contenido del archivo
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Verificar e insertar cada línea CSS
    cssLinks.forEach(cssLink => {
      // Verificar si el archivo ya contiene la línea que queremos agregar
      if (content.includes(cssLink)) {
        console.log(`${file}: El archivo ya contiene la referencia a ${cssLink}.`);
        return;
      }
      
      // Buscar la posición del marcador
      const markerPosition = content.indexOf(marker);
      
      if (markerPosition === -1) {
        console.log(`${file}: No se encontró el marcador en el archivo.`);
        return;
      }
      
      // Insertar la nueva línea antes del marcador
      content = content.slice(0, markerPosition) + 
                  cssLink + '\n  ' + 
                  content.slice(markerPosition);
      
      modified = true;
      console.log(`${file}: ${cssLink.match(/href="([^"]+)"/)[1]} agregado correctamente.`);
    });
    
    // Escribir el contenido actualizado en el archivo solo si se hicieron cambios
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  } catch (error) {
    console.error(`${file}: Error al procesar el archivo - ${error.message}`);
  }
});

console.log('Proceso completado.');
