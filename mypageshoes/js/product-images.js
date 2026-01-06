/**
 * product-images.js
 * Sistema completo para manejo de imágenes de productos
 * Incluye: normalización de rutas, fallbacks, lazy loading, error handling
 */

(function(global) {
  'use strict';

  // === CONFIGURACIÓN ===
  const CONFIG = {
    placeholderImage: 'images/placeholder.png',
    productImageBase: 'images/products',
    lazyLoadingEnabled: true,
    errorRetries: 1
  };

  // === UTILIDADES DE RUTA ===
  
  /**
   * Verifica si estamos dentro de la carpeta mypageshoes/
   */
  const isInsideMyPageshoes = () => {
    const path = window.location.pathname.replace(/\\/g, '/');
    return path.includes('/mypageshoes/');
  };

  /**
   * Resuelve una ruta relativa según la ubicación actual
   */
  const resolveAssetPath = (relativePath) => {
    if (!relativePath) return CONFIG.placeholderImage;
    
    const cleanPath = relativePath
      .replace(/^\.\//, '')
      .replace(/^\//, '');
    
    if (isInsideMyPageshoes()) {
      // Si ya estamos en mypageshoes/, quitar prefijo si existe
      return cleanPath.startsWith('mypageshoes/') 
        ? cleanPath.replace(/^mypageshoes\//, '') 
        : cleanPath;
    }
    
    // Si estamos en root, agregar prefijo si no existe
    return cleanPath.startsWith('mypageshoes/') 
      ? cleanPath 
      : `mypageshoes/${cleanPath}`;
  };

  /**
   * Normaliza el nombre de una imagen desde diferentes formatos
   */
  const normalizeImageName = (imageEntry) => {
    if (!imageEntry || typeof imageEntry !== 'string') {
      return null;
    }
    
    // Extraer solo el nombre del archivo de la ruta
    const parts = imageEntry.split('/');
    const fileName = parts[parts.length - 1];
    
    return fileName || null;
  };

  // === FUNCIONES PRINCIPALES ===

  /**
   * Obtiene la ruta de imagen de un producto
   * @param {Object} product - Objeto del producto
   * @param {Number} index - Índice de la imagen (default: 0)
   * @returns {String} Ruta de la imagen
   */
  const getProductImage = (product, index = 0) => {
    if (!product) {
      console.warn('getProductImage: producto no válido');
      return resolveAssetPath(CONFIG.placeholderImage);
    }

    // Verificar si el producto tiene imágenes
    const images = Array.isArray(product.images) ? product.images : [];
    
    if (images.length === 0) {
      console.warn(`getProductImage: producto ${product.id} no tiene imágenes`);
      return resolveAssetPath(CONFIG.placeholderImage);
    }

    // Obtener la imagen seleccionada o la primera disponible
    const selectedImage = images[index] || images[0];
    const fileName = normalizeImageName(selectedImage);
    
    if (!fileName) {
      console.warn(`getProductImage: no se pudo normalizar imagen para producto ${product.id}`);
      return resolveAssetPath(CONFIG.placeholderImage);
    }

    // Construir ruta siguiendo convención: mypageshoes/images/products/{id}/{filename}
    const imagePath = `${CONFIG.productImageBase}/${product.id}/${fileName}`;
    
    return resolveAssetPath(imagePath);
  };

  /**
   * Obtiene la ruta del placeholder
   */
  const getPlaceholderImage = () => {
    return resolveAssetPath(CONFIG.placeholderImage);
  };

  /**
   * Crea un elemento <img> con configuración optimizada
   * @param {Object} product - Objeto del producto
   * @param {Number} index - Índice de la imagen
   * @param {Object} options - Opciones adicionales
   * @returns {HTMLImageElement}
   */
  const createProductImage = (product, index = 0, options = {}) => {
    const {
      alt = product.name || 'Producto',
      className = 'product-img',
      lazy = CONFIG.lazyLoadingEnabled,
      width = null,
      height = null
    } = options;

    const img = document.createElement('img');
    const imageSrc = getProductImage(product, index);
    
    // Configurar atributos básicos
    img.alt = alt;
    img.className = className;
    
    if (width) img.width = width;
    if (height) img.height = height;

    // Lazy loading
    if (lazy) {
      img.loading = 'lazy';
    }

    // Configurar src
    img.src = imageSrc;

    // Error handling con fallback
    img.onerror = function() {
      if (this.src !== getPlaceholderImage()) {
        console.warn(`Error cargando imagen: ${this.src}`);
        this.src = getPlaceholderImage();
        this.alt = 'Imagen no disponible';
      }
    };

    return img;
  };

  /**
   * Renderiza imagen de producto en un contenedor
   * @param {HTMLElement} container - Contenedor donde renderizar
   * @param {Object} product - Objeto del producto
   * @param {Object} options - Opciones adicionales
   */
  const renderProductImage = (container, product, options = {}) => {
    if (!container) {
      console.error('renderProductImage: contenedor no válido');
      return;
    }

    const img = createProductImage(product, options.index || 0, options);
    
    // Limpiar contenedor y agregar imagen
    container.innerHTML = '';
    container.appendChild(img);
  };

  /**
   * Inicializa imágenes de productos en la página
   * Busca elementos con data-product-id y los renderiza
   */
  const initializeProductImages = () => {
    const imageContainers = document.querySelectorAll('[data-product-id]');
    
    if (imageContainers.length === 0) {
      console.log('initializeProductImages: no se encontraron contenedores');
      return;
    }

    console.log(`🖼️ Inicializando ${imageContainers.length} imágenes de productos`);

    imageContainers.forEach(container => {
      const productId = container.dataset.productId;
      const imageIndex = parseInt(container.dataset.imageIndex || '0', 10);
      
      // Aquí se debería cargar el producto desde los datos
      // Por ahora, solo configuramos el onerror si ya existe una imagen
      const existingImg = container.querySelector('img');
      if (existingImg && !existingImg.onerror) {
        existingImg.loading = 'lazy';
        existingImg.onerror = function() {
          if (this.src !== getPlaceholderImage()) {
            console.warn(`Error cargando imagen: ${this.src}`);
            this.src = getPlaceholderImage();
            this.alt = 'Imagen no disponible';
          }
        };
      }
    });

    console.log('✅ Imágenes de productos inicializadas');
  };

  /**
   * Actualiza todas las imágenes con el atributo onerror
   */
  const addFallbackToAllImages = () => {
    const images = document.querySelectorAll('img[src*="products/"], img[src*="calz"]');
    const placeholder = getPlaceholderImage();
    
    console.log(`🔧 Agregando fallback a ${images.length} imágenes`);

    images.forEach(img => {
      if (!img.onerror) {
        img.loading = 'lazy';
        img.onerror = function() {
          if (this.src !== placeholder) {
            console.warn(`Error cargando imagen: ${this.src}`);
            this.src = placeholder;
            this.alt = 'Imagen no disponible';
          }
        };
      }
    });
  };

  // === EXPORTAR AL GLOBAL ===
  global.getProductImage = getProductImage;
  global.getPlaceholderImage = getPlaceholderImage;
  global.resolveAssetPath = resolveAssetPath;
  global.createProductImage = createProductImage;
  global.renderProductImage = renderProductImage;
  global.initializeProductImages = initializeProductImages;
  global.addFallbackToAllImages = addFallbackToAllImages;

  // === AUTO-INICIALIZACIÓN ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeProductImages();
      addFallbackToAllImages();
    });
  } else {
    // DOM ya está listo
    initializeProductImages();
    addFallbackToAllImages();
  }

  console.log('✅ Product Images System cargado');

})(window);
