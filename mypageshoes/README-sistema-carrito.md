# Sistema de Carrito de Compras - Calzado Valencia

## Guía de Mantenimiento y Documentación

### Descripción General

Este documento proporciona información sobre el nuevo sistema unificado de carrito de compras implementado en el sitio web de Calzado Valencia. Se ha simplificado y optimizado para mejorar la experiencia del usuario y facilitar el mantenimiento.

### Cambios Realizados

- **Unificación de Scripts**: Se ha creado un script unificado `carrito-simplificado.js` que reemplaza múltiples scripts redundantes.
- **Corrección de Problemas**: Se ha solucionado el problema de productos duplicados en el carrito.
- **Optimización de Código**: Se ha mejorado el rendimiento y la organización del código.
- **Limpieza de Dependencias**: Se han eliminado scripts obsoletos y redundantes.

### Estructura del Sistema

#### Archivo Principal

**`js/carrito-simplificado.js`**: Contiene toda la funcionalidad del carrito de compras, incluyendo:

- Inicialización del carrito
- Gestión de productos (agregar, eliminar, modificar cantidades)
- Persistencia mediante localStorage
- Visualización y actualización de la interfaz
- Corrección de comportamiento para las tarjetas de productos

### Funcionalidades Principales

#### 1. Inicialización del Carrito

El carrito se inicializa automáticamente cuando se carga la página mediante:

```javascript
document.addEventListener('DOMContentLoaded', inicializarCarrito);
```

#### 2. Agregar Productos al Carrito

Para agregar un producto al carrito, se debe usar la función global:

```javascript
window.agregarProductoUnaVez(producto);
```

Donde `producto` es un objeto con la siguiente estructura:

```javascript
{
  id: "identificador-único", // Normalmente "nombre-talla"
  nombre: "Nombre del Producto",
  precio: 12345, // Precio en números enteros
  talla: "40", // Talla como string
  cantidad: 1, // Opcional, por defecto es 1
  imagen: "ruta/a/imagen.jpg" // Opcional
}
```

#### 3. Manipulación del Carrito

El sistema proporciona las siguientes funciones:

- `actualizarCantidadCarrito()`: Actualiza el contador de productos
- `guardarCarrito()`: Guarda el carrito en localStorage
- `cargarCarrito()`: Carga el carrito desde localStorage

#### 4. Corrección de Tarjetas de Productos

La función `aplicarCorreccionTarjetas()` asegura que:

- Los botones de agregar al carrito solo agreguen un producto a la vez
- Se seleccione una talla antes de agregar al carrito
- Se muestre una notificación al agregar un producto
- Los eventos de selección de tallas funcionen correctamente

### Guía de Integración en Nuevas Páginas

Para añadir la funcionalidad del carrito a una nueva página:

1. **Incluir el Script Unificado**: Agregar antes del cierre de `</body>`:

```html
<script src="js/carrito-simplificado.js"></script>
```

2. **Estructura HTML Necesaria**:

```html
<!-- Botón para abrir el carrito -->
<div id="btn-carrito" class="btn-carrito">
  <i class="fa-solid fa-cart-shopping"></i>
  <span id="carrito-cantidad">0</span>
</div>

<!-- Modal del carrito -->
<div id="modal-carrito" class="modal-carrito oculto">
  <div class="carrito-contenido">
    <div class="carrito-header">
      <h2>Mi Carrito</h2>
      <button id="cerrar-carrito">&times;</button>
    </div>
    
    <div id="carrito-vacio" class="carrito-vacio">
      <p>Tu carrito está vacío</p>
      <button id="btn-elegir-productos" class="btn-primario">Elegir Productos</button>
    </div>
    
    <div id="carrito-lista" class="carrito-lista"></div>
    
    <div id="carrito-total" class="carrito-total">
      <div class="total-info">
        <span>Total:</span>
        <span id="carrito-total-precio">$0</span>
      </div>
      <button id="btn-finalizar-compra" class="btn-primario">Finalizar Compra</button>
    </div>
  </div>
</div>
```

3. **Tarjetas de Productos**:

Asegúrese de que sus tarjetas de productos sigan esta estructura:

```html
<div class="producto-card">
  <img src="ruta/a/imagen.jpg" alt="Nombre del Producto">
  <h3 class="producto-nombre">Nombre del Producto</h3>
  <p class="producto-precio">$12.345</p>
  
  <div class="producto-tallas">
    <button class="talla-btn">38</button>
    <button class="talla-btn">39</button>
    <button class="talla-btn">40</button>
    <!-- ... más tallas ... -->
  </div>
  
  <button class="btn-agregar-carrito">Agregar al Carrito</button>
</div>
```

### Resolución de Problemas

#### Productos duplicados en el carrito

Si vuelven a aparecer productos duplicados:

1. Verifique que no haya otros scripts de carrito en la página
2. Asegúrese de que cada producto tenga un ID único (combinación de nombre y talla)
3. Confirme que los botones de agregar al carrito usan la función `agregarProductoUnaVez`

#### Errores de inicialización

Si el carrito no se inicializa correctamente:

1. Verifique que `carrito-simplificado.js` esté incluido al final de la página
2. Asegúrese de que los elementos HTML necesarios estén presentes
3. Revise la consola del navegador para ver posibles errores

### Scripts de Mantenimiento

Se han creado los siguientes scripts para ayudar en el mantenimiento:

- **`js/diagnosticar-scripts.js`**: Analiza el estado de los scripts en todas las páginas
- **`js/limpiar-y-simplificar-scripts.js`**: Unifica y simplifica scripts redundantes
- **`js/extraer-scripts-en-linea.js`**: Extrae scripts en línea a archivos separados

### Copias de Seguridad

Se han guardado copias de los scripts originales en:
- `js/backup_scripts/`

### Desarrollado por

Equipo de Desarrollo Ikushira Dev  
Fecha: 27/07/2025
