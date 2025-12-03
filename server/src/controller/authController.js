const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Session = require("../models/Session");
const VerificationToken = require("../models/VerificationToken");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/tokens");
const { successResponse, errorResponse } = require("../utils/response");
const { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } = require("../errors/AppError");
const { Tokens } = require("../constants");
const { generateNumOTP } = require("../middleware/generateOTP");
const { verifyMail, accountCreationMail } = require("../middleware/sendMail");



// helper to parse expiry string like "7d", "15m", etc.
function parseExpiryToMs(expStr) {
  if (!expStr) return 0;
  const num = parseInt(expStr.slice(0, -1), 10);
  const unit = expStr.slice(-1);
  switch (unit) {
    case "d": return num * 24 * 60 * 60 * 1000;
    case "h": return num * 60 * 60 * 1000;
    case "m": return num * 60 * 1000;
    case "s": return num * 1000;
    default: return parseInt(expStr, 10) || 0;
  }
}

// Create session + tokens helper
// async function createSessionAndTokens(user, devId,deviceInfo = {}, ip = "") {
//   const deviceId = devId || `dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
//   const refreshRaw = signRefreshToken({ uid: user._id.toString(), did: deviceId });
//   const refreshHash = Session.hashToken(refreshRaw);

//   const expiresAt = new Date(Date.now() + parseExpiryToMs(Tokens.refreshExp || "7d"));
//   await Session.create({
//     userId: user._id,
//     deviceId,
//     refreshTokenHash: refreshHash,
//     ip,
//     language: deviceInfo?.language,
//     os: deviceInfo?.os,
//     screen: deviceInfo?.screen,
//     userAgent: deviceInfo?.userAgent || "",
//     expiresAt,
//   });

//   const accessRaw = signAccessToken({ uid: user._id.toString(), role: user.role, did: deviceId });

//   return { accessToken: accessRaw, refreshToken: refreshRaw, deviceId };
// }

async function createSessionAndTokens(user, devId, deviceInfo = {}, ip = "") {
  console.log(devId);
  const deviceId =
    devId || `dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // 🔥 1) Pahle se existing session check karo
  let session = await Session.findOne({ userId: user._id, deviceId });

  const refreshRaw = signRefreshToken({
    uid: user._id.toString(),
    did: deviceId,
  });
  const refreshHash = Session.hashToken(refreshRaw);

  const expiresAt = new Date(
    Date.now() + parseExpiryToMs(Tokens.refreshExp || "7d")
  );

  if (session) {
    // 🔥 2) Agar session already hai → usko update karo (Naya create mat karo)
    session.refreshTokenHash = refreshHash;
    session.ip = ip || session.ip;
    session.language = deviceInfo?.language || session.language;
    session.os = deviceInfo?.os || session.os;
    session.screen = deviceInfo?.screen || session.screen;
    session.userAgent = deviceInfo?.userAgent || session.userAgent;
    session.expiresAt = expiresAt;
    await session.save();
  } else {
    // 🔥 3) Agar session nahi mila → naya create karo
    session = await Session.create({
      userId: user._id,
      deviceId,
      refreshTokenHash: refreshHash,
      ip,
      language: deviceInfo?.language,
      os: deviceInfo?.os,
      screen: deviceInfo?.screen,
      userAgent: deviceInfo?.userAgent || "",
      expiresAt,
    });
  }

  const accessRaw = signAccessToken({
    uid: user._id.toString(),
    role: user.role,
    did: deviceId,
  });

  return { accessToken: accessRaw, refreshToken: refreshRaw, deviceId };
}


// ---------------- Register ----------------
async function registerManual(req, res, next) {
  try {
    const { name, email, password, deviceId, deviceInfo = {} } = req.body;
    if (!name || !email) throw new BadRequestError("Name and email are required");

    // 1️⃣ Check if user already verified
    const verifiedUser = await User.findOne({ email, isVerified: true });
    if (verifiedUser) {
      throw new ConflictError("Email already registered!");
    }

    // 2️⃣ Generate OTP
    const verificationCode = generateNumOTP(6);
    const verificationExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

    const webToken = jwt.sign(
      { email, verificationCode },
      Tokens.webToken,
      { expiresIn: Tokens.webTokenExp }
    );

    // 3️⃣ Find UNVERIFIED user (if exists)
    let user = await User.findOne({ email, isVerified: false });

    if (!user) {
      // CREATE NEW USER
      user = await User.create({
        name,
        email,
        password,   // yeh plain store na karo — setPassword use karo niche
        isVerified: false,
      });

      // Immediately hash password
      await user.setPassword(password);
      await user.save();

    } else {
      // UPDATE old unverified user fields
      user.name = name;

      if (password) {
        await user.setPassword(password);
      }

      await user.save();
    }

    // Safe user profile (correct location)
    const safeUser = user.safeProfile();



    // 4️⃣ Remove old sessions for this user
    await Session.deleteMany({ userId: user._id });

    const session = await Session.create({
      userId: user._id,
      deviceId: deviceId,
      ip: req.ip,
      emailOTP: verificationCode,
      emailExpiry: new Date(verificationExpiry),
      webToken: webToken,
      language: deviceInfo?.language || "en-US",
      os: deviceInfo?.os || "",
      screen: deviceInfo?.screen || "",
      userAgent: deviceInfo?.userAgent || "",
      expiresAt: new Date(Date.now() + parseExpiryToMs(Tokens.webTokenExp || "15m")),
    });

    // 6️⃣ Send OTP email
    const mailRes = await verifyMail({ username: safeUser.name, email: safeUser?.email, webToken: session.webToken, verificationCode: session.emailOTP });

    if (!mailRes) {
      return errorResponse(res, "Cannot send OTP right now, try again later!", 500);
    }

    return successResponse(
      res,
      "Registered successfully. Please verify your email.",
      {
        user: safeUser,
        sessionId: session._id,
        verificationToken: webToken,
      },
      201
    );

  } catch (err) {
    console.log("Register Error:", err);
    next(err);
  }
}


// ---------------- Verify Mail ----------------
async function verifyAuthMail(req, res, next) {
  try {
    const { email, token, otp } = req.body;

    if (!email) throw new BadRequestError("Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User not found");
    const userId = user._id;

    const session = await Session.findOne({ userId: user._id })
      .sort({ createdAt: -1 });
    if (!session)
      throw new ConflictError("Session not found. Register again.");


    // -------- Verify WEB TOKEN (JWT) --------
    if (token) {
      try {
        const payload = jwt.verify(token, Tokens.webToken);
        if (payload.email !== email)
          throw new UnauthorizedError("Invalid verification token");
      } catch (error) {
        throw new UnauthorizedError("Invalid or expired verification token");
      }
    }


    // -------- OTP Verify --------
    if (otp) {
      if (session.emailOTP !== otp)
        throw new BadRequestError("Invalid OTP");

      if (session?.emailExpiry < Date.now())
        throw new BadRequestError("OTP expired");
    }

    // -------- Mark Verified --------
    user.isVerified = true;
    await user.save();
    await Session.deleteMany({ userId: user._id });
    // Welcome mail
    await accountCreationMail({ username: user.name, email: user.email });
    return successResponse(res, "Email verified successfully");

  } catch (error) {

    next(error);
  }
}



// ---------------- Login ----------------
async function loginManual(req, res, next) {
  try {
    const { email, password, deviceId, deviceInfo = {} } = req.body;
    if (!email || !password) throw new BadRequestError("Email and password required");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new UnauthorizedError("User does not exist");

    const ok = await user.verifyPassword(password);
    if (!ok) throw new UnauthorizedError("Invalid credentials");

    console.log(" fds")

    if (user?.isVerified === false) {
      throw new UnauthorizedError("Please verify your email before logging in.");
    }
    console.log("fdfdf fds")


    const tokens = await createSessionAndTokens(user, deviceId, deviceInfo, req.ip);

    const safeUser = user.safeProfile ? user.safeProfile() : { id: user._id, name: user.name, email: user.email };

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Login successful", { user: safeUser, tokens });
  } catch (err) {
    console.log("RegiLoginster Error:", err);

    next(err);
  }
}

// ---------------- Refresh Token ----------------
async function refreshTokenHandler(req, res, next) {
  try {
    const oldRefresh = req.body?.refreshToken || req?.cookies?.refreshToken;
    if (!oldRefresh) throw new BadRequestError("Refresh token missing");

    let payload;
    try {
      payload = verifyRefreshToken(oldRefresh);
    } catch (e) {
      res.clearCookie("refreshToken");
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const { uid: userId, did: deviceId } = payload;
    if (!userId || !deviceId) {
      res.clearCookie("refreshToken");
      throw new UnauthorizedError("Invalid refresh token payload");
    }

    const hashed = Session.hashToken(oldRefresh);

    const session = await Session.findOne({
      userId: payload.uid,
      deviceId: payload.did,
      refreshTokenHash: hashed,
      revoked: false
    }).sort({ createdAt: -1 }); // latest created session first


    if (!session) {
      // refresh token reuse detected — security breach
      res.clearCookie("refreshToken");

      await Session.deleteMany({ userId }, { revoked: true });

      throw new UnauthorizedError(
        "Refresh token invalid or reused — please login again"
      );
    }

    // rotate refresh token
    const newRefresh = signRefreshToken({ uid: userId, did: deviceId });
    session.refreshTokenHash = Session.hashToken(newRefresh);
    session.lastUsedAt = new Date();
    session.expiresAt = new Date(Date.now() + parseExpiryToMs(process.env.REFRESH_TOKEN_EXPIRY || "7d"));
    await session.save();

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const newAccess = signAccessToken({ uid: userId, role: user.role, did: deviceId });

    // set fresh cookie
    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Token refreshed", {
      accessToken: newAccess,
      user: user
    });
  } catch (err) {
    next(err);
  }
}



// ---------------- Logout ----------------
async function logoutHandler(req, res, next) {
  try {
    const refresh = req.body?.refreshToken || req.cookies?.refreshToken;
    if (!refresh) throw new BadRequestError("Refresh token required");
    console.log("I am refresh", refresh);

    let payload;
    try { payload = verifyRefreshToken(refresh); }
    catch (e) { throw new UnauthorizedError("Invalid refresh token"); }

    const hashed = Session.hashToken(refresh);
    await Session.findOneAndUpdate(
      { userId: payload.uid, deviceId: payload.did, refreshTokenHash: hashed },
      { revoked: true }
    );

    // res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
    return successResponse(res, "Logged out", {});
  } catch (err) {
    next(err);
  }
}

// GET /auth/me
async function getMe(req, res, next) {
  try {
    const userId = req.user?._id; // access token middleware sets req.user

    if (!userId) {
      return res.status(401).json({ message: "Access token invalid" });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // You can filter fields
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerManual,
  loginManual,
  refreshTokenHandler,
  logoutHandler,
  createSessionAndTokens,
  verifyAuthMail,
  getMe
};
