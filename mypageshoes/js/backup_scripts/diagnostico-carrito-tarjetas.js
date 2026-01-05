// diagnostico-carrito-tarjetas.js
// Script para diagnosticar el funcionamiento del carrito en todas las tarjetas

document.addEventListener('DOMContentLoaded', function() {
    console.log("=========================================");
    console.log("DIAGNÓSTICO DE CARRITO Y TARJETAS");
    console.log("Versión: 1.0 - Fecha: 27/07/2025");
    console.log("=========================================");
    
    // Crear panel flotante para el diagnóstico
    crearPanelDiagnostico();
    
    // Realizar diagnóstico inicial después de un breve retraso
    setTimeout(realizarDiagnosticoCompleto, 1500);
});

// Función para crear el panel de diagnóstico
function crearPanelDiagnostico() {
    // Crear elementos del panel
    const panel = document.createElement('div');
    panel.id = 'panel-diagnostico-carrito';
    panel.innerHTML = `
        <div class="panel-header">
            <h3>Diagnóstico de Carrito</h3>
            <button id="cerrar-diagnostico">×</button>
        </div>
        <div class="panel-content">
            <div class="diagnostico-seccion">
                <h4>Estado del Carrito</h4>
                <div id="carrito-estado"></div>
            </div>
            <div class="diagnostico-seccion">
                <h4>Scripts Cargados</h4>
                <div id="scripts-estado"></div>
            </div>
            <div class="diagnostico-seccion">
                <h4>Tarjetas de Productos</h4>
                <div id="tarjetas-estado"></div>
            </div>
            <div class="panel-actions">
                <button id="actualizar-diagnostico">Actualizar diagnóstico</button>
                <button id="probar-carrito">Probar carrito</button>
                <button id="limpiar-carrito">Limpiar carrito</button>
            </div>
        </div>
    `;
    
    // Estilos para el panel
    const estilos = document.createElement('style');
    estilos.innerHTML = `
        #panel-diagnostico-carrito {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            transition: transform 0.3s ease;
            transform: translateY(90%);
        }
        #panel-diagnostico-carrito:hover {
            transform: translateY(0);
        }
        #panel-diagnostico-carrito .panel-header {
            background: #4A90E2;
            color: white;
            padding: 10px 15px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        #panel-diagnostico-carrito .panel-header h3 {
            margin: 0;
            font-size: 16px;
        }
        #panel-diagnostico-carrito .panel-header button {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }
        #panel-diagnostico-carrito .panel-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        #panel-diagnostico-carrito .diagnostico-seccion {
            margin-bottom: 15px;
        }
        #panel-diagnostico-carrito .diagnostico-seccion h4 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #555;
        }
        #panel-diagnostico-carrito .diagnostico-item {
            padding: 5px 10px;
            margin: 5px 0;
            font-size: 13px;
            background: #f7f7f7;
            border-radius: 4px;
        }
        #panel-diagnostico-carrito .success {
            color: green;
            font-weight: bold;
        }
        #panel-diagnostico-carrito .warning {
            color: orange;
            font-weight: bold;
        }
        #panel-diagnostico-carrito .error {
            color: red;
            font-weight: bold;
        }
        #panel-diagnostico-carrito .panel-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        #panel-diagnostico-carrito .panel-actions button {
            background: #4A90E2;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 10px;
            font-size: 12px;
            cursor: pointer;
            flex-grow: 1;
        }
        #panel-diagnostico-carrito .panel-actions button:hover {
            background: #3A80D2;
        }
        #limpiar-carrito {
            background: #E25555 !important;
        }
        #limpiar-carrito:hover {
            background: #D24545 !important;
        }
    `;
    
    // Agregar panel y estilos al DOM
    document.body.appendChild(estilos);
    document.body.appendChild(panel);
    
    // Manejar eventos
    document.getElementById('cerrar-diagnostico').addEventListener('click', function() {
        document.body.removeChild(panel);
        document.body.removeChild(estilos);
    });
    
    document.getElementById('actualizar-diagnostico').addEventListener('click', realizarDiagnosticoCompleto);
    
    document.getElementById('probar-carrito').addEventListener('click', function() {
        probarCarrito();
    });
    
    document.getElementById('limpiar-carrito').addEventListener('click', function() {
        localStorage.removeItem('carrito');
        window.carrito = [];
        if (typeof window.actualizarCantidadCarrito === 'function') {
            window.actualizarCantidadCarrito();
        }
        
        mostrarMensajeEstado('Carrito limpiado con éxito', 'success');
        realizarDiagnosticoCompleto();
    });
    
    // Hacer que el encabezado expanda/contraiga el panel
    document.querySelector('#panel-diagnostico-carrito .panel-header').addEventListener('click', function(e) {
        if (e.target.tagName !== 'BUTTON') {
            panel.style.transform = panel.style.transform === 'translateY(0px)' ? 'translateY(90%)' : 'translateY(0px)';
        }
    });
}

// Función para realizar diagnóstico completo
function realizarDiagnosticoCompleto() {
    diagnosticarCarrito();
    diagnosticarScripts();
    diagnosticarTarjetas();
}

// Función para diagnosticar el estado del carrito
function diagnosticarCarrito() {
    const carritoEstado = document.getElementById('carrito-estado');
    carritoEstado.innerHTML = '';
    
    // Verificar si window.carrito existe
    const existeCarrito = typeof window.carrito !== 'undefined';
    const carritoLocalStorage = localStorage.getItem('carrito');
    const existeCarritoLS = carritoLocalStorage !== null;
    
    // Crear elemento para window.carrito
    const itemWindow = document.createElement('div');
    itemWindow.className = 'diagnostico-item';
    
    if (existeCarrito) {
        const cantidadProductos = window.carrito.length;
        itemWindow.innerHTML = `<span class="success">✓</span> window.carrito existe y contiene ${cantidadProductos} producto(s).`;
    } else {
        itemWindow.innerHTML = `<span class="error">✗</span> window.carrito no está definido.`;
    }
    
    carritoEstado.appendChild(itemWindow);
    
    // Crear elemento para localStorage
    const itemLS = document.createElement('div');
    itemLS.className = 'diagnostico-item';
    
    if (existeCarritoLS) {
        try {
            const carritoLS = JSON.parse(carritoLocalStorage);
            const cantidadProductosLS = carritoLS.length;
            
            itemLS.innerHTML = `<span class="success">✓</span> localStorage tiene carrito con ${cantidadProductosLS} producto(s).`;
            
            // Verificar sincronización
            if (existeCarrito && JSON.stringify(window.carrito) === JSON.stringify(carritoLS)) {
                const itemSync = document.createElement('div');
                itemSync.className = 'diagnostico-item';
                itemSync.innerHTML = `<span class="success">✓</span> Carrito en memoria y localStorage están sincronizados.`;
                carritoEstado.appendChild(itemSync);
            } else if (existeCarrito) {
                const itemSync = document.createElement('div');
                itemSync.className = 'diagnostico-item';
                itemSync.innerHTML = `<span class="warning">⚠</span> Carrito en memoria y localStorage NO están sincronizados.`;
                carritoEstado.appendChild(itemSync);
            }
        } catch (e) {
            itemLS.innerHTML = `<span class="error">✗</span> Error al leer carrito de localStorage: ${e.message}`;
        }
    } else {
        itemLS.innerHTML = `<span class="warning">⚠</span> No hay carrito en localStorage.`;
    }
    
    carritoEstado.appendChild(itemLS);
    
    // Verificar funciones necesarias
    const funcionesNecesarias = [
        'agregarProductoUnaVez',
        'actualizarCantidadCarrito',
        'aplicarCorreccionTarjetas'
    ];
    
    const itemFunciones = document.createElement('div');
    itemFunciones.className = 'diagnostico-item';
    
    const funcionesDisponibles = funcionesNecesarias.filter(fn => typeof window[fn] === 'function');
    const funcionesFaltantes = funcionesNecesarias.filter(fn => typeof window[fn] !== 'function');
    
    if (funcionesFaltantes.length === 0) {
        itemFunciones.innerHTML = `<span class="success">✓</span> Todas las funciones necesarias están disponibles.`;
    } else {
        itemFunciones.innerHTML = `<span class="warning">⚠</span> Funciones faltantes: ${funcionesFaltantes.join(', ')}`;
    }
    
    carritoEstado.appendChild(itemFunciones);
}

// Función para diagnosticar los scripts cargados
function diagnosticarScripts() {
    const scriptsEstado = document.getElementById('scripts-estado');
    scriptsEstado.innerHTML = '';
    
    // Lista de scripts importantes
    const scriptsImportantes = [
        'carrito.js',
        'carrito-fix-radical-v2.js',
        'carrito-correccion-final.js',
        'carrito-tarjetas-fix.js'
    ];
    
    // Verificar scripts cargados
    const scriptsActuales = Array.from(document.scripts)
        .map(script => {
            const src = script.src;
            if (src) {
                const partes = src.split('/');
                return partes[partes.length - 1];
            }
            return null;
        })
        .filter(Boolean);
    
    // Mostrar resultados
    let todosPresentes = true;
    
    scriptsImportantes.forEach(script => {
        const item = document.createElement('div');
        item.className = 'diagnostico-item';
        
        if (scriptsActuales.some(s => s === script)) {
            item.innerHTML = `<span class="success">✓</span> <strong>${script}</strong>`;
        } else {
            item.innerHTML = `<span class="error">✗</span> <strong>${script}</strong> falta`;
            todosPresentes = false;
        }
        
        scriptsEstado.appendChild(item);
    });
    
    // Resumen
    const resumen = document.createElement('div');
    resumen.className = 'diagnostico-item';
    
    if (todosPresentes) {
        resumen.innerHTML = `<span class="success">✓</span> Todos los scripts están cargados.`;
    } else {
        resumen.innerHTML = `<span class="error">✗</span> Faltan scripts importantes.`;
    }
    
    scriptsEstado.appendChild(resumen);
    
    // Detección de duplicados
    const conteoScripts = {};
    scriptsActuales.forEach(script => {
        conteoScripts[script] = (conteoScripts[script] || 0) + 1;
    });
    
    const duplicados = Object.entries(conteoScripts)
        .filter(([script, count]) => count > 1 && scriptsImportantes.includes(script))
        .map(([script, count]) => `${script} (${count}x)`);
    
    if (duplicados.length > 0) {
        const duplicadosItem = document.createElement('div');
        duplicadosItem.className = 'diagnostico-item';
        duplicadosItem.innerHTML = `<span class="warning">⚠</span> Duplicados: ${duplicados.join(', ')}`;
        scriptsEstado.appendChild(duplicadosItem);
    }
}

// Función para diagnosticar las tarjetas de productos
function diagnosticarTarjetas() {
    const tarjetasEstado = document.getElementById('tarjetas-estado');
    tarjetasEstado.innerHTML = '';
    
    // Buscar tarjetas
    const tarjetas = document.querySelectorAll('.producto-card, .card-producto');
    const botones = document.querySelectorAll('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
    
    // Verificar si el script de corrección se ejecutó
    const botonesCorregidos = Array.from(botones).filter(boton => boton.hasAttribute('data-card-id'));
    const correccionAplicada = botonesCorregidos.length > 0;
    
    // Crear resultado para tarjetas
    const itemTarjetas = document.createElement('div');
    itemTarjetas.className = 'diagnostico-item';
    
    if (tarjetas.length === 0) {
        itemTarjetas.innerHTML = `<span class="warning">⚠</span> No hay tarjetas de productos (${tarjetas.length}).`;
    } else {
        itemTarjetas.innerHTML = `<span class="success">✓</span> Encontradas ${tarjetas.length} tarjetas.`;
    }
    
    tarjetasEstado.appendChild(itemTarjetas);
    
    // Crear resultado para botones
    const itemBotones = document.createElement('div');
    itemBotones.className = 'diagnostico-item';
    
    if (botones.length === 0) {
        itemBotones.innerHTML = `<span class="warning">⚠</span> No hay botones de agregar al carrito.`;
    } else {
        itemBotones.innerHTML = `<span class="success">✓</span> Encontrados ${botones.length} botones.`;
    }
    
    tarjetasEstado.appendChild(itemBotones);
    
    // Verificar corrección
    const itemCorreccion = document.createElement('div');
    itemCorreccion.className = 'diagnostico-item';
    
    if (correccionAplicada) {
        itemCorreccion.innerHTML = `<span class="success">✓</span> Corrección aplicada en ${botonesCorregidos.length}/${botones.length} botones.`;
    } else if (botones.length > 0) {
        itemCorreccion.innerHTML = `<span class="error">✗</span> Corrección NO aplicada a los botones.`;
        
        // Mostrar botón para aplicar corrección manualmente
        const btnAplicar = document.createElement('button');
        btnAplicar.textContent = 'Aplicar corrección ahora';
        btnAplicar.style.marginTop = '10px';
        btnAplicar.style.background = '#4CAF50';
        btnAplicar.style.color = 'white';
        btnAplicar.style.border = 'none';
        btnAplicar.style.padding = '5px 10px';
        btnAplicar.style.borderRadius = '4px';
        btnAplicar.style.cursor = 'pointer';
        
        btnAplicar.addEventListener('click', function() {
            if (typeof window.aplicarCorreccionTarjetas === 'function') {
                window.aplicarCorreccionTarjetas();
                setTimeout(diagnosticarTarjetas, 1000);
                mostrarMensajeEstado('Corrección aplicada manualmente', 'success');
            } else {
                mostrarMensajeEstado('No se pudo aplicar la corrección. Función no disponible.', 'error');
            }
        });
        
        itemCorreccion.appendChild(btnAplicar);
    }
    
    tarjetasEstado.appendChild(itemCorreccion);
}

// Función para probar el carrito
function probarCarrito() {
    // Verificar si hay tarjetas
    const tarjetas = document.querySelectorAll('.producto-card, .card-producto');
    
    if (tarjetas.length === 0) {
        mostrarMensajeEstado('No hay tarjetas de productos para probar', 'warning');
        return;
    }
    
    // Seleccionar una tarjeta aleatoria
    const indiceAleatorio = Math.floor(Math.random() * tarjetas.length);
    const tarjetaSeleccionada = tarjetas[indiceAleatorio];
    
    // Buscar botón de talla
    const botonesTallas = tarjetaSeleccionada.querySelectorAll('.talla-btn');
    
    // Si hay botones de talla, seleccionar uno
    if (botonesTallas.length > 0) {
        const indiceTallaAleatorio = Math.floor(Math.random() * botonesTallas.length);
        botonesTallas[indiceTallaAleatorio].click();
    }
    
    // Buscar botón de agregar al carrito
    const botonAgregar = tarjetaSeleccionada.querySelector('.btn-add-cart, .btn-agregar-carrito, .agregar-carrito');
    
    if (!botonAgregar) {
        mostrarMensajeEstado('No se encontró botón de agregar al carrito', 'error');
        return;
    }
    
    // Guardar estado actual del carrito
    const carritoAntes = localStorage.getItem('carrito');
    const cantidadAntes = window.carrito ? window.carrito.length : 0;
    
    // Simular clic en el botón
    botonAgregar.click();
    
    // Esperar y verificar cambios
    setTimeout(function() {
        const carritoAhora = localStorage.getItem('carrito');
        const cantidadAhora = window.carrito ? window.carrito.length : 0;
        
        if (carritoAhora !== carritoAntes || cantidadAhora !== cantidadAntes) {
            mostrarMensajeEstado('Producto agregado correctamente al carrito', 'success');
        } else {
            mostrarMensajeEstado('No se detectó cambio en el carrito', 'warning');
        }
        
        // Actualizar diagnóstico
        realizarDiagnosticoCompleto();
    }, 500);
}

// Función para mostrar mensajes de estado
function mostrarMensajeEstado(mensaje, tipo) {
    // Crear elemento de mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.position = 'fixed';
    mensajeElement.style.top = '20px';
    mensajeElement.style.left = '50%';
    mensajeElement.style.transform = 'translateX(-50%)';
    mensajeElement.style.padding = '10px 20px';
    mensajeElement.style.borderRadius = '5px';
    mensajeElement.style.fontFamily = 'Inter, sans-serif';
    mensajeElement.style.zIndex = '10000';
    mensajeElement.style.opacity = '0';
    mensajeElement.style.transition = 'opacity 0.3s ease';
    
    // Establecer colores según el tipo
    if (tipo === 'success') {
        mensajeElement.style.backgroundColor = '#4CAF50';
        mensajeElement.style.color = 'white';
    } else if (tipo === 'warning') {
        mensajeElement.style.backgroundColor = '#FF9800';
        mensajeElement.style.color = 'white';
    } else if (tipo === 'error') {
        mensajeElement.style.backgroundColor = '#F44336';
        mensajeElement.style.color = 'white';
    }
    
    // Agregar al DOM
    document.body.appendChild(mensajeElement);
    
    // Mostrar con animación
    setTimeout(() => {
        mensajeElement.style.opacity = '1';
    }, 10);
    
    // Ocultar después de un tiempo
    setTimeout(() => {
        mensajeElement.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(mensajeElement);
        }, 300);
    }, 3000);
}
