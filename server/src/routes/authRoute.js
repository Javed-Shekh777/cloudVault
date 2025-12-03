const router = require("express").Router();
const { loginManual, registerManual, refreshTokenHandler, logoutHandler,verifyAuthMail ,getMe} = require("../controller/authController");
const {requireAuth } = require("../middleware/auth");


// Local registration & login
router.route("/localRegister").post(registerManual);
router.route("/localLogin").post(loginManual);
router.route("/refresh").post(refreshTokenHandler);
router.route("/logout").post(logoutHandler);
router.route("/verifyMail").post(verifyAuthMail);
router.route("/me").get(requireAuth,getMe);





module.exports = router;
