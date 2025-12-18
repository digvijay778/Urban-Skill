const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const { updateUserValidator } = require('../validators/userValidator');
const validateRequest = require('../middlewares/validateRequest');
const upload = require('../middlewares/upload');

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.get('/profile', userController.getProfile);

router.patch(
  '/profile',
  upload.single('profileImage'),
  updateUserValidator,
  validateRequest,
  userController.updateProfile
);

router.delete('/profile', userController.deleteProfile);

router.get('/:id', userController.getUser);

router.get('/', userController.getAllUsers);

module.exports = router;
