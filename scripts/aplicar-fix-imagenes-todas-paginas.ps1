# aplicar-fix-imagenes-todas-paginas.ps1
# Script para agregar cart-image-force.css a todas las páginas

Write-Host "Aplicando fix de imagenes a todas las paginas..." -ForegroundColor Cyan

$carpeta = ".\mypageshoes"
$archivos = Get-ChildItem -Path $carpeta -Filter "*.html" -File

$total = 0
$actualizados = 0

foreach ($archivo in $archivos) {
    $total++
    $ruta = $archivo.FullName
    $contenido = Get-Content -Path $ruta -Raw -Encoding UTF8
    
    # Solo procesar si tiene cart-display-fix.css y no tiene cart-image-force.css
    if ($contenido -match 'cart-display-fix\.css' -and $contenido -notmatch 'cart-image-force\.css') {
        Write-Host "Procesando: $($archivo.Name)" -ForegroundColor Yellow
        
        # Agregar cart-image-force.css después de cart-display-fix.css
        $contenido = $contenido -replace '(<link rel="stylesheet" href="css/cart-display-fix\.css">)', '$1`n  <link rel="stylesheet" href="css/cart-image-force.css">'
        Set-Content -Path $ruta -Value $contenido -Encoding UTF8
        Write-Host "  Actualizado" -ForegroundColor Green
        $actualizados++
    }
}

Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "COMPLETADO" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "Total archivos: $total" -ForegroundColor White
Write-Host "Actualizados: $actualizados" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora recarga con Ctrl+Shift+R" -ForegroundColor Yellow
