/**
 * checkout-error.js
 * Funcionalidad para la página de error del checkout
 * Maneja los errores de pago y proporciona información útil al usuario
 */

class CheckoutError {
    constructor() {
        this.errorMessages = {
            'insufficient_funds': 'Fondos insuficientes en la tarjeta.',
            'card_declined': 'La tarjeta fue rechazada por el banco.',
            'expired_card': 'La tarjeta ha expirado.',
            'invalid_card': 'Información de tarjeta inválida.',
            'network_error': 'Error de conexión. Intenta nuevamente.',
            'bank_error': 'Error del banco emisor.',
            'security_error': 'Error de seguridad. Contacta tu banco.',
            'limit_exceeded': 'Límite de la tarjeta excedido.',
            'session_expired': 'La sesión de pago ha expirado.',
            'payment_cancelled': 'El pago fue cancelado por el usuario.',
            'invalid_amount': 'Monto inválido para la transacción.',
            'merchant_error': 'Error del comercio. Contacta soporte.'
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupErrorPage());
        } else {
            this.setupErrorPage();
        }
    }

    setupErrorPage() {
        try {
            // Obtener parámetros de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const errorCode = urlParams.get('error_code');
            const errorMessage = urlParams.get('error_message');
            const transactionId = urlParams.get('transaction_id');
            
            // Mostrar información del error
            this.displayErrorInfo(errorCode, errorMessage, transactionId);
            
            // Registrar evento de error para analytics
            this.trackPaymentError(errorCode, errorMessage);
            
            // Guardar información del error para soporte
            this.saveErrorInfo(errorCode, errorMessage, transactionId);
            
            // Configurar botones de acción
            this.setupActionButtons();
            
        } catch (error) {
            console.error('Error configurando página de error:', error);
        }
    }

    displayErrorInfo(errorCode, errorMessage, transactionId) {
        const errorReasonElement = document.getElementById('errorReason');
        
        if (!errorReasonElement) {
            console.warn('Elemento errorReason no encontrado');
            return;
        }

        let displayMessage = '';

        // Usar mensaje personalizado si existe
        if (errorMessage) {
            displayMessage = decodeURIComponent(errorMessage);
        } 
        // Usar mensaje predefinido basado en código
        else if (errorCode && this.errorMessages[errorCode]) {
            displayMessage = this.errorMessages[errorCode];
        }
        // Mensaje genérico
        else {
            displayMessage = 'Hubo un problema procesando tu pago. Por favor, intenta nuevamente.';
        }

        errorReasonElement.textContent = displayMessage;

        // Mostrar ID de transacción si existe
        if (transactionId) {
            const transactionElement = document.getElementById('transactionId');
            if (transactionElement) {
                transactionElement.textContent = transactionId;
                transactionElement.parentElement.style.display = 'block';
            }
        }

        // Agregar recomendaciones específicas
        this.addRecommendations(errorCode);
    }

    addRecommendations(errorCode) {
        const recommendationsElement = document.getElementById('recommendations');
        if (!recommendationsElement) return;

        let recommendations = [];

        switch (errorCode) {
            case 'insufficient_funds':
                recommendations = [
                    'Verifica el saldo disponible en tu tarjeta',
                    'Intenta con otra tarjeta',
                    'Contacta tu banco para más información'
                ];
                break;
            case 'card_declined':
                recommendations = [
                    'Verifica que los datos de la tarjeta sean correctos',
                    'Contacta tu banco para verificar restricciones',
                    'Intenta con otra tarjeta de pago'
                ];
                break;
            case 'expired_card':
                recommendations = [
                    'Usa una tarjeta vigente',
                    'Contacta tu banco para renovar la tarjeta'
                ];
                break;
            case 'network_error':
                recommendations = [
                    'Verifica tu conexión a internet',
                    'Intenta nuevamente en unos minutos',
                    'Recarga la página y vuelve a intentar'
                ];
                break;
            default:
                recommendations = [
                    'Verifica que todos los datos sean correctos',
                    'Intenta con otro método de pago',
                    'Si el problema persiste, contacta soporte'
                ];
        }

        // Crear lista de recomendaciones
        const ul = document.createElement('ul');
        ul.className = 'error-recommendations';
        
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            ul.appendChild(li);
        });

        recommendationsElement.appendChild(ul);
    }

    trackPaymentError(errorCode, errorMessage) {
        try {
            // Google Analytics 4
            if (window.gtag) {
                gtag('event', 'payment_error', {
                    error_code: errorCode || 'unknown',
                    error_message: errorMessage || 'Unknown error',
                    page_title: 'Checkout Error'
                });
            }

            // Facebook Pixel
            if (window.fbq) {
                fbq('track', 'PaymentInfoFailed', {
                    error_code: errorCode
                });
            }

            console.log('Evento de error de pago registrado:', { errorCode, errorMessage });
        } catch (error) {
            console.error('Error registrando evento de error:', error);
        }
    }

    saveErrorInfo(errorCode, errorMessage, transactionId) {
        try {
            const errorInfo = {
                errorCode: errorCode,
                errorMessage: errorMessage,
                transactionId: transactionId,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            // Guardar en localStorage para soporte
            let errorHistory = JSON.parse(localStorage.getItem('paymentErrors') || '[]');
            errorHistory.unshift(errorInfo);
            
            // Limitar a últimos 10 errores
            if (errorHistory.length > 10) {
                errorHistory = errorHistory.slice(0, 10);
            }

            localStorage.setItem('paymentErrors', JSON.stringify(errorHistory));
            localStorage.setItem('lastPaymentError', JSON.stringify(errorInfo));

        } catch (error) {
            console.error('Error guardando información de error:', error);
        }
    }

    setupActionButtons() {
        // Botón volver al carrito
        const cartButton = document.getElementById('backToCart');
        if (cartButton) {
            cartButton.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }

        // Botón contactar soporte
        const supportButton = document.getElementById('contactSupport');
        if (supportButton) {
            supportButton.addEventListener('click', () => {
                this.openSupportChannel();
            });
        }

        // Botón intentar de nuevo
        const retryButton = document.getElementById('retryPayment');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }
    }

    openSupportChannel() {
        // Preparar información para soporte
        const errorInfo = localStorage.getItem('lastPaymentError');
        let supportMessage = 'Hola, tuve un problema con mi pago en Mundo Calzado.';
        
        if (errorInfo) {
            try {
                const error = JSON.parse(errorInfo);
                supportMessage += ` Código de error: ${error.errorCode || 'N/A'}. `;
                if (error.transactionId) {
                    supportMessage += `ID de transacción: ${error.transactionId}. `;
                }
            } catch (e) {
                // Continuar sin información adicional
            }
        }

        // Abrir WhatsApp con mensaje predefinido
        const whatsappNumber = '57XXXXXXXXXX'; // Reemplazar con número real
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(supportMessage)}`;
        
        window.open(whatsappUrl, '_blank');
    }

    // Método para limpiar errores antiguos
    clearOldErrors() {
        try {
            localStorage.removeItem('paymentErrors');
            localStorage.removeItem('lastPaymentError');
            console.log('Historial de errores limpiado');
        } catch (error) {
            console.error('Error limpiando historial de errores:', error);
        }
    }
}

// Inicializar cuando se carga la página
if (typeof window !== 'undefined') {
    window.checkoutError = new CheckoutError();
}
