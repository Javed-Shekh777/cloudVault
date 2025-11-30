const router = require("express").Router();
const { loginManual, registerManual, refreshTokenHandler, logoutHandler,verifyAuthMail } = require("../controller/authController");

// Local registration & login
router.route("/localRegister").post(registerManual);
router.route("/localLogin").post(loginManual);
router.route("/refresh").post(refreshTokenHandler);
router.route("/logout").post(logoutHandler);
router.route("/verifyMail").post(verifyAuthMail);




module.exports = router;
