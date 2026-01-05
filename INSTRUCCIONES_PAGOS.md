# 💳 INSTRUCCIONES DE CONFIGURACIÓN DE PAGOS - MUNDO CALZADO

> **Documento actualizado:** 5 Enero 2026  
> **Estado:** Sistema de checkout implementado, pendiente configuración de producción

---

## 📋 ÍNDICE

1. [Resumen General](#resumen-general)
2. [Métodos de Pago Implementados](#métodos-de-pago-implementados)
3. [Configuración de Wompi](#configuración-de-wompi)
4. [Configuración de Addi](#configuración-de-addi)
5. [Testing](#testing)
6. [Variables de Entorno](#variables-de-entorno)
7. [Pasos para Producción](#pasos-para-producción)

---

## 📌 RESUMEN GENERAL

El sistema de checkout de **Mundo Calzado** está preparado para integrar múltiples métodos de pago colombianos:

- **Nequi:** Billetera digital
- **Daviplata:** Billetera Davivienda
- **PSE:** Débito bancario
- **Tarjetas:** Crédito/Débito (Visa, Mastercard, Amex)
- **Efectivo:** Contra entrega

Actualmente se utiliza **Wompi** como pasarela de pagos principal, con integración de **Addi** para pagos a plazos.

---

## 💰 MÉTODOS DE PAGO IMPLEMENTADOS

### 1. Nequi
- **Tipo:** Billetera digital
- **Provider:** Wompi
- **Fee:** 2.9% + $900 COP
- **Tiempo:** Inmediato

### 2. Daviplata
- **Tipo:** Billetera digital
- **Provider:** Wompi
- **Fee:** 2.9% + $900 COP
- **Tiempo:** Inmediato

### 3. PSE (Pagos Seguros en Línea)
- **Tipo:** Débito bancario
- **Provider:** Wompi
- **Fee:** 2.49% + $900 COP
- **Tiempo:** 2-4 horas verificación

### 4. Tarjetas de Crédito/Débito
- **Tipo:** Tarjeta
- **Provider:** Wompi
- **Fee:** 2.99% + $900 COP
- **Tiempo:** Inmediato
- **Marcas:** Visa, Mastercard, American Express, Diners

### 5. Efectivo Contra Entrega
- **Tipo:** Cash on Delivery
- **Provider:** Interno
- **Fee:** 0%
- **Tiempo:** Al momento de entrega

---

## 🔧 CONFIGURACIÓN DE WOMPI

### Paso 1: Crear Cuenta en Wompi

1. Visita [https://wompi.com/](https://wompi.com/)
2. Clic en "Crear cuenta comercio"
3. Completa registro con datos de empresa:
   - NIT de Mundo Calzado
   - Información legal de la empresa
   - Cuenta bancaria para desembolsos

### Paso 2: Verificación de Cuenta

1. Subir documentos requeridos:
   - Cédula del representante legal
   - RUT actualizado
   - Certificado de existencia (Cámara de Comercio)
   - Certificación bancaria

2. Esperar aprobación (1-3 días hábiles)

### Paso 3: Obtener Credenciales

Una vez aprobada la cuenta, obtener:

```javascript
// SANDBOX (Desarrollo)
const WOMPI_PUBLIC_KEY_TEST = "pub_test_XXXXXXXXXXXXXX";
const WOMPI_PRIVATE_KEY_TEST = "prv_test_XXXXXXXXXXXXXX";
const WOMPI_EVENTS_SECRET_TEST = "test_events_XXXXXXXXXXXXXX";

// PRODUCTION (Producción)
const WOMPI_PUBLIC_KEY_PROD = "pub_prod_XXXXXXXXXXXXXX";
const WOMPI_PRIVATE_KEY_PROD = "prv_prod_XXXXXXXXXXXXXX";
const WOMPI_EVENTS_SECRET_PROD = "prod_events_XXXXXXXXXXXXXX";
```

### Paso 4: Integrar SDK

Ya está implementado en el proyecto. Ubicación:
- **Script principal:** `mypageshoes/js/addi-integration.js`
- **Checkout manager:** `mypageshoes/js/checkout-manager.js`

### Paso 5: Configurar Webhooks

1. En panel de Wompi → Configuración → Webhooks
2. Agregar URL: `https://mundocalzado.com/api/webhooks/wompi`
3. Eventos a escuchar:
   - `transaction.updated`
   - `payment.approved`
   - `payment.declined`
   - `payment.error`

---

## 🛍️ CONFIGURACIÓN DE ADDI

### Paso 1: Registro en Addi

1. Visita [https://addi.com/co/comercios](https://addi.com/co/comercios)
2. Solicitar demo comercial
3. Completar formulario de registro

### Paso 2: Integración

```javascript
// Credenciales Addi (actualizar en addi-integration.js)
const ADDI_API_KEY = "tu_api_key_aqui";
const ADDI_MERCHANT_ID = "tu_merchant_id";
```

### Paso 3: Configuración del Widget

Ya implementado en:
- **Archivo:** `mypageshoes/js/addi-integration.js`
- **Widget:** Se carga automáticamente en checkout

---

## 🧪 TESTING

### Modo Sandbox (Actual)

El sistema está en modo **SANDBOX** para pruebas:

#### Tarjetas de Prueba Wompi:

```
APROBADA:
- Número: 4242 4242 4242 4242
- CVV: 123
- Fecha: 12/25

RECHAZADA:
- Número: 4111 1111 1111 1111
- CVV: 123
- Fecha: 12/25

3D SECURE:
- Número: 4000 0000 0000 3220
- CVV: 123
- Fecha: 12/25
```

#### Nequi/Daviplata Test:
- Número: 300 123 4567
- PIN: 1234

### Testing Checklist:

- [ ] Compra exitosa con tarjeta
- [ ] Compra rechazada con tarjeta
- [ ] Pago con Nequi
- [ ] Pago con PSE
- [ ] Pago contra entrega
- [ ] Webhooks recibidos correctamente
- [ ] Emails de confirmación enviados

---

## 🌍 VARIABLES DE ENTORNO

Crear archivo `.env` en la raíz del proyecto:

```bash
# Wompi Configuration
WOMPI_ENV=sandbox  # cambiar a "production" en producción
WOMPI_PUBLIC_KEY=pub_test_XXXXXXXXXXXXXX
WOMPI_PRIVATE_KEY=prv_test_XXXXXXXXXXXXXX
WOMPI_EVENTS_SECRET=test_events_XXXXXXXXXXXXXX

# Addi Configuration
ADDI_API_KEY=tu_api_key_aqui
ADDI_MERCHANT_ID=tu_merchant_id

# Database (cuando se implemente backend)
DB_HOST=localhost
DB_USER=mundocalzado_user
DB_PASSWORD=secure_password_here
DB_NAME=mundocalzado_db

# Email Configuration (para confirmaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ventas@mundocalzado.com
SMTP_PASSWORD=app_specific_password

# Environment
NODE_ENV=development  # cambiar a "production"
BASE_URL=http://localhost:8000  # cambiar a URL real
```

**⚠️ IMPORTANTE:** Nunca subir `.env` a Git. Agregar a `.gitignore`:

```
# .gitignore
.env
.env.local
.env.production
```

---

## 🚀 PASOS PARA PRODUCCIÓN

### 1. Actualizar Credenciales

```javascript
// En mypageshoes/js/checkout-manager.js
const CONFIG = {
  wompi: {
    publicKey: process.env.WOMPI_PUBLIC_KEY || 'pub_prod_REAL_KEY_HERE',
    environment: 'production'  // cambiar de 'sandbox'
  }
};
```

### 2. Configurar HTTPS

Wompi requiere HTTPS obligatorio:
- Certificado SSL activo
- Redirección automática HTTP → HTTPS
- TLS 1.2 mínimo

### 3. Configurar Webhooks Producción

```
URL: https://mundocalzado.com/api/webhooks/wompi
Secret: prod_events_XXXXXXXXXXXXXX
```

### 4. Testing Pre-Lanzamiento

Realizar al menos **5 transacciones reales de bajo monto** ($1,000 COP):
- 1 con tarjeta crédito
- 1 con Nequi
- 1 con PSE
- 1 contra entrega
- 1 rechazada intencionalmente

### 5. Monitoreo Post-Lanzamiento

- Dashboard Wompi: Revisar diariamente primeros 7 días
- Logs de transacciones: Guardar todos los eventos
- Errores: Configurar alertas automáticas

### 6. Soporte

- **Wompi:** soporte@wompi.com / WhatsApp: +57 310 123 4567
- **Addi:** soporte@addi.com
- **Mundo Calzado Tech:** dev@mundocalzado.com

---

## 📊 FEES Y COSTOS

| Método de Pago | Fee Transacción | Fee Fijo | Tiempo Desembolso |
|----------------|-----------------|----------|-------------------|
| Nequi          | 2.9%           | $900     | T+1 días         |
| Daviplata      | 2.9%           | $900     | T+1 días         |
| PSE            | 2.49%          | $900     | T+2 días         |
| Tarjeta Crédito| 2.99%          | $900     | T+2 días         |
| Tarjeta Débito | 2.99%          | $900     | T+1 días         |
| Efectivo       | 0%             | $0       | Inmediato        |

**T = Día de la transacción**

---

## 🔒 SEGURIDAD

### PCI-DSS Compliance

Wompi es PCI-DSS Level 1 certificado. **NUNCA** guardar:
- Números completos de tarjeta
- CVV
- PINs

### Datos Permitidos Guardar:
- Últimos 4 dígitos de tarjeta (para referencia)
- Tipo de tarjeta (Visa/Mastercard)
- Fecha de expiración (mes/año)
- Token de Wompi (para pagos recurrentes)

---

## 📞 CONTACTO Y SOPORTE

**Wompi:**
- Web: https://wompi.com/
- Soporte: soporte@wompi.com
- Documentación: https://docs.wompi.co/

**Addi:**
- Web: https://addi.com/
- Soporte: comercios@addi.com

**Mundo Calzado - Desarrollo:**
- Email: dev@mundocalzado.com
- WhatsApp: +57 300 123 4567

---

## ✅ CHECKLIST FINAL PRE-PRODUCCIÓN

- [ ] Cuenta Wompi verificada y aprobada
- [ ] Credenciales de producción obtenidas
- [ ] Certificado SSL instalado y funcionando
- [ ] Variables de entorno configuradas (.env)
- [ ] Webhooks configurados y testeados
- [ ] 5 transacciones de prueba exitosas
- [ ] Emails de confirmación funcionando
- [ ] Página de éxito/error checkout testeadas
- [ ] Logs de transacciones implementados
- [ ] Equipo capacitado en manejo de errores
- [ ] Soporte al cliente notificado

---

**Última actualización:** 5 Enero 2026  
**Versión del documento:** 1.0  
**Estado:** ✅ Listo para configuración final