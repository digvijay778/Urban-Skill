const express = require('express');
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validateRequest = require('../middlewares/validateRequest');
const { authLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  registerValidator,
  validateRequest,
  authController.register
);

router.post(
  '/register/worker',
  authLimiter,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'aadharCard', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
  ]),
  authController.registerWorker
);

router.post(
  '/login',
  authLimiter,
  loginValidator,
  validateRequest,
  authController.login
);

router.post('/logout', authController.logout);

router.post('/refresh-token', authController.refreshToken);

module.exports = router;
