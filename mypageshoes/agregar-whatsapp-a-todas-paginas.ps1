# Este script inserta la referencia al script de WhatsApp en todas las páginas HTML

$scriptTag = '<script src="js/aplicar-whatsapp-all-pages.js"></script>'
$files = Get-ChildItem -Path . -Filter "*.html" | Where-Object { $_.Length -gt 0 }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Verificar si el script ya está incluido
    if (!($content -match "aplicar-whatsapp-all-pages\.js")) {
        # Insertar el script antes del cierre de </body>
        $modifiedContent = $content -replace "</body>", "$scriptTag`n</body>"
        Set-Content -Path $file.FullName -Value $modifiedContent -NoNewline
        Write-Output "Script de WhatsApp agregado a $($file.Name)"
    } else {
        Write-Output "El script ya está presente en $($file.Name)"
    }
}

Write-Output "Proceso completado. El botón de WhatsApp ahora debería aparecer en todas las páginas."
