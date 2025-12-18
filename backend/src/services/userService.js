const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, RESPONSE_MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const users = await User.find()
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, RESPONSE_MESSAGES.USER_NOT_FOUND);
  }

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, RESPONSE_MESSAGES.USER_NOT_FOUND);
  }
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

module.exports = {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
};
