// Lista de imágenes para la sección Carrusel 2
// Agrega aquí las rutas de las imágenes de productos para carrusel2

// Función para detectar la ruta base correctamente
function getCarrusel2BasePath() {
    // Buscar el script actual para determinar la ruta
    const scripts = document.querySelectorAll('script[src*="Carrusel2_fotos.js"]');
    for (let script of scripts) {
        const src = script.getAttribute('src');
        if (src && src.includes('Carrusel2_fotos.js')) {
            // Si el src incluye 'mypageshoes/', estamos en la raíz
            if (src.includes('mypageshoes/')) {
                return './mypageshoes/';
            }
            // Si no, estamos dentro de mypageshoes
            return './';
        }
    }
    // Fallback
    return './mypageshoes/';
}

const carrusel2BasePath = getCarrusel2BasePath();
console.log('Carrusel2 base path:', carrusel2BasePath);

const imagenesCarrusel2 = [
  carrusel2BasePath + 'assets/img/carrusel2/2.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/3.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/4.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/5.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/6.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/7.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/8.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/9.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/10.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/11.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/12.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/13.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/14.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/15.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/16.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/17.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/18.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/19.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/20.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/21.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/22.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/23.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/24.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/25.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/26.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/27.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/28.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/29.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/30.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/31.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/32.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/33.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/34.jpeg',
  carrusel2BasePath + 'assets/img/carrusel2/zapato1.jpeg',
];
