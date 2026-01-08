/**
 * tarjetas-system.js
 * Sistema para gestionar la página de tarjetas (información de seguridad)
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
        setupEventListeners();
    }

    function setupEventListeners() {
        const btnSalir = document.getElementById('btn-salir-tarjetas');
        if (btnSalir) {
            btnSalir.addEventListener('click', cerrarSesion);
        }
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
