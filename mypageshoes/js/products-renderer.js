/**
 * products-renderer.js
 * Sistema dinámico de renderizado de productos desde JSON
 * Reemplaza el sistema anterior de arrays estáticos
 */

class ProductsRenderer {
  constructor() {
    this.products = [];
    this.categories = [];
    this.brands = [];
    this.filters = {
      category: null,
      priceMin: 0,
      priceMax: Infinity,
      brand: null,
      sizes: [],
      search: ''
    };
  }

  /**
   * Carga los productos desde el archivo JSON
   */
  async loadProducts() {
    try {
      const response = await fetch('./data/products.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.products = data.products;
      this.categories = data.categories;
      this.brands = data.brands;
      console.log(`✅ Cargados ${this.products.length} productos`);
      return data;
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      return null;
    }
  }

  /**
   * Filtra productos según los criterios establecidos
   */
  filterProducts() {
    return this.products.filter(product => {
      // Filtro por categoría
      if (this.filters.category && product.category !== this.filters.category) {
        return false;
      }

      // Filtro por rango de precio
      if (product.price < this.filters.priceMin || product.price > this.filters.priceMax) {
        return false;
      }

      // Filtro por marca
      if (this.filters.brand && product.brand !== this.filters.brand) {
        return false;
      }

      // Filtro por tallas
      if (this.filters.sizes.length > 0) {
        const hasSize = this.filters.sizes.some(size => 
          product.sizes.includes(parseInt(size)) || product.sizes.includes(size)
        );
        if (!hasSize) return false;
      }

      // Filtro por búsqueda de texto
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        const matchName = product.name.toLowerCase().includes(searchLower);
        const matchDescription = product.description.toLowerCase().includes(searchLower);
        const matchBrand = product.brand.toLowerCase().includes(searchLower);
        if (!matchName && !matchDescription && !matchBrand) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Renderiza una tarjeta de producto
   */
  renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.dataset.productId = product.id;

    // Etiquetas
    let etiquetas = '';
    if (product.isNew) {
      etiquetas += '<span class="etiqueta-nuevo">NUEVO</span>';
    }
    if (product.discount > 0) {
      etiquetas += `<span class="etiqueta-oferta">-${product.discount}%</span>`;
    }
    if (product.freeShipping) {
      etiquetas += '<span class="etiqueta-envio">*ENVÍO GRATIS <i class="fa-solid fa-rocket"></i></span>';
    }

    // Precio con descuento
    let precioHTML = '';
    if (product.oldPrice) {
      precioHTML = `
        <p class="producto-precio">
          $${product.price.toLocaleString('es-CO')}
          <span class="precio-anterior">$${product.oldPrice.toLocaleString('es-CO')}</span>
        </p>
      `;
    } else {
      precioHTML = `<p class="producto-precio">$${product.price.toLocaleString('es-CO')}</p>`;
    }

    // Botones de tallas
    const tallasHTML = product.sizes.map(size => 
      `<button type="button" class="talla-btn" data-size="${size}">${size}</button>`
    ).join('');

    card.innerHTML = `
      ${etiquetas}
      <div class="img-container">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy" 
             onerror="this.src='./assets/img/placeholder.svg'; this.onerror=null;">
      </div>
      <div class="producto-info">
        <h3>${product.name}</h3>
        ${precioHTML}
        <div class="producto-tallas">
          <div class="tallas-label">Selecciona tu talla:</div>
          <div class="tallas-list">
            ${tallasHTML}
          </div>
          <button type="button" class="btn-guia-tallas">Guía de tallas</button>
        </div>
        <button class="btn-add-cart" data-product-id="${product.id}">Añadir al carrito</button>
      </div>
    `;

    // Event listeners para tallas
    const tallaBtns = card.querySelectorAll('.talla-btn');
    tallaBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        tallaBtns.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
      });
    });

    return card;
  }

  /**
   * Renderiza productos en un contenedor específico
   */
  renderProducts(containerId, category = null) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`❌ Contenedor ${containerId} no encontrado`);
      return;
    }

    // Establecer filtro de categoría si se especifica
    if (category) {
      this.filters.category = category;
    }

    // Filtrar y renderizar productos
    const filteredProducts = this.filterProducts();
    
    // Limpiar contenedor
    container.innerHTML = '';

    if (filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="no-products-message">
          <i class="fa-solid fa-box-open"></i>
          <p>No se encontraron productos con los filtros seleccionados</p>
        </div>
      `;
      return;
    }

    // Renderizar cada producto
    filteredProducts.forEach(product => {
      const card = this.renderProductCard(product);
      container.appendChild(card);
    });

    console.log(`✅ Renderizados ${filteredProducts.length} productos en ${containerId}`);
  }

  /**
   * Obtiene un producto por su ID
   */
  getProductById(productId) {
    return this.products.find(p => p.id === productId);
  }

  /**
   * Obtiene productos destacados
   */
  getFeaturedProducts(limit = 8) {
    return this.products.filter(p => p.featured).slice(0, limit);
  }

  /**
   * Obtiene productos nuevos
   */
  getNewProducts(limit = 8) {
    return this.products.filter(p => p.isNew).slice(0, limit);
  }

  /**
   * Obtiene productos en oferta
   */
  getProductsOnSale(limit = 8) {
    return this.products.filter(p => p.discount > 0).slice(0, limit);
  }

  /**
   * Busca productos por texto
   */
  searchProducts(searchText) {
    this.filters.search = searchText;
    return this.filterProducts();
  }

  /**
   * Establece filtro de precio
   */
  setFilterPrice(min, max) {
    this.filters.priceMin = min;
    this.filters.priceMax = max;
  }

  /**
   * Establece filtro de marca
   */
  setFilterBrand(brand) {
    this.filters.brand = brand;
  }

  /**
   * Establece filtro de tallas
   */
  setFilterSizes(sizes) {
    this.filters.sizes = sizes;
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters() {
    this.filters = {
      category: null,
      priceMin: 0,
      priceMax: Infinity,
      brand: null,
      sizes: [],
      search: ''
    };
  }

  /**
   * Renderiza marcas en la página de marcas
   */
  renderBrands(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`❌ Contenedor ${containerId} no encontrado`);
      return;
    }

    container.innerHTML = '';

    this.brands.forEach(brand => {
      const card = document.createElement('div');
      card.className = 'producto-card producto-card-marca';
      card.innerHTML = `
        <div class="img-container">
          <img src="${brand.logo}" alt="${brand.name}" loading="lazy">
        </div>
        <div class="producto-info">
          <h3 class="marca-nombre">${brand.name}</h3>
        </div>
      `;
      
      card.addEventListener('click', () => {
        this.setFilterBrand(brand.name);
        // Redirigir a página de productos filtrados por marca
        window.location.href = `productos.html?marca=${brand.id}`;
      });

      container.appendChild(card);
    });

    console.log(`✅ Renderizadas ${this.brands.length} marcas`);
  }
}

// Instancia global del renderer
const productsRenderer = new ProductsRenderer();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
  // Cargar productos
  await productsRenderer.loadProducts();

  // Auto-renderizar según la página actual
  const pageType = document.body.dataset.pageType;
  const containerId = document.body.dataset.containerId;

  if (pageType && containerId) {
    switch(pageType) {
      case 'category':
        const category = document.body.dataset.category;
        productsRenderer.renderProducts(containerId, category);
        break;
      
      case 'featured':
        const featured = productsRenderer.getFeaturedProducts();
        featured.forEach(product => {
          const card = productsRenderer.renderProductCard(product);
          document.getElementById(containerId).appendChild(card);
        });
        break;

      case 'new':
        const newProducts = productsRenderer.getNewProducts();
        newProducts.forEach(product => {
          const card = productsRenderer.renderProductCard(product);
          document.getElementById(containerId).appendChild(card);
        });
        break;

      case 'brands':
        productsRenderer.renderBrands(containerId);
        break;
    }
  }

  // Event listener para botones de añadir al carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add-cart')) {
      const productId = e.target.dataset.productId;
      const product = productsRenderer.getProductById(productId);
      
      if (product) {
        // Obtener talla seleccionada
        const card = e.target.closest('.producto-card');
        const tallaSeleccionada = card.querySelector('.talla-btn.selected');
        
        if (!tallaSeleccionada && product.sizes.length > 0 && product.sizes[0] !== 'Única') {
          alert('Por favor selecciona una talla');
          return;
        }

        const size = tallaSeleccionada ? tallaSeleccionada.dataset.size : product.sizes[0];
        
        // Agregar al carrito
        if (typeof window.agregarAlCarrito === 'function') {
          window.agregarAlCarrito(product, size);
        } else {
          console.error('Función agregarAlCarrito no encontrada');
        }
      }
    }
  });
});

// Exportar para uso global
window.productsRenderer = productsRenderer;
