// User Profile Manager - Sistema de gestión de perfiles integrado con checkout
class UserProfileManager {
    constructor() {
        this.currentUser = null;
        this.orders = [];
        this.paymentMethods = [];
        this.addresses = [];
        
        this.init();
    }

    init() {
        console.log('Inicializando User Profile Manager');
        this.loadCurrentUser();
        this.loadUserData();
        this.setupEventListeners();
    }

    // Cargar usuario actual
    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('usuarioActual');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('Usuario cargado:', this.currentUser.email);
            }
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            this.currentUser = null;
        }
    }

    // Cargar datos del usuario (pedidos, métodos de pago, direcciones)
    loadUserData() {
        if (!this.currentUser) return;

        try {
            // Cargar pedidos
            const orders = localStorage.getItem(`orders_${this.currentUser.email}`);
            this.orders = orders ? JSON.parse(orders) : [];

            // Cargar métodos de pago guardados
            const paymentMethods = localStorage.getItem(`payment_methods_${this.currentUser.email}`);
            this.paymentMethods = paymentMethods ? JSON.parse(paymentMethods) : [];

            // Cargar direcciones guardadas
            const addresses = localStorage.getItem(`addresses_${this.currentUser.email}`);
            this.addresses = addresses ? JSON.parse(addresses) : [];

            console.log(`Datos cargados para ${this.currentUser.email}:`, {
                orders: this.orders.length,
                paymentMethods: this.paymentMethods.length,
                addresses: this.addresses.length
            });
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Escuchar cambios en el usuario actual
        window.addEventListener('storage', (e) => {
            if (e.key === 'usuarioActual') {
                this.loadCurrentUser();
                this.loadUserData();
            }
        });
    }

    // Crear nuevo usuario
    async createUser(userData) {
        try {
            const newUser = {
                id: this.generateUserId(),
                email: userData.email,
                password: userData.password, // En producción, usar hash
                nombre: userData.firstName,
                apellido: userData.lastName,
                telefono: userData.phone || '',
                fechaNacimiento: userData.birthDate || '',
                genero: userData.gender || '',
                documento: userData.document || '',
                tipoDocumento: userData.documentType || 'CC',
                direccion: userData.address || '',
                ciudad: userData.city || '',
                departamento: userData.state || '',
                codigoPostal: userData.zipCode || '',
                fechaRegistro: new Date().toISOString(),
                activo: true,
                verificado: false,
                preferencias: {
                    recibirOfertas: true,
                    recibirNotificaciones: true,
                    tallasPreferidas: [],
                    marcasPreferidas: [],
                    categoriaPreferida: ''
                },
                estadisticas: {
                    totalCompras: 0,
                    montoGastado: 0,
                    ultimaCompra: null,
                    productosComprados: 0
                }
            };

            // Guardar en la lista de usuarios
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            
            // Verificar si el email ya existe
            if (usuarios.find(u => u.email === newUser.email)) {
                throw new Error('El email ya está registrado');
            }

            usuarios.push(newUser);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            // Establecer como usuario actual
            this.currentUser = newUser;
            localStorage.setItem('usuarioActual', JSON.stringify(newUser));

            console.log('Usuario creado exitosamente:', newUser.email);
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return { success: false, message: error.message };
        }
    }

    // Actualizar perfil de usuario
    async updateProfile(updateData) {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            // Actualizar datos del usuario actual
            const updatedUser = {
                ...this.currentUser,
                ...updateData,
                fechaActualizacion: new Date().toISOString()
            };

            // Guardar usuario actualizado
            this.currentUser = updatedUser;
            localStorage.setItem('usuarioActual', JSON.stringify(updatedUser));

            // Actualizar en la lista de usuarios
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const userIndex = usuarios.findIndex(u => u.email === this.currentUser.email);
            
            if (userIndex !== -1) {
                usuarios[userIndex] = updatedUser;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }

            console.log('Perfil actualizado exitosamente');
            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            return { success: false, message: error.message };
        }
    }

    // Guardar método de pago
    async savePaymentMethod(paymentMethodData) {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            const paymentMethod = {
                id: this.generatePaymentMethodId(),
                type: paymentMethodData.type, // 'card', 'bank_account'
                cardNumber: paymentMethodData.cardNumber ? 
                    '**** **** **** ' + paymentMethodData.cardNumber.slice(-4) : null,
                cardType: paymentMethodData.cardType || null,
                cardName: paymentMethodData.cardName || null,
                bankName: paymentMethodData.bankName || null,
                accountType: paymentMethodData.accountType || null,
                isDefault: paymentMethodData.isDefault || false,
                createdAt: new Date().toISOString(),
                // No guardar datos sensibles como CVV o número completo
                // En producción, usar tokenización
                token: paymentMethodData.token || this.generatePaymentToken()
            };

            // Si es el método por defecto, quitar el default de otros
            if (paymentMethod.isDefault) {
                this.paymentMethods.forEach(pm => pm.isDefault = false);
            }

            this.paymentMethods.push(paymentMethod);
            localStorage.setItem(`payment_methods_${this.currentUser.email}`, 
                JSON.stringify(this.paymentMethods));

            console.log('Método de pago guardado');
            return { success: true, paymentMethod };
        } catch (error) {
            console.error('Error al guardar método de pago:', error);
            return { success: false, message: error.message };
        }
    }

    // Eliminar método de pago
    async removePaymentMethod(paymentMethodId) {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== paymentMethodId);
            localStorage.setItem(`payment_methods_${this.currentUser.email}`, 
                JSON.stringify(this.paymentMethods));

            console.log('Método de pago eliminado');
            return { success: true };
        } catch (error) {
            console.error('Error al eliminar método de pago:', error);
            return { success: false, message: error.message };
        }
    }

    // Guardar dirección
    async saveAddress(addressData) {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            const address = {
                id: this.generateAddressId(),
                name: addressData.name || 'Mi dirección',
                firstName: addressData.firstName,
                lastName: addressData.lastName,
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
                zipCode: addressData.zipCode,
                phone: addressData.phone,
                isDefault: addressData.isDefault || false,
                type: addressData.type || 'home', // 'home', 'work', 'other'
                createdAt: new Date().toISOString()
            };

            // Si es la dirección por defecto, quitar el default de otras
            if (address.isDefault) {
                this.addresses.forEach(addr => addr.isDefault = false);
            }

            this.addresses.push(address);
            localStorage.setItem(`addresses_${this.currentUser.email}`, 
                JSON.stringify(this.addresses));

            console.log('Dirección guardada');
            return { success: true, address };
        } catch (error) {
            console.error('Error al guardar dirección:', error);
            return { success: false, message: error.message };
        }
    }

    // Eliminar dirección
    async removeAddress(addressId) {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            this.addresses = this.addresses.filter(addr => addr.id !== addressId);
            localStorage.setItem(`addresses_${this.currentUser.email}`, 
                JSON.stringify(this.addresses));

            console.log('Dirección eliminada');
            return { success: true };
        } catch (error) {
            console.error('Error al eliminar dirección:', error);
            return { success: false, message: error.message };
        }
    }

    // Registrar nueva compra
    async registerPurchase(orderData) {
        if (!this.currentUser) return;

        try {
            // Agregar a la lista de pedidos del usuario
            this.orders.push(orderData);
            localStorage.setItem(`orders_${this.currentUser.email}`, 
                JSON.stringify(this.orders));

            // Actualizar estadísticas del usuario
            this.currentUser.estadisticas.totalCompras += 1;
            this.currentUser.estadisticas.montoGastado += orderData.total;
            this.currentUser.estadisticas.ultimaCompra = orderData.createdAt;
            this.currentUser.estadisticas.productosComprados += 
                orderData.items.reduce((sum, item) => sum + item.cantidad, 0);

            // Guardar usuario actualizado
            await this.updateProfile(this.currentUser);

            console.log('Compra registrada en el perfil del usuario');
            return { success: true };
        } catch (error) {
            console.error('Error al registrar compra:', error);
            return { success: false, message: error.message };
        }
    }

    // Obtener historial de pedidos
    getOrderHistory() {
        return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Obtener métodos de pago guardados
    getPaymentMethods() {
        return this.paymentMethods;
    }

    // Obtener direcciones guardadas
    getAddresses() {
        return this.addresses;
    }

    // Obtener dirección por defecto
    getDefaultAddress() {
        return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
    }

    // Obtener método de pago por defecto
    getDefaultPaymentMethod() {
        return this.paymentMethods.find(pm => pm.isDefault) || this.paymentMethods[0];
    }

    // Obtener estadísticas del usuario
    getUserStats() {
        if (!this.currentUser) return null;

        return {
            ...this.currentUser.estadisticas,
            memberSince: this.currentUser.fechaRegistro,
            totalOrders: this.orders.length,
            averageOrderValue: this.orders.length > 0 ? 
                this.currentUser.estadisticas.montoGastado / this.orders.length : 0
        };
    }

    // Obtener recomendaciones basadas en el historial
    getRecommendations() {
        if (!this.currentUser || this.orders.length === 0) {
            return this.getDefaultRecommendations();
        }

        try {
            // Analizar historial de compras
            const purchasedCategories = new Map();
            const purchasedBrands = new Map();
            const purchasedSizes = new Map();

            this.orders.forEach(order => {
                order.items.forEach(item => {
                    // Contar categorías
                    const category = item.categoria || 'general';
                    purchasedCategories.set(category, 
                        (purchasedCategories.get(category) || 0) + 1);

                    // Contar marcas
                    const brand = item.marca || 'general';
                    purchasedBrands.set(brand, 
                        (purchasedBrands.get(brand) || 0) + 1);

                    // Contar tallas
                    const size = item.talla;
                    purchasedSizes.set(size, 
                        (purchasedSizes.get(size) || 0) + 1);
                });
            });

            // Obtener preferencias más frecuentes
            const topCategory = this.getTopEntry(purchasedCategories);
            const topBrand = this.getTopEntry(purchasedBrands);
            const topSize = this.getTopEntry(purchasedSizes);

            return {
                preferredCategory: topCategory,
                preferredBrand: topBrand,
                preferredSize: topSize,
                suggestedProducts: this.getSuggestedProducts(topCategory, topBrand, topSize),
                personalizedOffers: this.getPersonalizedOffers()
            };
        } catch (error) {
            console.error('Error al generar recomendaciones:', error);
            return this.getDefaultRecommendations();
        }
    }

    // Obtener entrada más frecuente de un Map
    getTopEntry(map) {
        if (map.size === 0) return null;
        
        return [...map.entries()].reduce((a, b) => 
            map.get(a[0]) > map.get(b[0]) ? a : b)[0];
    }

    // Obtener productos sugeridos
    getSuggestedProducts(category, brand, size) {
        // En una implementación real, esto consultaría una base de datos
        return [
            {
                id: 'suggested_1',
                name: `Producto recomendado ${category}`,
                brand: brand,
                category: category,
                reason: 'Basado en tus compras anteriores'
            }
        ];
    }

    // Obtener ofertas personalizadas
    getPersonalizedOffers() {
        const stats = this.getUserStats();
        const offers = [];

        // Ofrecer descuento por fidelidad
        if (stats.totalCompras >= 5) {
            offers.push({
                type: 'loyalty_discount',
                title: '¡Cliente Frecuente!',
                description: '15% de descuento en tu próxima compra',
                code: 'FIEL15'
            });
        }

        // Ofrecer envío gratis
        if (stats.averageOrderValue > 150000) {
            offers.push({
                type: 'free_shipping',
                title: 'Envío Gratis',
                description: 'Envío gratis en tu próximo pedido',
                code: 'ENVIOGRATIS'
            });
        }

        return offers;
    }

    // Recomendaciones por defecto
    getDefaultRecommendations() {
        return {
            preferredCategory: null,
            preferredBrand: null,
            preferredSize: null,
            suggestedProducts: [],
            personalizedOffers: [
                {
                    type: 'welcome',
                    title: '¡Bienvenido!',
                    description: '10% de descuento en tu primera compra',
                    code: 'BIENVENIDO10'
                }
            ]
        };
    }

    // Actualizar preferencias
    async updatePreferences(preferences) {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            this.currentUser.preferencias = {
                ...this.currentUser.preferencias,
                ...preferences
            };

            return await this.updateProfile(this.currentUser);
        } catch (error) {
            console.error('Error al actualizar preferencias:', error);
            return { success: false, message: error.message };
        }
    }

    // Verificar eligibilidad para crédito Addi
    async checkAddiEligibility() {
        if (!this.currentUser) return { eligible: false, reason: 'Usuario no autenticado' };

        try {
            const stats = this.getUserStats();
            const profile = this.currentUser;

            // Criterios de elegibilidad
            const criteria = {
                hasCompletedProfile: !!(profile.documento && profile.telefono && profile.direccion),
                hasOrderHistory: stats.totalCompras > 0,
                goodPaymentHistory: this.checkPaymentHistory(),
                validPhone: this.validatePhone(profile.telefono),
                validEmail: this.validateEmail(profile.email)
            };

            const eligibilityScore = Object.values(criteria).filter(Boolean).length;
            const isEligible = eligibilityScore >= 3;

            return {
                eligible: isEligible,
                score: eligibilityScore,
                maxCreditAmount: this.calculateMaxCredit(stats),
                criteria: criteria,
                reason: isEligible ? null : 'No cumple con los criterios mínimos'
            };
        } catch (error) {
            console.error('Error al verificar elegibilidad Addi:', error);
            return { eligible: false, reason: 'Error al verificar elegibilidad' };
        }
    }

    // Verificar historial de pagos
    checkPaymentHistory() {
        // Verificar si hay pagos fallidos recientes
        const recentOrders = this.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const monthsAgo = new Date();
            monthsAgo.setMonth(monthsAgo.getMonth() - 6);
            return orderDate > monthsAgo;
        });

        const failedPayments = recentOrders.filter(order => 
            order.status === 'payment_failed' || order.status === 'cancelled');

        return failedPayments.length === 0;
    }

    // Calcular crédito máximo
    calculateMaxCredit(stats) {
        const baseCredit = 200000; // $200,000 base
        const loyaltyBonus = Math.min(stats.totalCompras * 50000, 300000); // Hasta $300,000 extra
        const spendingBonus = Math.min(stats.montoGastado * 0.1, 500000); // Hasta $500,000 extra

        return baseCredit + loyaltyBonus + spendingBonus;
    }

    // Utilidades de validación
    validatePhone(phone) {
        if (!phone) return false;
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Generadores de ID
    generateUserId() {
        return 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    generatePaymentMethodId() {
        return 'PM_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    generateAddressId() {
        return 'ADDR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    generatePaymentToken() {
        return 'TOK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('usuarioActual');
        this.currentUser = null;
        this.orders = [];
        this.paymentMethods = [];
        this.addresses = [];
        console.log('Sesión cerrada');
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Crear instancia global
window.UserProfileManager = new UserProfileManager();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserProfileManager;
}
