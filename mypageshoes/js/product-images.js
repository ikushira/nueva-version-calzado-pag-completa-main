/**
 * SISTEMA DE GESTIÓN DE IMÁGENES DE PRODUCTOS
 * ===========================================
 * Maneja la carga, resolución de rutas y fallbacks de imágenes de productos
 */

(function() {
    'use strict';

    // Configuración de rutas
    const IMAGE_CONFIG = {
        placeholderPath: './assets/img/placeholder.svg',
        fallbackCategories: {
            'hombres': './assets/img/calzhombres/',
            'mujeres': './assets/img/calzmujeres/',
            'ninas': './assets/img/calzninas/',
            'ninos': './assets/img/calzninos/',
            'colegiales': './assets/img/colegiales/',
            'ofertas': './assets/img/ofertas/',
            'nuevos': './assets/img/Lo_nuevo/',
            'marcas': './assets/img/marcas/',
            'dotacion': './assets/img/dotacion/',
            'accesorios': './assets/img/complementos/',
        }
    };

    /**
     * Obtiene la ruta de una imagen de producto
     * @param {Object|string} product - Objeto de producto o ID
     * @param {number} index - Índice de la imagen (default: 0)
     * @returns {string} Ruta de la imagen
     */
    window.getProductImage = function(product, index = 0) {
        try {
            // Si es un string, asumir que es un ID y retornar placeholder
            if (typeof product === 'string') {
                return IMAGE_CONFIG.placeholderPath;
            }

            // Si el producto tiene imágenes
            if (product && product.images && Array.isArray(product.images) && product.images.length > 0) {
                const imagePath = product.images[index] || product.images[0];
                
                // Retornar la ruta tal como viene del JSON
                if (imagePath) {
                    return imagePath;
                }
            }

            // Fallback: buscar en la carpeta de la categoría
            if (product && product.category && IMAGE_CONFIG.fallbackCategories[product.category]) {
                const categoryPath = IMAGE_CONFIG.fallbackCategories[product.category];
                return categoryPath + '1.jpeg';
            }

            // Último recurso: placeholder
            return IMAGE_CONFIG.placeholderPath;

        } catch (error) {
            console.error('Error obteniendo imagen del producto:', error);
            return IMAGE_CONFIG.placeholderPath;
        }
    };

    /**
     * Obtiene todas las imágenes de un producto
     * @param {Object} product - Objeto de producto
     * @returns {Array<string>} Array de rutas de imágenes
     */
    window.getProductImages = function(product) {
        if (!product || !product.images || !Array.isArray(product.images)) {
            return [IMAGE_CONFIG.placeholderPath];
        }

        return product.images;
    };

    /**
     * Obtiene la ruta del placeholder
     * @returns {string} Ruta del placeholder
     */
    window.getPlaceholderImage = function() {
        return IMAGE_CONFIG.placeholderPath;
    };

    /**
     * Crea un elemento img con manejo de errores
     * @param {Object} product - Objeto de producto
     * @param {number} index - Índice de la imagen
     * @param {Object} options - Opciones adicionales
     * @returns {HTMLImageElement} Elemento img configurado
     */
    window.createProductImage = function(product, index = 0, options = {}) {
        const {
            className = '',
            alt = product?.name || 'Producto',
            lazy = true,
            onClick = null
        } = options;

        const img = document.createElement('img');
        img.className = className;
        img.alt = alt;
        
        // Configurar lazy loading
        if (lazy) {
            img.loading = 'lazy';
        }

        // Configurar src y fallback
        const src = window.getProductImage(product, index);
        img.src = src;
        
        // Manejo de errores con fallback en cascada
        let errorCount = 0;
        img.onerror = function() {
            errorCount++;
            
            if (errorCount === 1 && product?.images && product.images.length > 1 && index + 1 < product.images.length) {
                // Intentar con la siguiente imagen del producto
                this.src = window.getProductImage(product, index + 1);
            } else if (errorCount === 2 && product?.category) {
                // Intentar con imagen genérica de la categoría
                const categoryPath = IMAGE_CONFIG.fallbackCategories[product.category];
                if (categoryPath) {
                    this.src = categoryPath + '1.jpeg';
                } else {
                    this.src = IMAGE_CONFIG.placeholderPath;
                }
            } else {
                // Usar placeholder
                this.src = IMAGE_CONFIG.placeholderPath;
                this.onerror = null; // Evitar loop infinito
            }
        };

        // Click handler opcional
        if (onClick && typeof onClick === 'function') {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => onClick(product, index));
        }

        return img;
    };

    /**
     * Precarga imágenes de productos
     * @param {Array<Object>} products - Array de productos
     */
    window.preloadProductImages = function(products) {
        if (!Array.isArray(products)) return;

        products.forEach(product => {
            if (product.images && product.images.length > 0) {
                const img = new Image();
                img.src = window.getProductImage(product, 0);
            }
        });
    };

    /**
     * Verifica si una imagen existe
     * @param {string} url - URL de la imagen
     * @returns {Promise<boolean>} True si existe, false si no
     */
    window.imageExists = function(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    console.log('✓ Sistema de imágenes de productos inicializado');

})();
