const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const bookingService = require('../services/bookingService');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createBooking = asyncHandler(async (req, res) => {
  const customerId = req.user.userId;
  const bookingData = req.body;

  const booking = await bookingService.createBooking(
    customerId,
    bookingData
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, booking, RESPONSE_MESSAGES.BOOKING_CREATED_SUCCESS)
    );
});

const getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await bookingService.getBookingById(id);

  res
    .status(200)
    .json(new ApiResponse(200, booking, 'Booking fetched successfully'));
});

const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { page = 1, limit = 10, role } = req.query;

  let result;
  if (role === 'WORKER') {
    result = await bookingService.getWorkerBookings(
      userId,
      parseInt(page),
      parseInt(limit)
    );
  } else {
    result = await bookingService.getCustomerBookings(
      userId,
      parseInt(page),
      parseInt(limit)
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, result, 'Bookings fetched successfully'));
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await bookingService.updateBookingStatus(id, status);

  res
    .status(200)
    .json(new ApiResponse(200, booking, 'Booking status updated successfully'));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;
  const userId = req.user.userId;

  const booking = await bookingService.cancelBooking(
    id,
    cancellationReason,
    req.user.role
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, booking, RESPONSE_MESSAGES.BOOKING_CANCELLED)
    );
});

module.exports = {
  createBooking,
  getBooking,
  getMyBookings,
  updateBookingStatus,
  cancelBooking,
};
