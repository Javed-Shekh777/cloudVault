const SchemaName = {
  user: "User",
  file: "File",
  folder: "Folder",
  activity: "Activity",
  permission: "Permission",
  trash: "Trash",
};


const cloudinaryFolderNames = {
    files: `${process.env.CLOUDINARY_FOLDER_NAME}/files`,
    // videos: `${process.env.CLOUDINARY_FOLDER_NAME}/videos`,
    profiles: `${process.env.CLOUDINARY_FOLDER_NAME}/profiles`,
};

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:true,
}

const SALT = parseInt(process.env.SALT);
const dbUrl = process.env.DB_URL || "";
const dbName = process.env.DATABASE || "";

const MONGODB_URL =
  dbUrl.length <= 30
    ? `${dbUrl}/${dbName}`
    : `${dbUrl}/${dbName}?retryWrites=true&w=majority&appName=AtlasApp`;

const PORT = process.env.PORT;
const allowedOrigins = ["https://cloudvault-sage.vercel.app",process.env.FRONTEND];

const Tokens = {
    acessToken: process.env.ACCESS_TOKEN,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshToken: process.env.REFRESH_TOKEN,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
    webToken: process.env.WEB_TOKEN,
    webTokenExpiry: process.env.WEB_TOKEN_EXPIRY
};

const mailOptions = {
    username: process.env.AUTH_EMAIL,
    userKey: process.env.AUTH_KEY,
    ownerName: process.env.OWNER_NAME,
    ownerEmail: process.env.OWNER_EMAIL
};

module.exports = { SchemaName, SALT, Tokens, MONGODB_URL, PORT, allowedOrigins, mailOptions, cloudinaryFolderNames ,cloudinaryConfig};