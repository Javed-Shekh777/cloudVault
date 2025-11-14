const { cloudinaryDelete, cloudinaryUpload } = require('../util/cloudinary');
const File = require('../models/fileSchema');
const { cloudinaryFolderNames } = require('../constants');

// =========================
// 📤 Upload File
// =========================
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinaryUpload(
      req.file.buffer,
      cloudinaryFolderNames.files
    );

    const originalName = req.file.originalname;
    const fileNameWithoutExt = originalName.replace(/\.[^/.]+$/, "");

    // Build download URL (fl_attachment forces download)
    const downloadUrl = result.secure_url.replace(
      "/upload/",
      `/upload/fl_attachment:${fileNameWithoutExt}`
    );

    // Save metadata in MongoDB (schema fields)
    const file = await File.create({
      filename: originalName,
      public_id: result.public_id,
      secure_url: result.secure_url,
      downloadUrl,
      resource_type: result.resource_type || 'other',
      format: result.format,
      size: result.bytes,              // ✅ schema expects "size"
      width: result.width || 0,
      height: result.height || 0,
      duration: result.duration || 0,
      folder: req.body.folder || null, // ✅ take from request if provided
      tags: req.body.tags || [],       // ✅ custom tags
      description: req.body.description || "",
      uploadedBy: req.user?._id || null, // ✅ link to User if auth middleware
    });

    res.status(201).json({ success: true, message: '✅ File uploaded successfully!', file });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ success: false, error: 'Upload failed', details: err.message });
  }
};

// =========================
// 📂 Get All Files
// =========================
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (err) {
    console.error("❌ Fetch files error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch files" });
  }
};

// =========================
// ⬇️ Download File (redirect to Cloudinary)
// =========================
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }
    return res.redirect(file.downloadUrl);
  } catch (err) {
    console.error("❌ Download failed:", err);
    res.status(500).json({ success: false, error: "Download failed" });
  }
};

// =========================
// 🗑️ Delete File (Cloudinary + MongoDB)
// =========================
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    // Delete from Cloudinary
    const cloudResult = await cloudinaryDelete(
      file.public_id,
      file.resource_type || "auto"
    );

    // Delete from DB
    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: "✅ File deleted successfully",
      cloudResult,
    });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
};

module.exports = { uploadFile, getAllFiles, deleteFile, downloadFile };
