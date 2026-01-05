// Archivo de diagnóstico para encontrar problemas en el carrito
// Creado en respuesta a problemas persistentes con la funcionalidad del carrito
console.log("==========================================");
console.log("DIAGNÓSTICO DE CARRITO DE COMPRAS");
console.log("==========================================");

// Revisar si el archivo carrito.js se está cargando
console.log("✓ Archivo de diagnóstico carrito-debug.js cargado correctamente");

// Función para verificar que carrito.js esté cargado correctamente
function verificarCarritoJsCargado() {
  if (typeof window.agregarAlCarrito === 'function') {
    console.log("✓ La función agregarAlCarrito está disponible globalmente");
    return true;
  } else {
    console.error("✗ La función agregarAlCarrito NO está disponible globalmente");
    console.error("  Esto indica que el archivo carrito.js no se cargó correctamente o que hay un error en su código");
    return false;
  }
}

// Verificar elementos del DOM relacionados con el carrito
function verificarElementosCarrito() {
  const elementos = [
    { id: 'btn-carrito', nombre: 'Botón de carrito' },
    { id: 'modal-carrito', nombre: 'Modal del carrito' },
    { id: 'cerrar-carrito', nombre: 'Botón cerrar carrito' },
    { id: 'carrito-lista', nombre: 'Lista de productos en carrito' },
    { id: 'carrito-vacio', nombre: 'Mensaje de carrito vacío' },
    { id: 'carrito-total', nombre: 'Total del carrito' },
    { id: 'carrito-total-precio', nombre: 'Precio total del carrito' },
    { id: 'carrito-cantidad', nombre: 'Contador de productos' }
  ];
  
  let todosDisponibles = true;
  
  elementos.forEach(elemento => {
    const el = document.getElementById(elemento.id);
    if (el) {
      console.log(`✓ Elemento ${elemento.nombre} (${elemento.id}) encontrado`);
    } else {
      console.error(`✗ Elemento ${elemento.nombre} (${elemento.id}) NO encontrado`);
      todosDisponibles = false;
    }
  });
  
  return todosDisponibles;
}

// Verificar localStorage
function verificarLocalStorage() {
  try {
    const testKey = 'carritoTestStorage';
    localStorage.setItem(testKey, 'test');
    if (localStorage.getItem(testKey) === 'test') {
      localStorage.removeItem(testKey);
      console.log("✓ localStorage funciona correctamente");
      return true;
    } else {
      console.error("✗ localStorage no funciona correctamente");
      return false;
    }
  } catch (e) {
    console.error("✗ Error al usar localStorage:", e.message);
    return false;
  }
}

// Verificar datos existentes del carrito
function verificarDatosCarrito() {
  try {
    const carritoData = localStorage.getItem('carrito');
    if (carritoData) {
      const carrito = JSON.parse(carritoData);
      if (Array.isArray(carrito)) {
        console.log(`✓ Carrito encontrado en localStorage con ${carrito.length} productos`);
        if (carrito.length > 0) {
          console.log("  Primer producto:", carrito[0]);
        }
      } else {
        console.error("✗ El carrito en localStorage no es un array");
      }
    } else {
      console.log("ℹ El carrito no existe o está vacío en localStorage");
    }
    return true;
  } catch (e) {
    console.error("✗ Error al leer datos del carrito:", e.message);
    return false;
  }
}

// Verificar botones de añadir al carrito
function verificarBotonesAgregarCarrito() {
  const selectores = [
    '.btn-agregar-carrito', 
    '.btn-add-cart', 
    '.btn-anadir-carrito', 
    '.btn-añadir-carrito', 
    '.agregar-carrito', 
    '.add-to-cart', 
    '.btn-cart'
  ];
  
  let selectorUnificado = selectores.join(', ');
  const botones = document.querySelectorAll(selectorUnificado);
  
  if (botones.length > 0) {
    console.log(`✓ Se encontraron ${botones.length} botones de agregar al carrito`);
    return true;
  } else {
    console.error("✗ No se encontraron botones de agregar al carrito");
    console.log("  Selectores buscados:", selectorUnificado);
    return false;
  }
}

// Ejecutar todos los diagnósticos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log("Ejecutando diagnóstico de carrito...");
  
  let resultados = {
    carritoJsCargado: verificarCarritoJsCargado(),
    elementosDisponibles: verificarElementosCarrito(),
    localStorageOk: verificarLocalStorage(),
    datosCarritoOk: verificarDatosCarrito(),
    botonesOk: verificarBotonesAgregarCarrito()
  };
  
  console.log("==========================================");
  console.log("RESUMEN DE DIAGNÓSTICO");
  console.log("==========================================");
  
  let todoCorrecto = Object.values(resultados).every(v => v === true);
  
  if (todoCorrecto) {
    console.log("✅ Todos los diagnósticos pasaron correctamente");
    console.log("Si el carrito aún no funciona, puede haber un problema en la lógica de interacción");
  } else {
    console.log("❌ Se encontraron problemas en el diagnóstico");
    console.log("Revisa los errores anteriores para solucionar el problema");
  }
});

// Intentar agregar un producto de prueba al carrito
window.testAgregarProducto = function() {
  if (typeof window.agregarAlCarrito === 'function') {
    const productoPrueba = {
      id: 'producto-test-' + new Date().getTime(),
      nombre: 'Producto de Prueba',
      precio: 75000,
      talla: '40',
      cantidad: 1
    };
    
    console.log("Intentando agregar producto de prueba:", productoPrueba);
    window.agregarAlCarrito(productoPrueba);
    console.log("Producto de prueba agregado correctamente");
    return true;
  } else {
    console.error("No se puede agregar producto de prueba porque agregarAlCarrito no está disponible");
    return false;
  }
};

// Exponer diagnóstico globalmente
window.diagnosticoCarrito = {
  verificarCarritoJsCargado,
  verificarElementosCarrito,
  verificarLocalStorage,
  verificarDatosCarrito,
  verificarBotonesAgregarCarrito,
  testAgregarProducto: window.testAgregarProducto
};
