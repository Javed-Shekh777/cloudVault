const mongoose = require('mongoose');
const { SchemaName } = require('../constants');

const ShareLinkSchema = new mongoose.Schema({
  resourceType: { type: String, enum: ['file','folder'], required: true },
  resourceId: { type: ObjectId, required: true, index: true },
  hashedToken: { type: String, required: true }, // store bcrypt/sha256
  permission: { type: String, enum: ['view','edit'], default: 'view' },
  createdBy: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  accessCount: { type: Number, default: 0 },
  lastAccessedAt: Date
});
