/**
 * whatsapp-widget.js
 * Botón flotante de WhatsApp con configuración
 */

const WhatsAppWidget = {
  // Configuración (cambiar número por el real)
  config: {
    phoneNumber: '+573001234567', // PLACEHOLDER - Cambiar en producción
    defaultMessage: '¡Hola! Tengo una consulta sobre Mundo Calzado',
    position: 'bottom-left' // bottom-left o bottom-right
  },

  init() {
    this.createButton();
    this.bindEvents();
  },

  createButton() {
    const button = document.createElement('a');
    button.id = 'whatsapp-button';
    button.className = `whatsapp-float ${this.config.position}`;
    button.href = this.getWhatsAppLink();
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.setAttribute('aria-label', 'Contactar por WhatsApp');
    
    button.innerHTML = `
      <svg viewBox="0 0 32 32" width="32" height="32">
        <path fill="currentColor" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.957 0-7.384 6.083-13.467 13.467-13.467s13.467 6.083 13.467 13.467-6.083 13.467-13.467 13.467zM21.967 18.68c-0.303-0.15-1.797-0.887-2.075-0.987-0.277-0.102-0.478-0.15-0.68 0.15s-0.782 0.987-0.958 1.188c-0.177 0.203-0.353 0.228-0.657 0.077-0.303-0.15-1.28-0.472-2.438-1.507-0.902-0.805-1.512-1.797-1.688-2.1s-0.018-0.463 0.132-0.613c0.135-0.135 0.303-0.353 0.453-0.53 0.152-0.177 0.203-0.303 0.303-0.505 0.102-0.203 0.050-0.378-0.025-0.53s-0.68-1.64-0.932-2.246c-0.245-0.59-0.495-0.51-0.68-0.518-0.177-0.010-0.378-0.010-0.578-0.010s-0.53 0.075-0.807 0.378c-0.278 0.303-1.060 1.037-1.060 2.528s1.085 2.932 1.237 3.133c0.15 0.203 2.137 3.263 5.178 4.575 0.723 0.313 1.288 0.5 1.728 0.64 0.727 0.232 1.388 0.198 1.91 0.12 0.583-0.087 1.797-0.735 2.050-1.445s0.253-1.32 0.177-1.445c-0.075-0.127-0.278-0.203-0.582-0.353z"/>
      </svg>
      <span class="whatsapp-tooltip">¿Necesitas ayuda? Escríbenos</span>
    `;
    
    document.body.appendChild(button);
  },

  getWhatsAppLink() {
    const message = encodeURIComponent(this.config.defaultMessage);
    return `https://wa.me/${this.config.phoneNumber}?text=${message}`;
  },

  bindEvents() {
    const button = document.getElementById('whatsapp-button');
    if (button) {
      button.addEventListener('click', () => {
        console.log('WhatsApp button clicked');
      });
    }
  }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => WhatsAppWidget.init());
} else {
  WhatsAppWidget.init();
}

// Exportar para uso global
window.WhatsAppWidget = WhatsAppWidget;
