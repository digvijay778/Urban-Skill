const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const reviewService = require('../services/reviewService');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createReview = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const customerId = req.user.userId;
  const reviewData = req.body;

  const booking = await require('../models/Booking').findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const review = await reviewService.createReview(
    bookingId,
    customerId,
    booking.workerId,
    reviewData
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        review,
        RESPONSE_MESSAGES.REVIEW_CREATED_SUCCESS
      )
    );
});

const getWorkerReviews = asyncHandler(async (req, res) => {
  const { workerId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const result = await reviewService.getReviewsByWorker(
    workerId,
    parseInt(page),
    parseInt(limit)
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, 'Reviews fetched successfully'));
});

const getBookingReview = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const review = await reviewService.getReviewsByBooking(bookingId);

  res
    .status(200)
    .json(new ApiResponse(200, review, 'Review fetched successfully'));
});

const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const review = await reviewService.updateReview(id, updateData);

  res
    .status(200)
    .json(
      new ApiResponse(200, review, RESPONSE_MESSAGES.REVIEW_UPDATED_SUCCESS)
    );
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await reviewService.deleteReview(id);

  res
    .status(200)
    .json(
      new ApiResponse(200, review, RESPONSE_MESSAGES.REVIEW_DELETED_SUCCESS)
    );
});

module.exports = {
  createReview,
  getWorkerReviews,
  getBookingReview,
  updateReview,
  deleteReview,
};
