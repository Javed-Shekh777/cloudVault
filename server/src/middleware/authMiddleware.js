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
        if (!token) {
            return res.status(401).send({ success: false, error: "Token not found.", });
        }

        console.log("Token", req.cookies?.accessToken);
        console.log(req.headers.authorization);

        // Verify JWT
        let decoded;
        try {
            decoded = JWT.verify(token, Tokens.acessToken);
        } catch (err) {
            return errorResponse(res, "Invalid or expired token. Please login again.", 401);
        }

        // Fetch user from DB
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).send({ success: false, error: "User does not exist." });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).send({ success: false, error: error.message || "Authentication failed." });

    }
};

module.exports = authenticated;
