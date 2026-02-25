import express from "express";
import upload from "../middleware/upload.js";
import ProfilePicture from "../models/ProfilePictureSchema.js";
import User from "../models/UserSchema.js";
import cloudinary from "../config/cloudinary.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/upload", authenticate, upload.single("image"), async (req, res) => {
    try {
        const userId = req.user.uid

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

        res.json({
            message: "Profile picture uploaded",
            profilePicture: newPic
        });
        
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
});

router.post("/select-default", authenticate, async (req, res) => {
    try {
        const { profilePictureId } = req.body;
        const userId = req.user.uid;

        const pic = await ProfilePicture.findById(profilePictureId);

        if (!pic || !pic.isDefault) {
            return res.status(400).json({ message: "Invalid default picture" });
        }

        await User.findByIdAndUpdate(userId, {
            profilePicture: pic._id
        });

        res.json({ message: "Profile picture updated" });

    } catch (err) {
        res.status(500).json({message: "Failed to update profile picture"});
    }
});



export default router;