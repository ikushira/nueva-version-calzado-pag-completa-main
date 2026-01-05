// Script para inicializar y corregir los estilos del carrito
// Este script debe cargarse después de carrito-simplificado.js

document.addEventListener('DOMContentLoaded', function() {
  console.log("[CARRITO-ESTILO-FIX] Iniciando corrección de estilos del carrito");
  
  // Asegurar que el header del carrito tenga los estilos correctos
  const modalHeader = document.querySelector('.modal-carrito-header');
  if (modalHeader) {
    modalHeader.style.backgroundColor = '#e30613';
    modalHeader.style.color = 'white';
    modalHeader.style.padding = '10px 15px';
    modalHeader.style.margin = '-24px -18px 15px -18px';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
  }
  
  // Estilos para el botón de cerrar
  const cerrarBtn = document.querySelector('.cerrar-carrito');
  if (cerrarBtn) {
    cerrarBtn.style.color = 'white';
    cerrarBtn.style.background = 'none';
    cerrarBtn.style.border = 'none';
    cerrarBtn.style.fontSize = '1.5rem';
    cerrarBtn.style.cursor = 'pointer';
  }
  
  // Estilos para el título del carrito
  const titulo = document.querySelector('.modal-carrito-title');
  if (titulo) {
    titulo.style.display = 'flex';
    titulo.style.alignItems = 'center';
    titulo.style.gap = '8px';
  }
  
  // Estilo para el botón de finalizar compra (IR A PAGAR)
  const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
  if (btnFinalizarCompra) {
    btnFinalizarCompra.style.backgroundColor = '#e30613';
    btnFinalizarCompra.style.color = 'white';
    btnFinalizarCompra.style.border = 'none';
    btnFinalizarCompra.style.borderRadius = '4px';
    btnFinalizarCompra.style.padding = '12px';
    btnFinalizarCompra.style.fontSize = '1rem';
    btnFinalizarCompra.style.fontWeight = 'bold';
    btnFinalizarCompra.style.cursor = 'pointer';
    btnFinalizarCompra.style.width = '100%';
    btnFinalizarCompra.style.textAlign = 'center';
    btnFinalizarCompra.style.textTransform = 'uppercase';
  }
  
  // Asegurar que el icono del carrito vacío tenga el color correcto
  const iconoCarritoVacio = document.querySelector('.carrito-vacio-icon-color');
  if (iconoCarritoVacio) {
    iconoCarritoVacio.style.color = '#e30613';
    iconoCarritoVacio.style.opacity = '0.8';
  }
  
  // Corrección para forzar el ocultamiento del carrito vacío cuando hay productos
  function actualizarVisibilidadMensajeVacio() {
    const carritoLista = document.getElementById('carrito-lista');
    const carritoVacio = document.getElementById('carrito-vacio');
    
    if (!carritoLista || !carritoVacio) return;
    
    // Si hay productos, ocultar mensaje de carrito vacío
    if (carritoLista.children.length > 0) {
      carritoVacio.classList.add('oculto');
      carritoVacio.style.display = 'none';
      carritoVacio.style.visibility = 'hidden';
      carritoVacio.style.height = '0';
      carritoVacio.style.overflow = 'hidden';
    } else {
      carritoVacio.classList.remove('oculto');
      carritoVacio.style.display = 'flex';
      carritoVacio.style.visibility = 'visible';
      carritoVacio.style.height = 'auto';
    }
  }
  
  // Corregir estilo de la información de envío gratis
  document.querySelectorAll('.carrito-info-envio').forEach(info => {
    if (info.classList.contains('envio-gratis')) {
      info.style.backgroundColor = '#e8f5e9';
      info.style.color = '#388e3c';
      info.style.padding = '10px';
      info.style.borderRadius = '4px';
      info.style.margin = '10px 0';
      info.style.fontWeight = '600';
      info.style.fontSize = '0.9rem';
      info.style.display = 'flex';
      info.style.alignItems = 'center';
      info.style.justifyContent = 'center';
    }
  });
  
  // Ajustar estilos de los items del carrito para que se vean como en la imagen
  document.querySelectorAll('.carrito-item').forEach(item => {
    item.style.display = 'flex';
    item.style.flexDirection = 'row';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'space-between';
    item.style.padding = '15px 0';
    item.style.borderBottom = '1px solid #eee';
    
    // Ajustar imagen del producto
    const imagen = item.querySelector('.carrito-item-imagen');
    if (imagen) {
      imagen.style.width = '60px';
      imagen.style.height = '60px';
      imagen.style.marginRight = '15px';
      
      // Imagen dentro del contenedor
      const img = imagen.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
      }
    }
  });
  
  // Aplicar corrección inicial
  actualizarVisibilidadMensajeVacio();
  
  // Verificar periódicamente y aplicar estilos
  setInterval(function() {
    actualizarVisibilidadMensajeVacio();
    
    // Asegurar que el header tenga siempre los estilos correctos
    const modalHeader = document.querySelector('.modal-carrito-header');
    if (modalHeader) {
      modalHeader.style.backgroundColor = '#e30613';
      modalHeader.style.color = 'white';
    }
    
    // Asegurar que el botón de finalizar compra tenga siempre el estilo correcto
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    if (btnFinalizarCompra) {
      btnFinalizarCompra.style.backgroundColor = '#e30613';
      btnFinalizarCompra.style.color = 'white';
      btnFinalizarCompra.style.textTransform = 'uppercase';
      btnFinalizarCompra.style.fontWeight = 'bold';
      btnFinalizarCompra.style.borderRadius = '4px';
    }
    
    // Asegurar que el botón de cerrar tenga siempre el color correcto
    const cerrarBtn = document.querySelector('.cerrar-carrito');
    if (cerrarBtn) {
      cerrarBtn.style.color = 'white';
    }
  }, 500);
  
  console.log("[CARRITO-ESTILO-FIX] Corrección de estilos del carrito completada");
});
