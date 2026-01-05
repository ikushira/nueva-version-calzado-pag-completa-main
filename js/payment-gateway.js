// Payment Gateway - Sistema de pasarela de pagos unificado
class PaymentGateway {
    constructor() {
        this.providers = {
            mercadopago: {
                name: 'MercadoPago',
                publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || 'TEST-pub-key',
                accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-access-token',
                environment: 'sandbox' // 'sandbox' o 'production'
            },
            payu: {
                name: 'PayU',
                merchantId: process.env.PAYU_MERCHANT_ID || 'TEST-merchant',
                accountId: process.env.PAYU_ACCOUNT_ID || 'TEST-account',
                apiKey: process.env.PAYU_API_KEY || 'TEST-api-key',
                environment: 'sandbox'
            },
            wompi: {
                name: 'Wompi',
                publicKey: process.env.WOMPI_PUBLIC_KEY || 'pub_test_key',
                privateKey: process.env.WOMPI_PRIVATE_KEY || 'prv_test_key',
                environment: 'sandbox'
            }
        };

        this.currentProvider = 'mercadopago'; // Proveedor por defecto
        this.init();
    }

    init() {
        console.log('Inicializando Payment Gateway');
        this.setupProviders();
    }

    // Configurar proveedores de pago
    async setupProviders() {
        try {
            // Inicializar MercadoPago
            await this.initMercadoPago();
            
            // Inicializar otros proveedores
            await this.initPayU();
            await this.initWompi();
            
            console.log('Proveedores de pago inicializados');
        } catch (error) {
            console.error('Error al inicializar proveedores:', error);
        }
    }

    // Inicializar MercadoPago
    async initMercadoPago() {
        try {
            if (!window.MercadoPago) {
                await this.loadScript('https://sdk.mercadopago.com/js/v2');
            }

            if (window.MercadoPago) {
                const mp = new window.MercadoPago(this.providers.mercadopago.publicKey, {
                    locale: 'es-CO'
                });
                this.providers.mercadopago.instance = mp;
                console.log('MercadoPago inicializado');
            }
        } catch (error) {
            console.error('Error al inicializar MercadoPago:', error);
        }
    }

    // Inicializar PayU
    async initPayU() {
        try {
            // PayU no requiere SDK del lado cliente para pagos básicos
            console.log('PayU configurado');
        } catch (error) {
            console.error('Error al configurar PayU:', error);
        }
    }

    // Inicializar Wompi
    async initWompi() {
        try {
            if (!window.WidgetCheckout) {
                await this.loadScript('https://checkout.wompi.co/widget.js');
            }
            console.log('Wompi configurado');
        } catch (error) {
            console.error('Error al configurar Wompi:', error);
        }
    }

    // Procesar pago con tarjeta
    async processCardPayment(paymentData) {
        try {
            console.log('Procesando pago con tarjeta:', paymentData);

            // Validar datos de tarjeta
            if (!this.validateCardData(paymentData.card)) {
                throw new Error('Datos de tarjeta inválidos');
            }

            // Procesar según el proveedor actual
            let result;
            switch (this.currentProvider) {
                case 'mercadopago':
                    result = await this.processMercadoPagoCard(paymentData);
                    break;
                case 'payu':
                    result = await this.processPayUCard(paymentData);
                    break;
                case 'wompi':
                    result = await this.processWompiCard(paymentData);
                    break;
                default:
                    throw new Error('Proveedor de pago no configurado');
            }

            return result;
        } catch (error) {
            console.error('Error al procesar pago con tarjeta:', error);
            return {
                success: false,
                message: error.message || 'Error al procesar el pago'
            };
        }
    }

    // Procesar pago PSE
    async processPSEPayment(pseData) {
        try {
            console.log('Procesando pago PSE:', pseData);

            // Validar datos PSE
            if (!this.validatePSEData(pseData)) {
                throw new Error('Datos PSE inválidos');
            }

            // Procesar según el proveedor
            let result;
            switch (this.currentProvider) {
                case 'payu':
                    result = await this.processPayUPSE(pseData);
                    break;
                case 'wompi':
                    result = await this.processWompiPSE(pseData);
                    break;
                default:
                    throw new Error('PSE no disponible con este proveedor');
            }

            return result;
        } catch (error) {
            console.error('Error al procesar pago PSE:', error);
            return {
                success: false,
                message: error.message || 'Error al procesar PSE'
            };
        }
    }

    // Procesar pago en efectivo
    async processCashPayment(cashData) {
        try {
            console.log('Procesando pago en efectivo:', cashData);

            // Generar código de pago
            const paymentCode = this.generatePaymentCode();
            const reference = this.generateReference();

            // Simular creación de orden de pago en efectivo
            const result = await this.createCashPaymentOrder({
                ...cashData,
                paymentCode,
                reference
            });

            return {
                success: true,
                transactionId: reference,
                paymentCode: paymentCode,
                method: 'cash',
                expirationDate: this.calculateExpirationDate(24), // 24 horas
                instructions: this.getCashPaymentInstructions(paymentCode)
            };
        } catch (error) {
            console.error('Error al procesar pago en efectivo:', error);
            return {
                success: false,
                message: error.message || 'Error al generar código de pago'
            };
        }
    }

    // Procesar con MercadoPago (tarjeta)
    async processMercadoPagoCard(paymentData) {
        try {
            const mp = this.providers.mercadopago.instance;
            
            // Crear token de tarjeta
            const cardToken = await mp.createCardToken({
                cardNumber: paymentData.card.number.replace(/\s/g, ''),
                cardholderName: paymentData.card.name,
                cardExpirationMonth: paymentData.card.expiry.split('/')[0],
                cardExpirationYear: '20' + paymentData.card.expiry.split('/')[1],
                securityCode: paymentData.card.cvv,
                identificationType: 'CC',
                identificationNumber: paymentData.userInfo.document || '12345678'
            });

            if (cardToken.error) {
                throw new Error(cardToken.error.message);
            }

            // Crear preferencia de pago
            const preference = await this.createMercadoPagoPreference(paymentData, cardToken.id);
            
            return {
                success: true,
                transactionId: preference.id,
                method: 'card',
                provider: 'mercadopago',
                redirectUrl: preference.init_point
            };
        } catch (error) {
            console.error('Error MercadoPago:', error);
            throw error;
        }
    }

    // Procesar con PayU (tarjeta)
    async processPayUCard(paymentData) {
        try {
            const payuData = {
                merchantId: this.providers.payu.merchantId,
                accountId: this.providers.payu.accountId,
                description: 'Compra en Mundo Calzado',
                referenceCode: this.generateReference(),
                amount: paymentData.amount,
                currency: 'COP',
                signature: this.generatePayUSignature(paymentData),
                buyerEmail: paymentData.userInfo.email,
                buyerFullName: `${paymentData.userInfo.firstName} ${paymentData.userInfo.lastName}`,
                creditCardNumber: paymentData.card.number.replace(/\s/g, ''),
                creditCardSecurityCode: paymentData.card.cvv,
                creditCardExpirationDate: this.formatExpiryForPayU(paymentData.card.expiry),
                payerFullName: paymentData.card.name,
                paymentMethod: this.detectCardType(paymentData.card.number)
            };

            // En un entorno real, se haría la llamada a la API de PayU
            const response = await this.simulatePayUAPI(payuData);
            
            return {
                success: response.code === 'SUCCESS',
                transactionId: response.transactionId,
                method: 'card',
                provider: 'payu',
                message: response.message
            };
        } catch (error) {
            console.error('Error PayU:', error);
            throw error;
        }
    }

    // Procesar con Wompi (tarjeta)
    async processWompiCard(paymentData) {
        try {
            const checkout = new window.WidgetCheckout({
                currency: 'COP',
                amountInCents: paymentData.amount * 100,
                reference: this.generateReference(),
                publicKey: this.providers.wompi.publicKey,
                redirectUrl: window.location.origin + '/checkout-success.html'
            });

            // Abrir widget de Wompi
            checkout.open((result) => {
                if (result.transaction && result.transaction.status === 'APPROVED') {
                    return {
                        success: true,
                        transactionId: result.transaction.id,
                        method: 'card',
                        provider: 'wompi'
                    };
                } else {
                    return {
                        success: false,
                        message: 'Pago no aprobado'
                    };
                }
            });

            return { success: true, pending: true };
        } catch (error) {
            console.error('Error Wompi:', error);
            throw error;
        }
    }

    // Procesar PSE con PayU
    async processPayUPSE(pseData) {
        try {
            const payuPSEData = {
                merchantId: this.providers.payu.merchantId,
                accountId: this.providers.payu.accountId,
                description: 'Compra en Mundo Calzado - PSE',
                referenceCode: this.generateReference(),
                amount: pseData.amount,
                currency: 'COP',
                signature: this.generatePayUSignature(pseData),
                paymentMethod: 'PSE',
                pseFinancialInstitutionCode: this.getBankCode(pseData.bank),
                payerDocumentType: pseData.documentType,
                payerDocument: pseData.documentNumber,
                payerEmail: pseData.userInfo.email,
                payerFullName: `${pseData.userInfo.firstName} ${pseData.userInfo.lastName}`,
                responseUrl: window.location.origin + '/checkout-response.html'
            };

            const response = await this.simulatePayUPSEAPI(payuPSEData);
            
            return {
                success: response.code === 'SUCCESS',
                transactionId: response.transactionId,
                method: 'pse',
                provider: 'payu',
                redirectUrl: response.redirectUrl
            };
        } catch (error) {
            console.error('Error PayU PSE:', error);
            throw error;
        }
    }

    // Validar datos de tarjeta
    validateCardData(card) {
        if (!card.number || card.number.replace(/\s/g, '').length < 13) {
            return false;
        }
        if (!card.name || card.name.trim().length < 3) {
            return false;
        }
        if (!card.expiry || !card.expiry.match(/^\d{2}\/\d{2}$/)) {
            return false;
        }
        if (!card.cvv || card.cvv.length < 3) {
            return false;
        }
        return true;
    }

    // Validar datos PSE
    validatePSEData(pse) {
        if (!pse.bank) return false;
        if (!pse.documentType) return false;
        if (!pse.documentNumber || pse.documentNumber.trim().length < 5) return false;
        return true;
    }

    // Detectar tipo de tarjeta
    detectCardType(cardNumber) {
        const number = cardNumber.replace(/\s/g, '');
        
        if (number.match(/^4/)) return 'VISA';
        if (number.match(/^5[1-5]/)) return 'MASTERCARD';
        if (number.match(/^3[47]/)) return 'AMEX';
        if (number.match(/^6/)) return 'DISCOVER';
        
        return 'VISA'; // Por defecto
    }

    // Generar referencia única
    generateReference() {
        return 'MC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // Generar código de pago
    generatePaymentCode() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Generar firma para PayU
    generatePayUSignature(data) {
        // En una implementación real, se usaría la clave secreta de PayU
        const string = `${this.providers.payu.apiKey}~${this.providers.payu.merchantId}~${data.referenceCode}~${data.amount}~COP`;
        return btoa(string); // Simulación - usar MD5 en producción
    }

    // Formatear fecha de expiración para PayU
    formatExpiryForPayU(expiry) {
        const [month, year] = expiry.split('/');
        return `20${year}/${month}`;
    }

    // Obtener código de banco para PSE
    getBankCode(bankName) {
        const bankCodes = {
            'bancolombia': '1007',
            'davivienda': '1051',
            'bbva': '1013',
            'bancoagrario': '1040',
            'avvillas': '1052',
            'bancodebogota': '1039'
        };
        return bankCodes[bankName] || '1007';
    }

    // Calcular fecha de expiración
    calculateExpirationDate(hours) {
        const date = new Date();
        date.setHours(date.getHours() + hours);
        return date.toISOString();
    }

    // Obtener instrucciones de pago en efectivo
    getCashPaymentInstructions(paymentCode) {
        return {
            title: 'Instrucciones de Pago',
            steps: [
                'Dirígete a cualquier punto Efecty, Baloto o punto autorizado',
                `Proporciona el código de pago: ${paymentCode}`,
                'Realiza el pago en efectivo',
                'Guarda el comprobante de pago',
                'Tu pedido se procesará automáticamente'
            ],
            important: [
                'El código expira en 24 horas',
                'El pago debe ser exacto',
                'Conserva el comprobante hasta recibir tu pedido'
            ]
        };
    }

    // Crear orden de pago en efectivo
    async createCashPaymentOrder(orderData) {
        // Simular creación de orden
        await this.delay(1000);
        
        return {
            success: true,
            orderId: this.generateReference(),
            paymentCode: orderData.paymentCode
        };
    }

    // Crear preferencia de MercadoPago
    async createMercadoPagoPreference(paymentData, cardToken) {
        // En una implementación real, esto se haría en el backend
        return {
            id: 'PREF_' + Date.now(),
            init_point: 'https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=PREF_' + Date.now()
        };
    }

    // Simular API de PayU
    async simulatePayUAPI(data) {
        await this.delay(2000);
        
        return {
            code: Math.random() > 0.2 ? 'SUCCESS' : 'ERROR',
            transactionId: 'PAYU_' + Date.now(),
            message: Math.random() > 0.2 ? 'Transacción aprobada' : 'Transacción rechazada'
        };
    }

    // Simular API PSE de PayU
    async simulatePayUPSEAPI(data) {
        await this.delay(1500);
        
        return {
            code: 'SUCCESS',
            transactionId: 'PSE_' + Date.now(),
            redirectUrl: `https://registro.pse.com.co/PSEUserRegister/StartTransaction.htm?enc=${btoa(JSON.stringify(data))}`
        };
    }

    // Cargar script externo
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Delay utility
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Verificar estado de transacción
    async checkTransactionStatus(transactionId, provider = null) {
        const targetProvider = provider || this.currentProvider;
        
        try {
            // En una implementación real, consultaría la API del proveedor
            await this.delay(1000);
            
            return {
                success: true,
                status: 'approved', // 'approved', 'rejected', 'pending'
                transactionId: transactionId,
                provider: targetProvider
            };
        } catch (error) {
            console.error('Error al verificar estado:', error);
            return {
                success: false,
                message: 'Error al verificar estado de transacción'
            };
        }
    }

    // Cambiar proveedor de pago
    setProvider(provider) {
        if (this.providers[provider]) {
            this.currentProvider = provider;
            console.log(`Proveedor cambiado a: ${provider}`);
            return true;
        }
        return false;
    }

    // Obtener proveedores disponibles
    getAvailableProviders() {
        return Object.keys(this.providers).map(key => ({
            id: key,
            name: this.providers[key].name,
            active: key === this.currentProvider
        }));
    }
}

// Crear instancia global
window.PaymentGateway = new PaymentGateway();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentGateway;
}
