// Función para cerrar sesión usando gestor unificado
function cerrarSesion() {
    if (window.gestorUsuarios) {
        window.gestorUsuarios.cerrarSesion();
    } else {
        // Fallback
        localStorage.removeItem('usuarioActivo');
        localStorage.removeItem('usuarioActual');
        localStorage.removeItem('perfilUsuario');
    }
    window.location.href = 'login.html';
}

// Verificar si hay una sesión activa y proteger las páginas que requieren autenticación
document.addEventListener('DOMContentLoaded', function() {
    // Agregar manejador para el botón de salir
    const btnSalir = document.querySelector('.cuenta-menu li:last-child, .menu-cuenta li:last-child');
    if (btnSalir) {
        btnSalir.style.cursor = 'pointer';
        btnSalir.addEventListener('click', cerrarSesion);
    }
    // Obtener usuario activo usando gestor unificado
    let usuarioActivo = null;
    let perfilUsuario = null;
    
    if (window.gestorUsuarios) {
        usuarioActivo = window.gestorUsuarios.obtenerUsuarioActivo();
        if (usuarioActivo && usuarioActivo.email) {
            perfilUsuario = window.gestorUsuarios.obtenerUsuarioPorEmail(usuarioActivo.email);
        }
    } else {
        // Fallback para compatibilidad
        const usuarioActivoStr = localStorage.getItem('usuarioActivo') || localStorage.getItem('usuarioActual');
        if (usuarioActivoStr) {
            try {
                usuarioActivo = JSON.parse(usuarioActivoStr);
            } catch (e) {
                console.error('Error al parsear usuario activo:', e);
            }
        }
        
        const perfilData = localStorage.getItem('usuariosRegistrados');
        if (perfilData && usuarioActivo) {
            try {
                const perfiles = JSON.parse(perfilData);
                perfilUsuario = perfiles.find(p => p.email === usuarioActivo.email);
            } catch (e) {
                console.error('Error al parsear perfiles:', e);
            }
        }
    }
    const paginasProtegidas = ['cuenta.html', 'editar_perfil.html', 'direccion_cuenta.html'];
    
    const paginaActual = window.location.pathname.split('/').pop();
    
    if (paginasProtegidas.includes(paginaActual)) {
        if (!usuarioActivo) {
            // Si no hay usuario activo, redirigir al login
            window.location.href = 'login.html';
            return;
        }
    }

    // Si estamos en la página de login y hay un usuario activo, redirigir a la cuenta
    if (paginaActual === 'login.html' && usuarioActivo) {
        window.location.href = 'cuenta.html';
        return;
    }

    // Actualizar la interfaz si hay un usuario activo
    if (usuarioActivo) {
        // Actualizar nombre de usuario en el encabezado
        const welcomeEl = document.querySelector('.cuenta-bienvenida');
        if (welcomeEl && perfilUsuario) {
            const nombreCompleto = perfilUsuario.nombre && perfilUsuario.apellido 
                ? `${perfilUsuario.nombre} ${perfilUsuario.apellido}`
                : perfilUsuario.nombre || usuarioActivo.name || 'Usuario';
            welcomeEl.textContent = `¡Hola, ${nombreCompleto}!`;
        } else if (welcomeEl && usuarioActivo.name) {
            welcomeEl.textContent = `¡Hola, ${usuarioActivo.name}!`;
        }
        
        // Actualizar datos del perfil si estamos en la página de cuenta
        if (paginaActual === 'cuenta.html' && perfilUsuario) {
            const elementos = {
                'perfil-nombre': perfilUsuario.nombre,
                'perfil-apellido': perfilUsuario.apellido,
                'perfil-email': perfilUsuario.email,
                'perfil-cedula': perfilUsuario.cedula,
                'perfil-telefono': perfilUsuario.telefono,
                'perfil-genero': perfilUsuario.genero,
                'perfil-fecha': perfilUsuario.fecha,
                'perfil-boletin': perfilUsuario.boletin ? 'Sí' : 'No',
                'perfil-nit': perfilUsuario.nit,
                'perfil-razon': perfilUsuario.razon
            };
            
            // Actualizar cada elemento si existe
            Object.entries(elementos).forEach(([id, valor]) => {
                const el = document.getElementById(id);
                if (el && valor) el.textContent = valor;
            });
            
            // Mostrar campos de persona jurídica si aplica
            if (perfilUsuario.nit || perfilUsuario.razon) {
                const juridicaEl = document.getElementById('perfil-juridica');
                if (juridicaEl) juridicaEl.style.display = 'block';
            }
        }
    }
});
