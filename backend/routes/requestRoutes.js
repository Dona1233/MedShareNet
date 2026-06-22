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

// Beneficiary routes
router.post('/', protect, authorize('beneficiary'), createRequest);
router.get('/my', protect, authorize('beneficiary'), getMyRequests);
router.delete('/:id', protect, authorize('beneficiary'), cancelRequest);

// Status tracking — any logged in user
router.get('/:id/status', protect, getRequestStatus);

// Admin route
router.get('/', protect, authorize('admin'), getAllRequests);

// Any logged in user
router.get('/:id', protect, getRequestById);

module.exports = router;