# Mundo Calzado - Tienda Online

> 🚀 Tienda e-commerce completa con sistema de pagos, administración y autenticación

![Estado](https://img.shields.io/badge/Estado-En%20Producción-green)
![Fase](https://img.shields.io/badge/Fase-Listo%20para%20Deploy-blue)
![Versión](https://img.shields.io/badge/Versión-2.1.0-brightgreen)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Nuevas Funcionalidades (v2.1.0)](#nuevas-funcionalidades-v210)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Configuración Firebase](#configuración-firebase)
- [Backend y Pagos Wompi](#backend-y-pagos-wompi)
- [Deployment](#deployment)
- [Testing](#testing)
- [Tecnologías](#tecnologías)

---

## 📝 Descripción

**Mundo Calzado** es una tienda online completa de calzado para toda la familia. Incluye sistema de autenticación, carrito de compras unificado, checkout con geolocalización, integración de pagos Wompi, facturación con WhatsApp, y panel administrativo con protección por roles.

---

## 🎉 Nuevas Funcionalidades (v2.1.0)

### 1. Header Global y Sesión Dinámica
- ✅ Banner negro "POR COMPRA DE 2 PARES EN ADELANTE, ENVÍO GRATIS!!" en todas las páginas
- ✅ Sistema de sesión con `header-manager.js`
- ✅ Cambio automático entre "Iniciar sesión" ↔ "Cerrar sesión / Mi perfil"
- ✅ Verificación de sesión desde `localStorage.mundo_calzado_session`

### 2. Sistema Unificado de Imágenes
- ✅ Convención única: `mypageshoes/images/products/{id}/{filename}`
- ✅ Lazy loading automático en todas las imágenes
- ✅ Fallback con `onerror` a `placeholder.png`
- ✅ Auto-inicialización: `initializeProductImages()` y `addFallbackToAllImages()`

### 3. Carrito Mejorado
- ✅ Integración con `headerManager` para verificar sesión
- ✅ Redirect a `login.html?next=` si usuario no logueado
- ✅ Z-index optimizado: botones flotantes NO tapan "IR A PAGAR"
- ✅ Persistencia completa en `localStorage.mundo_calzado_cart`

### 4. Checkout Completo con Facturación
- ✅ Botón "Compartir ubicación" con Geolocation API
- ✅ Guarda coordenadas GPS en pedido
- ✅ `invoice-generator.js` - Genera facturas HTML imprimibles
- ✅ Compartir factura por WhatsApp con mensaje formateado
- ✅ Botones en `checkout-success.html`: "Ver Factura" y "Compartir WhatsApp"

### 5. Firebase Auth Scaffold
- ✅ `firebase-config.example.js` con instrucciones completas
- ✅ Template para Firebase Auth + Firestore
- ✅ Placeholder para todas las claves API

---

## 📁 Estructura del Proyecto

```
proyecto-calzado/
├── index.html                         # Página principal
├── CHANGELOG.md                       # Registro de versiones
├── INSTRUCCIONES_PAGOS.md             # Guía Wompi completa
├── README.md                          # Este archivo
├── QA_CHECKLIST.md                    # Checklist de verificación
├── mypageshoes/
│   ├── *.html                         # 15 páginas principales
│   ├── admin/                         # Panel administrativo
│   ├── pages/                         # 18 páginas secundarias
│   ├── css/
│   │   ├── header-user-menu.css       # 🆕 Estilos header logueado
│   │   ├── z-index-hierarchy.css      # 🆕 Jerarquía de capas
│   │   └── ...
│   ├── js/
│   │   ├── header-manager.js          # 🆕 Gestión de sesión
│   │   ├── product-images.js          # 🆕 Sistema de imágenes reescrito
│   │   ├── cart-manager.js            # ✨ Mejorado con redirect
│   │   ├── checkout-manager.js        # ✨ Con geolocation
│   │   ├── invoice-generator.js       # 🆕 Generador de facturas
│   │   ├── firebase-config.example.js # 🆕 Template Firebase
│   │   └── ...
│   ├── images/
│   │   ├── products/{id}/             # Imágenes organizadas por ID
│   │   └── placeholder.png            # Fallback imagen
│   └── data/
│       └── products.json              # Base de datos productos
└── server/                            # Backend Node.js
    ├── src/
    │   ├── index.js
    │   ├── routes/payments.js
    │   └── controllers/wompi.js
    ├── package.json
    ├── .env.example
    └── README.md
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 16+ (para backend)
- Servidor web local (Live Server, http-server, etc.)
- Cuenta en Firebase (para auth)
- Cuenta en Wompi (para pagos)

### 1. Clonar Repositorio

```bash
git clone https://github.com/ikushira/nueva-version-calzado-pag-completa-main.git
cd nueva-version-calzado-pag-completa-main
```

### 2. Configurar Frontend

El frontend es estático y se puede servir con cualquier servidor web:

```bash
# Opción 1: Live Server (VS Code)
# Clic derecho en index.html > Open with Live Server

# Opción 2: http-server (npm)
npx http-server -p 5500

# Opción 3: Python
python -m http.server 5500
```

### 3. Configurar Backend (Pagos Wompi)

```bash
cd server
npm install
cp .env.example .env
# Editar .env con tus credenciales de Wompi
npm run dev
```

El servidor estará en `http://localhost:3000`

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
  // ... resto de configuración
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

### Configuración Rápida

1. **Obtén tus claves de Wompi:**
   - Sandbox: https://comercios.wompi.co/
   - Copia: `PUBLIC_KEY` y `PRIVATE_KEY`

2. **Configura el .env:**
```env
WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxxx
WOMPI_PRIVATE_KEY=prv_test_xxxxxxxxxx
WOMPI_ENV=test
WOMPI_WEBHOOK_SECRET=tu_webhook_secret
PORT=3000
FRONTEND_URL=http://localhost:5500
```

3. **Ejecuta el servidor:**
```bash
cd server
npm install
npm run dev
```

4. **Actualiza la URL en el frontend:**

En `mypageshoes/js/checkout-manager.js`:
```javascript
const API_URL = 'http://localhost:3000'; // Desarrollo
// const API_URL = 'https://tu-api-produccion.com'; // Producción
```

### Endpoints Disponibles

- **POST** `/api/payments/wompi/init` - Iniciar transacción
- **POST** `/api/payments/wompi/webhook` - Webhook de Wompi
- **GET** `/api/payments/wompi/transaction/:id` - Consultar estado

Ver [INSTRUCCIONES_PAGOS.md](./INSTRUCCIONES_PAGOS.md) para más detalles.

---

## 🌐 Deployment

### Frontend (Netlify / Vercel / GitHub Pages)

#### Netlify
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### GitHub Pages
1. Empuja el código a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` → Guardar

### Backend (Heroku / Railway / Render)

#### Heroku
```bash
heroku create mundo-calzado-api
git subtree push --prefix server heroku main
heroku config:set WOMPI_PUBLIC_KEY=pub_prod_xxx
heroku config:set WOMPI_PRIVATE_KEY=prv_prod_xxx
```

#### Railway
```bash
railway login
cd server
railway init
railway up
```

### Configuración Post-Deploy

1. **Actualizar URL del backend** en frontend:
```javascript
// checkout-manager.js
const API_URL = 'https://tu-api-produccion.com';
```

2. **Configurar webhook en Wompi:**
   - URL: `https://tu-api.com/api/payments/wompi/webhook`
   - Evento: `transaction.updated`

3. **Actualizar número de WhatsApp:**
```javascript
// invoice-generator.js
this.whatsappNumber = '573XXXXXXXXX'; // Tu número real
```

---

## 🧪 Testing

### Checklist de Verificación

- [ ] Banner negro aparece en todas las páginas
- [ ] "Iniciar sesión" cambia a "Cerrar sesión" al loguearse
- [ ] Imágenes cargan correctamente o muestran placeholder
- [ ] Agregar al carrito funciona desde cualquier página
- [ ] Botón "IR A PAGAR" redirige a login si no logueado
- [ ] Checkout guarda ubicación GPS al hacer clic en botón
- [ ] Factura se genera correctamente después del pago
- [ ] Botón "Compartir por WhatsApp" abre WhatsApp con mensaje
- [ ] Botones flotantes NO tapan elementos importantes
- [ ] Responsive funciona en móvil (320px - 768px)

### Tarjetas de Prueba Wompi

**Aprobada:**
- Número: `4242 4242 4242 4242`
- CVV: `123`
- Fecha: Cualquier fecha futura

**Rechazada:**
- Número: `4111 1111 1111 1111`

---

## 🛠️ Tecnologías

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Font Awesome 6.4.0
- Google Fonts (Inter)
- Geolocation API
- LocalStorage API

### Backend
- Node.js 16+
- Express 4.18.2
- Axios 1.6.2
- CORS 2.8.5
- Dotenv 16.3.1

### Servicios Externos
- Firebase (Auth + Firestore)
- Wompi (Pagos)
- WhatsApp Business API

---

## 📞 Soporte

**¿Problemas con la configuración?**

1. Revisa [CHANGELOG.md](./CHANGELOG.md) para ver cambios recientes
2. Consulta [INSTRUCCIONES_PAGOS.md](./INSTRUCCIONES_PAGOS.md) para Wompi
3. Verifica [QA_CHECKLIST.md](./QA_CHECKLIST.md) para testing

**Contacto:**
- Email: soporte@mundocalzado.com
- GitHub Issues: [Reportar problema](https://github.com/ikushira/nueva-version-calzado-pag-completa-main/issues)

---

## 📄 Licencia

Copyright © 2026 Mundo Calzado. Todos los derechos reservados.

---

**Última actualización:** 6 de Enero de 2026  
**Versión:** 2.1.0  
**Rama:** `fix/finalize-site`
   - JavaScript: 21 archivos con rutas normalizadas (`./assets/img/`)
   - CSS: sin rutas de assets (verificado)
3. **Control de versiones:** Git inicializado, rama `refactor/move-mypageshoes` activa
4. **Backup:** Proyecto completo respaldado en ZIP
5. **Documentación:** CHANGELOG.md y README.md creados

#### ⏳ Pendiente:
1. Crear sistema de productos dinámicos (`products.json`)
2. Probar proyecto en localhost
3. Verificar carruseles y funcionalidad del carrito
4. Optimizar imágenes para web
5. Configurar deployment

Ver detalles completos en [CHANGELOG.md](CHANGELOG.md)

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Navegador moderno:** Chrome, Firefox, Edge, Safari
- **Servidor local** (opcional para desarrollo):
  - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (VS Code)
  - [http-server](https://www.npmjs.com/package/http-server) (Node.js)
  - XAMPP, WAMP, o similar

### Instalación para Desarrollo

#### Opción 1: VS Code Live Server (Recomendado)

1. **Clonar o descargar el proyecto**
   ```bash
   cd tu-directorio
   git clone [url-del-repositorio] mundo-calzado
   cd mundo-calzado
   ```

2. **Abrir en VS Code**
   ```bash
   code .
   ```

3. **Instalar extensión Live Server**
   - Ir a Extensions (Ctrl+Shift+X)
   - Buscar "Live Server"
   - Instalar

4. **Iniciar servidor**
   - Click derecho en `index.html`
   - Seleccionar "Open with Live Server"
   - El sitio se abrirá en `http://localhost:5500`

#### Opción 2: http-server (Node.js)

```bash
# Instalar http-server globalmente
npm install -g http-server

# Navegar al proyecto
cd d:\Users\User\Documents\Proyectos Personales\nueva-version-calzado-pag-completa-main

# Iniciar servidor
http-server -p 8080

# Abrir en navegador: http://localhost:8080
```

#### Opción 3: XAMPP/WAMP

1. Copiar proyecto a carpeta `htdocs` (XAMPP) o `www` (WAMP)
2. Iniciar Apache
3. Abrir: `http://localhost/nueva-version-calzado-pag-completa-main/`

---

## 💻 Uso y Desarrollo

### Estructura de Navegación

```
index.html (ROOT)
    ├─ Hombres → mypageshoes/hombres.html
    ├─ Mujeres → mypageshoes/mujeres.html
    ├─ Niños → mypageshoes/ninos.html
    ├─ Niñas → mypageshoes/ninas.html
    ├─ Colegiales → mypageshoes/colegiales.html
    ├─ Dotación → mypageshoes/dotacion.html
    ├─ Accesorios → mypageshoes/accesorios.html
    ├─ Marcas → mypageshoes/marcas.html
    ├─ Login → mypageshoes/login.html
    └─ Checkout → mypageshoes/checkout.html
```

### Agregar un Nuevo Producto (Método Actual)

#### Paso 1: Agregar Imágenes
```bash
# Crear carpeta para el producto (opcional)
mypageshoes/assets/img/[categoria]/nuevo-producto-01.jpeg
```

#### Paso 2: Actualizar Array de Imágenes
Editar el archivo correspondiente en `mypageshoes/js/secciones_js/`:

```javascript
// Ejemplo: Hombres_fotos.js
const imagenesHombres = [
  './assets/img/calzhombres/2.jpeg',
  './assets/img/calzhombres/3.jpeg',
  // ... imágenes existentes ...
  './assets/img/calzhombres/nuevo-producto-01.jpeg',  // ← NUEVA
];
```

#### Paso 3: Verificar
- Recargar página de categoría correspondiente
- Verificar que la imagen aparece
- Comprobar funcionalidad del carrito

### Sistema de Productos Dinámicos (Futuro)

**Estado:** 🔄 Pendiente de implementación

Una vez implementado, agregar productos será así:

#### 1. Crear/Editar `mypageshoes/data/products.json`

```json
{
  "products": [
    {
      "id": "prod-001",
      "name": "Zapato Deportivo Nike Air Max",
      "slug": "zapato-deportivo-nike-air-max",
      "price": 299900,
      "currency": "COP",
      "description": "Zapato deportivo con tecnología Air Max para máxima comodidad",
      "images": ["1.jpeg", "2.jpeg", "3.jpeg"],
      "sizes": ["38", "39", "40", "41", "42", "43"],
      "category": "hombres",
      "brand": "Nike",
      "featured": true,
      "stock": 25,
      "discount": 0
    }
  ]
}
```

#### 2. Subir Imágenes
```
mypageshoes/assets/img/products/prod-001/
  ├── 1.jpeg
  ├── 2.jpeg
  └── 3.jpeg
```

#### 3. ¡Listo!
El producto aparecerá automáticamente en la categoría correspondiente.

---

## 🌐 Deployment

### Opción 1: Netlify (Recomendado)

#### Vía Git (Automático)

1. **Push a GitHub**
   ```bash
   git remote add origin https://github.com/tu-usuario/mundo-calzado.git
   git push -u origin main
   ```

2. **Conectar con Netlify**
   - Ir a [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Seleccionar repositorio
   - Configurar:
     - Build command: (dejar vacío)
     - Publish directory: `/`
   - Deploy

3. **Configurar dominio personalizado** (opcional)
   - Settings → Domain Management
   - Agregar dominio personalizado

#### Vía Drag & Drop (Manual)

1. Comprimir carpeta del proyecto (ZIP)
2. Ir a [app.netlify.com/drop](https://app.netlify.com/drop)
3. Arrastrar archivo ZIP
4. ¡Desplegado!

**URL generada:** `https://tu-sitio-12345.netlify.app`

### Opción 2: Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd d:\Users\User\Documents\Proyectos Personales\nueva-version-calzado-pag-completa-main
vercel

# Seguir instrucciones en pantalla
```

### Opción 3: GitHub Pages

```bash
# Crear rama gh-pages
git checkout -b gh-pages
git push origin gh-pages

# Activar en Settings → Pages
# Seleccionar branch: gh-pages
# URL: https://tu-usuario.github.io/mundo-calzado/
```

### Opción 4: Hosting Tradicional (cPanel)

1. **Comprimir proyecto**
   ```bash
   # Comprimir todo en ZIP
   ```

2. **Subir vía FTP/File Manager**
   - Conectar a hosting
   - Subir ZIP a `public_html/`
   - Descomprimir

3. **Verificar permisos**
   ```bash
   chmod 644 *.html
   chmod 755 mypageshoes/
   ```

4. **Acceder**
   ```
   https://tudominio.com/
   ```

---

## 🔧 Mantenimiento

### Actualizar Estilos

```bash
# Editar archivos CSS en mypageshoes/css/
# Ejemplo: cambiar color principal
# Editar: mypageshoes/css/variables.css
```

```css
:root {
  --color-primary: #ff0000;  /* Cambiar este valor */
  --color-secondary: #333333;
}
```

### Actualizar Funcionalidad JavaScript

```bash
# Editar scripts en mypageshoes/js/
# Probar localmente
# Hacer commit y deploy
```

### Optimizar Imágenes

```powershell
# Instalar herramientas
npm install -g sharp-cli

# Convertir a WebP
sharp -i mypageshoes/assets/img/calzhombres/1.jpeg -o mypageshoes/assets/img/calzhombres/1.webp

# Redimensionar
sharp -i input.jpeg --resize 800 -o output.jpeg
```

### Backup Regular

```bash
# Crear backup manual
git commit -am "Backup antes de cambios"
git push

# O comprimir proyecto
```

---

## � Backend y Pagos

### Setup del Backend

El servidor backend maneja la integración con Wompi para procesar pagos.

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Wompi

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

### Endpoints Disponibles

#### POST /api/payments/wompi/init
Inicializa una transacción de pago con Wompi.

**Body:**
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
  "transaction": {},
  "paymentLink": "https://checkout.wompi.co/...",
  "integritySignature": "abc123..."
}
```

#### POST /api/payments/wompi/webhook
Recibe notificaciones de Wompi sobre cambios de estado de transacciones.

#### GET /api/payments/wompi/transaction/:transactionId
Consulta el estado actual de una transacción.

### Documentación Completa

Ver [INSTRUCCIONES_PAGOS.md](INSTRUCCIONES_PAGOS.md) para:
- Configuración de cuenta Wompi
- Claves de prueba y producción
- Métodos de pago disponibles (Nequi, PSE, Tarjetas, Efectivo)
- Testing con tarjetas de prueba
- Integración del widget de checkout

---

## 🛡️ Panel Administrativo

### Acceso

URL: `mypageshoes/admin/index.html`

**Requisitos:**
- Usuario con `isAdmin: true` o `rol: 'admin'` en localStorage
- Sesión activa (verificada con gestorUsuarios o headerUtils)

### Funcionalidades

**Dashboard:**
- Estadísticas: Total productos, órdenes, usuarios, ventas
- Cards con iconos y valores en tiempo real

**Gestión de Productos:**
- Tabla con thumbnails, nombre, categoría, precio, stock, estado
- Crear nuevo producto con modal de formulario completo
- Editar productos existentes
- Eliminar productos con confirmación
- Guardado en localStorage (integración backend pendiente)

**Gestión de Órdenes:**
- Tabla con ID, cliente, fecha, total, estado, método de pago
- Cambio de estado en tiempo real (Pendiente, Procesando, Enviado, Entregado, Cancelado)
- Filtros por estado
- Ver detalles de orden

**Gestión de Usuarios:**
- Tabla con nombre, email, fecha registro, órdenes, rol
- Ver detalles de usuario
- Badges por rol (Admin/Cliente)

### Protección de Rutas

El panel verifica automáticamente:
1. Sesión activa usando `gestorUsuarios.obtenerUsuarioActivo()`
2. Rol de administrador (`isAdmin === true` o `rol === 'admin'`)
3. Redirección a login si no cumple requisitos

---

## 🔐 Variables de Entorno

### Backend (server/.env)

```bash
# Puerto del servidor
PORT=3000

# Wompi - Producción
WOMPI_PUBLIC_KEY=pub_prod_XXXXXXXXXXXXXXXXXXXXXXXXXX
WOMPI_PRIVATE_KEY=prv_prod_XXXXXXXXXXXXXXXXXXXXXXXXXX
WOMPI_EVENTS_SECRET=prod_events_XXXXXXXXXXXXXXXXXXXXXX

# URL del sitio (para redirecciones)
FRONTEND_URL=https://mundocalzado.com

# CORS
ALLOWED_ORIGINS=https://mundocalzado.com,http://localhost:5500

# Modo
NODE_ENV=production
```

### Testing (Wompi Sandbox)

```bash
# Usar estas claves para pruebas
WOMPI_PUBLIC_KEY=pub_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
WOMPI_PRIVATE_KEY=prv_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
WOMPI_EVENTS_SECRET=test_events_XXXXXXXXXXXXXXXXXXXXXX
```

**Tarjetas de prueba:**
- **Visa Aprobada:** 4242 4242 4242 4242
- **Mastercard Rechazada:** 5555 5555 5555 4444
- CVV: Cualquier 3 dígitos
- Fecha: Cualquier fecha futura

---

## 🚀 Deployment

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsive
  - CSS Variables
  - Flexbox & Grid
  - Media Queries
- **JavaScript ES6+** - Lógica e interactividad
  - DOM Manipulation
  - Event Handling
  - LocalStorage para carrito
  - Fetch API (preparado)

### Librerías y CDN
- **Font Awesome 6.4.0** - Iconos
- **Google Fonts** - Tipografía (Inter)

### Herramientas de Desarrollo
- **Git** - Control de versiones
- **VS Code** - Editor
- **Live Server** - Servidor de desarrollo
- **PowerShell** - Scripts de automatización

### Hosting Recomendado
- **Netlify** - Deployment continuo
- **Vercel** - Alternativa rápida
- **GitHub Pages** - Hosting gratuito

---

## 📞 Soporte

### Issues Comunes

#### Las imágenes no cargan en hosting

**Solución:**
1. Verificar case-sensitivity de nombres de archivos
2. Comprobar rutas en archivos JS (deben ser `./assets/img/`)
3. Verificar permisos de archivos (644 para archivos, 755 para directorios)

#### Carrito no funciona

**Solución:**
1. Abrir consola del navegador (F12)
2. Verificar errores en JavaScript
3. Comprobar que LocalStorage está habilitado
4. Limpiar caché del navegador

#### Páginas dan 404

**Solución:**
1. Verificar que todas las rutas usan minúsculas
2. Comprobar que `index.html` está en el root
3. Verificar configuración del servidor

### Contacto

- **Email:** [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
- **GitHub:** [@tu-usuario](https://github.com/tu-usuario)

---

## 📄 Licencia

Copyright © 2025 Mundo Calzado. Todos los derechos reservados.

---

## 🎯 Estado del Proyecto

### ✅ Completado

#### Fase 1: Infraestructura
- [x] Reorganización de archivos a mypageshoes/
- [x] Actualizar rutas en HTML, CSS, JS
- [x] Documentación completa (README, CHANGELOG, INSTRUCCIONES_PAGOS)

#### Fase 2: Sistema de Productos y Carrito
- [x] Sistema de imágenes con rutas normalizadas
- [x] Placeholder fallback automático
- [x] Cart manager unificado (mundo_calzado_cart)
- [x] Soporte de tallas en carrito
- [x] Migración automática de carritos legacy

#### Fase 3: Autenticación y Usuarios
- [x] Sistema de login y registro
- [x] gestorUsuarios con validación
- [x] Protección de rutas (cuenta, perfil, admin)
- [x] Redirección con ?next después de login

#### Fase 4: Checkout y Pagos
- [x] Checkout con geolocalización
- [x] Validación de sesión
- [x] Backend Express con Wompi
- [x] Endpoints: init, webhook, transaction
- [x] Firmas de integridad SHA-256

#### Fase 5: Panel Administrativo
- [x] Dashboard con estadísticas
- [x] CRUD productos completo
- [x] Gestión de órdenes
- [x] Gestión de usuarios
- [x] Protección por rol isAdmin

#### Fase 6: UX y Diseño
- [x] Banner global "ENVÍO GRATIS 2+ PARES"
- [x] Header dinámico con sesión
- [x] Botones flotantes (WhatsApp, Chatbot)
- [x] Z-index jerarquizado
- [x] Cookie consent implementado
- [x] 18 páginas footer completas
- [x] Diseño responsive

### 🚀 Listo para Producción

El proyecto está completo y listo para deployment. Pendiente únicamente:
- Configurar credenciales reales de Wompi
- Configurar dominio y DNS
- Implementar analytics (opcional)

---

**Última actualización:** 6 de enero de 2026  
**Versión:** 2.0.5  
**Estado:** ✅ Finalizado - Listo para Producción  
**Rama actual:** `fix/finalize-site`
**Commits totales:** 5+ commits en español con mensajes detallados

