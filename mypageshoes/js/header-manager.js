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
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    // Buscar el elemento de login/perfil
    let headerLogin = headerActions.querySelector('.header-login, .header-user-menu');
    
    if (this.currentUser) {
      // Usuario logueado
      this.renderLoggedInState(headerActions, headerLogin);
    } else {
      // Usuario no logueado
      this.renderLoggedOutState(headerActions, headerLogin);
    }
  }

  /**
   * Renderizar estado de usuario logueado
   */
  renderLoggedInState(headerActions, existingElement) {
    const userName = this.currentUser.displayName || this.currentUser.email.split('@')[0];
    
    // Si ya existe el menu de usuario, no hacer nada
    if (existingElement && existingElement.classList.contains('header-user-menu')) {
      return;
    }
    
    // Crear nuevo elemento de usuario logueado
    const userMenuHTML = `
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
    
    // Reemplazar el elemento existente
    if (existingElement) {
      existingElement.outerHTML = userMenuHTML;
    } else {
      // Insertar antes del botón de carrito
      const btnCarrito = headerActions.querySelector('#btn-carrito, .btn-carrito');
      if (btnCarrito) {
        btnCarrito.insertAdjacentHTML('beforebegin', userMenuHTML);
      }
    }
    
    // Configurar el event listener para el botón de logout recién creado
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  /**
   * Renderizar estado de usuario no logueado
   */
  renderLoggedOutState(headerActions, existingElement) {
    // Si ya existe el enlace de login correcto, no hacer nada
    if (existingElement && existingElement.classList.contains('header-login')) {
      return;
    }
    
    // Crear nuevo elemento de login
    const loginHTML = `
      <a href="${this.getBasePath()}login.html" class="header-login">
        <i class="fa-regular fa-user"></i>
        <span>Iniciar sesión</span>
      </a>
    `;
    
    // Reemplazar el elemento existente
    if (existingElement) {
      existingElement.outerHTML = loginHTML;
    } else {
      // Insertar antes del botón de carrito
      const btnCarrito = headerActions.querySelector('#btn-carrito, .btn-carrito');
      if (btnCarrito) {
        btnCarrito.insertAdjacentHTML('beforebegin', loginHTML);
      }
    }
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
    // Event listener para cerrar sesión (delegación de eventos como respaldo)
    document.addEventListener('click', (e) => {
      const logoutBtn = e.target.closest('#btn-logout');
      if (logoutBtn) {
        e.preventDefault();
        e.stopPropagation();
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
