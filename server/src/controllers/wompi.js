/**
 * wompi.js - Controlador para integración con Wompi
 * Documentación: https://docs.wompi.co/
 */

const axios = require('axios');
const crypto = require('crypto');

const WOMPI_API_BASE = 'https://production.wompi.co/v1';
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET;

/**
 * Inicializa una transacción de pago
 */
async function initTransaction(req, res) {
  try {
    const {
      amount,
      currency = 'COP',
      reference,
      customerEmail,
      customerName,
      items = [],
      shippingAddress = {}
    } = req.body;

    // Validaciones
    if (!amount || !reference || !customerEmail) {
      return res.status(400).json({
        error: true,
        message: 'Faltan campos requeridos: amount, reference, customerEmail'
      });
    }

    // Generar firma de integridad
    const integritySignature = generateIntegritySignature(reference, amount, currency);

    // Preparar datos para Wompi
    const transactionData = {
      public_key: WOMPI_PUBLIC_KEY,
      amount_in_cents: amount * 100, // Wompi espera centavos
      currency: currency,
      reference: reference,
      customer_email: customerEmail,
      redirect_url: `${process.env.FRONTEND_URL}/mypageshoes/pages/checkout-success.html`,
      customer_data: {
        phone_number: shippingAddress.phone || '',
        full_name: customerName
      },
      shipping_address: {
        address_line_1: shippingAddress.address || '',
        city: shippingAddress.city || '',
        region: shippingAddress.department || '',
        country: 'CO',
        phone_number: shippingAddress.phone || ''
      }
    };

    // Crear transacción en Wompi
    const response = await axios.post(
      `${WOMPI_API_BASE}/transactions`,
      transactionData,
      {
        headers: {
          'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      transaction: response.data,
      paymentLink: response.data.data.payment_link_url,
      integritySignature: integritySignature
    });

  } catch (error) {
    console.error('Error en initTransaction:', error.response?.data || error.message);
    res.status(500).json({
      error: true,
      message: 'Error al inicializar la transacción',
      details: error.response?.data || error.message
    });
  }
}

/**
 * Maneja el webhook de Wompi
 */
async function handleWebhook(req, res) {
  try {
    const { event, data, sent_at } = req.body;

    // Verificar firma del webhook
    const signature = req.headers['x-wompi-signature'];
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({
        error: true,
        message: 'Firma de webhook inválida'
      });
    }

    console.log(`📥 Webhook recibido: ${event}`);
    console.log('Datos de transacción:', data.transaction);

    // Procesar según el evento
    switch (event) {
      case 'transaction.updated':
        await handleTransactionUpdate(data.transaction);
        break;
      
      default:
        console.log(`Evento no manejado: ${event}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Error en handleWebhook:', error);
    res.status(500).json({
      error: true,
      message: 'Error procesando webhook'
    });
  }
}

/**
 * Consulta el estado de una transacción
 */
async function getTransaction(req, res) {
  try {
    const { transactionId } = req.params;

    const response = await axios.get(
      `${WOMPI_API_BASE}/transactions/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`
        }
      }
    );

    res.json({
      success: true,
      transaction: response.data.data
    });

  } catch (error) {
    console.error('Error en getTransaction:', error);
    res.status(500).json({
      error: true,
      message: 'Error consultando transacción'
    });
  }
}

/**
 * Genera la firma de integridad para Wompi
 */
function generateIntegritySignature(reference, amount, currency) {
  const data = `${reference}${amount * 100}${currency}${WOMPI_EVENTS_SECRET}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Verifica la firma del webhook
 */
function verifyWebhookSignature(payload, signature) {
  if (!WOMPI_EVENTS_SECRET || !signature) {
    console.warn('⚠️ No se puede verificar firma: falta secret o signature');
    return true; // En desarrollo, permitir sin firma
  }

  const computedSignature = crypto
    .createHmac('sha256', WOMPI_EVENTS_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');

  return computedSignature === signature;
}

/**
 * Procesa actualizaciones de transacción
 */
async function handleTransactionUpdate(transaction) {
  const { id, status, reference, amount_in_cents, payment_method_type } = transaction;

  console.log(`📊 Transacción ${id} actualizada:`);
  console.log(`   - Estado: ${status}`);
  console.log(`   - Referencia: ${reference}`);
  console.log(`   - Monto: $${amount_in_cents / 100}`);
  console.log(`   - Método: ${payment_method_type}`);

  // Aquí puedes:
  // 1. Actualizar la orden en tu base de datos
  // 2. Enviar email de confirmación al cliente
  // 3. Iniciar proceso de envío si el pago fue APPROVED
  // 4. Liberar el stock si el pago fue DECLINED

  switch (status) {
    case 'APPROVED':
      console.log('✅ Pago aprobado - Procesar orden');
      // TODO: Actualizar orden, enviar confirmación
      break;
    
    case 'DECLINED':
      console.log('❌ Pago rechazado');
      // TODO: Notificar al cliente
      break;
    
    case 'VOIDED':
      console.log('⚠️ Pago anulado');
      // TODO: Reversar cambios
      break;
    
    default:
      console.log(`ℹ️ Estado: ${status}`);
  }
}

module.exports = {
  initTransaction,
  handleWebhook,
  getTransaction
};
