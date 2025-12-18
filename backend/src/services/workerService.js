const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const ApiError = require('../utils/ApiError');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createWorkerProfile = async (userId, profileData) => {
  // Check if worker profile already exists
  const existingProfile = await WorkerProfile.findOne({ userId });
  if (existingProfile) {
    throw new ApiError(400, 'Worker profile already exists');
  }

  const profile = new WorkerProfile({
    userId,
    ...profileData,
  });

  await profile.save();
  return profile;
};

const getWorkerProfile = async (userId) => {
  const profile = await WorkerProfile.findOne({ userId })
    .populate('userId')
    .populate('category')
    .populate('serviceCategories');

  if (!profile) {
    throw new ApiError(404, RESPONSE_MESSAGES.WORKER_NOT_FOUND);
  }

  return profile;
};

const getWorkerById = async (workerId) => {
  const profile = await WorkerProfile.findById(workerId)
    .populate('userId')
    .populate('category')
    .populate('serviceCategories');

  if (!profile) {
    throw new ApiError(404, RESPONSE_MESSAGES.WORKER_NOT_FOUND);
  }

  return profile;
};

const updateWorkerProfile = async (userId, updateData) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { userId },
    updateData,
    { new: true, runValidators: true }
  ).populate('userId').populate('category');

  if (!profile) {
    throw new ApiError(404, RESPONSE_MESSAGES.WORKER_NOT_FOUND);
  }

  // Sync profile picture to User model if it was updated
  if (updateData.profilePicture) {
    await User.findByIdAndUpdate(userId, {
      profileImage: updateData.profilePicture
    });
  }

  return profile;
};

const getAllWorkers = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  const query = {
    isVerified: true, // Only show verified workers
  };

  if (filters.serviceCategory) {
    query.serviceCategories = filters.serviceCategory;
  }

  if (filters.minRating) {
    query.averageRating = { $gte: filters.minRating };
  }

  if (filters.isAvailable !== undefined) {
    query.isAvailable = filters.isAvailable;
  }

  const workers = await WorkerProfile.find(query)
    .populate('userId')
    .populate('serviceCategories')
    .skip(skip)
    .limit(limit);

  const total = await WorkerProfile.countDocuments(query);

  return {
    workers,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createWorkerProfile,
  getWorkerProfile,
  getWorkerById,
  updateWorkerProfile,
  getAllWorkers,
};
