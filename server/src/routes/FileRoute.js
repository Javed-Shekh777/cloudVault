const upload = require('../config/multerconfig');
const {
  getAllFiles,
  uploadFilesHandler,
  deleteFile,
  downloadFile,
  getStarredFiles,
  addRemoveStarred,
  toggleTrashStatus,
  addRemoveToLockedFolder,
  shareFile,
  getSharedWithMe,
  createPublicShareLink,
  openShareLink
} = require('../controller/FileController');
const { requireAuth } = require("../middleware/auth");
const router = require('express').Router();

// Upload multiple files
router.post("/upload", requireAuth, upload.array('files', 10), uploadFilesHandler);

// Get all files
router.get("/", requireAuth, getAllFiles);

// Starred files
router.get("/stared-files", requireAuth, getStarredFiles);

// Delete file
router.delete("/delete/:id", requireAuth, deleteFile);

// Download file
router.get("/download/:id", requireAuth, downloadFile);

// Add/remove star
router.patch("/add-remove-star/:id", requireAuth, addRemoveStarred);

// Toggle trash
router.patch("/add-remove-trash/:id", requireAuth, toggleTrashStatus);

// router.route("/trash/:id").patch(requireAuth, toggleTrashStatus);

// router.route("/trash").get(requireAuth, getAllFiles);

router.route("/add-remove-locked/:id").patch(requireAuth, addRemoveToLockedFolder);

router.route("/fileId/share").post(requireAuth, shareFile)
router.route("/shared-with-me").get(requireAuth, getSharedWithMe)
router.route("/:fileId/create-share-link").post(requireAuth, createPublicShareLink)
router.route("/share/:fileId/:token").get(openShareLink);
module.exports = router;
