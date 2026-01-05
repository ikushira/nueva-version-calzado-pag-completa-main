# Actualizar rutas en archivos JavaScript
$jsPath = "d:\Users\User\Documents\Proyectos Personales\nueva-version-calzado-pag-completa-main\mypageshoes\js"
$jsFiles = Get-ChildItem -Path $jsPath -Filter "*.js" -Recurse

Write-Host "Normalizando rutas en archivos JavaScript..." -ForegroundColor Green
$totalModified = 0

foreach ($file in $jsFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    # Normalizar rutas: 'assets/img/' -> './assets/img/'
    $content = $content -replace '"assets/img/', '"./assets/img/'
    $content = $content -replace "'assets/img/", "'./assets/img/"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Actualizado: $($file.Name)" -ForegroundColor Green
        $totalModified++
    }
}

Write-Host "Completado. Archivos modificados: $totalModified" -ForegroundColor Cyan
