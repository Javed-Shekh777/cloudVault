const { BadRequestError, NotFoundError } = require("../errors/AppError");
const Folder = require("../models/folderSchema");
const File = require("../models/fileSchema");
const { successResponse } = require("../utils/response");

// Create Folder
const createFolder = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { name, parentFolder } = req.body;
    if (!name) return next(new BadRequestError("Folder name is required"));

    const folder = await Folder.create({ name, parentFolder: parentFolder || null, createdBy: userId });

    // Add to parent's children
    if (parentFolder) await Folder.findByIdAndUpdate(parentFolder, { $push: { childrenFolders: folder._id } });

    return successResponse(res, "Folder created successfully", folder);
  } catch (err) { next(err); }
};

// Get Folder + Nested Content
const getFolder = async (req, res, next) => {
  try {
    const folderId = req.params.id;
    if (!folderId) return next(new BadRequestError("Folder ID required"));

    // Populate immediate children and files
    const folder = await Folder.findById(folderId)
      .populate({ path: "childrenFolders", match: { isDeleted: false } })
      .populate({ path: "files", match: { isDeleted: false } })
      .populate("parentFolder");

    if (!folder) return next(new NotFoundError("Folder not found"));

    return successResponse(res, "Folder fetched successfully", folder);
  } catch (err) { next(err); }
};

// Move File to Folder
const moveFileToFolder = async (req, res, next) => {
  try {
    const { folderId, fileId } = req.params;
    if (!folderId || !fileId) return next(new BadRequestError("Folder ID & File ID required"));

    const folder = await Folder.findById(folderId);
    if (!folder) return next(new NotFoundError("Target folder not found"));

    const file = await File.findById(fileId);
    if (!file) return next(new NotFoundError("File not found"));

    const oldFolderId = file.folder;
    file.folder = folderId;
    await file.save();

    if (oldFolderId) await Folder.findByIdAndUpdate(oldFolderId, { $pull: { files: fileId } });
    await Folder.findByIdAndUpdate(folderId, { $addToSet: { files: fileId } });

    return successResponse(res, "File moved successfully", { movedFile: file, oldFolderId, newFolderId: folderId });
  } catch (err) { next(err); }
};

// Move Folder inside Folder (Nested)
const moveFolderToFolder = async (req, res, next) => {
  try {
    const { folderId, targetFolderId } = req.params;
    if (!folderId || !targetFolderId) return next(new BadRequestError("Folder IDs required"));

    if (folderId === targetFolderId) return next(new BadRequestError("Cannot move folder into itself"));

    const folder = await Folder.findById(folderId);
    const targetFolder = await Folder.findById(targetFolderId);
    if (!folder || !targetFolder) return next(new NotFoundError("Folder(s) not found"));

    const oldParentId = folder.parentFolder;

    // Update parent
    folder.parentFolder = targetFolderId;
    await folder.save();

    // Remove from old parent children
    if (oldParentId) await Folder.findByIdAndUpdate(oldParentId, { $pull: { childrenFolders: folderId } });
    // Add to new parent children
    await Folder.findByIdAndUpdate(targetFolderId, { $addToSet: { childrenFolders: folderId } });

    return successResponse(res, "Folder moved successfully", { folder, oldParentId, newParentId: targetFolderId });
  } catch (err) { next(err); }
};

// Get all folders (user) — optionally with nested structure
const getAllFolders = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const folders = await Folder.find({ createdBy: userId, isDeleted: false });
    return successResponse(res, "Folders fetched successfully", folders);
  } catch (err) { next(err); }
};

module.exports = {
  createFolder,
  getFolder,
  moveFileToFolder,
  moveFolderToFolder,
  getAllFolders
};
