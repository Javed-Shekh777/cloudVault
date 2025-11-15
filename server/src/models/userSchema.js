const mongoose = require('mongoose');
const { SchemaName } = require('../constants');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // hashed
  avatar: { type: String }, // profile pic URL
  role: { type: String, enum: ["user", "admin"], default: "user" },
 profileImage: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'twitter', 'apple', 'microsoft'],
        default: 'local'
    },
    providerId: {
        type: String // unique ID from social provider
    },
    webToken:{type:String},
    accessToken: { type: String },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationExpiry: { type: Date },
}, { timestamps: true });


// Hash password if exists
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, SALT);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!this.password) return false; // for social users with no password
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return JWT.sign({ id: this._id, email: this.email }, Tokens.acessToken, {
        expiresIn: Tokens.accessTokenExpiry
    });
};

userSchema.methods.generateRefreshToken = function () {
    return JWT.sign({ id: this._id }, Tokens.refreshToken, {
        expiresIn: Tokens.refreshTokenExpiry
    });
};



module.exports = mongoose.model(SchemaName.user, userSchema);
