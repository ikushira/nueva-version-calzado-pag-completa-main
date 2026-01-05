// Carrusel 2 modular limpio y robusto
// Requiere que js/secciones_js/Carrusel2_fotos.js esté cargado antes

(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    const carrusel2 = document.getElementById('carrusel2-carousel');
    const prevBtn = document.getElementById('carrusel2-prev');
    const nextBtn = document.getElementById('carrusel2-next');
    const indicators = document.getElementById('carrusel2-indicators');
    if (!carrusel2 || typeof imagenesCarrusel2 === 'undefined' || !Array.isArray(imagenesCarrusel2) || imagenesCarrusel2.length === 0) {
      console.error('Carrusel2: No se encontró el contenedor o la lista de imágenes está vacía.');
      return;
    }
    carrusel2.innerHTML = '';
    indicators.innerHTML = '';
    // Renderizar slides
    imagenesCarrusel2.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'carrusel2-slide' + (idx === 0 ? ' active' : '');
      slide.innerHTML = `<img src="${src}" alt="Carrusel 2 - ${idx+1}" loading="lazy">`;
      carrusel2.appendChild(slide);
    });
    // Renderizar indicadores
    imagenesCarrusel2.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'carrusel2-indicator' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      indicators.appendChild(dot);
    });
    let current = 0;
    const slides = carrusel2.querySelectorAll('.carrusel2-slide');
    const dots = indicators.querySelectorAll('.carrusel2-indicator');
    function goToSlide(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = idx;
      slides[current].classList.add('active');
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
    // Autoplay
    let autoplay = setInterval(nextSlide, 5000);
    carrusel2.addEventListener('mouseenter', () => clearInterval(autoplay));
    carrusel2.addEventListener('mouseleave', () => { autoplay = setInterval(nextSlide, 5000); });
  });
})();

// CSS necesario (añadido en styles.css):
// .carrusel2-slide { display: none; }
// .carrusel2-slide.active { display: flex; justify-content: center; align-items: center; }
