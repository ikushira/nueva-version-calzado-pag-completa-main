# Mundo Calzado - E-commerce Platform

> Plataforma de e-commerce profesional para venta de calzado con sistema completo de pagos, autenticación y administración.

![Estado](https://img.shields.io/badge/Estado-En%20Producción-green)
![Versión](https://img.shields.io/badge/Versión-2.1.0-brightgreen)
![Demo](https://img.shields.io/badge/Demo-Live-blue)

---

## 🌐 Demo en Vivo

**[Accede a la plataforma](https://ikushira.github.io/nueva-version-calzado-pag-completa-main/)**

---

## ⭐ Features Principales

- ✅ **Autenticación de Usuarios** - Firebase Auth con roles y permisos
- ✅ **Carrito Persistente** - LocalStorage con sincronización en sesión
- ✅ **Checkout Inteligente** - Geolocalización GPS y manejo de direcciones
- ✅ **Pagos Integrados** - Wompi con webhook validation
- ✅ **Facturación Automática** - Generación de facturas y compartir por WhatsApp
- ✅ **Panel Administrativo** - Gestión de productos, órdenes y usuarios
- ✅ **Responsive Design** - Optimizado para desktop, tablet y mobile
- ✅ **SEO Optimizado** - Meta tags, robots.txt y estructura semántica

---

## 🛠️ Stack Tecnológico

**Frontend**
- HTML5, CSS3, JavaScript ES6+
- Font Awesome 6.4.0 | Google Fonts (Inter)
- Geolocation API | LocalStorage API

**Backend**
- Node.js 16+ | Express 4.18.2
- Axios | CORS | Dotenv

**Servicios**
- Firebase (Auth + Firestore)
- Wompi (Pagos)
- WhatsApp Business API

---

## 📁 Arquitectura del Proyecto

```
proyecto/
├── index.html                    # Página principal
├── mypageshoes/
│   ├── *.html                    # 15 páginas principales
│   ├── pages/                    # 18 páginas secundarias
│   ├── admin/                    # Panel administrativo
│   ├── css/                      # Estilos (header, z-index, responsive)
│   ├── js/                       # Lógica frontend
│   │   ├── header-manager.js     # Gestión de sesión
│   │   ├── cart-manager.js       # Sistema de carrito
│   │   ├── checkout-manager.js   # Checkout y pagos
│   │   ├── invoice-generator.js  # Generador de facturas
│   │   └── product-images.js     # Optimización de imágenes
│   ├── images/                   # Assets (productos, placeholder)
│   └── data/products.json        # Base de datos productos
└── server/                       # Backend Node.js
    ├── src/routes/payments.js    # Endpoints de pagos
    ├── package.json
    └── .env.example
```

---

## 🚀 Instalación Rápida

### 1. Clonar Repositorio
```bash
git clone https://github.com/ikushira/nueva-version-calzado-pag-completa-main.git
cd nueva-version-calzado-pag-completa-main
```

### 2. Ejecutar Frontend (Estático)
```bash
# Opción 1: Live Server (VS Code)
# Click derecho en index.html → Open with Live Server

# Opción 2: HTTP Server
npx http-server -p 5500
```

### 3. Ejecutar Backend (Pagos Wompi - Opcional)
```bash
cd server
npm install
cp .env.example .env
# Editar .env con credenciales de Wompi
npm run dev  # Servidor en http://localhost:3000
```

---

## 🔐 Seguridad

- ✅ Variables de entorno separadas (`.env`)
- ✅ Frontend/Backend desacoplados (CORS configurado)
- ✅ Validación de tokens Firebase en backend
- ✅ Webhook validation en transacciones Wompi
- ✅ Datos sensibles no en versionado Git

---

## 📚 Documentación Completa

Para guías detalladas de configuración, consulta:

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentación técnica completa
- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de versiones
- **[INSTRUCCIONES_PAGOS.md](./INSTRUCCIONES_PAGOS.md)** - Configuración Wompi paso a paso
- **[QA_CHECKLIST.md](./QA_CHECKLIST.md)** - Testing y verificación

---

## 📞 Soporte

**Reportar problemas:** [GitHub Issues](https://github.com/ikushira/nueva-version-calzado-pag-completa-main/issues)

---

**Última actualización:** 10 de Abril de 2026 | **Versión:** 2.1.0
