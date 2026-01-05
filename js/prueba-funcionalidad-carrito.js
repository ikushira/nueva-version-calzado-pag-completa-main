// prueba-funcionalidad-carrito.js
// Script para probar la funcionalidad del carrito

document.addEventListener('DOMContentLoaded', function() {
    // Crear panel de diagnóstico
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.zIndex = '9999';
    panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    panel.style.color = '#fff';
    panel.style.padding = '15px';
    panel.style.borderRadius = '5px';
    panel.style.maxWidth = '400px';
    panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    panel.style.fontSize = '14px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.innerHTML = `
        <h3 style="margin-top: 0; color: #4CAF50;">Prueba de Carrito v2.0</h3>
        <div id="carrito-funciones-check">Verificando funciones...</div>
        <div id="carrito-estado">Verificando estado del carrito...</div>
        <div style="margin-top: 10px;">
            <button id="btn-probar-carrito" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">Probar Añadir Producto</button>
            <button id="btn-limpiar-carrito" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Limpiar Carrito</button>
        </div>
    `;
    document.body.appendChild(panel);
    
    // Verificar funciones del carrito
    const funcionesCheck = document.getElementById('carrito-funciones-check');
    let html = '<ul style="padding-left: 20px; margin: 5px 0;">';
    
    // Verificar disponibilidad de funciones críticas
    const funciones = [
        { nombre: 'carrito global', verificacion: () => typeof window.carrito !== 'undefined' },
        { nombre: 'agregarProductoUnaVez', verificacion: () => typeof window.agregarProductoUnaVez === 'function' },
        { nombre: 'aplicarCorreccionTarjetas', verificacion: () => typeof window.aplicarCorreccionTarjetas === 'function' },
        { nombre: 'actualizarCantidadCarrito', verificacion: () => typeof window.actualizarCantidadCarrito === 'function' }
    ];
    
    funciones.forEach(funcion => {
        const disponible = funcion.verificacion();
        html += `<li>${funcion.nombre}: ${disponible ? '✅' : '❌'}</li>`;
    });
    
    html += '</ul>';
    funcionesCheck.innerHTML = html;
    
    // Verificar estado del carrito
    function actualizarEstadoCarrito() {
        const estadoElement = document.getElementById('carrito-estado');
        const carrito = window.carrito || [];
        
        let estadoHtml = '<div style="margin-top: 10px;">';
        estadoHtml += `<div>Total productos: <strong>${carrito.length}</strong></div>`;
        
        if (carrito.length > 0) {
            estadoHtml += '<ul style="padding-left: 20px; margin: 5px 0; max-height: 150px; overflow-y: auto;">';
            carrito.forEach(item => {
                estadoHtml += `<li>${item.nombre} (${item.talla}) - Cantidad: ${item.cantidad}</li>`;
            });
            estadoHtml += '</ul>';
        } else {
            estadoHtml += '<div style="font-style: italic; opacity: 0.7;">El carrito está vacío</div>';
        }
        
        estadoHtml += '</div>';
        estadoElement.innerHTML = estadoHtml;
    }
    
    // Actualizar estado inicial
    actualizarEstadoCarrito();
    
    // Botón de prueba para añadir un producto
    document.getElementById('btn-probar-carrito').addEventListener('click', function() {
        // Crear un producto de prueba
        const productoTest = {
            id: `test-${Date.now()}`,
            nombre: 'Producto de Prueba',
            precio: 99900,
            talla: '39',
            cantidad: 1,
            imagen: 'assets/img/zapato1.jpeg'
        };
        
        // Intentar agregar el producto
        let resultado = false;
        
        if (typeof window.agregarProductoUnaVez === 'function') {
            resultado = window.agregarProductoUnaVez(productoTest);
            console.log("Producto agregado usando agregarProductoUnaVez:", resultado);
        } else if (typeof window.carrito !== 'undefined') {
            window.carrito.push(productoTest);
            localStorage.setItem('carrito', JSON.stringify(window.carrito));
            if (typeof window.actualizarCantidadCarrito === 'function') {
                window.actualizarCantidadCarrito();
            }
            resultado = true;
            console.log("Producto agregado manualmente al carrito");
        } else {
            console.error("No se pudo agregar el producto: función no disponible");
        }
        
        // Mostrar resultado
        if (resultado) {
            this.style.backgroundColor = '#4CAF50';
            this.textContent = '✅ Producto Agregado';
            setTimeout(() => {
                this.style.backgroundColor = '#4CAF50';
                this.textContent = 'Probar Añadir Producto';
            }, 2000);
        } else {
            this.style.backgroundColor = '#f44336';
            this.textContent = '❌ Error al Agregar';
            setTimeout(() => {
                this.style.backgroundColor = '#4CAF50';
                this.textContent = 'Probar Añadir Producto';
            }, 2000);
        }
        
        // Actualizar visualización del estado
        actualizarEstadoCarrito();
    });
    
    // Botón para limpiar el carrito
    document.getElementById('btn-limpiar-carrito').addEventListener('click', function() {
        // Limpiar el carrito
        if (typeof window.carrito !== 'undefined') {
            window.carrito = [];
            localStorage.setItem('carrito', JSON.stringify(window.carrito));
            if (typeof window.actualizarCantidadCarrito === 'function') {
                window.actualizarCantidadCarrito();
            }
            
            this.style.backgroundColor = '#4CAF50';
            this.textContent = '✅ Carrito Limpiado';
            setTimeout(() => {
                this.style.backgroundColor = '#f44336';
                this.textContent = 'Limpiar Carrito';
            }, 2000);
            
            // Actualizar visualización del estado
            actualizarEstadoCarrito();
        } else {
            this.style.backgroundColor = '#f44336';
            this.textContent = '❌ Error: Carrito no disponible';
            setTimeout(() => {
                this.style.backgroundColor = '#f44336';
                this.textContent = 'Limpiar Carrito';
            }, 2000);
        }
    });
});
