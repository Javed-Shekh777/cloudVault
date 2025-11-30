const upload = require('../config/multerconfig');
const { updateProfile } = require('../controller/userController');
const { requireAuth } = require("../middleware/auth");
const router = require('express').Router();

// Update profile with single profile image
router.patch("/update-profile", requireAuth, upload.single('profileImage'), updateProfile);

module.exports = router;
