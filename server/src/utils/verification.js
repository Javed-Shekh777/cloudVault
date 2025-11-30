// utils/verification.js
const crypto = require("crypto");
const VerificationToken = require("../models/VerificationToken");

async function createVerificationToken(userId, { type = "otp", purpose = "email_verification", ttlMinutes = 15, ip = "" } = {}) {
  const raw = crypto.randomBytes(type === "otp" ? 3 : 32).toString("hex"); // otp ~6 hex chars or magic link longer
  const tokenValue = type === "otp" ? raw.slice(0,6) : raw + crypto.randomBytes(8).toString("hex");
  const tokenHash = VerificationToken.hashToken(tokenValue);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await VerificationToken.create({
    userId,
    tokenHash,
    type,
    purpose,
    createdByIp: ip,
    expiresAt,
    consumed: false,
  });

  return tokenValue; // send this to user
}

async function verifyVerificationToken(userId, providedToken, { type, purpose } = {}) {
  const hash = VerificationToken.hashToken(providedToken);
  const record = await VerificationToken.findOne({ userId, tokenHash: hash, type, purpose, consumed: false, expiresAt: { $gt: new Date() } });
  if (!record) return false;
  record.consumed = true;
  await record.save();
  return true;
}
