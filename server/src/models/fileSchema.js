const mongoose = require('mongoose');
const { SchemaName } = require('../constants');

const fileSchema = new mongoose.Schema(
  {
    // Original file name
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    // Cloudinary public ID
    public_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Secure CDN URL
    secure_url: {
      type: String,
      required: true,
      trim: true,
    },

    // Direct download URL (fl_attachment)
    downloadUrl: {
      type: String,
      trim: true,
    },
    // Resource type
    resource_type: {
      type: String,
      required: true,
      enum: [
        'image',
        'video',
        'audio',
        'raw',
        'document',
        'gif',
        'pdf',
        'mp3',
        'mp4',
        'other',
      ],
      default: 'other',
    },
    // File format (jpg, mp4, pdf, etc.)
    format: {
      type: String,
      trim: true,
    },
    // File size in bytes
    size: {
      type: Number,
      required: true,
    },
    // Dimensions (for images/videos)
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    // Duration (for audio/video)
    duration: { type: Number, default: 0 },
    // Folder reference
    folder: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.folder,default:null },
    // Tags
    tags: [{ type: String, trim: true }],
    // Description/caption
    description: { type: String, trim: true },
    // Sharing
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user }],
    // Versioning
    version: { type: Number, default: 1 },
    // Uploader reference
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user },
    // Upload date
    uploadedAt: { type: Date, default: Date.now },
    isFavourite: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model(SchemaName.file, fileSchema);
