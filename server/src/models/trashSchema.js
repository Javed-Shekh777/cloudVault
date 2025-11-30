const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const trashSchema = new mongoose.Schema(
  {
    // Who trashed it
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaName.user,
      required: [true, "Owner Id is required"],
      index: true,
    },

    // Whether it was a file or folder
    resourceType: {
      type: String,
      enum: ["file", "folder"],
      required: true,
      index: true,
    },

    // Actual file/folder _id
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Where it was originally located
    originalParentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaName.folder,
      default: null,
    },

    // When it was trashed
    trashedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Any additional needed metadata (filename, size, folder name, etc)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Helpful indexes
trashSchema.index({ ownerId: 1, resourceType: 1 });
trashSchema.index({ trashedAt: 1 });

module.exports = mongoose.model(SchemaName.trash, trashSchema);
