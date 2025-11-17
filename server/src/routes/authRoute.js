const router = require("express").Router();
const  { loginManual, registerManual }= require("../controller/authController");


router.route("/localRegister").post(registerManual);
router.route("/localLogin").post(loginManual);


module.exports = router;