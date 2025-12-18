const Review = require('../models/Review');
const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');
const ApiError = require('../utils/ApiError');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createReview = async (bookingId, customerId, workerId, reviewData) => {
  // Check if review already exists
  const existingReview = await Review.findOne({ bookingId });
  if (existingReview) {
    throw new ApiError(400, 'Review already exists for this booking');
  }

  const review = new Review({
    bookingId,
    customerId,
    workerId,
    ...reviewData,
  });

  await review.save();

  // Update worker's average rating
  await updateWorkerRating(workerId);

  return review.populate(['customerId', 'workerId']);
};

const updateWorkerRating = async (workerId) => {
  const reviews = await Review.find({ workerId });

  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await WorkerProfile.updateOne(
    { userId: workerId },
    {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    }
  );
};

const getReviewsByWorker = async (workerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const reviews = await Review.find({ workerId })
    .populate(['customerId', 'bookingId'])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ workerId });

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getReviewsByBooking = async (bookingId) => {
  const review = await Review.findOne({ bookingId })
    .populate(['customerId', 'workerId']);

  return review;
};

const updateReview = async (reviewId, updateData) => {
  const review = await Review.findByIdAndUpdate(reviewId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Update worker's average rating
  await updateWorkerRating(review.workerId);

  return review;
};

const deleteReview = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Update worker's average rating
  await updateWorkerRating(review.workerId);

  return review;
};

module.exports = {
  createReview,
  getReviewsByWorker,
  getReviewsByBooking,
  updateReview,
  deleteReview,
};
