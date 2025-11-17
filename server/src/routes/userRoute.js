const upload = require('../config/multerconfig');
const { updateProfile } = require('../controller/userController');
const authenticated = require("../middleware/authMiddleware");
const router = require('express').Router();


router.route("/update-profile").post(authenticated,upload.single('profileImage'),updateProfile)
 






module.exports = router;