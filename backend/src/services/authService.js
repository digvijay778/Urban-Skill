const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const { generateToken } = require('../utils/tokenManager');
const { comparePassword } = require('../utils/passwordHelper');
const ApiError = require('../utils/ApiError');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');

const register = async (userData) => {
  const { email, firstName, lastName, phone, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, RESPONSE_MESSAGES.USER_ALREADY_EXISTS);
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    user: user.toJSON(),
    token,
  };
};

const login = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, RESPONSE_MESSAGES.AUTH_INVALID_CREDENTIALS);
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, RESPONSE_MESSAGES.AUTH_INVALID_CREDENTIALS);
  }

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    user: user.toJSON(),
    token,
  };
};

const refreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, RESPONSE_MESSAGES.AUTH_UNAUTHORIZED);
  }

  const token = generateToken(user._id, user.role);
  return { token };
};

const registerWorker = async (workerData) => {
  const { email, workerProfile } = workerData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, RESPONSE_MESSAGES.USER_ALREADY_EXISTS);
  }

  // Create new user
  const user = new User({
    firstName: workerData.firstName,
    lastName: workerData.lastName,
    email: workerData.email,
    phone: workerData.phone,
    password: workerData.password,
    role: 'WORKER',
  });

  await user.save();

  // Create worker profile
  const profile = new WorkerProfile({
    userId: user._id,
    category: workerProfile.category,
    serviceCategories: [workerProfile.category],
    experience: workerProfile.experience,
    hourlyRate: workerProfile.hourlyRate,
    bio: workerProfile.bio,
    location: workerProfile.location,
    skills: workerProfile.skills,
    profilePicture: workerProfile.profilePicture,
    documents: workerProfile.documents,
    experienceDetails: workerProfile.experienceDetails,
    isVerified: false, // Will be verified by admin
  });

  await profile.save();

  // Generate token
  const token = generateToken(user._id, user.role);

  return {
    user: user.toJSON(),
    token,
    message: 'Your profile has been submitted and is pending verification',
  };
};

module.exports = {
  register,
  login,
  refreshToken,
  registerWorker,
};
