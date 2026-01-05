// Script para actualizar referencias a archivos JavaScript en archivos HTML
const fs = require('fs');
const path = require('path');

// Directorio raíz del proyecto
const rootDir = path.resolve(__dirname, '..');

// Buscar todos los archivos HTML
const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

console.log(`Encontrados ${htmlFiles.length} archivos HTML para actualizar`);

// Lista de scripts que se han movido
const scriptsMoved = [
  'actualizar-carrito-ui-v2.js',
  'actualizar-scripts.js',
  'actualizar-visualizacion-carrito.js',
  'agregar-diagnostico-carrito.js',
  'agregar-diagnostico.js',
  'aplicar-correccion-carrito.js',
  'aplicar-fix-radical-v2.js',
  'aplicar-fix-radical.js',
  'aplicar-mejora-carrito.js',
  'apply-fixes-copy.js',
  'clear_cart.js',
  'enhance-visual-elements.js',
  'mover-js-a-carpeta.js',
  'update-color-theme.js',
  'update-color.js',
  'update-enhanced-styles.js'
];

// Contador de archivos y referencias actualizadas
let filesUpdated = 0;
let referencesUpdated = 0;

// Procesar cada archivo HTML
htmlFiles.forEach(htmlFile => {
  const filePath = path.join(rootDir, htmlFile);
  
  // Leer el contenido del archivo
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let updated = false;
  
  // Buscar y reemplazar referencias a cada script
  scriptsMoved.forEach(script => {
    // Buscar referencias sin el prefijo js/
    const regex = new RegExp(`<script src="${script}"></script>`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, `<script src="js/${script}"></script>`);
      updated = true;
      referencesUpdated++;
      console.log(`✅ ${htmlFile}: Actualizada referencia a ${script}`);
    }
  });
  
  // Si se hizo algún cambio, guardar el archivo
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`📝 ${htmlFile}: Archivo actualizado con ${referencesUpdated} cambios`);
  }
});

console.log(`\nResumen:\n- Total archivos HTML: ${htmlFiles.length}\n- Archivos actualizados: ${filesUpdated}\n- Referencias actualizadas: ${referencesUpdated}`);
console.log('Proceso completado.');
