// Script para aplicar mejoras visuales específicas en todas las páginas
// Este script modifica elementos HTML específicos para aprovechar la nueva paleta de colores
// Basada en el color rojo #ff0000
// Ejecutar con Node.js: node enhance-visual-elements.js

const fs = require('fs');
const path = require('path');

// Directorio donde están los archivos HTML
const directorio = __dirname;

// Obtener todos los archivos HTML
const archivosHTML = fs.readdirSync(directorio).filter(archivo => 
  archivo.endsWith('.html') && 
  !['diagnostico-carrito.html', 'limpiar-carrito.html', 'prueba-tallas.html'].includes(archivo)
);

console.log(`Encontrados ${archivosHTML.length} archivos HTML para mejorar visualmente`);

// Definir las transformaciones a aplicar
const transformaciones = [
  // 1. Mejorar los botones de añadir al carrito
  {
    buscar: /<button class="btn-add-cart">Añadir al carrito<\/button>/g,
    reemplazar: '<button class="btn-add-cart"><i class="fa-solid fa-cart-plus"></i> Añadir al carrito</button>'
  },
  // 2. Mejorar los botones de finalizar compra
  {
    buscar: /<button id="btn-finalizar-compra" class="btn-finalizar-compra">Finalizar compra<\/button>/g,
    reemplazar: '<button id="btn-finalizar-compra" class="btn-finalizar-compra"><i class="fa-solid fa-check"></i> Finalizar compra</button>'
  },
  // 3. Destacar las promociones
  {
    buscar: /<span class="promo-strong">([^<]+)<\/span>/g,
    reemplazar: '<span class="promo-strong"><i class="fa-solid fa-fire"></i> $1</span>'
  },
  // 4. Mejorar botón de elegir productos
  {
    buscar: /<button id="btn-elegir-productos" class="btn-elegir-productos">Elegir productos<\/button>/g,
    reemplazar: '<button id="btn-elegir-productos" class="btn-elegir-productos"><i class="fa-solid fa-shoe-prints"></i> Explorar productos</button>'
  },
  // 5. Destacar etiquetas de envío gratis
  {
    buscar: /<span class="etiqueta-envio">\*ENVÍO GRATIS <i class="fa-solid fa-rocket"><\/i><\/span>/g,
    reemplazar: '<span class="etiqueta-envio"><i class="fa-solid fa-rocket"></i> ¡ENVÍO GRATIS!</span>'
  }
];

// Procesar cada archivo
archivosHTML.forEach(archivo => {
  const rutaArchivo = path.join(directorio, archivo);
  
  try {
    // Leer el contenido del archivo
    let contenido = fs.readFileSync(rutaArchivo, 'utf8');
    let contenidoOriginal = contenido;
    
    // Aplicar cada transformación
    transformaciones.forEach(({ buscar, reemplazar }) => {
      contenido = contenido.replace(buscar, reemplazar);
    });
    
    // Guardar el archivo actualizado si hay cambios
    if (contenido !== contenidoOriginal) {
      fs.writeFileSync(rutaArchivo, contenido);
      console.log(`✅ Mejorado visualmente: ${archivo}`);
    } else {
      console.log(`⏭️ No se requieren mejoras visuales en: ${archivo}`);
    }
  } catch (error) {
    console.error(`❌ Error al procesar ${archivo}:`, error);
  }
});

console.log('Proceso de mejora visual completado.');
