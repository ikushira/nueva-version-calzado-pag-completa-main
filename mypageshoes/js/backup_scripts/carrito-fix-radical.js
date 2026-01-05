// carrito-fix-radical.js - Solución definitiva para el problema de productos triplicados

// Este script reemplaza completamente el sistema de eventos del carrito
document.addEventListener('DOMContentLoaded', function() {
    console.log("==================================");
    console.log("CORRECCIÓN RADICAL DEL CARRITO");
    console.log("Versión: 2.0 - Fecha: 27/07/2025");
    console.log("==================================");
    
    // Contador para evitar loops infinitos
    let intentos = 0;
    const maxIntentos = 10;
    
    // Función para detener completamente el sistema anterior
    function detenerSistemaAnterior() {
        console.log("[RADICAL] Deteniendo sistema anterior");
        
        // Desconectar el observer existente
        if (window.carritoObservador) {
            window.carritoObservador.disconnect();
            console.log("[RADICAL] Observer anterior desconectado");
            window.carritoObservador = null;
        }
        
        // Eliminar la inicialización automática del carrito
        if (typeof window.inicializarCarrito === 'function') {
            const inicializarOriginal = window.inicializarCarrito;
            window.inicializarCarrito = function() {
                console.log("[RADICAL] Inicialización automática del carrito interceptada");
                if (!window.carritoInicializado) {
                    console.log("[RADICAL] Permitiendo inicialización inicial");
                    inicializarOriginal();
                } else {
                    console.log("[RADICAL] Evitando inicialización duplicada");
                }
            };
        }
        
        // Detener enlace automático de botones
        window.enlazarBotonesAgregarAlCarrito = function() {
            console.log("[RADICAL] Intento de enlazar botones detenido");
            // No hacer nada, nosotros controlaremos los botones
        };
    }
    
    // Función para aplicar nuestro propio sistema de eventos
    function aplicarNuevoSistema() {
        console.log("[RADICAL] Aplicando nuevo sistema de eventos al carrito");
        
        // Remover TODOS los eventos click de botones de carrito existentes
        const botones = document.querySelectorAll('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
        
        console.log(`[RADICAL] Encontrados ${botones.length} botones para reiniciar`);
        
        botones.forEach((boton, idx) => {
            // Crear un nuevo botón limpio
            const nuevoBoton = boton.cloneNode(true);
            
            // Asegurarse que tiene el mismo texto e íconos
            nuevoBoton.innerHTML = boton.innerHTML;
            
            // Marcar para evitar procesamiento duplicado
            nuevoBoton.dataset.procesadoRadical = 'true';
            
            // Reemplazar el botón viejo
            if (boton.parentNode) {
                boton.parentNode.replaceChild(nuevoBoton, boton);
                console.log(`[RADICAL] Botón #${idx + 1} reemplazado`);
            }
        });
        
        // Añadir un único listener global para manejar todos los botones
        document.addEventListener('click', manejarClickBotones);
        
        console.log("[RADICAL] Listener global instalado");
    }
    
    // Función que maneja los clicks en cualquier botón
    function manejarClickBotones(event) {
        // Verificar si el click fue en un botón de carrito
        const boton = event.target.closest('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
        
        if (!boton) {
            return; // No es un botón de carrito
        }
        
        // Evitar navegación o comportamiento por defecto
        event.preventDefault();
        
        console.log("[RADICAL] Click detectado en botón de carrito");
        
        // Verificar si ya hemos procesado este click (prevenir doble procesamiento)
        if (boton.dataset.clickProcesado === 'true') {
            console.log("[RADICAL] Click ya procesado, ignorando");
            return;
        }
        
        // Marcar como procesado temporalmente (se limpiará después)
        boton.dataset.clickProcesado = 'true';
        setTimeout(() => {
            delete boton.dataset.clickProcesado;
        }, 500); // Prevenir doble click por 500ms
        
        // Obtener datos del producto
        const tarjeta = boton.closest('.producto-card, .card-producto');
        if (!tarjeta) {
            console.error("[RADICAL] No se encontró tarjeta de producto");
            return;
        }
        
        // Obtener nombre del producto
        const nombreElement = tarjeta.querySelector('h3, .producto-titulo, .nombre-producto');
        if (!nombreElement) {
            console.error("[RADICAL] No se encontró el nombre del producto");
            return;
        }
        const nombre = nombreElement.textContent.trim();
        
        // Obtener precio
        const precioElement = tarjeta.querySelector('.producto-precio, .precio');
        let precio = 0;
        if (precioElement) {
            // Extraer solo números del precio
            const precioTexto = precioElement.textContent.trim();
            const coincidencias = precioTexto.match(/[\d,.]+/);
            if (coincidencias && coincidencias.length > 0) {
                precio = parseFloat(coincidencias[0].replace(/[.,]/g, ''));
            }
        }
        
        // Obtener talla seleccionada
        let talla = null;
        const tallasContainer = tarjeta.querySelector('.producto-tallas, .tallas-container');
        if (tallasContainer) {
            const tallaSeleccionada = tallasContainer.querySelector('.talla-btn.seleccionada, .talla-seleccionada');
            if (tallaSeleccionada) {
                talla = tallaSeleccionada.textContent.trim();
            }
        }
        
        // Verificar que se seleccionó una talla
        if (!talla) {
            alert('Por favor selecciona una talla antes de añadir al carrito.');
            console.warn("[RADICAL] No se agregó producto: falta seleccionar talla");
            return;
        }
        
        // Crear objeto de producto
        const producto = {
            id: `${nombre}-${talla}`,
            nombre: nombre,
            precio: precio,
            talla: talla,
            cantidad: 1
        };
        
        console.log("[RADICAL] Agregando producto al carrito:", producto);
        
        // Agregar al carrito (solo una vez)
        agregarProductoUnaVez(producto);
        
        // Mostrar notificación
        mostrarNotificacion(boton);
    }
    
    // Función para agregar producto garantizando que solo se agrega una vez
    function agregarProductoUnaVez(producto) {
        if (!window.carrito) {
            console.error("[RADICAL] Variable carrito no encontrada");
            return false;
        }
        
        // Verificar si ya existe en el carrito
        const indiceExistente = window.carrito.findIndex(item => 
            item.nombre === producto.nombre && item.talla === producto.talla
        );
        
        if (indiceExistente !== -1) {
            // Ya existe, incrementar cantidad
            console.log(`[RADICAL] Producto ya existe en índice ${indiceExistente}, incrementando cantidad`);
            window.carrito[indiceExistente].cantidad = (window.carrito[indiceExistente].cantidad || 1) + 1;
        } else {
            // No existe, agregarlo nuevo
            console.log(`[RADICAL] Producto nuevo, agregando al carrito`);
            window.carrito.push(producto);
        }
        
        // Actualizar carrito
        if (window.guardarCarrito) window.guardarCarrito();
        if (window.actualizarCantidadCarrito) window.actualizarCantidadCarrito();
        
        console.log(`[RADICAL] Carrito actualizado: ${window.carrito.length} productos`);
        
        return true;
    }
    
    // Función para mostrar notificación de producto agregado
    function mostrarNotificacion(elemento) {
        console.log("[RADICAL] Mostrando notificación");
        
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
            
            // Hacerla visible
            setTimeout(() => {
                notificacion.style.opacity = '1';
            }, 10);
            
            // Ocultarla después de un tiempo
            setTimeout(() => {
                notificacion.style.opacity = '0';
                
                // Removerla del DOM
                setTimeout(() => {
                    if (notificacion.parentNode) {
                        notificacion.parentNode.removeChild(notificacion);
                    }
                }, 300);
            }, 1500);
        }
    }
    
    // Función principal que intentará aplicar la solución
    function aplicarSolucion() {
        console.log(`[RADICAL] Intento #${++intentos} de aplicar solución`);
        
        if (intentos > maxIntentos) {
            console.error("[RADICAL] Número máximo de intentos alcanzado, abortando");
            return;
        }
        
        // Verificar si el carrito ya está disponible
        if (window.carrito && window.carrito instanceof Array) {
            console.log("[RADICAL] Carrito detectado, aplicando solución");
            
            // Detener sistema anterior
            detenerSistemaAnterior();
            
            // Aplicar nuevo sistema
            aplicarNuevoSistema();
        } else {
            console.log("[RADICAL] Carrito aún no disponible, esperando...");
            
            // Esperar y volver a intentar
            setTimeout(aplicarSolucion, 500);
        }
    }
    
    // Iniciar el proceso
    console.log("[RADICAL] Iniciando proceso de corrección radical");
    aplicarSolucion();
});
