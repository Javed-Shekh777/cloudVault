const cloudinary = require("cloudinary").v2;
const { cloudinaryUpload, cloudinaryDelete } = require("../utils/cloudinary");
const File = require("../models/fileSchema");
const Folder = require("../models/folderSchema");
const User = require("../models/userSchema");
const LockedSession = require("../models/LockedSession");


const { errorResponse, successResponse } = require("../utils/response");
const { cloudinaryFolderNames } = require("../constants");
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } = require("../errors/AppError");
const { signLockToken } = require("../utils/tokens");

exports.getLockedStatus = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user) return next(new NotFoundError("User not found"));
        return successResponse(res, "Locked folder status fetched", {
            isSetup: user.lockedFolder.isSetup,
            unlockMethod: user.lockedFolder.unlockMethod
        });
    } catch (err) {
        next(err);
    }
};


exports.setLocked = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { unlockMethod, credential } = req.body;

        if (!credential) return next(new BadRequestError("Pin/Password is required"));
        const user = await User.findById(userId);
        if (!user) return next(new NotFoundError("User not found"));
        if (user.lockedFolder.isSetup) return next(new BadRequestError("Locked folder is already set up"));
        await user.setLockedPin(credential, unlockMethod || "pin");
        await user.save();
        console.log(user);

        return successResponse(res, "Locked folder set up successfully", { token: token });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.unlockLocked = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        console.log("Unlocking locked folder for user ", req.headers["x-locked-session"]);
        const sessionId = req.headers["x-locked-session"];

        const { unlockMethod, credential } = req.body;
        if (!credential) return next(new BadRequestError("Credential is required"));


        const user = await User.findById(userId);
        console.log(user);
        if (!user) return next(new NotFoundError("User not found"));
        if (!user.lockedFolder.isSetup) return next(new BadRequestError("Locked folder is not set up"));
        if (user.lockedFolder.unlockMethod !== unlockMethod) {
            return next(new BadRequestError(`Unlock method should be ${user.lockedFolder.unlockMethod}`));
        }

        let isValid = false;
        if (unlockMethod === 'pin') {
            isValid = await user.verifyLockedPin(credential, 'pin');
        } else if (unlockMethod === 'password') {
            isValid = await user.verifyLockedPin(credential, 'password');
        } else {
            return next(new BadRequestError("Unsupported unlock method"));
        }


        if (!isValid) {
            user.lockedFolder.failedAttempts += 1;
            await user.save();
            return next(new UnauthorizedError("Invalid credential"));
        }
        user.lockedFolder.failedAttempts = 0;
        await user.save();
        await LockedSession.deleteMany({
            $or: [
                { userId: user._id, active: true },
                { expiresAt: { $lt: new Date() } }
            ]
        });

        const lockedToken = await signLockToken({ uid: user._id.toString(), type: unlockMethod || "pin" });
        if (!lockedToken) return next(new Error("Could not generate lock token"));

        const session = await LockedSession.create({
            userId: user._id,
            unlockType: unlockMethod || "pin",
            unLockToken: lockedToken,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
            active: false,
        });

        return successResponse(res, "Locked folder unlocked successfully", { lockedToken: lockedToken, lockedSessionId: session?._id });
    } catch (err) {
        next(err);
    }
};


exports.changeLockedCredential = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { oldCredential, newCredential, type } = req.body;

        if (!oldCredential || !newCredential) return next(new BadRequestError("Old and new credentials are required"));

        const user = await User.findById(userId);
        if (!user) return next(new NotFoundError("User not found"));

        if (!user.lockedFolder.isSetup) return next(new BadRequestError("Locked folder is not set up"));

        let isValid = false;
        if (user.lockedFolder.unlockMethod === 'pin') {
            isValid = await user.verifyLockedPin(oldCredential, 'pin');
        }
        else if (user.lockedFolder.unlockMethod === 'password') {
            isValid = await user.verifyLockedPin(oldCredential, 'password');
        }
        if (!isValid) {
            return next(new UnauthorizedError("Invalid old credential"));
        }
        await user.setLockedPin(newCredential, type || user.lockedFolder.unlockMethod);

        return successResponse(res, "Locked folder credential changed successfully", {});
    } catch (err) {
        next(err);
    }
};

exports.getLockedData = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const sessionId = req.headers["x-locked-session"];
        if (!sessionId)
            throw new BadRequestError("Locked session ID is required");

        if (!userId)
            return next(new UnauthorizedError("User not authenticated"));

        const user = await User.findById(userId).select("-password");
        //
        if (!user) return next(new NotFoundError("User not found"));
        if (!user.lockedFolder.isSetup) return next(new BadRequestError("Locked is not set up"));

        const s = await LockedSession.findById(sessionId);
        if (!s || !s.active)
            return res.status(403).json({ msg: "Session inactive" });

        if (s.expiresAt < new Date()) {
            s.active = false;
            await s.save();
            return res.status(403).json({ msg: "Session expired" });
        }
        const folderId = req.query.folder || null;
        const folders = await Folder.find({
            parentFolder: folderId,
            createdBy: userId,
            isLocked: true
        });

        const files = await File.find({
            folder: folderId,
            uploadedBy: userId,
            isLocked: true
        }).sort({ createdAt: -1 });

        return successResponse(res, "Locked data fetched", {
            lockedFiles: files,
            lockedFolders: folders,
        });
    } catch (err) {
        next(err);
    }
};



exports.exitLockedSession = async (req, res, next) => {
    try {
        console.log("Exiting locked session request ", req.headers);

        const session = req.headers["x-locked-lockedtoken"];
        const sessionId = req.headers["x-locked-lockedsessionid"];

        console.log("Exiting locked session ", sessionId, session);

        if (!sessionId)
            return next(new BadRequestError("Locked session ID is required"));

        await LockedSession.findByIdAndDelete(sessionId);

        return successResponse(res, "Locked session ended", {});
    } catch (err) {
        next(err);
    }
};
