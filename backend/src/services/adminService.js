const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalWorkers = await User.countDocuments({ role: 'WORKER' });
  const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
  const totalBookings = await Booking.countDocuments();
  const completedBookings = await Booking.countDocuments({
    status: 'COMPLETED',
  });
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'SUCCESS' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return {
    totalUsers,
    totalWorkers,
    totalCustomers,
    totalBookings,
    completedBookings,
    totalRevenue: totalRevenue[0]?.total || 0,
  };
};

const getUserAnalytics = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'WORKER') {
    const completedBookings = await Booking.countDocuments({
      workerId: userId,
      status: 'COMPLETED',
    });

    const reviews = await Review.find({ workerId: userId });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const totalEarnings = await Payment.aggregate([
      {
        $match: {
          workerId: userId,
          status: 'SUCCESS',
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      completedBookings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalEarnings: totalEarnings[0]?.total || 0,
      reviewCount: reviews.length,
    };
  } else if (user.role === 'CUSTOMER') {
    const totalBookings = await Booking.countDocuments({ customerId: userId });
    const completedBookings = await Booking.countDocuments({
      customerId: userId,
      status: 'COMPLETED',
    });

    const totalSpent = await Payment.aggregate([
      {
        $match: {
          customerId: userId,
          status: 'SUCCESS',
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      totalBookings,
      completedBookings,
      totalSpent: totalSpent[0]?.total || 0,
    };
  }
};

module.exports = {
  getDashboardStats,
  getUserAnalytics,
};
