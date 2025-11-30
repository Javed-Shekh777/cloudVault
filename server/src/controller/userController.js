// controllers/userController.js

const { cloudinaryFolderNames } = require("../constants");
const User = require("../models/userSchema");
const { cloudinaryUpload, cloudinaryDelete } = require("../utils/cloudinary");
const { successResponse, errorResponse } = require("../utils/response");

// ==============================
// UPDATE PROFILE (SAFE VERSION)
// ==============================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { name } = req.body;
    const file = req.file;

    // 1. Check user
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // 2. Upload image if provided
    if (file) {
      try {
        const uploadCloud = await cloudinaryUpload(file.buffer, {
          folder: cloudinaryFolderNames.profiles,
          resource_type: "image",
        });

        if (!uploadCloud?.secure_url) {
          return errorResponse(res, "Image upload failed", 400);
        }

        // Old delete if exists
        if (user.profileImage?.publicId) {
          await cloudinaryDelete(user.profileImage.publicId, "image").catch(() => {});
          // NOTE: delete error ko catch karke log kar sakte ho par client ko fail nahi dikhaate
        }

        // Update new image
        user.profileImage = {
          publicId: uploadCloud.public_id,
          url: uploadCloud.secure_url,
        };
      } catch (err) {
        return errorResponse(res, "Cloudinary upload failed", 500, err.message);
      }
    }

    // 3. Update name
    if (name) user.name = name;

    // 4. Save profile
    await user.save();

    user.password = undefined; // hide sensitive fields

    return successResponse(res, "Profile updated successfully", { user }, 200);
  } catch (err) {
    return errorResponse(res, err.message || "Profile update failed", 500);
  }
};

module.exports = { updateProfile };
