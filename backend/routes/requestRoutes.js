const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest,
  getAllRequests,
  getRequestStatus,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// In requestRoutes.js update this line:
router.post('/', protect, authorize('beneficiary', 'institution'), createRequest);
router.get('/my', protect, authorize('beneficiary', 'institution'), getMyRequests);
router.delete('/:id', protect, authorize('beneficiary', 'institution'), cancelRequest);
// Status tracking — any logged in user
router.get('/:id/status', protect, getRequestStatus);

// Admin route
router.get('/', protect, authorize('admin'), getAllRequests);

// Any logged in user
router.get('/:id', protect, getRequestById);

module.exports = router;