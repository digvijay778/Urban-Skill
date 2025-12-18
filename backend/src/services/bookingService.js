const Booking = require('../models/Booking');
const ServiceCategory = require('../models/ServiceCategory');
const WorkerProfile = require('../models/WorkerProfile');
const ApiError = require('../utils/ApiError');
const { BOOKING_STATUS } = require('../constants/bookingStatus');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createBooking = async (customerId, bookingData) => {
  // If workerId is a WorkerProfile ID, get the actual userId
  let workerUserId = bookingData.workerId;
  
  // Check if it's a WorkerProfile by trying to find it
  const workerProfile = await WorkerProfile.findById(bookingData.workerId);
  if (workerProfile) {
    workerUserId = workerProfile.userId;
  }

  const booking = new Booking({
    customerId,
    ...bookingData,
    workerId: workerUserId,
    status: BOOKING_STATUS.PENDING,
  });

  await booking.save();
  return booking.populate(['customerId', 'workerId', 'serviceCategory']);
};

const getBookingById = async (bookingId) => {
  const booking = await Booking.findById(bookingId).populate([
    'customerId',
    'workerId',
    'serviceCategory',
  ]);

  if (!booking) {
    throw new ApiError(404, RESPONSE_MESSAGES.BOOKING_NOT_FOUND);
  }

  return booking;
};

const getCustomerBookings = async (customerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const bookings = await Booking.find({ customerId })
    .populate(['workerId', 'serviceCategory'])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments({ customerId });

  return {
    bookings,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getWorkerBookings = async (workerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const bookings = await Booking.find({ workerId })
    .populate(['customerId', 'serviceCategory'])
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments({ workerId });

  return {
    bookings,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const updateBookingStatus = async (bookingId, newStatus) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: newStatus },
    { new: true, runValidators: true }
  );

  if (!booking) {
    throw new ApiError(404, RESPONSE_MESSAGES.BOOKING_NOT_FOUND);
  }

  return booking;
};

const cancelBooking = async (bookingId, cancellationReason, cancelledBy) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: BOOKING_STATUS.CANCELLED,
      cancellationReason,
      cancelledBy,
    },
    { new: true }
  );

  if (!booking) {
    throw new ApiError(404, RESPONSE_MESSAGES.BOOKING_NOT_FOUND);
  }

  return booking;
};

module.exports = {
  createBooking,
  getBookingById,
  getCustomerBookings,
  getWorkerBookings,
  updateBookingStatus,
  cancelBooking,
};
