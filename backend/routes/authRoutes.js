const express = require('express');
const router = express.Router();
const { register, login, getMe, verifyInstitution } = require('../controllers/authController');
const { protect, authorize} = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/verify-institution/:id', protect, authorize('admin'), verifyInstitution);

module.exports = router;