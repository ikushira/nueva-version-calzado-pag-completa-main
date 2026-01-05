/**
 * login-system.js
 * Sistema de autenticación para login y registro de usuarios
 * Funciona con el gestor unificado de usuarios
 */

class LoginSystem {
    constructor() {
        this.loginForm = null;
        this.registerForm = null;
        this.showRegisterBtn = null;
        this.showLoginBtn = null;
        this.formTitle = null;
        this.errorMsg = null;
        
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }

    setupElements() {
        // Obtener elementos del DOM
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.showRegisterBtn = document.getElementById('show-register');
        this.showLoginBtn = document.getElementById('show-login');
        this.formTitle = document.getElementById('form-title');
        this.errorMsg = document.getElementById('error-msg');

        // Verificar que existan los elementos necesarios
        if (!this.loginForm || !this.registerForm) {
            console.warn('LoginSystem: No se encontraron los formularios necesarios');
            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        // Toggle entre formularios
        if (this.showRegisterBtn) {
            this.showRegisterBtn.addEventListener('click', () => this.showRegisterForm());
        }

        if (this.showLoginBtn) {
            this.showLoginBtn.addEventListener('click', () => this.showLoginForm());
        }

        // Formularios
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    showRegisterForm() {
        this.loginForm.style.display = 'none';
        this.registerForm.style.display = 'block';
        if (this.formTitle) this.formTitle.textContent = 'Registro de nuevo cliente';
        this.clearError();
    }

    showLoginForm() {
        this.registerForm.style.display = 'none';
        this.loginForm.style.display = 'block';
        if (this.formTitle) this.formTitle.textContent = 'Iniciar sesión';
        this.clearError();
    }

    clearError() {
        if (this.errorMsg) {
            this.errorMsg.textContent = '';
            this.errorMsg.style.color = '';
        }
    }

    showError(message) {
        if (this.errorMsg) {
            this.errorMsg.style.color = '#d32f2f';
            this.errorMsg.textContent = message;
        }
    }

    showSuccess(message) {
        if (this.errorMsg) {
            this.errorMsg.style.color = '#388e3c';
            this.errorMsg.textContent = message;
        }
    }

    // Funciones de compatibilidad para usuarios tradicionales
    getUsers() {
        if (window.gestorUsuarios) {
            return window.gestorUsuarios.obtenerUsuarios();
        }
        // Fallback
        const users = localStorage.getItem('usuarios');
        return users ? JSON.parse(users) : [];
    }

    saveUsers(users) {
        if (window.gestorUsuarios) {
            users.forEach(user => window.gestorUsuarios.agregarUsuario(user));
        } else {
            localStorage.setItem('usuarios', JSON.stringify(users));
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name')?.value.trim() || '';
        const email = document.getElementById('reg-email')?.value.trim() || '';
        const pass = document.getElementById('reg-password')?.value || '';
        const confirm = document.getElementById('reg-confirm')?.value || '';

        // Validaciones básicas
        if (pass !== confirm) {
            this.showError('Las contraseñas no coinciden.');
            return;
        }

        if (!name || !email || !pass) {
            this.showError('Por favor, completa todos los campos.');
            return;
        }

        if (pass.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Por favor, ingresa un email válido.');
            return;
        }

        try {
            // Verificar si el email ya existe usando el gestor
            if (window.gestorUsuarios) {
                const usuarioExistente = window.gestorUsuarios.obtenerUsuarioPorEmail(email);
                if (usuarioExistente) {
                    this.showError('El correo ya está registrado.');
                    return;
                }

                // Crear perfil completo del usuario
                const perfilCompleto = {
                    nombre: name.split(' ')[0] || '',
                    apellido: name.split(' ').slice(1).join(' ') || '',
                    email: email,
                    password: pass,
                    boletin: false,
                    fechaRegistro: new Date().toISOString()
                };

                // Validar datos usando el gestor
                const erroresValidacion = window.gestorUsuarios.validarDatosUsuario(perfilCompleto);
                if (erroresValidacion.length > 0) {
                    this.showError(erroresValidacion[0]); // Mostrar primer error
                    return;
                }

                // Guardar usuario usando el gestor unificado
                const guardadoExitoso = window.gestorUsuarios.agregarUsuario(perfilCompleto);

                if (!guardadoExitoso) {
                    this.showError('Error al registrar el usuario. Inténtalo de nuevo.');
                    return;
                }

                // Establecer usuario activo
                window.gestorUsuarios.establecerUsuarioActivo({
                    name: name,
                    email: email
                });

            } else {
                // Fallback para compatibilidad
                const users = this.getUsers();
                if (users.some(u => u.email === email)) {
                    this.showError('El correo ya está registrado.');
                    return;
                }

                users.push({ name, email, pass });
                this.saveUsers(users);

                const perfilBasico = {
                    nombre: name.split(' ')[0] || '',
                    apellido: name.split(' ').slice(1).join(' ') || '',
                    email: email,
                    boletin: false
                };

                let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
                usuariosRegistrados.push(perfilBasico);
                localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));

                localStorage.setItem('usuarioActivo', JSON.stringify({
                    name: name,
                    email: email
                }));
            }

            this.showSuccess('¡Registro exitoso! Redirigiendo a tu perfil...');
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = 'cuenta.html';
            }, 1500);

        } catch (error) {
            console.error('Error en registro:', error);
            this.showError('Error interno. Por favor, inténtalo de nuevo.');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email')?.value.trim() || '';
        const pass = document.getElementById('login-password')?.value || '';

        if (!email || !pass) {
            this.showError('Por favor, completa todos los campos.');
            return;
        }

        try {
            let usuario = null;

            // Buscar usuario usando el gestor unificado
            if (window.gestorUsuarios) {
                const usuarioRegistrado = window.gestorUsuarios.obtenerUsuarioPorEmail(email);
                if (usuarioRegistrado && usuarioRegistrado.password === pass) {
                    usuario = usuarioRegistrado;
                }
            } else {
                // Fallback: buscar en usuarios tradicionales
                const users = this.getUsers();
                const userTradicional = users.find(u => u.email === email && u.pass === pass);
                if (userTradicional) {
                    usuario = userTradicional;
                }
            }

            if (usuario) {
                this.showSuccess('¡Inicio de sesión exitoso!');

                // Establecer usuario activo usando el gestor
                const datosUsuarioActivo = {
                    name: usuario.name || `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim(),
                    email: usuario.email
                };

                if (window.gestorUsuarios) {
                    window.gestorUsuarios.establecerUsuarioActivo(datosUsuarioActivo);
                } else {
                    localStorage.setItem('usuarioActual', JSON.stringify(datosUsuarioActivo));
                }

                // Verificar si hay redirección pendiente
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');

                // Redirigir según corresponda
                setTimeout(() => {
                    if (redirect === 'checkout') {
                        window.location.href = 'checkout.html';
                    } else {
                        window.location.href = 'cuenta.html';
                    }
                }, 1000);

            } else {
                this.showError('Correo o contraseña incorrectos.');
            }

        } catch (error) {
            console.error('Error en login:', error);
            this.showError('Error interno. Por favor, inténtalo de nuevo.');
        }
    }
}

// Inicializar el sistema de login cuando se carga la página
if (typeof window !== 'undefined') {
    window.loginSystem = new LoginSystem();
}
