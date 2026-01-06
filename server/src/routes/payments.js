/**
 * payments.js - Rutas de pagos
 * Endpoints para integración con Wompi
 */

const express = require('express');
const router = express.Router();
const wompiController = require('../controllers/wompi');

/**
 * POST /api/payments/wompi/init
 * Inicializa una transacción de pago con Wompi
 * 
 * Body esperado:
 * {
 *   amount: number,           // Monto en centavos (ej: 50000 para $500)
 *   currency: string,         // "COP"
 *   reference: string,        // ID único de la orden
 *   customerEmail: string,    // Email del cliente
 *   customerName: string,     // Nombre del cliente
 *   items: Array,            // Items de la compra
 *   shippingAddress: Object  // Dirección de envío
 * }
 */
router.post('/wompi/init', wompiController.initTransaction);

/**
 * POST /api/payments/wompi/webhook
 * Webhook para recibir notificaciones de cambios de estado de transacciones
 * 
 * Wompi enviará:
 * {
 *   event: string,
 *   data: {
 *     transaction: Object
 *   },
 *   sent_at: string
 * }
 */
router.post('/wompi/webhook', wompiController.handleWebhook);

/**
 * GET /api/payments/wompi/transaction/:transactionId
 * Consulta el estado de una transacción
 */
router.get('/wompi/transaction/:transactionId', wompiController.getTransaction);

module.exports = router;
