// Búsqueda global para todas las páginas
function activarBusquedaGlobal() {
  const input = document.getElementById('main-search');
  if (!input) return;
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const valor = this.value.trim().toLowerCase();
      if (!valor) return;
      // Palabras clave y rutas
      const rutas = [
        { palabras: ['nuevo', 'nuevos', 'lo nuevo'], url: 'nuevos.html' },
        { palabras: ['mujer', 'mujeres', 'dama', 'damas'], url: 'mujeres.html' },
        { palabras: ['hombre', 'hombres', 'caballero', 'caballeros'], url: 'hombres.html' },
        { palabras: ['niña', 'niñas', 'nina', 'ninas'], url: 'ninas.html' },
        { palabras: ['niño', 'niños', 'nino', 'ninos'], url: 'ninos.html' },
        { palabras: ['colegial', 'colegiales', 'escolar', 'escolares'], url: 'colegiales.html' },
        { palabras: ['dotacion', 'dotación', 'trabajo', 'industrial'], url: 'dotacion.html' },
        { palabras: ['marca', 'marcas'], url: 'marcas.html' },
        { palabras: ['oferta', 'ofertas', 'descuento', 'promocion'], url: 'ofertas.html' }
      ];
      let destino = null;
      for (const ruta of rutas) {
        if (ruta.palabras.some(p => valor.includes(p))) {
          destino = ruta.url;
          break;
        }
      }
      // Si no es una sección, buscar producto por nombre en la página actual
      if (!destino) {
        const productos = document.querySelectorAll('.producto-card h3');
        let encontrado = false;
        productos.forEach(card => {
          if (card.textContent.toLowerCase().includes(valor)) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.parentElement.parentElement.classList.add('resaltado-busqueda');
            setTimeout(() => card.parentElement.parentElement.classList.remove('resaltado-busqueda'), 2000);
            encontrado = true;
          }
        });
        if (!encontrado) {
          alert('No se encontró ningún producto relacionado. Prueba con otra palabra clave.');
        }
      } else {
        window.location.href = destino;
      }
    }
  });
}
// Resaltado visual para producto encontrado
const style = document.createElement('style');
style.innerHTML = `.resaltado-busqueda { box-shadow: 0 0 0 4px #1a8cff99 !important; transition: box-shadow 0.3s; }`;
document.head.appendChild(style);
// Activar en todas las páginas
window.addEventListener('DOMContentLoaded', activarBusquedaGlobal);
