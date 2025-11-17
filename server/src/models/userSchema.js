const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SchemaName, Tokens } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // hashed
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
    verificationCode: { type: String },
    verificationExpiry: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, Tokens.acessToken, {
    expiresIn: Tokens.accessTokenExpiry,
  });
};

module.exports = mongoose.model(SchemaName.user, userSchema);
