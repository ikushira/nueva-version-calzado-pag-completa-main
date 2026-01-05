# Script PowerShell para agregar chatbot a nuevas páginas
# Uso: .\agregar-chatbot-nueva-pagina.ps1 -archivo "nombre-archivo.html"

param(
    [Parameter(Mandatory=$true)]
    [string]$archivo
)

# Verificar si el archivo existe
if (-not (Test-Path $archivo)) {
    Write-Host "❌ Error: El archivo '$archivo' no existe." -ForegroundColor Red
    exit 1
}

# Leer el contenido del archivo
$contenido = Get-Content $archivo -Raw -Encoding UTF8

# Verificar si ya tiene el chatbot
if ($contenido -match "chatbot\.css" -or $contenido -match "chatbot\.js") {
    Write-Host "⚠️  El archivo '$archivo' ya tiene el chatbot implementado." -ForegroundColor Yellow
    exit 0
}

# CSS del chatbot
$chatbotCSS = '  <link rel="stylesheet" href="css/chatbot.css">'

# JavaScript del chatbot
$chatbotJS = '  <script src="js/chatbot.js"></script>'

# Agregar CSS antes del cierre de </head>
if ($contenido -match '</head>') {
    $contenido = $contenido -replace '</head>', "$chatbotCSS`n</head>"
    Write-Host "✅ CSS del chatbot agregado." -ForegroundColor Green
} else {
    Write-Host "⚠️  No se encontró la etiqueta </head>." -ForegroundColor Yellow
}

# Agregar JavaScript antes del cierre de </body>
if ($contenido -match '</body>') {
    $contenido = $contenido -replace '</body>', "$chatbotJS`n</body>"
    Write-Host "✅ JavaScript del chatbot agregado." -ForegroundColor Green
} else {
    Write-Host "⚠️  No se encontró la etiqueta </body>." -ForegroundColor Yellow
}

# Guardar el archivo actualizado
try {
    $contenido | Out-File -FilePath $archivo -Encoding UTF8 -NoNewline
    Write-Host "🎉 ¡Chatbot agregado exitosamente a '$archivo'!" -ForegroundColor Cyan
    
    Write-Host "`n📋 El chatbot ahora incluye:" -ForegroundColor White
    Write-Host "   • Botón flotante encima del WhatsApp" -ForegroundColor Gray
    Write-Host "   • IA conversacional especializada en calzado" -ForegroundColor Gray
    Write-Host "   • Interfaz moderna y responsiva" -ForegroundColor Gray
    Write-Host "   • Respuestas sobre productos, marcas y servicios" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error al guardar el archivo: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Mostrar instrucciones de uso
Write-Host "`n🤖 Instrucciones para el usuario:" -ForegroundColor Cyan
Write-Host "   1. Buscar el botón del robot en la esquina inferior derecha" -ForegroundColor White
Write-Host "   2. Hacer clic para abrir el chat" -ForegroundColor White
Write-Host "   3. Escribir preguntas sobre productos, tallas, precios, etc." -ForegroundColor White
Write-Host "   4. Obtener respuestas inmediatas y personalizadas" -ForegroundColor White

Write-Host "`n💡 Ejemplos de consultas:" -ForegroundColor Cyan
Write-Host "   • 'Hola, busco zapatos para hombre'" -ForegroundColor White
Write-Host "   • '¿Qué marcas manejan?'" -ForegroundColor White
Write-Host "   • 'Necesito tallas grandes'" -ForegroundColor White
Write-Host "   • '¿Hacen envíos gratis?'" -ForegroundColor White
