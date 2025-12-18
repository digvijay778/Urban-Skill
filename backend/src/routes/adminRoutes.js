const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

const router = express.Router();

// Protected routes - Admin only
router.use(authMiddleware, roleCheck('ADMIN'));

// Get dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// Get user analytics
router.get('/analytics/:userId', adminController.getUserAnalytics);

// Worker verification management
router.get('/workers/pending', adminController.getPendingWorkers);
router.patch('/workers/:id/verify', adminController.verifyWorker);

module.exports = router;
