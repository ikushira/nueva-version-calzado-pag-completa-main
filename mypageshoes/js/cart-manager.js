/**
 * cart-manager.js
 * Sistema moderno y completo de gestión de carrito de compras
 * Incluye: agregar, eliminar, actualizar cantidad, calcular totales, persistencia localStorage
 */

class CartManager {
  constructor() {
    this.cart = [];
    this.initialized = false;
    this.storageKey = 'mundoCalzadoCart';
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
        this.removeProduct(productId);
      }

      // Botón incrementar cantidad
      if (e.target.closest('.btn-incrementar')) {
        const productId = e.target.closest('.btn-incrementar').dataset.productId;
        this.incrementQuantity(productId);
      }

      // Botón decrementar cantidad
      if (e.target.closest('.btn-decrementar')) {
        const productId = e.target.closest('.btn-decrementar').dataset.productId;
        this.decrementQuantity(productId);
      }
    });
  }

  /**
   * Agrega un producto al carrito
   */
  addProduct(product, size = null) {
    // Validar producto
    if (!product || !product.id) {
      console.error('❌ Producto inválido');
      return false;
    }

    // Buscar si el producto ya existe con la misma talla
    const existingIndex = this.cart.findIndex(item => 
      item.id === product.id && item.size === size
    );

    if (existingIndex !== -1) {
      // Incrementar cantidad
      this.cart[existingIndex].quantity++;
      console.log(`📦 Cantidad actualizada: ${product.name} (${this.cart[existingIndex].quantity})`);
    } else {
      // Agregar nuevo producto
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: size || product.sizes[0],
        quantity: 1,
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
  removeProduct(productId) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => item.id !== productId);
    
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
  incrementQuantity(productId) {
    const item = this.cart.find(item => item.id === productId);
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
  decrementQuantity(productId) {
    const item = this.cart.find(item => item.id === productId);
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
   */
  getShippingCost() {
    const subtotal = this.getSubtotal();
    // Envío gratis para compras superiores a $150.000
    return subtotal >= 150000 ? 0 : 15000;
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
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.cart = JSON.parse(data);
        console.log(`📦 Carrito cargado: ${this.cart.length} productos`);
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

      // Renderizar productos
      listaCarrito.innerHTML = this.cart.map(item => `
        <div class="carrito-producto" data-product-id="${item.id}">
          <div class="carrito-producto-imagen">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='./assets/img/placeholder.jpg'">
          </div>
          <div class="carrito-producto-info">
            <h4 class="carrito-producto-nombre">${item.name}</h4>
            <p class="carrito-producto-talla">Talla: ${item.size}</p>
            <p class="carrito-producto-precio">$${item.price.toLocaleString('es-CO')}</p>
          </div>
          <div class="carrito-producto-cantidad">
            <button class="btn-cantidad btn-decrementar" data-product-id="${item.id}">-</button>
            <span class="cantidad-valor">${item.quantity}</span>
            <button class="btn-cantidad btn-incrementar" data-product-id="${item.id}">+</button>
          </div>
          <div class="carrito-producto-subtotal">
            <p>$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
          </div>
          <button class="btn-eliminar-producto" data-product-id="${item.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `).join('');
    }
  }

  /**
   * Actualiza el total del carrito
   */
  updateCartTotal() {
    const totalElement = document.getElementById('carrito-total-precio');
    if (totalElement) {
      const total = this.getTotal();
      totalElement.textContent = total.toLocaleString('es-CO');
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

    // Verificar si el usuario está logueado
    const isLoggedIn = this.checkUserLogin();
    
    if (!isLoggedIn) {
      // Guardar la intención de compra y redirigir a login
      sessionStorage.setItem('redirectAfterLogin', 'checkout');
      window.location.href = './login.html';
    } else {
      // Redirigir a checkout
      window.location.href = './checkout.html';
    }
  }

  /**
   * Verifica si el usuario está logueado
   */
  checkUserLogin() {
    // Verificar en localStorage si hay una sesión activa
    const userData = localStorage.getItem('userData');
    return userData !== null;
  }

  /**
   * Muestra una notificación
   */
  showNotification(message) {
    // Crear notificación flotante
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
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
  return cartManager.addProduct(product, size);
};

// Exportar para uso global
window.cartManager = cartManager;
