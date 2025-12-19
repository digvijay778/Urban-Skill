const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const workerService = require('../services/workerService');
const ServiceCategory = require('../models/ServiceCategory');
const { uploadFile, uploadMultipleFiles, deleteFile } = require('../utils/cloudinaryHelper');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const createProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const profileData = req.body;

  const profile = await workerService.createWorkerProfile(
    userId,
    profileData
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        profile,
        RESPONSE_MESSAGES.WORKER_PROFILE_CREATED
      )
    );
});

const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Try to get by worker profile ID first, fallback to userId
  let profile;
  try {
    profile = await workerService.getWorkerById(id);
  } catch (error) {
    // If not found by profile ID, try userId
    profile = await workerService.getWorkerProfile(id);
  }

  res
    .status(200)
    .json(new ApiResponse(200, profile, 'Profile fetched successfully'));
});

const getOwnProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const profile = await workerService.getWorkerProfile(userId);

  res
    .status(200)
    .json(new ApiResponse(200, profile, 'Profile fetched successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const updateData = { ...req.body };

  // Handle file uploads
  const { uploadFile } = require('../utils/cloudinaryHelper');
  
  try {
    if (req.files?.profilePicture?.[0]) {
      const uploaded = await uploadFile(
        req.files.profilePicture[0],
        'workers/profiles'
      );
      updateData.profilePicture = uploaded.url;
    }
    
    if (req.files?.aadharCard?.[0]) {
      const uploaded = await uploadFile(
        req.files.aadharCard[0],
        'workers/documents'
      );
      updateData['documents.aadharCard'] = uploaded.url;
    }
    
    if (req.files?.idProof?.[0]) {
      const uploaded = await uploadFile(
        req.files.idProof[0],
        'workers/documents'
      );
      updateData['documents.idProof'] = uploaded.url;
    }
  } catch (uploadError) {
    console.error('File upload error:', uploadError.message);
    // Continue without uploading files if Cloudinary fails
  }

  // Convert skills string to array
  if (updateData.skills && typeof updateData.skills === 'string') {
    updateData.skills = updateData.skills.split(',').map(s => s.trim());
  }

  // Parse location JSON if it's a string
  if (updateData.location && typeof updateData.location === 'string') {
    try {
      updateData.location = JSON.parse(updateData.location);
    } catch (error) {
      // If parsing fails, treat it as locationText for backward compatibility
      updateData.locationText = updateData.location;
      delete updateData.location;
    }
  }

  const profile = await workerService.updateWorkerProfile(
    userId,
    updateData
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        profile,
        RESPONSE_MESSAGES.WORKER_PROFILE_UPDATED
      )
    );
});

const getAllWorkers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, serviceCategory, minRating, isAvailable } =
    req.query;

  const filters = {};
  if (serviceCategory) filters.serviceCategory = serviceCategory;
  if (minRating) filters.minRating = parseFloat(minRating);
  if (isAvailable !== undefined)
    filters.isAvailable = isAvailable === 'true';

  const result = await workerService.getAllWorkers(
    parseInt(page),
    parseInt(limit),
    filters
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, 'Workers fetched successfully'));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await ServiceCategory.find()
    .select('name description icon')
    .sort({ name: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

module.exports = {
  createProfile,
  getProfile,
  getOwnProfile,
  updateProfile,
  getAllWorkers,
  getCategories,
};
