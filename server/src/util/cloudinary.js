const { cloudinaryConfig } = require("../constants");
const fs = require("fs").promises;
const streamifier = require("streamifier");

const cloudinary = require("cloudinary").v2;
const path = require("path");

// config set karo (env vars se lena best hai)
cloudinary.config(cloudinaryConfig);


// Detect resource type based on file extension
const detectResourceType = (filename) => {
  const ext = path.extname(filename).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext))
    return "image";

  if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext))
    return "video";

  if ([".mp3", ".wav", ".ogg", ".aac"].includes(ext))
    return "video"; // audio as video

  // 🧾 IMPORTANT: for pdf, txt, zip, docs — return 'raw'
  if ([".pdf", ".txt", ".zip", ".docx", ".xlsx", ".pptx"].includes(ext))
    return "raw";

  return "auto";
};


// Upload buffer to Cloudinary
const cloudinaryUpload = (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    const resourceType = detectResourceType(filename);
    console.log("Detected type:", resourceType);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,  // 🧠 this decides correct handling
        use_filename: true,
        unique_filename: false,
        filename_override: filename,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};



// ✅ Delete file
const cloudinaryDelete = async (public_id, resource_type = "image") => {
  if (!public_id) {
    console.warn("cloudinaryDelete called without public_id");
    return;
  }

  try {
    const res = await cloudinary.uploader.destroy(public_id, {
      resource_type
    });
    return res;
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    throw new Error(error.message);
  }
};


module.exports = { cloudinaryUpload, cloudinaryDelete };
