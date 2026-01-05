// carrito-simplificado.js
// Versión unificada y simplificada del sistema de carrito
// Esta versión combina las funcionalidades esenciales de carrito.js y carrito-tarjetas-fix-v2.js
// Fecha: 27/07/2025

// SECCIÓN 1: FUNCIONALIDAD BÁSICA DEL CARRITO
// Variables globales
let carrito = [];
let carritoInicializado = false;

// Función para inicializar el carrito
function inicializarCarrito() {
  if (carritoInicializado) return;
  
  console.log("==================================");
  console.log("INICIALIZANDO CARRITO DE COMPRAS");
  console.log("Versión: 3.0 - Fecha: 27/07/2025");
  console.log("==================================");
  
  // Cargar carrito desde localStorage
  cargarCarrito();
  
  // Actualizar contador del carrito
  actualizarCantidadCarrito();
  
  // Forzar el ocultamiento del mensaje de carrito vacío si hay productos
  forzarOcultarMensajeVacio();
  
  // Enlazar eventos para abrir/cerrar el carrito
  enlazarEventosCarrito();
  
  // Marcar como inicializado
  carritoInicializado = true;
  
  console.log("Carrito inicializado correctamente");
  console.log("==================================");
  
  // Iniciar la corrección de las tarjetas de productos después de un breve retraso
  setTimeout(aplicarCorreccionTarjetas, 500);
}

// Función para forzar el ocultamiento del mensaje de carrito vacío
function forzarOcultarMensajeVacio() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Si hay productos en el carrito, ocultar el mensaje de "carrito vacío"
  if (carrito.length > 0) {
    const carritoVacio = document.getElementById('carrito-vacio');
    if (carritoVacio) {
      console.log("[CARRITO] Forzando ocultamiento del mensaje de carrito vacío");
      carritoVacio.classList.add('oculto');
      carritoVacio.style.display = 'none';
      carritoVacio.style.visibility = 'hidden';
      carritoVacio.style.height = '0';
      carritoVacio.style.overflow = 'hidden';
    }
  }
}

// Función global para agregar un producto una sola vez
window.agregarProductoUnaVez = function(producto) {
  console.log("[CARRITO] Agregando producto una vez:", producto);
  
  // Capturar la página de origen del producto
  if (!producto.origen) {
    const paginaActual = window.location.pathname.toLowerCase();
    producto.origen = paginaActual;
    console.log(`[CARRITO] Origen del producto registrado: ${producto.origen}`);
  }
  
  // Verificar si el producto ya existe en el carrito por su ID
  const indiceExistente = carrito.findIndex(item => 
    item.id === producto.id
  );
  
  if (indiceExistente !== -1) {
    // El producto ya existe, incrementar cantidad
    carrito[indiceExistente].cantidad += 1;
    console.log(`[CARRITO] Producto existente, cantidad actualizada: ${carrito[indiceExistente].cantidad}`);
  } else {
    // Es un producto nuevo, añadirlo al carrito
    carrito.push(producto);
    console.log("[CARRITO] Nuevo producto agregado al carrito");
  }
  
  // Guardar en localStorage
  guardarCarrito();
  
  // Actualizar contador del carrito
  actualizarCantidadCarrito();
  
  return true;
};

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
  
  // Calcular la cantidad total sumando las cantidades de todos los productos
  const cantidadTotal = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
  
  // Actualizar el texto del contador
  contadorElement.textContent = cantidadTotal.toString();
  console.log(`Contador de carrito actualizado: ${cantidadTotal} productos`);
  
  // Actualizar la visualización del carrito (mostrar/ocultar elementos)
  actualizarVisualizacionCarrito();
}

// Actualizar la visualización del carrito (elementos vacío/con productos)
function actualizarVisualizacionCarrito() {
  const carritoLista = document.getElementById('carrito-lista');
  const carritoVacio = document.getElementById('carrito-vacio');
  const carritoTotal = document.getElementById('carrito-total');
  
  if (!carritoLista || !carritoVacio || !carritoTotal) {
    console.error("Elementos de visualización del carrito no encontrados");
    return;
  }
  
  // Eliminar mensajes de envío gratis anteriores
  const infoEnvioExistente = document.querySelectorAll('.carrito-info-envio');
  infoEnvioExistente.forEach(info => info.remove());
  
  // Forzar ocultamiento del mensaje de carrito vacío si hay productos
  if (carrito.length === 0) {
    // Carrito vacío
    carritoLista.innerHTML = '';
    carritoVacio.classList.remove('oculto');
    carritoVacio.style.display = 'flex'; // Asegurar que sea visible
    carritoTotal.classList.add('oculto');
    console.log("[CARRITO] Mostrando mensaje de carrito vacío");
  } else {
    // Carrito con productos
    carritoVacio.classList.add('oculto'); // Asegurar que se oculte siempre
    carritoVacio.style.display = 'none'; // Forzar ocultamiento con estilo directo
    carritoVacio.style.visibility = 'hidden'; // Asegurar ocultamiento completo
    carritoVacio.style.height = '0'; // Eliminar espacio
    carritoVacio.style.overflow = 'hidden'; // Prevenir que contenido se muestre
    carritoTotal.classList.remove('oculto');
    console.log("[CARRITO] Ocultando mensaje de carrito vacío, hay " + carrito.length + " productos");
    
    // Generar el HTML para los items del carrito
    let html = '';
    let total = 0;
    let cantidadTotalPares = 0;
    let totalAccesoriosOfertas = 0;
    
    // Clasificar productos por tipo
    const productosRegulares = [];
    const productosAccesoriosOfertas = [];
    
    // Procesar productos del carrito
    carrito.forEach((item, index) => {
      const subtotal = item.precio * (item.cantidad || 1);
      total += subtotal;
      cantidadTotalPares += (item.cantidad || 1);
      
      // Verificar si el producto es de accesorios u ofertas (por URL o por nombre)
      const esAccesorioOferta = (item.origen && (item.origen.includes('accesorios.html') || item.origen.includes('ofertas.html'))) || 
                               (item.nombre && (item.nombre.toLowerCase().includes('accesorio') || item.nombre.toLowerCase().includes('oferta')));
      
      if (esAccesorioOferta) {
        totalAccesoriosOfertas += subtotal;
        productosAccesoriosOfertas.push(item);
      } else {
        productosRegulares.push(item);
      }
      
      html += `
        <div class="carrito-item" data-id="${item.id}">
          <div class="carrito-item-imagen">
            ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}">` : '<div class="carrito-item-imagen-placeholder"></div>'}
          </div>
          <div class="carrito-item-detalles">
            <div class="carrito-item-marca">${item.marca || ''}</div>
            <div class="carrito-item-nombre">${item.nombre}</div>
            <div class="carrito-item-color">Color: ${item.color || 'N/A'}</div>
            <div class="carrito-item-talla">Talla: ${item.talla}</div>
            <div class="carrito-item-precio">$${formatearPrecio(item.precio)}</div>
          </div>
          <div class="carrito-item-acciones">
            <button class="btn-eliminar-item" data-index="${index}">
              <i class="fa-regular fa-trash-can"></i>
            </button>
            <div class="carrito-item-cantidad">
              <select class="cantidad-selector" data-index="${index}">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => 
                  `<option value="${num}" ${(item.cantidad || 1) === num ? 'selected' : ''}>${num}</option>`
                ).join('')}
              </select>
            </div>
            <div class="carrito-item-subtotal">
              $${formatearPrecio(subtotal)}
            </div>
          </div>
        </div>
      `;
    });
    
    carritoLista.innerHTML = html;
    document.getElementById('carrito-total-precio').textContent = formatearPrecio(total);
    
    // Nueva lógica de envío gratis
    const cantidadMinimaPares = 2; // Cantidad mínima para envío gratis
    const montoMinimoAccesoriosOfertas = 75000; // Monto mínimo para complemento
    const montoTotalParaEnvioGratis = 150000; // Monto para envío gratis directo
    
    // Calcular si hay envío gratis
    let tieneEnvioGratis = false;
    let mensajeEnvio = '';
    
    // Caso 1: Tiene 2 o más pares de zapatos regulares
    if (productosRegulares.length >= cantidadMinimaPares) {
      tieneEnvioGratis = true;
      mensajeEnvio = `<i class="fa-solid fa-truck"></i> ¡Tienes <strong>envío gratis</strong> por comprar ${productosRegulares.length} pares!`;
    }
    // Caso 2: Productos de accesorios/ofertas suman más de $150,000
    else if (totalAccesoriosOfertas >= montoTotalParaEnvioGratis) {
      tieneEnvioGratis = true;
      mensajeEnvio = `<i class="fa-solid fa-truck"></i> ¡Tienes <strong>envío gratis</strong> por compra superior a $150.000!`;
    }
    // Caso 3: Productos de accesorios/ofertas suman más de $75,000 y complementan otros productos
    else if (productosRegulares.length > 0 && totalAccesoriosOfertas >= montoMinimoAccesoriosOfertas) {
      tieneEnvioGratis = true;
      mensajeEnvio = `<i class="fa-solid fa-truck"></i> ¡Tienes <strong>envío gratis</strong> con tu complemento de accesorios!`;
    }
    // Caso 4: El total de la compra es mayor a $150,000
    else if (total >= montoTotalParaEnvioGratis) {
      tieneEnvioGratis = true;
      mensajeEnvio = `<i class="fa-solid fa-truck"></i> ¡Tienes <strong>envío gratis</strong> por compra superior a $150.000!`;
    }
    
    if (tieneEnvioGratis) {
      // Ya tiene envío gratis
      const infoEnvio = document.createElement('div');
      infoEnvio.className = 'carrito-info-envio envio-gratis';
      infoEnvio.innerHTML = mensajeEnvio;
      carritoTotal.insertBefore(infoEnvio, document.getElementById('btn-finalizar-compra'));
    } else {
      // Calcular lo que falta para envío gratis
      if (productosRegulares.length > 0) {
        // Si ya tiene productos regulares, falta uno más para el envío gratis
        const faltantePares = cantidadMinimaPares - productosRegulares.length;
        if (faltantePares > 0) {
          const infoEnvio = document.createElement('div');
          infoEnvio.className = 'carrito-info-envio';
          infoEnvio.innerHTML = `¡Te ${faltantePares === 1 ? 'falta <strong>1 par más</strong>' : `faltan <strong>${faltantePares} pares más</strong>`} para envío gratis!`;
          carritoTotal.insertBefore(infoEnvio, document.getElementById('btn-finalizar-compra'));
        }
      } else if (totalAccesoriosOfertas > 0) {
        // Si solo tiene accesorios/ofertas, mostrar cuánto falta para llegar a $150,000
        const faltanteMonto = montoTotalParaEnvioGratis - totalAccesoriosOfertas;
        if (faltanteMonto > 0) {
          const infoEnvio = document.createElement('div');
          infoEnvio.className = 'carrito-info-envio';
          infoEnvio.innerHTML = `¡Te faltan <strong>$${formatearPrecio(faltanteMonto)}</strong> para envío gratis!`;
          carritoTotal.insertBefore(infoEnvio, document.getElementById('btn-finalizar-compra'));
        }
      } else {
        // No hay productos, mostrar mensaje genérico
        const infoEnvio = document.createElement('div');
        infoEnvio.className = 'carrito-info-envio';
        infoEnvio.innerHTML = `¡Compra 2 pares para obtener <strong>envío gratis</strong>!`;
        carritoTotal.insertBefore(infoEnvio, document.getElementById('btn-finalizar-compra'));
      }
    }
    
    // Enlazar eventos para los botones de cantidad y eliminar
    enlazarEventosItemsCarrito();
  }
}

// Formatear precio para mostrar con separador de miles
function formatearPrecio(precio) {
  return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Enlazar eventos para los botones del carrito
function enlazarEventosCarrito() {
  // Botón para abrir el carrito
  const btnCarrito = document.getElementById('btn-carrito');
  if (btnCarrito) {
    btnCarrito.addEventListener('click', function() {
      const modalCarrito = document.getElementById('modal-carrito');
      if (modalCarrito) {
        modalCarrito.classList.remove('oculto');
        
        // Forzar la corrección del estado del carrito para evitar problemas
        const carritoVacio = document.getElementById('carrito-vacio');
        if (carritoVacio && carrito.length > 0) {
          carritoVacio.classList.add('oculto');
          carritoVacio.style.display = 'none';
          carritoVacio.style.visibility = 'hidden';
          carritoVacio.style.height = '0';
          carritoVacio.style.overflow = 'hidden';
          console.log("[CARRITO] Forzando ocultamiento de mensaje vacío");
        }
        
        actualizarVisualizacionCarrito(); // Asegurar que esté actualizado
      }
    });
  }
  
  // Botón para cerrar el carrito
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', function() {
      const modalCarrito = document.getElementById('modal-carrito');
      if (modalCarrito) {
        modalCarrito.classList.add('oculto');
      }
    });
  }
  
  // Botón para finalizar compra
  const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
  if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener('click', function() {
      alert('¡Gracias por tu compra! En breve recibirás los detalles.');
      // Aquí iría la lógica para procesar la compra
    });
  }
  
  // Botón para seguir comprando
  const btnElegirProductos = document.getElementById('btn-elegir-productos');
  if (btnElegirProductos) {
    btnElegirProductos.addEventListener('click', function() {
      const modalCarrito = document.getElementById('modal-carrito');
      if (modalCarrito) {
        modalCarrito.classList.add('oculto');
      }
    });
  }
}

// Enlazar eventos para los ítems del carrito
function enlazarEventosItemsCarrito() {
  // Selectores de cantidad
  document.querySelectorAll('.cantidad-selector').forEach(selector => {
    selector.addEventListener('change', function() {
      const index = parseInt(this.getAttribute('data-index'));
      const nuevaCantidad = parseInt(this.value);
      
      if (nuevaCantidad > 0) {
        carrito[index].cantidad = nuevaCantidad;
        guardarCarrito();
        actualizarCantidadCarrito();
      }
    });
  });
  
  // Botones para eliminar ítem
  document.querySelectorAll('.btn-eliminar-item').forEach(boton => {
    boton.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      carrito.splice(index, 1);
      guardarCarrito();
      actualizarCantidadCarrito();
    });
  });
}

// SECCIÓN 2: CORRECCIÓN DE TARJETAS DE PRODUCTOS
// Función global para corregir las tarjetas de productos
window.aplicarCorreccionTarjetas = function() {
  console.log("[TARJETAS FIX] Iniciando corrección universal para tarjetas de productos");
  
  // 1. Buscar todas las tarjetas de productos en la página
  const tarjetas = document.querySelectorAll('.producto-card, .card-producto, .novedades-slide .producto-card');
  console.log(`[TARJETAS FIX] Se encontraron ${tarjetas.length} tarjetas para corregir`);
  
  if (tarjetas.length === 0) {
    console.log("[TARJETAS FIX] No se encontraron tarjetas en esta página");
    return;
  }
  
  // 2. Reemplazar los botones de agregar al carrito
  tarjetas.forEach((tarjeta, index) => {
    const botonOriginal = tarjeta.querySelector('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
    
    if (!botonOriginal) {
      console.log(`[TARJETAS FIX] Tarjeta #${index} no tiene botón de agregar al carrito`);
      return;
    }
    
    // Verificar si el botón ya fue procesado para evitar procesarlo múltiples veces
    if (botonOriginal.hasAttribute('data-card-id')) {
      console.log(`[TARJETAS FIX] El botón de la tarjeta #${index} ya fue procesado anteriormente`);
      return;
    }

    // Crear un nuevo botón con el mismo aspecto pero un ID único
    const nuevoBoton = document.createElement('button');
    nuevoBoton.className = botonOriginal.className;
    nuevoBoton.innerHTML = botonOriginal.innerHTML;
    nuevoBoton.setAttribute('data-card-id', `card-${index}-${Date.now()}`);
    
    // Copiar todos los atributos del botón original
    Array.from(botonOriginal.attributes).forEach(attr => {
      if (attr.name !== 'class' && attr.name !== 'id') {
        nuevoBoton.setAttribute(attr.name, attr.value);
      }
    });
    
    // Reemplazar el botón original con nuestro nuevo botón
    botonOriginal.parentNode.replaceChild(nuevoBoton, botonOriginal);
    
    // Añadir un nuevo evento de click sin conflictos
    nuevoBoton.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Verificar si el botón ya fue procesado
      if (this.getAttribute('data-procesado') === 'true' || this.getAttribute('data-procesando') === 'true') {
        console.log(`[TARJETAS FIX] Botón ya procesado o en proceso, evitando duplicación`);
        return;
      }
      
      // Marcar como procesado para evitar duplicación
      this.setAttribute('data-procesado', 'true');
      
      // Obtener información del producto
      const nombreElement = tarjeta.querySelector('.producto-nombre, h3');
      const precioElement = tarjeta.querySelector('.producto-precio, p.producto-precio');
      // Buscar en varios lugares posibles donde se pueda almacenar la talla seleccionada
      let tallaSeleccionada = tarjeta.querySelector('.talla-btn.seleccionada, .talla-btn.selected, .talla-seleccionada, .carrusel-talla-btn.seleccionada, .carrusel-talla-btn.selected');
      
      // Para productos del carrusel, buscar en atributos de datos
      if (!tallaSeleccionada && tarjeta.hasAttribute('data-talla-seleccionada')) {
        // Crear un elemento temporal para simular la selección de talla
        tallaSeleccionada = document.createElement('span');
        tallaSeleccionada.textContent = tarjeta.getAttribute('data-talla-seleccionada');
        tallaSeleccionada.className = 'talla-seleccionada';
      }
      
      // Para productos del carrusel de novedades, verificar si hay una variable global
      if (!tallaSeleccionada && typeof window.tallaSeleccionadaCarrusel !== 'undefined' && 
          window.productoCarruselSeleccionado && 
          tarjeta.contains(window.productoCarruselSeleccionado)) {
        tallaSeleccionada = document.createElement('span');
        tallaSeleccionada.textContent = window.tallaSeleccionadaCarrusel;
        tallaSeleccionada.className = 'talla-seleccionada';
      }
      
      const imagenElement = tarjeta.querySelector('img');
      
      // Detectar si es un accesorio (por URL o por categoría en el nombre)
      const paginaActual = window.location.pathname.toLowerCase();
      const esAccesorio = paginaActual.includes('accesorios.html') || 
                         (nombreElement && nombreElement.textContent.toLowerCase().includes('accesorio'));
      
      // Verificar si hay selección de talla disponible en la tarjeta
      const tieneTallas = tarjeta.querySelector('.talla-btn, .producto-tallas, .tallas-container, .tallas-list') !== null;
      
      // Verificar que tengamos la información necesaria
      if (!nombreElement || !precioElement) {
        alert('No se pudo agregar el producto al carrito. Falta información básica.');
        this.setAttribute('data-procesado', 'false');
        return;
      }
      
      // Solo verificar talla si no es accesorio y tiene opciones de talla
      if (!esAccesorio && tieneTallas && !tallaSeleccionada) {
        alert('Por favor selecciona una talla antes de añadir al carrito.');
        this.setAttribute('data-procesado', 'false');
        return;
      }
      
      // Extraer datos del producto
      const nombre = nombreElement.textContent.trim();
      const precioTexto = precioElement.textContent.replace('$', '').replace(/\./g, '').replace(/,/g, '').trim();
      const precio = parseInt(precioTexto, 10);
      const talla = tallaSeleccionada ? tallaSeleccionada.textContent.trim() : (esAccesorio ? 'N/A' : 'Única');
      const imagen = imagenElement ? imagenElement.src : null;
      
      // Crear objeto del producto
      const producto = {
        id: `${nombre}-${talla}`,
        nombre: nombre,
        precio: precio,
        talla: talla,
        cantidad: 1,
        imagen: imagen
      };
      
      console.log(`[TARJETAS FIX] Agregando producto: ${nombre}, talla: ${talla}, precio: ${precio}`);
      
      // Agregar al carrito usando nuestra función global
      window.agregarProductoUnaVez(producto);
      
      // Forzar ocultamiento del mensaje de carrito vacío
      forzarOcultarMensajeVacio();
      
      mostrarNotificacion(tarjeta);
      
      // Resetear estado después de un tiempo
      setTimeout(() => {
        this.setAttribute('data-procesado', 'false');
      }, 1000);
    });
  });
  
  console.log("[TARJETAS FIX] Corrección universal aplicada con éxito");
  
  // También corregir eventos de selección de tallas (si están rotos)
  corregirSeleccionTallas();
};

// Función para corregir la selección de tallas
function corregirSeleccionTallas() {
  console.log("[TARJETAS FIX] Verificando selección de tallas");
  
  const botonesTallas = document.querySelectorAll('.talla-btn');
  
  if (botonesTallas.length === 0) {
    console.log("[TARJETAS FIX] No se encontraron botones de tallas en esta página");
    return;
  }
  
  console.log(`[TARJETAS FIX] Corrigiendo ${botonesTallas.length} botones de tallas`);
  
  botonesTallas.forEach(boton => {
    // Eliminar eventos existentes
    const nuevoBoton = boton.cloneNode(true);
    boton.parentNode.replaceChild(nuevoBoton, boton);
    
    // Añadir nuevo evento
    nuevoBoton.addEventListener('click', function() {
      // Buscar otros botones de talla en el mismo contenedor y quitar selección
      const contenedor = this.closest('.producto-tallas, .tallas-container, .tallas-list');
      if (contenedor) {
        contenedor.querySelectorAll('.talla-btn').forEach(btn => {
          btn.classList.remove('seleccionada');
        });
      }
      
      // Marcar este botón como seleccionado
      this.classList.add('seleccionada');
    });
  });
  
  console.log("[TARJETAS FIX] Corrección de selección de tallas completada");
}

// Función para mostrar notificación
function mostrarNotificacion(elemento) {
  console.log("[TARJETAS FIX] Mostrando notificación");
  
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
  
  // Buscar contenedor
  const contenedor = elemento.closest('.producto-card, .card-producto');
  
  if (contenedor) {
    // Asegurar posición relativa
    if (getComputedStyle(contenedor).position === 'static') {
      contenedor.style.position = 'relative';
    }
    
    // Añadir notificación al contenedor
    contenedor.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
      notificacion.style.opacity = '1';
    }, 10);
    
    // Ocultar después de un tiempo
    setTimeout(() => {
      notificacion.style.opacity = '0';
      setTimeout(() => {
        if (notificacion.parentNode) {
          notificacion.parentNode.removeChild(notificacion);
        }
      }, 300);
    }, 2000);
  }
}

// Inicializar el carrito cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarCarrito);

// Hacer globalmente disponible la función actualizarCantidadCarrito
window.actualizarCantidadCarrito = actualizarCantidadCarrito;
