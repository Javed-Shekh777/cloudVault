const mongoose = require('mongoose');
const { SchemaName } = require('../constants');


const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.folder }, // nested folders
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user }],
}, { timestamps: true });
module.exports = mongoose.model(SchemaName.activity, activitySchema);
