const mongoose = require('mongoose');
const { SchemaName } = require('../constants');

const activitySchema = new mongoose.Schema({
  action: { type: String, enum: ["upload","delete","share","rename","move"], required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.activity, activitySchema);

