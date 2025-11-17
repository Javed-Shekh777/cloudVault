const { Tokens } = require("../constants");
const JWT = require("jsonwebtoken");
const User = require("../models/userSchema");

const authenticated = async (req, res, next) => {
    try {
        let token;

        // Header token
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // Cookie token
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        console.log("Token", req.cookies?.accessToken);
        console.log(req.headers.authorization);

        if (!token) {
            return res.status(401).json({ success: false, error: "Token not found." });

        }

        // Verify JWT
        let decoded;
        try {
            decoded = JWT.verify(token, Tokens.acessToken);
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid or expired token. Please login again." });

        }

        // Fetch user from DB
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, error: "User does not exist." });

        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ success: false, error: "Authentication failed." });

    }
};

module.exports = authenticated;
