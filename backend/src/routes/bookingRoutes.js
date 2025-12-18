const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/auth');
const {
  createBookingValidator,
  updateBookingStatusValidator,
} = require('../validators/bookingValidator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Protected routes
router.use(authMiddleware);

// Create booking
router.post(
  '/',
  createBookingValidator,
  validateRequest,
  bookingController.createBooking
);

// Get my bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Get specific booking
router.get('/:id', bookingController.getBooking);

// Update booking status
router.patch(
  '/:id/status',
  updateBookingStatusValidator,
  validateRequest,
  bookingController.updateBookingStatus
);

// Cancel booking
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
