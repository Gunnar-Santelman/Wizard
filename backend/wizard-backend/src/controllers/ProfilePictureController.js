import * as ProfilePictureService from "../services/ProfilePictureService.js";

export const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.uid;

        const newPic = await ProfilePictureService.uploadProfilePicture(
            userId,
            req.file
        );

        res.json({
            message: "Profile picture uploaded",
            profilePicture: newPic
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
};


export const selectDefaultProfilePicture = async (req, res) => {
    try {
        const { profilePictureId } = req.body;
        const userId = req.user.uid;

        await ProfilePictureService.selectDefaultProfilePicture(
            userId,
            profilePictureId
        );

        res.json({ message: "Profile picture updated" });

    } catch (err) {
        res.status(500).json({
            message: "Failed to update profile picture"
        });
    }
};

// Only returns URLs
export const getDefaultProfilePictures = async (req, res) => {
    try {
        const pictures = await ProfilePictureService.getDefaultPictureURLs();

        res.status(200).json(pictures);

    } catch (err) {
        console.error("Error retching default profile pictures:", err);
        res.status(500).json({
            message: "Failed to fetch default profile pictures"
        });
    }
};