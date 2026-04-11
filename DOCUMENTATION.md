# Documentación Técnica - Mundo Calzado

Documentation completa de configuración, setup y desarrollo de la plataforma Mundo Calzado.

---

## 📋 Tabla de Contenidos

- [Configuración Firebase](#configuración-firebase)
- [Backend y Pagos Wompi](#backend-y-pagos-wompi)
- [Deployment](#deployment)
- [Variables de Entorno](#variables-de-entorno)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 🔐 Configuración Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto: "Mundo Calzado"
3. Habilita **Authentication** → Email/Password
4. Habilita **Firestore Database**

### 2. Obtener Credenciales

1. En Firebase Console: **Configuración del proyecto** → **Tus aplicaciones**
2. Agrega una **App web**
3. Copia las credenciales

### 3. Configurar en el Proyecto

```bash
cd mypageshoes/js
cp firebase-config.example.js firebase-config.js
# Editar firebase-config.js con tus credenciales
```

Reemplaza los placeholders:
```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### 4. Incluir Firebase SDK en HTML

Agrega en `<head>` de las páginas que usen auth:

```html
<script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
```

---

## 💳 Backend y Pagos Wompi

### Setup del Backend

```bash
cd server
npm install
cp .env.example .env
```

### Configuración de Wompi

1. **Obtén tus claves de Wompi:**
   - Sandbox: https://comercios.wompi.co/
   - Copia: `PUBLIC_KEY` y `PRIVATE_KEY`

2. **Edita el .env:**
```env
PORT=3000
WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxx
WOMPI_PRIVATE_KEY=prv_test_xxxxxxxxxx
WOMPI_ENV=test
WOMPI_WEBHOOK_SECRET=tu_webhook_secret
FRONTEND_URL=http://localhost:5500
```

3. **Ejecuta el servidor:**
```bash
npm run dev
```

El servidor estará en `http://localhost:3000`

### Endpoints Disponibles

#### POST /api/payments/wompi/init
Inicializa una transacción de pago con Wompi.

**Request:**
```json
{
  "amount": 50000,
  "currency": "COP",
  "reference": "ORD-12345",
  "customerEmail": "cliente@email.com",
  "customerName": "Juan Pérez",
  "items": [],
  "shippingAddress": {}
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { ... },
  "paymentLink": "https://checkout.wompi.co/...",
  "integritySignature": "abc123..."
}
```

#### POST /api/payments/wompi/webhook
Recibe notificaciones de Wompi sobre cambios de estado de transacciones.

**Configurar en Wompi:**
- URL: `https://tu-api.com/api/payments/wompi/webhook`
- Evento: `transaction.updated`

#### GET /api/payments/wompi/transaction/:transactionId
Consulta el estado actual de una transacción.

### Tarjetas de Prueba

**Aprobada:**
- Número: `4242 4242 4242 4242`
- CVV: `123`
- Fecha: Cualquier fecha futura

**Rechazada:**
- Número: `4111 1111 1111 1111`
- CVV: `123`
- Fecha: Cualquier fecha futura

---

## 🌐 Deployment

### Frontend

#### GitHub Pages
1. Push a GitHub
2. Settings → Pages
3. Seleccionar branch `main` → Save
4. Acceder: `https://usuario.github.io/nueva-version-calzado-pag-completa-main/`

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Backend

#### Railway (Recomendado)
```bash
railway login
cd server
railway init
railway up
```

#### Heroku
```bash
heroku create mundo-calzado-api
git subtree push --prefix server heroku main
heroku config:set WOMPI_PUBLIC_KEY=pub_prod_xxx
heroku config:set WOMPI_PRIVATE_KEY=prv_prod_xxx
```

### Post-Deployment

1. **Actualizar URL del backend** en `mypageshoes/js/checkout-manager.js`:
```javascript
const API_URL = 'https://tu-api-produccion.com';
```

2. **Configurar webhook en Wompi:**
   - URL: `https://tu-api.com/api/payments/wompi/webhook`
   - Evento: `transaction.updated`

3. **Actualizar número WhatsApp** en `mypageshoes/js/invoice-generator.js`:
```javascript
this.whatsappNumber = '573XXXXXXXXX';
```

---

## 🔐 Variables de Entorno

### Backend (server/.env)

```bash
# PORT
PORT=3000

# WOMPI PRODUCCIÓN
WOMPI_PUBLIC_KEY=pub_prod_XXXXXXXXXXXXXXXXXXXXXXXXXX
WOMPI_PRIVATE_KEY=prv_prod_XXXXXXXXXXXXXXXXXXXXXXXXXX
WOMPI_EVENTS_SECRET=prod_events_XXXXXXXXXXXXXXXXXXXXXX

# WOMPI TESTING
# WOMPI_PUBLIC_KEY=pub_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
# WOMPI_PRIVATE_KEY=prv_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
# WOMPI_EVENTS_SECRET=test_events_XXXXXXXXXXXXXXXXXXXXXX

# URLs
FRONTEND_URL=https://mundocalzado.com
ALLOWED_ORIGINS=https://mundocalzado.com,http://localhost:5500

# ENTORNO
NODE_ENV=production
```

### Frontend

Para usar Firebase (opcional), crea `mypageshoes/js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

---

## 🧪 Testing

### Checklist de Verificación

- [ ] Banner aparece en todas las páginas
- [ ] "Iniciar sesión" cambia a "Cerrar sesión" al loguearse
- [ ] Imágenes cargan o muestran placeholder
- [ ] Agregar al carrito funciona desde cualquier página
- [ ] "IR A PAGAR" redirige a login si no logueado
- [ ] Checkout guarda ubicación GPS
- [ ] Factura genera correctamente después del pago
- [ ] "Compartir por WhatsApp" abre WhatsApp con mensaje
- [ ] Botones NO tapan elementos importantes
- [ ] Responsive funciona en móvil (320px - 768px)

### Testing en Local

```bash
# Frontend
npx http-server -p 5500

# Backend (en otra terminal)
cd server
npm run dev

# Abrir
http://localhost:5500
```

### Testing con Wompi

Usar las tarjetas de prueba listadas en la sección de Wompi.

---

## 🔧 Troubleshooting

### Las imágenes no cargan en hosting

**Solución:**
1. Verificar case-sensitivity de nombres de archivos
2. Comprobar rutas (deben ser `./assets/img/` o `./mypageshoes/images/`)
3. Verificar permisos: `chmod 644 *.jpg && chmod 755 images/`

### Carrito no funciona

**Solución:**
1. Abrir consola del navegador (F12)
2. Verificar errores en JavaScript
3. Comprobar que LocalStorage está habilitado
4. Limpiar caché del navegador

### CORS errors

**Solución:**
1. Verificar que backend está corriendo
2. Comprobar URL en `checkout-manager.js` es correcta
3. Verificar `ALLOWED_ORIGINS` en `.env` incluye tu dominio

### Firebase Auth no funciona

**Solución:**
1. Verificar que `firebase-config.js` tiene credenciales correctas
2. Comprobar que Firebase SDK está en `<head>` de HTML
3. Verificar que Authentication está habilitado en Firebase Console
4. Ver consola de navegador para errores específicos

### Webhook de Wompi no recibe eventos

**Solución:**
1. Verificar URL en Wompi es accesible públicamente
2. Comprobar que `WOMPI_WEBHOOK_SECRET` es correcto
3. Ver logs del servidor para errores
4. Verificar que backend está en HTTPS

---

## 📚 Referencias

- [Firebase Documentation](https://firebase.google.com/docs)
- [Wompi API Docs](https://docs.wompi.co/)
- [Express.js Guide](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Última actualización:** 10 de Abril de 2026
