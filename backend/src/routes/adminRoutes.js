const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

// Protected routes - Admin only
router.use(authMiddleware, roleCheck('ADMIN'));

// Get dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Get user analytics
router.get('/analytics/:userId', adminController.getUserAnalytics);

// Worker verification management
router.get('/workers/pending', adminController.getPendingWorkers);
router.patch('/workers/:id/verify', adminController.verifyWorker);

// Get all bookings (admin only)
router.get('/bookings', asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('customerId', 'firstName lastName email')
    .populate('workerId', 'firstName lastName email')
    .populate('serviceCategory', 'name')
    .sort({ createdAt: -1 });
  
  res.status(200).json(new ApiResponse(200, { bookings }, 'Bookings fetched successfully'));
}));

// Get all payments (admin only)
router.get('/payments', asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('customerId', 'firstName lastName email')
    .populate('workerId', 'firstName lastName email')
    .populate('bookingId', 'serviceTitle scheduledDate totalAmount')
    .sort({ createdAt: -1 });
  
  // Calculate payment statistics
  const stats = {
    totalPayments: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + (p.status === 'SUCCESS' ? p.amount : 0), 0),
    successfulPayments: payments.filter(p => p.status === 'SUCCESS').length,
    pendingPayments: payments.filter(p => p.status === 'PENDING').length,
    failedPayments: payments.filter(p => p.status === 'FAILED').length,
  };
  
  res.status(200).json(new ApiResponse(200, { payments, stats }, 'Payments fetched successfully'));
}));

module.exports = router;
