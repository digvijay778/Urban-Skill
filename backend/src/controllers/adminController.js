const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const adminService = require('../services/adminService');
const WorkerProfile = require('../models/WorkerProfile');

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();

  res
    .status(200)
    .json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
});

const getUserAnalytics = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const analytics = await adminService.getUserAnalytics(userId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analytics,
        'User analytics fetched successfully'
      )
    );
});

const getPendingWorkers = asyncHandler(async (req, res) => {
  const workers = await WorkerProfile.find()
    .populate('userId')
    .populate('category')
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, workers, 'Workers fetched successfully'));
});

const verifyWorker = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isVerified, verificationStatus } = req.body;

  const worker = await WorkerProfile.findByIdAndUpdate(
    id,
    { 
      isVerified,
      verificationStatus,
    },
    { new: true }
  );

  if (!worker) {
    throw new Error('Worker not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, worker, 'Worker verification status updated'));
});

module.exports = {
  getDashboardStats,
  getUserAnalytics,
  getPendingWorkers,
  verifyWorker,
};
