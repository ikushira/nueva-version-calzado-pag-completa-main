// Script para mover archivos JavaScript a la carpeta js
const fs = require('fs');
const path = require('path');

// Directorio raíz del proyecto
const rootDir = __dirname;
const jsDir = path.join(rootDir, 'js');

// Verificar que la carpeta js existe
if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir);
  console.log('Carpeta js creada');
}

// Lista de archivos JavaScript en la raíz (excluir los que ya están en carpetas)
const jsFiles = fs.readdirSync(rootDir).filter(file => 
  file.endsWith('.js') && 
  !fs.statSync(path.join(rootDir, file)).isDirectory()
);

console.log(`Encontrados ${jsFiles.length} archivos JavaScript en la raíz`);

// Mover cada archivo a la carpeta js
let filesMoved = 0;
jsFiles.forEach(file => {
  const sourcePath = path.join(rootDir, file);
  const destPath = path.join(jsDir, file);
  
  // Verificar si el archivo ya existe en la carpeta js
  if (fs.existsSync(destPath)) {
    console.log(`⚠️ ${file}: Ya existe en la carpeta js, verificando si son iguales...`);
    
    // Leer contenido de ambos archivos
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    const destContent = fs.readFileSync(destPath, 'utf8');
    
    if (sourceContent === destContent) {
      console.log(`✅ ${file}: Los archivos son idénticos, eliminando el de la raíz`);
      fs.unlinkSync(sourcePath);
      filesMoved++;
    } else {
      console.log(`⚠️ ${file}: Los archivos son diferentes, creando copia con sufijo`);
      // Crear nombre alternativo
      let newName = file.replace('.js', '-copy.js');
      let counter = 1;
      while (fs.existsSync(path.join(jsDir, newName))) {
        newName = file.replace('.js', `-copy${counter}.js`);
        counter++;
      }
      fs.copyFileSync(sourcePath, path.join(jsDir, newName));
      fs.unlinkSync(sourcePath);
      console.log(`✅ ${file}: Movido como ${newName}`);
      filesMoved++;
    }
  } else {
    // Mover el archivo
    fs.copyFileSync(sourcePath, destPath);
    fs.unlinkSync(sourcePath);
    console.log(`✅ ${file}: Movido correctamente`);
    filesMoved++;
  }
});

console.log(`\nResumen:\n- Total archivos: ${jsFiles.length}\n- Archivos movidos: ${filesMoved}`);
console.log('Proceso completado.');
