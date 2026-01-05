// carrito-tarjetas-fix.js
// Script para garantizar que todas las tarjetas de productos solo añadan un producto al carrito

document.addEventListener('DOMContentLoaded', function() {
    console.log("==========================================");
    console.log("CORRECCIÓN UNIVERSAL PARA TARJETAS");
    console.log("Versión: 1.0 - Fecha: 27/07/2025");
    console.log("==========================================");
    
    // Definir la función de corrección de forma global para que esté disponible en toda la página
    window.aplicarCorreccionTarjetas = function() {
        console.log("[TARJETAS FIX] Iniciando corrección universal para tarjetas de productos");
        
        // 1. Buscar todas las tarjetas de productos en la página
        const tarjetas = document.querySelectorAll('.producto-card, .card-producto');
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
                if (this.getAttribute('data-procesado') === 'true') {
                    console.log(`[TARJETAS FIX] Botón ya procesado, evitando duplicación`);
                    return;
                }
                
                // Marcar como procesado para evitar duplicación
                this.setAttribute('data-procesado', 'true');
                
                // Obtener información del producto
                const nombreElement = tarjeta.querySelector('.producto-nombre, h3');
                const precioElement = tarjeta.querySelector('.producto-precio, p.producto-precio');
                const tallaSeleccionada = tarjeta.querySelector('.talla-btn.seleccionada, .talla-seleccionada');
                const imagenElement = tarjeta.querySelector('img');
                
                // Verificar que tengamos toda la información necesaria
                if (!nombreElement || !precioElement || !tallaSeleccionada) {
                    if (!tallaSeleccionada) {
                        alert('Por favor selecciona una talla antes de añadir al carrito.');
                    } else {
                        alert('No se pudo agregar el producto al carrito. Falta información.');
                    }
                    this.setAttribute('data-procesado', 'false');
                    return;
                }
                
                // Extraer datos del producto
                const nombre = nombreElement.textContent.trim();
                const precioTexto = precioElement.textContent.replace('$', '').replace(/\./g, '').replace(/,/g, '').trim();
                const precio = parseInt(precioTexto, 10);
                const talla = tallaSeleccionada.textContent.trim();
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
                
                // Agregar al carrito usando las funciones existentes (si existen)
                if (typeof window.agregarProductoUnaVez === 'function') {
                    window.agregarProductoUnaVez(producto);
                    mostrarNotificacion(tarjeta);
                } else if (typeof window.carrito !== 'undefined') {
                    // Si no existe la función, pero sí el carrito, lo hacemos directamente
                    const indiceExistente = window.carrito.findIndex(item => 
                        item.id === producto.id
                    );
                    
                    if (indiceExistente !== -1) {
                        window.carrito[indiceExistente].cantidad += 1;
                    } else {
                        window.carrito.push(producto);
                    }
                    
                    // Guardar en localStorage
                    localStorage.setItem('carrito', JSON.stringify(window.carrito));
                    
                    // Actualizar contador
                    if (typeof window.actualizarCantidadCarrito === 'function') {
                        window.actualizarCantidadCarrito();
                    }
                    
                    mostrarNotificacion(tarjeta);
                } else {
                    console.error('[TARJETAS FIX] No se pudo agregar al carrito, no existe window.carrito');
                    alert('Error al agregar el producto al carrito');
                }
                
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
    
    // Esperar a que los catálogos se hayan generado y luego aplicar la corrección
    setTimeout(window.aplicarCorreccionTarjetas, 1000);
    
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
});
});
