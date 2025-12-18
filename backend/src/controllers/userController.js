const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/userService');
const { uploadFile, deleteFile } = require('../utils/cloudinaryHelper');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const user = await userService.getUserById(userId);

  res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const updateData = req.body;

  // Handle profile image upload if file is present
  if (req.file) {
    const uploadResult = await uploadFile(req.file, 'user-profiles');
    updateData.profileImage = uploadResult.url;
  }

  const user = await userService.updateUser(userId, updateData);

  res
    .status(200)
    .json(new ApiResponse(200, user, RESPONSE_MESSAGES.USER_UPDATED_SUCCESS));
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const user = await userService.deleteUser(userId);

  res
    .status(200)
    .json(new ApiResponse(200, user, RESPONSE_MESSAGES.USER_DELETED_SUCCESS));
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await userService.getAllUsers(parseInt(page), parseInt(limit));

  res
    .status(200)
    .json(new ApiResponse(200, result, 'Users fetched successfully'));
});

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getUser,
  getAllUsers,
};
