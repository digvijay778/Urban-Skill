const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');
const { RESPONSE_MESSAGES } = require('../constants/responseMessages');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  const result = await authService.register({
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, result, RESPONSE_MESSAGES.AUTH_REGISTER_SUCCESS)
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res
    .status(200)
    .json(new ApiResponse(200, result, RESPONSE_MESSAGES.AUTH_LOGIN_SUCCESS));
});

const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, {}, RESPONSE_MESSAGES.AUTH_LOGOUT_SUCCESS));
});

const refreshToken = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const result = await authService.refreshToken(userId);

  res
    .status(200)
    .json(new ApiResponse(200, result, RESPONSE_MESSAGES.AUTH_TOKEN_REFRESHED));
});

const registerWorker = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    category,
    experience,
    hourlyRate,
    bio,
    location,
    skills,
    previousCompany,
    previousRole,
    yearsOfExperience,
    certifications,
  } = req.body;

  // Upload files to Cloudinary
  const { uploadFile } = require('../utils/cloudinaryHelper');
  const uploads = {};
  
  try {
    if (req.files?.profilePicture?.[0]) {
      const uploaded = await uploadFile(
        req.files.profilePicture[0],
        'workers/profiles'
      );
      uploads.profilePicture = uploaded;
    }
    
    if (req.files?.aadharCard?.[0]) {
      const uploaded = await uploadFile(
        req.files.aadharCard[0],
        'workers/documents'
      );
      uploads.aadharCard = uploaded;
    }
    
    if (req.files?.idProof?.[0]) {
      const uploaded = await uploadFile(
        req.files.idProof[0],
        'workers/documents'
      );
      uploads.idProof = uploaded;
    }
  } catch (uploadError) {
    console.error('File upload error during worker registration:', uploadError.message);
    // Continue without files if Cloudinary fails
  }

  const workerData = {
    firstName,
    lastName,
    email,
    password,
    phone,
    role: 'WORKER',
    workerProfile: {
      category,
      experience: parseInt(experience),
      hourlyRate: parseFloat(hourlyRate),
      bio,
      location,
      skills: skills.split(',').map(s => s.trim()),
      profilePicture: uploads.profilePicture?.url,
      documents: {
        aadharCard: uploads.aadharCard?.url,
        idProof: uploads.idProof?.url,
      },
      experienceDetails: {
        previousCompany,
        previousRole,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
        certifications: certifications ? certifications.split(',').map(c => c.trim()) : [],
      },
    },
  };

  const result = await authService.registerWorker(workerData);

  res
    .status(201)
    .json(
      new ApiResponse(201, result, 'Worker registration submitted successfully. Your profile is under review.')
    );
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  registerWorker,
};
