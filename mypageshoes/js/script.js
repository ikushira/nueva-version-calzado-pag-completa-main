
// Script para Mundo Calzado - Carruseles y funcionalidades

document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================
    // CARRUSEL BANNER PRINCIPAL (DINÁMICO)
    // ===============================
    const bannerCarousel = document.getElementById('banner-carousel');
    const bannerIndicatorsContainer = document.getElementById('banner-carousel-indicators');
    const bannerPrevBtn = document.getElementById('banner-carousel-prev');
    const bannerNextBtn = document.getElementById('banner-carousel-next');
    let bannerSlides = [];
    let bannerIndicators = [];
    let bannerCurrentIndex = 0;
    let bannerInterval = null;

    function showBannerSlide(index) {
        bannerSlides.forEach(slide => slide.classList.remove('active'));
        bannerIndicators.forEach(indicator => indicator.classList.remove('active'));
        bannerSlides[index].classList.add('active');
        bannerIndicators[index].classList.add('active');
        bannerCurrentIndex = index;
    }

    function nextBannerSlide() {
        const nextIndex = (bannerCurrentIndex + 1) % bannerSlides.length;
        showBannerSlide(nextIndex);
    }

    function prevBannerSlide() {
        const prevIndex = (bannerCurrentIndex - 1 + bannerSlides.length) % bannerSlides.length;
        showBannerSlide(prevIndex);
    }

    function startBannerAutoplay() {
        if (bannerInterval) clearInterval(bannerInterval);
        bannerInterval = setInterval(nextBannerSlide, 5000);
    }

    function stopBannerAutoplay() {
        if (bannerInterval) clearInterval(bannerInterval);
    }

    // Cargar imágenes del carrusel desde JSON
    fetch('assets/img/carrusel1/imagenes-carrusel1.json')
        .then(response => response.json())
        .then(imagenes => {
            // Limpiar slides e indicadores existentes
            bannerCarousel.innerHTML = '';
            bannerIndicatorsContainer.innerHTML = '';

            // Crear slides e indicadores dinámicamente
            imagenes.forEach((src, idx) => {
                const slide = document.createElement('div');
                slide.className = 'banner-slide';
                if (idx === 0) slide.classList.add('active');
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Banner ${idx + 1}`;
                img.loading = 'lazy';
                slide.appendChild(img);
                bannerCarousel.appendChild(slide);

                const indicator = document.createElement('span');
                indicator.className = 'banner-indicator';
                if (idx === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => showBannerSlide(idx));
                bannerIndicatorsContainer.appendChild(indicator);
            });

            // Actualizar referencias
            bannerSlides = Array.from(document.querySelectorAll('.banner-slide'));
            bannerIndicators = Array.from(document.querySelectorAll('.banner-indicator'));
            bannerCurrentIndex = 0;

            // Listeners
            if (bannerNextBtn) bannerNextBtn.addEventListener('click', nextBannerSlide);
            if (bannerPrevBtn) bannerPrevBtn.addEventListener('click', prevBannerSlide);

            // Autoplay
            startBannerAutoplay();

            // Pausar autoplay al hacer hover
            bannerCarousel.addEventListener('mouseenter', stopBannerAutoplay);
            bannerCarousel.addEventListener('mouseleave', startBannerAutoplay);
        })
        .catch(err => {
            console.error('Error cargando imágenes del carrusel principal:', err);
        });

    // ===============================
    // CARRUSEL DE PRODUCTOS
    // ===============================
    const carousel = document.getElementById('carousel');
    const carouselPrevBtn = document.getElementById('carousel-prev');
    const carouselNextBtn = document.getElementById('carousel-next');
    
    if (!carousel) return; // Salir si no existe el carrusel

    // Limpiar el carrusel
    carousel.innerHTML = '';

    // Generar slides de productos (2.jpeg a 34.jpeg)
    for (let i = 2; i <= 34; i++) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        slide.innerHTML = `
            <img src="assets/img/${i}.jpeg" alt="Producto ${i}" loading="lazy">
            <div class="carousel-caption">
                <h3>Producto ${i}</h3>
                <span>$129.900</span>
                <button class="btn-blue">Añadir al carrito</button>
            </div>
        `;
        
        carousel.appendChild(slide);
    }

    // Variables del carrusel
    let currentPosition = 0;
    const totalSlides = 33; // Del 2 al 34 = 33 productos
    let autoPlayInterval = null;
    
    // Función para obtener cuántos productos mostrar según el ancho de pantalla
    function getVisibleProducts() {
        const width = window.innerWidth;
        if (width <= 600) return 1;
        if (width <= 900) return 2;
        if (width <= 1200) return 3;
        return 4;
    }

    // Función para calcular el ancho de un slide (incluyendo márgenes)
    function getSlideWidth() {
        const width = window.innerWidth;
        if (width <= 600) return 300; // 280px + 20px margin
        if (width <= 900) return 200; // 180px + 20px margin
        if (width <= 1200) return 220; // 200px + 20px margin
        return 240; // 220px + 20px margen
    }

    // Función para actualizar la posición del carrusel
    function updateCarousel() {
        const slideWidth = getSlideWidth();
        const visibleProducts = getVisibleProducts();
        const maxPosition = Math.max(0, totalSlides - visibleProducts);
        
        // Limitar la posición
        if (currentPosition < 0) currentPosition = 0;
        if (currentPosition > maxPosition) currentPosition = maxPosition;
        
        // El ancho del carrusel es 100% del contenedor, los slides controlan el tamaño
        carousel.style.width = '';
        
        // Aplicar transformación
        const translateX = -(currentPosition * slideWidth);
        carousel.style.transform = `translateX(${translateX}px)`;
        
        // Actualizar estado de botones
        if (carouselPrevBtn) {
            carouselPrevBtn.disabled = (currentPosition === 0);
        }
        if (carouselNextBtn) {
            carouselNextBtn.disabled = (currentPosition >= maxPosition);
        }
    }

    // Función para avanzar automáticamente el carrusel
    function nextSlide() {
        const visibleProducts = getVisibleProducts();
        const maxPosition = Math.max(0, totalSlides - visibleProducts);
        
        currentPosition++;
        
        // Si llegamos al final, volver al inicio
        if (currentPosition > maxPosition) {
            currentPosition = 0;
        }
        
        updateCarousel();
    }

    // Función para retroceder el carrusel
    function prevSlide() {
        const visibleProducts = getVisibleProducts();
        const maxPosition = Math.max(0, totalSlides - visibleProducts);
        
        currentPosition--;
        
        // Si estamos al inicio, ir al final
        if (currentPosition < 0) {
            currentPosition = maxPosition;
        }
        
        updateCarousel();
    }

    // Función para iniciar auto-play
    function startAutoPlay() {
        stopAutoPlay(); // Detener cualquier auto-play previo
        autoPlayInterval = setInterval(nextSlide, 5000); // Cambiar cada 5 segundos
        console.log('Auto-play del carrusel iniciado (cada 5 segundos)');
    }

    // Función para detener auto-play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log('Auto-play del carrusel detenido');
        }
    }

    // Event listeners para navegación manual
    if (carouselPrevBtn) {
        carouselPrevBtn.addEventListener('click', function() {
            stopAutoPlay(); // Detener auto-play al hacer clic manual
            prevSlide();
            setTimeout(startAutoPlay, 10000); // Reanudar auto-play después de 10 segundos
        });
    }

    if (carouselNextBtn) {
        carouselNextBtn.addEventListener('click', function() {
            stopAutoPlay(); // Detener auto-play al hacer clic manual
            nextSlide();
            setTimeout(startAutoPlay, 10000); // Reanudar auto-play después de 10 segundos
        });
    }

    // Detener auto-play cuando el usuario hace hover sobre el carrusel
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Actualizar carrusel al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        updateCarousel();
    });

    // Inicializar carrusel
    updateCarousel();
    
    // Iniciar auto-play después de 3 segundos
    setTimeout(startAutoPlay, 3000);

    // ===============================
    // FUNCIONALIDADES ADICIONALES
    // ===============================
    
    // Botones "Añadir al carrito" en carrusel principal y novedades
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-blue') && e.target.textContent === 'Añadir al carrito') {
            e.preventDefault();
            // Buscar la card del producto
            const card = e.target.closest('.carousel-slide, .novedades-carousel-slide');
            if (!card) return;
            // Extraer nombre y precio
            const nombre = card.querySelector('h3')?.textContent?.trim() || 'Producto';
            const precioTxt = card.querySelector('span')?.textContent?.replace(/[^\d]/g, '') || '0';
            const precio = parseInt(precioTxt, 10) || 0;
            // Buscar talla seleccionada (si existiera)
            let talla = '';
            const tallaBtns = card.querySelectorAll('.talla-btn');
            tallaBtns.forEach(btn => {
                if (btn.classList.contains('selected') || btn.classList.contains('active')) {
                    talla = btn.textContent.trim();
                }
            });
            // Si hay selector de talla y no se ha elegido, pedirla
            if (tallaBtns.length > 0 && !talla) {
                alert('Por favor selecciona una talla antes de añadir al carrito.');
                return;
            }
            // Agregar al carrito
            if (window.agregarAlCarrito) {
                window.agregarAlCarrito({
                    id: nombre + (talla ? '-' + talla : ''),
                    nombre: nombre + (talla ? ' Talla ' + talla : ''),
                    precio: precio,
                    cantidad: 1,
                    talla: talla
                });
            }
        }
        // Selección visual de talla en carrusel
        if (e.target.classList.contains('talla-btn')) {
            const tallaBtns = e.target.parentElement.querySelectorAll('.talla-btn');
            tallaBtns.forEach(btn => btn.classList.remove('selected', 'active'));
            e.target.classList.add('selected');
        }
    });

    console.log('Mundo Calzado - Scripts cargados correctamente');
});
