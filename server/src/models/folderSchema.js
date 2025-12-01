const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: SchemaName.user,
      required: true,
      index: true,
    },

    // Parent folder
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.folder, default: null, index: true },

    // Children folders
    childrenFolders: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaName.folder }],

    // Files in folder
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaName.file }],



    // 🔥 Sharing
    sharedWith: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user },
        permission: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
      },
    ],

    // Breadcrumb for fast navigation
    breadcrumb: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.folder }, name: String }],

    // Trash / Delete
    isDeleted: { type: Boolean, default: false, index: true },
    trashedAt: { type: Date, default: null },

    // Locking
    // inside folderSchema definition (add these fields)
    encryption: {
      wrappedKey: { type: String, default: null },   // base64 ciphertext of AES folder key
      wrappedKeyIv: { type: String, default: null }, // base64 iv for wrapping operation
      salt: { type: String, default: null },         // base64 salt for PBKDF2
      unlockMethod: { type: String, enum: ['pin', 'password'], default: 'pin' },
      failedAttempts: { type: Number, default: 0 },
      unlockTimeout: { type: Date, default: null }
    },
    isLocked: { type: Boolean, default: false },
    lockReason: { type: String, default: null }

  },
  { timestamps: true }
);

// ---------------------------
// TEXT SEARCH INDEX
// ---------------------------
folderSchema.index({ name: "text" });

// ---------------------------
// Hierarchy indexes
// ---------------------------
folderSchema.index({ parentFolder: 1 });
folderSchema.index({ "breadcrumb._id": 1 });

// ---------------------------
// AUTO-GENERATE BREADCRUMB
// ---------------------------
folderSchema.pre("save", async function (next) {
  if (!this.isModified("parentFolder")) return next();

  if (!this.parentFolder) {
    this.breadcrumb = [];
    return next();
  }

  const parent = await this.model(SchemaName.folder).findById(this.parentFolder);

  this.breadcrumb = [
    ...(parent.breadcrumb || []),
    { _id: parent._id, name: parent.name },
  ];

  next();
});

module.exports = mongoose.model(SchemaName.folder, folderSchema);
