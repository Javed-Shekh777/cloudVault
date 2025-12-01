const mongoose = require("mongoose");
const { SchemaName } = require("../constants");

const LockedAccessSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaName.user,
        required: true,
        index: true
    },

    unlockType: { type: String, enum: ["pin", "password"], required: true },
    unLockToken: { type: String, required: true, unique: true },
    unlockedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },

    active: { type: Boolean, default: true, index: true }, // important

}, { timestamps: true });

module.exports = mongoose.model(SchemaName.lockedAccessSession, LockedAccessSessionSchema);
