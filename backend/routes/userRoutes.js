const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deactivateUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Any logged in user
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin only
router.get('/all', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id/deactivate', protect, authorize('admin'), deactivateUser);

module.exports = router;