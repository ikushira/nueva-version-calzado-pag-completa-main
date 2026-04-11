# Script PowerShell para crear páginas del footer

$pagesDir = "d:\Users\User\Documents\Proyectos Personales\nueva-version-calzado-pag-completa-main\mypageshoes\pages"

# Plantilla base HTML
$template = @'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TITLE}} - Mundo Calzado</title>
  <meta name="description" content="{{DESCRIPTION}}">
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
    header { background: #ff0000; color: white; padding: 30px 20px; text-align: center; }
    main { max-width: 900px; margin: 40px auto; padding: 0 20px; }
    h2 { color: #ff0000; margin-top: 30px; }
    .btn-home { background: #ff0000; color: white; padding: 12px 30px; text-decoration: none; 
                border-radius: 6px; display: inline-block; margin: 40px 0; }
    .btn-home:hover { background: #cc0000; }
    footer { background: #333; color: white; text-align: center; padding: 20px; margin-top: 60px; }
  </style>
</head>
<body>
  <header>
    <h1>{{TITLE}}</h1>
  </header>
  <main>
    {{CONTENT}}
    <div style="text-align: center;">
      <a href="../index.html" class="btn-home">Volver al Inicio</a>
    </div>
  </main>
  <footer>
    <p>&copy; 2025 Mundo Calzado. Todos los derechos reservados.</p>
  </footer>
</body>
</html>
'@

# Definir páginas a crear
$pages = @(
  @{
    file = "ayuda.html"
    title = "Ayuda y Soporte"
    description = "Centro de ayuda de Mundo Calzado"
    content = @"
<h2>¿En qué podemos ayudarte?</h2>
<p>Estamos aquí para asistirte con cualquier consulta o problema que tengas con tu compra.</p>

<h3>Preguntas Frecuentes</h3>
<h4>¿Cómo puedo realizar un pedido?</h4>
<p>Navega por nuestro catálogo, selecciona los productos que desees, elige tu talla y agrégalos al carrito. Luego procede al checkout para completar tu compra.</p>

<h4>¿Cuáles son los métodos de pago disponibles?</h4>
<p>Aceptamos tarjetas de crédito/débito, PSE, Nequi, Daviplata y pago contra entrega.</p>

<h4>¿Cuánto tarda el envío?</h4>
<p>Los envíos a ciudades principales tardan de 2-3 días hábiles. Para otras ciudades puede tardar hasta 5 días hábiles.</p>

<h4>¿Puedo cambiar o devolver un producto?</h4>
<p>Sí, tienes 30 días para cambios y devoluciones. El producto debe estar sin uso y con sus etiquetas originales.</p>

<h3>Contacto</h3>
<p>Si no encontraste la respuesta que buscabas:</p>
<ul>
  <li>Email: soporte@mundocalzado.com</li>
  <li>Teléfono: +57 300 123 4567</li>
  <li>WhatsApp: +57 300 123 4567</li>
  <li>Horario de atención: Lunes a Viernes 8AM - 6PM, Sábados 9AM - 5PM</li>
</ul>
"@
  },
  @{
    file = "quienes-somos.html"
    title = "¿Quiénes Somos?"
    description = "Conoce la historia de Mundo Calzado"
    content = @"
<h2>Nuestra Historia</h2>
<p>Mundo Calzado nació en 1995 con la visión de ofrecer calzado de calidad para toda la familia colombiana. Con más de 28 años de experiencia, nos hemos consolidado como una de las cadenas de calzado más confiables del país.</p>

<h3>Nuestra Misión</h3>
<p>Proporcionar calzado de excelente calidad a precios accesibles, garantizando la satisfacción de nuestros clientes y contribuyendo al bienestar de las familias colombianas.</p>

<h3>Nuestra Visión</h3>
<p>Ser la cadena de calzado líder en Colombia, reconocida por nuestra variedad, calidad y servicio al cliente excepcional.</p>

<h3>Valores</h3>
<ul>
  <li><strong>Calidad:</strong> Seleccionamos cuidadosamente cada producto</li>
  <li><strong>Integridad:</strong> Transparencia en todas nuestras operaciones</li>
  <li><strong>Servicio:</strong> Atención personalizada y profesional</li>
  <li><strong>Innovación:</strong> Constantemente mejorando nuestra oferta</li>
</ul>

<h3>Cifras que nos Respaldan</h3>
<ul>
  <li>+50 tiendas a nivel nacional</li>
  <li>+500,000 clientes satisfechos</li>
  <li>+100 marcas reconocidas</li>
  <li>+28 años de experiencia</li>
</ul>
"@
  },
  @{
    file = "trabaja-con-nosotros.html"
    title = "Trabaja con Nosotros"
    description = "Únete al equipo de Mundo Calzado"
    content = @"
<h2>Únete a Nuestro Equipo</h2>
<p>En Mundo Calzado buscamos personas apasionadas, comprometidas y con ganas de crecer profesionalmente.</p>

<h3>¿Por qué Trabajar con Nosotros?</h3>
<ul>
  <li>Ambiente de trabajo positivo y colaborativo</li>
  <li>Oportunidades de crecimiento y desarrollo profesional</li>
  <li>Capacitación constante</li>
  <li>Beneficios competitivos</li>
  <li>Estabilidad laboral</li>
</ul>

<h3>Vacantes Actuales</h3>
<p>Actualmente estamos buscando:</p>
<ul>
  <li>Asesores de ventas (Varias ciudades)</li>
  <li>Supervisores de tienda</li>
  <li>Personal de logística y bodega</li>
  <li>Desarrolladores web</li>
</ul>

<h3>Cómo Aplicar</h3>
<p>Envía tu hoja de vida a: <strong>rrhh@mundocalzado.com</strong></p>
<p>Asunto: [Cargo al que aplicas] - [Tu nombre]</p>
<p>Incluye:</p>
<ul>
  <li>Hoja de vida actualizada (PDF)</li>
  <li>Carta de presentación</li>
  <li>Disponibilidad</li>
</ul>
"@
  },
  @{
    file = "encuentra-nuestras-tiendas.html"
    title = "Encuentra Nuestras Tiendas"
    description = "Ubicaciones de tiendas Mundo Calzado"
    content = @"
<h2>Nuestras Tiendas</h2>
<p>Visítanos en cualquiera de nuestras tiendas a nivel nacional. Contamos con más de 50 puntos de venta en las principales ciudades de Colombia.</p>

<h3>Bogotá</h3>
<ul>
  <li><strong>Centro Mayor:</strong> Local 234, Centro Comercial Centro Mayor</li>
  <li><strong>Unicentro:</strong> Local 145, Centro Comercial Unicentro</li>
  <li><strong>Gran Estación:</strong> Local 321, Centro Comercial Gran Estación</li>
  <li><strong>Portal de la 80:</strong> Local 178, Centro Comercial Portal 80</li>
</ul>

<h3>Medellín</h3>
<ul>
  <li><strong>El Tesoro:</strong> Local 256, Parque Comercial El Tesoro</li>
  <li><strong>Premium Plaza:</strong> Local 189, Centro Comercial Premium Plaza</li>
  <li><strong>San Diego:</strong> Local 134, Centro Comercial San Diego</li>
</ul>

<h3>Cali</h3>
<ul>
  <li><strong>Palmetto:</strong> Local 267, Centro Comercial Palmetto</li>
  <li><strong>Chipichape:</strong> Local 145, Centro Comercial Chipichape</li>
</ul>

<h3>Barranquilla</h3>
<ul>
  <li><strong>Buenavista:</strong> Local 234, Centro Comercial Buenavista</li>
  <li><strong>Portal del Prado:</strong> Local 167, Centro Comercial Portal del Prado</li>
</ul>

<h3>Cartagena</h3>
<ul>
  <li><strong>Caribe Plaza:</strong> Local 189, Centro Comercial Caribe Plaza</li>
</ul>

<p><em>Horarios: Lunes a Sábado 10:00 AM - 9:00 PM | Domingos 11:00 AM - 8:00 PM</em></p>
"@
  }
)

# Crear cada página
foreach ($page in $pages) {
  $html = $template -replace '{{TITLE}}', $page.title
  $html = $html -replace '{{DESCRIPTION}}', $page.description
  $html = $html -replace '{{CONTENT}}', $page.content
  
  $filePath = Join-Path $pagesDir $page.file
  Set-Content -Path $filePath -Value $html -Encoding UTF8
  Write-Host "✓ Creada: $($page.file)"
}

Write-Host "`n✅ Todas las páginas han sido creadas exitosamente"
'@

Set-Content -Path "d:\Users\User\Documents\Proyectos Personales\nueva-version-calzado-pag-completa-main\crear-paginas-footer.ps1" -Value $template -Encoding UTF8

Write-Host "✓ Script creado: crear-paginas-footer.ps1"