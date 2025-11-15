const upload = require('../config/multerconfig');
const { getAllFiles, uploadFilesHandler, deleteFile, downloadFile } = require('../controller/FileController');

const router = require('express').Router();


router.route("/upload").post(upload.array('files', 10), uploadFilesHandler)
router.route("/").get(getAllFiles);
router.route("/delete/:id").delete(deleteFile);
router.route("/download/:id").get(downloadFile);



module.exports = router;