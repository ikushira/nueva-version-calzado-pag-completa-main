/**
 * cart-manager.js
 * Sistema moderno y completo de gestión de carrito de compras
 * Incluye: agregar, eliminar, actualizar cantidad, calcular totales, persistencia localStorage
 */

class CartManager {
  constructor() {
    this.cart = [];
    this.initialized = false;
    this.storageKey = 'mundo_calzado_cart';
    this.legacyKeys = ['mundoCalzadoCart', 'carrito'];
    this.placeholder = window.getPlaceholderImage ? window.getPlaceholderImage() : './assets/img/placeholder.svg';
    this.listeners = [];
  }

  /**
   * Inicializa el carrito
   */
  init() {
    if (this.initialized) return;

    console.log('🛒 Inicializando Cart Manager v2.0');
    
    // Cargar carrito desde localStorage
    this.loadFromStorage();
    
    // Configurar eventos
    this.setupEventListeners();
    
    // Actualizar UI
    this.updateUI();
    
    this.initialized = true;
    console.log(`✅ Carrito inicializado con ${this.cart.length} productos`);
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Botón para abrir el carrito
    const btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
      btnCarrito.addEventListener('click', () => this.openCart());
    }

    // Botón para cerrar el carrito
    const btnCerrar = document.getElementById('cerrar-carrito');
    if (btnCerrar) {
      btnCerrar.addEventListener('click', () => this.closeCart());
    }

    // Botón para finalizar compra
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
      btnFinalizar.addEventListener('click', () => this.checkout());
    }

    // Botón "Explorar productos" cuando carrito está vacío
    const btnExplorar = document.getElementById('btn-elegir-productos');
    if (btnExplorar) {
      btnExplorar.addEventListener('click', () => {
        this.closeCart();
        window.location.href = './nuevos.html';
      });
    }

    // Cerrar carrito al hacer clic fuera
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
      modalCarrito.addEventListener('click', (e) => {
        if (e.target === modalCarrito) {
          this.closeCart();
        }
      });
    }

    // Delegación de eventos para botones dentro del carrito
    document.addEventListener('click', (e) => {
      // Botón eliminar producto
      if (e.target.closest('.btn-eliminar-producto')) {
        const productId = e.target.closest('.btn-eliminar-producto').dataset.productId;
        const size = e.target.closest('.btn-eliminar-producto').dataset.size;
        this.removeProduct(productId, size);
      }

      // Botón incrementar cantidad
      if (e.target.closest('.btn-incrementar')) {
        const productId = e.target.closest('.btn-incrementar').dataset.productId;
        const size = e.target.closest('.btn-incrementar').dataset.size;
        this.incrementQuantity(productId, size);
      }

      // Botón decrementar cantidad
      if (e.target.closest('.btn-decrementar')) {
        const productId = e.target.closest('.btn-decrementar').dataset.productId;
        const size = e.target.closest('.btn-decrementar').dataset.size;
        this.decrementQuantity(productId, size);
      }
    });
  }

  /**
   * Agrega un producto al carrito
   */
  addProduct(product, size = null, qty = 1) {
    // Validar producto
    if (!product || !product.id) {
      console.error('❌ Producto inválido');
      return false;
    }

    const quantityToAdd = qty > 0 ? qty : 1;
    const safeSize = size || (Array.isArray(product.sizes) ? product.sizes[0] : 'Única');
    const imageSrc = window.getProductImage ? window.getProductImage(product, 0) : (product.images ? product.images[0] : null);
    const normalizedImage = imageSrc || this.placeholder;

    // Buscar si el producto ya existe con la misma talla
    const existingIndex = this.cart.findIndex(item => 
      item.id === product.id && item.size === safeSize
    );

    if (existingIndex !== -1) {
      // Incrementar cantidad
      this.cart[existingIndex].quantity += quantityToAdd;
      console.log(`📦 Cantidad actualizada: ${product.name} (${this.cart[existingIndex].quantity})`);
    } else {
      // Agregar nuevo producto
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: normalizedImage,
        size: safeSize,
        quantity: quantityToAdd,
        category: product.category,
        brand: product.brand
      };
      
      this.cart.push(cartItem);
      console.log(`✅ Producto agregado: ${product.name}`);
    }

    // Guardar y actualizar
    this.saveToStorage();
    this.updateUI();
    this.notifyListeners();
    this.showNotification(`${product.name} agregado al carrito`);
    
    return true;
  }

  /**
   * Elimina un producto del carrito
   */
  removeProduct(productId, size = null) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => {
      if (item.id !== productId) return true;
      if (size && item.size !== size) return true;
      return false;
    });
    
    if (this.cart.length < initialLength) {
      console.log(`🗑️ Producto eliminado: ${productId}`);
      this.saveToStorage();
      this.updateUI();
      this.notifyListeners();
      this.showNotification('Producto eliminado del carrito');
    }
  }

  /**
   * Incrementa la cantidad de un producto
   */
  incrementQuantity(productId, size = null) {
    const item = this.cart.find(item => item.id === productId && (!size || item.size === size));
    if (item) {
      item.quantity++;
      console.log(`➕ Cantidad incrementada: ${item.name} (${item.quantity})`);
      this.saveToStorage();
      this.updateUI();
      this.notifyListeners();
    }
  }

  /**
   * Decrementa la cantidad de un producto
   */
  decrementQuantity(productId, size = null) {
    const item = this.cart.find(item => item.id === productId && (!size || item.size === size));
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        console.log(`➖ Cantidad decrementada: ${item.name} (${item.quantity})`);
        this.saveToStorage();
        this.updateUI();
        this.notifyListeners();
      } else {
        // Si la cantidad es 1, eliminar el producto
        this.removeProduct(productId);
      }
    }
  }

  /**
   * Actualiza la cantidad de un producto directamente
   */
  updateQuantity(productId, newQuantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
      console.log(`🔄 Cantidad actualizada: ${item.name} (${item.quantity})`);
      this.saveToStorage();
      this.updateUI();
      this.notifyListeners();
    }
  }

  /**
   * Limpia el carrito completamente
   */
  clearCart() {
    this.cart = [];
    this.saveToStorage();
    this.updateUI();
    this.notifyListeners();
    console.log('🗑️ Carrito vaciado');
  }

  /**
   * Calcula el subtotal del carrito
   */
  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Calcula el total de items en el carrito
   */
  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Calcula los costos de envío
   * Envío gratis a partir de 2 pares
   */
  getShippingCost() {
    const totalPairs = this.getTotalItems();
    // Envío gratis a partir de 2 pares
    return totalPairs >= 2 ? 0 : 15000;
  }

  /**
   * Calcula el total final (subtotal + envío)
   */
  getTotal() {
    return this.getSubtotal() + this.getShippingCost();
  }

  /**
   * Guarda el carrito en localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      console.log('💾 Carrito guardado en localStorage');
    } catch (error) {
      console.error('❌ Error guardando carrito:', error);
    }
  }

  /**
   * Carga el carrito desde localStorage
   */
  loadFromStorage() {
    try {
      const keysToTry = [this.storageKey, ...this.legacyKeys];
      for (const key of keysToTry) {
        const data = localStorage.getItem(key);
        if (data) {
          let cartData = JSON.parse(data);
          
          // Validar y limpiar datos incompletos
          cartData = cartData.filter(item => {
            // Verificar que tenga los campos necesarios
            const isValid = item && item.id && item.price !== undefined;
            if (!isValid) {
              console.warn('⚠️ Item inválido eliminado:', item);
            }
            return isValid;
          }).map(item => {
            // Asegurar que todos los campos existan
            return {
              id: item.id,
              name: item.name || `Producto ${item.id}`,
              price: item.price || 0,
              image: item.image || this.placeholder,
              size: item.size || 'Única',
              quantity: item.quantity || 1,
              category: item.category || '',
              brand: item.brand || ''
            };
          });
          
          this.cart = cartData;
          console.log(`📦 Carrito cargado (${key}): ${this.cart.length} productos`);
          
          // Debug: mostrar datos de cada producto
          this.cart.forEach((item, index) => {
            console.log(`  📌 Producto ${index + 1}: ${item.name} | Talla: ${item.size} | Imagen: ${item.image ? '✅' : '❌'}`);
          });
          
          // Migrar al key oficial si era legacy
          if (key !== this.storageKey) {
            this.saveToStorage();
          }
          break;
        }
      }
    } catch (error) {
      console.error('❌ Error cargando carrito:', error);
      this.cart = [];
    }
  }

  /**
   * Actualiza la UI del carrito
   */
  updateUI() {
    this.updateCartBadge();
    this.renderCartItems();
    this.updateCartTotal();
  }

  /**
   * Actualiza el badge de cantidad del carrito
   */
  updateCartBadge() {
    const badge = document.getElementById('carrito-cantidad');
    if (badge) {
      const totalItems = this.getTotalItems();
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  /**
   * Renderiza los items del carrito
   */
  renderCartItems() {
    const listaCarrito = document.getElementById('carrito-lista');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoTotal = document.getElementById('carrito-total');

    if (!listaCarrito) return;

    if (this.cart.length === 0) {
      // Mostrar mensaje de carrito vacío
      if (carritoVacio) carritoVacio.classList.remove('oculto');
      if (carritoTotal) carritoTotal.classList.add('oculto');
      listaCarrito.innerHTML = '';
    } else {
      // Ocultar mensaje de carrito vacío
      if (carritoVacio) carritoVacio.classList.add('oculto');
      if (carritoTotal) carritoTotal.classList.remove('oculto');

      // Placeholder SVG para imágenes que fallan
      const placeholderSVG = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23eee%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3EImagen%3C/text%3E%3C/svg%3E';

      // Mapa de imágenes de productos del carrusel (backup para productos con imagen faltante)
      const imagenesProductos = {
        'prod-1': 'mypageshoes/assets/img/carrusel2/2.jpeg',
        'prod-2': 'mypageshoes/assets/img/carrusel2/3.jpeg',
        'prod-3': 'mypageshoes/assets/img/carrusel2/4.jpeg',
        'prod-4': 'mypageshoes/assets/img/carrusel2/5.jpeg',
        'prod-5': 'mypageshoes/assets/img/carrusel2/6.jpeg',
        'prod-6': 'mypageshoes/assets/img/carrusel2/7.jpeg',
        'prod-7': 'mypageshoes/assets/img/carrusel2/8.jpeg',
        'prod-8': 'mypageshoes/assets/img/carrusel2/9.jpeg'
      };

      // Mapa de nombres de productos del carrusel (backup para productos con nombre incorrecto)
      const nombresProductos = {
        'prod-1': 'Bota Urbana Clásica',
        'prod-2': 'Zapato Casual Sport',
        'prod-3': 'Tenis Running Pro',
        'prod-4': 'Sandalia Elegante',
        'prod-5': 'Mocasín Ejecutivo',
        'prod-6': 'Bota Montañera',
        'prod-7': 'Zapatilla Deportiva',
        'prod-8': 'Oxford Formal'
      };

      // Renderizar productos CON ESTILOS INLINE para evitar conflictos de CSS
      listaCarrito.innerHTML = this.cart.map(item => {
        // Obtener imagen: usar la guardada si es válida, si no buscar en el mapa de backup
        let imagenFinal = item.image;
        
        // Verificar si la imagen guardada es válida (no es placeholder SVG ni vacía)
        const esImagenInvalida = !imagenFinal || 
                                 imagenFinal.startsWith('data:image/svg') || 
                                 imagenFinal === this.placeholder;
        
        if (esImagenInvalida && imagenesProductos[item.id]) {
          imagenFinal = imagenesProductos[item.id];
          console.log(`🔄 Imagen recuperada para ${item.id}: ${imagenFinal}`);
        }
        
        // Si aún no hay imagen válida, usar placeholder
        if (!imagenFinal || imagenFinal.startsWith('data:image/svg')) {
          imagenFinal = placeholderSVG;
        }
        
        // Obtener nombre: usar el guardado si es válido, si no buscar en el mapa de backup
        let nombreFinal = item.name;
        
        // Verificar si el nombre guardado es inválido (muy corto, es "Producto X", o parece talla)
        const esNombreInvalido = !nombreFinal || 
                                  nombreFinal.length < 5 ||
                                  nombreFinal.startsWith('Producto ') ||
                                  /^Ta(lla)?[\s:]?\d+/i.test(nombreFinal) ||
                                  /^\d+\/\d+$/.test(nombreFinal);
        
        if (esNombreInvalido && nombresProductos[item.id]) {
          nombreFinal = nombresProductos[item.id];
          console.log(`🔄 Nombre recuperado para ${item.id}: ${nombreFinal}`);
        }
        
        // Si aún no hay nombre válido, usar genérico
        if (!nombreFinal || nombreFinal.length < 3) {
          nombreFinal = 'Producto';
        }
        
        return `
        <div class="carrito-producto" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; visibility: visible !important; opacity: 1 !important; flex-direction: row !important; align-items: center !important; gap: 12px !important; padding: 12px 8px !important; border-bottom: 1px solid #e0e0e0 !important; background-color: #fff !important;">
          
          <div class="carrito-producto-imagen" style="display: block !important; visibility: visible !important; opacity: 1 !important; width: 70px !important; height: 70px !important; min-width: 70px !important; min-height: 70px !important; flex-shrink: 0 !important; border-radius: 6px !important; overflow: hidden !important; background-color: #f8f8f8 !important; border: 1px solid #ddd !important;">
            <img src="${imagenFinal}" alt="${nombreFinal}" style="display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; height: 100% !important; object-fit: contain !important;" onerror="this.onerror=null; this.src='${placeholderSVG}';">
          </div>
          
          <div class="carrito-producto-info" style="display: block !important; visibility: visible !important; opacity: 1 !important; flex: 1 !important; min-width: 0 !important;">
            <h4 class="carrito-producto-nombre" style="display: block !important; visibility: visible !important; opacity: 1 !important; font-size: 14px !important; font-weight: 600 !important; color: #333 !important; margin: 0 0 4px 0 !important; line-height: 1.3 !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;">${nombreFinal}</h4>
            <p class="carrito-producto-talla" style="display: block !important; visibility: visible !important; opacity: 1 !important; font-size: 12px !important; color: #666 !important; margin: 0 0 4px 0 !important;">Talla: ${item.size || 'Única'}</p>
            <p class="carrito-producto-precio" style="display: block !important; visibility: visible !important; opacity: 1 !important; font-size: 13px !important; font-weight: 700 !important; color: #ff0000 !important; margin: 0 !important;">$${item.price.toLocaleString('es-CO')}</p>
          </div>
          
          <div class="carrito-producto-cantidad" style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 6px !important; flex-shrink: 0 !important;">
            <button class="btn-cantidad btn-decrementar" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; justify-content: center !important; width: 26px !important; height: 26px !important; border: 1px solid #ddd !important; background: #fff !important; border-radius: 4px !important; cursor: pointer !important; font-size: 16px !important;">-</button>
            <span class="cantidad-valor" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important; min-width: 20px !important; text-align: center !important; font-weight: 600 !important;">${item.quantity}</span>
            <button class="btn-cantidad btn-incrementar" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; justify-content: center !important; width: 26px !important; height: 26px !important; border: 1px solid #ddd !important; background: #fff !important; border-radius: 4px !important; cursor: pointer !important; font-size: 16px !important;">+</button>
          </div>
          
          <div class="carrito-producto-subtotal" style="display: block !important; visibility: visible !important; opacity: 1 !important; text-align: right !important; min-width: 70px !important; flex-shrink: 0 !important;">
            <p style="display: block !important; visibility: visible !important; opacity: 1 !important; font-size: 14px !important; font-weight: 700 !important; color: #333 !important; margin: 0 !important;">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
          </div>
          
          <button class="btn-eliminar-producto" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; justify-content: center !important; width: 30px !important; height: 30px !important; border: none !important; background: transparent !important; color: #999 !important; cursor: pointer !important; border-radius: 4px !important; flex-shrink: 0 !important;">
            <i class="fa-solid fa-trash" style="font-size: 14px !important;"></i>
          </button>
        </div>`}).join('');
      
      console.log('✅ Carrito renderizado con estilos inline forzados');
    }
  }

  /**
   * API compatible con requisitos: agrega por id/size/qty
   */
  addToCart(productId, size, qty = 1) {
    const resolver = window.productsRenderer && window.productsRenderer.getProductById ? window.productsRenderer : null;
    const product = resolver ? resolver.getProductById(productId) : null;
    if (!product) {
      console.error('❌ Producto no encontrado para agregar al carrito', productId);
      return false;
    }
    return this.addProduct(product, size, qty);
  }

  /**
   * Actualiza cantidad exacta del item
   */
  updateCartItem(productId, size, qty) {
    const item = this.cart.find(it => it.id === productId && it.size === size);
    if (item && qty > 0) {
      item.quantity = qty;
      this.saveToStorage();
      this.updateUI();
      this.notifyListeners();
    }
  }

  /**
   * Elimina item específico con talla
   */
  removeFromCart(productId, size) {
    this.removeProduct(productId, size);
  }

  /**
   * Actualiza el total del carrito
   */
  updateCartTotal() {
    const totalElement = document.getElementById('carrito-total-precio');
    const subtotalElement = document.getElementById('carrito-subtotal');
    const envioElement = document.getElementById('carrito-envio');
    const envioMensaje = document.getElementById('envio-gratis-mensaje');
    
    const subtotal = this.getSubtotal();
    const totalPairs = this.getTotalItems();
    const shippingCost = this.getShippingCost();
    const total = this.getTotal();
    
    if (totalElement) {
      totalElement.textContent = total.toLocaleString('es-CO');
    }
    
    if (subtotalElement) {
      subtotalElement.textContent = subtotal.toLocaleString('es-CO');
    }
    
    if (envioElement) {
      envioElement.textContent = shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-CO')}`;
      envioElement.style.color = shippingCost === 0 ? '#28a745' : '';
      envioElement.style.fontWeight = shippingCost === 0 ? 'bold' : '';
    }
    
    // Mostrar mensaje de envío gratis
    if (envioMensaje) {
      if (totalPairs >= 2) {
        envioMensaje.innerHTML = '<i class="fas fa-check-circle"></i> ¡Tienes envio gratis!';
        envioMensaje.style.color = '#28a745';
        envioMensaje.style.display = 'block';
      } else if (totalPairs === 1) {
        envioMensaje.innerHTML = '<i class="fas fa-info-circle"></i> Agrega 1 par mas para envio gratis';
        envioMensaje.style.color = '#ffc107';
        envioMensaje.style.display = 'block';
      } else {
        envioMensaje.style.display = 'none';
      }
    }
  }

  /**
   * Abre el modal del carrito
   */
  openCart() {
    const modal = document.getElementById('modal-carrito');
    if (modal) {
      modal.classList.remove('oculto');
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
  }

  /**
   * Cierra el modal del carrito
   */
  closeCart() {
    const modal = document.getElementById('modal-carrito');
    if (modal) {
      modal.classList.add('oculto');
      document.body.style.overflow = ''; // Restaurar scroll
    }
  }

  /**
   * Proceso de checkout
   */
  checkout() {
    if (this.cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    console.log('🛒 Iniciando checkout...');

    // Verificar si el usuario está logueado usando headerManager
    const isLoggedIn = this.checkUserLogin();
    
    // Determinar ruta base según ubicación actual
    const basePath = this.getBasePath();
    
    if (!isLoggedIn) {
      // Guardar la intención de compra y redirigir a login
      console.log('⚠️ Usuario no logueado, redirigiendo a login');
      sessionStorage.setItem('redirect_after_login', 'checkout');
      window.location.href = `${basePath}login.html?next=${basePath}pages/checkout.html`;
    } else {
      // Redirigir a checkout
      console.log('✅ Usuario logueado, redirigiendo a checkout');
      window.location.href = `${basePath}pages/checkout.html`;
    }
  }

  /**
   * Verifica si el usuario está logueado
   */
  checkUserLogin() {
    // Primero intentar con el headerManager si está disponible
    if (window.headerManager && typeof window.headerManager.isLoggedIn === 'function') {
      return window.headerManager.isLoggedIn();
    }
    
    // Fallback: verificar en localStorage
    const sessionData = localStorage.getItem('mundo_calzado_session');
    const userData = localStorage.getItem('userData'); // Compatibilidad
    
    return sessionData !== null || userData !== null;
  }

  /**
   * Obtener ruta base según ubicación
   */
  getBasePath() {
    const currentPath = window.location.pathname.replace(/\\/g, '/');
    
    // Si estamos en index.html (root)
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.includes('mypageshoes')) {
      return 'mypageshoes/';
    }
    
    // Si estamos en mypageshoes/
    return './';
  }

  /**
   * Muestra una notificación profesional con icono
   */
  showNotification(message, type = 'success') {
    // Verificar si ya existe un contenedor de notificaciones
    let container = document.getElementById('cart-notifications-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cart-notifications-container';
      container.className = 'cart-notifications-container';
      document.body.appendChild(container);
    }
    
    // Crear notificación flotante
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    
    // Agregar ícono según el tipo
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-info-circle"></i>';
    
    notification.innerHTML = `
      ${icon}
      <span class="notification-message">${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Registra un listener para cambios en el carrito
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notifica a todos los listeners
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.cart));
  }

  /**
   * Obtiene el contenido del carrito
   */
  getCart() {
    return [...this.cart]; // Retorna una copia
  }
}

// Crear instancia global del carrito
const cartManager = new CartManager();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => cartManager.init());
} else {
  cartManager.init();
}

// Función global para agregar al carrito (mantener compatibilidad)
window.agregarAlCarrito = function(product, size) {
  if (typeof product === 'object') {
    return cartManager.addProduct(product, size);
  }
  return cartManager.addToCart(product, size);
};

// Exportar para uso global
window.cartManager = cartManager;
