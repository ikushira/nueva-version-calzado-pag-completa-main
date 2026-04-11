# 🤖 Chatbot con IA para Mundo Calzado

## Descripción
Hemos implementado un chatbot inteligente con aspecto de robot que funciona como asistente virtual para los clientes de Mundo Calzado. El chatbot está diseñado para brindar atención humanizada y asesorar las ventas de manera eficiente.

## 📍 Ubicación
- **Posición**: Botón flotante posicionado encima del botón de WhatsApp
- **Diseño**: Robot con antena, ojos expresivos y colores azules corporativos
- **Efecto**: Animación de pulsación sutil para atraer la atención

## 🎨 Características Visuales

### Botón Flotante
- **Imagen**: SVG personalizado de robot creado especialmente para Mundo Calzado
- **Colores**: Degradado azul (#4A90E2 a #5A9BD4)
- **Animación**: Efecto pulse y hover con escalado
- **Posición**: Fixed, bottom: 100px, right: 24px

### Interfaz del Chat
- **Modal responsivo**: 350px × 500px en desktop, adaptable en móvil
- **Header**: Gradiente azul con título "Asistente de Mundo Calzado"
- **Área de mensajes**: Scroll automático con animaciones de entrada
- **Input**: Campo redondeado con botón de envío SVG

## 🧠 Inteligencia Artificial

### Capacidades del Chatbot
El chatbot puede responder sobre:

#### 📦 Productos y Categorías
- **Hombres**: Zapatos formales, deportivos, botas, mocasines
- **Mujeres**: Tacones, flats, sandalias, botas, deportivos
- **Niños**: Calzado escolar, deportivo, casual
- **Niñas**: Zapatos escolares, sandalias, deportivos

#### 🏷️ Marcas Disponibles
- **Premium**: Croydon, Frattini, Piccadilly
- **Deportivas**: Patrick, 24 Walks
- **Infantiles**: Bubblegummers, Gumball
- **Casuales**: Moleca, Ipanema, Cartago, Stardus

#### 📏 Información Técnica
- **Tallas**: Desde la 21 hasta la 45
- **Materiales**: Cuero genuino, sintético, textil
- **Precios**: Rango de $50,000 a $300,000
- **Guía de tallas**: Asesoramiento personalizado

#### 🚚 Servicios
- **Envíos**: Mismo día en ciudad, 2-5 días nacional
- **Envío gratis**: Compras superiores a $150,000
- **Devoluciones**: 30 días, estado perfecto
- **Garantía**: 6 meses contra defectos de fabricación

### 💬 Tipos de Respuesta

#### Respuestas Inteligentes
- **Saludos personalizados**: Múltiples variaciones de bienvenida
- **Recomendaciones específicas**: Basadas en necesidades del cliente
- **Información detallada**: Sobre productos, marcas y servicios
- **Respuestas contextuales**: Adaptadas a la consulta específica

#### Gestión de Conversación
- **Indicador de escritura**: Animación de puntos mientras "piensa"
- **Tiempo de respuesta**: 1-2 segundos para simular naturalidad
- **Respuestas aleatorias**: Evita repetición en saludos y agradecimientos
- **Fallback inteligente**: Sugerencias cuando no entiende la consulta

## 🛠️ Implementación Técnica

### Archivos Creados
1. **`assets/img/chatbot-robot.svg`** - Imagen del robot
2. **`css/chatbot.css`** - Estilos completos del chatbot
3. **`js/chatbot.js`** - Lógica e IA del chatbot
4. **`js/aplicar-chatbot-todas-paginas.js`** - Script de implementación

### Páginas Actualizadas
El chatbot se implementó automáticamente en **24 páginas**:
- index.html, hombres.html, mujeres.html, ninos.html, ninas.html
- ofertas.html, nuevos.html, marcas.html, accesorios.html
- colegiales.html, dotacion.html, login.html, cuenta.html
- direccion_cuenta.html, editar_perfil.html, ver_usuarios.html
- guia-tallas.html, prueba-tallas.html, limpiar-carrito.html
- verificar-tarjetas.html, diagnostico-tarjetas.html
- diagnostico-carrito.html, diagnostico-radical-carrito.html
- diagnostico-radical-v2-carrito.html

### Estructura del Código

#### CSS Modular
```css
.chatbot-float          /* Botón flotante */
.chatbot-modal          /* Overlay del modal */
.chatbot-container      /* Contenedor principal */
.chatbot-header         /* Encabezado */
.chatbot-messages       /* Área de conversación */
.chatbot-input-container /* Input y botón envío */
```

#### JavaScript Orientado a Objetos
```javascript
class MundoCalzadoChatbot {
    constructor()           // Inicialización
    createChatbotHTML()    // Crear elementos DOM
    bindEvents()           // Eventos de interacción
    generateResponse()     // IA conversacional
    addMessage()           // Gestión de mensajes
}
```

## 📱 Responsive Design

### Desktop
- **Chatbot**: 350px × 500px, esquina inferior derecha
- **Botón**: 64px × 64px con efecto hover

### Móvil
- **Chatbot**: Ancho adaptable (calc(100vw - 32px))
- **Altura**: 400px para móviles
- **Botones**: Posicionamiento ajustado (right: 16px)

## 🎯 Funcionalidades Especiales

### Animaciones
- **Pulse**: Animación sutil en el botón para llamar atención
- **FadeIn**: Mensajes aparecen con transición suave
- **Typing**: Indicador animado de escritura
- **Hover**: Escalado del botón al pasar el mouse

### Interacciones
- **Click fuera**: Cierra el modal automáticamente
- **Enter**: Envía mensaje desde el teclado
- **Scroll automático**: Se mantiene en el último mensaje
- **Focus automático**: Input activo al abrir el chat

### Base de Conocimientos
El chatbot incluye una base de datos interna con:
- **Categorías de productos**: Array de tipos disponibles
- **Marcas**: Lista completa de marcas manejadas
- **Tallas**: Rango completo 21-45
- **Materiales**: Tipos de materiales utilizados

## 🚀 Cómo Usar

### Para Clientes
1. **Localizar**: Buscar el botón del robot encima del WhatsApp
2. **Clic**: Hacer clic en el botón para abrir el chat
3. **Escribir**: Hacer preguntas sobre productos, tallas, precios
4. **Obtener respuestas**: Recibir asesoramiento inmediato
5. **Cerrar**: Clic en X o fuera del modal para cerrar

### Ejemplos de Consultas
- "Hola, busco zapatos para hombre"
- "¿Qué tallas manejan en deportivos?"
- "Cuéntame sobre la marca Piccadilly"
- "¿Hacen envíos gratis?"
- "Necesito zapatos cómodos para trabajo"

## 🔧 Mantenimiento

### Actualizar Respuestas
Para agregar nuevas respuestas, editar el archivo `js/chatbot.js`:
- Método `generateResponse()`: Lógica de respuestas
- Array de keywords: Palabras clave de activación
- Responses arrays: Variaciones de respuestas

### Agregar Nuevas Páginas
Ejecutar el script de implementación:
```bash
node js/aplicar-chatbot-todas-paginas.js
```

### Personalizar Estilos
Editar `css/chatbot.css` para modificar:
- Colores corporativos
- Tamaños y posiciones
- Animaciones y efectos
- Responsive breakpoints

## 📊 Métricas y Beneficios

### Beneficios Esperados
- **Atención 24/7**: Disponible siempre para los clientes
- **Respuesta inmediata**: Sin tiempos de espera
- **Información consistente**: Respuestas unificadas
- **Reducción de consultas**: Filtro antes del contacto humano
- **Mejor experiencia**: Interfaz moderna y atractiva

### Métricas Sugeridas
- Número de interacciones diarias
- Consultas más frecuentes
- Tiempo promedio de conversación
- Conversiones generadas por el chatbot

## 🎨 Personalización Visual

El diseño del robot fue creado específicamente para Mundo Calzado con:
- **Colores corporativos**: Azules que combinan con la marca
- **Expresión amigable**: Ojos grandes y "sonrisa" tecnológica
- **Antena característica**: Elemento distintivo del robot
- **Estilo moderno**: Flat design con toques de profundidad

¡El chatbot está listo para brindar una experiencia de atención al cliente excepcional! 🚀
