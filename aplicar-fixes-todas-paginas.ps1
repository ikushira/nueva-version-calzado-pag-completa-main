# aplicar-fixes-todas-paginas.ps1
# Script para aplicar viewport responsive y cart fixes a todas las páginas

Write-Host "🚀 Aplicando fixes a todas las páginas HTML..." -ForegroundColor Cyan

# Definir rutas
$carpetaBase = ".\mypageshoes"
$archivosHTML = Get-ChildItem -Path $carpetaBase -Filter "*.html" -File

# Contador
$total = 0
$actualizados = 0

foreach ($archivo in $archivosHTML) {
    $total++
    $ruta = $archivo.FullName
    $contenido = Get-Content -Path $ruta -Raw -Encoding UTF8
    
    Write-Host "`n📄 Procesando: $($archivo.Name)" -ForegroundColor Yellow
    
    $cambios = $false
    
    # Fix 1: Actualizar viewport
    if ($contenido -match '<meta name="viewport" content="[^"]*"') {
        $nuevoViewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">'
        $contenido = $contenido -replace '<meta name="viewport" content="[^"]*"', $nuevoViewport
        Write-Host "  ✅ Viewport actualizado" -ForegroundColor Green
        $cambios = $true
    }
    
    # Fix 2: Agregar CSS responsive-viewport.css si no existe
    if ($contenido -notmatch 'responsive-viewport\.css') {
        # Buscar la primera línea <link rel="stylesheet"
        if ($contenido -match '(<head[^>]*>[\s\S]*?)(<link rel="stylesheet")') {
            $antes = $Matches[1]
            $despues = $Matches[2]
            $nuevoCSS = @"
$antes
  <link rel="stylesheet" href="css/responsive-viewport.css">
  $despues
"@
            $contenido = $contenido -replace '(<head[^>]*>[\s\S]*?)(<link rel="stylesheet")', $nuevoCSS
            Write-Host "  ✅ CSS responsive-viewport.css agregado" -ForegroundColor Green
            $cambios = $true
        }
    }
    
    # Fix 3: Agregar cart-fix-complete.js si no existe y hay cart-manager.js
    if ($contenido -match 'cart-manager\.js' -and $contenido -notmatch 'cart-fix-complete\.js') {
        # Agregar después de cart-manager.js
        $contenido = $contenido -replace '(<script src="js/cart-manager\.js"></script>)', '$1`n  <script src="js/cart-fix-complete.js"></script>'
        Write-Host "  ✅ Script cart-fix-complete.js agregado" -ForegroundColor Green
        $cambios = $true
    }
    
    # Guardar cambios
    if ($cambios) {
        Set-Content -Path $ruta -Value $contenido -Encoding UTF8
        $actualizados++
        Write-Host "  💾 Archivo actualizado" -ForegroundColor Cyan
    } else {
        Write-Host "  ⏭️  Sin cambios necesarios" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "PROCESO COMPLETADO" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Total de archivos procesados: $total" -ForegroundColor White
Write-Host "Archivos actualizados: $actualizados" -ForegroundColor Green
Write-Host ""
Write-Host "Cambios aplicados:" -ForegroundColor Yellow
Write-Host "  - Viewport optimizado para todas las pantallas" -ForegroundColor White
Write-Host "  - CSS responsive agregado (zoom automatico 90% en >1920px)" -ForegroundColor White
Write-Host "  - Fixes de carrito implementados" -ForegroundColor White
Write-Host "  - Feedback visual de Agregar al carrito mejorado" -ForegroundColor White
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Abre el navegador en modo incognito (Ctrl+Shift+N)" -ForegroundColor White
Write-Host "  2. Prueba agregar productos al carrito" -ForegroundColor White
Write-Host "  3. Verifica que el boton se ponga verde" -ForegroundColor White
Write-Host "  4. Abre el carrito y verifica que los productos aparezcan" -ForegroundColor White
Write-Host "  5. Usa F12 y escribe verCarrito() para ver debug" -ForegroundColor White
Write-Host ""
