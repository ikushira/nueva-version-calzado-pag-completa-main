// Script para diagnosticar el comportamiento de los botones de talla
// Este script no modifica ninguna funcionalidad, solo muestra información de depuración

document.addEventListener('DOMContentLoaded', function() {
    console.log("===================================");
    console.log("DIAGNÓSTICO DE BOTONES DE TALLA");
    console.log("===================================");
    
    // Agregar un observador de mutación para detectar cambios en las clases
    const observador = new MutationObserver(function(mutaciones) {
        mutaciones.forEach(function(mutacion) {
            if (
                mutacion.type === 'attributes' && 
                mutacion.attributeName === 'class' &&
                mutacion.target.classList.contains('talla-btn')
            ) {
                const boton = mutacion.target;
                const esSeleccionado = boton.classList.contains('selected') || boton.classList.contains('active');
                const talla = boton.textContent.trim();
                
                console.log(`[DIAGNÓSTICO] Cambio en botón de talla ${talla}: ${esSeleccionado ? 'SELECCIONADO' : 'DESELECCIONADO'}`);
                console.log(`[DIAGNÓSTICO] Clases del botón: ${boton.className}`);
                
                // Verificar si la clase se está aplicando correctamente
                if (esSeleccionado) {
                    console.log(`[DIAGNÓSTICO] ✅ Talla ${talla} correctamente seleccionada`);
                } else {
                    console.log(`[DIAGNÓSTICO] ❌ Talla ${talla} deseleccionada`);
                }
            }
        });
    });
    
    // Monitorear todos los botones de talla existentes
    const botonesTalla = document.querySelectorAll('.talla-btn');
    console.log(`[DIAGNÓSTICO] Se encontraron ${botonesTalla.length} botones de talla en la página`);
    
    botonesTalla.forEach((boton, idx) => {
        console.log(`[DIAGNÓSTICO] Botón #${idx+1}: Talla ${boton.textContent.trim()}`);
        console.log(`[DIAGNÓSTICO] Clases iniciales: ${boton.className}`);
        
        // Monitorear cambios en las clases de este botón
        observador.observe(boton, { attributes: true });
    });
    
    // Monitorear clics en botones de añadir al carrito
    const botonesCarrito = document.querySelectorAll('.btn-add-cart, .btn-agregar-carrito, .add-to-cart');
    console.log(`[DIAGNÓSTICO] Se encontraron ${botonesCarrito.length} botones de agregar al carrito`);
    
    botonesCarrito.forEach((boton, idx) => {
        boton.addEventListener('click', function() {
            console.log(`[DIAGNÓSTICO] Se hizo clic en el botón de carrito #${idx+1}`);
            
            // Buscar el contenedor del producto
            const contenedor = boton.closest('.producto-card, .card-producto, .product-card');
            if (!contenedor) {
                console.log(`[DIAGNÓSTICO] ❌ No se encontró contenedor para el botón de carrito #${idx+1}`);
                return;
            }
            
            // Buscar botones de talla en este contenedor específico
            const tallasContainer = contenedor.querySelector('.producto-tallas, .tallas-list');
            if (!tallasContainer) {
                console.log(`[DIAGNÓSTICO] ❌ No se encontró contenedor de tallas para el producto`);
                return;
            }
            
            const botonesTallaProducto = tallasContainer.querySelectorAll('.talla-btn');
            console.log(`[DIAGNÓSTICO] Botones de talla en este producto: ${botonesTallaProducto.length}`);
            
            // Verificar si hay alguna talla seleccionada
            const tallaSeleccionada = tallasContainer.querySelector('.talla-btn.selected, .talla-btn.active');
            
            if (tallaSeleccionada) {
                console.log(`[DIAGNÓSTICO] ✅ Talla seleccionada: ${tallaSeleccionada.textContent.trim()}`);
                console.log(`[DIAGNÓSTICO] Clases del botón seleccionado: ${tallaSeleccionada.className}`);
            } else {
                console.log(`[DIAGNÓSTICO] ❌ No hay talla seleccionada para este producto`);
                
                // Mostrar estado de todos los botones de talla en este producto
                botonesTallaProducto.forEach((btn, i) => {
                    console.log(`[DIAGNÓSTICO] Botón talla #${i+1}: ${btn.textContent.trim()} - Clases: ${btn.className}`);
                });
            }
        });
    });
    
    console.log("[DIAGNÓSTICO] Script de diagnóstico de tallas cargado correctamente");
    console.log("===================================");
});
