/**
 * cookie-consent.js
 * Banner de consentimiento de cookies y remember me
 */

class CookieConsent {
  constructor() {
    this.consentKey = 'cookies_consent';
    this.preferencesKey = 'cookie_preferences';
    this.init();
  }

  init() {
    // Verificar si ya dio consentimiento
    if (!this.hasConsent()) {
      this.showBanner();
    } else {
      this.enableFeatures();
    }
  }

  hasConsent() {
    return localStorage.getItem(this.consentKey) === 'true';
  }

  getPreferences() {
    const prefs = localStorage.getItem(this.preferencesKey);
    return prefs ? JSON.parse(prefs) : {
      necessary: true,
      analytics: false,
      marketing: false
    };
  }

  saveConsent(accepted, preferences = null) {
    localStorage.setItem(this.consentKey, accepted.toString());
    
    if (preferences) {
      localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
    } else if (accepted) {
      // Si acepta todo, habilitar todo
      localStorage.setItem(this.preferencesKey, JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true
      }));
    }

    if (accepted) {
      this.enableFeatures();
    }
  }

  enableFeatures() {
    const prefs = this.getPreferences();
    
    // Habilitar remember me si acepta cookies
    if (prefs.necessary) {
      this.enableRememberMe();
    }

    // Habilitar analytics si acepta
    if (prefs.analytics) {
      console.log('📊 Analytics habilitado');
      // Aquí se integraría Google Analytics
    }

    // Habilitar marketing si acepta
    if (prefs.marketing) {
      console.log('📢 Marketing cookies habilitado');
      // Aquí se integrarían Facebook Pixel, etc.
    }
  }

  enableRememberMe() {
    // Persistir sesión de usuario si existe
    const userData = sessionStorage.getItem('userData');
    if (userData && !localStorage.getItem('userData')) {
      localStorage.setItem('userData', userData);
      console.log('✅ Remember me habilitado');
    }
  }

  showBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <h3>🍪 Cookies y Privacidad</h3>
          <p>Usamos cookies para mejorar tu experiencia de compra, recordar tu sesión y analizar el uso del sitio. 
          Al hacer clic en "Aceptar", aceptas el uso de cookies según nuestra 
          <a href="pages/politicas.html" target="_blank">Política de Privacidad</a>.</p>
        </div>
        <div class="cookie-banner-actions">
          <button id="cookie-reject" class="cookie-btn cookie-btn-secondary">Rechazar</button>
          <button id="cookie-preferences" class="cookie-btn cookie-btn-secondary">Preferencias</button>
          <button id="cookie-accept" class="cookie-btn cookie-btn-primary">Aceptar Todas</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    this.bindBannerEvents();

    // Animar entrada
    setTimeout(() => banner.classList.add('show'), 100);
  }

  showPreferences() {
    const modal = document.createElement('div');
    modal.id = 'cookie-preferences-modal';
    modal.className = 'cookie-modal';
    
    const currentPrefs = this.getPreferences();
    
    modal.innerHTML = `
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h3>Preferencias de Cookies</h3>
          <button class="cookie-modal-close" id="close-preferences">&times;</button>
        </div>
        <div class="cookie-modal-body">
          <div class="cookie-preference-item">
            <div class="cookie-preference-info">
              <h4>Cookies Necesarias</h4>
              <p>Esenciales para el funcionamiento del sitio. Incluyen carrito de compras y sesión de usuario.</p>
            </div>
            <input type="checkbox" checked disabled>
          </div>
          
          <div class="cookie-preference-item">
            <div class="cookie-preference-info">
              <h4>Cookies de Análisis</h4>
              <p>Nos ayudan a entender cómo usas el sitio para mejorarlo.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="analytics-toggle" ${currentPrefs.analytics ? 'checked' : ''}>
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
          
          <div class="cookie-preference-item">
            <div class="cookie-preference-info">
              <h4>Cookies de Marketing</h4>
              <p>Usadas para mostrarte anuncios relevantes y medir campañas.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="marketing-toggle" ${currentPrefs.marketing ? 'checked' : ''}>
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button id="save-preferences" class="cookie-btn cookie-btn-primary">Guardar Preferencias</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);

    // Event listeners
    document.getElementById('close-preferences').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });

    document.getElementById('save-preferences').addEventListener('click', () => {
      const preferences = {
        necessary: true,
        analytics: document.getElementById('analytics-toggle').checked,
        marketing: document.getElementById('marketing-toggle').checked
      };
      this.saveConsent(true, preferences);
      this.removeBanner();
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
  }

  bindBannerEvents() {
    document.getElementById('cookie-accept').addEventListener('click', () => {
      this.saveConsent(true);
      this.removeBanner();
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
      this.saveConsent(false, {
        necessary: true,
        analytics: false,
        marketing: false
      });
      this.removeBanner();
    });

    document.getElementById('cookie-preferences').addEventListener('click', () => {
      this.showPreferences();
    });
  }

  removeBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 300);
    }
  }
}

// Sistema de Remember Me para login
class RememberMeSystem {
  constructor() {
    this.init();
  }

  init() {
    // Agregar checkbox de remember me al formulario de login si existe
    const loginForm = document.querySelector('form[action*="login"]');
    if (loginForm && !document.getElementById('remember-me')) {
      this.addRememberMeCheckbox(loginForm);
    }

    // Restaurar sesión si existe y cookies aceptadas
    this.restoreSession();
  }

  addRememberMeCheckbox(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      const rememberDiv = document.createElement('div');
      rememberDiv.className = 'remember-me-container';
      rememberDiv.innerHTML = `
        <label style="display: flex; align-items: center; gap: 8px; margin: 15px 0; cursor: pointer;">
          <input type="checkbox" id="remember-me" name="remember">
          <span>Recordarme en este dispositivo</span>
        </label>
      `;
      submitButton.parentNode.insertBefore(rememberDiv, submitButton);
    }
  }

  restoreSession() {
    const cookieConsent = new CookieConsent();
    if (cookieConsent.hasConsent()) {
      const userData = localStorage.getItem('userData');
      if (userData && !sessionStorage.getItem('userData')) {
        sessionStorage.setItem('userData', userData);
        console.log('✅ Sesión restaurada desde localStorage');
      }
    }
  }

  saveSession(userData, remember) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    if (remember) {
      const cookieConsent = new CookieConsent();
      if (cookieConsent.hasConsent()) {
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('✅ Sesión guardada con remember me');
      }
    }
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsent();
  window.rememberMeSystem = new RememberMeSystem();
});

// Exportar para uso global
window.CookieConsent = CookieConsent;
window.RememberMeSystem = RememberMeSystem;
