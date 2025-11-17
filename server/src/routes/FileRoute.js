const upload = require('../config/multerconfig');
const { getAllFiles, uploadFilesHandler, deleteFile, downloadFile, getStarredFiles, addRemoveStarred, toggleTrashStatus } = require('../controller/FileController');
const authenticated = require("../middleware/authMiddleware");
const router = require('express').Router();


router.route("/upload").post(authenticated,upload.array('files', 10), uploadFilesHandler)
router.route("/").get(authenticated, getAllFiles);
router.route("/stared-files").get(authenticated, getStarredFiles);
router.route("/delete/:id").delete(authenticated, deleteFile);
router.route("/download/:id").get(authenticated, downloadFile);
router.route("/add-remove-star/:id").patch(authenticated, addRemoveStarred);
router.route("/add-remove-trash/:id").patch(authenticated, toggleTrashStatus);






module.exports = router;