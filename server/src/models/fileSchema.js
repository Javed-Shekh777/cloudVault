const mongoose = require('mongoose');

const { SchemaName } = require("../constants");

const fileSchema = new mongoose.Schema(
  {
    // ================================
    // 🔹 File Identity
    // ================================
    filename: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    public_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    secure_url: {
      type: String,
      required: true,
      trim: true,
    },

    downloadUrl: {
      type: String,
      trim: true,
    },

    resource_type: {
      type: String,
      required: true,
      enum: [
        "image",
        "video",
        "audio",
        "raw",
        "document",
        "gif",
        "pdf",
        "mp3",
        "mp4",
        "other",
      ],
      default: "other",
    },

    format: {
      type: String,
      trim: true,
    },

    // ================================
    // 🔹 File Meta
    // ================================
    size: {
      type: Number,
      required: true,
    },

    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },

    // ================================
    // 🔹 Linking
    // ================================
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaName.folder,
      default: null,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaName.user,
      required: true,
      index: true,
    },

    // ================================
    // 🔹 Sharing (ACL-Based)
    // ================================
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: SchemaName.user,
        },
        permission: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],

    // Public Share Link Support
    shareLink: {
      type: String,
      default: null,
    },

    shareExpiresAt: {
      type: Date,
      default: null,
    },

    // ================================
    // 🔹 Versioning
    // ================================
    version: {
      type: Number,
      default: 1,
    },

    previousVersions: [
      {
        public_id: String,
        secure_url: String,
        size: Number,
        format: String,
        version: Number,
        uploadedAt: Date,
      },
    ],

    // ================================
    // 🔹 Extras
    // ================================
    tags: [{ type: String, trim: true }],
    description: { type: String, trim: true },

    isFavourite: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ================================
    // 🔹 Soft Delete + Trash
    // ================================
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    trashedAt: {
      type: Date,
      default: null,
    },

    isLocked: { type: Boolean, default: false },

    lockReason: { type: String, default: null },


    // ================================
    // 🔹 Security Flags
    // ================================
    encryption: {
      iv: { type: String, default: null },       // base64 iv used to encrypt this file
      isEncrypted: { type: Boolean, default: false },
      encryptedPath: { type: String, default: null } // storage path to encrypted blob (if different)
    },



    // Activity logs (optional but scalable)
    activityLog: [
      {
        action: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ================================
// 🚀 Optimized Indexes (Google Drive Style)
// ================================
fileSchema.index({ filename: "text", description: "text", tags: "text" });

module.exports = mongoose.model(SchemaName.file, fileSchema);
