const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const upload = require('./config/multerconfig');
const { cloudinaryDelete, cloudinaryUpload } = require('./util/cloudinary');
const File = require('./models/fileSchema');
const { cloudinaryFolderNames } = require('./constants');
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const result = await cloudinaryUpload(req.file.buffer, cloudinaryFolderNames.files,req?.file.originalname);
    console.log(result);

    const file = await File.create({
      filename: req.file.originalname,
      public_id: result.public_id,
      secure_url: result.secure_url,
      resource_type: result.resource_type || 'other',
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
      folder: result.folder,
      uploadedAt: new Date(),
    });

    res.status(201).json({ message: '✅ File uploaded successfully!', file });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});


// =========================
// 📂 Get All Files
// =========================
app.get("/files", async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (err) {
    console.error("❌ Fetch files error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch files" });
  }
});


// =========================
// ⬇️ Download File (Cloudinary Redirect)
// =========================
app.get("/download/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file)
      return res.status(404).json({ success: false, error: "File not found" });

    // Just redirect to secure_url on Cloudinary
    return res.redirect(file.secure_url);
  } catch (err) {
    console.error("❌ Download failed:", err);
    res.status(500).json({ success: false, error: "Download failed" });
  }
});

// =========================
// 🗑️ Delete File (from Cloudinary + MongoDB)
// =========================
app.delete("/delete/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    // 🧹 Delete from Cloudinary
    const cloudResult = await cloudinaryDelete(
      file.public_id,
      file.resource_type || "auto"
    );

    // 🧾 Delete from DB
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
});


module.exports = app;
