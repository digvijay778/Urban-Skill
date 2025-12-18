const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const paymentService = require('../services/paymentService');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createOrder = asyncHandler(async (req, res) => {
  const { bookingId, amount } = req.body;
  const customerId = req.user.userId;

  const booking = await require('../models/Booking').findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const result = await paymentService.createOrder(
    bookingId,
    customerId,
    booking.workerId,
    amount
  );

  res
    .status(201)
    .json(new ApiResponse(201, result, 'Payment order created successfully'));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const paymentData = req.body;

  const payment = await paymentService.verifyPayment(paymentData);

  res
    .status(200)
    .json(new ApiResponse(200, payment, RESPONSE_MESSAGES.PAYMENT_SUCCESS));
});

const getPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await paymentService.getPaymentById(id);

  res
    .status(200)
    .json(new ApiResponse(200, payment, 'Payment fetched successfully'));
});

const refundPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { refundAmount, refundReason } = req.body;

  const payment = await paymentService.refundPayment(
    id,
    refundAmount,
    refundReason
  );

  res
    .status(200)
    .json(new ApiResponse(200, payment, 'Refund processed successfully'));
});

const webhookPayment = asyncHandler(async (req, res) => {
  const paymentData = req.body;

  // Verify webhook signature from Razorpay
  // Process the webhook
  const payment = await paymentService.verifyPayment(paymentData);

  res
    .status(200)
    .json(new ApiResponse(200, payment, 'Webhook processed successfully'));
});

module.exports = {
  createOrder,
  verifyPayment,
  getPayment,
  refundPayment,
  webhookPayment,
};
