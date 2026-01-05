// Carrusel de novedades usando imágenes de carrusel2
// Requiere que js/secciones_js/Carrusel2_fotos.js esté cargado antes

window.addEventListener('DOMContentLoaded', function() {
  const novedadesCarousel = document.getElementById('novedades-carousel');
  const prevBtn = document.getElementById('novedades-carousel-prev');
  const nextBtn = document.getElementById('novedades-carousel-next');
  const indicators = document.getElementById('novedades-carousel-indicators');

  if (!novedadesCarousel || typeof imagenesCarrusel2 === 'undefined' || !Array.isArray(imagenesCarrusel2) || imagenesCarrusel2.length === 0) {
    console.error('Novedades: No se encontró el contenedor o la lista de imágenes está vacía.');
    return;
  }

  // Configuración: cuántas tarjetas por slide
  const CARDS_PER_SLIDE = 4;
  const totalSlides = Math.ceil(imagenesCarrusel2.length / CARDS_PER_SLIDE);

  // Renderizar slides
  novedadesCarousel.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const slide = document.createElement('div');
    slide.className = 'novedades-slide';
    if (i === 0) slide.style.display = 'flex';
    else slide.style.display = 'none';
    slide.style.gap = '24px';
    slide.style.justifyContent = 'center';
    slide.style.alignItems = 'stretch';
    for (let j = 0; j < CARDS_PER_SLIDE; j++) {
      const idx = i * CARDS_PER_SLIDE + j;
      if (idx >= imagenesCarrusel2.length) break;
      const src = imagenesCarrusel2[idx];
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.innerHTML = `
        <div class="img-producto-wrapper" style="width:100%;height:180px;display:flex;align-items:center;justify-content:center;background:#eaf3fb;overflow:hidden;border-radius:16px 16px 0 0;box-sizing:border-box;">
          <img src="${src}" alt="Producto ${idx+1}" loading="lazy" style="max-width:92%;max-height:92%;margin:auto;display:block;object-fit:contain;" />
        </div>
        <div class="producto-info" style="padding:0 12px 18px 12px;display:flex;flex-direction:column;align-items:center;">
          <h3 class="producto-nombre" style="margin-bottom:8px;font-size:1.15rem;font-weight:700;color:#232323;text-align:center;">Producto ${idx+1}</h3>
          <p class="producto-precio" style="margin-bottom:12px;color:#0d6efd;font-weight:bold;font-size:1.1rem;text-align:center;">$129.900</p>
          <div class="producto-tallas" style="margin-bottom:12px;width:100%;">
            <div class="tallas-label" style="margin-bottom:6px;font-size:0.98rem;color:#555;text-align:left;">Selecciona tu talla:</div>
            <div class="tallas-list" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:8px;">
              <button type="button" class="talla-btn">35</button>
              <button type="button" class="talla-btn">36</button>
              <button type="button" class="talla-btn">37</button>
              <button type="button" class="talla-btn">38</button>
              <button type="button" class="talla-btn">39</button>
              <button type="button" class="talla-btn">40</button>
              <button type="button" class="talla-btn">41</button>
              <button type="button" class="talla-btn">42</button>
            </div>
            <button type="button" class="btn-guia-tallas" style="width:100%;margin-bottom:0;">Guía de tallas</button>
          </div>
          <button class="btn-add-cart" style="width:100%;margin-top:auto;">Añadir al carrito</button>
        </div>
      `;
      slide.appendChild(card);
    }
    novedadesCarousel.appendChild(slide);
  }

  // Renderizar indicadores
  indicators.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.className = 'novedades-indicator' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    indicators.appendChild(dot);
  }

  let current = 0;
  const slides = novedadesCarousel.querySelectorAll('.novedades-slide');
  const dots = indicators.querySelectorAll('.novedades-indicator');

  function goToSlide(idx) {
    slides[current].style.display = 'none';
    dots[current].classList.remove('active');
    current = idx;
    slides[current].style.display = 'flex';
    dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }
  function prevSlide() {
    goToSlide((current - 1 + slides.length) % slides.length);
  }

  if (nextBtn) nextBtn.onclick = nextSlide;
  if (prevBtn) prevBtn.onclick = prevSlide;

  // Autoplay opcional
  let autoplay = setInterval(nextSlide, 5000);
  novedadesCarousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  novedadesCarousel.addEventListener('mouseleave', () => { autoplay = setInterval(nextSlide, 5000); });
});
