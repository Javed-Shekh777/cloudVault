const upload = require('../config/multerconfig');
const { getAllFiles, uploadFilesHandler, deleteFile, downloadFile, getStarredFiles, addRemoveStarred,toggleTrashStatus } = require('../controller/FileController');

const router = require('express').Router();


router.route("/upload").post(upload.array('files', 10), uploadFilesHandler)
router.route("/").get(getAllFiles);
router.route("/stared-files").get(getStarredFiles);
router.route("/delete/:id").delete(deleteFile);
router.route("/download/:id").get(downloadFile);
router.route("/add-remove-star/:id").patch(addRemoveStarred);
router.route("/add-remove-trash/:id").patch(toggleTrashStatus);






module.exports = router;