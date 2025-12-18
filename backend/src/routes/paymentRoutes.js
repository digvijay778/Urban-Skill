const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Create payment order
router.post('/create-order', authMiddleware, paymentController.createOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Webhook endpoint
router.post('/webhook', paymentController.webhookPayment);

// Get payment
router.get('/:id', authMiddleware, paymentController.getPayment);

// Refund payment
router.post('/:id/refund', authMiddleware, paymentController.refundPayment);

module.exports = router;
