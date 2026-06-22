const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAllResourcesAdmin,
  approveResource,
  rejectResource,
} = require('../controllers/resourceController');
const {
  getAllRequests,
  approveRequest,
  rejectRequest,
} = require('../controllers/requestController');
const { getAdminStats } = require('../controllers/statsController');

// All admin routes protected
router.use(protect, authorize('admin'));

// Stats
router.get('/stats', getAdminStats);

// Resource management
router.get('/resources', getAllResourcesAdmin);
router.put('/resources/:id/approve', approveResource);
router.put('/resources/:id/reject', rejectResource);

// Request management
router.get('/requests', getAllRequests);
router.put('/requests/:id/approve', approveRequest);
router.put('/requests/:id/reject', rejectRequest);

module.exports = router;