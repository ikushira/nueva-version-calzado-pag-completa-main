// Script para agregar el chatbot a todas las páginas de Mundo Calzado
const fs = require('fs');
const path = require('path');

// Función para leer archivos HTML
function readHTMLFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.log(`Error leyendo archivo ${filePath}:`, error.message);
        return null;
    }
}

// Función para escribir archivos HTML
function writeHTMLFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Actualizado: ${path.basename(filePath)}`);
    } catch (error) {
        console.log(`❌ Error escribiendo archivo ${filePath}:`, error.message);
    }
}

// Función para agregar el chatbot a un archivo HTML
function addChatbotToHTML(htmlContent, fileName) {
    // Verificar si ya tiene el chatbot
    if (htmlContent.includes('chatbot.css') || htmlContent.includes('chatbot.js')) {
        console.log(`⚠️  ${fileName} ya tiene el chatbot implementado`);
        return htmlContent;
    }

    // CSS del chatbot - agregar antes del cierre de </head>
    const chatbotCSS = '  <link rel="stylesheet" href="css/chatbot.css">';
    
    // JS del chatbot - agregar antes del cierre de </body>
    const chatbotJS = '  <script src="js/chatbot.js"></script>';

    let updatedContent = htmlContent;

    // Agregar CSS antes del cierre de </head>
    if (updatedContent.includes('</head>')) {
        updatedContent = updatedContent.replace('</head>', `${chatbotCSS}\n</head>`);
    }

    // Agregar JS antes del cierre de </body>
    if (updatedContent.includes('</body>')) {
        updatedContent = updatedContent.replace('</body>', `${chatbotJS}\n</body>`);
    }

    return updatedContent;
}

// Lista de archivos HTML a actualizar
const htmlFiles = [
    'index.html',
    'hombres.html',
    'mujeres.html',
    'ninos.html',
    'ninas.html',
    'ofertas.html',
    'nuevos.html',
    'marcas.html',
    'accesorios.html',
    'colegiales.html',
    'dotacion.html',
    'login.html',
    'cuenta.html',
    'direccion_cuenta.html',
    'editar_perfil.html',
    'ver_usuarios.html',
    'guia-tallas.html',
    'prueba-tallas.html',
    'limpiar-carrito.html',
    'verificar-tarjetas.html',
    'diagnostico-tarjetas.html',
    'diagnostico-carrito.html',
    'diagnostico-radical-carrito.html',
    'diagnostico-radical-v2-carrito.html',
    'demo-carrito-mejorado.html',
    'herramienta-diagnostico.html'
];

// Función principal
function main() {
    console.log('🤖 Iniciando implementación del chatbot en todas las páginas...\n');

    let successCount = 0;
    let errorCount = 0;

    htmlFiles.forEach(fileName => {
        const filePath = path.join(__dirname, '..', fileName);
        
        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  Archivo no encontrado: ${fileName}`);
            return;
        }

        const htmlContent = readHTMLFile(filePath);
        if (htmlContent === null) {
            errorCount++;
            return;
        }

        const updatedContent = addChatbotToHTML(htmlContent, fileName);
        
        if (updatedContent !== htmlContent) {
            writeHTMLFile(filePath, updatedContent);
            successCount++;
        }
    });

    console.log('\n📊 Resumen de la implementación:');
    console.log(`✅ Archivos actualizados exitosamente: ${successCount}`);
    console.log(`❌ Errores encontrados: ${errorCount}`);
    console.log('\n🎉 ¡Implementación del chatbot completada!');
    console.log('\n📋 Características del chatbot implementado:');
    console.log('   • Botón flotante con diseño de robot');
    console.log('   • Posicionado encima del botón de WhatsApp');
    console.log('   • IA conversacional especializada en calzado');
    console.log('   • Respuestas sobre productos, marcas, tallas, precios');
    console.log('   • Interfaz moderna y responsiva');
    console.log('   • Animaciones y efectos visuales');
}

// Ejecutar el script
if (require.main === module) {
    main();
}

module.exports = { addChatbotToHTML, main };
