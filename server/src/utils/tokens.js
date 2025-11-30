// utils/tokens.js
const jwt = require("jsonwebtoken");
const { Tokens } = require("../constants");

function signAccessToken(payload) {
    // payload should include: { uid, role, did }
    return jwt.sign(payload, Tokens.accessSecret, { algorithm: "HS256", expiresIn: Tokens.accessExp });
}

function verifyAccessToken(token) {
    return jwt.verify(token, Tokens.accessSecret, { algorithms: ["HS256"] });
}

function signRefreshToken(payload) {
    // payload should include: { uid, did }
    return jwt.sign(payload, Tokens.refreshSecret, { algorithm: "HS256", expiresIn: Tokens.refreshExp });
}

function verifyRefreshToken(token) {
    return jwt.verify(token, Tokens.refreshSecret, { algorithms: ["HS256"] });
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
