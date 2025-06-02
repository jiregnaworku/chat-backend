const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// Get user profile
router.get('/profile', auth, profileController.getProfile);

// Update user profile
router.put('/profile', auth, profileController.updateProfile);

// Upload profile image
router.post('/profile/image', auth, profileController.uploadProfileImage);

module.exports = router; 