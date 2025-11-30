// models/Session.js
const mongoose = require("mongoose");
const crypto = require("crypto");
const { SchemaName, Tokens } = require("../constants");
const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: SchemaName.user, required: true, index: true },
    deviceId: { type: String, required: true, index: true },
    refreshTokenHash: { type: String }, // HMAC/SHA256 of token
    ip: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },

    // EMAIL VERIFICATION OTP
    emailOTP: String,
    webToken: String,
    emailExpiry: { type: Date, default: Date.now },



    expiresAt: { type: Date, required: true, index: true },
    revoked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// helper to hash token before storing
SessionSchema.statics.hashToken = function (token) {
  // use server-side secret for HMAC for added protection
  const key = Tokens.hmacSecret || Tokens.refreshSecret || "fallback_key";
  return crypto.createHmac("sha256", key).update(token).digest("hex");
};

module.exports = mongoose.model(SchemaName.session, SessionSchema);
