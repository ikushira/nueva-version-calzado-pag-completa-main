// carrito.js - Versión completamente reescrita para solucionar problemas persistentes
// Esta versión contiene lógica mejorada y mejor manejo de errores

// Variables globales
let carrito = [];
let carritoInicializado = false;

// Función para inicializar el carrito
function inicializarCarrito() {
  if (carritoInicializado) return;
  
  console.log("==================================");
  console.log("INICIALIZANDO CARRITO DE COMPRAS");
  console.log("Versión: 2.0 - Fecha: 27/07/2025");
  console.log("==================================");
  
  // Cargar carrito desde localStorage
  cargarCarrito();
  
  // Actualizar contador del carrito
  actualizarCantidadCarrito();
  
  // Enlazar eventos para abrir/cerrar el carrito
  enlazarEventosCarrito();
  
  // Enlazar botones de agregar al carrito
  enlazarBotonesAgregarAlCarrito();
  
  // Marcar como inicializado
  carritoInicializado = true;
  
  console.log("Carrito inicializado correctamente");
  console.log("==================================");
}

// Cargar carrito desde localStorage
function cargarCarrito() {
  try {
    console.log("Cargando carrito desde localStorage");
    const carritoGuardado = localStorage.getItem('carrito');
    
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      console.log(`Carrito cargado: ${carrito.length} productos encontrados`);
    } else {
      carrito = [];
      console.log("No se encontró carrito guardado, se creó uno nuevo");
    }
  } catch (error) {
    console.error("Error al cargar carrito:", error);
    carrito = [];
  }
}

// Guardar carrito en localStorage
function guardarCarrito() {
  try {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log("Carrito guardado en localStorage");
  } catch (error) {
    console.error("Error al guardar carrito:", error);
  }
}

// Actualizar el contador de productos en el carrito
function actualizarCantidadCarrito() {
  const contadorElement = document.getElementById('carrito-cantidad');
  
  if (!contadorElement) {
    console.error("Elemento 'carrito-cantidad' no encontrado");
    return;
  }
  
  // Calcular cantidad total sumando las cantidades de cada producto
  const cantidadTotal = carrito.reduce((total, producto) => {
    return total + (typeof producto.cantidad === 'number' ? producto.cantidad : 1);
  }, 0);
  
  contadorElement.textContent = cantidadTotal.toString();
  console.log(`Contador de carrito actualizado: ${cantidadTotal} productos`);
}

// Enlazar eventos para abrir/cerrar el carrito
function enlazarEventosCarrito() {
  // Botón para abrir el carrito
  const btnCarrito = document.getElementById('btn-carrito');
  const modalCarrito = document.getElementById('modal-carrito');
  
  if (btnCarrito && modalCarrito) {
    btnCarrito.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Botón carrito clickeado - Abriendo modal");
      modalCarrito.classList.remove('oculto');
      renderizarProductosCarrito();
    });
  } else {
    console.error("No se encontraron elementos necesarios para el carrito", 
                 { btnCarrito: !!btnCarrito, modalCarrito: !!modalCarrito });
  }
  
  // Botón para cerrar el carrito
  const btnCerrarCarrito = document.getElementById('cerrar-carrito');
  
  if (btnCerrarCarrito && modalCarrito) {
    btnCerrarCarrito.addEventListener('click', function() {
      console.log("Cerrando modal del carrito");
      modalCarrito.classList.add('oculto');
    });
  }
  
  // Botón para elegir productos (cuando el carrito está vacío)
  const btnElegirProductos = document.getElementById('btn-elegir-productos');
  
  if (btnElegirProductos && modalCarrito) {
    btnElegirProductos.addEventListener('click', function() {
      console.log("Botón elegir productos clickeado");
      modalCarrito.classList.add('oculto');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Botón para finalizar compra
  const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
  
  if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener('click', function() {
      console.log("Finalizando compra - Redirigiendo a checkout");
      
      // Verificar que hay productos en el carrito
      if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de continuar.');
        return;
      }
      
      // Cerrar el modal del carrito
      if (modalCarrito) {
        modalCarrito.classList.add('oculto');
      }
      
      // Redirigir al checkout
      window.location.href = 'checkout.html';
    });
  }
  
  // Eventos para eliminar productos del carrito
  const carritoLista = document.getElementById('carrito-lista');
  
  if (carritoLista) {
    carritoLista.addEventListener('click', function(e) {
      if (e.target.classList.contains('eliminar-item')) {
        const indice = parseInt(e.target.getAttribute('data-idx'), 10);
        
        if (!isNaN(indice) && indice >= 0 && indice < carrito.length) {
          console.log(`Eliminando producto en índice ${indice}`);
          
          // Eliminar producto
          carrito.splice(indice, 1);
          
          // Actualizar carrito
          guardarCarrito();
          renderizarProductosCarrito();
        }
      }
    });
  }
}

// Renderizar productos en el carrito
function renderizarProductosCarrito() {
  console.log("Renderizando productos del carrito");
  
  const carritoLista = document.getElementById('carrito-lista');
  const carritoVacio = document.getElementById('carrito-vacio');
  const carritoTotal = document.getElementById('carrito-total');
  const carritoTotalPrecio = document.getElementById('carrito-total-precio');
  
  if (!carritoLista || !carritoVacio || !carritoTotal || !carritoTotalPrecio) {
    console.error("No se encontraron elementos necesarios para renderizar carrito");
    return;
  }
  
  if (carrito.length === 0) {
    // Mostrar mensaje de carrito vacío
    carritoLista.innerHTML = '';
    carritoVacio.style.display = 'block';
    carritoTotal.classList.add('oculto');
    carritoTotalPrecio.textContent = '0';
  } else {
    // Mostrar productos en el carrito
    carritoVacio.style.display = 'none';
    
    // Generar HTML para cada producto
    carritoLista.innerHTML = carrito.map((producto, idx) => `
      <div class="carrito-item">
        <span>${producto.nombre} ${producto.talla ? 'Talla ' + producto.talla : ''}</span>
        <span>x${producto.cantidad || 1}</span>
        <span>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CO')}</span>
        <button class="eliminar-item" data-idx="${idx}">&times;</button>
      </div>
    `).join('');
    
    // Mostrar total
    carritoTotal.classList.remove('oculto');
    
    // Calcular total
    const total = carrito.reduce((suma, producto) => {
      return suma + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);
    
    carritoTotalPrecio.textContent = total.toLocaleString('es-CO');
  }
  
  // Actualizar contador
  actualizarCantidadCarrito();
}

// Función para agregar producto al carrito
function agregarAlCarrito(producto) {
  console.log("Agregando producto al carrito:", producto);
  
  if (!producto) {
    console.error("Se intentó agregar un producto nulo o indefinido");
    return;
  }
  
  // Normalizar producto para evitar problemas
  const productoNormalizado = {
    id: producto.id || 'producto-' + new Date().getTime(),
    nombre: producto.nombre || 'Producto sin nombre',
    precio: parseInt(producto.precio, 10) || 0,
    talla: producto.talla || '',
    cantidad: 1
  };
  
  // Buscar si ya existe el producto (por nombre y talla)
  const indiceExistente = carrito.findIndex(p => 
    p.nombre === productoNormalizado.nombre && 
    p.talla === productoNormalizado.talla
  );
  
  if (indiceExistente >= 0) {
    // Actualizar cantidad si ya existe
    console.log(`El producto ya existe en el carrito, incrementando cantidad (índice: ${indiceExistente})`);
    carrito[indiceExistente].cantidad = (carrito[indiceExistente].cantidad || 1) + 1;
  } else {
    // Agregar nuevo producto
    console.log("Agregando nuevo producto al carrito");
    carrito.push(productoNormalizado);
  }
  
  // Guardar y actualizar
  guardarCarrito();
  actualizarCantidadCarrito();
  
  console.log("Producto agregado correctamente");
  return true;
}

// Función para obtener datos de un producto desde un botón
function obtenerDatosProducto(boton) {
  console.log("Obteniendo datos de producto desde botón:", boton);
  
  // Buscar contenedor del producto
  const contenedor = boton.closest('.producto-card, .card-producto, .product-card, .carrusel-item, .carousel-slide');
  
  if (!contenedor) {
    console.error("No se encontró contenedor de producto para el botón");
    return null;
  }
  
  // Extraer nombre del producto
  let nombre = "";
  const elementoNombre = contenedor.querySelector('h3, h4, h5, .producto-nombre, .nombre-producto');
  
  if (elementoNombre) {
    nombre = elementoNombre.textContent.trim();
  } else {
    console.warn("No se encontró elemento para el nombre del producto");
    nombre = "Producto";
  }
  
  // Extraer precio
  let precio = 0;
  const elementoPrecio = contenedor.querySelector('.producto-precio, .precio-producto');
  
  if (elementoPrecio) {
    // Extraer solo números del texto del precio
    const precioTexto = elementoPrecio.textContent.replace(/[^\d]/g, '');
    precio = parseInt(precioTexto, 10) || 0;
  } else {
    console.warn("No se encontró elemento para el precio del producto");
  }
  
  // Extraer talla seleccionada
  let talla = "";
  const botonTallaSeleccionado = contenedor.querySelector('.talla-btn.selected, .talla-btn.active');
  
  if (botonTallaSeleccionado) {
    talla = botonTallaSeleccionado.textContent.trim();
  }
  
  const datosProducto = { nombre, precio, talla };
  console.log("Datos de producto obtenidos:", datosProducto);
  
  return datosProducto;
}

// Mostrar notificación de producto agregado
function mostrarNotificacionProductoAgregado(elemento) {
  console.log("Mostrando notificación de producto agregado");
  
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = 'producto-agregado-notificacion';
  notificacion.innerHTML = `
    <i class="fa-solid fa-check"></i>
    <span>¡Producto agregado!</span>
  `;
  
  // Aplicar estilos
  Object.assign(notificacion.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: '1000',
    opacity: '0',
    transition: 'opacity 0.3s ease-in-out',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  });
  
  // Buscar contenedor donde mostrar la notificación
  const contenedor = elemento.closest('.producto-card, .card-producto, .product-card, .carrusel-item, .carousel-slide');
  
  if (contenedor) {
    // Asegurar que el contenedor tenga posición relativa
    if (getComputedStyle(contenedor).position === 'static') {
      contenedor.style.position = 'relative';
    }
    
    // Agregar notificación al contenedor
    contenedor.appendChild(notificacion);
  } else {
    // Si no hay contenedor, agregar relativo al elemento
    elemento.style.position = 'relative';
    elemento.appendChild(notificacion);
  }
  
  // Animar aparición
  setTimeout(() => {
    notificacion.style.opacity = '1';
  }, 10);
  
  // Remover después de un tiempo
  setTimeout(() => {
    notificacion.style.opacity = '0';
    
    setTimeout(() => {
      notificacion.remove();
    }, 300);
  }, 1500);
}

// Enlazar botones de agregar al carrito
function enlazarBotonesAgregarAlCarrito() {
  console.log("Enlazando botones de agregar al carrito");
  
  // Seleccionar todos los botones posibles
  const selectoresBotones = [
    '.btn-agregar-carrito',
    '.btn-add-cart',
    '.btn-anadir-carrito',
    '.btn-añadir-carrito',
    '.agregar-carrito',
    '.add-to-cart',
    '.btn-cart'
  ];
  
  const botones = document.querySelectorAll(selectoresBotones.join(', '));
  console.log(`Se encontraron ${botones.length} botones`);
  
  botones.forEach((boton, index) => {
    // Evitar duplicar event listeners
    if (boton.dataset.carritoEnlazado === 'true') {
      return;
    }
    
    console.log(`Enlazando botón #${index + 1}`);
    
    // Remover listeners anteriores (clonar y reemplazar)
    const nuevoBoton = boton.cloneNode(true);
    boton.parentNode.replaceChild(nuevoBoton, boton);
    
    // Agregar nuevo listener
    nuevoBoton.addEventListener('click', function(event) {
      event.preventDefault();
      console.log(`Botón #${index + 1} clickeado`);
      
      // Obtener datos del producto
      const datosProducto = obtenerDatosProducto(nuevoBoton);
      
      if (!datosProducto) {
        console.error("No se pudieron obtener datos del producto");
        return;
      }
      
      // Verificar talla seleccionada
      if (!datosProducto.talla) {
        alert('Por favor selecciona una talla antes de añadir al carrito.');
        console.warn("No se agregó producto: falta seleccionar talla");
        return;
      }
      
      // Crear objeto de producto para agregar
      const producto = {
        id: `${datosProducto.nombre}-${datosProducto.talla}`,
        nombre: datosProducto.nombre,
        precio: datosProducto.precio,
        talla: datosProducto.talla,
        cantidad: 1
      };
      
      // Agregar al carrito
      if (agregarAlCarrito(producto)) {
        mostrarNotificacionProductoAgregado(nuevoBoton);
      }
    });
    
    // Marcar como enlazado para evitar duplicación
    nuevoBoton.dataset.carritoEnlazado = 'true';
  });
  
  // Programar próxima comprobación para nuevos botones
  setTimeout(enlazarBotonesAgregarAlCarrito, 3000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarCarrito);

// Exponer funciones globalmente para acceso desde otros archivos
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCantidadCarrito = actualizarCantidadCarrito;
window.renderizarProductosCarrito = renderizarProductosCarrito;
