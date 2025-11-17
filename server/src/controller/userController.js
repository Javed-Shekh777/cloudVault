// controllers/userController.js
const { cloudinaryFolderNames } = require("../constants");
const User = require("../models/userSchema");
const { cloudinaryUpload, cloudinaryDelete } = require("../util/cloudinary");

// Update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // from auth middleware
        const { name } = req.body;
        const file = req?.file;
        console.log(file);
        const isExist = await User.findById(userId)


        let cloud;
        if (!isExist) {
            return res.status(404).json({ error: "User not found" });
        }
        if (file) {
            cloud = await cloudinaryUpload(file?.buffer, cloudinaryFolderNames.profiles);

            if (cloud && cloud?.secure_url) {
                await cloudinaryDelete(isExist?.profileImage?.publicId, "image");
            }
            isExist.profileImage.publicId = cloud.public_id;
            isExist.profileImage.url = cloud.secure_url;
        }

        isExist.name = name;
        await isExist.save();
        isExist.password = undefined;

        res.json({ user: isExist });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { updateProfile };
