// models/VerificationToken.js
const mongoose = require("mongoose");
const crypto = require("crypto");
const { SchemaName } = require("../constants");
const { Schema } = mongoose;

const VerificationTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    tokenHash: { type: String, required: true, index: true }, // sha256 or bcrypt
    type: { type: String, enum: ["otp", "magic_link", "email_change"], required: true },
    purpose: { type: String }, // e.g., "email_verification", "password_reset"
    createdByIp: String,
    consumed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// helper to hash raw token
VerificationTokenSchema.statics.hashToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = mongoose.model(SchemaName.verificaToken, VerificationTokenSchema);
