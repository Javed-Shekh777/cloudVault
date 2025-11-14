const mongoose = require('mongoose');
const { SchemaName } = require('../constants');

const permissionSchema = new mongoose.Schema({
  itemType: { type: String, enum: ["file","folder"], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: SchemaName.user },
  access: { type: String, enum: ["view","edit","comment"], default: "view" },
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.permission,permissionSchema);
