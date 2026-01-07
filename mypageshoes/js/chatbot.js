// Chatbot con IA para Mundo Calzado
class MundoCalzadoChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.productDatabase = this.initializeProductDatabase();
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        // Crear el botón flotante del chatbot
        const chatbotButton = document.createElement('div');
        chatbotButton.className = 'chatbot-float';
        chatbotButton.id = 'chatbot-button';
        chatbotButton.innerHTML = '<i class="fas fa-robot"></i>';
        chatbotButton.setAttribute('aria-label', 'Abrir asistente virtual');
        document.body.appendChild(chatbotButton);

        // Crear el modal del chatbot
        const chatbotModal = document.createElement('div');
        chatbotModal.className = 'chatbot-modal';
        chatbotModal.id = 'chatbot-modal';
        chatbotModal.innerHTML = `
            <div class="chatbot-container">
                <div class="chatbot-header">
                    <h3>🤖 Asistente de Mundo Calzado</h3>
                    <button class="chatbot-close" id="chatbot-close">&times;</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="chatbot-typing" id="chatbot-typing">
                        <div class="typing-indicator">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                </div>
                <div class="chatbot-input-container">
                    <input type="text" class="chatbot-input" id="chatbot-input" 
                           placeholder="Escribe tu pregunta sobre nuestros productos...">
                    <button class="chatbot-send" id="chatbot-send">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(chatbotModal);
    }

    bindEvents() {
        const chatbotButton = document.getElementById('chatbot-button');
        const chatbotModal = document.getElementById('chatbot-modal');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSend = document.getElementById('chatbot-send');

        chatbotButton.addEventListener('click', () => this.toggleChat());
        chatbotClose.addEventListener('click', () => this.closeChat());
        chatbotSend.addEventListener('click', () => this.sendMessage());
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Cerrar al hacer click fuera del chat
        chatbotModal.addEventListener('click', (e) => {
            if (e.target === chatbotModal) this.closeChat();
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        document.getElementById('chatbot-modal').style.display = 'block';
        document.getElementById('chatbot-input').focus();
        this.isOpen = true;
    }

    closeChat() {
        document.getElementById('chatbot-modal').style.display = 'none';
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMessage = "¡Hola! 👋 Soy tu asistente virtual de Mundo Calzado. Estoy aquí para ayudarte a encontrar el calzado perfecto. ¿En qué puedo asistirte hoy?";
        this.addMessage('bot', welcomeMessage);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addMessage('bot', response);
        }, 1000 + Math.random() * 1000);
    }

    addMessage(type, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        document.getElementById('chatbot-typing').style.display = 'block';
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        document.getElementById('chatbot-typing').style.display = 'none';
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Saludos
        if (this.matchesAny(message, ['hola', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'])) {
            return this.getRandomResponse([
                "¡Hola! Bienvenido a Mundo Calzado. ¿En qué puedo ayudarte hoy?",
                "¡Buenos días! ¿Buscas algún tipo de calzado en particular?",
                "¡Hola! Estoy aquí para ayudarte a encontrar el calzado perfecto. ¿Qué necesitas?"
            ]);
        }

        // Productos por categoría
        if (this.matchesAny(message, ['hombres', 'hombre', 'masculino', 'caballero'])) {
            return "Tenemos una excelente selección de calzado para hombres: zapatos formales, deportivos, botas, mocasines y más. Nuestras marcas incluyen Croydon, Patrick, y 24 Walks. ¿Qué tipo específico buscas?";
        }

        if (this.matchesAny(message, ['mujeres', 'mujer', 'femenino', 'dama'])) {
            return "Nuestra colección para mujeres es increíble: tacones, flats, sandalias, botas, deportivos y más. Contamos con marcas como Piccadilly, Moleca, Frattini e Ipanema. ¿Qué estilo prefieres?";
        }

        if (this.matchesAny(message, ['ninos', 'nino', 'infantil', 'escolar'])) {
            return "¡Tenemos calzado perfecto para niños! Zapatos escolares, deportivos y casuales. Nuestras marcas Bubblegummers y Gumball son ideales para los pequeños. ¿Para qué ocasión necesitas el calzado?";
        }

        if (this.matchesAny(message, ['niñas', 'niña'])) {
            return "Para niñas tenemos una hermosa colección: zapatos escolares, sandalias, deportivos y casuales. Las marcas Bubblegummers y Gumball ofrecen diseños encantadores y cómodos. ¿Qué tipo buscas?";
        }

        // Marcas específicas
        if (this.matchesAny(message, ['croydon'])) {
            return "Croydon es una de nuestras marcas premium para hombres, conocida por su calidad y elegancia en zapatos formales y casuales. Perfectos para el trabajo y ocasiones especiales.";
        }

        if (this.matchesAny(message, ['piccadilly'])) {
            return "Piccadilly es una marca brasileña reconocida mundialmente por su comodidad y estilo para mujeres. Perfecta para el día a día con tecnología de confort avanzada.";
        }

        if (this.matchesAny(message, ['bubblegummers'])) {
            return "Bubblegummers es nuestra marca especializada en calzado infantil, diseñada especialmente para brindar comodidad y diversión a los niños. ¡Perfecta para el colegio y el juego!";
        }

        // Tallas
        if (this.matchesAny(message, ['talla', 'tallas', 'medida', 'medidas', 'tamaño'])) {
            return "Manejamos tallas desde la 21 hasta la 45, dependiendo del modelo y marca. Te recomiendo visitar nuestra guía de tallas en la página para encontrar tu medida exacta. ¿Necesitas ayuda con alguna talla específica?";
        }

        // Precios
        if (this.matchesAny(message, ['precio', 'precios', 'costo', 'valor', 'cuánto', 'cuanto'])) {
            return "Nuestros precios varían según la marca y el modelo. Tenemos opciones desde $50.000 hasta $300.000. Siempre manejamos promociones especiales. ¿Te interesa algún producto en particular para darte un precio específico?";
        }

        // Ofertas y promociones
        if (this.matchesAny(message, ['oferta', 'ofertas', 'promoción', 'promociones', 'descuento', 'rebaja'])) {
            return "¡Siempre tenemos ofertas especiales! Visita nuestra sección de ofertas donde encontrarás descuentos de hasta el 40%. También manejamos promociones por compras múltiples. ¿Te gustaría conocer las ofertas actuales?";
        }

        // Envíos
        if (this.matchesAny(message, ['envío', 'envios', 'domicilio', 'entrega', 'delivery'])) {
            return "Realizamos envíos a todo el país. En la ciudad tenemos entrega el mismo día para pedidos antes de las 2 PM. Para otras ciudades, el tiempo es de 2-5 días hábiles. ¡El envío es GRATIS en compras superiores a $150.000!";
        }

        // Devoluciones
        if (this.matchesAny(message, ['devolución', 'devoluciones', 'cambio', 'cambios', 'garantía'])) {
            return "Aceptamos cambios y devoluciones dentro de los 30 días siguientes a la compra, siempre que el producto esté en perfecto estado. La garantía cubre defectos de fabricación por 6 meses.";
        }

        // Deportivos
        if (this.matchesAny(message, ['deportivos', 'deportivo', 'tenis', 'zapatillas', 'running'])) {
            return "Tenemos una amplia gama de calzado deportivo para toda la familia. Marcas como Patrick y 24 Walks ofrecen tecnología de punta para correr, caminar y hacer ejercicio. ¿Para qué deporte específico los necesitas?";
        }

        // Formales
        if (this.matchesAny(message, ['formales', 'formal', 'oficina', 'trabajo', 'elegante'])) {
            return "Nuestros zapatos formales son perfectos para el trabajo y ocasiones especiales. Croydon y Frattini ofrecen diseños clásicos y modernos en cuero genuino. ¿Prefieres algo clásico o más moderno?";
        }

        // Comodidad
        if (this.matchesAny(message, ['cómodo', 'cómodos', 'comodidad', 'confort'])) {
            return "La comodidad es nuestra prioridad. Piccadilly y Moleca son reconocidas por su tecnología de confort. También recomendamos nuestros modelos con plantillas anatómicas. ¿Sufres de algún problema específico en los pies?";
        }

        // Colores
        if (this.matchesAny(message, ['color', 'colores', 'negro', 'café', 'marrón', 'blanco'])) {
            return "Manejamos una amplia variedad de colores: negro, café, marrón, blanco, y muchos más según la temporada. Los colores clásicos como negro y café están siempre disponibles. ¿Qué color específico buscas?";
        }

        // Material
        if (this.matchesAny(message, ['cuero', 'material', 'sintético', 'piel'])) {
            return "Trabajamos con cuero genuino de alta calidad y materiales sintéticos duraderos. El cuero natural lo encuentras en nuestras líneas premium como Croydon y Frattini. ¿Tienes preferencia por algún material específico?";
        }

        // Contacto y ubicación
        if (this.matchesAny(message, ['ubicación', 'dirección', 'dónde', 'donde', 'tienda', 'local'])) {
            return "Puedes visitarnos en nuestra tienda física o comprar en línea. Para conocer nuestra ubicación exacta, puedes contactarnos por WhatsApp. ¡También realizamos envíos a domicilio!";
        }

        // Ayuda general
        if (this.matchesAny(message, ['ayuda', 'ayúdame', 'no sé', 'no se', 'qué recomiendas', 'que recomiendas'])) {
            return "¡Claro! Estoy aquí para ayudarte. Puedo asesorarte sobre nuestros productos, tallas, precios, envíos y más. ¿Podrías contarme qué tipo de calzado buscas y para qué ocasión? Así te daré la mejor recomendación.";
        }

        // Agradecimientos
        if (this.matchesAny(message, ['gracias', 'thank you', 'perfecto', 'excelente', 'muy bien'])) {
            return this.getRandomResponse([
                "¡De nada! Estoy aquí para ayudarte siempre que lo necesites.",
                "¡Es un placer ayudarte! ¿Hay algo más en lo que pueda asistirte?",
                "¡Perfecto! Si necesitas más información, no dudes en preguntarme."
            ]);
        }

        // Despedidas
        if (this.matchesAny(message, ['adiós', 'adios', 'chao', 'bye', 'hasta luego', 'nos vemos'])) {
            return "¡Hasta pronto! Gracias por visitar Mundo Calzado. ¡Espero haberte ayudado a encontrar el calzado perfecto! 👞✨";
        }

        // Respuesta por defecto con sugerencias
        return this.getDefaultResponse();
    }

    matchesAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getDefaultResponse() {
        const suggestions = [
            "Puedo ayudarte con información sobre nuestros productos para hombres, mujeres, niños y niñas.",
            "Te puedo contar sobre nuestras marcas: Croydon, Piccadilly, Frattini, Moleca, Patrick, Bubblegummers y más.",
            "Puedo asesorarte sobre tallas, precios, ofertas, envíos y devoluciones.",
            "¿Te interesa calzado deportivo, formal, casual o para alguna ocasión específica?"
        ];

        return `Lo siento, no entendí completamente tu pregunta. ${this.getRandomResponse(suggestions)} ¿Podrías ser más específico sobre lo que buscas?`;
    }

    initializeProductDatabase() {
        return {
            categories: ['hombres', 'mujeres', 'niños', 'niñas', 'ofertas'],
            brands: ['croydon', 'piccadilly', 'frattini', 'moleca', 'patrick', 'bubblegummers', 'gumball', 'ipanema', 'cartago', '24walks', 'stardus'],
            types: ['deportivos', 'formales', 'casuales', 'botas', 'sandalias', 'tacones', 'flats', 'mocasines'],
            sizes: Array.from({length: 25}, (_, i) => i + 21), // Tallas 21-45
            materials: ['cuero', 'sintético', 'textil', 'lona']
        };
    }
}

// Inicializar el chatbot cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Pequeño delay para asegurar que todos los elementos estén cargados
    setTimeout(() => {
        new MundoCalzadoChatbot();
    }, 500);
});

// Exportar para uso en otros scripts si es necesario
window.MundoCalzadoChatbot = MundoCalzadoChatbot;
