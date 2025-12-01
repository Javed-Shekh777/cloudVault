// utils/tokens.js
const jwt = require("jsonwebtoken");
const { Tokens } = require("../constants");
const crypto = require("crypto");

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


function verifyWebToken(token) {
    return jwt.verify(token, Tokens.webToken, { algorithms: ["HS256"] });
}

function signWebToken(payload) {
    return jwt.sign(payload, Tokens.webToken, { algorithm: "HS256", expiresIn: Tokens.webTokenExp });
}

function signLockToken(payload) {
    return jwt.sign(payload, Tokens.lockToken, { algorithm: "HS256", expiresIn: Tokens.lockTokenExp });
}

function verifyLockToken(token) {
    return jwt.verify(token, Tokens.lockToken, { algorithms: ["HS256"] });

}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    signLockToken,
    verifyLockToken,
    signWebToken,
    verifyWebToken
};
