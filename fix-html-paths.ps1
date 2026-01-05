# Actualizar rutas en HTML
$rootPath = "d:\Users\User\Documents\Proyectos Personales\nueva-version-calzado-pag-completa-main\mypageshoes"
$htmlFiles = Get-ChildItem -Path $rootPath -Filter "*.html"

Write-Host "Actualizando rutas en archivos HTML..." -ForegroundColor Green
$totalUpdated = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Enlaces a index.html deben apuntar al root (..)
    $content = $content -replace 'href="index\.html"', 'href="../index.html"'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Actualizado: $($file.Name)" -ForegroundColor Green
        $totalUpdated++
    }
}

Write-Host "Completado. Archivos actualizados: $totalUpdated" -ForegroundColor Cyan
