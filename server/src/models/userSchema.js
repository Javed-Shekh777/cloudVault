// models/User.js
const mongoose = require("mongoose");
const argon2 = require("argon2");
const crypto = require("crypto");
const { SchemaName, Tokens } = require("../constants");

const { Schema } = mongoose;


const userSchema = new Schema(
  {
    name: { type: String, required: [true,"Username is required"], trim: true },
    email: { type: String, required: [true,"Email is required"], unique: true, lowercase: [true,"Email should be lowercase"], index: true },
    password: { type: String }, // argon2 hash
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "twitter", "apple", "microsoft"],
      default: "local",
    },
    providerId: { type: String },
    isVerified: { type: Boolean, default: false },

    // no raw verification tokens here — use VerificationToken collection
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 15 * 1024 ** 3 }, // bytes
    settings: { type: Object, default: {} },

    // security flags
    disabled: { type: Boolean, default: false }, // admin can disable
    mfaEnabled: { type: Boolean, default: false }, // if later we do TOTP
  },
  { timestamps: true }
);

// Password setter - use argon2 + pepper
userSchema.methods.setPassword = async function (plainPassword) {
  if (!plainPassword) throw new Error("Password is required");

  const toHash = plainPassword + Tokens.passwordPaper;

  this.password = await argon2.hash(toHash, {
    type: argon2.argon2id,
    memoryCost: 2 ** 15,
    timeCost: 3,
    parallelism: 1,
  });
};


// Password verifier
userSchema.methods.verifyPassword = async function (plainPassword) {
  if (!this.password) return false;
  
  try {
    const ok = await argon2.verify(this.password, plainPassword + Tokens.passwordPaper);
    return ok;
  } catch (e) {
    return false;
  }
};

// Safe public profile
userSchema.methods.safeProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    password: this.password,
    profileImage: this.profileImage,
    isVerified: this.isVerified,
    storageUsed: this.storageUsed,
    storageLimit: this.storageLimit,
    createdAt: this.createdAt,
  };
};

// Pre remove hook: cascade or mark related sessions/tokens revoked (optional)
userSchema.pre("remove", async function (next) {
  // Example: mark sessions revoked (if Session model exists)
  // const Session = mongoose.model("Session");
  // await Session.updateMany({ userId: this._id }, { revoked: true });
  next();
});

module.exports = mongoose.model(SchemaName.user, userSchema);
