/**
 * invoice-generator.js
 * Genera facturas/recibos de pedidos y permite compartir por WhatsApp
 */

class InvoiceGenerator {
  constructor() {
    this.whatsappNumber = '573001234567'; // PLACEHOLDER - Reemplazar con número real
  }

  /**
   * Genera HTML de factura para un pedido
   */
  generateInvoiceHTML(orderData) {
    const fecha = new Date(orderData.fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsHTML = orderData.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.size || 'Única'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toLocaleString('es-CO')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
          $${(item.price * item.quantity).toLocaleString('es-CO')}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura ${orderData.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: #f5f5f5;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 30px;
            border-bottom: 3px solid #ff0000;
            margin-bottom: 30px;
          }
          .company-info h1 {
            color: #ff0000;
            font-size: 32px;
            margin-bottom: 5px;
          }
          .company-info p {
            color: #666;
            font-size: 14px;
          }
          .invoice-details {
            text-align: right;
          }
          .invoice-number {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          .invoice-date {
            color: #666;
            font-size: 14px;
          }
          .invoice-status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
          }
          .status-paid {
            background: #d4edda;
            color: #155724;
          }
          .status-pending {
            background: #fff3cd;
            color: #856404;
          }
          .customer-shipping {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
          }
          .info-section h3 {
            color: #333;
            font-size: 16px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
          }
          .info-section p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 5px;
          }
          .info-label {
            font-weight: 600;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background: #f8f8f8;
            padding: 12px 10px;
            text-align: left;
            font-size: 14px;
            color: #333;
            border-bottom: 2px solid #ddd;
          }
          th:last-child,
          td:last-child {
            text-align: right;
          }
          .totals-section {
            margin-left: auto;
            width: 300px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 15px;
            color: #666;
          }
          .total-row.final {
            border-top: 2px solid #333;
            padding-top: 15px;
            margin-top: 10px;
            font-size: 20px;
            font-weight: bold;
            color: #ff0000;
          }
          .invoice-footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #f0f0f0;
            text-align: center;
            color: #999;
            font-size: 13px;
          }
          .action-buttons {
            margin-top: 30px;
            display: flex;
            gap: 15px;
            justify-content: center;
          }
          .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s;
          }
          .btn-whatsapp {
            background: #25d366;
            color: white;
          }
          .btn-whatsapp:hover {
            background: #128c7e;
          }
          .btn-print {
            background: #007bff;
            color: white;
          }
          .btn-print:hover {
            background: #0056b3;
          }
          .btn-download {
            background: #6c757d;
            color: white;
          }
          .btn-download:hover {
            background: #5a6268;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
              padding: 20px;
            }
            .action-buttons {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="invoice-header">
            <div class="company-info">
              <h1>MUNDO CALZADO</h1>
              <p>Tienda de Calzado y Accesorios</p>
              <p>NIT: 900.XXX.XXX-X</p>
              <p>Tel: +57 300 123 4567</p>
            </div>
            <div class="invoice-details">
              <div class="invoice-number">${orderData.orderNumber}</div>
              <div class="invoice-date">${fecha}</div>
              <div class="invoice-status ${orderData.estado === 'paid' ? 'status-paid' : 'status-pending'}">
                ${orderData.estado === 'paid' ? 'PAGADO' : 'PENDIENTE'}
              </div>
            </div>
          </div>

          <!-- Customer & Shipping Info -->
          <div class="customer-shipping">
            <div class="info-section">
              <h3>📋 Información del Cliente</h3>
              <p><span class="info-label">Nombre:</span> ${orderData.customer.nombre}</p>
              <p><span class="info-label">Email:</span> ${orderData.customer.email}</p>
              <p><span class="info-label">Teléfono:</span> ${orderData.customer.telefono}</p>
              <p><span class="info-label">Documento:</span> ${orderData.customer.documento}</p>
            </div>
            <div class="info-section">
              <h3>🚚 Dirección de Envío</h3>
              <p><span class="info-label">Ciudad:</span> ${orderData.shipping.ciudad}, ${orderData.shipping.departamento}</p>
              <p><span class="info-label">Dirección:</span> ${orderData.shipping.direccion}</p>
              <p><span class="info-label">Barrio:</span> ${orderData.shipping.barrio}</p>
              ${orderData.shipping.codigoPostal ? `<p><span class="info-label">Código Postal:</span> ${orderData.shipping.codigoPostal}</p>` : ''}
              ${orderData.shipping.notas ? `<p><span class="info-label">Notas:</span> ${orderData.shipping.notas}</p>` : ''}
            </div>
          </div>

          <!-- Order Items -->
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align: center;">Talla</th>
                <th style="text-align: center;">Cant.</th>
                <th style="text-align: right;">Precio Unit.</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${orderData.totals.subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div class="total-row">
              <span>Envío:</span>
              <span>${orderData.totals.shipping === 0 ? 'GRATIS' : '$' + orderData.totals.shipping.toLocaleString('es-CO')}</span>
            </div>
            <div class="total-row final">
              <span>TOTAL:</span>
              <span>$${orderData.totals.total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="info-section" style="margin-top: 30px;">
            <h3>💳 Método de Pago</h3>
            <p><span class="info-label">Método:</span> ${this.getPaymentMethodName(orderData.payment.metodo)}</p>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn btn-whatsapp" onclick="invoiceGenerator.shareViaWhatsApp()">
              📱 Compartir por WhatsApp
            </button>
            <button class="btn btn-print" onclick="window.print()">
              🖨️ Imprimir
            </button>
          </div>

          <!-- Footer -->
          <div class="invoice-footer">
            <p>Gracias por tu compra en Mundo Calzado</p>
            <p>www.mundocalzado.com | contacto@mundocalzado.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Obtiene el nombre del método de pago
   */
  getPaymentMethodName(metodo) {
    const metodos = {
      'tarjeta': 'Tarjeta de Crédito/Débito',
      'pse': 'PSE',
      'efectivo': 'Efectivo contra entrega',
      'nequi': 'Nequi',
      'daviplata': 'Daviplata'
    };
    return metodos[metodo] || metodo;
  }

  /**
   * Abre factura en nueva ventana
   */
  openInvoice(orderData) {
    const invoiceHTML = this.generateInvoiceHTML(orderData);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();
    
    // Guardar referencia a la ventana para usar en shareViaWhatsApp
    this.currentInvoiceWindow = newWindow;
    
    return newWindow;
  }

  /**
   * Genera mensaje de WhatsApp con resumen del pedido
   */
  generateWhatsAppMessage(orderData) {
    const items = orderData.items.map(item => 
      `• ${item.name} (Talla ${item.size}) x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}`
    ).join('%0A');

    const message = `*🛍️ PEDIDO - MUNDO CALZADO*%0A%0A` +
      `*Orden:* ${orderData.orderNumber}%0A` +
      `*Fecha:* ${new Date(orderData.fecha).toLocaleDateString('es-CO')}%0A%0A` +
      `*Cliente:* ${orderData.customer.nombre}%0A` +
      `*Teléfono:* ${orderData.customer.telefono}%0A%0A` +
      `*Productos:*%0A${items}%0A%0A` +
      `*Subtotal:* $${orderData.totals.subtotal.toLocaleString('es-CO')}%0A` +
      `*Envío:* ${orderData.totals.shipping === 0 ? 'GRATIS' : '$' + orderData.totals.shipping.toLocaleString('es-CO')}%0A` +
      `*TOTAL:* $${orderData.totals.total.toLocaleString('es-CO')}%0A%0A` +
      `*Dirección de envío:*%0A${orderData.shipping.direccion}, ${orderData.shipping.barrio}%0A` +
      `${orderData.shipping.ciudad}, ${orderData.shipping.departamento}%0A%0A` +
      `Gracias por tu compra! 🎉`;

    return message;
  }

  /**
   * Comparte factura por WhatsApp
   */
  shareViaWhatsApp(orderData = null) {
    // Si no se proporciona orderData, intentar obtenerlo del localStorage
    if (!orderData) {
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        orderData = JSON.parse(lastOrder);
      } else {
        alert('No se encontró información del pedido');
        return;
      }
    }

    const message = this.generateWhatsAppMessage(orderData);
    const whatsappURL = `https://wa.me/${this.whatsappNumber}?text=${message}`;
    
    window.open(whatsappURL, '_blank');
  }

  /**
   * Descarga factura como PDF (requiere librería externa)
   * Por ahora, solo imprime
   */
  downloadInvoice(orderData) {
    // TODO: Implementar descarga de PDF usando jsPDF o similar
    // Por ahora, abrir y usar la función de imprimir
    this.openInvoice(orderData);
    alert('Usa Ctrl+P o Cmd+P para guardar como PDF desde la ventana de impresión');
  }
}

// Crear instancia global
const invoiceGenerator = new InvoiceGenerator();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InvoiceGenerator;
}

window.invoiceGenerator = invoiceGenerator;
