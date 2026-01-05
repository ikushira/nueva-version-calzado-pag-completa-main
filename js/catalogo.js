// Generador de catálogo para páginas de productos
// Reutiliza las imágenes del carrusel y muestra cards con descripción y precio

document.addEventListener('DOMContentLoaded', function() {

  // --- Importar listas de imágenes desde archivos externos ---
  // IMPORTANTE: Asegúrate de incluir estos archivos en tu HTML antes de catalogo.js
  // <script src="js/secciones_js/Lo_nuevo_fotos.js"></script>
  // <script src="js/secciones_js/Mujeres_fotos.js"></script>
  // <script src="js/secciones_js/Hombres_fotos.js"></script>
  // <script src="js/secciones_js/Ninas_fotos.js"></script>
  // <script src="js/secciones_js/Ninos_fotos.js"></script>


  const catalogos = [
    {
      id: 'catalogo-hombres',
      nombre: 'Zapato Hombre',
      precio: 75000,
      imagenes: typeof imagenesHombres !== 'undefined' ? imagenesHombres : []
    },
    {
      id: 'catalogo-mujeres',
      nombre: 'Zapato Mujer',
      precio: 75000,
      imagenes: typeof imagenesMujeres !== 'undefined' ? imagenesMujeres : []
    },
    {
      id: 'catalogo-ninas',
      nombre: 'Zapato Niña',
      precio: 75000,
      imagenes: typeof imagenesNinas !== 'undefined' ? imagenesNinas : []
    },
    {
      id: 'catalogo-ninos',
      nombre: 'Zapato Niño',
      precio: 75000,
      imagenes: typeof imagenesNinos !== 'undefined' ? imagenesNinos : []
    },
    {
      id: 'catalogo-colegiales',
      nombre: 'Zapato Colegial',
      precio: 75000,
      imagenes: typeof imagenesColegiales !== 'undefined' ? imagenesColegiales : []
    },
    {
      id: 'catalogo-dotacion',
      nombre: 'Zapato Dotación',
      precio: 75000,
      imagenes: typeof imagenesDotacion !== 'undefined' ? imagenesDotacion : []
    },
    {
      id: 'catalogo-ofertas',
      nombre: 'Zapato Oferta',
      precio: 75000,
      imagenes: typeof imagenesOfertas !== 'undefined' ? imagenesOfertas : []
    },
    {
      id: 'catalogo-marcas',
      nombre: 'Marca',
      precio: null,
      imagenes: [
        { src: 'assets/img/marcas/newbalance.png', nombre: 'New Balance' },
        { src: 'assets/img/marcas/skechers.png', nombre: 'Skechers' },
        { src: 'assets/img/marcas/rivercreek.png', nombre: 'River Creek' },
        { src: 'assets/img/marcas/brahma.png', nombre: 'Brahma' },
        { src: 'assets/img/marcas/throwing.png', nombre: 'Throwing' },
        { src: 'assets/img/marcas/verlon.png', nombre: 'Verlon' },
        { src: 'assets/img/marcas/troya.png', nombre: 'Troya' },
        { src: 'assets/img/marcas/stardus.png', nombre: 'Stardus' },
        { src: 'assets/img/marcas/piccadilly.png', nombre: 'Piccadilly' },
        { src: 'assets/img/marcas/patrick.png', nombre: 'Patrick' },
        { src: 'assets/img/marcas/moleca.png', nombre: 'Moleca' },
        { src: 'assets/img/marcas/ipanema.png', nombre: 'Ipanema' },
        { src: 'assets/img/marcas/gumball.png', nombre: 'Gumball' },
        { src: 'assets/img/marcas/frattini.png', nombre: 'Frattini' },
        { src: 'assets/img/marcas/croydon.png', nombre: 'Croydon' },
        { src: 'assets/img/marcas/cartago.png', nombre: 'Cartago' },
        { src: 'assets/img/marcas/bubblegummers.png', nombre: 'Bubblegummers' },
        { src: 'assets/img/marcas/24walks.png', nombre: '24 Walks' },
      ]
    },
    {
      id: 'catalogo-accesorios',
      nombre: 'Accesorio',
      precio: 29900,
      imagenes: typeof imagenesAccesorios !== 'undefined' ? imagenesAccesorios : []
    },
    // Carrusel 1 y 2 como catálogos independientes (si se usan como secciones)
    {
      id: 'catalogo-carrusel1',
      nombre: 'Carrusel 1',
      precio: null,
      imagenes: typeof imagenesCarrusel1 !== 'undefined' ? imagenesCarrusel1 : []
    },
    {
      id: 'catalogo-carrusel2',
      nombre: 'Carrusel 2',
      precio: null,
      imagenes: typeof imagenesCarrusel2 !== 'undefined' ? imagenesCarrusel2 : []
    },
    // Catálogo especial para "Nuevos" (solo se usa en nuevos.html)
    {
      id: 'catalogo-hombres',
      nombre: 'Zapato Hombre',
      precio: 75000,
      imagenes: window.location.pathname.includes('nuevos.html') && typeof imagenesLoNuevo !== 'undefined' ? imagenesLoNuevo : []
    },
  ];

  // Detectar si estamos en la página de nuevos o marcas
  const esNuevos = window.location.pathname.includes('nuevos.html');
  const esMarcas = window.location.pathname.includes('marcas.html');

  catalogos.forEach(catalogo => {
    const contenedor = document.getElementById(catalogo.id);
    if (contenedor) {
      // Si el catálogo tiene imágenes personalizadas (dotación o accesorios)
      if (catalogo.imagenes) {
        catalogo.imagenes.forEach((imgObj, idx) => {
          const card = document.createElement('div');
          // Tarjeta especial para marcas: más compacta
          card.className = catalogo.id === 'catalogo-marcas' ? 'producto-card producto-card-marca' : 'producto-card';
          let etiquetas = '';
          if (esNuevos) etiquetas += '<span class="etiqueta-nuevo">NUEVOS</span>';
          // Si es la sección de marcas, solo muestra la imagen y el nombre personalizado
          if (catalogo.id === 'catalogo-marcas') {
            card.innerHTML = `
              <div class="img-container">
                <img src="${imgObj.src}" alt="${imgObj.nombre}" loading="lazy" class="marca-img" />
              </div>
              <div class="producto-info">
                <h3 class="marca-nombre">${imgObj.nombre}</h3>
              </div>
            `;
          } else {
            if (!esMarcas && catalogo.id !== 'catalogo-marcas' && catalogo.id !== 'catalogo-accesorios') etiquetas += '<span class="etiqueta-envio">*ENVÍO GRATIS <i class="fa-solid fa-rocket"></i></span>';
            if (catalogo.id === 'catalogo-accesorios') {
              card.innerHTML = `
                ${etiquetas}
                <div class="img-container">
                  <img src="${imgObj}" alt="${catalogo.nombre} ${idx+1}" loading="lazy" />
                </div>
                <div class="producto-info">
                  <h3>${catalogo.nombre} ${idx+1}</h3>
                  ${catalogo.precio ? `<p class="producto-precio">$${catalogo.precio.toLocaleString('es-CO')}</p>` : ''}
                  <button class="btn-add-cart">Añadir al carrito</button>
                </div>
              `;
            } else {
              card.innerHTML = `
                ${etiquetas}
                <div class="img-container">
                  <img src="${imgObj}" alt="${catalogo.nombre} ${idx+1}" loading="lazy" />
                </div>
                <div class="producto-info">
                  <h3>${catalogo.nombre} ${idx+1}</h3>
                  ${catalogo.precio ? `<p class="producto-precio">$${catalogo.precio.toLocaleString('es-CO')}</p>` : ''}
                  <div class="producto-tallas">
                    <div class="tallas-label">Selecciona tu talla:</div>
                    <div class="tallas-list">
                      <button type="button" class="talla-btn">35</button>
                      <button type="button" class="talla-btn">36</button>
                      <button type="button" class="talla-btn">37</button>
                      <button type="button" class="talla-btn">38</button>
                      <button type="button" class="talla-btn">39</button>
                      <button type="button" class="talla-btn">40</button>
                      <button type="button" class="talla-btn">41</button>
                      <button type="button" class="talla-btn">42</button>
                    </div>
                    <button type="button" class="btn-guia-tallas">Guía de tallas</button>
                  </div>
                  <button class="btn-add-cart">Añadir al carrito</button>
                </div>
              `;
            }
          }
          contenedor.appendChild(card);
        });
      } else {
        for (let i = 2; i <= 34; i++) {
          const card = document.createElement('div');
          card.className = 'producto-card';
          let etiquetas = '';
          if (esNuevos) etiquetas += '<span class="etiqueta-nuevo">NUEVOS</span>';
          if (!esMarcas && catalogo.id !== 'catalogo-marcas') etiquetas += '<span class="etiqueta-envio">*ENVÍO GRATIS <i class="fa-solid fa-rocket"></i></span>';
          card.innerHTML = `
            ${etiquetas}
            <div class="img-container">
              <img src="assets/img/${i}.jpeg" alt="${catalogo.nombre} ${i}" loading="lazy" />
            </div>
            <div class="producto-info">
              <h3>${catalogo.nombre} ${i}</h3>
              ${catalogo.precio ? `<p class="producto-precio">$${catalogo.precio.toLocaleString('es-CO')}</p>` : ''}
              <div class="producto-tallas">
                <div class="tallas-label">Selecciona tu talla:</div>
                <div class="tallas-list">
                  <button type="button" class="talla-btn">35</button>
                  <button type="button" class="talla-btn">36</button>
                  <button type="button" class="talla-btn">37</button>
                  <button type="button" class="talla-btn">38</button>
                  <button type="button" class="talla-btn">39</button>
                  <button type="button" class="talla-btn">40</button>
                  <button type="button" class="talla-btn">41</button>
                  <button type="button" class="talla-btn">42</button>
                </div>
                <button type="button" class="btn-guia-tallas">Guía de tallas</button>
              </div>
              <button class="btn-add-cart">Añadir al carrito</button>
            </div>
          `;
          contenedor.appendChild(card);
        }
      }
      // Lógica para el botón "Añadir al carrito" en cada catálogo
      contenedor.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-cart')) {
          e.preventDefault();
          // Buscar la card del producto
          const card = e.target.closest('.producto-card');
          if (!card) return;
          // Extraer nombre y precio
          const nombre = card.querySelector('h3')?.textContent?.trim() || 'Producto';
          const precioTxt = card.querySelector('.producto-precio')?.textContent?.replace(/[^\d]/g, '') || '0';
          const precio = parseInt(precioTxt, 10) || 0;
          // Buscar talla seleccionada
          let talla = '';
          const tallaBtns = card.querySelectorAll('.talla-btn');
          tallaBtns.forEach(btn => {
            if (btn.classList.contains('selected') || btn.classList.contains('active')) {
              talla = btn.textContent.trim();
            }
          });
          if (!talla) {
            alert('Por favor selecciona una talla antes de añadir al carrito.');
            return;
          }
          // Agregar al carrito
          if (window.agregarAlCarrito) {
            window.agregarAlCarrito({
              id: nombre + '-' + talla,
              nombre: nombre + ' Talla ' + talla,
              precio: precio,
              cantidad: 1,
              talla: talla
            });
          }
        }
        if (e.target.classList.contains('btn-guia-tallas')) {
          e.preventDefault();
          var modal = document.getElementById('modal-guia-tallas');
          if (modal) {
            modal.style.display = 'flex';
            document.getElementById('modal-gt-select').value = 'medida';
            if (typeof mostrarPanelGuiaTallas === 'function') mostrarPanelGuiaTallas('medida');
            if (typeof cambiarImagenGuiaTallas === 'function') cambiarImagenGuiaTallas('medida');
          }
        }
        // Nota: La selección visual de talla ahora se maneja en tallas.js
        // Dejamos este código por compatibilidad con versiones anteriores
        if (e.target.classList.contains('talla-btn')) {
          const tallaBtns = e.target.parentElement.querySelectorAll('.talla-btn');
          tallaBtns.forEach(btn => btn.classList.remove('selected', 'active'));
          e.target.classList.add('selected');
        }
      });
    }
  });
});
