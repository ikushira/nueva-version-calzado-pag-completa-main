/**
 * limpiar-carrito-inline.js
 * Script extraído de limpiar-carrito.html
 * Convertido de script inline a archivo separado
 */

(function() {
    'use strict';
    
    // Código original del script inline
    document.addEventListener('DOMContentLoaded', function() {
            // Mostrar contenido actual del carrito
            mostrarInfoCarrito();
            
            // Botón limpiar
            document.getElementById('limpiar').addEventListener('click', function() {
                localStorage.removeItem('carrito');
                document.getElementById('mensaje').style.display = 'block';
                mostrarInfoCarrito();
            });
            
            // Botón volver
            document.getElementById('volver').addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        });
        
        function mostrarInfoCarrito() {
            const carritoInfo = document.getElementById('carrito-info');
            const carrito = localStorage.getItem('carrito');
            
            if (!carrito) {
                carritoInfo.textContent = "No hay información de carrito en localStorage.";
                return;
            }
            
            try {
                const carritoObj = JSON.parse(carrito);
                carritoInfo.textContent = JSON.stringify(carritoObj, null, 2);
            } catch (e) {
                carritoInfo.textContent = "Error al analizar carrito: " + e.message;
            }
        }
    
})();