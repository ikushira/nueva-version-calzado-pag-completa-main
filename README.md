# Mundo Calzado - Tienda Online

> 🚀 Proyecto reorganizado y listo para deployment con estructura profesional

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Fase](https://img.shields.io/badge/Fase-Reorganizaci%C3%B3n%20Completada-green)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Cambios Recientes](#cambios-recientes)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso y Desarrollo](#uso-y-desarrollo)
- [Deployment](#deployment)
- [Mantenimiento](#mantenimiento)
- [Tecnologías](#tecnologías)

---

## 📝 Descripción

**Mundo Calzado** es una tienda online de calzado para toda la familia. El proyecto ha sido completamente reorganizado para seguir las mejores prácticas de desarrollo web, con una estructura modular y lista para hosting profesional.

### Características

✅ Catálogo de productos por categorías (Hombres, Mujeres, Niños, Niñas, Colegiales, Dotación)  
✅ Carrito de compras funcional  
✅ Sistema de tallas interactivo  
✅ Carruseles de productos destacados  
✅ Diseño responsive para móviles y tablets  
✅ Chatbot de asistencia  
✅ Sistema de checkout y pagos (en integración)  
✅ Gestión de usuarios y perfiles  

---

## 📁 Estructura del Proyecto

```
proyecto-calzado/
├── index.html                 # Página principal (ROOT)
├── .git/                      # Control de versiones
├── .vscode/                   # Configuración de VS Code
├── CHANGELOG.md               # Registro detallado de cambios
├── README.md                  # Este archivo
├── fix-html-paths.ps1         # Script auxiliar
├── fix-js.ps1                 # Script auxiliar
└── mypageshoes/               # 🔥 Carpeta principal del proyecto
    ├── *.html                 # Páginas del sitio
    ├── assets/                # Recursos multimedia
    │   └── img/               # Imágenes organizadas por categoría
    │       ├── calzhombres/
    │       ├── calzmujeres/
    │       ├── calzninas/
    │       ├── calzninos/
    │       ├── carrusel1/
    │       ├── carrusel2/
    │       ├── colegiales/
    │       ├── complementos/
    │       ├── dotacion/
    │       ├── marcas/
    │       └── ofertas/
    ├── css/                   # Hojas de estilo
    │   ├── variables.css      # Variables CSS globales
    │   ├── styles.css         # Estilos principales
    │   ├── carrito.css        # Estilos del carrito
    │   ├── checkout.css       # Estilos de checkout
    │   └── ...                # Otros estilos modulares
    ├── js/                    # Scripts JavaScript
    │   ├── script.js          # Script principal
    │   ├── carrito-nuevo.js   # Lógica del carrito
    │   ├── chatbot.js         # Chatbot
    │   ├── busqueda.js        # Búsqueda de productos
    │   ├── secciones_js/      # Scripts de imágenes por categoría
    │   │   ├── Hombres_fotos.js
    │   │   ├── Mujeres_fotos.js
    │   │   └── ...
    │   └── backup_scripts/    # Backups de scripts anteriores
    └── data/                  # Datos (a crear)
        └── products.json      # Base de datos de productos

```

### Convenciones de Nombres

- **HTML:** `nombre-pagina.html` (minúsculas, guiones)
- **CSS:** `nombre-archivo.css` (minúsculas, guiones)
- **JavaScript:** `nombre-archivo.js` (minúsculas, guiones)
- **Imágenes:** `nombre.jpeg` o `nombre.webp` (minúsculas)

---

## 🔄 Cambios Recientes

### Versión 2.0.0 - Reorganización Estructural (5 enero 2026)

#### ✅ Completado:
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

## 🛠️ Tecnologías

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

## 🎯 Roadmap

### Fase 1: Reorganización ✅
- [x] Mover archivos a mypageshoes/
- [x] Actualizar rutas en HTML, CSS, JS
- [x] Documentación completa

### Fase 2: Sistema de Productos 🔄
- [ ] Crear products.json
- [ ] Implementar renderProducts.js
- [ ] Migrar imágenes a nueva estructura

### Fase 3: Testing y Optimización ⏳
- [ ] Pruebas cross-browser
- [ ] Optimización de imágenes
- [ ] Minificación de CSS/JS
- [ ] Performance audit

### Fase 4: Backend (Opcional) ⏳
- [ ] Firebase integration
- [ ] Sistema de autenticación
- [ ] Base de datos de productos
- [ ] Panel de administración

### Fase 5: Deployment 🚀
- [ ] Configurar Netlify/Vercel
- [ ] Dominio personalizado
- [ ] SSL/HTTPS
- [ ] Analytics

---

**Última actualización:** 5 de enero de 2026  
**Versión:** 2.0.0  
**Estado:** En desarrollo activo  
**Rama actual:** `refactor/move-mypageshoes`
