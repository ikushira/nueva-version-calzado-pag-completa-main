// Script para aplicar correcciones a todas las páginas HTML
const fs = require('fs');
const path = require('path');

// Ruta base del proyecto
const basePath = process.cwd();

// Lista de archivos HTML a modificar
const htmlFiles = [
  'accesorios.html',
  'colegiales.html',
  'cuenta.html',
  'direccion_cuenta.html',
  'dotacion.html',
  'editar_perfil.html',
  'guia-tallas.html',
  'hombres.html',
  'login.html',
  'marcas.html',
  'mujeres.html',
  'ninas.html',
  'ninos.html',
  'nuevos.html',
  'ofertas.html',
  'ver_usuarios.html'
];

// Archivos CSS a agregar (en orden)
const cssFilesToAdd = [
  '<link rel="stylesheet" href="css/whatsapp-button.css">',
  '<link rel="stylesheet" href="css/footer-enhanced.css">'
];

// Punto de referencia para insertar los archivos CSS (antes de la línea de font-awesome)
const beforeMarker = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';

// Procesar cada archivo HTML
htmlFiles.forEach(file => {
  const filePath = path.join(basePath, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`${file}: No existe, omitiendo.`);
    return;
  }
  
  try {
    // Leer el contenido del archivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar posición del marcador
    const markerPos = content.indexOf(beforeMarker);
    
    if (markerPos === -1) {
      console.log(`${file}: No se encontró el marcador en el archivo.`);
      return;
    }
    
    // Comprobar si ya contiene los archivos CSS
    let needsUpdate = false;
    let updatedContent = content;
    
    // Insertar cada archivo CSS si no existe
    cssFilesToAdd.forEach(cssFile => {
      if (!content.includes(cssFile)) {
        needsUpdate = true;
        updatedContent = updatedContent.replace(
          beforeMarker,
          cssFile + '\n  ' + beforeMarker
        );
      }
    });
    
    // Guardar los cambios si es necesario
    if (needsUpdate) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`${file}: Archivos CSS agregados correctamente.`);
    } else {
      console.log(`${file}: Ya contiene todos los archivos CSS necesarios.`);
    }
    
  } catch (error) {
    console.error(`${file}: Error al procesar el archivo: ${error.message}`);
  }
});

console.log('Proceso completado.');
