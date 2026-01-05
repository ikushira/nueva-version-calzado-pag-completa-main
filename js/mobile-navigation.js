/**
 * mobile-navigation.js
 * JavaScript para la funcionalidad del menú móvil hamburguesa
 */

class MobileNavigation {
    constructor() {
        this.init();
    }

    init() {
        // Crear elementos del menú móvil si no existen
        this.createMobileMenuElements();
        
        // Bind events
        this.bindEvents();
        
        // Configurar estado inicial
        this.setupInitialState();
    }

    createMobileMenuElements() {
        // Verificar si ya existen los elementos
        if (document.querySelector('.mobile-menu-toggle')) {
            return;
        }

        // Crear botón hamburguesa
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        mobileToggle.innerHTML = `
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';

        // Crear botón cerrar en el menú
        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-menu-close';
        closeButton.setAttribute('aria-label', 'Cerrar menú de navegación');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';

        // Insertar elementos en el DOM
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            // Insertar botón hamburguesa al inicio del header
            headerContent.insertBefore(mobileToggle, headerContent.firstChild);
        }

        // Insertar overlay en el body
        document.body.appendChild(overlay);

        // Insertar botón cerrar en la navegación
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.insertBefore(closeButton, mainNav.firstChild);
        }
    }

    bindEvents() {
        // Event listeners para abrir/cerrar menú
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const closeButton = document.querySelector('.mobile-menu-close');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const navLinks = document.querySelectorAll('.main-nav ul li a');

        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleMenu());
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeMenu());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeMenu());
        }

        // Cerrar menú al hacer click en links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });

        // Manejar cambios de tamaño de pantalla
        window.addEventListener('resize', () => this.handleResize());

        // Manejar tecla ESC para cerrar menú
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    setupInitialState() {
        // Marcar la página actual en el menú
        this.setActiveNavItem();
        
        // Asegurar que el menú esté cerrado inicialmente
        this.closeMenu();
    }

    toggleMenu() {
        const nav = document.querySelector('.main-nav');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const toggleButton = document.querySelector('.mobile-menu-toggle');

        if (nav && overlay && toggleButton) {
            const isOpen = nav.classList.contains('active');
            
            if (isOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }
    }

    openMenu() {
        const nav = document.querySelector('.main-nav');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const toggleButton = document.querySelector('.mobile-menu-toggle');

        if (nav && overlay && toggleButton) {
            nav.classList.add('active');
            overlay.classList.add('active');
            toggleButton.classList.add('active');
            
            // Prevenir scroll en el body
            document.body.style.overflow = 'hidden';
            
            // Focus en el primer link del menú para accesibilidad
            const firstLink = nav.querySelector('ul li a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    }

    closeMenu() {
        const nav = document.querySelector('.main-nav');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const toggleButton = document.querySelector('.mobile-menu-toggle');

        if (nav && overlay && toggleButton) {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            toggleButton.classList.remove('active');
            
            // Restaurar scroll en el body
            document.body.style.overflow = '';
        }
    }

    handleResize() {
        // Cerrar menú si se cambia a pantalla grande
        if (window.innerWidth > 768) {
            this.closeMenu();
        }
    }

    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.main-nav ul li a');

        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const linkHref = link.getAttribute('href');
            if (linkHref) {
                const linkPage = linkHref.split('/').pop();
                if (linkPage === currentPage || 
                    (currentPage === '' && linkPage === 'index.html') ||
                    (currentPage === 'index.html' && linkHref === './')) {
                    link.classList.add('active');
                }
            }
        });
    }
}

// Función para agregar estilos dinámicos si es necesario
function addMobileNavigationStyles() {
    // Verificar si ya se agregaron los estilos
    if (document.querySelector('#mobile-nav-styles')) {
        return;
    }

    const styles = document.createElement('style');
    styles.id = 'mobile-nav-styles';
    styles.textContent = `
        /* Estilos adicionales para compatibilidad */
        @media (max-width: 768px) {
            .main-nav {
                position: fixed !important;
            }
            
            .mobile-menu-toggle {
                z-index: 10000;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos adicionales
    addMobileNavigationStyles();
    
    // Inicializar navegación móvil
    window.mobileNav = new MobileNavigation();
    
    console.log('🎯 Navegación móvil inicializada');
});

// Hacer disponible globalmente para debugging
window.MobileNavigation = MobileNavigation;
