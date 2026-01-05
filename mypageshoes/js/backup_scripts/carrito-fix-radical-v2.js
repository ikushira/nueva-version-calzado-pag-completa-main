// carrito-fix-radical-v2.js - Solución definitiva para el problema de productos duplicados
// Version 3.0 - Fecha: 27/07/2025

// Esperamos a que el DOM esté listo y que otras posibles inicializaciones hayan ocurrido
document.addEventListener('DOMContentLoaded', function() {
    console.log("==================================");
    console.log("CORRECCIÓN RADICAL DEL CARRITO V2");
    console.log("Versión: 3.0 - Fecha: 27/07/2025");
    console.log("==================================");
    
    // Contador para evitar loops infinitos
    let intentos = 0;
    const maxIntentos = 10;
    
    // Variable de control para evitar doble procesamiento
    let procesandoClick = false;

    // Variable para rastrear los botones ya procesados
    const botonesYaProcesados = new Set();
    
    // Función para detener completamente TODOS los sistemas anteriores
    function detenerSistemaAnterior() {
        console.log("[RADICAL V2] Deteniendo TODOS los sistemas anteriores");
        
        // 1. Eliminar observer
        if (window.carritoObservador) {
            window.carritoObservador.disconnect();
            console.log("[RADICAL V2] Observer anterior desconectado");
            window.carritoObservador = null;
        }
        
        // 2. Eliminar TODAS las funciones relacionadas con el carrito del objeto window
        const funcionesAEliminar = [
            'inicializarCarrito',
            'enlazarBotonesAgregarAlCarrito', 
            'agregarAlCarrito'
        ];
        
        funcionesAEliminar.forEach(funcion => {
            if (typeof window[funcion] === 'function') {
                console.log(`[RADICAL V2] Eliminando función ${funcion} del objeto window`);
                window[funcion] = function() {
                    console.log(`[RADICAL V2] Intento de llamar a ${funcion} interceptado y detenido`);
                    return false;
                };
            }
        });
        
        // 3. Eliminar eventos click existentes de TODOS los botones
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
        console.log(`[RADICAL V2] Encontrados ${botones.length} botones para limpiar`);
        
        botones.forEach((boton, idx) => {
            // Crear un nuevo botón completamente limpio (sin eventos)
            const nuevoBoton = boton.cloneNode(true);
            
            // Asegurarse que tiene el mismo texto e íconos
            nuevoBoton.innerHTML = boton.innerHTML;
            
            // Marcar para nuestro sistema
            nuevoBoton.dataset.procesadoRadicalV2 = 'true';
            
            // Reemplazar el botón viejo por el nuevo sin eventos
            if (boton.parentNode) {
                boton.parentNode.replaceChild(nuevoBoton, boton);
                console.log(`[RADICAL V2] Botón #${idx + 1} reemplazado completamente`);
            }
        });
        
        // 4. Detener propagación de eventos para prevenir duplicados (monitorear TODOS los clicks)
        // Este es un seguro adicional para prevenir que otros manejadores se activen
        document.addEventListener('click', function(event) {
            const target = event.target;
            const boton = target.closest('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
            
            if (boton && boton.dataset.procesadoRadicalV2 !== 'true') {
                console.log("[RADICAL V2] Interceptando click en botón no procesado por nuestro sistema");
                event.stopPropagation();
                event.preventDefault();
                
                // Procesar este botón para que use nuestro sistema
                boton.dataset.procesadoRadicalV2 = 'true';
                
                // Simular click con nuestro sistema
                manejarClickBotones(event);
            }
        }, true); // Fase de captura para interceptar antes que otros listeners
    }
    
    // Función para manejar los clicks en botones (único punto de entrada)
    function manejarClickBotones(event) {
        // Verificar si el click fue en un botón de carrito
        const boton = event.target.closest('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
        
        if (!boton) {
            return; // No es un botón de carrito
        }
        
        // Prevenir navegación o comportamiento por defecto
        event.preventDefault();
        event.stopPropagation(); // Detener propagación para evitar que otros handlers lo procesen
        
        // Prevenir doble procesamiento global
        if (procesandoClick) {
            console.log("[RADICAL V2] Ya se está procesando un click, ignorando");
            return;
        }
        
        // Generar un ID único para este botón basado en su posición en el DOM
        const generarIdBoton = (btn) => {
            let path = [];
            let element = btn;
            
            while (element) {
                let selector = element.tagName.toLowerCase();
                if (element.id) {
                    selector += `#${element.id}`;
                } else if (element.className) {
                    selector += `.${Array.from(element.classList).join('.')}`;
                }
                
                // Índice entre hermanos
                let index = 0;
                let sibling = element;
                while (sibling = sibling.previousElementSibling) {
                    index++;
                }
                
                path.unshift(`${selector}:nth-child(${index + 1})`);
                
                if (element.tagName.toLowerCase() === 'body') break;
                element = element.parentElement;
            }
            
            return path.join(' > ');
        };
        
        const botonId = generarIdBoton(boton);
        
        // Verificar si este botón específico ya ha sido procesado
        if (botonesYaProcesados.has(botonId)) {
            console.log(`[RADICAL V2] Botón con ID: ${botonId} ya procesado, ignorando`);
            return;
        }
        
        console.log("[RADICAL V2] Procesando click en botón de carrito");
        
        // Marcar inicio de procesamiento global
        procesandoClick = true;
        
        // Marcar este botón específico como procesado
        botonesYaProcesados.add(botonId);
        
        // Establecer un temporizador para permitir nuevos clicks después de un tiempo
        setTimeout(() => {
            procesandoClick = false;
            
            // Después de un tiempo más largo, permitir que este botón se procese nuevamente
            setTimeout(() => {
                botonesYaProcesados.delete(botonId);
            }, 1000); // 1 segundo para permitir click nuevamente en el mismo botón
        }, 500); // 500ms de protección global
        
        // Obtener datos del producto
        const tarjeta = boton.closest('.producto-card, .card-producto');
        if (!tarjeta) {
            console.error("[RADICAL V2] No se encontró tarjeta de producto");
            procesandoClick = false;
            return;
        }
        
        // Obtener nombre del producto
        const nombreElement = tarjeta.querySelector('h3, .producto-titulo, .nombre-producto');
        if (!nombreElement) {
            console.error("[RADICAL V2] No se encontró el nombre del producto");
            procesandoClick = false;
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
            console.warn("[RADICAL V2] No se agregó producto: falta seleccionar talla");
            procesandoClick = false;
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
        
        console.log("[RADICAL V2] Agregando producto al carrito:", producto);
        
        // Agregar al carrito (solo una vez)
        agregarProductoUnaVez(producto);
        
        // Mostrar notificación
        mostrarNotificacion(boton);
    }
    
    // Función para agregar producto garantizando que solo se agrega una vez
    function agregarProductoUnaVez(producto) {
        if (!window.carrito) {
            console.error("[RADICAL V2] Variable carrito no encontrada");
            return false;
        }
        
        console.log("[RADICAL V2] Estado actual del carrito:", JSON.stringify(window.carrito));
        
        // Verificar si ya existe en el carrito
        const indiceExistente = window.carrito.findIndex(item => 
            item.nombre === producto.nombre && item.talla === producto.talla
        );
        
        if (indiceExistente !== -1) {
            // Ya existe, incrementar cantidad
            console.log(`[RADICAL V2] Producto ya existe en índice ${indiceExistente}, incrementando cantidad`);
            window.carrito[indiceExistente].cantidad = (window.carrito[indiceExistente].cantidad || 1) + 1;
        } else {
            // No existe, agregarlo nuevo
            console.log(`[RADICAL V2] Producto nuevo, agregando al carrito`);
            window.carrito.push(producto);
        }
        
        // Actualizar carrito
        guardarCarritoRadicalV2();
        actualizarCantidadCarritoRadicalV2();
        
        console.log(`[RADICAL V2] Carrito actualizado: ${window.carrito.length} productos`);
        console.log("[RADICAL V2] Nuevo estado del carrito:", JSON.stringify(window.carrito));
        
        return true;
    }
    
    // Guardar carrito en localStorage
    function guardarCarritoRadicalV2() {
        try {
            localStorage.setItem('carrito', JSON.stringify(window.carrito));
            console.log("[RADICAL V2] Carrito guardado en localStorage");
        } catch (error) {
            console.error("[RADICAL V2] Error al guardar carrito:", error);
        }
        
        // También usar la función original si existe
        if (typeof window.guardarCarrito === 'function') {
            window.guardarCarrito();
        }
    }
    
    // Actualizar cantidad
    function actualizarCantidadCarritoRadicalV2() {
        const contadorElement = document.getElementById('carrito-cantidad');
        
        if (!contadorElement) {
            console.error("[RADICAL V2] Elemento 'carrito-cantidad' no encontrado");
            return;
        }
        
        // Calcular cantidad total sumando las cantidades de cada producto
        const cantidadTotal = window.carrito.reduce((total, producto) => {
            return total + (typeof producto.cantidad === 'number' ? producto.cantidad : 1);
        }, 0);
        
        contadorElement.textContent = cantidadTotal.toString();
        console.log(`[RADICAL V2] Contador de carrito actualizado: ${cantidadTotal} productos`);
        
        // También usar la función original si existe
        if (typeof window.actualizarCantidadCarrito === 'function') {
            window.actualizarCantidadCarrito();
        }
    }
    
    // Función para mostrar notificación de producto agregado
    function mostrarNotificacion(elemento) {
        console.log("[RADICAL V2] Mostrando notificación");
        
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
    
    // Función para añadir un listener global para detectar nuevos botones
    function monitorearNuevosElementos() {
        console.log("[RADICAL V2] Configurando monitoreo de nuevos elementos");
        
        // Usar un MutationObserver para detectar nuevos botones
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Solo elementos HTML
                            // Comprobar si el nuevo nodo es un botón o contiene botones
                            const nuevosBotones = node.querySelectorAll 
                                ? node.querySelectorAll('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito')
                                : [];
                                
                            if (nuevosBotones.length > 0) {
                                console.log(`[RADICAL V2] Detectados ${nuevosBotones.length} nuevos botones`);
                                
                                // Marcar estos botones
                                nuevosBotones.forEach(boton => {
                                    if (!boton.dataset.procesadoRadicalV2) {
                                        boton.dataset.procesadoRadicalV2 = 'true';
                                        console.log("[RADICAL V2] Nuevo botón marcado para nuestro sistema");
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
        
        // Observar todo el documento para nuevos botones
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log("[RADICAL V2] Monitoreo de nuevos elementos configurado");
    }
    
    // Función principal que iniciará todo el proceso
    function aplicarSolucion() {
        console.log(`[RADICAL V2] Intento #${++intentos} de aplicar solución definitiva`);
        
        if (intentos > maxIntentos) {
            console.error("[RADICAL V2] Número máximo de intentos alcanzado, abortando");
            return;
        }
        
        // Verificar si el carrito ya está disponible
        if (window.carrito && window.carrito instanceof Array) {
            console.log("[RADICAL V2] Carrito detectado, aplicando solución definitiva");
            
            // 1. Detener TODOS los sistemas anteriores
            detenerSistemaAnterior();
            
            // 2. Añadir nuestro único listener global
            document.addEventListener('click', manejarClickBotones);
            console.log("[RADICAL V2] Listener global único instalado");
            
            // 3. Configurar monitoreo para nuevos elementos
            monitorearNuevosElementos();
            
            console.log("[RADICAL V2] Solución radical v2 aplicada con éxito");
        } else {
            console.log("[RADICAL V2] Carrito aún no disponible, esperando...");
            
            // Esperar y volver a intentar
            setTimeout(aplicarSolucion, 500);
        }
    }
    
    // Iniciar el proceso
    console.log("[RADICAL V2] Iniciando proceso de corrección radical definitiva");
    
    // Esperamos un poco más para asegurarnos que otros scripts se hayan cargado
    setTimeout(aplicarSolucion, 100);
});
