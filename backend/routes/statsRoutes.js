const express = require('express');
const router = express.Router();
const { getDonorStats, getBeneficiaryStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/donor', protect, authorize('donor'), getDonorStats);
router.get('/beneficiary', protect, authorize('beneficiary'), getBeneficiaryStats);

module.exports = router;