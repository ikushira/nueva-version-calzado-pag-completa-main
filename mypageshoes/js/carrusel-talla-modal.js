// Carrusel Talla Modal Handler
// Este script maneja la selección de tallas para los productos del carrusel

document.addEventListener('DOMContentLoaded', function() {
  console.log("Inicializando manejo de tallas para carrusel");
  
  // Variables globales para talla seleccionada en el carrusel
  window.tallaSeleccionadaCarrusel = null;
  window.productoCarruselSeleccionado = null;
  
  // Referencia al modal de tallas para carrusel
  const carruselTallaModal = document.getElementById('carrusel-talla-modal');
  const carruselTallaBtns = document.querySelectorAll('.carrusel-talla-btn');
  const carruselTallaAceptar = document.getElementById('carrusel-talla-aceptar');
  const carruselTallaCerrar = document.getElementById('carrusel-talla-cerrar');
  
  if (!carruselTallaModal) {
    console.log("Modal de tallas para carrusel no encontrado");
    return;
  }
  
  // Buscar todos los botones de añadir al carrito en el carrusel
  const carruselAddBtns = document.querySelectorAll('.novedades-slide .btn-add-cart, .banner-carousel .btn-add-cart');
  
  carruselAddBtns.forEach(btn => {
    // Reemplazar el evento existente por nuestro manejador personalizado
    const nuevoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(nuevoBtn, btn);
    
    nuevoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Guardar referencia a la tarjeta de producto
      const tarjetaProducto = this.closest('.producto-card, .card-producto');
      window.productoCarruselSeleccionado = tarjetaProducto;
      
      // Verificar si ya hay una talla seleccionada para esta tarjeta
      if (tarjetaProducto.hasAttribute('data-talla-seleccionada') || 
          window.tallaSeleccionadaCarrusel) {
        console.log("Talla ya seleccionada:", 
          tarjetaProducto.getAttribute('data-talla-seleccionada') || 
          window.tallaSeleccionadaCarrusel);
        
        // Asegurarse de que la tarjeta tenga la talla guardada
        if (!tarjetaProducto.hasAttribute('data-talla-seleccionada') && window.tallaSeleccionadaCarrusel) {
          tarjetaProducto.setAttribute('data-talla-seleccionada', window.tallaSeleccionadaCarrusel);
        }
        
        // Si ya hay talla, ejecutar el clic directamente
        setTimeout(() => {
          window.tallaSeleccionadaCarrusel = tarjetaProducto.getAttribute('data-talla-seleccionada') || window.tallaSeleccionadaCarrusel;
          // Desactivar temporalmente el manejador para evitar un bucle infinito
          this.setAttribute('data-procesando', 'true');
          // Simular clic en el botón original usando aplicarCorreccionTarjetas
          if (typeof window.aplicarCorreccionTarjetas === 'function') {
            window.aplicarCorreccionTarjetas();
          }
          // Ejecutar clic en el botón de agregar al carrito
          this.click();
          setTimeout(() => {
            this.removeAttribute('data-procesando');
          }, 100);
        }, 10);
        return;
      }
      
      // Mostrar el modal de selección de talla
      carruselTallaModal.classList.remove('oculto');
      
      // Limpiar selecciones anteriores en los botones de talla
      carruselTallaBtns.forEach(tallaBtn => {
        tallaBtn.classList.remove('seleccionada');
      });
    });
  });
  
  // Manejar selección de talla en el modal
  carruselTallaBtns.forEach(tallaBtn => {
    tallaBtn.addEventListener('click', function() {
      // Limpiar selección anterior
      carruselTallaBtns.forEach(btn => {
        btn.classList.remove('seleccionada');
        btn.classList.remove('selected');
      });
      // Marcar este botón como seleccionado con ambas clases para compatibilidad
      this.classList.add('seleccionada');
      this.classList.add('selected');
    });
  });
  
  // Botón Aceptar en el modal de tallas
  if (carruselTallaAceptar) {
    carruselTallaAceptar.addEventListener('click', function() {
      // Verificar si hay una talla seleccionada
      const tallaSeleccionada = carruselTallaModal.querySelector('.carrusel-talla-btn.seleccionada, .carrusel-talla-btn.selected');
      
      if (!tallaSeleccionada) {
        alert('Por favor selecciona una talla antes de continuar.');
        return;
      }
      
      // Guardar la talla seleccionada
      const tallaValor = tallaSeleccionada.textContent.trim();
      window.tallaSeleccionadaCarrusel = tallaValor;
      
      // Guardar la talla en la tarjeta del producto
      if (window.productoCarruselSeleccionado) {
        window.productoCarruselSeleccionado.setAttribute('data-talla-seleccionada', tallaValor);
        
        // Buscar el botón de agregar al carrito y simular clic
        const addBtn = window.productoCarruselSeleccionado.querySelector('.btn-add-cart');
        if (addBtn) {
          setTimeout(() => {
            addBtn.click();
          }, 10);
        }
      }
      
      // Cerrar el modal
      carruselTallaModal.classList.add('oculto');
    });
  }
  
  // Botón Cerrar en el modal de tallas
  if (carruselTallaCerrar) {
    carruselTallaCerrar.addEventListener('click', function() {
      carruselTallaModal.classList.add('oculto');
      window.productoCarruselSeleccionado = null;
    });
  }
  
  console.log("Manejo de tallas para carrusel inicializado correctamente");
});
