# Sistema de Pasarela de Pagos y Perfil de Usuario - Mundo Calzado

## Descripción General

Este sistema integra una pasarela de pagos completa con gestión de perfiles de usuario y crédito instantáneo con Addi para la tienda de calzado online.

## Características Principales

### 🛒 Checkout Integrado
- **Proceso de pago en 3 pasos**: Información, Pago, Confirmación
- **Múltiples métodos de pago**: Tarjeta, PSE, Addi, Efectivo
- **Validación en tiempo real** de datos de tarjeta y usuario
- **Guardar información** para futuras compras
- **Cálculo automático** de envío (gratis con 2+ productos)

### 💳 Pasarela de Pagos
- **Integración con múltiples proveedores**:
  - MercadoPago
  - PayU
  - Wompi
- **Soporte para PSE** (Pagos Seguros en Línea)
- **Pagos en efectivo** (Efecty, Baloto)
- **Tokenización de tarjetas** para seguridad
- **Webhooks** para actualización de estados

### 🏦 Integración con Addi
- **Crédito instantáneo** sin tarjeta de crédito
- **Aprobación en segundos**
- **Cuotas flexibles** según el monto
- **Verificación de elegibilidad** automática
- **Seguimiento de solicitudes** de crédito

### 👤 Gestión de Perfiles
- **Perfiles completos** con datos personales
- **Historial de pedidos** detallado
- **Métodos de pago guardados** (tokenizados)
- **Direcciones múltiples** de envío
- **Estadísticas de compra** y análisis
- **Recomendaciones personalizadas**

## Estructura de Archivos

```
/
├── checkout.html                    # Página principal del checkout
├── checkout-success.html            # Página de confirmación de pago
├── checkout-error.html             # Página de error de pago
├── css/
│   └── checkout.css                # Estilos del sistema de checkout
├── js/
│   ├── checkout.js                 # Lógica principal del checkout
│   ├── payment-gateway.js          # Sistema de pasarela de pagos
│   ├── addi-integration.js         # Integración con Addi
│   ├── user-profile-manager.js     # Gestión de perfiles de usuario
│   └── carrito-nuevo.js           # Carrito actualizado con checkout
└── README-checkout-sistema.md      # Esta documentación
```

## Flujo de Usuario

### 1. Proceso de Compra
1. **Agregar productos** al carrito
2. **Hacer clic en "IR A PAGAR"** en el carrito
3. **Completar información** personal y de envío
4. **Seleccionar método de pago**
5. **Completar datos de pago**
6. **Confirmar pedido**
7. **Recibir confirmación**

### 2. Métodos de Pago Disponibles

#### Tarjeta de Crédito/Débito
- Visa, MasterCard, American Express
- Validación en tiempo real
- Guardar para futuras compras
- Procesamiento seguro

#### PSE (Pagos Seguros en Línea)
- Bancos colombianos principales
- Redirección segura al banco
- Confirmación automática

#### Addi - Crédito Instantáneo
- Sin tarjeta de crédito
- Aprobación inmediata
- Cuotas desde 2 hasta 12 meses
- Proceso de verificación por celular

#### Pago en Efectivo
- Efecty, Baloto y otros puntos
- Código de pago único
- Expiración en 24 horas
- Confirmación automática

### 3. Gestión de Crédito Addi

#### Elegibilidad
El sistema verifica automáticamente:
- ✅ Perfil completo (documento, teléfono, dirección)
- ✅ Historial de compras (si existe)
- ✅ Historial de pagos
- ✅ Teléfono válido
- ✅ Email válido

#### Proceso de Aprobación
1. **Ingreso de número celular**
2. **Aceptación de términos**
3. **Verificación automática**
4. **Respuesta en segundos**:
   - ✅ **Aprobado**: Continúa con el pedido
   - ⏳ **Pendiente**: Revisión manual
   - ❌ **Rechazado**: Ofrecer otros métodos

#### Montos y Cuotas
- **Monto mínimo**: $50,000
- **Monto máximo**: $3,000,000
- **Cuotas disponibles**:
  - $50K - $200K: 2-3 cuotas
  - $100K - $500K: 4-6 cuotas
  - $200K+: hasta 12 cuotas

## Configuración Técnica

### Variables de Entorno
```javascript
// MercadoPago
MERCADOPAGO_PUBLIC_KEY=TEST-pub-key
MERCADOPAGO_ACCESS_TOKEN=TEST-access-token

// PayU
PAYU_MERCHANT_ID=TEST-merchant
PAYU_ACCOUNT_ID=TEST-account
PAYU_API_KEY=TEST-api-key

// Wompi
WOMPI_PUBLIC_KEY=pub_test_key
WOMPI_PRIVATE_KEY=prv_test_key

// Addi
ADDI_API_KEY=test_key_123
```

### Inicialización
```javascript
// Los sistemas se inicializan automáticamente
new CheckoutManager();          // Gestiona el proceso de checkout
new PaymentGateway();          // Maneja los pagos
new AddiIntegration();         // Integración con Addi
new UserProfileManager();      // Gestiona perfiles
```

## Datos Almacenados

### LocalStorage
- `carrito`: Productos en el carrito
- `usuarioActual`: Usuario logueado
- `usuarios`: Lista de usuarios registrados
- `orders`: Todos los pedidos
- `orders_${email}`: Pedidos por usuario
- `payment_methods_${email}`: Métodos de pago guardados
- `addresses_${email}`: Direcciones guardadas

### Estructura de Pedido
```javascript
{
  orderNumber: "ORD_1640995200000",
  userInfo: {
    email: "usuario@email.com",
    firstName: "Juan",
    lastName: "Pérez",
    address: "Calle 123 #45-67",
    city: "Cali",
    state: "Valle del Cauca",
    phone: "3001234567"
  },
  items: [
    {
      nombre: "Zapato Deportivo",
      precio: 150000,
      talla: "39",
      cantidad: 1
    }
  ],
  total: 150000,
  paymentMethod: "addi",
  paymentResult: {
    transactionId: "ADDI_1640995200000",
    approvalStatus: "approved"
  },
  status: "confirmed",
  createdAt: "2024-01-01T12:00:00.000Z"
}
```

## Seguridad

### Datos Sensibles
- ❌ **NO se almacenan**: Números completos de tarjeta, CVV
- ✅ **Se almacenan**: Últimos 4 dígitos, tokens de pago
- 🔒 **Tokenización**: Los datos sensibles se tokenizan

### Validaciones
- Validación de formato de tarjeta
- Verificación de fecha de expiración
- Validación de CVV
- Verificación de email y teléfono
- Validación de dirección

## Notificaciones

### Email (Simulado)
- Confirmación de pedido
- Estado de crédito Addi
- Actualizaciones de envío

### SMS (Simulado)
- Código de verificación Addi
- Confirmación de pago
- Estado del envío

## Webhooks de Addi

### Eventos Soportados
- `approved`: Crédito aprobado
- `rejected`: Crédito rechazado
- `cancelled`: Crédito cancelado
- `completed`: Crédito pagado completamente

### Endpoint
```javascript
// POST /webhook/addi
{
  transaction_id: "ADDI_123",
  status: "approved",
  amount: 150000,
  customer: {
    email: "usuario@email.com"
  }
}
```

## Analíticas

### Eventos Registrados
- `purchase`: Compra completada
- `payment_error`: Error en pago
- `addi_application`: Solicitud de crédito
- `checkout_step`: Pasos del checkout

## Códigos de Descuento

### Códigos Disponibles
- `DESCUENTO10`: 10% de descuento
- `PRIMERACOMPRA`: 10% primera compra
- `BIENVENIDO10`: 10% usuarios nuevos
- `FIEL15`: 15% clientes frecuentes

## Desarrollo y Testing

### Datos de Prueba

#### Tarjetas de Prueba
```
Visa: 4111 1111 1111 1111
MasterCard: 5555 5555 5555 4444
Amex: 3782 8224 6310 005
CVV: 123 (321 para Amex)
Fecha: 12/25
```

#### Usuarios de Prueba
```
Email: test@mundocalzado.com
Password: test123
```

### Simulaciones
- **Aprobación Addi**: 70% de probabilidad
- **Pago con tarjeta**: 80% de éxito
- **PSE**: 90% de éxito

## Mantenimiento

### Logs
El sistema registra todos los eventos importantes en la consola del navegador.

### Actualizaciones
- Verificar compatibilidad con APIs de terceros
- Actualizar tokens y credenciales
- Revisar límites de Addi
- Validar certificados SSL

## Soporte

### Problemas Comunes

1. **Error "Usuario no autenticado"**
   - Verificar que el usuario esté logueado
   - Revisar localStorage

2. **Pago rechazado**
   - Verificar datos de tarjeta
   - Revisar fondos disponibles
   - Contactar banco emisor

3. **Crédito Addi rechazado**
   - Verificar elegibilidad
   - Completar perfil de usuario
   - Intentar con menor monto

### Contacto Técnico
Para problemas técnicos, revisar la consola del navegador y los logs del sistema.

---

## Próximas Mejoras

- [ ] Integración con más bancos PSE
- [ ] Wallet digital (Nequi, DaviPlata)
- [ ] Pago con criptomonedas
- [ ] Programa de puntos y recompensas
- [ ] Checkout express para usuarios frecuentes
- [ ] Integración con sistemas de inventario
- [ ] Notificaciones push
- [ ] Chat de soporte en vivo
