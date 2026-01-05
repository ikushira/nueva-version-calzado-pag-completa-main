// Script para añadir el nuevo archivo CSS y corregir las tarjetas dinámicamente

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el archivo CSS ya está incluido
    const cssLoaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some(link => link.href.includes('image-size-fix.css'));
    
    if (!cssLoaded) {
        // Crear el elemento link para el nuevo CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = './css/image-size-fix.css';
        
        // Añadir el CSS al final del head para que tenga prioridad
        document.head.appendChild(linkElement);
        console.log('CSS para corregir tamaño de imágenes cargado correctamente');
    }
    
    // Aplicar los ajustes a las tarjetas ya existentes
    ajustarTarjetasProductos();
    
    // Observar si se añaden nuevas tarjetas de productos (generadas dinámicamente)
    observarCambiosDeCatalogo();
});

// Verificar si estamos en una página de productos y aplicar estilos específicos
function ajustarTarjetasProductos() {
    // Seleccionar todas las tarjetas de productos
    const tarjetas = document.querySelectorAll('.producto-card');
    
    if (tarjetas.length > 0) {
        console.log(`Aplicando estilos a ${tarjetas.length} tarjetas de productos`);
        
        tarjetas.forEach(tarjeta => {
            // Asegurar que cada tarjeta tenga un contenedor de imagen con las dimensiones correctas
            let imgContainer = tarjeta.querySelector('.img-container');
            
            if (imgContainer) {
                // Asegurar que el contenedor tiene las dimensiones correctas
                imgContainer.style.height = '320px';
                imgContainer.style.padding = '10px';
                
                // Asegurar que la imagen se ajusta correctamente dentro del contenedor
                const imagen = imgContainer.querySelector('img');
                if (imagen) {
                    imagen.style.maxWidth = '100%';
                    imagen.style.maxHeight = '100%';
                    imagen.style.objectFit = 'contain';
                }
            }
            
            // Ajustar la altura de la tarjeta
            tarjeta.style.height = tarjeta.classList.contains('producto-card-marca') ? '180px' : '520px';
        });
    }
}

// Observar cambios en el DOM para detectar cuándo se añaden tarjetas dinámicamente
function observarCambiosDeCatalogo() {
    // Buscar todos los contenedores de catálogo
    const catalogosContainers = document.querySelectorAll('[id^="catalogo-"]');
    
    if (catalogosContainers.length > 0) {
        // Configurar un observador para cada contenedor de catálogo
        const observer = new MutationObserver(function(mutations) {
            // Si se detectan cambios, ajustar las tarjetas
            ajustarTarjetasProductos();
        });
        
        // Opciones de observación (observar cambios en hijos)
        const config = { childList: true, subtree: true };
        
        // Iniciar observación para cada contenedor
        catalogosContainers.forEach(container => {
            observer.observe(container, config);
            console.log(`Observando cambios en el contenedor ${container.id}`);
        });
    }
}
