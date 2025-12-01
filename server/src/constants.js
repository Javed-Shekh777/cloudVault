const SchemaName = {
    user: "User",
    file: "File",
    folder: "Folder",
    activity: "Activity",
    permission: "Permission",
    trash: "Trash",
    session: "Session",
    shareLink: "ShareLink",
    verificaToken: "VerificationToken",
    lockedAccessSession:"LockedAccessSession"
};


const cloudinaryFolderNames = {
    files: `${process.env.CLOUDINARY_FOLDER_NAME}/files`,
    profiles: `${process.env.CLOUDINARY_FOLDER_NAME}/profiles`,
};

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
}

const SALT = parseInt(process.env.SALT);
const dbUrl = process.env.DB_URL || "";
const dbName = process.env.DATABASE || "";

const MONGODB_URL =
    dbUrl.length <= 30
        ? `${dbUrl}/${dbName}`
        : `${dbUrl}/${dbName}?retryWrites=true&w=majority&appName=AtlasApp`;

const PORT = process.env.PORT;
const allowedOrigins = ["https://cloudvault-sage.vercel.app", process.env.FRONTEND];

const Tokens = {
    accessExp: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    refreshExp: process.env.REFRESH_TOKEN_EXP || "7d",
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    hmacSecret: process.env.SESSION_TOKEN_HMAC_KEY,
    passwordPaper: process.env.PASSWORD_PEPPER,
    webToken: process.env.WEB_TOKEN_SECRET,
    webTokenExp: process.env.WEB_TOKEN_EXPIRY || "15m",
    lockToken: process.env.LOCKED_TOKEN_SECRET  ,
    lockTokenExp: process.env.LOCKED_TOKEN_EXPIRY || "30m",

};


const mailOptions = {
    username: process.env.AUTH_EMAIL,
    userKey: process.env.AUTH_KEY,
    ownerName: process.env.OWNER_NAME,
    ownerEmail: process.env.OWNER_EMAIL
};

module.exports = { SchemaName, SALT, Tokens, MONGODB_URL, PORT, allowedOrigins, mailOptions, cloudinaryFolderNames, cloudinaryConfig };