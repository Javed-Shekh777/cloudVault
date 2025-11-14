const upload = require('../config/multerconfig');
const { getAllFiles, uploadFile, deleteFile, downloadFile } = require('../controller/FileController');

const router = require('express').Router();


router.route("/upload").post(upload.single('file'), uploadFile)
router.route("/files").get(getAllFiles);
router.route("/delete/:id").delete(deleteFile);
router.route("/download/:id").get(downloadFile);



module.exports = router;