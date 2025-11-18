const upload = require('../config/multerconfig');
const { createFolder, getFolder, moveToFolder ,getFolders} = require('../controller/folderController');
const authenticated = require("../middleware/authMiddleware");
const router = require('express').Router();



router.route("/create-folder").post(authenticated, createFolder);
router.route("/get-folder/:id").get(authenticated, getFolder);
router.route("/get-folders").get(authenticated,getFolders);

router.route("/:folderId/add-file/:fileId").patch(authenticated, moveToFolder);




module.exports = router;