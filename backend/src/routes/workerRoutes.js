const express = require('express');
const workerController = require('../controllers/workerController');
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const upload = require('../middlewares/upload');
const { updateWorkerProfileValidator } = require('../validators/userValidator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Get all service categories (public route)
router.get('/categories', workerController.getCategories);

// Get all workers (must be before /:id route)
router.get('/', workerController.getAllWorkers);

// Get current worker's own profile
router.get('/profile', authMiddleware, roleCheck('WORKER'), workerController.getOwnProfile);

// Create worker profile
router.post(
  '/profile',
  authMiddleware,
  roleCheck('WORKER'),
  updateWorkerProfileValidator,
  validateRequest,
  workerController.createProfile
);

// Update worker profile
router.patch(
  '/profile',
  authMiddleware,
  roleCheck('WORKER'),
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'aadharCard', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
  ]),
  workerController.updateProfile
);

// Get worker profile by ID (must be after specific routes)
router.get('/:id', workerController.getProfile);

module.exports = router;
