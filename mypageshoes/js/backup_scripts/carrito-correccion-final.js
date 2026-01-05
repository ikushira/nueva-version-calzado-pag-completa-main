// carrito-correccion-final.js
// Versión final para corregir los problemas persistentes del carrito
// 1. Evitar agregar productos duplicados
// 2. Asegurar que la imagen del producto se guarde correctamente

document.addEventListener('DOMContentLoaded', function() {
    console.log("=========================================");
    console.log("CORRECCIÓN FINAL DEL CARRITO");
    console.log("Versión: 4.0 - Fecha: 27/07/2025");
    console.log("=========================================");
    
    // Variables de control
    let procesoCompletado = false;
    
    // Función principal para aplicar las correcciones
    function aplicarCorreccionesFinales() {
        if (procesoCompletado) return;
        
        console.log("[CORRECCIÓN FINAL] Iniciando aplicación de correcciones");
        
        // 1. Corregir la función de agregar productos en carrito-fix-radical-v2.js
        corregirFuncionAgregarProducto();
        
        // 2. Corregir la visualización de productos en el carrito
        corregirVisualizacionCarrito();
        
        // Marcar como completado
        procesoCompletado = true;
        console.log("[CORRECCIÓN FINAL] Proceso completado");
    }
    
    // Corregir la función de agregar productos
    function corregirFuncionAgregarProducto() {
        console.log("[CORRECCIÓN FINAL] Corrigiendo función de agregar productos");
        
        // Verificar si existe la función original
        if (typeof window.agregarProductoUnaVez !== 'function') {
            console.error("[CORRECCIÓN FINAL] No se encontró la función agregarProductoUnaVez");
            return;
        }
        
        // Guardar referencia a la función original
        const agregarProductoOriginal = window.agregarProductoUnaVez;
        
        // Reemplazar con nuestra versión corregida
        window.agregarProductoUnaVez = function(producto) {
            console.log("[CORRECCIÓN FINAL] Interceptando agregarProductoUnaVez");
            
            if (!window.carrito) {
                console.error("[CORRECCIÓN FINAL] Variable carrito no encontrada");
                return false;
            }
            
            // CORRECCIÓN 1: Verificar si ya existe en el carrito usando ID único
            const indiceExistente = window.carrito.findIndex(item => 
                item.id === producto.id
            );
            
            // CORRECCIÓN 2: Asegurar que el producto tenga imagen
            if (!producto.imagen) {
                console.log("[CORRECCIÓN FINAL] Agregando imagen al producto");
                
                // Intentar obtener imagen de varias formas
                producto.imagen = obtenerImagenProducto(producto.nombre);
            }
            
            console.log("[CORRECCIÓN FINAL] Producto procesado:", producto);
            
            if (indiceExistente !== -1) {
                // El producto ya existe, incrementar cantidad
                console.log("[CORRECCIÓN FINAL] Producto ya existe, incrementando cantidad");
                window.carrito[indiceExistente].cantidad += 1;
            } else {
                // Agregar nuevo producto
                console.log("[CORRECCIÓN FINAL] Agregando nuevo producto");
                window.carrito.push(producto);
            }
            
            // Guardar carrito en localStorage
            try {
                localStorage.setItem('carrito', JSON.stringify(window.carrito));
                console.log("[CORRECCIÓN FINAL] Carrito guardado en localStorage");
                
                // Actualizar contador
                actualizarContadorCarrito();
                
                return true;
            } catch (error) {
                console.error("[CORRECCIÓN FINAL] Error al guardar carrito:", error);
                return false;
            }
        };
        
        console.log("[CORRECCIÓN FINAL] Función de agregar productos corregida");
    }
    
    // Función para obtener la imagen del producto
    function obtenerImagenProducto(nombre) {
        console.log("[CORRECCIÓN FINAL] Buscando imagen para:", nombre);
        
        // Intentar obtener la imagen desde la tarjeta del producto
        const tarjetas = document.querySelectorAll('.producto-card, .card-producto');
        for (const tarjeta of tarjetas) {
            const nombreProducto = tarjeta.querySelector('.producto-nombre, .card-title')?.textContent.trim();
            
            if (nombreProducto === nombre) {
                const imagenElement = tarjeta.querySelector('.producto-imagen img, .card-img-top');
                if (imagenElement && imagenElement.src) {
                    console.log("[CORRECCIÓN FINAL] Imagen encontrada en tarjeta");
                    return imagenElement.src;
                }
            }
        }
        
        // Si no se encuentra, usar imagen predeterminada según el tipo de producto
        console.log("[CORRECCIÓN FINAL] Usando imagen predeterminada basada en el nombre");
        nombre = nombre.toLowerCase();
        
        if (nombre.includes('zapato') || nombre.includes('tenis') || nombre.includes('calzado')) {
            if (nombre.includes('hombre')) {
                return 'assets/img/calzhombres/zapato1.jpeg';
            } else if (nombre.includes('mujer')) {
                return 'assets/img/calzmujeres/m1.jpeg';
            } else if (nombre.includes('niño')) {
                return 'assets/img/calzninos/1.jpeg';
            } else if (nombre.includes('niña')) {
                return 'assets/img/calzninas/1.jpeg';
            }
        }
        
        // Imagen por defecto
        return 'assets/img/zapato1.jpeg';
    }
    
    // Corregir la visualización de productos en el carrito
    function corregirVisualizacionCarrito() {
        console.log("[CORRECCIÓN FINAL] Corrigiendo visualización del carrito");
        
        // Verificar si existe la función original
        if (typeof window.renderizarProductosCarrito !== 'function') {
            console.log("[CORRECCIÓN FINAL] No se encontró la función renderizarProductosCarrito, creando nueva");
            
            // Crear nuestra propia función de renderizado
            window.renderizarProductosCarrito = function() {
                console.log("[CORRECCIÓN FINAL] Renderizando productos del carrito");
                
                const carritoLista = document.getElementById('carrito-lista');
                const carritoVacio = document.getElementById('carrito-vacio');
                const carritoTotal = document.getElementById('carrito-total');
                const carritoTotalPrecio = document.getElementById('carrito-total-precio');
                
                if (!carritoLista || !carritoVacio || !carritoTotal || !carritoTotalPrecio) {
                    console.error("[CORRECCIÓN FINAL] No se encontraron elementos del carrito");
                    return;
                }
                
                if (!window.carrito || window.carrito.length === 0) {
                    // Carrito vacío
                    carritoLista.innerHTML = '';
                    carritoVacio.style.display = 'block';
                    carritoTotal.classList.add('oculto');
                    return;
                }
                
                // Carrito con productos
                carritoVacio.style.display = 'none';
                carritoTotal.classList.remove('oculto');
                
                // Generar HTML para cada producto
                let totalPrecio = 0;
                let html = '';
                
                window.carrito.forEach((producto, index) => {
                    const cantidad = producto.cantidad || 1;
                    const subtotal = producto.precio * cantidad;
                    totalPrecio += subtotal;
                    
                    // CORRECCIÓN: Asegurar que haya imagen
                    const imagenSrc = producto.imagen || obtenerImagenProducto(producto.nombre);
                    
                    html += `
                    <div class="carrito-item" data-idx="${index}">
                        <div class="carrito-item-img">
                            <img src="${imagenSrc}" alt="${producto.nombre}">
                        </div>
                        <div class="carrito-item-info">
                            <div class="carrito-item-nombre">${producto.nombre}</div>
                            <div class="carrito-item-talla">Talla: ${producto.talla}</div>
                            <div class="carrito-item-precio">$${subtotal.toLocaleString('es-CO')}</div>
                        </div>
                        <div class="carrito-item-acciones">
                            <div class="carrito-item-cantidad">
                                <button class="disminuir-cantidad" data-idx="${index}">-</button>
                                <span>${cantidad}</span>
                                <button class="aumentar-cantidad" data-idx="${index}">+</button>
                            </div>
                            <button class="eliminar-item" data-idx="${index}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    `;
                });
                
                carritoLista.innerHTML = html;
                carritoTotalPrecio.textContent = totalPrecio.toLocaleString('es-CO');
                
                // Enlazar eventos para los botones
                enlazarEventosCarritoItems();
                
                // Mostrar mensaje de envío gratis
                mostrarMensajeEnvioGratis();
            };
        } else {
            // La función existe, la reemplazamos
            const renderizarOriginal = window.renderizarProductosCarrito;
            
            window.renderizarProductosCarrito = function() {
                console.log("[CORRECCIÓN FINAL] Interceptando renderizarProductosCarrito");
                
                // Asegurar que todos los productos tengan imagen
                if (window.carrito && window.carrito.length > 0) {
                    window.carrito.forEach(producto => {
                        if (!producto.imagen) {
                            producto.imagen = obtenerImagenProducto(producto.nombre);
                        }
                    });
                    
                    // Guardar carrito actualizado
                    localStorage.setItem('carrito', JSON.stringify(window.carrito));
                }
                
                // Llamar a la función original
                renderizarOriginal();
                
                // Mostrar mensaje de envío gratis
                mostrarMensajeEnvioGratis();
            };
        }
        
        console.log("[CORRECCIÓN FINAL] Visualización del carrito corregida");
    }
    
    // Mostrar mensaje de envío gratis
    function mostrarMensajeEnvioGratis() {
        console.log("[CORRECCIÓN FINAL] Verificando condiciones para mensaje de envío gratis");
        
        // Verificar que el carrito esté abierto
        const carritoModal = document.getElementById('modal-carrito');
        if (!carritoModal || carritoModal.classList.contains('oculto')) {
            return;
        }
        
        // Calcular cantidad total de productos
        const cantidadTotal = window.carrito.reduce((total, producto) => {
            return total + (producto.cantidad || 1);
        }, 0);
        
        console.log("[CORRECCIÓN FINAL] Cantidad total de productos:", cantidadTotal);
        
        // Verificar si ya existe el mensaje
        let mensajeEnvio = carritoModal.querySelector('.mensaje-envio-gratis');
        
        if (!mensajeEnvio) {
            // Crear elemento para el mensaje
            mensajeEnvio = document.createElement('div');
            mensajeEnvio.className = 'mensaje-envio-gratis';
            
            // Estilos del mensaje
            Object.assign(mensajeEnvio.style, {
                padding: '10px 15px',
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                borderRadius: '5px',
                marginTop: '15px',
                textAlign: 'center',
                fontWeight: 'bold',
                display: 'none',
                borderLeft: '4px solid #2e7d32'
            });
            
            // Insertar después del total
            const carritoTotal = document.getElementById('carrito-total');
            if (carritoTotal) {
                carritoTotal.after(mensajeEnvio);
            }
        }
        
        // Mostrar mensaje si hay 2 o más productos
        if (cantidadTotal >= 2) {
            mensajeEnvio.innerHTML = '<i class="fa-solid fa-truck"></i> POR COMPRA DE DOS PARES O MAS, OBTIENES ENVIO GRATIS!';
            mensajeEnvio.style.display = 'block';
            console.log("[CORRECCIÓN FINAL] Mostrando mensaje de envío gratis");
        } else {
            mensajeEnvio.style.display = 'none';
            console.log("[CORRECCIÓN FINAL] Ocultando mensaje de envío gratis");
        }
    }
    
    // Actualizar contador del carrito
    function actualizarContadorCarrito() {
        console.log("[CORRECCIÓN FINAL] Actualizando contador del carrito");
        
        const contadorElement = document.getElementById('carrito-cantidad');
        if (!contadorElement) {
            console.error("[CORRECCIÓN FINAL] No se encontró el elemento contador del carrito");
            return;
        }
        
        if (!window.carrito) {
            console.error("[CORRECCIÓN FINAL] Variable carrito no encontrada");
            contadorElement.textContent = "0";
            return;
        }
        
        // Calcular cantidad total considerando la propiedad cantidad
        const cantidadTotal = window.carrito.reduce((total, producto) => {
            return total + (producto.cantidad || 1);
        }, 0);
        
        contadorElement.textContent = cantidadTotal.toString();
        console.log("[CORRECCIÓN FINAL] Contador actualizado:", cantidadTotal);
    }
    
    // Enlazar eventos para los elementos del carrito
    function enlazarEventosCarritoItems() {
        console.log("[CORRECCIÓN FINAL] Enlazando eventos para elementos del carrito");
        
        // Botones para aumentar cantidad
        document.querySelectorAll('.aumentar-cantidad').forEach(boton => {
            boton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-idx'));
                if (window.carrito[index]) {
                    window.carrito[index].cantidad = (window.carrito[index].cantidad || 1) + 1;
                    localStorage.setItem('carrito', JSON.stringify(window.carrito));
                    window.renderizarProductosCarrito();
                }
            });
        });
        
        // Botones para disminuir cantidad
        document.querySelectorAll('.disminuir-cantidad').forEach(boton => {
            boton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-idx'));
                if (window.carrito[index] && window.carrito[index].cantidad > 1) {
                    window.carrito[index].cantidad -= 1;
                    localStorage.setItem('carrito', JSON.stringify(window.carrito));
                    window.renderizarProductosCarrito();
                }
            });
        });
        
        // Botones para eliminar producto
        document.querySelectorAll('.eliminar-item').forEach(boton => {
            boton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-idx'));
                if (window.carrito[index]) {
                    window.carrito.splice(index, 1);
                    localStorage.setItem('carrito', JSON.stringify(window.carrito));
                    window.renderizarProductosCarrito();
                    actualizarContadorCarrito();
                }
            });
        });
    }
    
    // Función para enlazar eventos de apertura/cierre del carrito
    function enlazarEventosCarrito() {
        console.log("[CORRECCIÓN FINAL] Enlazando eventos de apertura/cierre del carrito");
        
        const btnCarrito = document.getElementById('btn-carrito');
        const cerrarCarrito = document.getElementById('cerrar-carrito');
        const btnElegirProductos = document.getElementById('btn-elegir-productos');
        const modalCarrito = document.getElementById('modal-carrito');
        
        if (btnCarrito) {
            btnCarrito.addEventListener('click', function() {
                console.log("[CORRECCIÓN FINAL] Abriendo carrito");
                modalCarrito.classList.remove('oculto');
                window.renderizarProductosCarrito();
            });
        }
        
        if (cerrarCarrito) {
            cerrarCarrito.addEventListener('click', function() {
                console.log("[CORRECCIÓN FINAL] Cerrando carrito");
                modalCarrito.classList.add('oculto');
            });
        }
        
        if (btnElegirProductos) {
            btnElegirProductos.addEventListener('click', function() {
                console.log("[CORRECCIÓN FINAL] Cerrando carrito desde botón elegir productos");
                modalCarrito.classList.add('oculto');
            });
        }
    }
    
    // Iniciar la corrección con un ligero retraso
    setTimeout(aplicarCorreccionesFinales, 500);
});
