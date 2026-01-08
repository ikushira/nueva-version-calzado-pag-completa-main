/**
 * Sistema Completo de Carrito de Compras - Versión Unificada
 * Integra todas las funcionalidades: agregar, visualizar, notificaciones, sincronización
 */

(function() {
  'use strict';

  // Configuración
  const CONFIG = {
    storageKey: 'mundo_calzado_cart',
    shippingCost: 15000,
    freeShippingFrom: 2, // envío gratis a partir de 2 pares
    notificationDuration: 3000
  };

  // Estado del carrito
  let cart = [];
  let isInitialized = false;

  /**
   * Placeholder SVG para imágenes que fallan al cargar
   */
  function getPlaceholder() {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EProducto%3C/text%3E%3C/svg%3E';
  }

  /**
   * Inicializa el sistema de carrito
   */
  function init() {
    if (isInitialized) {
      console.log('⚠️ Carrito ya inicializado');
      return;
    }

    console.log('🛒 Inicializando Sistema de Carrito Completo v3.0');

    // Cargar carrito desde localStorage
    loadCart();

    // Configurar eventos
    setupEventListeners();

    // Actualizar UI inicial
    updateCartUI();

    isInitialized = true;
    console.log(`✅ Carrito inicializado con ${cart.length} productos`);
  }

  /**
   * Carga el carrito desde localStorage
   */
  function loadCart() {
    try {
      const stored = localStorage.getItem(CONFIG.storageKey);
      if (stored) {
        cart = JSON.parse(stored);
        console.log(`📦 Carrito cargado: ${cart.length} productos`);
      } else {
        cart = [];
        console.log('📦 Carrito nuevo inicializado');
      }
    } catch (error) {
      console.error('❌ Error cargando carrito:', error);
      cart = [];
    }
  }

  /**
   * Guarda el carrito en localStorage
   */
  function saveCart() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart));
      console.log('💾 Carrito guardado');
    } catch (error) {
      console.error('❌ Error guardando carrito:', error);
    }
  }

  /**
   * Configura todos los event listeners
   */
  function setupEventListeners() {
    // Botón para abrir carrito
    const btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
      btnCarrito.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    }

    // Botón para cerrar carrito
    const btnCerrar = document.getElementById('cerrar-carrito');
    if (btnCerrar) {
      btnCerrar.addEventListener('click', closeCart);
    }

    // Cerrar al hacer clic fuera
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
      modalCarrito.addEventListener('click', (e) => {
        if (e.target === modalCarrito) {
          closeCart();
        }
      });
    }

    // Botón finalizar compra
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
      btnFinalizar.addEventListener('click', checkout);
    }

    // Botón explorar productos (cuando está vacío)
    const btnExplorar = document.getElementById('btn-elegir-productos');
    if (btnExplorar) {
      btnExplorar.addEventListener('click', () => {
        closeCart();
        window.location.href = './nuevos.html';
      });
    }

    // Delegación de eventos para botones dentro del carrito
    document.addEventListener('click', handleCartActions);
  }

  /**
   * Maneja acciones dentro del carrito (eliminar, incrementar, decrementar)
   */
  function handleCartActions(e) {
    // Eliminar producto
    if (e.target.closest('.btn-eliminar-producto')) {
      const btn = e.target.closest('.btn-eliminar-producto');
      const productId = btn.dataset.productId;
      const size = btn.dataset.size;
      removeProduct(productId, size);
    }

    // Incrementar cantidad
    if (e.target.closest('.btn-incrementar')) {
      const btn = e.target.closest('.btn-incrementar');
      const productId = btn.dataset.productId;
      const size = btn.dataset.size;
      incrementQuantity(productId, size);
    }

    // Decrementar cantidad
    if (e.target.closest('.btn-decrementar')) {
      const btn = e.target.closest('.btn-decrementar');
      const productId = btn.dataset.productId;
      const size = btn.dataset.size;
      decrementQuantity(productId, size);
    }
  }

  /**
   * Agrega un producto al carrito
   */
  function addProduct(product, size) {
    if (!product) {
      console.error('❌ Producto inválido');
      showNotification('Error al agregar el producto', 'error');
      return false;
    }

    // Validar que tenga talla (permitir 'U' para productos sin talla como accesorios)
    if (!size) {
      showNotification('Por favor selecciona una talla', 'warning');
      return false;
    }

    // Normalizar datos del producto
    const normalizedProduct = {
      id: product.id || `prod-${Date.now()}`,
      name: product.nombre || product.name || 'Producto',
      price: parseInt(product.precio || product.price || 0),
      size: size,
      quantity: 1,
      image: product.imagen || product.image || getPlaceholder()
    };

    // Buscar si ya existe el mismo producto con la misma talla
    const existingIndex = cart.findIndex(item => 
      item.id === normalizedProduct.id && item.size === normalizedProduct.size
    );

    if (existingIndex >= 0) {
      // Incrementar cantidad si ya existe
      cart[existingIndex].quantity += 1;
      console.log(`➕ Cantidad incrementada: ${normalizedProduct.name} (${normalizedProduct.size})`);
    } else {
      // Agregar nuevo producto
      cart.push(normalizedProduct);
      console.log(`✅ Producto agregado: ${normalizedProduct.name} (${normalizedProduct.size})`);
    }

    // Guardar y actualizar UI
    saveCart();
    updateCartUI();

    // Mostrar notificación de éxito
    showNotification(`¡${normalizedProduct.name} agregado al carrito!`, 'success');

    return true;
  }

  /**
   * Elimina un producto del carrito
   */
  function removeProduct(productId, size) {
    const index = cart.findIndex(item => item.id === productId && item.size === size);
    
    if (index >= 0) {
      const removed = cart.splice(index, 1)[0];
      console.log(`🗑️ Producto eliminado: ${removed.name}`);
      
      saveCart();
      updateCartUI();
      showNotification('Producto eliminado del carrito', 'info');
    }
  }

  /**
   * Incrementa la cantidad de un producto
   */
  function incrementQuantity(productId, size) {
    const item = cart.find(item => item.id === productId && item.size === size);
    
    if (item) {
      item.quantity += 1;
      console.log(`➕ Cantidad incrementada: ${item.name} (${item.quantity})`);
      
      saveCart();
      updateCartUI();
    }
  }

  /**
   * Decrementa la cantidad de un producto
   */
  function decrementQuantity(productId, size) {
    const item = cart.find(item => item.id === productId && item.size === size);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        console.log(`➖ Cantidad decrementada: ${item.name} (${item.quantity})`);
      } else {
        // Si la cantidad es 1, eliminar el producto
        removeProduct(productId, size);
        return;
      }
      
      saveCart();
      updateCartUI();
    }
  }

  /**
   * Actualiza toda la UI del carrito
   */
  function updateCartUI() {
    updateCartBadge();
    renderCartItems();
    updateCartTotals();
  }

  /**
   * Actualiza el badge del contador
   */
  function updateCartBadge() {
    const badge = document.getElementById('carrito-cantidad');
    
    if (badge) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
      console.log(`🔢 Badge actualizado: ${totalItems}`);
    }
  }

  /**
   * Renderiza los productos en el carrito
   */
  function renderCartItems() {
    const listaCarrito = document.getElementById('carrito-lista');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoTotal = document.getElementById('carrito-total');

    if (!listaCarrito) return;

    if (cart.length === 0) {
      // Mostrar mensaje de carrito vacío
      listaCarrito.innerHTML = '';
      if (carritoVacio) carritoVacio.style.display = 'block';
      if (carritoTotal) carritoTotal.classList.add('oculto');
      return;
    }

    // Ocultar mensaje de carrito vacío
    if (carritoVacio) carritoVacio.style.display = 'none';
    if (carritoTotal) carritoTotal.classList.remove('oculto');

    // Renderizar productos con estilos inline para máxima compatibilidad
    listaCarrito.innerHTML = cart.map(item => `
      <div class="carrito-producto" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; flex-direction: row !important; align-items: center !important; gap: 12px !important; padding: 12px 8px !important; border-bottom: 1px solid #e0e0e0 !important; background-color: #fff !important;">
        
        <!-- Imagen del producto -->
        <div class="carrito-producto-imagen" style="display: block !important; width: 70px !important; height: 70px !important; min-width: 70px !important; flex-shrink: 0 !important; border-radius: 6px !important; overflow: hidden !important; background-color: #f8f8f8 !important; border: 1px solid #ddd !important;">
          <img src="${item.image}" alt="${item.name}" style="display: block !important; width: 100% !important; height: 100% !important; object-fit: contain !important;" onerror="this.onerror=null; this.src='${getPlaceholder()}';">
        </div>
        
        <!-- Información del producto -->
        <div class="carrito-producto-info" style="display: block !important; flex: 1 !important; min-width: 0 !important;">
          <h4 class="carrito-producto-nombre" style="display: block !important; font-size: 14px !important; font-weight: 600 !important; color: #333 !important; margin: 0 0 4px 0 !important; line-height: 1.3 !important; overflow: hidden !important; text-overflow: ellipsis !important;">${item.name}</h4>
          <p class="carrito-producto-talla" style="display: block !important; font-size: 12px !important; color: #666 !important; margin: 0 0 4px 0 !important;">Talla: ${item.size}</p>
          <p class="carrito-producto-precio" style="display: block !important; font-size: 13px !important; font-weight: 700 !important; color: #ff0000 !important; margin: 0 !important;">$${item.price.toLocaleString('es-CO')}</p>
        </div>
        
        <!-- Controles de cantidad -->
        <div class="carrito-producto-cantidad" style="display: flex !important; align-items: center !important; gap: 6px !important; flex-shrink: 0 !important;">
          <button class="btn-cantidad btn-decrementar" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; align-items: center !important; justify-content: center !important; width: 26px !important; height: 26px !important; border: 1px solid #ddd !important; background: #fff !important; border-radius: 4px !important; cursor: pointer !important; font-size: 16px !important;">-</button>
          <span class="cantidad-valor" style="display: inline-block !important; min-width: 20px !important; text-align: center !important; font-weight: 600 !important;">${item.quantity}</span>
          <button class="btn-cantidad btn-incrementar" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; align-items: center !important; justify-content: center !important; width: 26px !important; height: 26px !important; border: 1px solid #ddd !important; background: #fff !important; border-radius: 4px !important; cursor: pointer !important; font-size: 16px !important;">+</button>
        </div>
        
        <!-- Subtotal -->
        <div class="carrito-producto-subtotal" style="display: block !important; text-align: right !important; min-width: 70px !important; flex-shrink: 0 !important;">
          <p style="display: block !important; font-size: 14px !important; font-weight: 700 !important; color: #333 !important; margin: 0 !important;">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
        </div>
        
        <!-- Botón eliminar -->
        <button class="btn-eliminar-producto" data-product-id="${item.id}" data-size="${item.size}" style="display: flex !important; align-items: center !important; justify-content: center !important; width: 30px !important; height: 30px !important; border: none !important; background: transparent !important; color: #999 !important; cursor: pointer !important; border-radius: 4px !important; flex-shrink: 0 !important;" title="Eliminar producto">
          <i class="fa-solid fa-trash" style="font-size: 14px !important;"></i>
        </button>
      </div>
    `).join('');

    console.log(`✅ ${cart.length} productos renderizados en el carrito`);
  }

  /**
   * Actualiza los totales del carrito
   */
  function updateCartTotals() {
    const subtotalEl = document.getElementById('carrito-subtotal');
    const envioEl = document.getElementById('carrito-envio');
    const totalEl = document.getElementById('carrito-total-precio');
    const mensajeEnvioGratis = document.getElementById('envio-gratis-mensaje');

    if (!subtotalEl || !envioEl || !totalEl) return;

    // Calcular subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calcular envío
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCost = totalItems >= CONFIG.freeShippingFrom ? 0 : CONFIG.shippingCost;

    // Calcular total
    const total = subtotal + shippingCost;

    // Actualizar valores
    subtotalEl.textContent = subtotal.toLocaleString('es-CO');
    
    if (shippingCost === 0) {
      envioEl.innerHTML = '<span style="color: #00a650; font-weight: 600;">¡GRATIS!</span>';
      if (mensajeEnvioGratis) {
        mensajeEnvioGratis.style.display = 'block';
        mensajeEnvioGratis.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Felicidades! Tu envío es gratis';
      }
    } else {
      envioEl.textContent = `$${shippingCost.toLocaleString('es-CO')}`;
      if (mensajeEnvioGratis) {
        const faltante = CONFIG.freeShippingFrom - totalItems;
        mensajeEnvioGratis.style.display = 'block';
        mensajeEnvioGratis.innerHTML = `<i class="fa-solid fa-truck"></i> Te falta${faltante > 1 ? 'n' : ''} ${faltante} ${faltante > 1 ? 'pares' : 'par'} para envío gratis`;
      }
    }
    
    totalEl.textContent = total.toLocaleString('es-CO');
  }

  /**
   * Abre el modal del carrito
   */
  function openCart() {
    const modal = document.getElementById('modal-carrito');
    
    if (modal) {
      modal.classList.remove('oculto');
      renderCartItems();
      updateCartTotals();
      console.log('🛒 Carrito abierto');
    }
  }

  /**
   * Cierra el modal del carrito
   */
  function closeCart() {
    const modal = document.getElementById('modal-carrito');
    
    if (modal) {
      modal.classList.add('oculto');
      console.log('🛒 Carrito cerrado');
    }
  }

  /**
   * Procede al checkout
   */
  function checkout() {
    if (cart.length === 0) {
      showNotification('Tu carrito está vacío', 'warning');
      return;
    }

    console.log('💳 Procediendo al checkout...');
    
    // Detectar la ruta correcta según dónde estemos
    const currentPath = window.location.pathname;
    let checkoutUrl = './checkout.html';
    
    // Si estamos en el root (index.html), necesitamos mypageshoes/
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.includes('mypageshoes')) {
      checkoutUrl = 'mypageshoes/checkout.html';
    }
    
    console.log('Redirigiendo a:', checkoutUrl);
    window.location.href = checkoutUrl;
  }

  /**
   * Muestra una notificación flotante
   */
  function showNotification(message, type = 'success') {
    // Crear contenedor si no existe
    let container = document.querySelector('.cart-notifications-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'cart-notifications-container';
      container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 10px;';
      document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    
    // Estilos base
    const baseStyles = 'padding: 16px 20px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; min-width: 300px; animation: slideIn 0.3s ease-out;';
    
    // Estilos por tipo
    const typeStyles = {
      success: 'border-left: 4px solid #00a650; color: #00a650;',
      error: 'border-left: 4px solid #ff0000; color: #ff0000;',
      warning: 'border-left: 4px solid #ff9900; color: #ff9900;',
      info: 'border-left: 4px solid #3483fa; color: #3483fa;'
    };

    notification.style.cssText = baseStyles + (typeStyles[type] || typeStyles.info);

    // Iconos por tipo
    const icons = {
      success: '<i class="fa-solid fa-circle-check"></i>',
      error: '<i class="fa-solid fa-circle-xmark"></i>',
      warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
      info: '<i class="fa-solid fa-circle-info"></i>'
    };

    notification.innerHTML = `
      <span style="font-size: 20px;">${icons[type] || icons.info}</span>
      <span style="color: #333; font-weight: 500; flex: 1;">${message}</span>
    `;

    container.appendChild(notification);

    // Agregar animación CSS si no existe
    if (!document.getElementById('cart-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'cart-notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Auto-eliminar después de la duración configurada
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, CONFIG.notificationDuration);
  }

  /**
   * Limpia el carrito completamente
   */
  function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showNotification('Carrito vaciado', 'info');
    console.log('🗑️ Carrito limpiado');
  }

  /**
   * Obtiene el carrito actual (copia)
   */
  function getCart() {
    return [...cart];
  }

  /**
   * Obtiene el total de items
   */
  function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exportar funciones globales
  window.agregarAlCarrito = addProduct;
  window.carritoCompleto = {
    addProduct,
    removeProduct,
    clearCart,
    getCart,
    getTotalItems,
    openCart,
    closeCart,
    showNotification
  };

  console.log('✅ Sistema de Carrito Completo cargado');
})();
