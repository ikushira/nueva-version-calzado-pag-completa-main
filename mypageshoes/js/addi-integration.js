// Addi Integration - Sistema de crédito instantáneo
class AddiIntegration {
    constructor() {
        this.apiUrl = 'https://api.addi.com/v1'; // URL de la API de Addi
        this.merchantId = 'MUNDO_CALZADO_001'; // ID del comercio
        this.apiKey = process.env.ADDI_API_KEY || 'test_key_123'; // Clave API
        this.environment = 'sandbox'; // 'sandbox' o 'production'
        
        this.init();
    }

    init() {
        console.log('Inicializando integración con Addi');
        this.setupAddiSDK();
    }

    // Configurar SDK de Addi
    setupAddiSDK() {
        // Cargar el SDK de Addi
        if (!window.AddiSDK) {
            const script = document.createElement('script');
            script.src = this.environment === 'production' 
                ? 'https://cdn.addi.com/sdk/addi-sdk.min.js'
                : 'https://cdn-sandbox.addi.com/sdk/addi-sdk.min.js';
            script.onload = () => {
                this.initializeSDK();
            };
            document.head.appendChild(script);
        } else {
            this.initializeSDK();
        }
    }

    // Inicializar SDK
    initializeSDK() {
        try {
            if (window.AddiSDK) {
                window.AddiSDK.init({
                    merchantId: this.merchantId,
                    environment: this.environment,
                    onReady: () => {
                        console.log('Addi SDK inicializado correctamente');
                    },
                    onError: (error) => {
                        console.error('Error al inicializar Addi SDK:', error);
                    }
                });
            }
        } catch (error) {
            console.error('Error al configurar Addi SDK:', error);
        }
    }

    // Solicitar crédito con Addi
    async requestCredit(creditRequest) {
        try {
            console.log('Solicitando crédito con Addi:', creditRequest);

            // Validar datos requeridos
            if (!this.validateCreditRequest(creditRequest)) {
                throw new Error('Datos incompletos para solicitud de crédito');
            }

            // Preparar datos para Addi
            const addiPayload = this.prepareAddiPayload(creditRequest);

            // En un entorno real, aquí se haría la llamada a la API de Addi
            // Por ahora simularemos la respuesta
            const response = await this.simulateAddiAPI(addiPayload);

            if (response.success) {
                return {
                    success: true,
                    transactionId: response.transactionId,
                    method: 'addi',
                    creditInfo: response.creditInfo,
                    approvalStatus: response.approvalStatus
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Crédito no aprobado'
                };
            }

        } catch (error) {
            console.error('Error en solicitud de crédito Addi:', error);
            return {
                success: false,
                message: 'Error al procesar solicitud de crédito'
            };
        }
    }

    // Validar solicitud de crédito
    validateCreditRequest(request) {
        const required = ['amount', 'phone', 'userInfo'];
        
        for (const field of required) {
            if (!request[field]) {
                console.error(`Campo requerido faltante: ${field}`);
                return false;
            }
        }

        // Validar información del usuario
        const userRequired = ['firstName', 'lastName', 'email', 'phone'];
        for (const field of userRequired) {
            if (!request.userInfo[field]) {
                console.error(`Campo de usuario requerido faltante: ${field}`);
                return false;
            }
        }

        // Validar monto mínimo y máximo
        if (request.amount < 50000 || request.amount > 3000000) {
            console.error('Monto fuera del rango permitido por Addi');
            return false;
        }

        return true;
    }

    // Preparar payload para Addi
    prepareAddiPayload(request) {
        return {
            merchant_id: this.merchantId,
            amount: request.amount,
            currency: 'COP',
            customer: {
                phone: request.phone,
                email: request.userInfo.email,
                first_name: request.userInfo.firstName,
                last_name: request.userInfo.lastName,
                document_type: 'CC', // Por defecto cédula de ciudadanía
                document_number: this.extractDocumentFromPhone(request.phone),
                address: {
                    street: request.userInfo.address,
                    city: request.userInfo.city,
                    state: request.userInfo.state,
                    postal_code: request.userInfo.zipCode || '000000'
                }
            },
            order: {
                reference: this.generateOrderReference(),
                description: 'Compra en Mundo Calzado',
                items: request.items || []
            },
            redirect_urls: {
                success: window.location.origin + '/checkout-success.html',
                failure: window.location.origin + '/checkout-error.html',
                pending: window.location.origin + '/checkout-pending.html'
            }
        };
    }

    // Simular API de Addi (para desarrollo)
    async simulateAddiAPI(payload) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simular diferentes escenarios de respuesta
        const scenarios = [
            { probability: 0.7, approved: true },   // 70% aprobación
            { probability: 0.2, approved: false },  // 20% rechazo
            { probability: 0.1, pending: true }     // 10% pendiente
        ];

        const random = Math.random();
        let cumulativeProbability = 0;
        let scenario = scenarios[0];

        for (const s of scenarios) {
            cumulativeProbability += s.probability;
            if (random <= cumulativeProbability) {
                scenario = s;
                break;
            }
        }

        if (scenario.approved) {
            return {
                success: true,
                transactionId: 'ADDI_' + Date.now(),
                approvalStatus: 'approved',
                creditInfo: {
                    approvedAmount: payload.amount,
                    installments: this.calculateInstallments(payload.amount),
                    interestRate: 2.5,
                    firstPaymentDate: this.calculateFirstPaymentDate()
                }
            };
        } else if (scenario.pending) {
            return {
                success: false,
                message: 'Solicitud en revisión. Te contactaremos pronto.',
                approvalStatus: 'pending'
            };
        } else {
            return {
                success: false,
                message: 'Crédito no aprobado en este momento.',
                approvalStatus: 'rejected'
            };
        }
    }

    // Calcular cuotas disponibles
    calculateInstallments(amount) {
        const options = [];
        
        // Cuotas según el monto
        if (amount >= 50000 && amount <= 200000) {
            options.push({ installments: 2, monthly_payment: amount / 2 });
            options.push({ installments: 3, monthly_payment: amount / 3 });
        }
        
        if (amount >= 100000 && amount <= 500000) {
            options.push({ installments: 4, monthly_payment: amount / 4 });
            options.push({ installments: 6, monthly_payment: amount / 6 });
        }
        
        if (amount >= 200000) {
            options.push({ installments: 8, monthly_payment: amount / 8 });
            options.push({ installments: 12, monthly_payment: amount / 12 });
        }

        return options;
    }

    // Calcular fecha del primer pago
    calculateFirstPaymentDate() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    }

    // Extraer número de documento del teléfono (simplificado)
    extractDocumentFromPhone(phone) {
        // En una implementación real, esto vendría del formulario
        return phone.replace(/\D/g, '').slice(-8);
    }

    // Generar referencia de orden
    generateOrderReference() {
        return 'MC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    // Verificar estado de solicitud
    async checkCreditStatus(transactionId) {
        try {
            // En una implementación real, consultaría la API de Addi
            const response = await fetch(`${this.apiUrl}/transactions/${transactionId}/status`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al consultar estado');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al verificar estado de crédito:', error);
            return {
                success: false,
                message: 'Error al verificar estado'
            };
        }
    }

    // Procesar webhook de Addi
    processWebhook(webhookData) {
        try {
            console.log('Procesando webhook de Addi:', webhookData);

            const { transaction_id, status, amount, customer } = webhookData;

            // Actualizar estado del pedido según el webhook
            switch (status) {
                case 'approved':
                    this.handleCreditApproved(transaction_id, amount, customer);
                    break;
                case 'rejected':
                    this.handleCreditRejected(transaction_id, customer);
                    break;
                case 'cancelled':
                    this.handleCreditCancelled(transaction_id, customer);
                    break;
                case 'completed':
                    this.handleCreditCompleted(transaction_id, customer);
                    break;
                default:
                    console.warn('Estado de webhook no reconocido:', status);
            }

            return { success: true };
        } catch (error) {
            console.error('Error al procesar webhook:', error);
            return { success: false, error: error.message };
        }
    }

    // Manejar crédito aprobado
    handleCreditApproved(transactionId, amount, customer) {
        console.log(`Crédito aprobado: ${transactionId} por $${amount}`);
        
        // Actualizar pedido en el sistema
        this.updateOrderStatus(transactionId, 'credit_approved');
        
        // Notificar al cliente
        this.notifyCustomer(customer.email, 'credit_approved', {
            transactionId,
            amount
        });
    }

    // Manejar crédito rechazado
    handleCreditRejected(transactionId, customer) {
        console.log(`Crédito rechazado: ${transactionId}`);
        
        this.updateOrderStatus(transactionId, 'credit_rejected');
        
        this.notifyCustomer(customer.email, 'credit_rejected', {
            transactionId
        });
    }

    // Manejar crédito cancelado
    handleCreditCancelled(transactionId, customer) {
        console.log(`Crédito cancelado: ${transactionId}`);
        
        this.updateOrderStatus(transactionId, 'cancelled');
        
        this.notifyCustomer(customer.email, 'credit_cancelled', {
            transactionId
        });
    }

    // Manejar crédito completado (pagado totalmente)
    handleCreditCompleted(transactionId, customer) {
        console.log(`Crédito completado: ${transactionId}`);
        
        this.updateOrderStatus(transactionId, 'completed');
        
        this.notifyCustomer(customer.email, 'credit_completed', {
            transactionId
        });
    }

    // Actualizar estado del pedido
    updateOrderStatus(transactionId, status) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(order => 
                order.paymentResult.transactionId === transactionId
            );

            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                orders[orderIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(orders));
                
                console.log(`Pedido ${transactionId} actualizado a estado: ${status}`);
            }
        } catch (error) {
            console.error('Error al actualizar estado del pedido:', error);
        }
    }

    // Notificar al cliente
    notifyCustomer(email, type, data) {
        // En una implementación real, enviaría email real
        console.log(`Notificación enviada a ${email}:`, { type, data });
        
        // Simular notificación
        const messages = {
            credit_approved: '¡Tu crédito ha sido aprobado! Procederemos con tu pedido.',
            credit_rejected: 'Tu solicitud de crédito no fue aprobada. Puedes intentar con otro método de pago.',
            credit_cancelled: 'Tu crédito ha sido cancelado.',
            credit_completed: '¡Has completado todos los pagos de tu crédito!'
        };

        if (window.NotificationSystem) {
            window.NotificationSystem.show(messages[type], 'info');
        }
    }

    // Obtener información de planes de pago
    getPaymentPlans(amount) {
        return this.calculateInstallments(amount);
    }

    // Verificar elegibilidad para Addi
    async checkEligibility(userInfo) {
        try {
            // En una implementación real, consultaría la API de Addi
            // Por ahora, simulamos la elegibilidad
            
            // Criterios básicos de elegibilidad
            const hasRequiredInfo = userInfo.phone && userInfo.email && 
                                  userInfo.firstName && userInfo.lastName;
            
            if (!hasRequiredInfo) {
                return {
                    eligible: false,
                    reason: 'Información incompleta'
                };
            }

            // Simular verificación
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                eligible: Math.random() > 0.3, // 70% de elegibilidad
                reason: Math.random() > 0.3 ? null : 'No cumple con los criterios de Addi'
            };
        } catch (error) {
            console.error('Error al verificar elegibilidad:', error);
            return {
                eligible: false,
                reason: 'Error al verificar elegibilidad'
            };
        }
    }
}

// Crear instancia global
window.AddiIntegration = new AddiIntegration();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AddiIntegration;
}
