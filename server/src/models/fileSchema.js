const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    // Original file name
    filename: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary public ID (for delete/update)
    public_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Full URL (Cloudinary or other CDN)
    secure_url: {
      type: String,
      required: true,
      trim: true,
    },

    // File resource type: image, video, raw, pdf, gif, mp3, mp4, etc.
    resource_type: {
      type: String,
      required: true,
      enum: [
        'image',
        'video',
        'raw',
        'audio',
        'document',
        'gif',
        'pdf',
        'mp3',
        'mp4',
        'other',
      ],
      default: 'other',
    },

    // File format (jpg, png, mp4, mp3, pdf...)
    format: {
      type: String,
      trim: true,
    },

    // File size in bytes
    bytes: {
      type: Number,
    },

    // Optional: width/height (for images/videos)
    width: Number,
    height: Number,

    // Duration for video/audio (in seconds)
    duration: Number,

    // Uploader reference (optional)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    downloadUrl:{
      type:String,
      trim:true
    },

    // Tags or categories
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Folder (like /profiles, /recipes, /uploads, etc.)
    folder: {
      type: String,
      trim: true,
    },

    // Description or caption
    description: {
      type: String,
      trim: true,
    },

    // Upload date
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
