const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  createFolder,
  getFolder,
  moveFileToFolder,
  moveFolderToFolder,
  getAllFolders
} = require("../controller/folderController");

router.route("/create-folder").post(requireAuth, createFolder);
router.route("/get-folder/:id").get(requireAuth, getFolder);
router.route("/move-file/:folderId/:fileId").patch(requireAuth, moveFileToFolder);
router.route("/move-folder/:folderId/:targetFolderId").patch(requireAuth, moveFolderToFolder);
router.route("/get-folders").get(requireAuth, getAllFolders);

module.exports = router;
