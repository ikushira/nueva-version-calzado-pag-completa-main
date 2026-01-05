// Checkout.js - Sistema principal de checkout
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.userInfo = {};
        this.orderItems = [];
        this.orderTotal = 0;
        this.paymentMethod = 'card';
        this.discountApplied = false;
        
        this.init();
    }

    init() {
        console.log('Inicializando Checkout Manager');
        this.loadCartItems();
        this.bindEvents();
        this.checkUserSession();
        this.setupPaymentMethods();
        this.setupFormValidation();
    }

    // Cargar items del carrito
    loadCartItems() {
        try {
            const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
            this.orderItems = cart;
            this.renderOrderItems();
            this.calculateTotals();
        } catch (error) {
            console.error('Error al cargar items del carrito:', error);
            this.orderItems = [];
        }
    }

    // Renderizar items del pedido
    renderOrderItems() {
        const container = document.getElementById('order-items');
        if (!container) return;

        if (this.orderItems.length === 0) {
            container.innerHTML = '<p class="empty-cart">No hay productos en el carrito</p>';
            return;
        }

        const itemsHTML = this.orderItems.map(item => `
            <div class="order-item">
                <img src="${item.imagen || 'assets/img/placeholder.jpg'}" 
                     alt="${item.nombre}" 
                     class="item-image"
                     onerror="this.src='assets/img/placeholder.jpg'">
                <div class="item-info">
                    <div class="item-name">${item.nombre}</div>
                    <div class="item-details">
                        Talla: ${item.talla} | Cantidad: ${item.cantidad}
                    </div>
                    <div class="item-price">$${this.formatPrice(item.precio * item.cantidad)}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = itemsHTML;
    }

    // Calcular totales
    calculateTotals() {
        const subtotal = this.orderItems.reduce((sum, item) => 
            sum + (item.precio * item.cantidad), 0);
        
        let shipping = 15000; // Costo de envío base
        
        // Envío gratis por compra de 2 pares o más
        const totalItems = this.orderItems.reduce((sum, item) => sum + item.cantidad, 0);
        if (totalItems >= 2) {
            shipping = 0;
        }

        let discount = 0;
        if (this.discountApplied) {
            discount = subtotal * 0.1; // 10% de descuento
        }

        const total = subtotal + shipping - discount;

        this.orderTotal = total;

        // Actualizar UI
        document.getElementById('subtotal').textContent = `$${this.formatPrice(subtotal)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'GRATIS' : `$${this.formatPrice(shipping)}`;
        document.getElementById('total').textContent = `$${this.formatPrice(total)}`;

        if (discount > 0) {
            document.getElementById('discount').textContent = `-$${this.formatPrice(discount)}`;
            document.querySelector('.total-line.discount').classList.remove('hidden');
        }
    }

    // Verificar sesión de usuario
    checkUserSession() {
        const user = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
        const statusContainer = document.getElementById('user-login-status');

        if (user) {
            statusContainer.innerHTML = `
                <div class="logged-user">
                    <p>Conectado como: <strong>${user.email}</strong></p>
                    <a href="#" id="logout-link">Cerrar sesión</a>
                </div>
            `;
            
            // Pre-llenar formulario con datos del usuario
            this.prefillUserForm(user);
            
            // Agregar evento de logout
            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Pre-llenar formulario con datos del usuario
    prefillUserForm(user) {
        if (user.email) document.getElementById('email').value = user.email;
        if (user.nombre) document.getElementById('firstName').value = user.nombre;
        if (user.apellido) document.getElementById('lastName').value = user.apellido;
        if (user.telefono) document.getElementById('phone').value = user.telefono;
        if (user.direccion) document.getElementById('address').value = user.direccion;
        if (user.ciudad) document.getElementById('city').value = user.ciudad;
        if (user.departamento) document.getElementById('state').value = user.departamento;
        if (user.codigoPostal) document.getElementById('zipCode').value = user.codigoPostal;
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('usuarioActual');
        location.reload();
    }

    // Configurar eventos
    bindEvents() {
        // Continuar al pago
        document.getElementById('continue-to-payment').addEventListener('click', () => {
            this.proceedToPayment();
        });

        // Procesar pago
        document.getElementById('process-payment').addEventListener('click', () => {
            this.processPayment();
        });

        // Aplicar descuento
        document.getElementById('applyDiscount').addEventListener('click', () => {
            this.applyDiscount();
        });

        // Link de login
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'login.html?redirect=checkout';
            });
        }
    }

    // Configurar métodos de pago
    setupPaymentMethods() {
        const paymentInputs = document.querySelectorAll('input[name="payment-method"]');
        const paymentForms = document.querySelectorAll('.payment-form');

        paymentInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.paymentMethod = e.target.value;
                
                // Ocultar todos los formularios
                paymentForms.forEach(form => form.classList.remove('active'));
                
                // Mostrar formulario correspondiente
                const targetForm = document.getElementById(`${this.paymentMethod}-form`);
                if (targetForm) {
                    targetForm.classList.add('active');
                }
            });
        });
    }

    // Configurar validación de formularios
    setupFormValidation() {
        // Validación de número de tarjeta
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                e.target.value = value;
            });
        }

        // Validación de fecha de expiración
        const expiryDate = document.getElementById('expiryDate');
        if (expiryDate) {
            expiryDate.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // Validación de CVV
        const cvv = document.getElementById('cvv');
        if (cvv) {
            cvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    }

    // Proceder al pago
    proceedToPayment() {
        if (!this.validateUserInfo()) {
            return;
        }

        this.collectUserInfo();
        this.goToStep(2);
    }

    // Validar información del usuario
    validateUserInfo() {
        const requiredFields = [
            'email', 'firstName', 'lastName', 
            'address', 'city', 'state', 'phone'
        ];

        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                element.focus();
                this.showError(`Por favor completa el campo ${this.getFieldLabel(field)}`);
                return false;
            }
        }

        // Validar email
        const email = document.getElementById('email').value;
        if (!this.validateEmail(email)) {
            document.getElementById('email').focus();
            this.showError('Por favor ingresa un email válido');
            return false;
        }

        return true;
    }

    // Recopilar información del usuario
    collectUserInfo() {
        this.userInfo = {
            email: document.getElementById('email').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            phone: document.getElementById('phone').value,
            saveInfo: document.getElementById('saveInfo').checked
        };

        // Guardar información si el usuario lo solicita
        if (this.userInfo.saveInfo) {
            this.saveUserInfo();
        }
    }

    // Guardar información del usuario
    saveUserInfo() {
        try {
            const existingUser = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
            
            if (existingUser) {
                // Actualizar usuario existente
                const updatedUser = {
                    ...existingUser,
                    nombre: this.userInfo.firstName,
                    apellido: this.userInfo.lastName,
                    telefono: this.userInfo.phone,
                    direccion: this.userInfo.address,
                    ciudad: this.userInfo.city,
                    departamento: this.userInfo.state,
                    codigoPostal: this.userInfo.zipCode
                };
                
                localStorage.setItem('usuarioActual', JSON.stringify(updatedUser));
                
                // También actualizar en la lista de usuarios registrados
                const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
                const userIndex = usuarios.findIndex(u => u.email === existingUser.email);
                if (userIndex !== -1) {
                    usuarios[userIndex] = updatedUser;
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));
                }
            }
        } catch (error) {
            console.error('Error al guardar información del usuario:', error);
        }
    }

    // Procesar pago
    async processPayment() {
        if (!this.validatePaymentInfo()) {
            return;
        }

        this.showPaymentLoader(true);

        try {
            let paymentResult;

            switch (this.paymentMethod) {
                case 'card':
                    paymentResult = await this.processCardPayment();
                    break;
                case 'pse':
                    paymentResult = await this.processPSEPayment();
                    break;
                case 'addi':
                    paymentResult = await this.processAddiPayment();
                    break;
                case 'cash':
                    paymentResult = await this.processCashPayment();
                    break;
                default:
                    throw new Error('Método de pago no válido');
            }

            if (paymentResult.success) {
                this.completeOrder(paymentResult);
            } else {
                this.showError(paymentResult.message || 'Error al procesar el pago');
            }
        } catch (error) {
            console.error('Error al procesar pago:', error);
            this.showError('Error al procesar el pago. Por favor intenta nuevamente.');
        } finally {
            this.showPaymentLoader(false);
        }
    }

    // Validar información de pago
    validatePaymentInfo() {
        switch (this.paymentMethod) {
            case 'card':
                return this.validateCardInfo();
            case 'pse':
                return this.validatePSEInfo();
            case 'addi':
                return this.validateAddiInfo();
            case 'cash':
                return true; // No requiere validación adicional
            default:
                return false;
        }
    }

    // Validar información de tarjeta
    validateCardInfo() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        if (!cardNumber || cardNumber.length < 13) {
            this.showError('Número de tarjeta inválido');
            return false;
        }

        if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
            this.showError('Fecha de expiración inválida');
            return false;
        }

        if (!cvv || cvv.length < 3) {
            this.showError('CVV inválido');
            return false;
        }

        if (!cardName.trim()) {
            this.showError('Nombre en la tarjeta requerido');
            return false;
        }

        return true;
    }

    // Validar información PSE
    validatePSEInfo() {
        const bank = document.getElementById('pseBank').value;
        const docType = document.getElementById('pseDocType').value;
        const docNumber = document.getElementById('pseDocNumber').value;

        if (!bank) {
            this.showError('Selecciona tu banco');
            return false;
        }

        if (!docType) {
            this.showError('Selecciona tipo de documento');
            return false;
        }

        if (!docNumber.trim()) {
            this.showError('Número de documento requerido');
            return false;
        }

        return true;
    }

    // Validar información Addi
    validateAddiInfo() {
        const phone = document.getElementById('addiPhone').value;
        const terms = document.getElementById('addiTerms').checked;

        if (!phone.trim()) {
            this.showError('Número de celular requerido');
            return false;
        }

        if (!terms) {
            this.showError('Debes aceptar los términos y condiciones de Addi');
            return false;
        }

        return true;
    }

    // Procesar pago con tarjeta
    async processCardPayment() {
        // Simular procesamiento de pago
        await this.delay(2000);
        
        // En una implementación real, aquí se integraría con la pasarela de pagos
        return {
            success: true,
            transactionId: this.generateTransactionId(),
            method: 'card'
        };
    }

    // Procesar pago PSE
    async processPSEPayment() {
        await this.delay(1500);
        
        return {
            success: true,
            transactionId: this.generateTransactionId(),
            method: 'pse'
        };
    }

    // Procesar pago Addi
    async processAddiPayment() {
        const phone = document.getElementById('addiPhone').value;
        
        // Integración con Addi
        const addiResult = await window.AddiIntegration.requestCredit({
            amount: this.orderTotal,
            phone: phone,
            userInfo: this.userInfo
        });

        return addiResult;
    }

    // Procesar pago en efectivo
    async processCashPayment() {
        await this.delay(1000);
        
        return {
            success: true,
            transactionId: this.generateTransactionId(),
            method: 'cash',
            paymentCode: this.generatePaymentCode()
        };
    }

    // Completar pedido
    completeOrder(paymentResult) {
        const orderNumber = this.generateOrderNumber();
        
        const order = {
            orderNumber: orderNumber,
            userInfo: this.userInfo,
            items: this.orderItems,
            total: this.orderTotal,
            paymentMethod: this.paymentMethod,
            paymentResult: paymentResult,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        // Guardar pedido
        this.saveOrder(order);

        // Limpiar carrito
        localStorage.removeItem('carrito');

        // Mostrar confirmación
        document.getElementById('orderNumber').textContent = orderNumber;
        this.goToStep(3);

        // Enviar notificación (simulado)
        this.sendOrderConfirmation(order);
    }

    // Guardar pedido
    saveOrder(order) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // También guardar en el perfil del usuario si está logueado
            const user = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
            if (user) {
                const userOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
                userOrders.push(order);
                localStorage.setItem(`orders_${user.email}`, JSON.stringify(userOrders));
            }
        } catch (error) {
            console.error('Error al guardar pedido:', error);
        }
    }

    // Aplicar descuento
    applyDiscount() {
        const code = document.getElementById('discountCode').value.trim().toUpperCase();
        
        if (code === 'DESCUENTO10' || code === 'PRIMERACOMPRA') {
            this.discountApplied = true;
            this.calculateTotals();
            this.showSuccess('¡Descuento aplicado correctamente!');
            document.getElementById('discountCode').disabled = true;
            document.getElementById('applyDiscount').disabled = true;
        } else {
            this.showError('Código de descuento inválido');
        }
    }

    // Cambiar paso
    goToStep(step) {
        // Ocultar todas las secciones
        document.querySelectorAll('.checkout-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Mostrar sección actual
        const sections = ['user-info-section', 'payment-section', 'confirmation-section'];
        document.getElementById(sections[step - 1]).classList.remove('hidden');

        // Actualizar pasos en header
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            stepEl.classList.toggle('active', index + 1 === step);
        });

        this.currentStep = step;
    }

    // Mostrar/ocultar loader de pago
    showPaymentLoader(show) {
        const btn = document.getElementById('process-payment');
        const text = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.btn-loader');

        if (show) {
            text.style.display = 'none';
            loader.classList.remove('hidden');
            loader.classList.add('show');
            btn.disabled = true;
        } else {
            text.style.display = 'inline';
            loader.classList.add('hidden');
            loader.classList.remove('show');
            btn.disabled = false;
        }
    }

    // Utilidades
    formatPrice(price) {
        return new Intl.NumberFormat('es-CO').format(price);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    getFieldLabel(field) {
        const labels = {
            email: 'Email',
            firstName: 'Nombre',
            lastName: 'Apellido',
            address: 'Dirección',
            city: 'Ciudad',
            state: 'Departamento',
            phone: 'Teléfono'
        };
        return labels[field] || field;
    }

    generateTransactionId() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateOrderNumber() {
        return 'ORD_' + Date.now();
    }

    generatePaymentCode() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showError(message) {
        // Implementar notificación de error
        alert('Error: ' + message);
    }

    showSuccess(message) {
        // Implementar notificación de éxito
        alert('Éxito: ' + message);
    }

    sendOrderConfirmation(order) {
        // Simular envío de confirmación
        console.log('Confirmación de pedido enviada:', order);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});
