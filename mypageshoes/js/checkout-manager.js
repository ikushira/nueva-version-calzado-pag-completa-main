/**
 * checkout-manager.js
 * Maneja el proceso de checkout y validación de formularios
 */

class CheckoutManager {
  constructor() {
    this.currentStep = 1;
    this.selectedPaymentMethod = null;
    this.orderData = {
      customer: {},
      shipping: {},
      payment: {},
      items: [],
      totals: {}
    };
  }

  init() {
    console.log('💳 Inicializando Checkout Manager');
    
    // Verificar que el usuario esté logueado
    this.checkUserAuth();
    
    // Cargar items del carrito
    this.loadOrderItems();
    
    // Configurar eventos
    this.setupEventListeners();
    
    // Cargar datos guardados si existen
    this.loadSavedData();
  }

  checkUserAuth() {
    const currentUser = window.headerUtils ? window.headerUtils.getCurrentUser() : null;
    const legacyUser = localStorage.getItem('userData');
    
    if (!currentUser && !legacyUser) {
      // Guardar URL actual para redireccionar después del login
      const currentURL = window.location.pathname + window.location.search;
      alert('Debes iniciar sesión para continuar con la compra');
      window.location.href = `../login.html?next=${encodeURIComponent(currentURL)}`;
      return false;
    }
    return true;
  }

  loadOrderItems() {
    if (!window.cartManager) {
      console.error('❌ CartManager no disponible');
      return;
    }
    
    const cart = window.cartManager.getCart();
    
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      window.location.href = '../nuevos.html';
      return;
    }

    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = cart.map(item => `
      <div class="summary-item">
        <div class="summary-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="summary-item-info">
          <div class="summary-item-name">${item.name}</div>
          <div class="summary-item-details">
            Talla: ${item.size} | Cantidad: ${item.quantity}
          </div>
        </div>
        <div class="summary-item-price">
          $${(item.price * item.quantity).toLocaleString('es-CO')}
        </div>
      </div>
    `).join('');

    // Actualizar totales
    this.updateOrderTotals();
  }

  updateOrderTotals() {
    if (!window.cartManager) return;
    
    const subtotal = window.cartManager.getSubtotal();
    const shipping = window.cartManager.getShippingCost();
    const total = window.cartManager.getTotal();

    const subtotalEl = document.getElementById('order-subtotal');
    const shippingEl = document.getElementById('order-shipping');
    const totalEl = document.getElementById('order-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 
      ? 'GRATIS' 
      : `$${shipping.toLocaleString('es-CO')}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-CO')}`;

    this.orderData.totals = { subtotal, shipping, total };
  }

  setupEventListeners() {
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
      option.addEventListener('click', () => {
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        this.selectPaymentMethod(radio.value);
      });
    });

    // Radio buttons change event
    document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectPaymentMethod(e.target.value);
      });
    });

    // Submit button
    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    if (btnFinalizar) {
      btnFinalizar.addEventListener('click', () => this.submitOrder());
    }

    // Geolocation button
    const btnGeolocation = document.getElementById('btn-compartir-ubicacion');
    if (btnGeolocation) {
      btnGeolocation.addEventListener('click', () => this.getGeolocation());
    }

    // Auto-format card number
    const cardNumberInput = document.getElementById('numero-tarjeta');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        value = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = value;
      });
    }

    // Auto-format expiry date
    const expiryInput = document.getElementById('fecha-expiracion');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
      });
    }

    // Setup auto-save
    this.setupAutoSave();
  }

  /**
   * Obtiene la geolocalización del usuario
   */
  getGeolocation() {
    const btnGeolocation = document.getElementById('btn-compartir-ubicacion');
    
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    // Cambiar texto del botón
    const originalText = btnGeolocation.innerHTML;
    btnGeolocation.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Obteniendo ubicación...';
    btnGeolocation.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Guardar coordenadas
        this.orderData.shipping.coordinates = {
          lat: latitude,
          lng: longitude
        };

        // Actualizar campos ocultos si existen
        const latInput = document.getElementById('latitude');
        const lngInput = document.getElementById('longitude');
        if (latInput) latInput.value = latitude;
        if (lngInput) lngInput.value = longitude;

        // Mostrar mensaje de éxito
        btnGeolocation.innerHTML = '<i class="fa-solid fa-check"></i> Ubicación obtenida';
        btnGeolocation.style.backgroundColor = '#28a745';
        
        console.log('📍 Ubicación obtenida:', { latitude, longitude });

        // Intentar obtener dirección aproximada usando reverse geocoding (opcional)
        this.reverseGeocode(latitude, longitude);

        setTimeout(() => {
          btnGeolocation.innerHTML = originalText;
          btnGeolocation.style.backgroundColor = '';
          btnGeolocation.disabled = false;
        }, 3000);
      },
      (error) => {
        console.error('❌ Error obteniendo ubicación:', error);
        btnGeolocation.innerHTML = originalText;
        btnGeolocation.disabled = false;
        
        let errorMessage = 'No se pudo obtener tu ubicación. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permisos denegados.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Posición no disponible.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Tiempo de espera agotado.';
            break;
          default:
            errorMessage += 'Error desconocido.';
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  /**
   * Reverse geocoding (opcional - requiere API)
   */
  async reverseGeocode(lat, lng) {
    // Aquí se podría integrar con una API de geocoding como Google Maps o OpenStreetMap
    // Por ahora, solo logueamos las coordenadas
    console.log('🗺️ Reverse geocoding no implementado aún. Coordenadas:', { lat, lng });
  }
    }

    // CVV only numbers
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
      cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
      });
    }

    // Auto-save form data
    this.setupAutoSave();
  }

  selectPaymentMethod(method) {
    this.selectedPaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-option').forEach(opt => {
      opt.classList.remove('active');
    });
    
    const selectedOption = document.querySelector(`#pago-${method}`).closest('.payment-option');
    selectedOption.classList.add('active');

    // Show/hide card details
    const cardDetails = document.getElementById('tarjeta-details');
    if (method === 'tarjeta') {
      cardDetails.classList.add('active');
    } else {
      cardDetails.classList.remove('active');
    }

    console.log('💳 Método de pago seleccionado:', method);
  }

  validateForm() {
    const errors = [];

    // Validate personal information
    const nombre = document.getElementById('nombre-completo').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const documento = document.getElementById('documento').value.trim();

    if (!nombre) errors.push('El nombre completo es requerido');
    if (!email || !this.validateEmail(email)) errors.push('El email es inválido');
    if (!telefono) errors.push('El teléfono es requerido');
    if (!documento) errors.push('El documento es requerido');

    // Validate shipping address
    const ciudad = document.getElementById('ciudad').value;
    const departamento = document.getElementById('departamento').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    if (!ciudad) errors.push('La ciudad es requerida');
    if (!departamento) errors.push('El departamento es requerido');
    if (!direccion) errors.push('La dirección es requerida');

    // Validate payment method
    if (!this.selectedPaymentMethod) {
      errors.push('Debes seleccionar un método de pago');
    }

    // If card payment, validate card details
    if (this.selectedPaymentMethod === 'tarjeta') {
      const numeroTarjeta = document.getElementById('numero-tarjeta').value.replace(/\s/g, '');
      const fechaExpiracion = document.getElementById('fecha-expiracion').value;
      const cvv = document.getElementById('cvv').value;
      const nombreTarjeta = document.getElementById('nombre-tarjeta').value.trim();

      if (!numeroTarjeta || numeroTarjeta.length < 13) {
        errors.push('El número de tarjeta es inválido');
      }
      if (!fechaExpiracion || fechaExpiracion.length !== 5) {
        errors.push('La fecha de expiración es inválida');
      }
      if (!cvv || cvv.length < 3) {
        errors.push('El CVV es inválido');
      }
      if (!nombreTarjeta) {
        errors.push('El nombre en la tarjeta es requerido');
      }
    }

    return errors;
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async submitOrder() {
    console.log('🔄 Procesando pedido...');

    // Validate form
    const errors = this.validateForm();
    if (errors.length > 0) {
      alert('Por favor corrige los siguientes errores:\n\n' + errors.join('\n'));
      return;
    }

    // Prepare order data
    this.prepareOrderData();

    // Disable submit button
    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = 'Procesando...';

    try {
      // Simulate API call
      await this.processPayment();
      
      // Save order
      this.saveOrder();
      
      // Generate invoice
      if (window.invoiceGenerator) {
        console.log('📄 Generando factura...');
        // La factura se abrirá en la página de éxito
      }
      
      // Clear cart
      if (window.cartManager) {
        window.cartManager.clearCart();
      }
      
      // Redirect to success page
      window.location.href = './checkout-success.html?orden=' + this.orderData.orderNumber;
    } catch (error) {
      console.error('❌ Error procesando el pedido:', error);
      alert('Hubo un error procesando tu pedido. Por favor intenta nuevamente.');
      btnFinalizar.disabled = false;
      btnFinalizar.innerHTML = '<i class="fa-solid fa-check-circle"></i> Confirmar Pedido';
    }
  }

  prepareOrderData() {
    // Customer data
    this.orderData.customer = {
      nombre: document.getElementById('nombre-completo').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      documento: document.getElementById('documento').value.trim()
    };

    // Shipping data
    this.orderData.shipping = {
      ciudad: document.getElementById('ciudad').value,
      departamento: document.getElementById('departamento').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      barrio: document.getElementById('barrio').value.trim(),
      codigoPostal: document.getElementById('codigo-postal').value.trim(),
      notas: document.getElementById('notas').value.trim()
    };

    // Payment data
    this.orderData.payment = {
      metodo: this.selectedPaymentMethod
    };

    if (this.selectedPaymentMethod === 'tarjeta') {
      this.orderData.payment.tarjeta = {
        numero: document.getElementById('numero-tarjeta').value.replace(/\s/g, '').slice(-4), // Solo últimos 4 dígitos
        nombreTitular: document.getElementById('nombre-tarjeta').value.trim()
      };
    }

    // Items
    this.orderData.items = cartManager.getCart();

    // Order number
    this.orderData.orderNumber = 'MC-' + Date.now();
    this.orderData.fecha = new Date().toISOString();
    this.orderData.estado = 'pendiente';

    console.log('📦 Datos del pedido preparados:', this.orderData);
  }

  async processPayment() {
    // Simular procesamiento de pago
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Pago procesado exitosamente');
        resolve();
      }, 2000);
    });
  }

  saveOrder() {
    // Save to localStorage (en producción, esto se enviaría al servidor)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(this.orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // También guardar en una clave específica para la última orden
    localStorage.setItem('lastOrder', JSON.stringify(this.orderData));
    
    console.log('💾 Orden guardada exitosamente');
  }

  setupAutoSave() {
    // Auto-save form data every 30 seconds
    setInterval(() => {
      const formData = {
        nombre: document.getElementById('nombre-completo').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        documento: document.getElementById('documento').value,
        ciudad: document.getElementById('ciudad').value,
        departamento: document.getElementById('departamento').value,
        direccion: document.getElementById('direccion').value,
        barrio: document.getElementById('barrio').value,
        codigoPostal: document.getElementById('codigo-postal').value
      };
      sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }, 30000);
  }

  loadSavedData() {
    const savedData = sessionStorage.getItem('checkoutFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      document.getElementById('nombre-completo').value = data.nombre || '';
      document.getElementById('email').value = data.email || '';
      document.getElementById('telefono').value = data.telefono || '';
      document.getElementById('documento').value = data.documento || '';
      document.getElementById('ciudad').value = data.ciudad || '';
      document.getElementById('departamento').value = data.departamento || '';
      document.getElementById('direccion').value = data.direccion || '';
      document.getElementById('barrio').value = data.barrio || '';
      document.getElementById('codigo-postal').value = data.codigoPostal || '';
      
      console.log('📝 Datos del formulario restaurados');
    }
  }
}

// Initialize checkout manager
const checkoutManager = new CheckoutManager();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => checkoutManager.init());
} else {
  checkoutManager.init();
}

window.checkoutManager = checkoutManager;
