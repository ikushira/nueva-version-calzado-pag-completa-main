/**
 * cuenta-system.js
 * Sistema para gestionar la página de cuenta del usuario
 * Carga y muestra la información del perfil del usuario
 */

class CuentaSystem {
    constructor() {
        this.perfilElements = {};
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadUserProfile());
        } else {
            this.loadUserProfile();
        }
    }

    setupElements() {
        // Mapear elementos del perfil
        this.perfilElements = {
            nombre: document.getElementById('perfil-nombre'),
            apellido: document.getElementById('perfil-apellido'),
            email: document.getElementById('perfil-email'),
            boletin: document.getElementById('perfil-boletin'),
            cedula: document.getElementById('perfil-cedula'),
            telefono: document.getElementById('perfil-telefono'),
            genero: document.getElementById('perfil-genero'),
            fecha: document.getElementById('perfil-fecha'),
            nit: document.getElementById('perfil-nit'),
            razon: document.getElementById('perfil-razon'),
            juridica: document.getElementById('perfil-juridica')
        };
    }

    loadUserProfile() {
        this.setupElements();

        try {
            let perfil = null;

            // Intentar obtener datos del gestor unificado primero
            if (window.gestorUsuarios) {
                const usuarioActivo = window.gestorUsuarios.obtenerUsuarioActivo();
                if (usuarioActivo && usuarioActivo.email) {
                    perfil = window.gestorUsuarios.obtenerUsuarioPorEmail(usuarioActivo.email);
                }
            }

            // Fallback: obtener de localStorage tradicional
            if (!perfil) {
                const datos = localStorage.getItem('perfilUsuario');
                if (datos) {
                    perfil = JSON.parse(datos);
                }
            }

            // Si no hay perfil, intentar obtener usuario actual básico
            if (!perfil) {
                const usuarioActual = localStorage.getItem('usuarioActual') || localStorage.getItem('usuarioActivo');
                if (usuarioActual) {
                    const usuario = JSON.parse(usuarioActual);
                    perfil = {
                        nombre: usuario.name ? usuario.name.split(' ')[0] : '',
                        apellido: usuario.name ? usuario.name.split(' ').slice(1).join(' ') : '',
                        email: usuario.email || '',
                        boletin: false
                    };
                }
            }

            if (perfil) {
                this.displayProfile(perfil);
                this.setupBoletinCheckbox(perfil);
            } else {
                console.warn('No se encontró información del perfil de usuario');
                this.redirectToLogin();
            }

        } catch (error) {
            console.error('Error cargando perfil de usuario:', error);
        }
    }

    displayProfile(perfil) {
        // Mostrar información básica
        this.setElementText('nombre', perfil.nombre);
        this.setElementText('apellido', perfil.apellido);
        this.setElementText('email', perfil.email);
        this.setElementText('boletin', perfil.boletin ? 'Sí' : 'No');

        // Mostrar información adicional si existe
        this.setElementText('cedula', perfil.cedula);
        this.setElementText('telefono', perfil.telefono);
        this.setElementText('genero', perfil.genero);
        this.setElementText('fecha', perfil.fecha);

        // Mostrar información jurídica si existe
        if ((perfil.nit && perfil.nit.length > 0) || (perfil.razon && perfil.razon.length > 0)) {
            if (this.perfilElements.juridica) {
                this.perfilElements.juridica.style.display = 'block';
            }
            this.setElementText('nit', perfil.nit);
            this.setElementText('razon', perfil.razon);
        }
    }

    setElementText(elementKey, value) {
        const element = this.perfilElements[elementKey];
        if (element && value) {
            element.textContent = value;
        }
    }

    setupBoletinCheckbox(perfil) {
        const boletinCheck = document.getElementById('boletin');
        if (boletinCheck && typeof perfil.boletin !== 'undefined') {
            boletinCheck.checked = perfil.boletin;
            boletinCheck.disabled = true; // Deshabilitar para mostrar solo el estado actual
            
            // Agregar event listener para futuros cambios si se habilita
            boletinCheck.addEventListener('change', (e) => {
                this.updateBoletinPreference(e.target.checked);
            });
        }
    }

    updateBoletinPreference(enabled) {
        try {
            if (window.gestorUsuarios) {
                const usuarioActivo = window.gestorUsuarios.obtenerUsuarioActivo();
                if (usuarioActivo && usuarioActivo.email) {
                    const perfil = window.gestorUsuarios.obtenerUsuarioPorEmail(usuarioActivo.email);
                    if (perfil) {
                        perfil.boletin = enabled;
                        window.gestorUsuarios.agregarUsuario(perfil); // Actualizar
                        
                        // Actualizar display
                        this.setElementText('boletin', enabled ? 'Sí' : 'No');
                        
                        console.log('Preferencia de boletín actualizada:', enabled);
                    }
                }
            } else {
                // Fallback para localStorage tradicional
                const datos = localStorage.getItem('perfilUsuario');
                if (datos) {
                    const perfil = JSON.parse(datos);
                    perfil.boletin = enabled;
                    localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
                    
                    this.setElementText('boletin', enabled ? 'Sí' : 'No');
                }
            }
        } catch (error) {
            console.error('Error actualizando preferencia de boletín:', error);
        }
    }

    redirectToLogin() {
        // Redirigir al login si no hay usuario logueado
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    // Método para actualizar el perfil (para uso futuro)
    updateProfile(newData) {
        try {
            if (window.gestorUsuarios) {
                const usuarioActivo = window.gestorUsuarios.obtenerUsuarioActivo();
                if (usuarioActivo && usuarioActivo.email) {
                    const perfil = window.gestorUsuarios.obtenerUsuarioPorEmail(usuarioActivo.email);
                    if (perfil) {
                        const perfilActualizado = { ...perfil, ...newData };
                        window.gestorUsuarios.agregarUsuario(perfilActualizado);
                        this.displayProfile(perfilActualizado);
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
        }
        return false;
    }

    // Método para cerrar sesión
    logout() {
        try {
            if (window.gestorUsuarios) {
                window.gestorUsuarios.cerrarSesion();
            } else {
                localStorage.removeItem('usuarioActual');
                localStorage.removeItem('usuarioActivo');
                localStorage.removeItem('perfilUsuario');
            }
            
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error cerrando sesión:', error);
        }
    }
}

// Inicializar el sistema de cuenta
if (typeof window !== 'undefined') {
    window.cuentaSystem = new CuentaSystem();
    
    // Exponer métodos útiles globalmente
    window.updateUserProfile = (data) => window.cuentaSystem.updateProfile(data);
    window.logoutUser = () => window.cuentaSystem.logout();
}
