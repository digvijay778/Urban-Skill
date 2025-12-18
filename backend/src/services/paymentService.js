const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { razorpayInstance } = require('../config/razorpay');
const ApiError = require('../utils/ApiError');
const { PAYMENT_STATUS } = require('../constants/paymentStatus');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createOrder = async (bookingId, customerId, workerId, amount) => {
  try {
    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId,
        customerId,
        workerId,
      },
    });

    // Create payment record
    const payment = new Payment({
      bookingId,
      customerId,
      workerId,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: PAYMENT_STATUS.PENDING,
    });

    await payment.save();

    return {
      payment,
      razorpayOrder,
    };
  } catch (error) {
    throw new ApiError(500, 'Failed to create payment order');
  }
};

const verifyPayment = async (paymentData) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentData;

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      throw new ApiError(404, RESPONSE_MESSAGES.PAYMENT_NOT_FOUND);
    }

    // Update payment with verification details
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = PAYMENT_STATUS.SUCCESS;
    payment.transactionId = razorpayPaymentId;

    await payment.save();

    // Update booking payment reference
    await Booking.findByIdAndUpdate(payment.bookingId, {
      paymentId: payment._id,
    });

    return payment;
  } catch (error) {
    throw new ApiError(400, 'Payment verification failed');
  }
};

const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, RESPONSE_MESSAGES.PAYMENT_NOT_FOUND);
  }
  return payment;
};

const refundPayment = async (paymentId, refundAmount, refundReason) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, RESPONSE_MESSAGES.PAYMENT_NOT_FOUND);
  }

  try {
    // Create refund in Razorpay
    const refund = await razorpayInstance.payments.refund(
      payment.razorpayPaymentId,
      {
        amount: Math.round(refundAmount * 100),
        notes: { reason: refundReason },
      }
    );

    // Update payment record
    payment.refundAmount = refundAmount;
    payment.refundReason = refundReason;
    payment.refundDate = new Date();
    payment.status =
      refundAmount < payment.amount
        ? PAYMENT_STATUS.PARTIAL_REFUND
        : PAYMENT_STATUS.REFUNDED;

    await payment.save();

    return payment;
  } catch (error) {
    throw new ApiError(500, 'Refund failed');
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentById,
  refundPayment,
};
