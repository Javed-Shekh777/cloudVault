const router = require("express").Router();
const  { loginManual, registerManual }= require("../controller/authController");


router.route("/register").post(registerManual);
router.route("/login").post(loginManual);


module.exports = router;