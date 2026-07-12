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
router.get('/my', protect, authorize('donor', 'institution'), getMyResources);
router.get('/:id', protect, getResourceById);

// In resourceRoutes.js update this line:
router.post('/', protect, authorize('donor', 'institution'), createResource);

router.put('/:id', protect, authorize('donor', 'institution'), updateResource);
router.delete('/:id', protect, authorize('donor', 'institution'), deleteResource);

module.exports = router;