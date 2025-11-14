const mongoose = require('mongoose');
const { SchemaName } = require('../constants');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // hashed
  avatar: { type: String }, // profile pic URL
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

module.exports = mongoose.model(SchemaName.user,userSchema);
