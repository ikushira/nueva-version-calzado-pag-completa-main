/**
 * carrusel-carrito.js
 * Maneja la funcionalidad de añadir al carrito desde el carrusel de la página principal
 */

(function() {
  'use strict';

  console.log('🛒 Inicializando sistema de carrito para carrusel');

  // Datos de productos del carrusel
  // Las rutas son relativas desde index.html (carpeta raíz)
  const productosCarrusel = {
    'prod-1': {
      id: 'prod-1',
      name: 'Bota Urbana Clásica',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/2.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Botas',
      brand: 'Mundo Calzado'
    },
    'prod-2': {
      id: 'prod-2',
      name: 'Zapato Casual Sport',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/3.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Zapatos',
      brand: 'Mundo Calzado'
    },
    'prod-3': {
      id: 'prod-3',
      name: 'Tenis Running Pro',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/4.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Tenis',
      brand: 'Mundo Calzado'
    },
    'prod-4': {
      id: 'prod-4',
      name: 'Sandalia Elegante',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/5.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Sandalias',
      brand: 'Mundo Calzado'
    },
    'prod-5': {
      id: 'prod-5',
      name: 'Mocasín Ejecutivo',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/6.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Mocasines',
      brand: 'Mundo Calzado'
    },
    'prod-6': {
      id: 'prod-6',
      name: 'Bota Montañera',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/7.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Botas',
      brand: 'Mundo Calzado'
    },
    'prod-7': {
      id: 'prod-7',
      name: 'Zapatilla Deportiva',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/8.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Zapatillas',
      brand: 'Mundo Calzado'
    },
    'prod-8': {
      id: 'prod-8',
      name: 'Oxford Formal',
      price: 129900,
      images: ['./mypageshoes/assets/img/carrusel2/9.jpeg'],
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
      category: 'Formal',
      brand: 'Mundo Calzado'
    }
  };

  /**
   * Inicializa los event listeners del carrusel
   */
  function inicializarCarrusel() {
    // Esperar a que el cartManager esté disponible
    if (!window.cartManager) {
      console.log('⏳ Esperando a que CartManager esté disponible...');
      setTimeout(inicializarCarrusel, 100);
      return;
    }

    console.log('✅ CartManager disponible, configurando eventos del carrusel');

    // Event delegation para botones de añadir al carrito del carrusel
    document.addEventListener('click', function(e) {
      const btnAddCart = e.target.closest('.btn-add-cart');
      
      // Solo procesar botones dentro del carrusel de novedades
      if (!btnAddCart) return;
      
      const carruselSection = btnAddCart.closest('.novedades-carousel-section');
      if (!carruselSection) return;

      e.preventDefault();
      e.stopPropagation();

      const productId = btnAddCart.dataset.productId;
      const productoCard = btnAddCart.closest('.producto-card');
      
      if (!productId || !productoCard) {
        console.error('❌ No se encontró el ID del producto o la tarjeta');
        return;
      }

      // Buscar la talla seleccionada
      const tallaSeleccionada = productoCard.querySelector('.talla-btn.selected');
      
      if (!tallaSeleccionada) {
        alert('Por favor selecciona una talla antes de añadir al carrito');
        return;
      }

      const size = tallaSeleccionada.dataset.size;
      const producto = productosCarrusel[productId];

      if (!producto) {
        console.error(`❌ Producto no encontrado: ${productId}`);
        return;
      }

      console.log(`🛒 Añadiendo producto al carrito: ${producto.name} - Talla ${size}`);

      // Agregar al carrito usando el CartManager
      const exito = window.cartManager.addProduct(producto, size, 1);

      if (exito) {
        // Feedback visual
        btnAddCart.classList.add('agregado');
        const textoOriginal = btnAddCart.innerHTML;
        btnAddCart.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        btnAddCart.style.backgroundColor = '#28a745';
        
        // Restaurar después de 2 segundos
        setTimeout(() => {
          btnAddCart.innerHTML = textoOriginal;
          btnAddCart.style.backgroundColor = '';
          btnAddCart.classList.remove('agregado');
        }, 2000);
      }
    });

    console.log('✅ Sistema de carrito del carrusel inicializado');
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCarrusel);
  } else {
    inicializarCarrusel();
  }
})();
