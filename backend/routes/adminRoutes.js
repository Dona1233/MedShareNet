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
} = require('../controllers/requestController');

// All admin routes protected
router.use(protect, authorize('admin'));

// Resource management
router.get('/resources', getAllResourcesAdmin);
router.get('/resources/pending', async (req, res) => {
  req.query.status = 'pending';
  getAllResourcesAdmin(req, res);
});
router.put('/resources/:id/approve', approveResource);
router.put('/resources/:id/reject', rejectResource);

// Request management (ready for Day 8)
router.get('/requests', getAllRequests);

module.exports = router;