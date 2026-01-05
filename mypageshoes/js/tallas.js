// Script para inicializar eventos de selección de talla
// Este script se encarga específicamente de manejar los botones de talla

document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando eventos de selección de tallas");
    
    // Función para inicializar los botones de talla
    function inicializarBotonesTalla() {
        const botonesTalla = document.querySelectorAll('.talla-btn');
        console.log(`Se encontraron ${botonesTalla.length} botones de talla`);
        
        botonesTalla.forEach(boton => {
            // Evitar duplicar event listeners
            if (boton.dataset.tallaEnlazada === 'true') {
                return;
            }
            
            // Eliminar eventos anteriores (clonar y reemplazar)
            const nuevoBoton = boton.cloneNode(true);
            boton.parentNode.replaceChild(nuevoBoton, boton);
            
            // Agregar nuevo listener
            nuevoBoton.addEventListener('click', function() {
                console.log(`Talla seleccionada: ${nuevoBoton.textContent.trim()}`);
                
                // Buscar todos los botones en el mismo grupo de tallas
                const grupoBotones = nuevoBoton.closest('.tallas-list').querySelectorAll('.talla-btn');
                
                // Quitar clase selected de todos los botones
                grupoBotones.forEach(btn => {
                    btn.classList.remove('selected', 'active');
                });
                
                // Agregar clase selected al botón clickeado
                nuevoBoton.classList.add('selected');
            });
            
            // Marcar como inicializado
            nuevoBoton.dataset.tallaEnlazada = 'true';
        });
        
        // Programar siguiente comprobación para nuevos botones
        setTimeout(inicializarBotonesTalla, 2000);
    }
    
    // Iniciar
    inicializarBotonesTalla();
    
    // Si se cargan productos dinámicamente, volver a inicializar después
    // Este evento personalizado puede ser disparado después de cargar productos
    document.addEventListener('productosActualizados', inicializarBotonesTalla);
});
