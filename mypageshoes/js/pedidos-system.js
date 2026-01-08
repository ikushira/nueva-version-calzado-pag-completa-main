/**
 * pedidos-system.js
 * Sistema para gestionar y mostrar los pedidos del usuario
 */

(function() {
    'use strict';

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        cargarPedidos();
        setupEventListeners();
    }

    function setupEventListeners() {
        const btnSalir = document.getElementById('btn-salir-pedidos');
        if (btnSalir) {
            btnSalir.addEventListener('click', cerrarSesion);
        }
    }

    function cargarPedidos() {
        const container = document.getElementById('pedidos-container');
        if (!container) return;

        try {
            // Obtener pedidos del localStorage
            const pedidosStr = localStorage.getItem('pedidos_usuario');
            const pedidos = pedidosStr ? JSON.parse(pedidosStr) : [];

            // Obtener usuario actual
            const usuarioActivo = obtenerUsuarioActivo();
            
            // Filtrar pedidos del usuario actual
            const pedidosUsuario = pedidos.filter(p => 
                usuarioActivo && p.email === usuarioActivo.email
            );

            if (pedidosUsuario.length === 0) {
                // Mostrar mensaje de sin pedidos (ya está en el HTML)
                return;
            }

            // Renderizar pedidos
            container.innerHTML = '';
            pedidosUsuario.reverse().forEach(pedido => {
                container.appendChild(crearPedidoCard(pedido));
            });

        } catch (error) {
            console.error('Error cargando pedidos:', error);
        }
    }

    function crearPedidoCard(pedido) {
        const card = document.createElement('div');
        card.className = 'pedido-card';

        const fecha = new Date(pedido.fecha || Date.now()).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const estadoClass = `estado-${(pedido.estado || 'pendiente').toLowerCase()}`;
        const estadoTexto = pedido.estado || 'Pendiente';

        card.innerHTML = `
            <div class="pedido-header">
                <div class="pedido-numero">Pedido #${pedido.id || 'N/A'}</div>
                <div class="pedido-estado ${estadoClass}">${estadoTexto}</div>
            </div>
            <div class="pedido-body">
                <div class="pedido-info-item">
                    <label>Fecha</label>
                    <span>${fecha}</span>
                </div>
                <div class="pedido-info-item">
                    <label>Total</label>
                    <span>$${(pedido.total || 0).toLocaleString('es-CO')}</span>
                </div>
                <div class="pedido-info-item">
                    <label>Método de pago</label>
                    <span>${pedido.metodoPago || 'Tarjeta'}</span>
                </div>
            </div>
            <div class="pedido-productos">
                <div class="pedido-productos-titulo">Productos (${pedido.productos ? pedido.productos.length : 0})</div>
                ${renderizarProductos(pedido.productos || [])}
            </div>
        `;

        return card;
    }

    function renderizarProductos(productos) {
        if (!productos || productos.length === 0) {
            return '<p style="color: #999; font-size: 14px;">No hay productos en este pedido</p>';
        }

        return productos.map(producto => `
            <div class="pedido-producto-item">
                <img src="${producto.image || producto.imagen || 'assets/img/placeholder.png'}" 
                     alt="${producto.name || producto.nombre}" 
                     class="pedido-producto-imagen"
                     onerror="this.src='assets/img/placeholder.png'">
                <div class="pedido-producto-info">
                    <div class="pedido-producto-nombre">${producto.name || producto.nombre || 'Producto'}</div>
                    <div class="pedido-producto-detalles">
                        Talla: ${producto.size || producto.talla || 'N/A'} | 
                        Cantidad: ${producto.quantity || producto.cantidad || 1} | 
                        $${((producto.price || producto.precio || 0) * (producto.quantity || producto.cantidad || 1)).toLocaleString('es-CO')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function obtenerUsuarioActivo() {
        // Intentar obtener del gestor unificado
        if (window.gestorUsuarios) {
            return window.gestorUsuarios.obtenerUsuarioActivo();
        }

        // Fallback: localStorage tradicional
        const usuarioStr = localStorage.getItem('usuarioActual') || 
                          localStorage.getItem('usuarioActivo') ||
                          localStorage.getItem('currentUser');
        
        return usuarioStr ? JSON.parse(usuarioStr) : null;
    }

    function cerrarSesion() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            // Limpiar sesión
            if (window.gestorUsuarios) {
                window.gestorUsuarios.cerrarSesion();
            } else {
                localStorage.removeItem('usuarioActual');
                localStorage.removeItem('usuarioActivo');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('perfilUsuario');
            }

            // Redirigir al login
            window.location.href = 'login.html';
        }
    }

})();
