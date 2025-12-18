const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');
const { razorpayInstance } = require('../config/razorpay');
const ApiError = require('../utils/ApiError');
const { PAYMENT_STATUS } = require('../constants/paymentStatus');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');
const crypto = require('crypto');

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
    const payment = await Payment.findOne({ razorpayOrderId }).populate('workerId');
    if (!payment) {
      throw new ApiError(404, RESPONSE_MESSAGES.PAYMENT_NOT_FOUND);
    }

    // Verify Razorpay signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      payment.status = PAYMENT_STATUS.FAILED;
      await payment.save();
      throw new ApiError(400, 'Invalid payment signature');
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

    // Credit worker wallet
    const workerProfile = await WorkerProfile.findOne({ userId: payment.workerId });
    if (workerProfile) {
      workerProfile.wallet.balance += payment.amount;
      workerProfile.wallet.transactions.push({
        amount: payment.amount,
        type: 'CREDIT',
        description: `Payment received for booking ${payment.bookingId}`,
        paymentId: payment._id,
        bookingId: payment.bookingId,
        date: new Date(),
        status: 'COMPLETED',
      });
      await workerProfile.save();
    }

    return payment;
  } catch (error) {
    if (error instanceof ApiError) throw error;
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
