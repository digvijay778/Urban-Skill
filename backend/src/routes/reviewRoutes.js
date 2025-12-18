const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/auth');
const { createReviewValidator } = require('../validators/reviewValidator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Create review
router.post(
  '/:bookingId',
  authMiddleware,
  createReviewValidator,
  validateRequest,
  reviewController.createReview
);

// Get worker reviews
router.get('/worker/:workerId', reviewController.getWorkerReviews);

// Get booking review
router.get('/booking/:bookingId', reviewController.getBookingReview);

// Update review
router.patch(
  '/:id',
  authMiddleware,
  reviewController.updateReview
);

// Delete review
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
