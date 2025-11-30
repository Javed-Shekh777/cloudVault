// middlewares/auth.js
const { verifyAccessToken } = require("../utils/tokens");
const Session = require("../models/Session");
const User = require("../models/userSchema");
const { UnauthorizedError } = require("../errors/AppError");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token)
      return next(new UnauthorizedError("Missing access token"));

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return next(new UnauthorizedError("Invalid or expired access token"));
    }

    const user = await User.findById(payload.uid).select("-password");
    if (!user)
      return next(new UnauthorizedError("User not found"));

    if (!payload.did)
      return next(new UnauthorizedError("Token missing deviceId"));

    const session = await Session.findOne({
      userId: payload.uid,
      deviceId: payload.did,
      revoked: false
    });

    if (!session)
      return next(new UnauthorizedError("Session invalid or expired"));

    session.lastUsedAt = new Date();
    session.save().catch(() => {});

    req.user = user;
    req.session = session;
    req.tokenPayload = payload;

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
