const mongoose = require('mongoose');
const { SchemaName } = require('../constants');


const trashSchema = new mongoose.Schema({
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.trash,trashSchema);
