const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { body } = require('express-validator');

const router = express.Router();

// AI Booking Assistant routes
router.post(
  '/process-request',
  authMiddleware,
  [
    body('message')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Please describe your problem in detail (at least 10 characters)'),
    body('location')
      .optional()
      .trim(),
  ],
  validateRequest,
  aiController.processBookingRequest
);

router.post(
  '/create-booking',
  authMiddleware,
  [
    body('workerId')
      .notEmpty()
      .withMessage('Worker ID is required'),
    body('bookingDetails')
      .notEmpty()
      .withMessage('Booking details are required'),
    body('scheduledDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
  ],
  validateRequest,
  aiController.createAIBooking
);

module.exports = router;
