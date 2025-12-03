// const { cloudinaryDelete, cloudinaryUpload } = require('../utils/cloudinary');
// const File = require('../models/fileSchema');
// const Folder = require('../models/folderSchema');

// const { cloudinaryFolderNames } = require('../constants');
const cloudinary = require("cloudinary").v2;
const { cloudinaryUpload, cloudinaryDelete } = require("../utils/cloudinary");
const File = require("../models/fileSchema");
const Folder = require("../models/folderSchema");
const { errorResponse, successResponse } = require("../utils/response");
const { cloudinaryFolderNames } = require("../constants");
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } = require("../errors/AppError");
const crypto = require("crypto");

// // =========================
// // 📤 Upload File
// // =========================


// // 2. Utility function to sanitize filenames for use in public_id
const sanitizeFilename = (filename) => {
  return filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^\w\s-]/g, '')  // Remove non-alphanumeric chars except space and hyphen
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .toLowerCase();
};

// // --- Main Controller Function ---

exports.uploadFilesHandler = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new BadRequestError("No files provided"));
  }
  console.log(req.body);

  const session = await File.startSession();
  session.startTransaction();

  try {
    const uploadedFilesData = [];

    for (const file of req.files) {
      try {
        let resourceType = "raw";
        if (file.mimetype.startsWith("image/")) resourceType = "image";
        else if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("audio/"))
          resourceType = "video";

        const originalFilename = file.originalname;
        const sanitizedName = sanitizeFilename(originalFilename);
        const timestamp = Date.now();
        const fileExtension = originalFilename.split(".").pop();
        const basePublicId = `${timestamp}-${sanitizedName}`;

        const uploadOptions = {
          folder: cloudinaryFolderNames.files,
          resource_type: resourceType,
          public_id: basePublicId,
          format: fileExtension,
        };

        const result = await cloudinaryUpload(file.buffer, uploadOptions);

        if (!result) throw new Error("Cloudinary upload returned empty response");

        const downloadUrl = cloudinary.url(result.public_id, {
          resource_type: resourceType,
          format: result.format,
          fetch_format: result.format,
          flags: ["attachment"],
          sign_url: true,
        });

        // ✅ Push each uploaded file to array instead of return
        uploadedFilesData.push({
          filename: originalFilename,
          public_id: result.public_id,
          secure_url: result.secure_url,
          downloadUrl,
          resource_type: result.resource_type || "other",
          format: result.format,
          size: result.bytes,
          width: result.width || 0,
          height: result.height || 0,
          duration: result.duration || 0,
          folder: req.body.folder || null,
          tags: req.body.tags || [],
          description: req.body.description || "",
          uploadedBy: req.user?._id || null,
          isLocked: req.body.isLocked === 'true' || false,
        });

      } catch (uploadErr) {
        console.log("❌ Cloudinary upload failed for file:", file.originalname, uploadErr.message);
        uploadedFilesData.push({ filename: file.originalname, errorResponse: uploadErr.message });
        // Continue with next file, don’t abort
      }
    }

    // If no successful uploads
    const successfulUploadsData = uploadedFilesData.filter((item) => !item.errorResponse);
    if (successfulUploadsData.length === 0) {
      return successResponse(res, "No files were successfully uploaded.", uploadedFilesData);
    }

    console.log("Successful uploads data:", successfulUploadsData);
    // Save successful files
    const createdFiles = await File.insertMany(successfulUploadsData, { session });
    // console.log("CreatedFiles:", createdFiles)
    // console.log("req.body:", req.body.folder);


    // Update folder reference if folderId provided
    if (req.body?.folder) {
      await Folder.findByIdAndUpdate(
        req.body.folder,
        { $push: { files: { $each: createdFiles.map(f => f._id) } } },
        { session }
      );

    }

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, `${createdFiles.length} files uploaded successfully!`, {
      createdFiles,
      failedFiles: uploadedFilesData.filter(f => f.errorResponse),
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log("❌ General upload errorResponse:", err);
    next(err);
  }
};


// ================================
// 📁 Get All Files + Folders
// ================================
exports.getAllFiles = async (req, res, next) => {
  try {

    const folderId = req.query.folder || null;

    const isLocked = req.query.isLocked || null;
    console.log("isLocked:", isLocked);
    const userId = req.user?._id;
    console.log(typeof isLocked);
    // File.find({ uploadedBy: userId }).then((r) => { console.log(r) });
    let lockedFilter = {};

    if (typeof isLocked === "string") {
      if (isLocked.toLowerCase() === "true") lockedFilter.isLocked = true;
      if (isLocked.toLowerCase() === "false") lockedFilter.isLocked = false;
    } else if (typeof isLocked === "boolean") {
      lockedFilter.isLocked = isLocked;
    }



    const folders = await Folder.find({
      parentFolder: folderId || null,
      createdBy: userId,
      ...lockedFilter
      // isLocked: isLocked === 'true' ? true : isLocked === 'false' ? false : { $in: [true, false] }
    }).sort({ createdAt: -1 });

    const files = await File.find({
      folder: folderId || null,
      uploadedBy: userId,
      ...lockedFilter

      // isLocked: isLocked === 'true' ? true : isLocked === 'false' ? false : { $in: [true, false] }
    }).sort({ createdAt: -1 });


    // console.log("Fetched folders:", files);
    console.log(isLocked === "true" ? true :
      isLocked === "false" ? false :
        { $exists: true })
    console.log("isLocked:", isLocked);

    return successResponse(res, "File fetched successfully", {
      count: files.length,
      files,
      folders
    });
  } catch (err) {
    next(err);
  }
};




// ================================
// ⬇ Download File
// ================================
exports.downloadFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return next(new NotFoundError("File not found"));

    return res.redirect(file.downloadUrl);
  } catch (err) {
    next(err);
  }
};

// ================================
// 🗑 Delete File (Permanent)
// ================================
exports.deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    if (!fileId) return next(new BadRequestError("File ID is required"));

    const file = await File.findById(fileId);
    if (!file) return next(new NotFoundError("File not found"));

    // 1) Delete from Cloudinary
    const cloudResult = await cloudinaryDelete(
      file.public_id,
      file.resource_type || "raw"
    );

    console.log("Cloudinary Delete =>", cloudResult);

    // 2) Remove file document from MongoDB
    await file.deleteOne();

    // 3) Remove reference from folder if exists
    if (file.folder) {
      await Folder.findByIdAndUpdate(file.folder, {
        $pull: { files: file._id },
      });
    }

    // 4) Success
    return successResponse(res, "File deleted successfully", {
      fileId,
      cloudinary: cloudResult,
    });
  } catch (err) {
    next(err);
  }
};


// ================================
// ⭐ Get Starred Files
// ================================
exports.getStarredFiles = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const files = await File.find({
      uploadedBy: userId,
      isFavourite: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, "Starred files fetched", {
      count: files.length,
      files,
    });
  } catch (err) {
    next(err);
  }
};

// ================================
// ⭐ Toggle Favourite
// ================================
exports.addRemoveStarred = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return next(new BadRequestError("File ID is required"));

    const file = await File.findById(id);
    if (!file) return next(new NotFoundError("File not found"));

    file.isFavourite = !file.isFavourite;
    await file.save();

    return successResponse(res, "Favourite status updated", {
      isFavourite: file.isFavourite,
      fileId: file._id,
    });
  } catch (err) {
    next(err);
  }
};

// ================================
// 🗑 Move to Trash / Restore
// ================================
exports.toggleTrashStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new BadRequestError("File ID is required"));

    const file = await File.findById(id);
    if (!file) return next(new NotFoundError("File not found"));

    file.isDeleted = !file.isDeleted;
    file.trashedAt = file.isDeleted ? new Date() : null;

    await file.save();
    const msg = file.isDeleted ? "Moved to trash" : "Restored from trash";

    return successResponse(
      res,
      msg,
      {
        isDeleted: file.isDeleted,
        fileId: file._id,
      }
    );
  } catch (err) {
    next(err);
  }
};


exports.addRemoveToLockedFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!id) return next(new BadRequestError("File ID is required"));
    const file = await File.findById(id);
    if (!file) return next(new NotFoundError("File not found"));
    file.isLocked = !file.isLocked;
    await file.save();
    return successResponse(res, `File ${file.isLocked ? "move to" : "removed from"} locked folder`, {
      fileId: file._id,
      isLocked: file.isLocked,
    });
  } catch (err) {
    next(err);
  }
};


exports.shareFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    if (!fileId) throw new NotFoundError("FileIs is required");

    const { targetUser, permission } = req.body;

    if (!targetUser) {
      throw new BadRequestError("Share with user is required.");
    }

    const file = await File.findById(fileId);
    if (!file) throw new NotFoundError("File not found");

    const isShared = file.sharedWith?.find((u) => u?.user.toString() === targetUser);

    if (isShared) {
      isShared.permission = permission;
    } else {
      file.sharedWith.push({ user: targetUser, permission });
    }
    await file.save();

    return successResponse(res, "File shared", file);

  } catch (error) {
    next(error);
  }
}

exports.getSharedWithMe = async (req, res, next) => {
  try {
    const userId = req?.user._id;

    const files = await File.find({
      "sharedWith.user": userId,
      isDeleted: false,
      isLocked: false
    }).populate("uploadedBy", "name email profileImage")
      .populate("sharedWith.user", "name email");
    return successResponse(res, "File shared", files);


  } catch (error) {
    next(error);
  }
}

exports.createPublicShareLink = async (req, res, next) => {
  try {
    const { fileId } = req.params;

    if (!fileId) throw new BadRequestError("FileID is required.");

    const file = await File.findById(fileId);
    if (!file) throw new NotFoundError("File not found");

    const token = crypto.randomBytes(32).toString("hex");

    file.shareLink = token;
    file.shareExpiresAt = Date.now() + 1000 * 60 * 60 * 24;
    file.isNew = true;
    await file.save();

    return successResponse(res, "Public link created", file);
  } catch (error) {
    next(error);
  }
}

exports.openShareLink = async (req, res, next) => {
  try {
    const { token, fileId } = req.params;

    if (!token || !fileId) throw new BadRequestError("Token is required.");

    const file = await File.find({
      _id: fileId,
      shareLink: token,
      shareExpiresAt: { $gt: Date.now() }
    });

    if (!file) throw new NotFoundError("Invalid or expired link");

    return successResponse(res, "Found shared file", file);
  } catch (error) {
    next(error);
  }
}