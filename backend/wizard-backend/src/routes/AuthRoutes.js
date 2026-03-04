import express from "express";
import authenticate from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/sync", authenticate, async (req, res) => {
    try {
        const { uid } = req.user;

        let user = await User.findById(uid);

        if (!user) {
            user = await User.create({
            _id: uid
            });

        console.log("Created new user:", uid);
        } else {
            user.lastActive = new Date();
            await user.save();
        }

        return res.status(200).json({
            message: "User synced successfully",
            needsOnboarding: !user.username,
            user: {
                id: user._id,
                username: user.username,
                statistics: user.statistics
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/set-username", authenticate, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.length < 4 || username.length > 16) {
            return res.status(400).json({ message: "Username must be 4–16 characters" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.uid,
            { username },
            { new: true }
        );

        return res.json({
            message: "Username set successfully",
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error setting username" });
    }
});

export default router;