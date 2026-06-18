const express = require('express');
const router = express.Router();
const {
  createResource,
  getMyResources,
  updateResource,
  deleteResource,
  getAllResources,
  getResourceById,
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public to all logged in users
router.get('/', protect, getAllResources);
router.get('/my', protect, authorize('donor'), getMyResources);
router.get('/:id', protect, getResourceById);

// Donor only
router.post('/', protect, authorize('donor'), createResource);
router.put('/:id', protect, authorize('donor'), updateResource);
router.delete('/:id', protect, authorize('donor'), deleteResource);

module.exports = router;