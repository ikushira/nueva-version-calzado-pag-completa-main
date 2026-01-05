// carrito-fix.js - Solución para el problema de duplicación de productos

// Esta función evitará que se agreguen productos duplicados al carrito
document.addEventListener('DOMContentLoaded', function() {
    console.log("==================================");
    console.log("APLICANDO CORRECCIÓN DE CARRITO");
    console.log("Versión: 1.0 - Fecha: 27/07/2025");
    console.log("==================================");
    
    // Sobrescribir la función agregarAlCarrito para evitar duplicados
    if (window.agregarAlCarrito) {
        // Guardar la función original
        const agregarAlCarritoOriginal = window.agregarAlCarrito;
        
        // Sobrescribir con versión mejorada
        window.agregarAlCarrito = function(producto) {
            console.log("[CORREGIDO] Agregando al carrito:", producto);
            
            // Verificar si ya existe en el carrito
            const indiceExistente = carrito.findIndex(item => 
                item.nombre === producto.nombre && item.talla === producto.talla
            );
            
            if (indiceExistente !== -1) {
                // Ya existe, incrementar cantidad
                console.log(`[CORREGIDO] Producto ya existe en índice ${indiceExistente}, incrementando cantidad`);
                carrito[indiceExistente].cantidad = (carrito[indiceExistente].cantidad || 1) + 1;
            } else {
                // No existe, agregarlo nuevo
                console.log(`[CORREGIDO] Producto nuevo, agregando al carrito`);
                carrito.push(producto);
            }
            
            // Actualizar carrito
            guardarCarrito();
            actualizarCantidadCarrito();
            
            console.log(`[CORREGIDO] Carrito actualizado: ${carrito.length} productos`);
            return true;
        };
        
        console.log("Función agregarAlCarrito corregida");
    } else {
        console.error("No se encontró la función agregarAlCarrito para corregir");
    }
    
    // Corregir el problema de eventos duplicados
    function corregirEventosCarrito() {
        console.log("Corrigiendo eventos de botones del carrito");
        
        // Desconectar el observer existente si hay uno
        if (window.carritoObservador) {
            window.carritoObservador.disconnect();
            console.log("Observer de carrito desconectado");
        }
        
        // Crear un nuevo observer con lógica mejorada
        window.carritoObservador = new MutationObserver(function(mutaciones) {
            let nuevosElementos = false;
            
            // Verificar si se agregaron elementos relevantes
            mutaciones.forEach(function(mutacion) {
                if (mutacion.addedNodes.length) {
                    // Solo marcar como nuevos si se agregaron elementos del DOM
                    for (let i = 0; i < mutacion.addedNodes.length; i++) {
                        const nodo = mutacion.addedNodes[i];
                        if (nodo.nodeType === 1 && 
                            (nodo.classList?.contains('producto-card') || 
                             nodo.querySelector?.('.btn-add-cart'))) {
                            nuevosElementos = true;
                            break;
                        }
                    }
                }
            });
            
            // Solo volver a enlazar si realmente hay nuevos elementos de producto
            if (nuevosElementos) {
                console.log("[CORREGIDO] Detectados nuevos elementos de producto, enlazando botones");
                // Usar setTimeout para evitar colisiones con otros scripts
                setTimeout(enlazarBotonesAgregarAlCarrito, 100);
            }
        });
        
        // Observar cambios solo en contenedores de productos, no en todo el body
        const contenedoresProductos = [
            document.getElementById('catalogo-hombres'),
            document.getElementById('catalogo-mujeres'),
            document.getElementById('catalogo-ninos'),
            document.getElementById('catalogo-ninas'),
            document.getElementById('catalogo-colegiales'),
            document.getElementById('catalogo-accesorios'),
            document.getElementById('catalogo-dotacion'),
            document.getElementById('catalogo-marcas'),
            document.getElementById('carrusel-novedades')
        ].filter(Boolean);
        
        if (contenedoresProductos.length > 0) {
            console.log(`[CORREGIDO] Observando ${contenedoresProductos.length} contenedores de productos`);
            contenedoresProductos.forEach(contenedor => {
                window.carritoObservador.observe(contenedor, {
                    childList: true,
                    subtree: true
                });
            });
        } else {
            console.log("[CORREGIDO] No se encontraron contenedores de productos, observando body");
            window.carritoObservador.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Esperar a que el carrito esté inicializado
    const esperarCarritoInicializado = setInterval(function() {
        if (window.carritoInicializado || window.carritoObservador) {
            clearInterval(esperarCarritoInicializado);
            console.log("Carrito detectado como inicializado, aplicando correcciones");
            corregirEventosCarrito();
        }
    }, 100);
    
    // Por seguridad, aplicar correcciones después de 2 segundos aunque no se detecte inicialización
    setTimeout(function() {
        clearInterval(esperarCarritoInicializado);
        console.log("Aplicando correcciones de carrito por tiempo de espera");
        corregirEventosCarrito();
    }, 2000);
    
    console.log("Corrección de carrito configurada");
});
