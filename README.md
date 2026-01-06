# Mundo Calzado - Tienda Online

> 🚀 Tienda e-commerce completa con sistema de pagos, administración y autenticación

![Estado](https://img.shields.io/badge/Estado-Finalizado-green)
![Fase](https://img.shields.io/badge/Fase-Listo%20para%20Producción-blue)
![Versión](https://img.shields.io/badge/Versión-2.0.5-brightgreen)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Características Completas](#características-completas)
- [Instalación y Configuración](#instalación-y-configuración)
- [Backend y Pagos](#backend-y-pagos)
- [Panel Administrativo](#panel-administrativo)
- [Deployment](#deployment)
- [Variables de Entorno](#variables-de-entorno)
- [Tecnologías](#tecnologías)

---

## 📝 Descripción

**Mundo Calzado** es una tienda online completa de calzado para toda la familia. Incluye sistema de autenticación, carrito de compras unificado, checkout con geolocalización, integración de pagos Wompi, y panel administrativo con protección por roles.

### Características Completas

✅ **Catálogo de Productos** por categorías (Hombres, Mujeres, Niños, Niñas, Colegiales, Dotación)  
✅ **Sistema de Autenticación** con gestorUsuarios y protección de rutas  
✅ **Carrito Unificado** (`mundo_calzado_cart`) con soporte de tallas y migración automática  
✅ **Checkout Completo** con geolocalización, validación de sesión y redirección ?next  
✅ **Integración de Pagos Wompi** con backend Express, webhooks y firma de integridad  
✅ **Panel Administrativo** con protección isAdmin, CRUD productos/órdenes/usuarios  
✅ **Sistema de Imágenes** con rutas normalizadas y placeholder fallback  
✅ **Diseño Responsive** para móviles, tablets y desktop  
✅ **Cookie Consent** implementado en index.html  
✅ **Chatbot y WhatsApp** flotantes con z-index jerarquizado  
✅ **15+ Páginas Footer** (políticas, ayuda, contacto, etc.)  

---

## 📁 Estructura del Proyecto

```
proyecto-calzado/
├── index.html                 # Página principal (ROOT)
├── CHANGELOG.md               # Versiones 2.0.1 - 2.0.5 documentadas
├── INSTRUCCIONES_PAGOS.md     # Guía completa Wompi
├── README.md                  # Este archivo
├── QA_CHECKLIST.md            # Checklist de calidad
├── mypageshoes/               # 🔥 Aplicación principal
│   ├── *.html                 # Páginas del sitio
│   ├── admin/                 # 🛡️ Panel administrativo
│   │   ├── index.html         # Dashboard con stats y tablas
│   │   ├── admin.js           # Lógica con protección isAdmin
│   │   └── admin.css          # Estilos responsive
│   ├── pages/                 # Páginas secundarias (18 archivos)
│   │   ├── checkout.html      # Checkout con geolocalización
│   │   ├── ayuda.html         # Centro de ayuda
│   │   ├── politicas.html     # Políticas de la empresa
│   │   └── ...
│   ├── assets/                # Recursos multimedia
│   │   └── img/               # Imágenes por categoría
│   ├── css/                   # Hojas de estilo (25+ archivos)
│   │   ├── variables.css      # Variables CSS globales
│   │   ├── carrito.css        # Thumbnails 80x80, z-index
│   │   ├── cookie-consent.css # Banner de cookies
│   │   └── ...
│   ├── js/                    # Scripts JavaScript (40+ archivos)
│   │   ├── mobile-navigation.js    # headerUtils con banner global
│   │   ├── cart-manager.js         # Carrito unificado
│   │   ├── checkout-manager.js     # Checkout con ?next
│   │   ├── login-system.js         # Auth con redirección
│   │   ├── product-images.js       # Resolver rutas imágenes
│   │   ├── gestor-usuarios.js      # Gestión de usuarios
│   │   ├── cookie-consent.js       # Sistema de cookies
│   │   └── ...
│   ├── data/
│   │   └── products.json      # Base de datos productos
│   └── images/
│       ├── products/          # {id}/{imagen.jpg}
│       └── placeholder.png    # Fallback 1x1 transparente
└── server/                    # 💳 Backend de pagos
    ├── src/
    │   ├── index.js           # Express server con CORS
    │   ├── routes/
    │   │   └── payments.js    # Rutas Wompi
    │   └── controllers/
    │       └── wompi.js       # Lógica pagos + webhooks
    ├── package.json           # Express, axios, cors, dotenv
    ├── .env.example           # Template variables
    └── README.md              # Docs backend
```
1. **Reorganización de archivos:** Todos los archivos movidos a `mypageshoes/` excepto `index.html`
2. **Actualización de rutas:**
   - Index.html: todas las rutas apuntan a `mypageshoes/`
   - HTML internos: breadcrumbs actualizados para apuntar a `../index.html`
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

