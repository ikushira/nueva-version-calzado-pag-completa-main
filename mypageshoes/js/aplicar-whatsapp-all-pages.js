// Script para agregar o corregir el botón de WhatsApp en todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya existe el CSS
    let cssLinkExists = false;
    document.querySelectorAll('link').forEach(link => {
        if (link.href.includes('whatsapp-button.css')) {
            cssLinkExists = true;
        }
    });

    // Agregar el CSS si no existe
    if (!cssLinkExists) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'css/whatsapp-button.css';
        document.head.appendChild(cssLink);
    }

    // Verificar si ya existe el botón flotante
    let whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat) {
        // Crear el botón de WhatsApp si no existe
        const whatsappButton = document.createElement('a');
        whatsappButton.href = 'https://wa.me/57XXXXXXXXXX'; // Reemplazar con el número real
        whatsappButton.className = 'whatsapp-float';
        whatsappButton.target = '_blank';
        whatsappButton.rel = 'noopener';

        const whatsappImg = document.createElement('img');
        whatsappImg.src = 'assets/img/whatsapp.svg';
        whatsappImg.alt = 'WhatsApp';
        
        whatsappButton.appendChild(whatsappImg);
        document.body.appendChild(whatsappButton);
    }
});
