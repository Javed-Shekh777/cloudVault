const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { getLockedStatus, setLocked, unlockLocked, changeLockedCredential, getLockedData ,exitLockedSession} = require("../controller/lockedController");


// Local registration & login
router.route("/status").get(requireAuth, getLockedStatus);
router.route("/setup").post(requireAuth, setLocked);
router.route("/unlock").post(requireAuth, unlockLocked);
router.route("/change-credential").post(requireAuth, changeLockedCredential);
router.route("/").get(requireAuth, getLockedData)
router.route("/exit").delete(requireAuth, exitLockedSession)



module.exports = router;

