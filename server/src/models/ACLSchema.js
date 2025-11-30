const ACLSchema = new Schema({
  resourceType: { type: String, enum: ['file','folder'], required: true },
  resourceId: { type: ObjectId, required: true, index: true },
  principalType: { type: String, enum: ['user','group','public'], required: true },
  principalId: { type: ObjectId, default: null }, // null for public
  role: { type: String, enum: ['owner','editor','commenter','viewer'], required: true },
  grantedBy: { type: ObjectId, ref: 'User' },
  grantedAt: { type: Date, default: Date.now },
  expiresAt: Date // optional
}, { timestamps: true });
