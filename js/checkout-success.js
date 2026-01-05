/**
 * checkout-success.js
 * Funcionalidad para la página de éxito del checkout
 * Maneja la información del pedido completado y limpia el carrito
 */

class CheckoutSuccess {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSuccessPage());
        } else {
            this.setupSuccessPage();
        }
    }

    setupSuccessPage() {
        try {
            // Obtener parámetros de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('order_id') || this.generateOrderId();
            const amount = urlParams.get('amount') || '0';
            const method = urlParams.get('method') || 'No especificado';
            
            // Actualizar la información en la página
            this.updateOrderInfo(orderId, amount, method);
            
            // Limpiar carrito después de pago exitoso
            this.clearCart();
            
            // Registrar evento de conversión para analytics
            this.trackPurchase(orderId, amount);
            
            // Opcional: Guardar información del pedido
            this.saveOrderInfo(orderId, amount, method);
            
        } catch (error) {
            console.error('Error configurando página de éxito:', error);
        }
    }

    updateOrderInfo(orderId, amount, method) {
        // Actualizar número de orden
        const orderNumberElement = document.getElementById('orderNumber');
        if (orderNumberElement) {
            orderNumberElement.textContent = orderId;
        }

        // Actualizar monto total
        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            const formattedAmount = '$' + new Intl.NumberFormat('es-CO').format(amount);
            totalAmountElement.textContent = formattedAmount;
        }

        // Actualizar método de pago
        const paymentMethodElement = document.getElementById('paymentMethod');
        if (paymentMethodElement) {
            paymentMethodElement.textContent = this.formatPaymentMethod(method);
        }
    }

    formatPaymentMethod(method) {
        // Formatear nombre del método de pago para mejor legibilidad
        const methodMap = {
            'credit_card': 'Tarjeta de Crédito',
            'debit_card': 'Tarjeta de Débito',
            'pse': 'PSE',
            'cash': 'Efectivo',
            'transfer': 'Transferencia Bancaria',
            'addi': 'Addi (Crédito Instantáneo)'
        };

        return methodMap[method] || method;
    }

    clearCart() {
        try {
            // Limpiar carrito de localStorage
            localStorage.removeItem('carrito');
            localStorage.removeItem('carritoItems');
            localStorage.removeItem('carritoTotal');
            
            // Si existe un gestor de carrito global, también limpiarlo
            if (window.carritoManager && typeof window.carritoManager.limpiarCarrito === 'function') {
                window.carritoManager.limpiarCarrito();
            }

            console.log('Carrito limpiado después de compra exitosa');
        } catch (error) {
            console.error('Error limpiando carrito:', error);
        }
    }

    trackPurchase(orderId, amount) {
        try {
            // Google Analytics 4
            if (window.gtag) {
                gtag('event', 'purchase', {
                    transaction_id: orderId,
                    value: parseFloat(amount),
                    currency: 'COP',
                    items: this.getCartItemsForTracking()
                });
            }

            // Facebook Pixel
            if (window.fbq) {
                fbq('track', 'Purchase', {
                    value: parseFloat(amount),
                    currency: 'COP'
                });
            }

            console.log('Evento de compra registrado:', { orderId, amount });
        } catch (error) {
            console.error('Error registrando evento de compra:', error);
        }
    }

    getCartItemsForTracking() {
        // Intentar obtener items del carrito para tracking detallado
        try {
            const cartData = localStorage.getItem('carritoCompletado') || localStorage.getItem('ultimaCompra');
            if (cartData) {
                const cart = JSON.parse(cartData);
                return cart.map(item => ({
                    item_id: item.id || 'unknown',
                    item_name: item.nombre || 'Producto',
                    category: item.categoria || 'Calzado',
                    quantity: item.cantidad || 1,
                    price: item.precio || 0
                }));
            }
        } catch (error) {
            console.error('Error obteniendo items para tracking:', error);
        }
        return [];
    }

    saveOrderInfo(orderId, amount, method) {
        try {
            // Guardar información del pedido para historial del usuario
            const orderInfo = {
                id: orderId,
                amount: parseFloat(amount),
                method: method,
                date: new Date().toISOString(),
                status: 'completed'
            };

            // Obtener historial existente
            let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
            orderHistory.unshift(orderInfo); // Agregar al inicio

            // Limitar historial a últimos 50 pedidos
            if (orderHistory.length > 50) {
                orderHistory = orderHistory.slice(0, 50);
            }

            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
            
            // También guardar como último pedido
            localStorage.setItem('lastOrder', JSON.stringify(orderInfo));

        } catch (error) {
            console.error('Error guardando información del pedido:', error);
        }
    }

    generateOrderId() {
        // Generar ID de orden si no se proporciona
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    // Método para redirigir después de un tiempo
    setupAutoRedirect(seconds = 30) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, seconds * 1000);
    }

    // Método para mostrar información adicional del usuario
    showUserGreeting() {
        try {
            let userName = '';
            
            if (window.gestorUsuarios) {
                const usuarioActivo = window.gestorUsuarios.obtenerUsuarioActivo();
                if (usuarioActivo) {
                    userName = usuarioActivo.name || '';
                }
            } else {
                const usuario = localStorage.getItem('usuarioActual') || localStorage.getItem('usuarioActivo');
                if (usuario) {
                    const user = JSON.parse(usuario);
                    userName = user.name || '';
                }
            }

            if (userName) {
                const greetingElement = document.querySelector('.user-greeting');
                if (greetingElement) {
                    greetingElement.textContent = `¡Gracias por tu compra, ${userName}!`;
                }
            }
        } catch (error) {
            console.error('Error mostrando saludo del usuario:', error);
        }
    }
}

// Inicializar cuando se carga la página
if (typeof window !== 'undefined') {
    window.checkoutSuccess = new CheckoutSuccess();
}
