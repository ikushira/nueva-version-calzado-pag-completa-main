/**
 * cart-fix-complete.js
 * Script para asegurar que el carrito funcione correctamente
 */

(function() {
    'use strict';
    
    console.log('🔧 Iniciando fix completo del carrito');
    
    // Esperar a que el DOM y cart-manager estén listos
    function initCartFix() {
        if (!window.cartManager) {
            console.log('⏳ Esperando cartManager...');
            setTimeout(initCartFix, 100);
            return;
        }
        
        console.log('✅ CartManager detectado, aplicando fixes');
        
        // Fix 1: Forzar actualización de UI
        setTimeout(() => {
            if (window.cartManager && window.cartManager.cart) {
                console.log(`📦 Carrito tiene ${window.cartManager.cart.length} productos`);
                window.cartManager.updateUI();
            }
        }, 500);
        
        // Fix 2: Mejorar feedback visual de botones
        document.addEventListener('click', function(e) {
            const btnAdd = e.target.closest('.btn-add-cart, .btn-agregar-carrito');
            if (btnAdd) {
                console.log('🎯 Botón agregar al carrito clickeado');
                
                // Agregar clase de feedback inmediatamente
                btnAdd.classList.add('agregado');
                const originalHTML = btnAdd.innerHTML;
                const originalBg = btnAdd.style.backgroundColor;
                
                // Cambiar a verde con check
                btnAdd.innerHTML = '<i class="fas fa-check"></i> Agregado';
                btnAdd.style.backgroundColor = '#28a745';
                btnAdd.style.transform = 'scale(0.95)';
                
                // Restaurar después de 2 segundos
                setTimeout(() => {
                    btnAdd.classList.remove('agregado');
                    btnAdd.innerHTML = originalHTML;
                    btnAdd.style.backgroundColor = originalBg;
                    btnAdd.style.transform = '';
                }, 2000);
            }
        });
        
        // Fix 3: Asegurar que el badge se actualice
        const originalAddProduct = window.cartManager.addProduct.bind(window.cartManager);
        window.cartManager.addProduct = function(...args) {
            const result = originalAddProduct(...args);
            
            // Forzar actualización del badge
            setTimeout(() => {
                const badge = document.getElementById('carrito-cantidad');
                if (badge && window.cartManager) {
                    const total = window.cartManager.getTotalItems();
                    badge.textContent = total;
                    badge.style.display = total > 0 ? 'flex' : 'none';
                    console.log(`🔢 Badge actualizado: ${total} items`);
                }
            }, 100);
            
            return result;
        };
        
        // Fix 4: Debug de productos en carrito
        window.verCarrito = function() {
            if (window.cartManager) {
                console.log('🛒 Contenido del carrito:');
                console.table(window.cartManager.cart);
                console.log(`Total items: ${window.cartManager.getTotalItems()}`);
                console.log(`Subtotal: $${window.cartManager.getSubtotal().toLocaleString('es-CO')}`);
                console.log(`Envío: $${window.cartManager.getShippingCost().toLocaleString('es-CO')}`);
                console.log(`Total: $${window.cartManager.getTotal().toLocaleString('es-CO')}`);
            }
        };
        
        // Fix 5: Función de limpieza
        window.limpiarCarrito = function() {
            if (window.cartManager) {
                window.cartManager.clearCart();
                console.log('🗑️ Carrito limpiado');
            }
        };
        
        console.log('✅ Fixes del carrito aplicados');
        console.log('💡 Usa verCarrito() en consola para ver el contenido');
        console.log('💡 Usa limpiarCarrito() para vaciar el carrito');
    }
    
    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartFix);
    } else {
        initCartFix();
    }
})();
