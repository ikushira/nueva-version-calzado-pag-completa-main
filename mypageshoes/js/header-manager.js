/**
 * header-manager.js
 * Gestiona el estado del header según la sesión del usuario
 * Actualiza enlaces y muestra/oculta elementos basado en autenticación
 */

class HeaderManager {
  constructor() {
    this.currentUser = null;
    this.initialized = false;
  }

  /**
   * Inicializa el header manager
   */
  init() {
    if (this.initialized) return;

    console.log('🎯 Inicializando Header Manager');
    
    // Cargar estado de sesión
    this.loadSession();
    
    // Actualizar UI del header
    this.updateHeaderUI();
    
    // Configurar event listeners
    this.setupEventListeners();
    
    this.initialized = true;
    console.log('✅ Header Manager inicializado');
  }

  /**
   * Cargar sesión del usuario desde localStorage
   */
  loadSession() {
    // Intentar cargar de cualquier fuente de sesión
    const usuarioActual = localStorage.getItem('usuarioActual');
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    const currentUser = localStorage.getItem('currentUser');
    
    if (usuarioActual) {
      try {
        this.currentUser = JSON.parse(usuarioActual);
        console.log('👤 Usuario logueado:', this.currentUser.email);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      }
    } else if (usuarioActivo) {
      try {
        this.currentUser = JSON.parse(usuarioActivo);
        console.log('👤 Usuario logueado:', this.currentUser.email);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      }
    } else if (currentUser) {
      try {
        this.currentUser = JSON.parse(currentUser);
        console.log('👤 Usuario logueado:', this.currentUser.email);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      }
    }
  }

  /**
   * Actualizar UI del header según estado de sesión
   */
  updateHeaderUI() {
    const headerLogin = document.querySelector('.header-login');
    if (!headerLogin) return;

    if (this.currentUser) {
      // Usuario logueado
      this.renderLoggedInState(headerLogin);
    } else {
      // Usuario no logueado
      this.renderLoggedOutState(headerLogin);
    }
  }

  /**
   * Renderizar estado de usuario logueado
   */
  renderLoggedInState(container) {
    const userName = this.currentUser.displayName || this.currentUser.email.split('@')[0];
    
    container.innerHTML = `
      <div class="header-user-menu">
        <a href="${this.getBasePath()}cuenta.html" class="header-profile">
          <i class="fa-regular fa-user"></i>
          <span>Mi perfil</span>
        </a>
        <button id="btn-logout" class="header-logout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    `;
  }

  /**
   * Renderizar estado de usuario no logueado
   */
  renderLoggedOutState(container) {
    container.innerHTML = `
      <a href="${this.getBasePath()}login.html" class="header-login-link">
        <i class="fa-regular fa-user"></i>
        <span>Iniciar sesión</span>
      </a>
    `;
  }

  /**
   * Obtener ruta base según la ubicación de la página
   */
  getBasePath() {
    const currentPath = window.location.pathname;
    
    // Si estamos en index.html (root)
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
      return 'mypageshoes/';
    }
    
    // Si estamos en mypageshoes/
    if (currentPath.includes('mypageshoes/')) {
      return './';
    }
    
    return 'mypageshoes/';
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Event listener para cerrar sesión (delegación de eventos)
    document.addEventListener('click', (e) => {
      if (e.target.closest('#btn-logout')) {
        e.preventDefault();
        this.logout();
      }
    });
  }

  /**
   * Cerrar sesión del usuario
   */
  logout() {
    if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      return;
    }

    console.log('👋 Cerrando sesión...');
    
    // Limpiar todas las fuentes de sesión
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('perfilUsuario');
    
    this.currentUser = null;
    
    // Redirigir a login
    window.location.href = 'login.html';
  }

  /**
   * Limpiar sesión
   */
  clearSession() {
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('perfilUsuario');
    this.currentUser = null;
  }

  /**
   * Establecer sesión de usuario
   */
  setSession(userData) {
    this.currentUser = userData;
    localStorage.setItem('usuarioActual', JSON.stringify(userData));
    this.updateHeaderUI();
  }

  /**
   * Verificar si el usuario está logueado
   */
  isLoggedIn() {
    return this.currentUser !== null;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.currentUser;
  }
}

// Crear instancia global
const headerManager = new HeaderManager();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => headerManager.init());
} else {
  headerManager.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeaderManager;
}
