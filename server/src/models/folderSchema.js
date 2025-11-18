const mongoose = require('mongoose');
const { SchemaName } = require('../constants');
const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user, required: true },
    breadcrumb: [{
      _id: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.folder },
      name: { type: String }
    }],
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.folder, default: null }, 
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaName.file }],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user }],
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user, default: null },
    isDeleted: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user, default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model(SchemaName.folder, folderSchema);


