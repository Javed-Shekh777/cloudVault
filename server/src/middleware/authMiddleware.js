const { Tokens } = require("../constants");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const authenticated = async (req, res, next) => {
  try {
    let token;

    // Prefer Authorization header
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // Fallback: cookie
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Token not found." });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, Tokens.accessToken); // ✅ fix typo
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid or expired token. Please login again." });
    }

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User does not exist." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: error.message || "Authentication failed." });
  }
};

module.exports = authenticated;
