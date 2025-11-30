const upload = require('../config/multerconfig');
const { 
  getAllFiles, 
  uploadFilesHandler, 
  deleteFile, 
  downloadFile, 
  getStarredFiles, 
  addRemoveStarred, 
  toggleTrashStatus 
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

module.exports = router;
