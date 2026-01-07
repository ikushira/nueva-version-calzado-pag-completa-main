// Carrusel Talla Modal Handler
// MODIFICADO: El modal emergente ha sido desactivado para evitar redundancia
// Las tallas se seleccionan directamente en las tarjetas de productos

document.addEventListener('DOMContentLoaded', function() {
  console.log("Inicializando manejo de tallas para carrusel (sin modal)");
  
  // DESACTIVADO: Modal de tallas - ahora se usa la selección inline
  const carruselTallaModal = document.getElementById('carrusel-talla-modal');
  
  // Ocultar permanentemente el modal si existe
  if (carruselTallaModal) {
    carruselTallaModal.style.display = 'none';
    carruselTallaModal.classList.add('oculto');
    console.log("Modal de tallas desactivado - se usa selección inline");
  }
  
  // NO hacer nada más - los botones de añadir al carrito funcionarán con la lógica
  // estándar de carrito-simplificado.js que ya detecta las tallas seleccionadas
  
  console.log("Manejo de tallas para carrusel inicializado correctamente");
});
