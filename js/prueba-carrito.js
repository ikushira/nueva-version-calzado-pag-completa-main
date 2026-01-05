// prueba-carrito.js
// Script para verificar el funcionamiento del carrito y la corrección de tarjetas

// Inicializar test
console.log("=========================================");
console.log("PRUEBA DE FUNCIONAMIENTO DEL CARRITO");
console.log("Versión: 1.0 - Fecha: 27/07/2025");
console.log("=========================================");

// Ejecutar prueba cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Crear botón de prueba
    crearBotonPrueba();
    
    // Verificar que el carrito esté disponible
    if (typeof window.carrito === 'undefined') {
        console.error("⚠️ La variable 'window.carrito' no está definida");
    } else {
        console.log("✓ La variable 'window.carrito' está definida");
    }
    
    // Verificar función de agregar producto
    if (typeof window.agregarProductoUnaVez !== 'function') {
        console.error("⚠️ La función 'window.agregarProductoUnaVez' no está definida");
        
        // Intentar definir la función
        window.agregarProductoUnaVez = function(producto) {
            console.log("[CARRITO] Agregando producto una vez:", producto);
            
            // Asegurarse de que carrito esté definido
            if (typeof window.carrito === 'undefined') {
                console.log("[CARRITO] Inicializando window.carrito");
                window.carrito = [];
                
                // Intentar cargar desde localStorage
                try {
                    const carritoGuardado = localStorage.getItem('carrito');
                    if (carritoGuardado) {
                        window.carrito = JSON.parse(carritoGuardado);
                    }
                } catch(e) {
                    console.error("[CARRITO] Error al cargar carrito desde localStorage", e);
                }
            }
            
            // Verificar si el producto ya existe en el carrito por su ID
            const indiceExistente = window.carrito.findIndex(item => 
                item.id === producto.id
            );
            
            if (indiceExistente !== -1) {
                // El producto ya existe, incrementar cantidad
                window.carrito[indiceExistente].cantidad += 1;
                console.log(`[CARRITO] Producto existente, cantidad actualizada: ${window.carrito[indiceExistente].cantidad}`);
            } else {
                // Es un producto nuevo, añadirlo al carrito
                window.carrito.push(producto);
                console.log("[CARRITO] Nuevo producto agregado al carrito");
            }
            
            // Guardar en localStorage
            localStorage.setItem('carrito', JSON.stringify(window.carrito));
            
            // Actualizar contador del carrito
            if (typeof window.actualizarCantidadCarrito === 'function') {
                window.actualizarCantidadCarrito();
            } else {
                // Implementación básica por si no existe la función
                const contadorElement = document.getElementById('carrito-cantidad');
                if (contadorElement) {
                    const cantidadTotal = window.carrito.reduce((total, item) => 
                        total + (item.cantidad || 1), 0);
                    contadorElement.textContent = cantidadTotal.toString();
                }
            }
            
            return true;
        };
        
        console.log("✓ La función 'window.agregarProductoUnaVez' ha sido definida manualmente");
    } else {
        console.log("✓ La función 'window.agregarProductoUnaVez' está definida");
    }
    
    // Verificar función de corrección de tarjetas
    if (typeof window.aplicarCorreccionTarjetas !== 'function') {
        console.error("⚠️ La función 'window.aplicarCorreccionTarjetas' no está definida");
    } else {
        console.log("✓ La función 'window.aplicarCorreccionTarjetas' está definida");
    }
    
    // Verificar script de corrección
    const scriptCargado = Array.from(document.scripts).some(script => 
        script.src && script.src.includes('carrito-tarjetas-fix-v2.js')
    );
    
    if (scriptCargado) {
        console.log("✓ El script 'carrito-tarjetas-fix-v2.js' está cargado");
    } else {
        console.error("⚠️ El script 'carrito-tarjetas-fix-v2.js' no está cargado");
    }
    
    // Verificar tarjetas
    const tarjetas = document.querySelectorAll('.producto-card, .card-producto');
    console.log(`ℹ️ Se encontraron ${tarjetas.length} tarjetas en la página`);
    
    if (tarjetas.length > 0) {
        // Verificar si los botones tienen la corrección aplicada
        const botones = document.querySelectorAll('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
        const botonesCorregidos = Array.from(botones).filter(boton => boton.hasAttribute('data-card-id'));
        
        console.log(`ℹ️ Se encontraron ${botones.length} botones, ${botonesCorregidos.length} corregidos`);
        
        if (botonesCorregidos.length < botones.length) {
            console.warn("⚠️ No todos los botones están corregidos");
            
            // Intentar aplicar corrección
            if (typeof window.aplicarCorreccionTarjetas === 'function') {
                console.log("ℹ️ Intentando aplicar corrección manualmente...");
                window.aplicarCorreccionTarjetas();
            }
        } else if (botonesCorregidos.length > 0) {
            console.log("✓ Los botones tienen la corrección aplicada");
        }
    }
});

// Función para crear botón de prueba
function crearBotonPrueba() {
    const boton = document.createElement('button');
    boton.textContent = '🧪 Probar Carrito';
    Object.assign(boton.style, {
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: '9999',
        padding: '10px 15px',
        backgroundColor: '#8e44ad',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    });
    
    boton.addEventListener('click', probarCarrito);
    document.body.appendChild(boton);
}

// Función para probar el carrito
function probarCarrito() {
    console.log("ℹ️ Iniciando prueba de carrito...");
    
    // Verificar estado actual
    console.log("ℹ️ Estado actual del carrito:", window.carrito);
    
    // Crear producto de prueba
    const productoTest = {
        id: `test-producto-${Date.now()}`,
        nombre: 'Producto de prueba',
        precio: 99900,
        talla: '40',
        cantidad: 1,
        imagen: null
    };
    
    // Agregar al carrito usando agregarProductoUnaVez
    if (typeof window.agregarProductoUnaVez === 'function') {
        window.agregarProductoUnaVez(productoTest);
        console.log("✓ Producto agregado al carrito");
        
        // Verificar que se haya guardado
        console.log("ℹ️ Estado después de agregar:", window.carrito);
        
        // Mostrar resultado
        alert('Producto de prueba agregado al carrito. Verifique que solo se haya agregado una vez.');
    } else {
        console.error("⚠️ No se pudo probar el carrito porque la función 'agregarProductoUnaVez' no está disponible");
        alert('Error: No se pudo probar el carrito.');
    }
}
