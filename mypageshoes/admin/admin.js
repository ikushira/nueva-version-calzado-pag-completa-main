/**
 * admin.js
 * Sistema de gestión administrativa para Mundo Calzado
 * Requiere autenticación con rol isAdmin
 */

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.products = [];
        this.orders = [];
        this.users = [];
        this.currentProductId = null;
        
        this.init();
    }

    init() {
        // Verificar autenticación y permisos de administrador
        if (!this.checkAdminAuth()) {
            window.location.href = '../login.html';
            return;
        }

        this.setupElements();
        this.bindEvents();
        this.loadData();
    }

    checkAdminAuth() {
        // Verificar sesión activa
        const currentUser = window.gestorUsuarios ? 
            window.gestorUsuarios.obtenerUsuarioActivo() : 
            JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

        if (!currentUser) {
            alert('Debes iniciar sesión para acceder al panel administrativo');
            return false;
        }

        // Verificar rol de administrador
        let isAdmin = false;
        
        if (window.gestorUsuarios) {
            const userProfile = window.gestorUsuarios.obtenerUsuarioPorEmail(currentUser.email);
            isAdmin = userProfile?.isAdmin === true || userProfile?.rol === 'admin';
        } else {
            // Fallback: verificar en localStorage
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                isAdmin = user.isAdmin === true || user.rol === 'admin';
            }
        }

        if (!isAdmin) {
            alert('No tienes permisos de administrador para acceder a esta página');
            return false;
        }

        // Mostrar nombre del usuario
        const userName = currentUser.name || currentUser.email;
        document.getElementById('admin-user-name').textContent = userName;

        return true;
    }

    setupElements() {
        this.navButtons = document.querySelectorAll('.admin-nav-item');
        this.sections = document.querySelectorAll('.admin-section');
        this.logoutBtn = document.getElementById('btn-logout');
        this.btnNuevoProducto = document.getElementById('btn-nuevo-producto');
        this.modalProducto = document.getElementById('modal-producto');
        this.formProducto = document.getElementById('form-producto');
    }

    bindEvents() {
        // Navegación entre secciones
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Cerrar sesión
        this.logoutBtn?.addEventListener('click', () => this.logout());

        // Nuevo producto
        this.btnNuevoProducto?.addEventListener('click', () => this.openProductModal());

        // Cerrar modales
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Formulario de producto
        this.formProducto?.addEventListener('submit', (e) => this.saveProduct(e));

        // Filtro de órdenes
        document.getElementById('filter-orden-estado')?.addEventListener('change', (e) => {
            this.filterOrders(e.target.value);
        });
    }

    switchSection(sectionName) {
        // Actualizar botones de navegación
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Actualizar secciones
        this.sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`section-${sectionName}`)?.classList.add('active');

        this.currentSection = sectionName;

        // Cargar datos de la sección si es necesario
        if (sectionName === 'productos') {
            this.loadProducts();
        } else if (sectionName === 'ordenes') {
            this.loadOrders();
        } else if (sectionName === 'usuarios') {
            this.loadUsers();
        }
    }

    async loadData() {
        // Cargar datos iniciales para el dashboard
        await Promise.all([
            this.loadProducts(),
            this.loadOrders(),
            this.loadUsers()
        ]);

        this.updateDashboardStats();
    }

    async loadProducts() {
        try {
            // Cargar productos desde products.json
            const response = await fetch('../data/products.json');
            this.products = await response.json();
            
            this.renderProductsTable();
        } catch (error) {
            console.error('Error cargando productos:', error);
            this.products = [];
        }
    }

    renderProductsTable() {
        const tbody = document.getElementById('productos-table-body');
        
        if (!this.products || this.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay productos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="../images/products/${product.id}/${product.images?.[0] || 'placeholder.png'}" 
                         alt="${product.name}" 
                         class="product-thumbnail"
                         onerror="this.src='../images/placeholder.png'">
                </td>
                <td>${product.name}</td>
                <td>${product.category || 'N/A'}</td>
                <td>$${product.price?.toLocaleString('es-CO') || '0'}</td>
                <td>${product.stock || 'N/A'}</td>
                <td>
                    <span class="badge badge-${product.available ? 'success' : 'danger'}">
                        ${product.available ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="adminPanel.editProduct(${product.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="adminPanel.deleteProduct(${product.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadOrders() {
        // Cargar órdenes desde localStorage
        const orders = JSON.parse(localStorage.getItem('mundo_calzado_orders') || '[]');
        this.orders = orders;
        
        this.renderOrdersTable();
    }

    renderOrdersTable() {
        const tbody = document.getElementById('ordenes-table-body');
        
        if (!this.orders || this.orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay órdenes registradas</td></tr>';
            return;
        }

        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName || 'N/A'}</td>
                <td>${new Date(order.date).toLocaleDateString('es-CO')}</td>
                <td>$${order.total?.toLocaleString('es-CO') || '0'}</td>
                <td>
                    <select class="order-status-select" data-order-id="${order.id}">
                        <option value="pendiente" ${order.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="procesando" ${order.status === 'procesando' ? 'selected' : ''}>Procesando</option>
                        <option value="enviado" ${order.status === 'enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="entregado" ${order.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                        <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </td>
                <td>${order.paymentMethod || 'N/A'}</td>
                <td>
                    <button class="btn-icon" onclick="adminPanel.viewOrder(${order.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Agregar listeners para cambios de estado
        document.querySelectorAll('.order-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const orderId = e.target.getAttribute('data-order-id');
                this.updateOrderStatus(orderId, e.target.value);
            });
        });
    }

    loadUsers() {
        // Cargar usuarios usando gestor unificado
        if (window.gestorUsuarios) {
            this.users = window.gestorUsuarios.obtenerUsuarios();
        } else {
            this.users = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        }
        
        this.renderUsersTable();
    }

    renderUsersTable() {
        const tbody = document.getElementById('usuarios-table-body');
        
        if (!this.users || this.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay usuarios registrados</td></tr>';
            return;
        }

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.nombre || ''} ${user.apellido || ''}</td>
                <td>${user.email}</td>
                <td>${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-CO') : 'N/A'}</td>
                <td>${user.ordersCount || 0}</td>
                <td>
                    <span class="badge badge-${user.isAdmin ? 'primary' : 'secondary'}">
                        ${user.isAdmin ? 'Admin' : 'Cliente'}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="adminPanel.viewUser('${user.email}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateDashboardStats() {
        document.getElementById('stat-productos').textContent = this.products.length;
        document.getElementById('stat-ordenes').textContent = this.orders.length;
        document.getElementById('stat-usuarios').textContent = this.users.length;
        
        const totalVentas = this.orders.reduce((sum, order) => sum + (order.total || 0), 0);
        document.getElementById('stat-ventas').textContent = `$${totalVentas.toLocaleString('es-CO')}`;
    }

    openProductModal(productId = null) {
        this.currentProductId = productId;
        const modal = this.modalProducto;
        const title = document.getElementById('modal-producto-title');

        if (productId) {
            // Editar producto existente
            const product = this.products.find(p => p.id === productId);
            if (!product) return;

            title.textContent = 'Editar Producto';
            document.getElementById('producto-nombre').value = product.name || '';
            document.getElementById('producto-categoria').value = product.category || '';
            document.getElementById('producto-precio').value = product.price || '';
            document.getElementById('producto-precio-anterior').value = product.oldPrice || '';
            document.getElementById('producto-descripcion').value = product.description || '';
            document.getElementById('producto-marca').value = product.brand || '';
            document.getElementById('producto-tallas').value = product.sizes?.join(', ') || '';
            document.getElementById('producto-imagenes').value = product.images?.join('\n') || '';
        } else {
            // Nuevo producto
            title.textContent = 'Nuevo Producto';
            this.formProducto.reset();
        }

        modal.classList.add('active');
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.currentProductId = null;
    }

    saveProduct(e) {
        e.preventDefault();

        const productData = {
            id: this.currentProductId || Date.now(),
            name: document.getElementById('producto-nombre').value,
            category: document.getElementById('producto-categoria').value,
            price: parseInt(document.getElementById('producto-precio').value),
            oldPrice: parseInt(document.getElementById('producto-precio-anterior').value) || null,
            description: document.getElementById('producto-descripcion').value,
            brand: document.getElementById('producto-marca').value,
            sizes: document.getElementById('producto-tallas').value.split(',').map(s => s.trim()).filter(s => s),
            images: document.getElementById('producto-imagenes').value.split('\n').map(s => s.trim()).filter(s => s),
            available: true,
            stock: 'Disponible'
        };

        if (this.currentProductId) {
            // Actualizar producto existente
            const index = this.products.findIndex(p => p.id === this.currentProductId);
            if (index !== -1) {
                this.products[index] = productData;
            }
        } else {
            // Agregar nuevo producto
            this.products.push(productData);
        }

        // Guardar en localStorage (en producción esto iría a un backend)
        localStorage.setItem('mundo_calzado_products', JSON.stringify(this.products));

        alert('Producto guardado exitosamente');
        this.closeModals();
        this.renderProductsTable();
        this.updateDashboardStats();
    }

    editProduct(productId) {
        this.openProductModal(productId);
    }

    deleteProduct(productId) {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        this.products = this.products.filter(p => p.id !== productId);
        localStorage.setItem('mundo_calzado_products', JSON.stringify(this.products));

        alert('Producto eliminado');
        this.renderProductsTable();
        this.updateDashboardStats();
    }

    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id == orderId);
        if (order) {
            order.status = newStatus;
            localStorage.setItem('mundo_calzado_orders', JSON.stringify(this.orders));
            alert(`Estado de orden #${orderId} actualizado a: ${newStatus}`);
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id == orderId);
        if (order) {
            alert(`Detalles de orden #${orderId}:\n\n${JSON.stringify(order, null, 2)}`);
        }
    }

    viewUser(email) {
        const user = this.users.find(u => u.email === email);
        if (user) {
            alert(`Detalles de usuario:\n\n${JSON.stringify(user, null, 2)}`);
        }
    }

    filterOrders(status) {
        const allOrders = JSON.parse(localStorage.getItem('mundo_calzado_orders') || '[]');
        
        if (status) {
            this.orders = allOrders.filter(o => o.status === status);
        } else {
            this.orders = allOrders;
        }
        
        this.renderOrdersTable();
    }

    logout() {
        if (confirm('¿Cerrar sesión del panel administrativo?')) {
            if (window.gestorUsuarios) {
                window.gestorUsuarios.cerrarSesion();
            } else {
                localStorage.removeItem('usuarioActivo');
                localStorage.removeItem('usuarioActual');
            }
            window.location.href = '../login.html';
        }
    }
}

// Inicializar el panel administrativo
let adminPanel;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        adminPanel = new AdminPanel();
    });
} else {
    adminPanel = new AdminPanel();
}
