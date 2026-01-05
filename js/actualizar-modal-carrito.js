// actualizar-modal-carrito.js
// Script para actualizar la estructura HTML del modal del carrito en todas las páginas
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

// Nuevo HTML para el modal del carrito
const nuevoModalCarrito = `  <!-- Modal Carrito de Compras -->
  <div id="modal-carrito" class="modal-carrito oculto">
    <div class="modal-carrito-content">
      <div class="modal-carrito-header">
        <span class="modal-carrito-title"><i class="fa-solid fa-cart-shopping"></i> MI CARRITO</span>
        <button id="cerrar-carrito" class="cerrar-carrito">&times;</button>
      </div>
      <div id="carrito-lista" class="carrito-lista">
        <!-- Aquí se mostrarán los productos del carrito -->
      </div>
      <div id="carrito-vacio" class="carrito-vacio">
        <!-- Usamos un icono visual para representar el carrito vacío -->
        <div class="carrito-vacio-icon">
          <i class="fa-solid fa-box-open fa-4x carrito-vacio-icon-color"></i>
        </div>
        <p class="carrito-vacio-txt">Tu carrito está vacío</p>
        <p class="carrito-vacio-desc">Aún no tienes artículos en tu carrito de compra.</p>
        <button id="btn-elegir-productos" class="btn-elegir-productos"><i class="fa-solid fa-shoe-prints"></i> Explorar productos</button>
      </div>
      <div id="carrito-total" class="carrito-total oculto">
        <span>Total: $<span id="carrito-total-precio">0</span></span>
        <button id="btn-finalizar-compra" class="btn-finalizar-compra">Ir a pagar</button>
      </div>
    </div>
  </div>`;

console.log("=== ACTUALIZANDO MODAL DEL CARRITO ===");

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
    
    // Buscar el modal del carrito
    const regexModalCarrito = /<!-- Modal Carrito de Compras -->\s*<div id="modal-carrito"[\s\S]*?<\/div>\s*<\/div>/;
    
    if (regexModalCarrito.test(contenido)) {
      // Reemplazar el modal del carrito con el nuevo
      contenido = contenido.replace(regexModalCarrito, nuevoModalCarrito);
      
      // Guardar el archivo modificado
      fs.writeFileSync(rutaArchivo, contenido, 'utf8');
      console.log(`✅ ${pagina}: Modal del carrito actualizado`);
    } else {
      console.log(`⚠️ ${pagina}: No se encontró el modal del carrito`);
    }
  } catch (error) {
    console.error(`❌ ${pagina}: Error al procesar - ${error.message}`);
  }
}

console.log("\n=== RESUMEN ===");
console.log("El modal del carrito ha sido actualizado en todas las páginas.");
