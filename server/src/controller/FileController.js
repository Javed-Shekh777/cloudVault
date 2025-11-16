const { cloudinaryDelete, cloudinaryUpload } = require('../util/cloudinary');
const File = require('../models/fileSchema');
const { cloudinaryFolderNames } = require('../constants');
const cloudinary = require("cloudinary").v2;

// =========================
// 📤 Upload File
// =========================


// 2. Utility function to sanitize filenames for use in public_id
const sanitizeFilename = (filename) => {
  return filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^\w\s-]/g, '')  // Remove non-alphanumeric chars except space and hyphen
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .toLowerCase();
};



// --- Main Controller Function ---

const uploadFilesHandler = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files provided' });
  }

  try {
    // Map over all files and upload them in parallel
    const uploadedFilesData = await Promise.all(req.files.map(async (file) => {

      // Determine resource type
      let resourceType = 'raw';
      if (file.mimetype.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
        resourceType = 'video';
      }

      // Sanitize name and prepare IDs
      const originalFilename = file.originalname;
      const sanitizedName = sanitizeFilename(originalFilename);
      const timestamp = Date.now();
      const fileExtension = originalFilename.split('.').pop();
      // Ensure public_id is clean and simple
      const basePublicId = `${cloudinaryFolderNames.files}/${timestamp}-${sanitizedName}`;

      const uploadOptions = {
        folder: cloudinaryFolderNames.files,
        resource_type: resourceType,
        public_id: basePublicId,
        format: fileExtension
      };

      let result;
      try {
        // Await the helper function call (this handles single file errors gracefully)
        result = await cloudinaryUpload(file.buffer, uploadOptions);
      } catch (uploadError) {
        console.error(`❌ Failed to upload ${file.originalname}:`, uploadError.message);
        return null; // Returning null here allows Promise.all to continue
      }

      if (!result) return null; // Skip DB entry if upload failed

      // Generate download URL
      const downloadUrl = cloudinary.url(result.public_id, {
        resource_type: resourceType,
        format: result.format,
        fetch_format: result.format,
        flags: ["attachment"],
        sign_url: true
      });

      // Prepare data for Mongoose creation
      return {
        filename: originalFilename,
        public_id: result.public_id,
        secure_url: result.secure_url,
        downloadUrl: downloadUrl,
        resource_type: result.resource_type || 'other',
        format: result?.format,
        size: result.bytes,
        width: result.width || 0,
        height: result.height || 0,
        duration: result.duration || 0,
        folder: req.body.folder || null,
        tags: req.body.tags || [],
        description: req.body.description || "",
        uploadedBy: req.user?._id || null,
      };
    }));

    // Filter out any failed uploads (null values) from the array
    const successfulUploadsData = uploadedFilesData.filter(item => item !== null);

    if (successfulUploadsData.length === 0) {
      return res.status(400).json({ success: false, message: "No files were successfully uploaded." });
    }

    // Save successful files data to MongoDB
    const createdFiles = await File.insertMany(successfulUploadsData);

    res.status(201).json({
      success: true,
      message: `${createdFiles.length} files uploaded successfully!`,
      files: createdFiles
    });

  } catch (err) {
    // This general catch block handles other fatal errors (e.g., DB connection issues)
    console.error('❌ General upload error:', err);
    res.status(500).json({ success: false, error: 'Upload failed due to server error', details: err.message });
  }
};




// const uploadFilesHandler = async (req, res) => {
//   try {
//     // Multer array middleware req.files प्रदान करता है, req.file नहीं
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: false, error: 'कोई फ़ाइलें प्रदान नहीं की गईं' });
//     }

//     const uploadedFilesData = await Promise.all(req.files.map(async (file) => {
//       let resourceType = 'raw';

//       if (file.mimetype.startsWith('image/')) {
//         resourceType = 'image';
//       } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
//         resourceType = 'video';
//       }

//       // public_id जनरेट करें जिसमें एक्सटेंशन शामिल हो ताकि डाउनलोड सही हो
//       const publicIdWithExt = `${cloudinaryFolderNames.files}/${Date.now()}-${file.originalname}`;
//       const fileExtension = file.originalname.split('.').pop();
//       // const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");

//       const uploadOptions = {
//           folder: cloudinaryFolderNames.files,
//           resource_type: resourceType,
//           public_id: publicIdWithExt, 
//           format: fileExtension 
//       };

//       // Cloudinary helper फ़ंक्शन का उपयोग करके अपलोड करें
//       const result = await cloudinaryUpload(file.buffer, uploadOptions);

//       // फ़ोर्स डाउनलोड के लिए downloadUrl जनरेट करें
//       const downloadUrl = cloudinary.url(result?.public_id, {
//           resource_type: resourceType,
//           format: result.format,
//           fetch_format: result.format,
//           flags: ["attachment"],  
//           sign_url: true  
//       });

//       // MongoDB में सहेजने के लिए डेटा तैयार करें
//       return {
//         filename: file.originalname,
//         public_id: result.public_id,
//         secure_url: result.secure_url,
//         downloadUrl: downloadUrl,
//         resource_type: result.resource_type || 'other',
//         format: result.format,
//         size: result.bytes,
//         width: result.width || 0,
//         height: result.height || 0,
//         duration: result.duration || 0,
//         folder: req.body?.folder || null, 
//         tags: req.body.tags || [],
//         description: req.body.description || "",
//         uploadedBy: req.user?._id || null, 
//       };
//     }));

//     // सभी फ़ाइलों का डेटाबेस में रिकॉर्ड बनाएं
//     const createdFiles = await File.insertMany(uploadedFilesData);

//     res.status(201).json({ 
//         success: true, 
//         message: `✅ ${createdFiles.length} uploaded`, 
//         files: createdFiles 
//     });

//   } catch (err) {
//     console.error('❌ failed to upload', err);
//     res.status(500).json({ success: false, error: 'failed to upload', details: err.message });
//   }
// };




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


const getStarredFiles = async (req, res) => {
  try {
    const files = await File.find({ isFavourite: true }).sort({ createdAt: -1 });
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

const addRemoveStarred = async (req, res) => {
  try {

    console.log('fdfd');
    const id = req?.params?.id || req?.body?.id;

    if (!id) {
      res.status(400).json({ success: false, error: "File is required." });

    }
    console.log('fdfd', id);


    const file = await File.findById(id)

    if (!file) {
      res.status(400).json({ success: false, error: "File not found." });
    }

    file.isFavourite = !file.isFavourite;

    await file.save();

    console.log(file);

    res.status(200).json({
      success: true,
      message: file.isDeleted ? "File added to favourite" : "File remoed from favourite",
      isFavourite: file?.isFavourite,
      fileId: file._id
    });
  } catch (err) {
    console.error("❌ Fetch files error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch files" });
  }
};


const toggleTrashStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, error: "File ID is required." });
    }

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ success: false, error: "File not found." });
    }
    file.isDeleted = !file.isDeleted;

    await file.save();


    res.status(200).json({
      success: true,
      message: file.isDeleted ? "File moved to trash" : "File restored from trash",
      isDeleted: file.isDeleted,
      fileId: file._id
    });

  } catch (err) {
    console.error("❌ Toggle trash status error:", err);
    res.status(500).json({ success: false, error: "Failed to update file status" });
  }
};


module.exports = { uploadFilesHandler, getAllFiles, deleteFile, downloadFile, getStarredFiles, addRemoveStarred, toggleTrashStatus };
