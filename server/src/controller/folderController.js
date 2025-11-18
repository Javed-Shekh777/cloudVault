const Folder = require("../models/folderSchema");
const File = require("../models/fileSchema"); // 👈 add this to update file reference

// Create Folder
const createFolder = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const { name, parentFolder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const folder = await Folder.create({
      name,
      parentFolder: parentFolder || null,
      createdBy: userId,
    });

    if (!folder) {
      return res.status(500).json({
        success: false,
        message: "Failed to create folder",
      });
    }

    res.status(201).json({
      success: true,
      message: "Folder created successfully!",
      folder,
    });
  } catch (err) {
    console.error("❌ General create folder error:", err);
    res.status(500).json({
      success: false,
      error: "Folder creation failed due to server error",
      details: err.message,
    });
  }
};

// Get single folder
const getFolder = async (req, res) => {
  try {
    const id = req?.params.id || req.body.id || req.query.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Folder Id is required",
      });
    }

    const folder = await Folder.findById(id)
      .populate("files")
      .populate("parentFolder");

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Folder data fetched successfully!",
      folder,
    });
  } catch (err) {
    console.error("❌ Failed to fetch folder", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch folder due to server error",
      details: err.message,
    });
  }
};

// Move file to folder
const moveToFolder = async (req, res) => {
  try {
    const { folderId, fileId } = req.params; // 👈 use params only
    if (!folderId || !fileId) {
      return res.status(400).json({
        success: false,
        message: "Folder ID and File ID are required",
      });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Update file reference
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    file.folder = folderId;
    await file.save();

    // Update folder reference
    if (!folder.files.includes(fileId)) {
      folder.files.push(fileId);
      await folder.save();
    }

    res.status(200).json({
      success: true,
      message: "File moved successfully!",
      folder,
      file,
    });
  } catch (err) {
    console.error("❌ Failed to move error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to move due to server error",
      details: err.message,
    });
  }
};

// Get all folders for user
const getFolders = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const folders = await Folder.find({ createdBy: userId });

    res.status(200).json({
      success: true,
      message: "Folders fetched successfully!",
      folders,
    });
  } catch (err) {
    console.error("❌ Failed to fetch error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch due to server error",
      details: err.message,
    });
  }
};

module.exports = { createFolder, getFolder, moveToFolder, getFolders };
