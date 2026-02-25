import express from "express";
import upload from "../config/upload.js";
import ProfilePictureSchema from "../models/ProfilePictureSchema.js";
import User from "../models/UserSchema.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        // TODO: Use Firebase authentication
        const userId = req.body.userId;

        const user = await User.findById(userId).populate("profilePicture");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (
            user.profilePicture &&
            !user.profilePicture.isDefault &&
            user.profilePicture.owner === userId
        ) {
            await cloudinary.uploader.destroy(user.profilePicture.publicId);
            await ProfilePicture.findByIdAndDelete(user.profilePicture._id);
        }

        const newPic = await ProfilePicture.create({
        publicId: req.file.filename,
        url: req.file.path,
        owner: userId
        });

        user.profilePicture = newPic._id;
        await user.save();

        res.json(newPic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/select-default", async (req, res) => {
    // TODO: Use Firebase authentication
    const { userId, profilePictureId } = req.body;

    const pic = await ProfilePicture.findById(profilePictureId);

    if (!pic || !pic.isDefault) {
        return res.status(400).json({ message: "Invalid default picture" });
    }

    await User.findByIdAndUpdate(userId, {
        profilePicture: pic._id
    });

    res.json({ message: "Profile picture updated" });
});

export default router;