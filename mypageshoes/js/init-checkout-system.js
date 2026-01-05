// init-checkout-system.js - Script de inicialización del sistema de checkout
(function() {
    'use strict';

    console.log('🚀 Inicializando Sistema de Checkout - Mundo Calzado');

    // Verificar que todos los scripts necesarios estén cargados
    function checkDependencies() {
        const requiredClasses = [
            'CheckoutManager',
            'PaymentGateway', 
            'AddiIntegration',
            'UserProfileManager'
        ];

        const missing = requiredClasses.filter(className => !window[className]);
        
        if (missing.length > 0) {
            console.error('❌ Scripts faltantes:', missing);
            return false;
        }

        console.log('✅ Todos los scripts están cargados');
        return true;
    }

    // Inicializar sistema cuando el DOM esté listo
    function initializeSystem() {
        if (!checkDependencies()) {
            console.error('❌ No se puede inicializar el sistema - scripts faltantes');
            return;
        }

        try {
            // Verificar que estemos en la página de checkout
            if (window.location.pathname.includes('checkout.html')) {
                console.log('📄 Página de checkout detectada');
                
                // El CheckoutManager se inicializa automáticamente
                // pero podemos hacer verificaciones adicionales aquí
                
                setTimeout(() => {
                    if (window.CheckoutManager) {
                        console.log('✅ CheckoutManager inicializado');
                    }
                }, 100);
            }

            // Inicializar componentes globales
            if (window.UserProfileManager) {
                console.log('✅ UserProfileManager inicializado');
            }

            if (window.PaymentGateway) {
                console.log('✅ PaymentGateway inicializado');
            }

            if (window.AddiIntegration) {
                console.log('✅ AddiIntegration inicializado');
            }

            // Configurar eventos globales
            setupGlobalEvents();

            console.log('🎉 Sistema de checkout inicializado correctamente');

        } catch (error) {
            console.error('❌ Error al inicializar sistema:', error);
        }
    }

    // Configurar eventos globales
    function setupGlobalEvents() {
        // Escuchar cambios en el usuario
        window.addEventListener('storage', (e) => {
            if (e.key === 'usuarioActual') {
                console.log('👤 Cambio de usuario detectado');
                // Recargar datos si es necesario
            }
        });

        // Escuchar cambios en el carrito
        window.addEventListener('storage', (e) => {
            if (e.key === 'carrito') {
                console.log('🛒 Cambio en carrito detectado');
                // Actualizar contadores si es necesario
                if (typeof actualizarCantidadCarrito === 'function') {
                    actualizarCantidadCarrito();
                }
            }
        });

        // Manejar errores no capturados
        window.addEventListener('error', (e) => {
            console.error('❌ Error global:', e.error);
        });

        // Manejar promesas rechazadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Promise rechazada:', e.reason);
        });
    }

    // Función para mostrar estado del sistema
    window.showCheckoutSystemStatus = function() {
        console.log('📊 Estado del Sistema de Checkout:');
        console.log('─'.repeat(50));
        
        const components = [
            { name: 'CheckoutManager', instance: window.CheckoutManager },
            { name: 'PaymentGateway', instance: window.PaymentGateway },
            { name: 'AddiIntegration', instance: window.AddiIntegration },
            { name: 'UserProfileManager', instance: window.UserProfileManager }
        ];

        components.forEach(comp => {
            const status = comp.instance ? '✅ Activo' : '❌ Inactivo';
            console.log(`${comp.name}: ${status}`);
        });

        // Mostrar datos del usuario actual
        const currentUser = localStorage.getItem('usuarioActual');
        console.log(`Usuario: ${currentUser ? '✅ Logueado' : '❌ No logueado'}`);

        // Mostrar items en carrito
        const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
        console.log(`Carrito: ${cart.length} productos`);

        console.log('─'.repeat(50));
    };

    // Función para limpiar datos del sistema
    window.resetCheckoutSystem = function(confirm = false) {
        if (!confirm) {
            console.log('⚠️  Para limpiar el sistema usa: resetCheckoutSystem(true)');
            return;
        }

        console.log('🗑️  Limpiando datos del sistema...');
        
        const keysToRemove = [
            'carrito',
            'usuarioActual',
            'orders'
        ];

        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });

        // También limpiar datos específicos por usuario
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('orders_') || 
                key.startsWith('payment_methods_') || 
                key.startsWith('addresses_')) {
                localStorage.removeItem(key);
            }
        });

        console.log('✅ Sistema limpiado');
        location.reload();
    };

    // Función de debug para simular compra
    window.debugSimulatePurchase = function() {
        if (!window.location.pathname.includes('checkout.html')) {
            console.log('⚠️  Esta función solo funciona en checkout.html');
            return;
        }

        console.log('🧪 Simulando compra de prueba...');

        // Agregar productos de prueba al carrito
        const testProducts = [
            {
                id: 'test_1',
                nombre: 'Zapato de Prueba 1',
                precio: 120000,
                talla: '39',
                cantidad: 1,
                imagen: './assets/img/placeholder.jpg'
            },
            {
                id: 'test_2', 
                nombre: 'Zapato de Prueba 2',
                precio: 80000,
                talla: '40',
                cantidad: 1,
                imagen: './assets/img/placeholder.jpg'
            }
        ];

        localStorage.setItem('carrito', JSON.stringify(testProducts));

        // Crear usuario de prueba
        const testUser = {
            email: 'test@mundocalzado.com',
            nombre: 'Usuario',
            apellido: 'Prueba',
            telefono: '3001234567',
            direccion: 'Calle 123 #45-67',
            ciudad: 'Cali',
            departamento: 'valle'
        };

        localStorage.setItem('usuarioActual', JSON.stringify(testUser));

        console.log('✅ Datos de prueba creados');
        location.reload();
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSystem);
    } else {
        initializeSystem();
    }

    // También inicializar después de que todos los scripts se hayan cargado
    window.addEventListener('load', () => {
        setTimeout(initializeSystem, 500);
    });

})();
